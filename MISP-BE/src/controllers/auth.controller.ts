import { Request } from "express";
import { IResponseDto, ApiResponse } from "../dto/response.dto";
import { ILogin } from "../dto/auth.dto";
import { loginUser, getUserProfile } from "../repositories/auth.repository";
import { AUTH_MESSAGE } from "../constants";

export class AuthController {
  constructor(private req: Request) {}

  public async login(payload: ILogin): Promise<IResponseDto<any>> {
    const result = await loginUser(payload);

    return new ApiResponse(
      true,
      {
        user: {
          id: result.user.id,
          fullName: result.user.fullName,
          email: result.user.email,
          phoneNumber: result.user.phoneNumber,
          role: result.user.role,
          gender: result.user.gender,
          profilePicture: result.user.profilePicture,
        },
        token: result.token,
      },
      AUTH_MESSAGE.LOGIN_SUCCESS
    );
  }

  public async getProfile(): Promise<IResponseDto<any>> {
    const user = await getUserProfile(this.req.user!.id);

    return new ApiResponse(
      true,
      {
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          gender: user.gender,
          profilePicture: user.profilePicture,
        },
      },
      AUTH_MESSAGE.PROFILE_FETCHED
    );
  }
}
