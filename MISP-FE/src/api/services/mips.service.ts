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
  // Users & Workforce
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
  updateCustomerPO: async (id: string, data: any): Promise<any> => {
    const res = await api.put(`${API_ENDPOINTS.mips.customerPOs}/${id}`, data);
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
  updateFinishedGood: async (id: string, data: any): Promise<any> => {
    const res = await api.put(`${API_ENDPOINTS.mips.finishedGoods}/${id}`, data);
    return res.data?.data;
  },

  // Finished Goods Ledger
  getFinishedGoodsLedger: async (): Promise<any[]> => {
    try {
      const res = await api.get(API_ENDPOINTS.mips.finishedGoodsLedger);
      return res.data?.data || [];
    } catch (e) {
      return [];
    }
  },
  createFinishedGoodsLedger: async (data: any): Promise<any> => {
    const res = await api.post(API_ENDPOINTS.mips.finishedGoodsLedger, data);
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
  updateMaterial: async (id: string, data: any): Promise<any> => {
    const res = await api.put(`${API_ENDPOINTS.mips.materials}/${id}`, data);
    return res.data?.data;
  },
  deleteMaterial: async (id: string): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.mips.materials}/${id}`);
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
  updateProduct: async (id: string, data: any): Promise<any> => {
    const res = await api.put(`${API_ENDPOINTS.mips.products}/${id}`, data);
    return res.data?.data;
  },
  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.mips.products}/${id}`);
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
  updatePurchaseOrder: async (id: string, data: any): Promise<any> => {
    const res = await api.put(`${API_ENDPOINTS.mips.purchaseOrders}/${id}`, data);
    return res.data?.data;
  },
  deletePurchaseOrder: async (id: string): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.mips.purchaseOrders}/${id}`);
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
  updateKit: async (id: string, data: any): Promise<any> => {
    const res = await api.put(`${API_ENDPOINTS.mips.kits}/${id}`, data);
    return res.data?.data;
  },
  deleteKit: async (id: string): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.mips.kits}/${id}`);
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
  updateProductionLog: async (id: string, data: any): Promise<any> => {
    const res = await api.put(`${API_ENDPOINTS.mips.productionLogs}/${id}`, data);
    return res.data?.data;
  },
  deleteProductionLog: async (id: string): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.mips.productionLogs}/${id}`);
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
  },

  // Dynamic Roles
  getRoles: async (): Promise<any[]> => {
    try {
      const res = await api.get(API_ENDPOINTS.mips.roles);
      return res.data?.data || [];
    } catch (e) {
      return [];
    }
  },
  createRole: async (data: any): Promise<any> => {
    const res = await api.post(API_ENDPOINTS.mips.roles, data);
    return res.data?.data;
  },
  updateRole: async (id: string, data: any): Promise<any> => {
    const res = await api.put(`${API_ENDPOINTS.mips.roles}/${id}`, data);
    return res.data?.data;
  },
  deleteRole: async (id: string): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.mips.roles}/${id}`);
  },

  // Dynamic Departments
  getDepartments: async (): Promise<any[]> => {
    try {
      const res = await api.get(API_ENDPOINTS.mips.departments);
      return res.data?.data || [];
    } catch (e) {
      return [];
    }
  },
  createDepartment: async (data: any): Promise<any> => {
    const res = await api.post(API_ENDPOINTS.mips.departments, data);
    return res.data?.data;
  },
  updateDepartment: async (id: string, data: any): Promise<any> => {
    const res = await api.put(`${API_ENDPOINTS.mips.departments}/${id}`, data);
    return res.data?.data;
  },
  deleteDepartment: async (id: string): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.mips.departments}/${id}`);
  },

  // Master Categories
  getCategories: async (type?: string): Promise<any[]> => {
    try {
      const res = await api.get(API_ENDPOINTS.mips.categories, { params: type ? { type } : undefined });
      return res.data?.data || [];
    } catch (e) {
      return [];
    }
  },
  createCategory: async (data: any): Promise<any> => {
    const res = await api.post(API_ENDPOINTS.mips.categories, data);
    return res.data?.data;
  },
  updateCategory: async (id: string, data: any): Promise<any> => {
    const res = await api.put(`${API_ENDPOINTS.mips.categories}/${id}`, data);
    return res.data?.data;
  },
  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.mips.categories}/${id}`);
  },

  // Dynamic Plants
  getPlants: async (): Promise<any[]> => {
    try {
      const res = await api.get(API_ENDPOINTS.mips.plants);
      return res.data?.data || [];
    } catch (e) {
      return [];
    }
  },
  createPlant: async (data: any): Promise<any> => {
    const res = await api.post(API_ENDPOINTS.mips.plants, data);
    return res.data?.data;
  },
  updatePlant: async (id: string, data: any): Promise<any> => {
    const res = await api.put(`${API_ENDPOINTS.mips.plants}/${id}`, data);
    return res.data?.data;
  },
  deletePlant: async (id: string): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.mips.plants}/${id}`);
  },

  // Customers Directory
  getCustomers: async (): Promise<any[]> => {
    try {
      const res = await api.get(API_ENDPOINTS.mips.customers);
      return res.data?.data || [];
    } catch (e) {
      return [];
    }
  },
  createCustomer: async (data: any): Promise<any> => {
    const res = await api.post(API_ENDPOINTS.mips.customers, data);
    return res.data?.data;
  },
  updateCustomer: async (id: string, data: any): Promise<any> => {
    const res = await api.put(`${API_ENDPOINTS.mips.customers}/${id}`, data);
    return res.data?.data;
  },
  deleteCustomer: async (id: string): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.mips.customers}/${id}`);
  },

  // Suppliers Master
  getSuppliers: async (): Promise<any[]> => {
    try {
      const res = await api.get(API_ENDPOINTS.mips.suppliers);
      return res.data?.data || [];
    } catch (e) {
      return [];
    }
  },
  createSupplier: async (data: any): Promise<any> => {
    const res = await api.post(API_ENDPOINTS.mips.suppliers, data);
    return res.data?.data;
  },
  updateSupplier: async (id: string, data: any): Promise<any> => {
    const res = await api.put(`${API_ENDPOINTS.mips.suppliers}/${id}`, data);
    return res.data?.data;
  },
  deleteSupplier: async (id: string): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.mips.suppliers}/${id}`);
  },

  // Warehouses Master
  getWarehouses: async (): Promise<any[]> => {
    try {
      const res = await api.get(API_ENDPOINTS.mips.warehouses);
      return res.data?.data || [];
    } catch (e) {
      return [];
    }
  },
  createWarehouse: async (data: any): Promise<any> => {
    const res = await api.post(API_ENDPOINTS.mips.warehouses, data);
    return res.data?.data;
  },
  updateWarehouse: async (id: string, data: any): Promise<any> => {
    const res = await api.put(`${API_ENDPOINTS.mips.warehouses}/${id}`, data);
    return res.data?.data;
  },
  deleteWarehouse: async (id: string): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.mips.warehouses}/${id}`);
  },

  // GRN Entries
  getGRNEntries: async (): Promise<any[]> => {
    try {
      const res = await api.get(API_ENDPOINTS.mips.grnEntries);
      return res.data?.data || [];
    } catch (e) {
      return [];
    }
  },
  createGRNEntry: async (data: any): Promise<any> => {
    const res = await api.post(API_ENDPOINTS.mips.grnEntries, data);
    return res.data?.data;
  },

  // Audit Logs
  getAuditLogs: async (): Promise<any[]> => {
    try {
      const res = await api.get(API_ENDPOINTS.mips.auditLogs);
      return res.data?.data || [];
    } catch (e) {
      return [];
    }
  },
  createAuditLog: async (data: any): Promise<any> => {
    const res = await api.post(API_ENDPOINTS.mips.auditLogs, data);
    return res.data?.data;
  }
};
