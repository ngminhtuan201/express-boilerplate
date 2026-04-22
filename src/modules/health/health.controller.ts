import { Request, Response } from "express";
import { handleSuccess } from "../../libs";

export const getHealth = (_req: Request, res: Response) => {
  return handleSuccess(res, null, 200, "Server is healthy");
};
