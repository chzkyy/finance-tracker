import axios from '../lib/axios';
import { Category } from '../types/api';

export const categoriesApi = {
  getAll: async () => {
    try {
      const response = await axios.get<{ categories: Category[] } | Category[]>('/categories');
      // Handle both response formats: { categories: [...] } or [...]
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return response.data.categories || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  getById: async (id: string) => {
    try {
      const response = await axios.get<{ data: Category }>(`/categories/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  },

  create: async (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await axios.post<{ data: Category }>('/categories', data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  update: async (id: string, data: Partial<Category>) => {
    try {
      const response = await axios.put<{ data: Category }>(`/categories/${id}`, data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      await axios.delete(`/categories/${id}`);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },
};
