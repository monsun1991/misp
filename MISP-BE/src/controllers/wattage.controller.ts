import * as wattageRepo from "../repositories/wattage.repository";
import { IResponseDto, ApiResponse } from "../dto/response.dto";

export class WattageController {
  public async getWattages(status?: string): Promise<IResponseDto<any>> {
    const wattages = await wattageRepo.getAllWattages(status);
    return new ApiResponse(true, wattages, "Wattages fetched successfully");
  }

  public async getWattageById(id: string): Promise<IResponseDto<any>> {
    const wattage = await wattageRepo.getWattageById(id);
    return new ApiResponse(true, wattage, "Wattage fetched successfully");
  }

  public async createWattage(body: any): Promise<IResponseDto<any>> {
    const wattage = await wattageRepo.createWattage(body);
    return new ApiResponse(true, wattage, "Wattage created successfully");
  }

  public async updateWattage(id: string, body: any): Promise<IResponseDto<any>> {
    const wattage = await wattageRepo.updateWattage(id, body);
    return new ApiResponse(true, wattage, "Wattage updated successfully");
  }

  public async deleteWattage(id: string): Promise<IResponseDto<any>> {
    await wattageRepo.deleteWattage(id);
    return new ApiResponse(true, null, "Wattage deleted successfully");
  }
}

export const wattageCtrl = new WattageController();

