import { PaymentProvider } from "src/enums";
import { CreatePaymentDto } from "../dtos";

export interface PaymentSession {
  provider: PaymentProvider;
  providerRefId: string;
  checkoutUrl?: string;
  /**
   * Raw payment response from provider.
   */
  raw?: unknown;
}

export interface IPaymentAdapter {
  createPaymentSession(
    transactionId: string,
    dto: CreatePaymentDto,
  ): Promise<PaymentSession>;

  handleWebhook(
    payload: unknown,
    headers: Record<string, string | string[] | undefined>,
  ): Promise<{ received: boolean }>;
}
