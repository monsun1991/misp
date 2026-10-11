import { NextFunction, Request, Response } from "express";
import {
  catchAsync,
  ForbiddenAccessException,
  UnauthorizedException,
} from "../utils/error.util";
import { checkUserTokenInCache, verifyToken } from "../utils/auth.util";
import { AppDataSource } from "../config/data-source";
import { User } from "../models";

export const validateToken = async (
  tokenString?: string,
  roles?: string[]
): Promise<User | undefined> => {
  if (tokenString) {
    const token = tokenString.split(" ")[1];
    if (!token) {
      throw new UnauthorizedException("Invalid token format");
    }

    const tokenResult = verifyToken(token);
    if (!tokenResult.result) {
      throw new UnauthorizedException("Session expired or invalid");
    }

    const tokenId = `${tokenResult.payload.id}-accessToken-${tokenResult.payload.uuid || "session"}`;
    if (process.env.NODE_ENV === "production") {
      const isCached = await checkUserTokenInCache(tokenId, token);
      if (!isCached) {
        throw new UnauthorizedException("Session expired");
      }
    }

    if (Array.isArray(roles) && roles.length > 0 && !roles.includes(tokenResult.payload.role)) {
      throw new ForbiddenAccessException();
    }

    const user = await AppDataSource.getRepository(User).findOne({
      where: {
        id: tokenResult.payload.id,
        isDeleted: false,
        isActive: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException("User not found or inactive");
    }

    return user;
  } else {
    throw new UnauthorizedException("Authentication token required");
  }
};

export const authorizeUser = (roles: string[] = []) => {
  return catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const user = await validateToken(authHeader, roles);

    if (user) {
      req.user = user;
    }
    next();
  });
};
