import { AppDataSource } from "../config/data-source";
import { ProductEntity } from "../models/product.model";
import { NotFoundException } from "../utils/error.util";

const getProductRepo = () => AppDataSource.getRepository(ProductEntity);

export const getAllProducts = async (): Promise<any[]> => {
  const products = await getProductRepo().find({ order: { createdAt: "DESC" } });
  return products.map((p) => {
    let bom = [];
    if (p.bomJson) {
      try {
        bom = JSON.parse(p.bomJson);
      } catch (e) {
        bom = [];
      }
    }
    return {
      ...p,
      bom,
    };
  });
};

export const getProductById = async (id: string): Promise<ProductEntity> => {
  const product = await getProductRepo().findOne({ where: { id } });
  if (!product) throw new NotFoundException(`Product with id ${id} not found`);
  return product;
};

export const createProduct = async (data: any): Promise<any> => {
  const repo = getProductRepo();
  if (data.bom && Array.isArray(data.bom)) {
    data.bomJson = JSON.stringify(data.bom);
  }
  const product = repo.create(data as Partial<ProductEntity>);
  const saved: any = await repo.save(product);
  let bom = [];
  if (saved.bomJson) {
    try {
      bom = JSON.parse(saved.bomJson);
    } catch (e) {
      bom = [];
    }
  }
  return {
    ...saved,
    bom: data.bom || bom,
  };
};

export const updateProduct = async (id: string, data: any): Promise<any> => {
  const repo = getProductRepo();
  const product = await getProductById(id);
  if (data.bom && Array.isArray(data.bom)) {
    data.bomJson = JSON.stringify(data.bom);
  }
  Object.assign(product, data);
  const saved: any = await repo.save(product);
  let bom = [];
  if (saved.bomJson) {
    try {
      bom = JSON.parse(saved.bomJson);
    } catch (e) {
      bom = [];
    }
  }
  return {
    ...saved,
    bom: data.bom || bom,
  };
};

export const deleteProduct = async (id: string): Promise<void> => {
  const repo = getProductRepo();
  await getProductById(id);
  await repo.delete(id);
};

