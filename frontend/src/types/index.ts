export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export type TransactionType = 'income' | 'expense' | 'borrow' | 'lend';
export type TransactionStatus = 'pending' | 'completed' | 'cancelled';

export interface Transaction {
  _id: string;
  user: string;
  type: TransactionType;
  category: string;
  amount: number;
  description: string;
  date: string;
  status: TransactionStatus;
  contactPerson?: string;
  contactPhone?: string;
  dueDate?: string;
  isSettled?: boolean;
  settlementDate?: string;
  tags?: string[];
  location?: string;
  receipt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  user: string;
  name: string;
  type: 'income' | 'expense' | 'both';
  icon: string;
  color: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardData {
  period: string;
  income: {
    total: number;
    count: number;
  };
  expenses: {
    total: number;
    count: number;
  };
  balance: number;
  borrowing: {
    total: number;
    count: number;
  };
  lending: {
    total: number;
    count: number;
  };
  expensesByCategory: Array<{
    _id: string;
    totalAmount: number;
    count: number;
  }>;
  recentTransactions: Transaction[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface TransactionFilters {
  type?: TransactionType;
  category?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  isSettled?: boolean;
  page?: number;
  limit?: number;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}