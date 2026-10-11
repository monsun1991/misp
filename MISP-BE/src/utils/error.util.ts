import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true, stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export class BadRequestException extends ApiError {
  constructor(message = "Bad request") {
    super(httpStatus.BAD_REQUEST, message);
    Object.setPrototypeOf(this, BadRequestException.prototype);
  }
}

export class UnauthorizedException extends ApiError {
  constructor(message: any = "Unauthorized access") {
    const errorMessage = typeof message === "object" && message?.message ? message.message : String(message);
    super(httpStatus.UNAUTHORIZED, errorMessage);
    Object.setPrototypeOf(this, UnauthorizedException.prototype);
  }
}

export class ForbiddenAccessException extends ApiError {
  constructor(message = "Forbidden access") {
    super(httpStatus.FORBIDDEN, message);
    Object.setPrototypeOf(this, ForbiddenAccessException.prototype);
  }
}

export class NotFoundException extends ApiError {
  constructor(message = "Resource not found") {
    super(httpStatus.NOT_FOUND, message);
    Object.setPrototypeOf(this, NotFoundException.prototype);
  }
}

export class ConflictException extends ApiError {
  constructor(message = "Resource already exists") {
    super(httpStatus.CONFLICT, message);
    Object.setPrototypeOf(this, ConflictException.prototype);
  }
}

export class ValidationException extends ApiError {
  constructor(message = "Validation failed") {
    super(httpStatus.UNPROCESSABLE_ENTITY, message);
    Object.setPrototypeOf(this, ValidationException.prototype);
  }
}

export class ServerErrorException extends ApiError {
  constructor(message = "Internal server error") {
    super(httpStatus.INTERNAL_SERVER_ERROR, message);
    Object.setPrototypeOf(this, ServerErrorException.prototype);
  }
}

export const catchAsync =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      next(err);
    });
  };

export const logError = (err: Error, context?: string) => {
  const timestamp = new Date().toISOString();
  const contextMsg = context ? `[${context}]` : "";
  console.error(`${timestamp} ${contextMsg}`, err);
};
