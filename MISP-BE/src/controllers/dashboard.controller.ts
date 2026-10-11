import { Request } from "express";
import { IResponseDto, ApiResponse } from "../dto/response.dto";
import { getOverviewData } from "../repositories/dashboard.repository";
import { DASHBOARD_MESSAGE } from "../constants";

export class DashboardController {
  constructor(_req?: Request) {}

  public async getOverviewData(): Promise<IResponseDto<any>> {
    const data = await getOverviewData();
    return new ApiResponse(true, data, DASHBOARD_MESSAGE.OVERVIEW_FETCHED);
  }
}
