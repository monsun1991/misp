import jwt from 'jsonwebtoken';
import config from '../config/auth.config';

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.accessTokenExpiryTime });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, config.jwtSecret);
};
