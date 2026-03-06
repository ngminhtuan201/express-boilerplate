import express from "express";
import passport from "passport";
import { authenticate, validateRequestBody } from "../../middlewares";
import { catchAsync } from "../../utils";
import { authController } from "./auth.controller";
import {
  manualLoginSchema,
  manualRegisterSchema,
  updateProfileSchema,
} from "./dtos";
export const authRouter = express.Router();

authRouter.get(
  "/login/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);
authRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  catchAsync(authController.handleGoogleCallback),
);
authRouter.post(
  "/login",
  validateRequestBody(manualLoginSchema),
  catchAsync(authController.manualLogin),
);
authRouter.post(
  "/register",
  validateRequestBody(manualRegisterSchema),
  catchAsync(authController.manualRegister),
);
authRouter.get("/verify-email", catchAsync(authController.verifyEmail));
authRouter.post("/refresh-token", catchAsync(authController.refreshToken));
authRouter.get("/me", authenticate(), catchAsync(authController.getMe));
authRouter.put(
  "/me",
  authenticate(),
  validateRequestBody(updateProfileSchema),
  catchAsync(authController.updateProfile),
);
authRouter.post("/logout", catchAsync(authController.logout));
