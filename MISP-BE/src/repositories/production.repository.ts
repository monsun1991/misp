import { AppDataSource } from "../config/data-source";
import { KitEntity } from "../models/kit.model";
import { ProductionLogEntity } from "../models/production-log.model";
import { FinishedGoodEntity } from "../models/finished-good.model";
import { FinishedGoodsLedgerEntity } from "../models/finished-goods-ledger.model";
import { NotFoundException } from "../utils/error.util";

const getKitRepo = () => AppDataSource.getRepository(KitEntity);
const getProdLogRepo = () => AppDataSource.getRepository(ProductionLogEntity);
const getFGRepo = () => AppDataSource.getRepository(FinishedGoodEntity);
const getFGLedgerRepo = () => AppDataSource.getRepository(FinishedGoodsLedgerEntity);

// Kits
export const getAllKits = async (): Promise<KitEntity[]> => {
  return await getKitRepo().find({ order: { createdAt: "DESC" } });
};

export const getKitById = async (id: string): Promise<KitEntity> => {
  const kit = await getKitRepo().findOne({ where: { id } });
  if (!kit) throw new NotFoundException(`Kit with id ${id} not found`);
  return kit;
};

export const createKit = async (data: Partial<KitEntity>): Promise<KitEntity> => {
  const repo = getKitRepo();
  const kit = repo.create(data);
  return await repo.save(kit);
};

export const updateKit = async (id: string, data: Partial<KitEntity>): Promise<KitEntity> => {
  const repo = getKitRepo();
  const kit = await getKitById(id);
  Object.assign(kit, data);
  return await repo.save(kit);
};

export const deleteKit = async (id: string): Promise<void> => {
  const repo = getKitRepo();
  await getKitById(id);
  await repo.delete(id);
};

// Production Logs
export const getAllProductionLogs = async (): Promise<ProductionLogEntity[]> => {
  return await getProdLogRepo().find({ order: { createdAt: "DESC" } });
};

export const getProductionLogById = async (id: string): Promise<ProductionLogEntity> => {
  const log = await getProdLogRepo().findOne({ where: { id } });
  if (!log) throw new NotFoundException(`Production Log with id ${id} not found`);
  return log;
};

export const createProductionLog = async (data: Partial<ProductionLogEntity>): Promise<ProductionLogEntity> => {
  const repo = getProdLogRepo();
  const log = repo.create(data);
  return await repo.save(log);
};

export const updateProductionLog = async (id: string, data: Partial<ProductionLogEntity>): Promise<ProductionLogEntity> => {
  const repo = getProdLogRepo();
  const log = await getProductionLogById(id);
  Object.assign(log, data);
  return await repo.save(log);
};

export const deleteProductionLog = async (id: string): Promise<void> => {
  const repo = getProdLogRepo();
  await getProductionLogById(id);
  await repo.delete(id);
};

// Finished Goods
export const getAllFinishedGoods = async (): Promise<FinishedGoodEntity[]> => {
  return await getFGRepo().find({ order: { createdAt: "DESC" } });
};

export const getFinishedGoodById = async (id: string): Promise<FinishedGoodEntity> => {
  const fg = await getFGRepo().findOne({ where: { id } });
  if (!fg) throw new NotFoundException(`Finished Good with id ${id} not found`);
  return fg;
};

export const createFinishedGood = async (data: Partial<FinishedGoodEntity>): Promise<FinishedGoodEntity> => {
  const repo = getFGRepo();
  const fg = repo.create(data);
  return await repo.save(fg);
};

export const updateFinishedGood = async (id: string, data: Partial<FinishedGoodEntity>): Promise<FinishedGoodEntity> => {
  const repo = getFGRepo();
  const fg = await getFinishedGoodById(id);
  Object.assign(fg, data);
  return await repo.save(fg);
};

export const deleteFinishedGood = async (id: string): Promise<void> => {
  const repo = getFGRepo();
  await getFinishedGoodById(id);
  await repo.delete(id);
};

// Finished Goods Ledger
export const getAllFinishedGoodsLedger = async (): Promise<FinishedGoodsLedgerEntity[]> => {
  return await getFGLedgerRepo().find({ order: { createdAt: "DESC" } });
};

export const createFinishedGoodsLedger = async (data: Partial<FinishedGoodsLedgerEntity>): Promise<FinishedGoodsLedgerEntity> => {
  const repo = getFGLedgerRepo();
  const entry = repo.create(data);
  return await repo.save(entry);
};
