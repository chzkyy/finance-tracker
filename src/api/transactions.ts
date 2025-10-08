import axios from '../lib/axios';
import { 
  TransactionsPaginationResponse, 
  Transaction, 
  TransactionFilters, 
  TransactionCreatePayload, 
  TransactionUpdatePayload, 
  TransactionListResponse,
  TransactionFullPayload,
  TransactionFullCreatePayload,
  TransactionFullUpdatePayload,
  AccountType
} from '../types/api';

export const transactionsApi = {
  // Helper function to transform API response to internal Transaction format
  transformTransaction: (apiTransaction: TransactionFullPayload): Transaction => {
    return {
      ...apiTransaction,
      account: {
        ...apiTransaction.account,
        createdAt: apiTransaction.account.created_at, // Map created_at to createdAt
        type: apiTransaction.account.type as AccountType,
      },
      category: {
        ...apiTransaction.category,
        createdAt: apiTransaction.category.created_at, // Map created_at to createdAt
        updatedAt: apiTransaction.category.created_at, // Use created_at as updatedAt fallback
        type: apiTransaction.category.type as 'income' | 'expense',
      },
    };
  },

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

  create: async (data: TransactionCreatePayload | TransactionFullCreatePayload): Promise<Transaction> => {
    try {
      const response = await axios.post<TransactionFullPayload>('/transactions', data);
      
      // Transform the API response to match our internal Transaction interface
      return transactionsApi.transformTransaction(response.data);
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  },

  update: async (id: string, data: TransactionUpdatePayload | TransactionFullUpdatePayload): Promise<Transaction> => {
    try {
      const response = await axios.put<TransactionFullPayload>(`/transactions/${id}`, data);
      
      // Transform the API response to match our internal Transaction interface
      return transactionsApi.transformTransaction(response.data);
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
