import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const formatJoiError = (error: Joi.ValidationError) => {
  return error.details.map((d) => ({
    message: d.message,
    path: d.path.join("."),
  }));
};

export const validateRequestBody = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      return res.status(400).json({ errors: formatJoiError(error) });
    }

    req.body = value;
    next();
  };
};

export const validateRequest = (schemas: {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: { message: string; path: string }[] = [];

    if (schemas.body) {
      const { error, value } = schemas.body.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
        convert: true,
      });
      if (error) errors.push(...formatJoiError(error));
      else req.body = value;
    }

    if (schemas.query) {
      const { error, value } = schemas.query.validate(req.query, {
        abortEarly: false,
        stripUnknown: true,
        convert: true,
      });
      if (error) errors.push(...formatJoiError(error));
      else req.query = value;
    }

    if (schemas.params) {
      const { error, value } = schemas.params.validate(req.params, {
        abortEarly: false,
        stripUnknown: true,
        convert: true,
      });
      if (error) errors.push(...formatJoiError(error));
      else req.params = value;
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    next();
  };
};
