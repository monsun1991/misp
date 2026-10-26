import { IResponseDto, ApiResponse } from "../dto/response.dto";
import * as materialRepo from "../repositories/material.repository";

export class MaterialController {
  constructor() {}

  public async getMaterials(): Promise<IResponseDto<any>> {
    const materials = await materialRepo.getAllMaterials();
    return new ApiResponse(true, materials, "Materials fetched successfully");
  }

  public async createMaterial(body: any): Promise<IResponseDto<any>> {
    const material = await materialRepo.createMaterial(body);
    return new ApiResponse(true, material, "Material created successfully");
  }

  public async updateMaterial(id: string, body: any): Promise<IResponseDto<any>> {
    const material = await materialRepo.updateMaterial(id, body);
    return new ApiResponse(true, material, "Material updated successfully");
  }

  public async deleteMaterial(id: string): Promise<IResponseDto<any>> {
    await materialRepo.deleteMaterial(id);
    return new ApiResponse(true, null, "Material deleted successfully");
  }

  // Stock Ledgers
  public async getStockLedgers(): Promise<IResponseDto<any>> {
    const ledgers = await materialRepo.getAllStockLedgers();
    return new ApiResponse(true, ledgers, "Stock ledgers fetched successfully");
  }

  public async createStockLedger(body: any): Promise<IResponseDto<any>> {
    const entry = await materialRepo.createStockLedger(body);
    return new ApiResponse(true, entry, "Stock ledger entry created successfully");
  }

  // Warehouses
  public async getWarehouses(): Promise<IResponseDto<any>> {
    const warehouses = await materialRepo.getAllWarehouses();
    return new ApiResponse(true, warehouses, "Warehouses fetched successfully");
  }

  public async createWarehouse(body: any): Promise<IResponseDto<any>> {
    const wh = await materialRepo.createWarehouse(body);
    return new ApiResponse(true, wh, "Warehouse created successfully");
  }

  public async updateWarehouse(id: string, body: any): Promise<IResponseDto<any>> {
    const wh = await materialRepo.updateWarehouse(id, body);
    return new ApiResponse(true, wh, "Warehouse updated successfully");
  }

  public async deleteWarehouse(id: string): Promise<IResponseDto<any>> {
    await materialRepo.deleteWarehouse(id);
    return new ApiResponse(true, null, "Warehouse deleted successfully");
  }
}
