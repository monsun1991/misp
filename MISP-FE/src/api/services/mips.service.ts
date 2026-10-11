import axios from 'axios';
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
      const res = await axios.get(API_ENDPOINTS.mips.users);
      return res.data?.data || [];
    } catch (error) {
      console.warn('Failed to fetch users from backend, fallback empty', error);
      return [];
    }
  },

  createUser: async (user: Partial<BackendUser>): Promise<BackendUser> => {
    const res = await axios.post(API_ENDPOINTS.mips.users, user);
    return res.data?.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await axios.delete(`${API_ENDPOINTS.mips.users}/${id}`);
  },

  updateUser: async (id: string, user: Partial<BackendUser>): Promise<BackendUser> => {
    const res = await axios.put(`${API_ENDPOINTS.mips.users}/${id}`, user);
    return res.data?.data;
  }
};
