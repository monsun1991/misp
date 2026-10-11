export interface ILogin {
  email?: string;
  identifier?: string;
  username?: string;
  phoneNumber?: string;
  empCode?: string;
  password?: string;
  pin?: string;
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
