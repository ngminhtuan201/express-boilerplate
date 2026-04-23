import express from "express";
import { authenticate, validateRequestBody } from "../../middlewares";
import { createPaymentSchema } from "./dtos";
import { checkout, handleWebhook } from "./payment.controller";

export const paymentRouter = express.Router();

paymentRouter.post(
  "/checkout/:provider",
  authenticate(),
  validateRequestBody(createPaymentSchema),
  checkout,
);

paymentRouter.post("/webhook/:provider", handleWebhook);
