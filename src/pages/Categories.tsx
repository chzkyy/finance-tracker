import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesApi } from '@/api/categories';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Plus, Trash2, Edit, TrendingUp, TrendingDown } from 'lucide-react';
import { Category } from '@/types/api';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['income', 'expense']),
  icon: z.string().optional(),
  color: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function Categories() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const queryClient = useQueryClient();

  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
    retry: 3,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      type: 'expense',
      icon: '',
      color: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: categoriesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Kategori berhasil ditambahkan');
      setIsOpen(false);
      form.reset();
    },
    onError: () => toast.error('Gagal menambahkan kategori'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) =>
      categoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Kategori berhasil diperbarui');
      setIsOpen(false);
      setEditingCategory(null);
      form.reset();
    },
    onError: () => toast.error('Gagal memperbarui kategori'),
  });

  const deleteMutation = useMutation({
    mutationFn: categoriesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Kategori berhasil dihapus');
    },
    onError: () => toast.error('Gagal menghapus kategori'),
  });

  const onSubmit = (data: CategoryFormData) => {
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data });
    } else {
      createMutation.mutate({
        name: data.name,
        type: data.type,
        icon: data.icon,
        color: data.color,
      });
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    form.reset(category);
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      deleteMutation.mutate(id);
    }
  };

  // Ensure categories is always an array
  const categoriesArray = Array.isArray(categories) ? categories : [];
  const incomeCategories = categoriesArray.filter((c) => c.type === 'income');
  const expenseCategories = categoriesArray.filter((c) => c.type === 'expense');

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-96 items-center justify-center">
          <div className="text-lg text-gray-500">Memuat kategori...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-red-600 mb-2">Gagal memuat kategori</p>
            <p className="text-sm text-gray-500">Silakan refresh halaman</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kategori</h1>
            <p className="text-gray-600">Kelola kategori pemasukan dan pengeluaran</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <button 
                onClick={() => { setEditingCategory(null); form.reset(); }}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah Kategori
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Kategori</FormLabel>
                        <FormControl>
                          <Input placeholder="Contoh: Makanan, Gaji, Transport" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jenis</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="income">Pemasukan</SelectItem>
                            <SelectItem value="expense">Pengeluaran</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    {editingCategory ? 'Simpan Perubahan' : 'Tambah Kategori'}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading && (
          <div className="flex h-96 items-center justify-center">
            <div className="text-lg text-muted-foreground">Loading categories...</div>
          </div>
        )}

        {!isLoading && error && (
          <div className="flex h-96 items-center justify-center">
            <div className="text-center">
              <p className="text-lg text-destructive mb-2">Failed to load categories</p>
              <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <div className="space-y-6">
            {/* Income Categories */}
            <div>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-green-600">
                <TrendingUp className="h-5 w-5" />
                Kategori Pemasukan
              </h2>
              {incomeCategories.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                  <p className="text-gray-500">Belum ada kategori pemasukan</p>
                </div>
              ) : (
                <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nama Kategori
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Jenis
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {incomeCategories.map((category) => (
                          <tr key={category.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {category.name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                Pemasukan
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => handleEdit(category)}
                                  className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-md transition-colors"
                                  title="Edit kategori"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(category.id)}
                                  className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors"
                                  title="Hapus kategori"
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
              )}
            </div>

            {/* Expense Categories */}
            <div>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-red-600">
                <TrendingDown className="h-5 w-5" />
                Kategori Pengeluaran
              </h2>
              {expenseCategories.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                  <p className="text-gray-500">Belum ada kategori pengeluaran</p>
                </div>
              ) : (
                <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nama Kategori
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Jenis
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {expenseCategories.map((category) => (
                          <tr key={category.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {category.name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                                Pengeluaran
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => handleEdit(category)}
                                  className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-md transition-colors"
                                  title="Edit kategori"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(category.id)}
                                  className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors"
                                  title="Hapus kategori"
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
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
