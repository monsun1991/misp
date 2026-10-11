import Joi, { Schema, ValidationError } from "joi";
import { NextFunction, Request, Response } from "express";
import { BadRequestException, catchAsync } from "../utils/error.util";

export const bodyValidator = (schema: Schema) =>
  catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const joiSchema = Joi.compile(schema);
      const value = await joiSchema.validateAsync(req.body);
      req.body = value;
    } catch (error) {
      if (error && error instanceof ValidationError) {
        const errorMessage = error.details
          .map((details: any) => details.message)
          .join(", ");
        throw new BadRequestException(errorMessage);
      }
      next(error);
    }
    return next();
  });
