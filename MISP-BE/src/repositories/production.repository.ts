import { AppDataSource } from "../config/data-source";
import { KitEntity } from "../models/kit.model";
import { ProductionLogEntity } from "../models/production-log.model";
import { FinishedGoodEntity } from "../models/finished-good.model";
import { FinishedGoodsLedgerEntity } from "../models/finished-goods-ledger.model";
import { NotFoundException } from "../utils/error.util";
import { parseJsonArray, datePart, dateTimeLabel, toSqlDate, withSafeId, num } from "../utils/mapper.util";

const getKitRepo = () => AppDataSource.getRepository(KitEntity);
const getProdLogRepo = () => AppDataSource.getRepository(ProductionLogEntity);
const getFGRepo = () => AppDataSource.getRepository(FinishedGoodEntity);
const getFGLedgerRepo = () => AppDataSource.getRepository(FinishedGoodsLedgerEntity);

// Kits: the frontend uses plannedBatchQty / assignedEmployee / supervisor / items,
// the table stores plannedQty / workerName / supervisorName / itemsJson.
const toKitEntity = (data: any): Partial<KitEntity> => {
  const { plannedBatchQty, assignedEmployee, supervisor, items, createdDate, ...rest } = data;
  const entity: any = { ...rest };
  if (plannedBatchQty !== undefined) entity.plannedQty = Number(plannedBatchQty) || 0;
  if (assignedEmployee !== undefined) entity.workerName = assignedEmployee;
  if (supervisor !== undefined) entity.supervisorName = supervisor;
  if (Array.isArray(items)) entity.itemsJson = JSON.stringify(items);
  return entity;
};

const toKitDto = (kit: KitEntity) => ({
  ...kit,
  plannedBatchQty: Number(kit.plannedQty) || 0,
  assignedEmployee: kit.workerName,
  supervisor: kit.supervisorName || "",
  department: kit.department || "",
  createdDate: datePart(kit.createdAt),
  items: parseJsonArray(kit.itemsJson),
});

export const getAllKits = async (): Promise<any[]> => {
  const kits = await getKitRepo().find({ order: { createdAt: "DESC" } });
  return kits.map(toKitDto);
};

export const getKitById = async (id: string): Promise<KitEntity> => {
  const kit = await getKitRepo().findOne({ where: { id } });
  if (!kit) throw new NotFoundException(`Kit with id ${id} not found`);
  return kit;
};

export const createKit = async (data: any): Promise<any> => {
  const repo = getKitRepo();
  const entity = toKitEntity(data);
  const kit = repo.create({
    ...entity,
    plannedQty: entity.plannedQty ?? 0,
    workerName: entity.workerName || "",
  });
  return toKitDto(await repo.save(kit));
};

export const updateKit = async (id: string, data: any): Promise<any> => {
  const repo = getKitRepo();
  const kit = await getKitById(id);
  Object.assign(kit, toKitEntity(data));
  return toKitDto(await repo.save(kit));
};

export const deleteKit = async (id: string): Promise<void> => {
  const repo = getKitRepo();
  await getKitById(id);
  await repo.delete(id);
};

// Production Logs: the frontend uses actualQty / rejectedQty / operator / date,
// the table stores goodQty / scrapQty / operatorName / entryDate.
const toProdLogEntity = (data: any): Partial<ProductionLogEntity> => {
  const { actualQty, rejectedQty, operator, date, ...rest } = data;
  const entity: any = { ...rest };
  if (actualQty !== undefined) entity.goodQty = Number(actualQty) || 0;
  if (rejectedQty !== undefined) entity.scrapQty = Number(rejectedQty) || 0;
  if (operator !== undefined) entity.operatorName = operator;
  if (date !== undefined) entity.entryDate = date;
  return entity;
};

const toProdLogDto = (log: ProductionLogEntity) => ({
  ...log,
  date: log.entryDate || datePart(log.createdAt),
  operator: log.operatorName,
  supervisor: log.supervisor || "",
  actualQty: Number(log.goodQty) || 0,
  rejectedQty: Number(log.scrapQty) || 0,
  targetQty: Number(log.targetQty) || 0,
  wastageQty: Number(log.wastageQty) || 0,
  workingHours: Number(log.workingHours) || 8,
  unitsPerHour: Number(log.unitsPerHour) || 0,
  productivityPct: Number(log.productivityPct) || 0,
});

export const getAllProductionLogs = async (): Promise<any[]> => {
  const logs = await getProdLogRepo().find({ order: { createdAt: "DESC" } });
  return logs.map(toProdLogDto);
};

