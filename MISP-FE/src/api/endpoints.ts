export const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:4001/v1';

export const API_ENDPOINTS = {
    user: {
        login: `${BASE_URL}/auth/login`,
        logout: `${BASE_URL}/auth/logout`,
        getProfile: `${BASE_URL}/auth/profile`,
        sendResetOtp: `${BASE_URL}/auth/send-reset-otp`,
        resetPasswordWithOtp: `${BASE_URL}/auth/reset-password-with-otp`,
    },
    auth: {
        login: `${BASE_URL}/auth/login`,
        profile: `${BASE_URL}/auth/profile`,
    },
    dashboard: {
        overview: `${BASE_URL}/dashboard/overview`,
    },
    mips: {
        users: `${BASE_URL}/mips/users`,
        materials: `${BASE_URL}/mips/materials`,
        products: `${BASE_URL}/mips/products`,
        purchaseOrders: `${BASE_URL}/mips/purchase-orders`,
        kits: `${BASE_URL}/mips/kits`,
        summary: `${BASE_URL}/mips/summary`,
    }
};
