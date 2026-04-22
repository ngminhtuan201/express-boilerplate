import express from "express";
import passport from "passport";
import { authenticate, validateRequestBody } from "../../middlewares";
import {
  getMe,
  handleGoogleCallback,
  logout,
  manualLogin,
  manualRegister,
  refreshToken,
  updateProfile,
  verifyEmail,
} from "./auth.controller";
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
  handleGoogleCallback,
);
authRouter.post("/login", validateRequestBody(manualLoginSchema), manualLogin);
authRouter.post(
  "/register",
  validateRequestBody(manualRegisterSchema),
  manualRegister,
);
authRouter.get("/verify", verifyEmail);
authRouter.post("/refresh-token", refreshToken);
authRouter.get("/me", authenticate(), getMe);
authRouter.put(
  "/me",
  authenticate(),
  validateRequestBody(updateProfileSchema),
  updateProfile,
);
authRouter.post("/logout", logout);
