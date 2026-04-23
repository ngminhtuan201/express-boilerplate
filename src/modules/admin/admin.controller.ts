import { Request, Response } from "express";
import { catchAsync, handleSuccess } from "../../libs";
import { User, UserModel } from "../../models";

export const getUsers = catchAsync(async (_req: Request, res: Response) => {
  const users = (await UserModel.find().lean().exec()) as User[];
  return handleSuccess(res, { users });
});
