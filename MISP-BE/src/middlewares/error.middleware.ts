import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/error.util";
import { errorResponse } from "../utils/response";

const convertToApiError = (err: any): ApiError => {
  if (err instanceof ApiError) {
    return err;
  }

  if (err.name === "QueryFailedError") {
    if (err.code === "ER_DUP_ENTRY") {
      return new ApiError(409, "Duplicate entry. Record already exists");
    }
    return new ApiError(400, `Database error: ${err.message}`);
  }

  if (err.name === "JsonWebTokenError") {
    return new ApiError(401, "Invalid token");
  }

  if (err.name === "TokenExpiredError") {
    return new ApiError(401, "Token expired");
  }

  if (err instanceof Error && err.message) {
    const statusCode = (err as any).statusCode || 400;
    return new ApiError(statusCode, err.message, true);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  return new ApiError(statusCode, message, false);
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const apiError = convertToApiError(err);

  if (process.env.NODE_ENV !== "production") {
    console.error(`🚨 [${req.method}] ${req.path} - ${apiError.message}`);
  }

  let message = apiError.message;
  if (!apiError.isOperational && process.env.NODE_ENV === "production") {
    message = "Internal server error";
  }

  return res.status(apiError.statusCode).json(errorResponse(message));
};

export const handleUncaughtException = (error: Error) => {
  console.error("💥 UNCAUGHT EXCEPTION! Shutting down...", error);
  process.exit(1);
};

export const handleUnhandledRejection = (reason: any) => {
  console.error("💥 UNHANDLED REJECTION! Shutting down...", reason);
  process.exit(1);
};
