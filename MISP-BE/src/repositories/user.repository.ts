import { AppDataSource } from "../config/data-source";
import { User } from "../models/user.model";
import { NotFoundException, ConflictException } from "../utils/error.util";
import { hashPassword, DEFAULT_PIN } from "../utils/password";

const getUserRepo = () => AppDataSource.getRepository(User);

export const getAllUsers = async (): Promise<User[]> => {
  return await getUserRepo().find({
    where: { isDeleted: false },
    order: { createdAt: "DESC" },
  });
};

export const getUserById = async (id: string): Promise<User> => {
  const user = await getUserRepo().findOne({ where: { id, isDeleted: false } });
  if (!user) throw new NotFoundException(`User with id ${id} not found`);
  return user;
};

// The frontend sends UBAC overrides as arrays; the table stores them as JSON text
const toUserEntity = (data: any): Partial<User> => {
  const { customPermissions, revokedPermissions, ...rest } = data;
  const entity: any = { ...rest };
  if (Array.isArray(customPermissions)) entity.customPermissionsJson = JSON.stringify(customPermissions);
  if (Array.isArray(revokedPermissions)) entity.revokedPermissionsJson = JSON.stringify(revokedPermissions);
  if (Array.isArray(entity.skills)) entity.skills = entity.skills.join(", ");
  return entity;
};

export const createUser = async (input: Partial<User>): Promise<User> => {
  const repo = getUserRepo();
  const data = toUserEntity(input);
  if (data.email) {
    const existing = await repo.findOne({ where: { email: data.email.toLowerCase() } });
    if (existing) throw new ConflictException(`User with email ${data.email} already exists`);
  }

  const hashedPassword = await hashPassword(data.password || data.pin || DEFAULT_PIN);
  const user = repo.create({
    ...data,
    email: data.email?.toLowerCase(),
    password: hashedPassword,
    pin: await hashPassword(data.pin || DEFAULT_PIN),
    isActive: true,
    isDeleted: false,
  });

  return await repo.save(user);
};

export const updateUser = async (id: string, input: Partial<User>): Promise<User> => {
  const repo = getUserRepo();
  const data = toUserEntity(input);
  const user = await getUserById(id);

  if (data.password) {
    data.password = await hashPassword(data.password);
  }
  if (data.pin) {
    data.pin = await hashPassword(data.pin);
  }
  if (data.email) {
    data.email = data.email.toLowerCase();
  }

  Object.assign(user, data);
  return await repo.save(user);
};

export const deleteUser = async (id: string): Promise<void> => {
  const repo = getUserRepo();
  const user = await getUserById(id);
  user.isDeleted = true;
  user.isActive = false;
  await repo.save(user);
};

