export interface ILogin {
  email: string;
  password: string;
}

export interface IAuthResponse {
  user: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    role: string;
    gender?: string;
    profilePicture?: string;
  };
  token: string;
  permissions?: string[];
}

export interface IChangePassword {
  oldPassword: string;
  newPassword: string;
}

export interface IUpdateProfile {
  fullName?: string;
  phoneNumber?: string;
  gender?: string;
  profilePicture?: string;
  address?: string;
}
