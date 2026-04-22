import express from "express";
import { authenticate, validateRequestBody } from "../../middlewares";
import { checkoutSchema } from "./dtos";
import { checkout, sepayWebhook, stripeWebhook } from "./payment.controller";

export const paymentRouter = express.Router();

paymentRouter.post(
  "/checkout",
  authenticate(),
  validateRequestBody(checkoutSchema),
  checkout,
);

paymentRouter.post("/webhook/stripe", stripeWebhook);
paymentRouter.post("/webhook/sepay", sepayWebhook);
