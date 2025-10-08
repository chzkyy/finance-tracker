import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import axiosInstance from '@/lib/axios';

interface User {
  id: string;
  email: string;
  created_at: string;
}

interface MeResponse {
  id: string;
  email: string;
  created_at: string;
}

// Function to fetch current user data
const fetchMe = async (): Promise<User> => {
  try {
    const response = await axiosInstance.get<MeResponse>('/auth/me');
    if (!response.data || !response.data.id || !response.data.email) {
      throw new Error('Invalid response format from /auth/me');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error; // Re-throw the error so React Query can handle it
  }
};

// Hook to get current user data
export const useMe = () => {
  const token = useAuthStore((state) => state.token);
  // Also check localStorage as a fallback
  const localToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const effectiveToken = token || localToken;
  
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      if (!effectiveToken) {
        throw new Error('No authentication token available');
      }
      return fetchMe();
    },
    enabled: !!effectiveToken, // Only run query if user is authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401 errors (unauthorized)
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
    throwOnError: false, // Don't throw errors, handle them in the component
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: true, // Refetch when component mounts
  });
};