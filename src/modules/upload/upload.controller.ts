import { NextFunction, Request, Response } from "express";
import { errors } from "../../errors";
import { catchAsync } from "../../libs";

export const uploadFile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw errors.FileMissing;
      }
    } catch (error) {
      next(error);
    }
  },
);
