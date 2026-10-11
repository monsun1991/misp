import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { loginAPI, logoutAPI, sendResetOtpAPI, resetPasswordWithOtpAPI } from '../services/user.service';
import { useUserStore } from '@/store/useAuthStore';

export const useAuth = () => {
    const store = useUserStore();
    const queryClient = useQueryClient();

    const loginMutation = useMutation<any, Error, { email: string; password: string }>({
        mutationFn: loginAPI,
        onSuccess: (data) => {
            if (data.success) {
                queryClient.clear();
                const isExternal = store.isExternal;
                store.setAuth(
                    data.data.token,
                    data.data.token,
                    data.data.user,
                    null,
                    [],
                    isExternal
                );
                store.setProfileImage(data.data.user.profilePicture);
                toast.success("Login successful");
            }
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || error.message || 'Login failed';
            toast.error(message);
        },
    });

    const logoutMutation = useMutation<any, Error, { accessToken: string }>({
        mutationFn: ({ accessToken }) => logoutAPI(accessToken),
        onError: (error: any) => {
            console.error('Logout API failed:', error);
        },
    });

    const sendResetOtpMutation = useMutation<any, Error, { phoneNumber: string }>({
        mutationFn: sendResetOtpAPI,
        onError: (error: any) => {
            const message = error?.response?.data?.message || error.message || 'Failed to send OTP';
            toast.error(message);
        },
    });

    const resetPasswordWithOtpMutation = useMutation<any, Error, { phoneNumber: string; otp: string; newPassword: string }>({
        mutationFn: resetPasswordWithOtpAPI,
        onError: (error: any) => {
            const message = error?.response?.data?.message || error.message || 'Failed to reset password';
            toast.error(message);
        },
    });

    return {
        isAuthenticated: store.isAuthenticated,
        accessToken: store.accessToken,
        refreshToken: store.refreshToken,
        user: store.user,
        isExternal: store.isExternal,
        setAuth: store.setAuth,
        updateUser: store.updateUser,
        setToken: store.setToken,
        setRefreshToken: store.setRefreshToken,
        setIsExternal: store.setIsExternal,
        login: loginMutation,
        logoutMutation,
        sendResetOtp: sendResetOtpMutation,
        resetPasswordWithOtp: resetPasswordWithOtpMutation,
        isLoading: loginMutation.isPending,
    };
};

export const useLogin = () => {
    const { login } = useAuth();
    return login;
};
