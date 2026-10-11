import { useUserStore } from '@/store/useAuthStore';
import axios from 'axios';
import { useIPStore } from "@/store/ipStore";

// Base axios instance
export const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || "http://localhost:4000/api",
    timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
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

            useUserStore.getState().logout();

            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default api;
