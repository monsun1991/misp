import { AppDataSource } from "../config/data-source";
import { MaterialEntity } from "../models/material.model";
import { StockLedgerEntity } from "../models/stock-ledger.model";
import { WarehouseEntity } from "../models/warehouse.model";
import { NotFoundException } from "../utils/error.util";
import { dateTimeLabel, withSafeId } from "../utils/mapper.util";

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

// Stock Ledgers: the frontend uses inQty / outQty / balanceQty / referenceNo / notes / user,
// the table stores a signed quantity (negative = out) / balanceAfter / referenceNumber / remarks / employeeName.
const toStockLedgerEntity = (data: any): Partial<StockLedgerEntity> => {
  const { id, inQty, outQty, balanceQty, referenceNo, notes, user, date, ...rest } = data;
  const entity: any = withSafeId({ ...rest }, id);
  if (inQty !== undefined || outQty !== undefined) {
    entity.quantity = (Number(inQty) || 0) - (Number(outQty) || 0);
  }
  if (balanceQty !== undefined) entity.balanceAfter = Number(balanceQty) || 0;
  if (referenceNo !== undefined) entity.referenceNumber = referenceNo;
  if (notes !== undefined) entity.remarks = notes;
  if (user !== undefined) entity.employeeName = user;
  return entity;
};

const toStockLedgerDto = (entry: StockLedgerEntity) => {
  const quantity = Number(entry.quantity) || 0;
  return {
    ...entry,
    date: dateTimeLabel(entry.createdAt),
    inQty: quantity > 0 ? quantity : 0,
    outQty: quantity < 0 ? Math.abs(quantity) : 0,
    balanceQty: Number(entry.balanceAfter) || 0,
    referenceNo: entry.referenceNumber || "",
    notes: entry.remarks,
    user: entry.employeeName || "",
    warehouse: entry.warehouse || "",
    unitCost: entry.unitCost != null ? Number(entry.unitCost) : undefined,
  };
};

export const getAllStockLedgers = async (): Promise<any[]> => {
  const entries = await getStockLedgerRepo().find({ order: { createdAt: "DESC" } });
  return entries.map(toStockLedgerDto);
};

export const createStockLedger = async (data: any): Promise<any> => {
  const repo = getStockLedgerRepo();
  const entity = toStockLedgerEntity(data);
  const entry = repo.create({
    ...entity,
    quantity: entity.quantity ?? 0,
    balanceAfter: entity.balanceAfter ?? 0,
  });
  return toStockLedgerDto(await repo.save(entry));
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

