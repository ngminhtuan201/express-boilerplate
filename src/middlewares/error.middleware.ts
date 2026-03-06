import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors";

const isDev = process.env.NODE_ENV === "development";

export const handleResponseError = (
  error: AppError,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(error);

  if (error) {
    if (!isDev) delete error?.stack;
    return res.status(error?.statusCode || 500).send({ error });
  }

  next();
};
