import httpStatus from "http-status";

const ERROR_MESSAGE_CODE = {
  Forbidden: "FORBIDDEN",
  Unauthorized: "UNAUTHORIZED",
  BadRequest: "BAD_REQUEST",
  ServiceUnavailable: "SERVICE_UNAVAILABLE",

  EmailTaken: "EMAIL_TAKEN",
  InvalidCredentials: "INVALID_CREDENTIALS",
  TokenExpired: "TOKEN_EXPIRED",
  UnverifiedAccount: "UNVERIFIED_ACCOUNT",
  ValidationFailed: "VALIDATION_FAILED",
  FileMissing: "FILE_MISSING",
  UserNotFound: "USER_NOT_FOUND",
};

export class AppError extends Error {
  statusCode: number;
  messageCode: string;
  message: string;

  constructor(statusCode: number, messageCode: string, message: string) {
    super();
    this.statusCode = statusCode;
    this.messageCode = messageCode;
    this.message = message;

    Error.captureStackTrace(this, this.constructor);
  }
}

const createError = (
  statusCode: number,
  messageCode: string,
  message: string,
) => {
  return new AppError(statusCode, messageCode, message);
};

export const errors = {
  BadRequest: createError(
    httpStatus.BAD_REQUEST,
    ERROR_MESSAGE_CODE.BadRequest,
    "The request is invalid.",
  ),
  Unauthorized: createError(
    httpStatus.UNAUTHORIZED,
    ERROR_MESSAGE_CODE.Unauthorized,
    "The request has not been authenticated.",
  ),
  Forbidden: createError(
    httpStatus.FORBIDDEN,
    ERROR_MESSAGE_CODE.Forbidden,
    "The request is forbidden.",
  ),
  ServiceUnavailable: createError(
    httpStatus.SERVICE_UNAVAILABLE,
    ERROR_MESSAGE_CODE.ServiceUnavailable,
    "The service is unavailable.",
  ),

  TokenExpired: createError(
    httpStatus.BAD_REQUEST,
    ERROR_MESSAGE_CODE.TokenExpired,
    "Session expired. Please login again.",
  ),
  ValidationFailed: (details?: string) =>
    createError(
      httpStatus.BAD_REQUEST,
      ERROR_MESSAGE_CODE.ValidationFailed,
      details || "Fail to validate your request's data.",
    ),
  InvalidCredentials: createError(
    httpStatus.BAD_REQUEST,
    ERROR_MESSAGE_CODE.InvalidCredentials,
    "Invalid credentials.",
  ),
  EmailTaken: createError(
    httpStatus.BAD_REQUEST,
    ERROR_MESSAGE_CODE.EmailTaken,
    "The email has been taken.",
  ),
  UnverifiedAccount: createError(
    httpStatus.BAD_REQUEST,
    ERROR_MESSAGE_CODE.UnverifiedAccount,
    "The account has not been verified.",
  ),
  FileMissing: createError(
    httpStatus.BAD_REQUEST,
    ERROR_MESSAGE_CODE.FileMissing,
    "No file provided",
  ),
  UserNotFound: createError(
    httpStatus.NOT_FOUND,
    ERROR_MESSAGE_CODE.UserNotFound,
    "User not found.",
  ),
};
