import { IPaymentAdapter } from "./adapters/interface";
import { StripeAdapter } from "./adapters/stripe.adapter";

export class PaymentAdapterFactory {
  private static adapters: Map<string, IPaymentAdapter> = new Map();

  static getAdapter(provider: string = "stripe"): IPaymentAdapter {
    if (!this.adapters.has("stripe")) {
      this.adapters.set("stripe", new StripeAdapter());
    }

    const adapter = this.adapters.get(provider);
    if (!adapter) {
      throw new Error(`Payment provider ${provider} not supported`);
    }

    return adapter;
  }
}
