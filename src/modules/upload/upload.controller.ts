import { Request, Response } from "express";
import { errors } from "../../errors";
import { catchAsync, handleSuccess } from "../../libs";
import * as uploadService from "./upload.service";

export const uploadFile = catchAsync(async (req: Request, res: Response) => {
  const file = req.file;

  if (!file) {
    throw errors.FileMissing;
  }

  const result = await uploadService.uploadFile({ file });
  return handleSuccess(res, { ...result });
});
