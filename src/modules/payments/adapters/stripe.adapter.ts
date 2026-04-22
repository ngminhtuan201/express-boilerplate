import Stripe from "stripe";
import { config } from "../../../config";
import { Currency, PaymentProvider } from "../../../enums";
import { IPaymentAdapter, UnifiedPaymentResponse } from "./interface";

export class StripePaymentAdapter implements IPaymentAdapter {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(config.STRIPE_SECRET_KEY);
  }

  async createPaymentIntent(
    amount: number,
    currency: Currency = Currency.USD,
    orderId: string,
    metadata: Record<string, string> = {},
  ): Promise<UnifiedPaymentResponse> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amount in cents
      currency,
      metadata: { ...metadata, orderId },
    });

    return {
      provider: PaymentProvider.STRIPE,
      transactionId: orderId,
      providerRefId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
    };
  }

  verifyWebhookSignature(payload: any, signature: string | string[]) {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature as string,
      config.STRIPE_WEBHOOK_SECRET,
    );
  }
}
