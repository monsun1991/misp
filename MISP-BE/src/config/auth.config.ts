import dotenv from "dotenv";
dotenv.config();

// A known fallback secret lets anyone forge tokens, so production must provide its own
if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET must be set in production");
}

const config = {
  jwtSecret: process.env.JWT_SECRET || "mips_dev_only_jwt_secret",
  accessTokenExpiryTime: Number(process.env.ACCESS_TOKEN_EXPIRY_TIME || 24 * 60 * 60), // 24 hours
  refreshTokenExpiryTime: Number(process.env.REFRESH_TOKEN_EXPIRY_TIME || 7 * 24 * 60 * 60), // 7 days
};

export default config;
