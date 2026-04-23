import Stripe from "stripe";
import { config } from "../../../config";
import { PaymentProvider, TransactionStatus } from "../../../enums";
import { TransactionModel } from "../../../models";
import { CreatePaymentDto } from "../dtos";
import { IPaymentAdapter, PaymentSession } from "./interface";

export class StripePaymentAdapter implements IPaymentAdapter {
  private readonly _stripe: Stripe;

  constructor() {
    this._stripe = new Stripe(config.STRIPE_SECRET_KEY);
  }

  async createPaymentSession(
    transactionId: string,
    dto: CreatePaymentDto,
  ): Promise<PaymentSession> {
    const paymentIntent = await this._stripe.paymentIntents.create({
      amount: Math.round(dto.amount * 100), // Stripe expects amount in cents
      currency: dto.currency,
      metadata: {
        transactionId: transactionId,
      },
    });

    return {
      provider: PaymentProvider.STRIPE,
      providerRefId: paymentIntent.id,
      raw: paymentIntent,
    };
  }

  async handleWebhook(
    payload: string,
    headers: Record<string, string | string[] | undefined>,
  ): Promise<{ received: boolean }> {
    const stripeSignature = headers["stripe-signature"] as string;
    if (stripeSignature !== config.STRIPE_WEBHOOK_SECRET) {
      return { received: false };
    }

    const event = this._stripe.webhooks.constructEvent(
      payload,
      stripeSignature,
      config.STRIPE_WEBHOOK_SECRET,
    );

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const transactionId = paymentIntent.metadata.transactionId;
      if (transactionId) {
        await TransactionModel.findOneAndUpdate(
          { id: transactionId },
          {
            $set: {
              status: TransactionStatus.SUCCESS,
              providerRefId: paymentIntent.id,
            },
          },
          { new: true },
        );
      }
    } else if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object;
      const transactionId = paymentIntent.metadata.transactionId;
      if (transactionId) {
        await TransactionModel.findOneAndUpdate(
          { id: transactionId },
          {
            $set: {
              status: TransactionStatus.FAILED,
              providerRefId: paymentIntent.id,
            },
          },
          { new: true },
        );
      }
    }
    return { received: true };
  }
}
