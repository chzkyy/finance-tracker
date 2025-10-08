import React from 'react';
import { useAccounts, useCreateAccount, useUpdateAccount, useDeleteAccount } from '@/hooks/useAccounts';
import { formatDate } from '@/lib/fmt';
import Loading from '@/components/Loading';
import ErrorState from '@/components/ErrorState';
import Empty from '@/components/Empty';
import ConfirmDialog from '@/components/ConfirmDialog';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Plus, Edit, Trash2 } from 'lucide-react';
import type { Account, AccountType } from '@/types/api';

interface CreateAccountPayload {
  name: string;
  type: AccountType;
}

const AccountsIndex = () => {
    const [showForm, setShowForm] = React.useState(false);
    const [editAccount, setEditAccount] = React.useState<Account | null>(null);
    const [deleteAccount, setDeleteAccount] = React.useState<Account | null>(null);
    const [formData, setFormData] = React.useState<CreateAccountPayload>({
        name: '',
        type: 'bank'
    });

    const { data: accounts = [], isLoading, error, refetch } = useAccounts();
    const createMutation = useCreateAccount();
    const updateMutation = useUpdateAccount();
    const deleteMutation = useDeleteAccount();

    const resetForm = () => {
        setFormData({ name: '', type: 'bank' });
        setShowForm(false);
        setEditAccount(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editAccount) {
                await updateMutation.mutateAsync({ id: editAccount.id, payload: formData });
            } else {
                await createMutation.mutateAsync(formData);
            }
            resetForm();
        } catch (error) {
            console.error('Account operation failed:', error);
        }
    };

    const handleEdit = (account: Account) => {
        setEditAccount(account);
        setFormData({ name: account.name, type: account.type });
        setShowForm(true);
    };

    const handleDelete = async () => {
        if (deleteAccount) {
            try {
                await deleteMutation.mutateAsync(deleteAccount.id);
                setDeleteAccount(null);
            } catch (error) {
                console.error('Delete failed:', error);
            }
        }
    };

    if (error) {
        return (
            <DashboardLayout>
                <ErrorState
                    message="Gagal memuat akun"
                    description="Terjadi kesalahan saat mengambil data. Silakan coba lagi."
                    onRetry={refetch}
                />
            </DashboardLayout>
        );
    }

    const getAccountTypeLabel = (type: AccountType) => {
        switch (type) {
            case 'bank': return 'Bank';
            case 'ewallet': return 'E-Wallet';
            case 'cash': return 'Tunai';
            default: return type;
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Akun</h1>
                        <p className="text-gray-600">Kelola akun keuangan Anda</p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Akun
                    </button>
                </div>

                {showForm && (
                    <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                {editAccount ? 'Edit Akun' : 'Tambah Akun Baru'}
                            </h3>
                            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Nama Akun
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Contoh: BCA, Dana, Dompet"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="account-type-group" className="block text-sm font-medium text-gray-700 mb-2">
                                    Jenis Akun
                                </label>
                                <div id="account-type-group" className="grid grid-cols-3 gap-4">
                                    {(['bank', 'ewallet', 'cash'] as AccountType[]).map((type) => (
                                        <label key={type} className="relative">
                                            <input
                                                type="radio"
                                                name="type"
                                                value={type}
                                                checked={formData.type === type}
                                                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as AccountType }))}
                                                className="sr-only peer"
                                            />
                                            <div className={`w-full p-3 text-center border-2 rounded-lg cursor-pointer transition-colors ${
                                                formData.type === type
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                                                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                            }`}>
                                                {getAccountTypeLabel(type)}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={createMutation.isPending || updateMutation.isPending}
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {(() => {
                                        if (createMutation.isPending || updateMutation.isPending) {
                                            return 'Menyimpan...';
                                        }
                                        if (editAccount) {
                                            return 'Simpan Perubahan';
                                        }
                                        return 'Tambah Akun';
                                    })()}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {(() => {
                    if (isLoading) {
                        return (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                                <Loading message="Memuat akun..." />
                            </div>
                        );
                    }

                    if (accounts.length === 0) {
                        return (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                                <Empty
                                    message="Belum ada akun"
                                    description="Tambahkan akun untuk melacak transaksi Anda."
                                    action={
                                        <button
                                            onClick={() => setShowForm(true)}
                                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Tambah Akun Pertama
                                        </button>
                                    }
                                />
                            </div>
                        );
                    }

                    return (
                        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Nama
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Jenis
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Dibuat
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {accounts.map((account) => (
                                            <tr key={account.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {account.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800">
                                                        {getAccountTypeLabel(account.type)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(account.created_at)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <button
                                                            onClick={() => handleEdit(account)}
                                                            className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-md transition-colors"
                                                            title="Edit akun"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteAccount(account)}
                                                            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors"
                                                            title="Hapus akun"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    );
                })()}

                <ConfirmDialog
                    isOpen={!!deleteAccount}
                    onClose={() => setDeleteAccount(null)}
                    onConfirm={handleDelete}
                    title="Hapus Akun"
                    message="Apakah Anda yakin ingin menghapus akun ini? Tindakan ini tidak dapat dibatalkan."
                    confirmText="Hapus"
                    type="danger"
                />
            </div>
        </DashboardLayout>
    );
};

export default AccountsIndex;
