import config from "../config/auth.config";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { getFromCache, storeIntoCache, deleteFromCache } from "./redis.util";

export const generateToken = (data: any, secret = config.jwtSecret) => {
  const payload = {
    ...data,
    exp: Math.floor(Date.now() / 1000) + config.accessTokenExpiryTime,
  };
  return jwt.sign(payload, secret);
};

export const verifyToken = (token: string) => {
  const tokenResponse: { result: boolean; payload: any } = {
    result: true,
    payload: null,
  };
  try {
    tokenResponse.payload = jwt.verify(token, config.jwtSecret);
  } catch (error) {
    tokenResponse.result = false;
    tokenResponse.payload = error;
  }
  return tokenResponse;
};

export const generateHash = async (text: string): Promise<string> => {
  return bcrypt.hash(text, 10);
};

export const compareHash = async (text: string, hashedText: string): Promise<boolean> => {
  return bcrypt.compare(text, hashedText);
};

export const storeUserTokenInCache = async (tokenId: string, token: string, expiry: number) => {
  await storeIntoCache(tokenId, token, expiry);
};

export const checkUserTokenInCache = async (tokenId: string, token: string) => {
  const userToken = await getFromCache(tokenId);
  return userToken && userToken === token;
};

export const deleteUserTokenFromCache = async (tokenId: string) => {
  return await deleteFromCache(tokenId);
};
