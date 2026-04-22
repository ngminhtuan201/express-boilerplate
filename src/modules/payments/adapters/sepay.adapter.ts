import { SePayPgClient } from "sepay-pg-node";
import { config } from "../../../config";
import { Currency, PaymentProvider } from "../../../enums";
import { IPaymentAdapter, UnifiedPaymentResponse } from "./interface";

export class SepayPaymentAdapter implements IPaymentAdapter {
  private _client: SePayPgClient;

  constructor() {
    this._client = new SePayPgClient({
      env: "sandbox",
      merchant_id: config.SEPAY_MERCHANT_ID,
      secret_key: config.SEPAY_SECRET_KEY,
    });
  }

  async createPaymentIntent(
    amount: number,
    currency: Currency = Currency.VND,
    orderId: string,
  ): Promise<UnifiedPaymentResponse> {
    const fields = this._client.checkout.initOneTimePaymentFields({
      operation: "PURCHASE",
      order_invoice_number: orderId,
      order_amount: amount,
      currency: currency,
      payment_method: "BANK_TRANSFER",
      order_description: "Thanh toán đơn hàng " + orderId,
    });

    return {
      provider: PaymentProvider.SEPAY,
      transactionId: orderId,
      checkoutUrl: this._client.checkout.initCheckoutUrl(),
      checkoutFormData: fields,
    };
  }

  verifyWebhookSignature(payload: any, signature: string | string[]) {
    const expectedSignature = this._client.checkout.signFields(payload);

    if (expectedSignature !== signature) {
      throw new Error("Invalid Sepay signature");
    }

    return payload;
  }
}
