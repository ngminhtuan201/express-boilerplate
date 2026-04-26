import bcrypt from "bcryptjs";
import {
  signAccessToken,
  signRefreshToken,
  signVerificationToken,
  verifyVerificationToken,
} from "../../libs";
import { JwtPayload } from "../../libs/jwt";
import { User, UserModel } from "../../models";
import { AuthToken } from "../../types";

export const hashPassword = async (password: string): Promise<string> => {
  const rounds = 10;
  const salt = await bcrypt.genSalt(rounds);

  return bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const extractJwtPayloadFromUser = (user: User): JwtPayload => {
  return {
    userId: user.id,
  };
};

const signResponseTokens = (
  jwtPayload: JwtPayload,
): {
  accessToken: AuthToken;
  refreshToken: AuthToken;
} => {
  return {
    accessToken: signAccessToken(jwtPayload),
    refreshToken: signRefreshToken(jwtPayload),
  };
};

const isEmailTaken = async (email: string): Promise<boolean> => {
  return !!(await UserModel.exists({ email: email }));
};

export const authHelper = {
  extractJwtPayloadFromUser,
  hashPassword,
  comparePassword,
  signResponseTokens,
  isEmailTaken,
  signVerificationToken,
  verifyVerificationToken,
};
