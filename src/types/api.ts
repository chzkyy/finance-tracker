// API Types based on common financial tracker structure

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: string;
}

// Standardized pagination response for transactions
export interface TransactionListResponse {
  data: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

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
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export type AccountType = 'bank' | 'ewallet' | 'cash';

export interface Account {
  id: string;
  user_id: string;
  name: string;
  type: AccountType;
  created_at: string;
  createdAt: string; // for compatibility
  transactions: string[];
  user: User;
}

export interface AccountsResponse {
  accounts: Account[];
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  created_at: string;
  user_id: string;
  transactions: string[];
  user: User;
  icon?: string;
  color?: string;
  createdAt?: string; // for compatibility
  updatedAt?: string; // for compatibility
}

export interface RawEvent {
  id: string;
  external_id: string;
  source: string;
  provider_hint: string;
  mail_from: string;
  mail_to: string;
  subject: string;
  message_id: string;
  payload: string;
  status: string;
  error_message: string;
  received_at: string;
  created_at: string;
  user_id: string;
  user: User;
  transactions: string[];
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'income' | 'expense';
  amount: number;
  currency: string;
  account_id: string;
  category_id: string;
  occurred_at: string;
  description: string;
  external_id: string;
  raw_event_id: string;
  created_at: string;
  updated_at: string;
  user: User;
  account: Account;
  category: Category;
  raw_event: RawEvent;
}

export interface TransactionCreatePayload {
  account_id: string;
  category_id: string;
  amount: number;
  type: 'income' | 'expense';
  currency: string;
  description: string;
  occurred_at: string;
  external_id?: string;
}

export interface TransactionUpdatePayload {
  account_id?: string;
  category_id?: string;
  amount?: number;
  type?: 'income' | 'expense';
  currency?: string;
  description?: string;
  occurred_at?: string;
  external_id?: string;
}

// Full transaction update payload with all nested objects (same as create)
export interface TransactionFullUpdatePayload extends TransactionFullCreatePayload {
  // Inherits all properties from TransactionFullCreatePayload
  // Used for updates when full payload structure is required
}

// Full transaction create payload with all nested objects
export interface TransactionFullCreatePayload {
  id: string;
  user_id: string;
  account_id: string;
  category_id: string;
  amount: number;
  currency: string;
  description: string;
  external_id: string;
  raw_event_id: string;
  type: 'income' | 'expense';
  occurred_at: string;
  created_at: string;
  updated_at: string;
  account: {
    id: string;
    name: string;
    type: string;
    user_id: string;
    created_at: string;
    transactions: string[];
    user: {
      id: string;
      email: string;
      created_at: string;
    };
  };
  category: {
    id: string;
    name: string;
    type: string;
    user_id: string;
    created_at: string;
    transactions: string[];
    user: {
      id: string;
      email: string;
      created_at: string;
    };
  };
  raw_event: {
    id: string;
    external_id: string;
    source: string;
    provider_hint: string;
    mail_from: string;
    mail_to: string;
    subject: string;
    message_id: string;
    payload: string;
    status: string;
    error_message: string;
    received_at: string;
    created_at: string;
    user_id: string;
    transactions: string[];
    user: {
      id: string;
      email: string;
      created_at: string;
    };
  };
  user: {
    id: string;
    email: string;
    created_at: string;
  };
}

// Full transaction payload structure for API responses
export interface TransactionFullPayload {
  id: string;
  user_id: string;
  account_id: string;
  category_id: string;
  amount: number;
  currency: string;
  description: string;
  external_id: string;
  raw_event_id: string;
  type: 'income' | 'expense';
  occurred_at: string;
  created_at: string;
  updated_at: string;
  account: {
    id: string;
    name: string;
    type: string;
    user_id: string;
    created_at: string;
    createdAt: string; // for compatibility
    transactions: string[];
    user: {
      id: string;
      email: string;
      created_at: string;
    };
  };
  category: {
    id: string;
    name: string;
    type: string;
    user_id: string;
    created_at: string;
    createdAt?: string; // for compatibility
    updatedAt?: string; // for compatibility
    transactions: string[];
    user: {
      id: string;
      email: string;
      created_at: string;
    };
  };
  raw_event: {
    id: string;
    external_id: string;
    source: string;
    provider_hint: string;
    mail_from: string;
    mail_to: string;
    subject: string;
    message_id: string;
    payload: string;
    status: string;
    error_message: string;
    received_at: string;
    created_at: string;
    user_id: string;
    transactions: string[];
    user: {
      id: string;
      email: string;
      created_at: string;
    };
  };
  user: {
    id: string;
    email: string;
    created_at: string;
  };
}

export interface TransactionsPaginationResponse {
  pagination: {
    current_page: number;
    has_next: boolean;
    has_prev: boolean;
    per_page: number;
    total: number;
    total_pages: number;
  };
  transactions: Transaction[];
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

export interface DashboardSummary {
  year: number;
  month: number;
  total_income: number;
  total_expense: number;
  net_income: number;
  saldo_akhir: number;
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
  details?: any;
}

export interface ValidationError {
  field: string;
  message: string;
}
