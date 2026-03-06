import { Request, Response } from "express";
import { Profile as GoogleProfile } from "passport-google-oauth20";
import { config } from "../../config";
import { UserOAuthProvider, UserRole } from "../../enums";
import { errors } from "../../errors";
import { verifyRefreshToken } from "../../libs";
import { User, UserModel } from "../../models";
import { AuthToken } from "../../types";
import { getCurrentUser, handleSuccess, objectId } from "../../utils";
import { authHelper } from "./auth.helper";
import { authService } from "./auth.service";
import { ManualLoginDto, ManualRegisterDto, UpdateProfileDto } from "./dtos";

const isProduction = process.env.NODE_ENV === "production";

const REFRESH_TOKEN_COOKIE_NAME = `${config.APP_NAME.toLowerCase()}_refresh_token`;

const setRefreshTokenCookie = (res: Response, refreshToken: AuthToken) => {
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken.token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: refreshToken.expiresAt.getTime() - Date.now(),
  });
};

const handleGoogleCallback = async (req: Request, res: Response) => {
  const googleProfile: GoogleProfile = req.user as GoogleProfile;
  if (!googleProfile) {
    throw errors.Unauthorized;
  }

  let user = await UserModel.findOne({ email: googleProfile.emails[0].value });
  if (!user) {
    const newUser: User = {
      _id: objectId(),
      email: googleProfile.emails[0].value,
      emailVerified: googleProfile.emails[0].verified,
      fullName: googleProfile.displayName,
      avatarUrl: googleProfile.photos[0].value,
      role: UserRole.USER,

      oauthId: googleProfile.id,
      oauthProvider: UserOAuthProvider.GOOGLE,
      oauthAvatarUrl: googleProfile.photos[0].value,
    };

    user = await UserModel.create(newUser);
  }

  if (!user.emailVerified) {
    throw errors.UnverifiedAccount;
  }

  const jwtPayload = authHelper.extractJwtPayloadFromUser(user);
  const { accessToken, refreshToken } =
    authHelper.signResponseTokens(jwtPayload);

  setRefreshTokenCookie(res, refreshToken);

  return handleSuccess(res, { accessToken, user });
};

const manualLogin = async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await authService.login(
    req.body as ManualLoginDto,
  );

  setRefreshTokenCookie(res, refreshToken);

  return handleSuccess(res, { accessToken, user });
};

const manualRegister = async (req: Request, res: Response) => {
  await authService.register(req.body as ManualRegisterDto);
  return handleSuccess(res, null);
};

const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token || typeof token !== "string") {
    throw errors.Unauthorized;
  }

  try {
    const payload = authHelper.verifyVerificationToken(token);
    const user = await UserModel.findById(payload.userId);

    if (!user) {
      throw errors.Unauthorized;
    }

    if (user.emailVerified) {
      return handleSuccess(res, null);
    }

    await UserModel.updateOne(
      { _id: user._id },
      {
        $set: {
          emailVerified: true,
          verificationToken: undefined,
          verificationTokenExpiry: undefined,
        },
      },
    );

    return handleSuccess(res, null);
  } catch (error) {
    throw errors.Unauthorized;
  }
};

const refreshToken = async (req: Request, res: Response) => {
  const refreshTokenCookie = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
  if (!refreshTokenCookie) {
    throw errors.Unauthorized;
  }

  try {
    const payload = verifyRefreshToken(refreshTokenCookie);
    const user = await UserModel.findOne({ _id: objectId(payload.userId) });
    if (!user) {
      throw errors.Unauthorized;
    }

    const jwtPayload = authHelper.extractJwtPayloadFromUser(user);
    const { accessToken, refreshToken } =
      authHelper.signResponseTokens(jwtPayload);

    setRefreshTokenCookie(res, refreshToken);

    return handleSuccess(res, { accessToken });
  } catch (error) {
    throw errors.Unauthorized;
  }
};

const logout = (_req: Request, res: Response) => {
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
  return handleSuccess(res, null);
};

const getMe = (req: Request, res: Response) => {
  return handleSuccess(res, { user: getCurrentUser(req) });
};

const updateProfile = async (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  const dto = req.body as UpdateProfileDto;

  const updatedUser = await UserModel.findByIdAndUpdate(
    currentUser._id,
    { $set: dto },
    { new: true },
  );

  return handleSuccess(res, { user: updatedUser });
};

export const authController = {
  handleGoogleCallback,
  manualLogin,
  manualRegister,
  verifyEmail,
  refreshToken,
  logout,
  getMe,
  updateProfile,
};
