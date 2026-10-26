import { useUserStore } from '@/store/useAuthStore';
import axios from 'axios';
import { useIPStore } from "@/store/ipStore";

// Base axios instance
export const api = axios.create({
    baseURL: "",
    timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Normalize url to guarantee /v1 prefix without duplicates
        if (config.url && !config.url.startsWith("http://") && !config.url.startsWith("https://")) {
            if (!config.url.startsWith("/v1") && !config.url.startsWith("v1")) {
                config.url = `/v1${config.url.startsWith("/") ? "" : "/"}${config.url}`;
            }
        }
        const token = useUserStore.getState().accessToken;
        // Respect existing Authorization (e.g., Basic for login); only add Bearer if missing
        if (token && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // Get client IP from IP store
        const clientIP = useIPStore.getState().clientIP;
        if (clientIP) {
            config.headers["x-client-ip"] = clientIP;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            localStorage.removeItem('mips_manufacturing_store_v7');
            localStorage.removeItem('user-storage');
            localStorage.removeItem('notification-store');
            sessionStorage.clear();
            useUserStore.getState().logout();

            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default api;
