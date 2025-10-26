import axios from 'axios';
import { ApiResponse, Transaction, DashboardData, TransactionFilters } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials:true
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login on 401 Unauthorized errors
    // This preserves session during network issues
    if (error.response?.status === 401) {
      console.log('Authentication failed, clearing session and redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect if we're not already on a public page
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (data: { name?: string; avatar?: string }) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },
};

// Transaction API calls
export const transactionAPI = {
  getTransactions: async (filters: TransactionFilters = {}) => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/transactions?${params.toString()}`);
    return response.data;
  },

  getTransaction: async (id: string): Promise<ApiResponse<Transaction>> => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  createTransaction: async (data: Partial<Transaction>): Promise<ApiResponse<Transaction>> => {
    const response = await api.post('/transactions', data);
    return response.data;
  },

  updateTransaction: async (id: string, data: Partial<Transaction>): Promise<ApiResponse<Transaction>> => {
    const response = await api.put(`/transactions/${id}`, data);
    return response.data;
  },

  deleteTransaction: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },

  getDashboardData: async (period: 'week' | 'month' | 'year' = 'month'): Promise<ApiResponse<DashboardData>> => {
    const response = await api.get(`/transactions/dashboard?period=${period}`);
    return response.data;
  },

  markAsSettled: async (id: string): Promise<ApiResponse<Transaction>> => {
    const response = await api.patch(`/transactions/${id}/settle`);
    return response.data;
  },
};

export default api;