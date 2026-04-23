import { NextFunction, Request, RequestHandler, Response } from "express";
import passport from "passport";
import { UserRole } from "../enums";
import { errors } from "../errors";

export const authenticate = (
  allowedRoles?: Array<UserRole>,
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    passport.authenticate(
      "jwt",
      { session: false },
      (error: Error, user: unknown, _info: unknown) => {
        if (error || !user) {
          next(errors.Unauthorized);
          return;
        }

        if (
          allowedRoles &&
          allowedRoles.length &&
          !allowedRoles.includes(user.role)
        ) {
          next(errors.Unauthorized);
          return;
        }

        req.user = user;
        next();
      },
    )(req, res, next);
  };
};
