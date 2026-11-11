import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { loginAPI, logoutAPI, changePinAPI, sendResetOtpAPI, resetPasswordWithOtpAPI } from '../services/user.service';
import { useUserStore } from '@/store/useAuthStore';
import { useMipsStore } from '@/store/useMipsStore';

export const useAuth = () => {
    const store = useUserStore();
    const queryClient = useQueryClient();

    const loginMutation = useMutation<any, Error, { email?: string; identifier?: string; password?: string; pin?: string }>({
        mutationFn: loginAPI,
        onSuccess: (data) => {
            if (data.success) {
                queryClient.clear();
                const isExternal = store.isExternal;
                const permissions = data.data.permissions || [];
                store.setAuth(
                    data.data.token,
                    data.data.token,
                    data.data.user,
                    null,
                    permissions,
                    isExternal
                );
                store.setProfileImage(data.data.user.profilePicture);
                store.setMustChangePin(!!data.data.mustChangePin);
                
                // UBAC: Scope active plant facility to user assigned scope
                if (data.data.user?.plant) {
                    useMipsStore.getState().setSelectedPlant(data.data.user.plant);
                }

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

    const changePinMutation = useMutation<any, Error, { currentPin?: string; newPin: string }>({
        mutationFn: changePinAPI,
        onSuccess: (data) => {
            if (data.success) {
                if (data.data?.user) {
                    store.updateUser(data.data.user);
                }
                store.setMustChangePin(false);
                toast.success("PIN changed successfully!");
            }
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || error.message || 'Failed to update PIN';
            toast.error(message);
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
        permissions: store.permissions,
        isExternal: store.isExternal,
        setAuth: store.setAuth,
        updateUser: store.updateUser,
        setToken: store.setToken,
        setRefreshToken: store.setRefreshToken,
        setIsExternal: store.setIsExternal,
        login: loginMutation,
        logoutMutation,
        changePin: changePinMutation,
        sendResetOtp: sendResetOtpMutation,
        resetPasswordWithOtp: resetPasswordWithOtpMutation,
        isLoading: loginMutation.isPending,
    };
};

export const useLogin = () => {
    const { login } = useAuth();
    return login;
};
