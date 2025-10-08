import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';

interface DisconnectResponse {
  success: boolean;
  message: string;
}

interface DisconnectRequest {
  provider: string;
}

// Function to disconnect OAuth connection
const disconnectOAuth = async (provider: string): Promise<DisconnectResponse> => {
  const response = await axiosInstance.post<DisconnectResponse>('/oauth/disconnect', {
    provider
  });
  return response.data;
};

// Hook for disconnecting OAuth
export const useDisconnectOAuth = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: disconnectOAuth,
    onSuccess: (data) => {
      toast.success(data.message || 'OAuth connection disconnected successfully');
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['oauth'] });
    },
    onError: (error: any) => {
      console.error('Disconnect OAuth error:', error);
      toast.error(error.response?.data?.message || 'Failed to disconnect OAuth');
    },
  });
};