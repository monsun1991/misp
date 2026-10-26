import { IResponseDto, ApiResponse } from "../dto/response.dto";
import * as adminRepo from "../repositories/admin.repository";

export class AdminController {
  constructor() {}

  // Roles
  public async getRoles(): Promise<IResponseDto<any>> {
    const roles = await adminRepo.getAllRoles();
    return new ApiResponse(true, roles, "Roles fetched successfully");
  }

  public async createRole(body: any): Promise<IResponseDto<any>> {
    const role = await adminRepo.createRole(body);
    return new ApiResponse(true, role, "Role created successfully");
  }

  public async updateRole(id: string, body: any): Promise<IResponseDto<any>> {
    const role = await adminRepo.updateRole(id, body);
    return new ApiResponse(true, role, "Role updated successfully");
  }

  public async deleteRole(id: string): Promise<IResponseDto<any>> {
    await adminRepo.deleteRole(id);
    return new ApiResponse(true, null, "Role deleted successfully");
  }

  // Departments
  public async getDepartments(): Promise<IResponseDto<any>> {
    const depts = await adminRepo.getAllDepartments();
    return new ApiResponse(true, depts, "Departments fetched successfully");
  }

  public async createDepartment(body: any): Promise<IResponseDto<any>> {
    const dept = await adminRepo.createDepartment(body);
    return new ApiResponse(true, dept, "Department created successfully");
  }

  public async updateDepartment(id: string, body: any): Promise<IResponseDto<any>> {
    const dept = await adminRepo.updateDepartment(id, body);
    return new ApiResponse(true, dept, "Department updated successfully");
  }

  public async deleteDepartment(id: string): Promise<IResponseDto<any>> {
    await adminRepo.deleteDepartment(id);
    return new ApiResponse(true, null, "Department deleted successfully");
  }

  // Plants
  public async getPlants(): Promise<IResponseDto<any>> {
    const plants = await adminRepo.getAllPlants();
    return new ApiResponse(true, plants, "Plants fetched successfully");
  }

  public async createPlant(body: any): Promise<IResponseDto<any>> {
    const plant = await adminRepo.createPlant(body);
    return new ApiResponse(true, plant, "Plant created successfully");
  }

  public async updatePlant(id: string, body: any): Promise<IResponseDto<any>> {
    const plant = await adminRepo.updatePlant(id, body);
    return new ApiResponse(true, plant, "Plant updated successfully");
  }

  public async deletePlant(id: string): Promise<IResponseDto<any>> {
    await adminRepo.deletePlant(id);
    return new ApiResponse(true, null, "Plant deleted successfully");
  }

  // Audit Logs
  public async getAuditLogs(): Promise<IResponseDto<any>> {
    const logs = await adminRepo.getAllAuditLogs();
    return new ApiResponse(true, logs, "Audit logs fetched successfully");
  }

  public async createAuditLog(body: any): Promise<IResponseDto<any>> {
    const log = await adminRepo.createAuditLog(body);
    return new ApiResponse(true, log, "Audit log created successfully");
  }
}
