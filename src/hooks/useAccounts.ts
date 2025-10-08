import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountsApi } from '@/api/accounts';
import { toast } from 'sonner';
import type { AccountType } from '@/types/api';

export interface CreateAccountPayload {
  name: string;
  type: AccountType;
}

export interface UpdateAccountPayload {
  id: string;
  payload: {
    name?: string;
    type?: AccountType;
  };
}

export const useAccounts = () => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: accountsApi.getAll,
    retry: 3,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: CreateAccountPayload) => accountsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast.success('Akun berhasil dibuat');
    },
    onError: (error) => {
      console.error('Create account error:', error);
      toast.error('Gagal membuat akun');
    },
  });
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, payload }: UpdateAccountPayload) => accountsApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast.success('Akun berhasil diperbarui');
    },
    onError: (error) => {
      console.error('Update account error:', error);
      toast.error('Gagal memperbarui akun');
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => accountsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast.success('Akun berhasil dihapus');
    },
    onError: (error) => {
      console.error('Delete account error:', error);
      toast.error('Gagal menghapus akun');
    },
  });
};