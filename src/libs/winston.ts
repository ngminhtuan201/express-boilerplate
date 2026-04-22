import { createLogger, format, transports } from "winston";

const enumerateErrorFormat = format((info) => {
  if (info instanceof Error) {
    Object.assign(info, {
      message: info.stack,
    });
  }
  return info;
});

const isDev = process.env.NODE_ENV === "development";
const isTest = process.env.NODE_ENV === "test";

export const logger = createLogger({
  level: isDev ? "debug" : "info",
  silent: isTest,
  format: format.combine(
    enumerateErrorFormat(),
    format.timestamp(),
    format.uncolorize(),
    format.splat(),
    format.printf(
      ({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`,
    ),
  ),
  transports: [
    new transports.Console({
      stderrLevels: ["error"],
    }),
  ],
});