export const getProductionLogById = async (id: string): Promise<ProductionLogEntity> => {
  const log = await getProdLogRepo().findOne({ where: { id } });
  if (!log) throw new NotFoundException(`Production Log with id ${id} not found`);
  return log;
};

export const createProductionLog = async (data: any): Promise<any> => {
  const repo = getProdLogRepo();
  const entity = toProdLogEntity(data);
  const log = repo.create({
    ...entity,
    kitNumber: entity.kitNumber || "",
    productCode: entity.productCode || "",
    stage: entity.stage || "Assembly",
    operatorName: entity.operatorName || "",
    goodQty: entity.goodQty ?? 0,
  });
  return toProdLogDto(await repo.save(log));
};

export const updateProductionLog = async (id: string, data: any): Promise<any> => {
  const repo = getProdLogRepo();
  const log = await getProductionLogById(id);
  Object.assign(log, toProdLogEntity(data));
  return toProdLogDto(await repo.save(log));
};

export const deleteProductionLog = async (id: string): Promise<void> => {
  const repo = getProdLogRepo();
  await getProductionLogById(id);
  await repo.delete(id);
};

// Finished Goods: the frontend uses quantityOnHand / allocatedQty / availableQty / status,
// the table stores currentStock / allocatedStock / availableStock / qaStatus.
const toFinishedGoodEntity = (data: any): Partial<FinishedGoodEntity> => {
  const { quantityOnHand, allocatedQty, availableQty, status, productionDate, ...rest } = data;
  const entity: any = { ...rest };
  if (quantityOnHand !== undefined) entity.currentStock = num(quantityOnHand);
  if (allocatedQty !== undefined) entity.allocatedStock = num(allocatedQty);
  if (availableQty !== undefined) entity.availableStock = num(availableQty);
  if (status !== undefined) entity.qaStatus = status;
  if (productionDate !== undefined) entity.productionDate = toSqlDate(productionDate);
  return entity;
};

const toFinishedGoodDto = (fg: FinishedGoodEntity) => ({
  ...fg,
  quantityOnHand: num(fg.currentStock),
  allocatedQty: num(fg.allocatedStock),
  availableQty: num(fg.availableStock),
  rejectionsQty: num(fg.rejectionsQty),
  standardCost: num(fg.standardCost),
  sellingPrice: num(fg.sellingPrice),
  status: fg.qaStatus,
  productionDate: datePart(fg.productionDate),
});

export const getAllFinishedGoods = async (): Promise<any[]> => {
  const items = await getFGRepo().find({ order: { createdAt: "DESC" } });
  return items.map(toFinishedGoodDto);
};

export const getFinishedGoodById = async (id: string): Promise<FinishedGoodEntity> => {
  const fg = await getFGRepo().findOne({ where: { id } });
  if (!fg) throw new NotFoundException(`Finished Good with id ${id} not found`);
  return fg;
};

export const createFinishedGood = async (data: any): Promise<any> => {
  const repo = getFGRepo();
  const entity = toFinishedGoodEntity(data);
  const fg = repo.create({
    ...entity,
    productCode: entity.productCode || "",
    productName: entity.productName || "",
    category: entity.category || "",
    batchLotNumber: entity.batchLotNumber || "",
    productionDate: entity.productionDate || datePart(new Date()),
  });
  return toFinishedGoodDto(await repo.save(fg));
};

export const updateFinishedGood = async (id: string, data: any): Promise<any> => {
  const repo = getFGRepo();
  const fg = await getFinishedGoodById(id);
  Object.assign(fg, toFinishedGoodEntity(data));
  return toFinishedGoodDto(await repo.save(fg));
};

export const deleteFinishedGood = async (id: string): Promise<void> => {
  const repo = getFGRepo();
  await getFinishedGoodById(id);
  await repo.delete(id);
};

// Finished Goods Ledger
const toFGLedgerDto = (entry: FinishedGoodsLedgerEntity) => ({
  ...entry,
  date: dateTimeLabel(entry.createdAt),
  inQty: num(entry.inQty),
  outQty: num(entry.outQty),
  balanceQty: num(entry.balanceQty),
});

export const getAllFinishedGoodsLedger = async (): Promise<any[]> => {
  const entries = await getFGLedgerRepo().find({ order: { createdAt: "DESC" } });
  return entries.map(toFGLedgerDto);
};

export const createFinishedGoodsLedger = async (data: any): Promise<any> => {
  const repo = getFGLedgerRepo();
  const { id, date, ...rest } = data;
  const entry = repo.create(withSafeId({ ...rest, user: rest.user || "" }, id) as Partial<FinishedGoodsLedgerEntity>);
  return toFGLedgerDto(await repo.save(entry));
};
