/// <reference path="./types/express/index.d.ts" />
import { DEFAULT_TIMEZONE } from './config/timezone';
process.env.TZ = DEFAULT_TIMEZONE;

import express, { Application } from "express";
import { createServer } from "http";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import { AppDataSource } from "./config/data-source";
import {
  errorHandler,
  handleUncaughtException,
  handleUnhandledRejection,
} from "./middlewares/error.middleware";
import Router from "./routes";

process.on("uncaughtException", handleUncaughtException);
process.on("unhandledRejection", handleUnhandledRejection);

const app: Application = express();
const httpServer = createServer(app);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "x-api-key",
      "x-client-ip",
    ],
    maxAge: 86400,
  })
);

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(compression());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health Check
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "mips-be",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// API Routes
app.use("/v1", Router);

// 404 Route
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error Handler
app.use(errorHandler);

const PORT = parseInt(process.env.PORT || "4001", 10);

import { seedMipsInitialData } from "./scripts/seed-mips";

AppDataSource.initialize()
  .then(async () => {
    console.log("✅ MySQL Database connected successfully");
    await seedMipsInitialData();
    httpServer.listen(PORT, () => {
      console.log(`🚀 MIPS-BE server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });
