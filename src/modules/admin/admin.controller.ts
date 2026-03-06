import { Request, Response } from "express";
import { UserModel } from "../../models";
import { catchAsync, handleSuccess } from "../../utils";
import { errors } from "../../errors";

const getUsers = catchAsync(async (_req: Request, res: Response) => {
  const users = await UserModel.find();
  return handleSuccess(res, { users });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await UserModel.findById(id);

  if (!user) {
    throw errors.UserNotFound;
  }

  return handleSuccess(res, { user });
});

export const adminController = {
  getUsers,
  getUserById,
};
