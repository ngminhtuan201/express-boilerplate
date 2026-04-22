import { Request, Response, NextFunction } from "express";
import { paymentService } from "./payment.service";

export const createCheckoutSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req.user as any)?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { amount, currency, provider, description, metadata } = req.body;

    const session = await paymentService.createCheckoutSession(
      userId,
      amount,
      currency,
      provider,
      description,
      metadata
    );

    res.status(200).json(session);
  } catch (error) {
    next(error);
  }
};

export const handleStripeWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const signature = req.headers["stripe-signature"] as string;
    // req.rawBody was attached by express.json middleware in app.ts
    const rawBody = (req as any).rawBody || req.body;
    
    const result = await paymentService.handleStripeWebhook(rawBody, signature);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};

export const handleSepayWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const signature = req.body.signature || req.headers["x-sepay-signature"] as string;
    const result = await paymentService.handleSepayWebhook(req.body, signature);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};
