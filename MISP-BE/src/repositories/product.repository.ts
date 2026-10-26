import { AppDataSource } from "../config/data-source";
import { ProductEntity } from "../models/product.model";
import { NotFoundException } from "../utils/error.util";

const getProductRepo = () => AppDataSource.getRepository(ProductEntity);

export const getAllProducts = async (): Promise<ProductEntity[]> => {
  return await getProductRepo().find({ order: { createdAt: "DESC" } });
};

export const getProductById = async (id: string): Promise<ProductEntity> => {
  const product = await getProductRepo().findOne({ where: { id } });
  if (!product) throw new NotFoundException(`Product with id ${id} not found`);
  return product;
};

export const createProduct = async (data: Partial<ProductEntity>): Promise<ProductEntity> => {
  const repo = getProductRepo();
  const product = repo.create(data);
  return await repo.save(product);
};

export const updateProduct = async (id: string, data: Partial<ProductEntity>): Promise<ProductEntity> => {
  const repo = getProductRepo();
  const product = await getProductById(id);
  Object.assign(product, data);
  return await repo.save(product);
};

export const deleteProduct = async (id: string): Promise<void> => {
  const repo = getProductRepo();
  await getProductById(id);
  await repo.delete(id);
};

