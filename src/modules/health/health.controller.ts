import { Request, Response } from "express";
import { handleSuccess } from "../../utils";

export const getHealth = (req: Request, res: Response) => {
  return handleSuccess(res, null, 200, "Server is healthy");
};
