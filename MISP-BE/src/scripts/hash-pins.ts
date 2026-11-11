import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import { AppDataSource } from "../config/data-source";
import { User } from "../models";
import { hashPassword, isBcryptHash } from "../utils/password";

// One-off: hash every plain-text PIN left from before PINs were hashed, and list accounts
// that have no usable credential (they relied on the removed universal passwords).
const run = async () => {
  let exitCode = 0;
  try {
    await AppDataSource.initialize();
    const repo = AppDataSource.getRepository(User);
    const users = await repo.find({ where: { isDeleted: false } });

    let hashed = 0;
    const defaultPin: string[] = [];
    const noCredential: string[] = [];

    for (const user of users) {
      if (!user.pin && !user.password) noCredential.push(user.email);
      if (user.pin && !isBcryptHash(user.pin)) {
        if (user.pin === "123456") defaultPin.push(user.email);
        user.pin = await hashPassword(user.pin);
        await repo.save(user);
        hashed++;
      }
    }

    console.log(`Hashed ${hashed} plain-text PIN(s) out of ${users.length} active user(s).`);
    console.log(`Users still on default PIN 123456 (will be asked to change it): ${defaultPin.length}`);
    defaultPin.forEach((e) => console.log(`  - ${e}`));
    console.log(`Users with NO password or PIN (an admin must set a PIN): ${noCredential.length}`);
    noCredential.forEach((e) => console.log(`  - ${e}`));
  } catch (error) {
    console.error("Failed to hash PINs:", error);
    exitCode = 1;
  } finally {
    if (AppDataSource.isInitialized) await AppDataSource.destroy();
    process.exit(exitCode);
  }
};

run();
