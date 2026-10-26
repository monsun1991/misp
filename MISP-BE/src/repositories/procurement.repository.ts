import { AppDataSource } from "../config/data-source";
import { PurchaseOrderEntity } from "../models/purchase-order.model";
import { SupplierEntity } from "../models/supplier.model";
import { GRNEntryEntity } from "../models/grn-entry.model";
import { NotFoundException } from "../utils/error.util";

const getPORepo = () => AppDataSource.getRepository(PurchaseOrderEntity);
const getSupplierRepo = () => AppDataSource.getRepository(SupplierEntity);
const getGRNRepo = () => AppDataSource.getRepository(GRNEntryEntity);

// Purchase Orders
export const getAllPurchaseOrders = async (): Promise<PurchaseOrderEntity[]> => {
  return await getPORepo().find({ order: { createdAt: "DESC" } });
};

export const getPurchaseOrderById = async (id: string): Promise<PurchaseOrderEntity> => {
  const po = await getPORepo().findOne({ where: { id } });
  if (!po) throw new NotFoundException(`Purchase Order with id ${id} not found`);
  return po;
};

export const createPurchaseOrder = async (data: Partial<PurchaseOrderEntity>): Promise<PurchaseOrderEntity> => {
  const repo = getPORepo();
  const po = repo.create(data);
  return await repo.save(po);
};

export const updatePurchaseOrder = async (id: string, data: Partial<PurchaseOrderEntity>): Promise<PurchaseOrderEntity> => {
  const repo = getPORepo();
  const po = await getPurchaseOrderById(id);
  Object.assign(po, data);
  return await repo.save(po);
};

export const deletePurchaseOrder = async (id: string): Promise<void> => {
  const repo = getPORepo();
  await getPurchaseOrderById(id);
  await repo.delete(id);
};

// Suppliers
export const getAllSuppliers = async (): Promise<SupplierEntity[]> => {
  return await getSupplierRepo().find({ order: { createdAt: "DESC" } });
};

export const getSupplierById = async (id: string): Promise<SupplierEntity> => {
  const supplier = await getSupplierRepo().findOne({ where: { id } });
  if (!supplier) throw new NotFoundException(`Supplier with id ${id} not found`);
  return supplier;
};

export const createSupplier = async (data: Partial<SupplierEntity>): Promise<SupplierEntity> => {
  const repo = getSupplierRepo();
  const supplier = repo.create(data);
  return await repo.save(supplier);
};

export const updateSupplier = async (id: string, data: Partial<SupplierEntity>): Promise<SupplierEntity> => {
  const repo = getSupplierRepo();
  const supplier = await getSupplierById(id);
  Object.assign(supplier, data);
  return await repo.save(supplier);
};

export const deleteSupplier = async (id: string): Promise<void> => {
  const repo = getSupplierRepo();
  await getSupplierById(id);
  await repo.delete(id);
};

// GRN Entries
export const getAllGRNEntries = async (): Promise<GRNEntryEntity[]> => {
  return await getGRNRepo().find({ order: { createdAt: "DESC" } });
};

export const createGRNEntry = async (data: Partial<GRNEntryEntity>): Promise<GRNEntryEntity> => {
  const repo = getGRNRepo();
  const grn = repo.create(data);
  return await repo.save(grn);
};
