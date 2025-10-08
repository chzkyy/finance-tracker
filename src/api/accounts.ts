import axios from '../lib/axios';
import { Account, AccountsResponse } from '../types/api';

export const accountsApi = {
  getAll: async () => {
    try {
      const response = await axios.get<AccountsResponse>('/accounts');
      return response.data.accounts;
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw error;
    }
  },

  getById: async (id: string) => {
    try {
      const response = await axios.get<{ account: Account }>(`/accounts/${id}`);
      return response.data.account;
    } catch (error) {
      console.error('Error fetching account:', error);
      throw error;
    }
  },

  create: async (data: { name: string; type: string }) => {
    try {
      const response = await axios.post<{ account: Account }>('/accounts', data);
      return response.data.account;
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  },

  update: async (id: string, data: { name?: string; type?: string }) => {
    try {
      const response = await axios.put<{ account: Account }>(`/accounts/${id}`, data);
      return response.data.account;
    } catch (error) {
      console.error('Error updating account:', error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      await axios.delete(`/accounts/${id}`);
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  },
};
