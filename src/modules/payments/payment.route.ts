import express from "express";
import { authenticate } from "../../middlewares";
import { catchAsync } from "../../utils";
import { paymentController } from "./payment.controller";

const router = express.Router();

router.post(
  "/create-intent",
  authenticate(),
  catchAsync(paymentController.createPaymentIntent),
);

router.post(
  "/webhook/:provider",
  express.raw({ type: "application/json" }),
  catchAsync(paymentController.handleWebhook),
);

export const paymentRouter = router;
