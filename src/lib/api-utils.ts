import { ApiResponse } from '@/types/api';

/**
 * Handles API response extraction - supports both direct data and wrapped data responses
 */
export function extractApiData<T>(response: T | ApiResponse<T>): T {
  if (response && typeof response === 'object' && 'data' in response) {
    return response.data;
  }
  return response as T;
}

/**
 * Formats currency values consistently
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats date consistently
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

/**
 * Handles API errors consistently
 */
export function handleApiError(error: any): string {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
}