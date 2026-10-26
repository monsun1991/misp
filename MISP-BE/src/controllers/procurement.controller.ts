import { IResponseDto, ApiResponse } from "../dto/response.dto";
import * as procurementRepo from "../repositories/procurement.repository";

export class ProcurementController {
  constructor() {}

  // Purchase Orders
  public async getPurchaseOrders(): Promise<IResponseDto<any>> {
    const pos = await procurementRepo.getAllPurchaseOrders();
    return new ApiResponse(true, pos, "Purchase orders fetched successfully");
  }

  public async createPurchaseOrder(body: any): Promise<IResponseDto<any>> {
    const po = await procurementRepo.createPurchaseOrder(body);
    return new ApiResponse(true, po, "Purchase order created successfully");
  }

  public async updatePurchaseOrder(id: string, body: any): Promise<IResponseDto<any>> {
    const po = await procurementRepo.updatePurchaseOrder(id, body);
    return new ApiResponse(true, po, "Purchase order updated successfully");
  }

  public async deletePurchaseOrder(id: string): Promise<IResponseDto<any>> {
    await procurementRepo.deletePurchaseOrder(id);
    return new ApiResponse(true, null, "Purchase order deleted successfully");
  }

  // Suppliers
  public async getSuppliers(): Promise<IResponseDto<any>> {
    const suppliers = await procurementRepo.getAllSuppliers();
    return new ApiResponse(true, suppliers, "Suppliers fetched successfully");
  }

  public async createSupplier(body: any): Promise<IResponseDto<any>> {
    const supplier = await procurementRepo.createSupplier(body);
    return new ApiResponse(true, supplier, "Supplier created successfully");
  }

  public async updateSupplier(id: string, body: any): Promise<IResponseDto<any>> {
    const supplier = await procurementRepo.updateSupplier(id, body);
    return new ApiResponse(true, supplier, "Supplier updated successfully");
  }

  public async deleteSupplier(id: string): Promise<IResponseDto<any>> {
    await procurementRepo.deleteSupplier(id);
    return new ApiResponse(true, null, "Supplier deleted successfully");
  }

  // GRN Entries
  public async getGRNEntries(): Promise<IResponseDto<any>> {
    const entries = await procurementRepo.getAllGRNEntries();
    return new ApiResponse(true, entries, "GRN entries fetched successfully");
  }

  public async createGRNEntry(body: any): Promise<IResponseDto<any>> {
    const entry = await procurementRepo.createGRNEntry(body);
    return new ApiResponse(true, entry, "GRN entry created successfully");
  }
}
