import axios from 'axios';
import { useUserStore } from '@/store/useAuthStore';

export const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = useUserStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear all persisted store data on token expiry / unauthorized
      localStorage.removeItem('mips_manufacturing_store_v10_clean');
      localStorage.removeItem('mips_manufacturing_store_v7');
      localStorage.removeItem('user-storage');
      localStorage.removeItem('notification-store');
      sessionStorage.clear();
      useUserStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
