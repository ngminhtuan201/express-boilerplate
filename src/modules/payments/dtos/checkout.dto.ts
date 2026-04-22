import Joi from "joi";
import { Currency, PaymentProvider } from "../../../enums";

export type CheckoutDto = {
  amount: number;
  currency: Currency;
  provider: PaymentProvider;
  description?: string;
  metadata?: Record<string, string>;
};

export const checkoutSchema = Joi.object<CheckoutDto>({
  amount: Joi.number().min(0).required(),
  currency: Joi.string()
    .valid(...Object.values(Currency))
    .required(),
  provider: Joi.string()
    .valid(...Object.values(PaymentProvider))
    .required(),
  description: Joi.string().optional(),
  metadata: Joi.object().optional(),
});
