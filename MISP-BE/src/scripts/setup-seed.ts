import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import { AppDataSource } from "../config/data-source";
import { setupInitialAdminUser } from "../repositories/auth.repository";

const runSeed = async () => {
  let exitCode = 0;
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("✅ Database connection initialized");
    }

    console.log("⚡ Creating initial SuperAdmin user (admin@gmail.com)...");
    const adminUser = await setupInitialAdminUser();
    console.log("✅ Initial user successfully set up:");
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Role: ${adminUser.role}`);
    console.log(`   Default Password: Password@123`);

    console.log("\n🎉 Setup & seed completed successfully!");
  } catch (error) {
    console.error("❌ Failed to run setup and sync seed:", error);
    exitCode = 1;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    process.exit(exitCode);
  }
};

void runSeed();
