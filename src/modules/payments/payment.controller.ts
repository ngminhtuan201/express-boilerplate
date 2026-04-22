import { NextFunction, Request, Response } from "express";
import { catchAsync, getCurrentUser, handleSuccess } from "../../libs";
import { CheckoutDto } from "./dtos";
import {
  checkout as checkoutService,
  handleSepayWebhook,
  handleStripeWebhook,
} from "./payment.service";

export const checkout = catchAsync(async (req: Request, res: Response) => {
  const session = await checkoutService(
    getCurrentUser(req).id,
    req.body as CheckoutDto,
  );

  return handleSuccess(res, session);
});

export const stripeWebhook = catchAsync(async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string;
  // req.rawBody was attached by express.json middleware in app.ts
  const rawBody = (req as any).rawBody || req.body;
  const result = await handleStripeWebhook(rawBody, signature);

  return handleSuccess(res, { result });
});

export const sepayWebhook = catchAsync(async (req: Request, res: Response) => {
  // prettier-ignore
  const signature = req.body.signature || (req.headers["x-sepay-signature"] as string);
  const result = await handleSepayWebhook(req.body, signature);

  return handleSuccess(res, { result });
});
