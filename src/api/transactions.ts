import axios from '../lib/axios';
import { Transaction, PaginatedResponse, TransactionFilters } from '../types/api';

export const transactionsApi = {
  getAll: async (filters?: TransactionFilters) => {
    const response = await axios.get<PaginatedResponse<Transaction>>('/transactions', {
      params: filters,
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axios.get<Transaction>(`/transactions/${id}`);
    return response.data;
  },

  create: async (data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await axios.post<Transaction>('/transactions', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Transaction>) => {
    const response = await axios.put<Transaction>(`/transactions/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await axios.delete(`/transactions/${id}`);
  },
};
