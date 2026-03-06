import { NextFunction, Request, Response } from "express";
import { errors } from "../../errors";

const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      throw errors.FileMissing;
    }
  } catch (error) {
    next(error);
  }
};

export const uploadController = {
  uploadFile,
};
