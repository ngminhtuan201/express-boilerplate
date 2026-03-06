import { Response } from "express";
import httpStatus from "http-status";

export const handleSuccess = (
  res: Response,
  data: unknown,
  statusCode: number = httpStatus.OK,
  message?: string,
) => {
  return res.status(statusCode).send({ success: true, data, message });
};
