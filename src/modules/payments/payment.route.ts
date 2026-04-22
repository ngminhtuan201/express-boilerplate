import express from "express";
import { authenticate, validateRequestBody } from "../../middlewares";
import {
  createCheckoutSession,
  handleSepayWebhook,
  handleStripeWebhook,
} from "./payment.controller";
import { createCheckoutSchema } from "./dtos";

export const paymentRouter = express.Router();

paymentRouter.post(
  "/checkout",
  authenticate(),
  validateRequestBody(createCheckoutSchema),
  createCheckoutSession,
);

paymentRouter.post("/webhook/stripe", handleStripeWebhook);
paymentRouter.post("/webhook/sepay", handleSepayWebhook);
