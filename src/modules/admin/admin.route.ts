import express from "express";
import { UserRole } from "../../enums";
import { authenticate } from "../../middlewares";
import { adminController } from "./admin.controller";

const adminRoles: Array<UserRole> = [UserRole.ADMIN];

export const adminRouter = express.Router();

adminRouter.get("/users", authenticate(adminRoles), adminController.getUsers);

adminRouter.get(
  "/users/:id",
  authenticate(adminRoles),
  adminController.getUserById,
);
