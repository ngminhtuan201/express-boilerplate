import Stripe from "stripe";
import { config } from "../../../config";
import { IPaymentAdapter } from "./interface";

export class StripeAdapter implements IPaymentAdapter {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(config.STRIPE_SECRET_KEY);
  }

  async createPaymentIntent(
    amount: number,
    currency: string = "usd",
    metadata: Record<string, any> = {},
  ) {
    return this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amount in cents
      currency,
      metadata,
    });
  }

  constructEvent(payload: any, signature: string) {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      config.STRIPE_WEBHOOK_SECRET,
    );
  }
}

export const stripeAdapter = new StripeAdapter();
