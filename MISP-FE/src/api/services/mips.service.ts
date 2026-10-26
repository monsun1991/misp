import api from '@/api/axiosInstance';
import { API_ENDPOINTS } from '../endpoints';

export interface BackendUser {
  id: string;
  empCode?: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: string;
  plant?: string;
  warehouse?: string;
  department?: string;
  team?: string;
  workstation?: string;
  supervisor?: string;
  status?: string;
  skills?: string;
  pin?: string;
  password?: string;
  customPermissions?: string[];
  revokedPermissions?: string[];
  customPermissionsJson?: string;
  revokedPermissionsJson?: string;
  isActive?: boolean;
  createdAt?: string;
}

export const mipsService = {
  getUsers: async (): Promise<BackendUser[]> => {
    try {
      const res = await api.get(API_ENDPOINTS.mips.users);
      return res.data?.data || [];
    } catch (error) {
      console.warn('Failed to fetch users from backend, fallback empty', error);
      return [];
    }
  },

  createUser: async (user: Partial<BackendUser>): Promise<BackendUser> => {
    const res = await api.post(API_ENDPOINTS.mips.users, user);
    return res.data?.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.mips.users}/${id}`);
  },

  updateUser: async (id: string, user: Partial<BackendUser>): Promise<BackendUser> => {
    const res = await api.put(`${API_ENDPOINTS.mips.users}/${id}`, user);
    return res.data?.data;
  },

  // Customer POs
  getCustomerPOs: async (): Promise<any[]> => {
    try {
      const res = await api.get(API_ENDPOINTS.mips.customerPOs);
      return res.data?.data || [];
    } catch (e) {
      return [];
    }
  },
  createCustomerPO: async (data: any): Promise<any> => {
    const res = await api.post(API_ENDPOINTS.mips.customerPOs, data);
    return res.data?.data;
  },

  // Outward Dispatches
  getOutwardDispatches: async (): Promise<any[]> => {
    try {
      const res = await api.get(API_ENDPOINTS.mips.outwardDispatches);
      return res.data?.data || [];
    } catch (e) {
      return [];
    }
  },
  createOutwardDispatch: async (data: any): Promise<any> => {
    const res = await api.post(API_ENDPOINTS.mips.outwardDispatches, data);
    return res.data?.data;
  },

  // Finished Goods
  getFinishedGoods: async (): Promise<any[]> => {
    try {
      const res = await api.get(API_ENDPOINTS.mips.finishedGoods);
      return res.data?.data || [];
    } catch (e) {
      return [];
    }
  },
  createFinishedGood: async (data: any): Promise<any> => {
    const res = await api.post(API_ENDPOINTS.mips.finishedGoods, data);
    return res.data?.data;
  },

  // Materials
  getMaterials: async (): Promise<any[]> => {
    try {
      const res = await api.get(API_ENDPOINTS.mips.materials);
      return res.data?.data || [];
    } catch (e) {
      return [];
    }
  },
  createMaterial: async (data: any): Promise<any> => {
    const res = await api.post(API_ENDPOINTS.mips.materials, data);
    return res.data?.data;
  },

  // Products
  getProducts: async (): Promise<any[]> => {
    try {
      const res = await api.get(API_ENDPOINTS.mips.products);
      return res.data?.data || [];
    } catch (e) {
      return [];
    }
  },
  createProduct: async (data: any): Promise<any> => {
    const res = await api.post(API_ENDPOINTS.mips.products, data);
    return res.data?.data;
  },

  // Purchase Orders
  getPurchaseOrders: async (): Promise<any[]> => {
    try {
      const res = await api.get(API_ENDPOINTS.mips.purchaseOrders);
      return res.data?.data || [];
    } catch (e) {
      return [];
    }
  },
  createPurchaseOrder: async (data: any): Promise<any> => {
    const res = await api.post(API_ENDPOINTS.mips.purchaseOrders, data);
    return res.data?.data;
  },

  // Kits
  getKits: async (): Promise<any[]> => {
    try {
      const res = await api.get(API_ENDPOINTS.mips.kits);
      return res.data?.data || [];
    } catch (e) {
      return [];
    }
  },
  createKit: async (data: any): Promise<any> => {
    const res = await api.post(API_ENDPOINTS.mips.kits, data);
    return res.data?.data;
  },

  // Production Logs
  getProductionLogs: async (): Promise<any[]> => {
    try {
      const res = await api.get(API_ENDPOINTS.mips.productionLogs);
      return res.data?.data || [];
    } catch (e) {
      return [];
    }
  },
  createProductionLog: async (data: any): Promise<any> => {
    const res = await api.post(API_ENDPOINTS.mips.productionLogs, data);
    return res.data?.data;
  },

  // Stock Ledgers
  getStockLedgers: async (): Promise<any[]> => {
    try {
      const res = await api.get(API_ENDPOINTS.mips.stockLedgers);
      return res.data?.data || [];
    } catch (e) {
      return [];
    }
  },
  createStockLedger: async (data: any): Promise<any> => {
    const res = await api.post(API_ENDPOINTS.mips.stockLedgers, data);
    return res.data?.data;
  }
};
