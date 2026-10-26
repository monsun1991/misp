import { AppDataSource } from "../config/data-source";
import { MaterialEntity } from "../models/material.model";
import { StockLedgerEntity } from "../models/stock-ledger.model";
import { WarehouseEntity } from "../models/warehouse.model";
import { NotFoundException } from "../utils/error.util";

const getMaterialRepo = () => AppDataSource.getRepository(MaterialEntity);
const getStockLedgerRepo = () => AppDataSource.getRepository(StockLedgerEntity);
const getWarehouseRepo = () => AppDataSource.getRepository(WarehouseEntity);

export const getAllMaterials = async (): Promise<MaterialEntity[]> => {
  return await getMaterialRepo().find({ order: { createdAt: "DESC" } });
};

export const getMaterialById = async (id: string): Promise<MaterialEntity> => {
  const material = await getMaterialRepo().findOne({ where: { id } });
  if (!material) throw new NotFoundException(`Material with id ${id} not found`);
  return material;
};

export const createMaterial = async (data: Partial<MaterialEntity>): Promise<MaterialEntity> => {
  const repo = getMaterialRepo();
  const material = repo.create(data);
  return await repo.save(material);
};

export const updateMaterial = async (id: string, data: Partial<MaterialEntity>): Promise<MaterialEntity> => {
  const repo = getMaterialRepo();
  const material = await getMaterialById(id);
  Object.assign(material, data);
  return await repo.save(material);
};

export const deleteMaterial = async (id: string): Promise<void> => {
  const repo = getMaterialRepo();
  await getMaterialById(id);
  await repo.delete(id);
};

// Stock Ledgers
export const getAllStockLedgers = async (): Promise<StockLedgerEntity[]> => {
  return await getStockLedgerRepo().find({ order: { createdAt: "DESC" } });
};

export const createStockLedger = async (data: Partial<StockLedgerEntity>): Promise<StockLedgerEntity> => {
  const repo = getStockLedgerRepo();
  const entry = repo.create(data);
  return await repo.save(entry);
};

// Warehouses
export const getAllWarehouses = async (): Promise<WarehouseEntity[]> => {
  return await getWarehouseRepo().find({ order: { createdAt: "DESC" } });
};

export const getWarehouseById = async (id: string): Promise<WarehouseEntity> => {
  const wh = await getWarehouseRepo().findOne({ where: { id } });
  if (!wh) throw new NotFoundException(`Warehouse with id ${id} not found`);
  return wh;
};

export const createWarehouse = async (data: Partial<WarehouseEntity>): Promise<WarehouseEntity> => {
  const repo = getWarehouseRepo();
  const wh = repo.create(data);
  return await repo.save(wh);
};

export const updateWarehouse = async (id: string, data: Partial<WarehouseEntity>): Promise<WarehouseEntity> => {
  const repo = getWarehouseRepo();
  const wh = await getWarehouseById(id);
  Object.assign(wh, data);
  return await repo.save(wh);
};

export const deleteWarehouse = async (id: string): Promise<void> => {
  const repo = getWarehouseRepo();
  await getWarehouseById(id);
  await repo.delete(id);
};
