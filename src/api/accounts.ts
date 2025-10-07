import axios from '../lib/axios';
import { Account } from '../types/api';

export const accountsApi = {
  getAll: async () => {
    const response = await axios.get<Account[]>('/accounts');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axios.get<Account>(`/accounts/${id}`);
    return response.data;
  },

  create: async (data: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await axios.post<Account>('/accounts', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Account>) => {
    const response = await axios.put<Account>(`/accounts/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await axios.delete(`/accounts/${id}`);
  },
};
