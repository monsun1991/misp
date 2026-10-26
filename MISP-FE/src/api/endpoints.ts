export const BASE_URL = import.meta.env.VITE_BASE_URL || '/v1';

export const API_ENDPOINTS = {
    user: {
        login: `${BASE_URL}/auth/login`,
        logout: `${BASE_URL}/auth/logout`,
        getProfile: `${BASE_URL}/auth/profile`,
        changePin: `${BASE_URL}/auth/change-pin`,
        sendResetOtp: `${BASE_URL}/auth/send-reset-otp`,
        resetPasswordWithOtp: `${BASE_URL}/auth/reset-password-with-otp`,
    },
    auth: {
        login: `${BASE_URL}/auth/login`,
        profile: `${BASE_URL}/auth/profile`,
        changePin: `${BASE_URL}/auth/change-pin`,
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
        customerPOs: `${BASE_URL}/mips/customer-pos`,
        outwardDispatches: `${BASE_URL}/mips/outward-dispatches`,
        finishedGoods: `${BASE_URL}/mips/finished-goods`,
        finishedGoodsLedger: `${BASE_URL}/mips/finished-goods-ledger`,
        stockLedgers: `${BASE_URL}/mips/stock-ledgers`,
        productionLogs: `${BASE_URL}/mips/production-logs`,
        roles: `${BASE_URL}/mips/roles`,
        departments: `${BASE_URL}/mips/departments`,
        plants: `${BASE_URL}/mips/plants`,
        customers: `${BASE_URL}/mips/customers`,
        suppliers: `${BASE_URL}/mips/suppliers`,
        warehouses: `${BASE_URL}/mips/warehouses`,
        grnEntries: `${BASE_URL}/mips/grn-entries`,
        auditLogs: `${BASE_URL}/mips/audit-logs`,
    }
};
