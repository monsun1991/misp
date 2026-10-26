import { IResponseDto, ApiResponse } from "../dto/response.dto";
import * as orderRepo from "../repositories/order.repository";

export class OrderController {
  constructor() {}

  // Customer POs
  public async getCustomerPOs(): Promise<IResponseDto<any>> {
    const pos = await orderRepo.getAllCustomerPOs();
    return new ApiResponse(true, pos, "Customer purchase orders fetched successfully");
  }

  public async createCustomerPO(body: any): Promise<IResponseDto<any>> {
    const po = await orderRepo.createCustomerPO(body);
    return new ApiResponse(true, po, "Customer purchase order created successfully");
  }

  public async updateCustomerPO(id: string, body: any): Promise<IResponseDto<any>> {
    const po = await orderRepo.updateCustomerPO(id, body);
    return new ApiResponse(true, po, "Customer purchase order updated successfully");
  }

  public async deleteCustomerPO(id: string): Promise<IResponseDto<any>> {
    await orderRepo.deleteCustomerPO(id);
    return new ApiResponse(true, null, "Customer purchase order deleted successfully");
  }

  // Customers Directory
  public async getCustomers(): Promise<IResponseDto<any>> {
    const customers = await orderRepo.getAllCustomers();
    return new ApiResponse(true, customers, "Customers fetched successfully");
  }

  public async createCustomer(body: any): Promise<IResponseDto<any>> {
    const customer = await orderRepo.createCustomer(body);
    return new ApiResponse(true, customer, "Customer created successfully");
  }

  public async updateCustomer(id: string, body: any): Promise<IResponseDto<any>> {
    const customer = await orderRepo.updateCustomer(id, body);
    return new ApiResponse(true, customer, "Customer updated successfully");
  }

  public async deleteCustomer(id: string): Promise<IResponseDto<any>> {
    await orderRepo.deleteCustomer(id);
    return new ApiResponse(true, null, "Customer deleted successfully");
  }

  // Outward Dispatches
  public async getOutwardDispatches(): Promise<IResponseDto<any>> {
    const dispatches = await orderRepo.getAllOutwardDispatches();
    return new ApiResponse(true, dispatches, "Outward dispatches fetched successfully");
  }

  public async createOutwardDispatch(body: any): Promise<IResponseDto<any>> {
    const dispatch = await orderRepo.createOutwardDispatch(body);
    return new ApiResponse(true, dispatch, "Outward dispatch created successfully");
  }
}
