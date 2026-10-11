import { API_ENDPOINTS } from '../endpoints';
import api from '@/api/axiosInstance';

export const loginAPI = async (data: { email: string; password: string }): Promise<any> => {
    const response = await api.post(
        API_ENDPOINTS.user.login,
        { email: data.email, password: data.password }
    );
    return response.data;
};

export const logoutAPI = async (_accessToken: string): Promise<any> => {
    return { success: true };
};

export const sendResetOtpAPI = async (_data: { phoneNumber: string }): Promise<any> => {
    return { success: true };
};

export const resetPasswordWithOtpAPI = async (_data: { phoneNumber: string; otp: string; newPassword: string }): Promise<any> => {
    return { success: true };
};
