import { AppDataSource } from "../config/data-source";
import { PurchaseOrderEntity } from "../models/purchase-order.model";
import { SupplierEntity } from "../models/supplier.model";
import { GRNEntryEntity } from "../models/grn-entry.model";
import { MaterialEntity } from "../models/material.model";
import { NotFoundException } from "../utils/error.util";
import { datePart, toSqlDate, withSafeId, num } from "../utils/mapper.util";

const getPORepo = () => AppDataSource.getRepository(PurchaseOrderEntity);
const getSupplierRepo = () => AppDataSource.getRepository(SupplierEntity);
const getGRNRepo = () => AppDataSource.getRepository(GRNEntryEntity);

// Purchase Orders: the frontend may send unitPrice / trackingNumber and only a materialId,
// the table requires unitRate / trackingNo / materialCode.
const PO_DATE_FIELDS = ["poDate", "expectedDeliveryDate", "dispatchDate"] as const;

const toPurchaseOrderEntity = async (data: any): Promise<Partial<PurchaseOrderEntity>> => {
  const { unitPrice, trackingNumber, ...rest } = data;
  const entity: any = { ...rest };
  if (entity.unitRate === undefined && unitPrice !== undefined) entity.unitRate = num(unitPrice);
  if (entity.trackingNo === undefined && trackingNumber !== undefined) entity.trackingNo = trackingNumber;
  for (const field of PO_DATE_FIELDS) {
    if (field in entity) entity[field] = toSqlDate(entity[field]);
  }
  if (!entity.materialCode && entity.materialId) {
    const material = await AppDataSource.getRepository(MaterialEntity).findOne({ where: { id: entity.materialId } });
    if (material) entity.materialCode = material.code;
  }
  return entity;
};

const toPurchaseOrderDto = (po: PurchaseOrderEntity) => ({
  ...po,
  orderedQty: num(po.orderedQty),
  receivedQty: num(po.receivedQty),
  pendingQty: num(po.pendingQty),
  unitRate: num(po.unitRate),
  unitPrice: num(po.unitRate),
  totalAmount: num(po.totalAmount) || num(po.orderedQty) * num(po.unitRate),
  poDate: datePart(po.poDate),
  expectedDeliveryDate: datePart(po.expectedDeliveryDate),
  dispatchDate: datePart(po.dispatchDate) || undefined,
});

export const getAllPurchaseOrders = async (): Promise<any[]> => {
  const pos = await getPORepo().find({ order: { createdAt: "DESC" } });
  return pos.map(toPurchaseOrderDto);
};

export const getPurchaseOrderById = async (id: string): Promise<PurchaseOrderEntity> => {
  const po = await getPORepo().findOne({ where: { id } });
  if (!po) throw new NotFoundException(`Purchase Order with id ${id} not found`);
  return po;
};

export const createPurchaseOrder = async (data: any): Promise<any> => {
  const repo = getPORepo();
  const entity = await toPurchaseOrderEntity(data);
  const po = repo.create({
    ...entity,
    materialCode: entity.materialCode || "",
    unitRate: entity.unitRate ?? 0,
    poDate: entity.poDate || datePart(new Date()),
  });
  return toPurchaseOrderDto(await repo.save(po));
};

export const updatePurchaseOrder = async (id: string, data: any): Promise<any> => {
  const repo = getPORepo();
  const po = await getPurchaseOrderById(id);
  Object.assign(po, await toPurchaseOrderEntity(data));
  return toPurchaseOrderDto(await repo.save(po));
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

// GRN Entries: the frontend uses supplier / date / inspectedBy / notes,
// the table stores supplierName / receivedDate / receivedBy / remarks.
const toGRNEntity = (data: any): Partial<GRNEntryEntity> => {
  const { id, supplier, date, inspectedBy, notes, ...rest } = data;
  const entity: any = withSafeId({ ...rest }, id);
  if (supplier !== undefined) entity.supplierName = supplier;
  if (date !== undefined) entity.receivedDate = toSqlDate(date);
  if (inspectedBy !== undefined) entity.receivedBy = inspectedBy;
  if (notes !== undefined) entity.remarks = notes;
  return entity;
};

const toGRNDto = (grn: GRNEntryEntity) => ({
  ...grn,
  supplier: grn.supplierName,
  date: datePart(grn.receivedDate),
  inspectedBy: grn.receivedBy,
  notes: grn.remarks,
  warehouse: grn.warehouse || "",
  receivedQty: num(grn.receivedQty),
  acceptedQty: num(grn.acceptedQty),
  rejectedQty: num(grn.rejectedQty),
  damagedQty: num(grn.damagedQty),
});

export const getAllGRNEntries = async (): Promise<any[]> => {
  const entries = await getGRNRepo().find({ order: { createdAt: "DESC" } });
  return entries.map(toGRNDto);
};

export const createGRNEntry = async (data: any): Promise<any> => {
  const repo = getGRNRepo();
  const entity = toGRNEntity(data);
  const grn = repo.create({
    ...entity,
    supplierName: entity.supplierName || "",
    receivedBy: entity.receivedBy || "",
    receivedDate: entity.receivedDate || datePart(new Date()),
  });
  return toGRNDto(await repo.save(grn));
};
