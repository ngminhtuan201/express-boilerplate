import { Currency, PaymentProvider } from "../../../enums";

export interface UnifiedPaymentResponse {
  provider: PaymentProvider;
  transactionId: string;
  providerRefId?: string;
  checkoutUrl?: string;
  checkoutFormData?: Record<string, any>;
  clientSecret?: string;
}

export interface IPaymentAdapter {
  createPaymentIntent(
    amount: number,
    currency: Currency,
    orderId: string,
    metadata?: Record<string, string>,
  ): Promise<UnifiedPaymentResponse>;

  verifyWebhookSignature(payload: any, signature: string | string[]): any;
}
