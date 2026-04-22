import { Currency, PaymentProvider, TransactionStatus, TransactionType } from "../../enums";
import { TransactionModel } from "../../models/transaction.model";
import { PaymentAdapterFactory } from "./payment.helper";

export class PaymentService {
  async createCheckoutSession(
    userId: string,
    amount: number,
    currency: Currency,
    provider: PaymentProvider,
    description?: string,
    metadata?: Record<string, string>
  ) {
    const transaction = await TransactionModel.create({
      userId,
      type: TransactionType.PURCHASE,
      amount,
      currency,
      status: TransactionStatus.PENDING,
      provider,
      description,
      metadata,
    });

    const adapter = PaymentAdapterFactory.getAdapter(provider);

    const paymentResponse = await adapter.createPaymentIntent(
      amount,
      currency,
      transaction._id.toString(),
      metadata
    );

    if (paymentResponse.providerRefId) {
      transaction.providerRefId = paymentResponse.providerRefId;
      await transaction.save();
    }

    return paymentResponse;
  }

  async handleStripeWebhook(payload: any, signature: string) {
    const adapter = PaymentAdapterFactory.getAdapter(PaymentProvider.STRIPE);
    try {
      const event = adapter.verifyWebhookSignature(payload, signature);
      
      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const transactionId = paymentIntent.metadata.orderId;
        
        if (transactionId) {
          await TransactionModel.findByIdAndUpdate(transactionId, {
            status: TransactionStatus.SUCCESS,
            providerRefId: paymentIntent.id
          });
        }
      } else if (event.type === 'payment_intent.payment_failed') {
         const paymentIntent = event.data.object;
         const transactionId = paymentIntent.metadata.orderId;
         if (transactionId) {
           await TransactionModel.findByIdAndUpdate(transactionId, {
             status: TransactionStatus.FAILED
           });
         }
      }
      return { received: true };
    } catch (err: any) {
      throw new Error(`Stripe Webhook Error: ${err.message}`);
    }
  }

  async handleSepayWebhook(payload: any, signature: string) {
    const adapter = PaymentAdapterFactory.getAdapter(PaymentProvider.SEPAY);
    try {
      const verifiedPayload = adapter.verifyWebhookSignature(payload, signature);
      
      const transactionId = verifiedPayload.order_invoice_number;
      if (transactionId) {
        await TransactionModel.findByIdAndUpdate(transactionId, {
          status: TransactionStatus.SUCCESS,
        });
      }
      
      return { received: true };
    } catch (err: any) {
      throw new Error(`Sepay Webhook Error: ${err.message}`);
    }
  }
}

export const paymentService = new PaymentService();
