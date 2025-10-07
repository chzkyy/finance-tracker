// API Types based on common financial tracker structure

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
}

export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'cash';
  balance: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  categoryId: string;
  amount: number;
  type: 'income' | 'expense';
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  account?: Account;
  category?: Category;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  accountId?: string;
  categoryId?: string;
  type?: 'income' | 'expense';
  page?: number;
  limit?: number;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  accountsCount: number;
  transactionsCount: number;
  recentTransactions: Transaction[];
  incomeByCategory: CategorySummary[];
  expenseByCategory: CategorySummary[];
  monthlyTrend: MonthlyData[];
}

export interface CategorySummary {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
}

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
  net: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
