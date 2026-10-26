import { AppDataSource } from "../config/data-source";
import { CustomerPOEntity } from "../models/customer-po.model";
import { CustomerEntity } from "../models/customer.model";
import { OutwardDispatchEntity } from "../models/outward-dispatch.model";
import { NotFoundException } from "../utils/error.util";

const getCustomerPORepo = () => AppDataSource.getRepository(CustomerPOEntity);
const getCustomerRepo = () => AppDataSource.getRepository(CustomerEntity);
const getDispatchRepo = () => AppDataSource.getRepository(OutwardDispatchEntity);

// Customer Purchase Orders
export const getAllCustomerPOs = async (): Promise<CustomerPOEntity[]> => {
  return await getCustomerPORepo().find({ order: { createdAt: "DESC" } });
};

export const getCustomerPOById = async (id: string): Promise<CustomerPOEntity> => {
  const po = await getCustomerPORepo().findOne({ where: { id } });
  if (!po) throw new NotFoundException(`Customer PO with id ${id} not found`);
  return po;
};

export const createCustomerPO = async (data: Partial<CustomerPOEntity>): Promise<CustomerPOEntity> => {
  const repo = getCustomerPORepo();
  const po = repo.create(data);
  return await repo.save(po);
};

export const updateCustomerPO = async (id: string, data: Partial<CustomerPOEntity>): Promise<CustomerPOEntity> => {
  const repo = getCustomerPORepo();
  const po = await getCustomerPOById(id);
  Object.assign(po, data);
  return await repo.save(po);
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

// Outward Dispatches
export const getAllOutwardDispatches = async (): Promise<OutwardDispatchEntity[]> => {
  return await getDispatchRepo().find({ order: { createdAt: "DESC" } });
};

export const createOutwardDispatch = async (data: Partial<OutwardDispatchEntity>): Promise<OutwardDispatchEntity> => {
  const repo = getDispatchRepo();
  const dispatch = repo.create(data);
  return await repo.save(dispatch);
};
