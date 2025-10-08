import axios from '../lib/axios';
import { TransactionsPaginationResponse, Transaction, TransactionFilters, TransactionCreatePayload, TransactionUpdatePayload, TransactionListResponse } from '../types/api';

export const transactionsApi = {
  getAll: async (filters: TransactionFilters = {}): Promise<TransactionListResponse> => {
    try {
      const params: any = {};
      
      // Map filters to API parameters
      if (filters.page) params.page = filters.page;
      if (filters.limit) params.limit = filters.limit;
      if (filters.startDate) params.from_date = filters.startDate;
      if (filters.endDate) params.to_date = filters.endDate;
      if (filters.accountId) params.account_id = filters.accountId;
      if (filters.categoryId) params.category_id = filters.categoryId;
      if (filters.type) params.type = filters.type;
      
      const response = await axios.get<TransactionsPaginationResponse>('/transactions', {
        params,
      });
      
      // Handle expected response format with transactions field
      if (response.data.transactions && Array.isArray(response.data.transactions)) {
        return {
          data: response.data.transactions,
          total: response.data.pagination?.total || response.data.transactions.length,
          page: response.data.pagination?.current_page || filters.page || 1,
          limit: response.data.pagination?.per_page || filters.limit || 10,
          totalPages: response.data.pagination?.total_pages || 1
        };
      }
      
      // If response is direct array, wrap it in expected format
      if (Array.isArray(response.data)) {
        return {
          data: response.data,
          total: response.data.length,
          page: filters.page || 1,
          limit: filters.limit || 10,
          totalPages: Math.ceil(response.data.length / (filters.limit || 10))
        };
      }
      
      // Fallback: transform any other response to expected format
      return {
        data: (response.data as any).transactions || [],
        total: (response.data as any).pagination?.total || 0,
        page: (response.data as any).pagination?.current_page || filters.page || 1,
        limit: (response.data as any).pagination?.per_page || filters.limit || 10,
        totalPages: (response.data as any).pagination?.total_pages || 1
      };
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  getById: async (id: string) => {
    try {
      const response = await axios.get<{ data: Transaction }>(`/transactions/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw error;
    }
  },

  create: async (data: TransactionCreatePayload) => {
    try {
      const response = await axios.post<{ data: Transaction }>('/transactions', data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  },

  update: async (id: string, data: TransactionUpdatePayload) => {
    try {
      const response = await axios.put<{ data: Transaction }>(`/transactions/${id}`, data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      await axios.delete(`/transactions/${id}`);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  },
};
