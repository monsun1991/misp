import { AppDataSource } from "../config/data-source";
import { User } from "../models/user.model";
import { NotFoundException, ConflictException } from "../utils/error.util";
import bcrypt from "bcrypt";

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

export const createUser = async (data: Partial<User>): Promise<User> => {
  const repo = getUserRepo();
  if (data.email) {
    const existing = await repo.findOne({ where: { email: data.email.toLowerCase() } });
    if (existing) throw new ConflictException(`User with email ${data.email} already exists`);
  }

  const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : await bcrypt.hash("123456", 10);
  const user = repo.create({
    ...data,
    email: data.email?.toLowerCase(),
    password: hashedPassword,
    pin: data.pin || "123456",
    isActive: true,
    isDeleted: false,
  });

  return await repo.save(user);
};

export const updateUser = async (id: string, data: Partial<User>): Promise<User> => {
  const repo = getUserRepo();
  const user = await getUserById(id);

  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
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
