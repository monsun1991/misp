import { IResponseDto, ApiResponse } from "../dto/response.dto";
import * as userRepo from "../repositories/user.repository";
import { formatUserProfile } from "../utils/rbac.util";

export class UserController {
  constructor() {}

  public async getUsers(): Promise<IResponseDto<any>> {
    const users = await userRepo.getAllUsers();
    const formatted = users.map(formatUserProfile);
    return new ApiResponse(true, formatted, "Users fetched successfully");
  }

  public async getUserById(id: string): Promise<IResponseDto<any>> {
    const user = await userRepo.getUserById(id);
    return new ApiResponse(true, formatUserProfile(user), "User fetched successfully");
  }

  public async createUser(body: any): Promise<IResponseDto<any>> {
    const user = await userRepo.createUser(body);
    return new ApiResponse(true, formatUserProfile(user), "User created successfully");
  }

  public async updateUser(id: string, body: any): Promise<IResponseDto<any>> {
    const user = await userRepo.updateUser(id, body);
    return new ApiResponse(true, formatUserProfile(user), "User updated successfully");
  }

  public async deleteUser(id: string): Promise<IResponseDto<any>> {
    await userRepo.deleteUser(id);
    return new ApiResponse(true, null, "User deactivated successfully");
  }
}
