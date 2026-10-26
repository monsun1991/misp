import { Request } from "express";
import { IResponseDto, ApiResponse } from "../dto/response.dto";
import { ILogin } from "../dto/auth.dto";
import { loginUser, getUserProfile, updateUserPin } from "../repositories/auth.repository";
import { AUTH_MESSAGE } from "../constants";
import { computeUserPermissions, formatUserProfile } from "../utils/rbac.util";
import { BadRequestException } from "../utils/error.util";

export class AuthController {
  constructor(private req: Request) {}

  public async login(payload: ILogin): Promise<IResponseDto<any>> {
    const result = await loginUser(payload);
    const userProfile = formatUserProfile(result.user);
    const permissions = computeUserPermissions(result.user);

    return new ApiResponse(
      true,
      {
        user: userProfile,
        permissions,
        token: result.token,
      },
      AUTH_MESSAGE.LOGIN_SUCCESS
    );
  }

  public async getProfile(): Promise<IResponseDto<any>> {
    const user = await getUserProfile(this.req.user!.id);
    const userProfile = formatUserProfile(user);
    const permissions = computeUserPermissions(user);

    return new ApiResponse(
      true,
      {
        user: userProfile,
        permissions,
      },
      AUTH_MESSAGE.PROFILE_FETCHED
    );
  }

  public async changePin(body: { currentPin?: string; newPin: string }): Promise<IResponseDto<any>> {
    const userId = this.req.user!.id;
    const { currentPin, newPin } = body;

    if (!newPin || !/^\d{4,6}$/.test(newPin.trim())) {
      throw new BadRequestException("New PIN must be 4 to 6 numeric digits.");
    }

    const updatedUser = await updateUserPin(userId, newPin.trim(), currentPin?.trim());
    const userProfile = formatUserProfile(updatedUser);

    return new ApiResponse(
      true,
      {
        user: userProfile,
      },
      "PIN updated successfully."
    );
  }
}
