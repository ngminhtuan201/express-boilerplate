import { PaymentProvider } from "../../enums";
import { IPaymentAdapter } from "./adapters/interface";
import { SepayPaymentAdapter } from "./adapters/sepay.adaper";
import { StripePaymentAdapter } from "./adapters/stripe.adapter";

export class PaymentAdapterFactory {
  private static adapters: Map<string, IPaymentAdapter> = new Map();

  static getAdapter(
    provider: PaymentProvider = PaymentProvider.STRIPE,
  ): IPaymentAdapter {
    if (!this.adapters.has(provider)) {
      switch (provider) {
        case PaymentProvider.STRIPE:
          this.adapters.set(PaymentProvider.STRIPE, new StripePaymentAdapter());
          break;
        case PaymentProvider.SEPAY:
          this.adapters.set(PaymentProvider.SEPAY, new SepayPaymentAdapter());
          break;
        default:
          throw new Error(`Payment provider ${provider} not supported`);
      }
    }

    const adapter = this.adapters.get(provider);
    if (!adapter) {
      throw new Error(`Payment provider ${provider} not supported`);
    }

    return adapter;
  }
}
