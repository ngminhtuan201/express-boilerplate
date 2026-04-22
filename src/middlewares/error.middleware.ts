import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors";
import { logger } from "../libs";

const isDev = process.env.NODE_ENV === "development";

export const handleResponseError = (
  error: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  logger.error(error);

  if (error) {
    const errorResponse: any = {
      name: error.name || "Error",
      message: error.message || "Something went wrong",
      statusCode: error.statusCode || 500,
    };

    if (isDev && error.stack) {
      errorResponse.stack = error.stack;
    }

    return res.status(errorResponse.statusCode).send({ error: errorResponse });
  }

  return res
    .status(500)
    .send({ error: { message: "Internal Server Error", statusCode: 500 } });
};
