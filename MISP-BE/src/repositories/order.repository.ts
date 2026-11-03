import { AppDataSource } from "../config/data-source";
import { CustomerPOEntity } from "../models/customer-po.model";
import { CustomerEntity } from "../models/customer.model";
import { OutwardDispatchEntity } from "../models/outward-dispatch.model";
import { NotFoundException } from "../utils/error.util";
import { parseJsonArray, datePart, toSqlDate, num } from "../utils/mapper.util";

const getCustomerPORepo = () => AppDataSource.getRepository(CustomerPOEntity);
const getCustomerRepo = () => AppDataSource.getRepository(CustomerEntity);
const getDispatchRepo = () => AppDataSource.getRepository(OutwardDispatchEntity);

// Customer Purchase Orders: line items live in the itemsJson text column.
const toCustomerPOEntity = (data: any): Partial<CustomerPOEntity> => {
  const { items, ...rest } = data;
  const entity: any = { ...rest };
  if (Array.isArray(items)) entity.itemsJson = JSON.stringify(items);
  if ("poDate" in entity) entity.poDate = toSqlDate(entity.poDate);
  if ("expectedDispatchDate" in entity) entity.expectedDispatchDate = toSqlDate(entity.expectedDispatchDate);
  return entity;
};

const toCustomerPODto = (po: CustomerPOEntity) => ({
  ...po,
  poDate: datePart(po.poDate),
  expectedDispatchDate: datePart(po.expectedDispatchDate),
  totalAmount: num(po.totalAmount),
  totalOrderedQty: num(po.totalOrderedQty),
  totalDispatchedQty: num(po.totalDispatchedQty),
  totalPendingQty: num(po.totalPendingQty),
  items: parseJsonArray(po.itemsJson).map((item: any) => ({
    ...item,
    orderedQty: num(item.orderedQty),
    dispatchedQty: num(item.dispatchedQty),
    pendingQty: num(item.pendingQty),
    unitPrice: num(item.unitPrice),
  })),
});

export const getAllCustomerPOs = async (): Promise<any[]> => {
  const pos = await getCustomerPORepo().find({ order: { createdAt: "DESC" } });
  return pos.map(toCustomerPODto);
};

export const getCustomerPOById = async (id: string): Promise<CustomerPOEntity> => {
  const po = await getCustomerPORepo().findOne({ where: { id } });
  if (!po) throw new NotFoundException(`Customer PO with id ${id} not found`);
  return po;
};

export const createCustomerPO = async (data: any): Promise<any> => {
  const repo = getCustomerPORepo();
  const entity = toCustomerPOEntity(data);
  const po = repo.create({ ...entity, poDate: entity.poDate || datePart(new Date()) });
  return toCustomerPODto(await repo.save(po));
};

export const updateCustomerPO = async (id: string, data: any): Promise<any> => {
  const repo = getCustomerPORepo();
  const po = await getCustomerPOById(id);
  Object.assign(po, toCustomerPOEntity(data));
  return toCustomerPODto(await repo.save(po));
};

export const deleteCustomerPO = async (id: string): Promise<void> => {
  const repo = getCustomerPORepo();
  await getCustomerPOById(id);
  await repo.delete(id);
};

// Customers Directory
export const getAllCustomers = async (): Promise<CustomerEntity[]> => {
  return await getCustomerRepo().find({ order: { createdAt: "DESC" } });
};

export const getCustomerById = async (id: string): Promise<CustomerEntity> => {
  const customer = await getCustomerRepo().findOne({ where: { id } });
  if (!customer) throw new NotFoundException(`Customer with id ${id} not found`);
  return customer;
};

export const createCustomer = async (data: Partial<CustomerEntity>): Promise<CustomerEntity> => {
  const repo = getCustomerRepo();
  const customer = repo.create(data);
  return await repo.save(customer);
};

export const updateCustomer = async (id: string, data: Partial<CustomerEntity>): Promise<CustomerEntity> => {
  const repo = getCustomerRepo();
  const customer = await getCustomerById(id);
  Object.assign(customer, data);
  return await repo.save(customer);
};

export const deleteCustomer = async (id: string): Promise<void> => {
  const repo = getCustomerRepo();
  await getCustomerById(id);
  await repo.delete(id);
};

// Outward Dispatches: the frontend reads vehicleNo / ewayBillNo / totalUnits / totalValue,
// the table stores vehicleNumber / ewayBillNumber / totalDispatchedUnits and itemsJson.
const toDispatchEntity = (data: any): Partial<OutwardDispatchEntity> => {
  const { items, vehicleNo, ewayBillNo, totalUnits, totalValue, ...rest } = data;
  const entity: any = { ...rest };
  if (Array.isArray(items)) entity.itemsJson = JSON.stringify(items);
  if (entity.vehicleNumber === undefined && vehicleNo !== undefined) entity.vehicleNumber = vehicleNo;
  if (entity.ewayBillNumber === undefined && ewayBillNo !== undefined) entity.ewayBillNumber = ewayBillNo;
  if (entity.totalDispatchedUnits === undefined && totalUnits !== undefined) entity.totalDispatchedUnits = num(totalUnits);
  if ("dispatchDate" in entity) entity.dispatchDate = toSqlDate(entity.dispatchDate);
  return entity;
};

const toDispatchDto = (dispatch: OutwardDispatchEntity) => {
  const items = parseJsonArray(dispatch.itemsJson).map((item: any) => ({
    ...item,
    qty: num(item.qty),
    unitPrice: num(item.unitPrice),
  }));
  return {
    ...dispatch,
    dispatchDate: datePart(dispatch.dispatchDate),
    vehicleNo: dispatch.vehicleNumber || "",
    ewayBillNo: dispatch.ewayBillNumber || "",
    totalDispatchedUnits: num(dispatch.totalDispatchedUnits),
    totalUnits: num(dispatch.totalDispatchedUnits),
    totalValue: items.reduce((sum: number, item: any) => sum + item.qty * item.unitPrice, 0),
    dispatchedBy: dispatch.dispatchedBy || "",
    items,
  };
};

export const getAllOutwardDispatches = async (): Promise<any[]> => {
  const dispatches = await getDispatchRepo().find({ order: { createdAt: "DESC" } });
  return dispatches.map(toDispatchDto);
};

export const createOutwardDispatch = async (data: any): Promise<any> => {
  const repo = getDispatchRepo();
  const entity = toDispatchEntity(data);
  const dispatch = repo.create({ ...entity, dispatchDate: entity.dispatchDate || datePart(new Date()) });
  return toDispatchDto(await repo.save(dispatch));
};
