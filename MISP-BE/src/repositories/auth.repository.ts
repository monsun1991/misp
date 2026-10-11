import { AppDataSource } from "../config/data-source";
import { User } from "../models";
import { ILogin } from "../dto/auth.dto";
import { NotFoundException, BadRequestException } from "../utils/error.util";
import { AUTH_ERRORS } from "../constants/error.constants";
import { comparePasswords, hashPassword } from "../utils/password";
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
}> => {
  const user = await userRepository.findOne({
    where: { email: payload.email.trim().toLowerCase() },
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

  const isValidPassword = await comparePasswords(payload.password, user.password);
  if (!isValidPassword) {
    throw new NotFoundException(AUTH_ERRORS.INVALID_CREDENTIALS);
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
