import { AppDataSource } from "../config/data-source";
import { User } from "../models";
import { ILogin } from "../dto/auth.dto";
import { NotFoundException, BadRequestException } from "../utils/error.util";
import { AUTH_ERRORS } from "../constants/error.constants";
import { comparePasswords, compareSecret, hashPassword, isBcryptHash, DEFAULT_PIN } from "../utils/password";
import { generateToken, storeUserTokenInCache } from "../utils/auth.util";
import { v4 as uuidv4 } from "uuid";
import config from "../config/auth.config";
import { UserRole } from "../enums/userRole.enum";

const userRepository = AppDataSource.getRepository(User);

export const loginUser = async (
  payload: ILogin
): Promise<{
  user: User;
  token: string;
  mustChangePin: boolean;
}> => {
  const rawId = (payload.identifier || payload.email || payload.username || payload.phoneNumber || payload.empCode || "").trim();
  const rawCred = (payload.pin || payload.password || "").trim();

  if (!rawId) {
    throw new BadRequestException("Please enter your Email, Phone Number, or User ID");
  }

  if (!rawCred) {
    throw new BadRequestException("Please enter your 6-Digit PIN or Password");
  }

  const cleanPhone = rawId.replace(/[^0-9]/g, "");
  const phoneVariants: string[] = [rawId];
  if (cleanPhone.length >= 10) {
    const p10 = cleanPhone.slice(-10);
    phoneVariants.push(p10);
    phoneVariants.push(`+91 ${p10.slice(0, 5)} ${p10.slice(5)}`);
    phoneVariants.push(`+91${p10}`);
    phoneVariants.push(`+91 ${p10}`);
    phoneVariants.push(`${p10.slice(0, 5)} ${p10.slice(5)}`);
  }

  // Flexible lookup by email, empCode, or phone number
  let user = await userRepository.findOne({
    where: [
      { email: rawId.toLowerCase() },
      { empCode: rawId.toUpperCase() },
      ...phoneVariants.map(p => ({ phoneNumber: p }))
    ]
  });

  if (!user) {
    throw new NotFoundException(AUTH_ERRORS.INVALID_CREDENTIALS);
  }

  if (user.isDeleted) {
    throw new BadRequestException("This account has been deactivated or deleted.");
  }

  if (!user.isActive) {
    throw new BadRequestException("This account is currently inactive.");
  }

  // Validate Credential: the user's own password or PIN only
  const passwordValid = !!rawCred && !!user.password && (await comparePasswords(rawCred, user.password));
  const pinValid = !passwordValid && (await compareSecret(rawCred, user.pin));

  if (!passwordValid && !pinValid) {
    throw new NotFoundException(AUTH_ERRORS.INVALID_CREDENTIALS);
  }

  // Upgrade a legacy plain-text PIN to a hash now that we know it
  if (pinValid && !isBcryptHash(user.pin)) {
    user.pin = await hashPassword(rawCred);
  }

  user.lastLoginAt = new Date();
  await userRepository.save(user);

  const tokenUuid = uuidv4();
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
    fullName: user.fullName,
    uuid: tokenUuid,
  });

  const tokenId = `${user.id}-accessToken-${tokenUuid}`;
  await storeUserTokenInCache(tokenId, token, config.accessTokenExpiryTime);

  return {
    user,
    token,
    // Still signing in with the factory-default PIN: the UI forces a change
    mustChangePin: rawCred === DEFAULT_PIN,
  };
};

export const getUserProfile = async (userId: string): Promise<User> => {
  const user = await userRepository.findOne({
    where: { id: userId, isDeleted: false },
  });

  if (!user) {
    throw new NotFoundException(AUTH_ERRORS.UNAUTHORIZED);
  }

  return user;
};

export const setupInitialAdminUser = async (): Promise<User> => {
  const adminEmail = "admin@gmail.com";
  const defaultPassword = "Password@123";

  let admin = await userRepository.findOne({
    where: { email: adminEmail },
  });

  const hashedPassword = await hashPassword(defaultPassword);

  if (!admin) {
    admin = userRepository.create({
      email: adminEmail,
      password: hashedPassword,
      fullName: "MIPS Admin",
      role: UserRole.SUPERADMIN,
      phoneNumber: "9876543210",
      isActive: true,
      isDeleted: false,
    });
    await userRepository.save(admin);
    console.log(`✅ Created initial user: ${adminEmail} (Role: ${UserRole.SUPERADMIN})`);
  } else {
    admin.password = hashedPassword;
    admin.role = UserRole.SUPERADMIN;
    admin.isActive = true;
    admin.isDeleted = false;
    await userRepository.save(admin);
    console.log(`✅ Updated initial user: ${adminEmail} (Role: ${UserRole.SUPERADMIN})`);
  }

  return admin;
};

export const updateUserPin = async (
  userId: string,
  newPin: string,
  currentPin?: string
): Promise<User> => {
  const user = await userRepository.findOne({
    where: { id: userId, isDeleted: false },
  });

  if (!user) {
    throw new NotFoundException("User not found.");
  }

  if (newPin === DEFAULT_PIN) {
    throw new BadRequestException("Please choose a PIN other than the default 123456.");
  }

  if (currentPin) {
    const isPassValid = !!user.password && (await comparePasswords(currentPin, user.password));
    const isPinValid = await compareSecret(currentPin, user.pin);
    if (!isPassValid && !isPinValid) {
      throw new BadRequestException("Current PIN is incorrect.");
    }
  }

  user.pin = await hashPassword(newPin);
  user.password = await hashPassword(newPin);
  await userRepository.save(user);

  return user;
};
