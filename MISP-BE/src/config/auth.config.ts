import dotenv from "dotenv";
dotenv.config();

const config = {
  jwtSecret: process.env.JWT_SECRET || "mips_super_secret_jwt_key_2026",
  accessTokenExpiryTime: Number(process.env.ACCESS_TOKEN_EXPIRY_TIME || 24 * 60 * 60), // 24 hours
  refreshTokenExpiryTime: Number(process.env.REFRESH_TOKEN_EXPIRY_TIME || 7 * 24 * 60 * 60), // 7 days
};

export default config;
