import { Request } from "express";
import { User } from "../models";

export const getCurrentUser = (req: Request): User => {
  return req?.user as User;
};
