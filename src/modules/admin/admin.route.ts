import express from "express";
import { UserRole } from "../../enums";
import { authenticate } from "../../middlewares";
import { getUsers } from "./admin.controller";

const adminRoles: Array<UserRole> = [UserRole.ADMIN];

export const adminRouter = express.Router();

adminRouter.get("/users", authenticate(adminRoles), getUsers);
