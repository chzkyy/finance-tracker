import axios from '../lib/axios';
import { DashboardSummary } from '../types/api';

export const dashboardApi = {
  getSummary: async (year?: number, month?: number) => {
    try {
      const response = await axios.get<{ summary: DashboardSummary }>('/reports/summary', {
        params: { year, month },
      });
      return response.data.summary;
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw error;
    }
  },
};
