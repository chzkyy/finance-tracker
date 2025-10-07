import axios from '../lib/axios';
import { Category } from '../types/api';

export const categoriesApi = {
  getAll: async () => {
    const response = await axios.get<Category[]>('/categories');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axios.get<Category>(`/categories/${id}`);
    return response.data;
  },

  create: async (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await axios.post<Category>('/categories', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Category>) => {
    const response = await axios.put<Category>(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await axios.delete(`/categories/${id}`);
  },
};
