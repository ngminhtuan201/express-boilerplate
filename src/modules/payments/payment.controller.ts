import { Request, Response } from "express";
import httpStatus from "http-status";
import { handleSuccess } from "../../utils";
import { errors } from "../../errors";
import { TransactionModel, TransactionStatus, User } from "../../models";
import { PaymentAdapterFactory } from "./payment.adapter.factory";

const createPaymentIntent = async (req: Request, res: Response) => {
  const { amount, currency = "usd", metadata, provider = "stripe" } = req.body;
  const user = req.user as User;
  if (!user) {
    throw errors.Unauthorized;
  }
  const userId = user._id;

  if (!amount) {
    throw errors.BadRequest;
  }

  const adapter = PaymentAdapterFactory.getAdapter(provider);
  const paymentIntent = await adapter.createPaymentIntent(amount, currency, {
    ...metadata,
    userId: userId.toString(),
  });

  const transaction = await TransactionModel.create({
    userId,
    amount,
    currency,
    status: TransactionStatus.PENDING,
    stripePaymentIntentId: paymentIntent.id, // TODO: Refactor this field name to be generic
    metadata: { ...metadata, userId, provider },
  });

  return handleSuccess(
    res,
    {
      clientSecret: paymentIntent.client_secret,
      transactionId: transaction.id,
    },
    httpStatus.CREATED,
  );
};

const handleWebhook = async (req: Request, res: Response) => {
  const { provider } = req.params;
  const sig = req.headers["stripe-signature"]; // TODO: Make this generic based on provider

  if (!provider) {
    throw errors.BadRequest;
  }

  let event;
  const adapter = PaymentAdapterFactory.getAdapter(provider);

  try {
    // Adapter should handle verification details internally or we pass headers
    event = adapter.constructEvent(req.body, sig as string);
  } catch (err) {
    console.error(`Webhook signature verification failed.`, err.message);
    return res
      .status(httpStatus.BAD_REQUEST)
      .send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  // Note: This switch case is still very Stripe specific.
  // In a real generic implementation, the adapter should probably return a standardized event
  // or handle the status update itself. For now, keeping it simple as we only have Stripe.
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntentSucceeded = event.data.object;
      await TransactionModel.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntentSucceeded.id },
        { status: TransactionStatus.COMPLETED },
      );
      break;
    case "payment_intent.payment_failed":
      const paymentIntentFailed = event.data.object;
      await TransactionModel.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntentFailed.id },
        { status: TransactionStatus.FAILED },
      );
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  return handleSuccess(res, null);
};

export const paymentController = {
  createPaymentIntent,
  handleWebhook,
};
