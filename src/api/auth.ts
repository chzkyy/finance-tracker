import axios from '../lib/axios';
import { LoginRequest, LoginResponse, RegisterRequest } from '../types/api';

export const authApi = {
  login: async (data: LoginRequest) => {
    const response = await axios.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest) => {
    const response = await axios.post<LoginResponse>('/auth/register', data);
    return response.data;
  },

  logout: async () => {
    await axios.post('/auth/logout');
  },

  getProfile: async () => {
    const response = await axios.get('/auth/profile');
    return response.data;
  },
};
