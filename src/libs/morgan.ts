import { Request, Response } from "express";
import morgan from "morgan";
import { logger } from "./winston";

const isProduction = process.env.NODE_ENV === "production";

morgan.token("message", (_req: Request, res: Response) => {
  return res.locals.errorMessage || "no message";
});

morgan.token("requestId", (req: Request) => {
  return (req.headers["x-request-id"] as string) || "no-id";
});

const getIpFormat = (): string => (isProduction ? ":remote-addr - " : "");
const successResponseFormat = `✅ [request] [:requestId] ${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `❌ [request] [:requestId] ${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

export const morganRequestSuccessHandler = morgan(successResponseFormat, {
  skip: (_req: Request, res: Response) => res.statusCode >= 400,
  stream: { write: (message: string) => logger.info(message.trim()) },
});

export const morganRequestFailedHandler = morgan(errorResponseFormat, {
  skip: (_req: Request, res: Response) => res.statusCode < 400,
  stream: { write: (message: string) => logger.error(message.trim()) },
});
