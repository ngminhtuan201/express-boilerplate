import jsonwebtoken from "jsonwebtoken";
import { config } from "../config";
import { AuthToken } from "../types";

export interface JwtPayload {
  userId: string;
}

const minutesToMilliseconds = (minutes: number): number => minutes * 60 * 1000;

const baseSignOptions = (): jsonwebtoken.SignOptions => ({
  // issuer: config.JWT_ISSUER,
  jwtid: `jwtid_${Date.now()}`,
});

export const signAccessToken = (payload: JwtPayload): AuthToken => {
  return {
    token: jsonwebtoken.sign(payload, config.JWT_ACCESS_TOKEN_SECRET, {
      ...baseSignOptions(),
      expiresIn: minutesToMilliseconds(config.JWT_ACCESS_TOKEN_EXPIRY_MINUTES),
    }),
    expiresAt: new Date(
      Date.now() +
        minutesToMilliseconds(config.JWT_ACCESS_TOKEN_EXPIRY_MINUTES),
    ),
  };
};

export const signRefreshToken = (payload: JwtPayload): AuthToken => {
  return {
    token: jsonwebtoken.sign(payload, config.JWT_REFRESH_TOKEN_SECRET, {
      ...baseSignOptions(),
      expiresIn: minutesToMilliseconds(config.JWT_REFRESH_TOKEN_EXPIRY_MINUTES),
    }),
    expiresAt: new Date(
      Date.now() +
        minutesToMilliseconds(config.JWT_REFRESH_TOKEN_EXPIRY_MINUTES),
    ),
  };
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jsonwebtoken.verify(
    token,
    config.JWT_REFRESH_TOKEN_SECRET,
  ) as JwtPayload;
};

export const signVerificationToken = (payload: JwtPayload): string => {
  return jsonwebtoken.sign(payload, config.JWT_ACCESS_TOKEN_SECRET, {
    ...baseSignOptions(),
    expiresIn: "24h", // Verification token valid for 24 hours
  });
};

export const verifyVerificationToken = (token: string): JwtPayload => {
  return jsonwebtoken.verify(
    token,
    config.JWT_ACCESS_TOKEN_SECRET,
  ) as JwtPayload;
};
