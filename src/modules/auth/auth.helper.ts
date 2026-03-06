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

const hashPassword = (password: string): string => {
  const rounds = 10;
  const salt = bcrypt.genSaltSync(rounds);

  return bcrypt.hashSync(password, salt);
};

const comparePassword = (password: string, hashedPassword: string): boolean => {
  return bcrypt.compareSync(password, hashedPassword);
};

const extractJwtPayloadFromUser = (user: User): JwtPayload => {
  return {
    userId: String(user._id),
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
