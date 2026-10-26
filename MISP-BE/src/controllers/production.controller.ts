import { IResponseDto, ApiResponse } from "../dto/response.dto";
import * as productionRepo from "../repositories/production.repository";

export class ProductionController {
  constructor() {}

  // Kits
  public async getKits(): Promise<IResponseDto<any>> {
    const kits = await productionRepo.getAllKits();
    return new ApiResponse(true, kits, "Kits fetched successfully");
  }

  public async createKit(body: any): Promise<IResponseDto<any>> {
    const kit = await productionRepo.createKit(body);
    return new ApiResponse(true, kit, "Kit created successfully");
  }

  public async updateKit(id: string, body: any): Promise<IResponseDto<any>> {
    const kit = await productionRepo.updateKit(id, body);
    return new ApiResponse(true, kit, "Kit updated successfully");
  }

  public async deleteKit(id: string): Promise<IResponseDto<any>> {
    await productionRepo.deleteKit(id);
    return new ApiResponse(true, null, "Kit deleted successfully");
  }

  // Production Logs
  public async getProductionLogs(): Promise<IResponseDto<any>> {
    const logs = await productionRepo.getAllProductionLogs();
    return new ApiResponse(true, logs, "Production logs fetched successfully");
  }

  public async createProductionLog(body: any): Promise<IResponseDto<any>> {
    const log = await productionRepo.createProductionLog(body);
    return new ApiResponse(true, log, "Production log created successfully");
  }

  public async updateProductionLog(id: string, body: any): Promise<IResponseDto<any>> {
    const log = await productionRepo.updateProductionLog(id, body);
    return new ApiResponse(true, log, "Production log updated successfully");
  }

  public async deleteProductionLog(id: string): Promise<IResponseDto<any>> {
    await productionRepo.deleteProductionLog(id);
    return new ApiResponse(true, null, "Production log deleted successfully");
  }

  // Finished Goods
  public async getFinishedGoods(): Promise<IResponseDto<any>> {
    const goods = await productionRepo.getAllFinishedGoods();
    return new ApiResponse(true, goods, "Finished goods fetched successfully");
  }

  public async createFinishedGood(body: any): Promise<IResponseDto<any>> {
    const good = await productionRepo.createFinishedGood(body);
    return new ApiResponse(true, good, "Finished good created successfully");
  }

  public async updateFinishedGood(id: string, body: any): Promise<IResponseDto<any>> {
    const good = await productionRepo.updateFinishedGood(id, body);
    return new ApiResponse(true, good, "Finished good updated successfully");
  }

  public async deleteFinishedGood(id: string): Promise<IResponseDto<any>> {
    await productionRepo.deleteFinishedGood(id);
    return new ApiResponse(true, null, "Finished good deleted successfully");
  }

  // Finished Goods Ledger
  public async getFinishedGoodsLedger(): Promise<IResponseDto<any>> {
    const ledger = await productionRepo.getAllFinishedGoodsLedger();
    return new ApiResponse(true, ledger, "Finished goods ledger fetched successfully");
  }

  public async createFinishedGoodsLedger(body: any): Promise<IResponseDto<any>> {
    const entry = await productionRepo.createFinishedGoodsLedger(body);
    return new ApiResponse(true, entry, "Finished goods ledger entry created successfully");
  }
}
