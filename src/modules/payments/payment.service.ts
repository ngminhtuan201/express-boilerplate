import {
  PaymentProvider,
  TransactionStatus,
  TransactionType,
} from "../../enums";
import { documentId } from "../../libs";
import { Transaction, TransactionModel } from "../../models";
import { CheckoutDto } from "./dtos";
import { PaymentAdapterFactory } from "./payment.helper";

export const checkout = async (userId: string, dto: CheckoutDto) => {
  const { amount, currency, provider, description, metadata } = dto;

  try {
    const paymentAdapter = PaymentAdapterFactory.getAdapter(provider);
    const transactionId = documentId();
    const paymentResponse = await paymentAdapter.createPaymentIntent(
      amount,
      currency,
      transactionId,
      metadata,
    );

    if (paymentResponse.providerRefId) {
      const newTransaction: Transaction = {
        id: documentId(),
        userId,
        type: TransactionType.PURCHASE,
        amount,
        currency,
        status: TransactionStatus.PENDING,
        provider,
        providerRefId: paymentResponse.providerRefId,
        description,
        metadata,
      };

      await TransactionModel.create(newTransaction);
    }

    return paymentResponse;
  } catch (err: any) {
    throw new Error(`Checkout Error: ${err.message}`);
  }
};

export const handleStripeWebhook = async (payload: any, signature: string) => {
  const stripeAdapter = PaymentAdapterFactory.getAdapter(
    PaymentProvider.STRIPE,
  );

  try {
    const event = stripeAdapter.verifyWebhookSignature(payload, signature);

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const transactionId = paymentIntent.metadata.orderId;
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
      const transactionId = paymentIntent.metadata.orderId;
      if (transactionId) {
        await TransactionModel.findOneAndUpdate(
          { id: transactionId },
          { $set: { status: TransactionStatus.FAILED } },
          { new: true },
        );
      }
    }

    return { received: true };
  } catch (err: any) {
    throw new Error(`Stripe Webhook Error: ${err.message}`);
  }
};

export const handleSepayWebhook = async (
  payload: any,
  signature: string,
): Promise<{ received: boolean }> => {
  const sepayAdapter = PaymentAdapterFactory.getAdapter(PaymentProvider.SEPAY);

  try {
    const verifiedPayload = sepayAdapter.verifyWebhookSignature(
      payload,
      signature,
    );

    const transactionId = verifiedPayload.order_invoice_number;
    if (transactionId) {
      await TransactionModel.findOneAndUpdate(
        { id: transactionId },
        { $set: { status: TransactionStatus.SUCCESS } },
        { new: true },
      );
    }

    return { received: true };
  } catch (err: any) {
    throw new Error(`Sepay Webhook Error: ${err.message}`);
  }
};
