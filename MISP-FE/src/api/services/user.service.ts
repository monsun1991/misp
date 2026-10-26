import { API_ENDPOINTS } from '../endpoints';
import api from '@/api/axiosInstance';

export const loginAPI = async (data: { email?: string; identifier?: string; password?: string; pin?: string }): Promise<any> => {
    const payload = {
        identifier: data.identifier || data.email,
        email: data.email || data.identifier,
        pin: data.pin || data.password,
        password: data.password || data.pin,
    };
    const response = await api.post(
        API_ENDPOINTS.user.login,
        payload
    );
    return response.data;
};

export const logoutAPI = async (_accessToken: string): Promise<any> => {
    return { success: true };
};

export const changePinAPI = async (data: { currentPin?: string; newPin: string }): Promise<any> => {
    const response = await api.post(
        API_ENDPOINTS.auth.changePin,
        data
    );
    return response.data;
};

export const sendResetOtpAPI = async (_data: { phoneNumber: string }): Promise<any> => {
    return { success: true };
};

export const resetPasswordWithOtpAPI = async (_data: { phoneNumber: string; otp: string; newPassword: string }): Promise<any> => {
    return { success: true };
};
