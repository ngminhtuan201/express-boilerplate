import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const validateRequestBody = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      // TODO: Make error more readable
      return res.status(400).json({
        errors: error.details.map((d) => ({
          message: d.message,
          path: d.path.join("."),
        })),
      });
    }

    req.body = value;
    next();
  };
};
