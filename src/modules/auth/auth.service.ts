import { config } from "../../config";
import { UserRole } from "../../enums";
import { errors } from "../../errors";
import { signVerificationToken } from "../../libs";
import { User, UserModel } from "../../models";
import { AuthToken } from "../../types";
import { objectId } from "../../utils";
import { authHelper } from "./auth.helper";
import { ManualLoginDto, ManualRegisterDto } from "./dtos";

const login = async (
  loginDto: ManualLoginDto,
): Promise<{ user: User; accessToken: AuthToken; refreshToken: AuthToken }> => {
  const { email, password } = loginDto;
  const user = await UserModel.findOne({
    email: email,
  });

  if (
    !user ||
    user.oauthProvider ||
    !user?.hashedPassword ||
    !authHelper.comparePassword(password, user.hashedPassword)
  ) {
    throw errors.InvalidCredentials;
  }

  if (!user.emailVerified) {
    throw errors.UnverifiedAccount;
  }

  const jwtPayload = authHelper.extractJwtPayloadFromUser(user);
  const { accessToken, refreshToken } =
    authHelper.signResponseTokens(jwtPayload);

  return {
    user,
    accessToken,
    refreshToken,
  };
};

const register = async (registerDto: ManualRegisterDto): Promise<boolean> => {
  const { email, password, fullName } = registerDto;
  const isEmailTaken = await authHelper.isEmailTaken(email);
  if (isEmailTaken) {
    throw errors.EmailTaken;
  }

  const newUserId = objectId();
  const verificationToken = signVerificationToken({
    userId: newUserId.toString(),
  });

  const newUser: User = {
    _id: objectId(),
    email: email.trim().toLowerCase(),
    emailVerified: false,
    fullName: fullName,
    role: UserRole.USER,
    hashedPassword: authHelper.hashPassword(password),
    verificationToken: verificationToken,
    verificationTokenExpiry: new Date(Date.now() + 15 * 60 * 1000),
  };

  await UserModel.create(newUser);

  return true;
};

export const authService = {
  login,
  register,
};
