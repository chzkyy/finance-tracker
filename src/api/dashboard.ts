import axios from '../lib/axios';
import { DashboardStats } from '../types/api';

export const dashboardApi = {
  getStats: async (startDate?: string, endDate?: string) => {
    const response = await axios.get<DashboardStats>('/dashboard/stats', {
      params: { startDate, endDate },
    });
    return response.data;
  },
};
