import { Request, Response } from "express";
import { PaymentProvider } from "../../enums";
import { catchAsync, getCurrentUser, handleSuccess } from "../../libs";
import { CreatePaymentDto } from "./dtos";
import * as paymentService from "./payment.service";

export const checkout = catchAsync(async (req: Request, res: Response) => {
  const provider = req.params.provider as PaymentProvider;
  const session = await paymentService.createPaymentSession(
    getCurrentUser(req).id,
    provider,
    req.body as CreatePaymentDto,
  );

  return handleSuccess(res, { session });
});

export const handleWebhook = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentService.handleWebhook(
    req.params.provider as PaymentProvider,
    req.body,
    req.headers,
  );

  return handleSuccess(res, result);
});
