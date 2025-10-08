import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsApi } from '@/api/transactions';
import { accountsApi } from '@/api/accounts';
import { categoriesApi } from '@/api/categories';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Plus, Trash2, Edit, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Transaction, TransactionFilters } from '@/types/api';
import { format } from 'date-fns';
import { useAuthStore } from '@/store/authStore';

const transactionSchema = z.object({
  account_id: z.string().min(1, 'Account is required'),
  category_id: z.string().min(1, 'Category is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  type: z.enum(['income', 'expense']),
  description: z.string().min(1, 'Description is required'),
  occurred_at: z.string().min(1, 'Date is required'),
  currency: z.string().default('IDR'),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

export default function Transactions() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [filters, setFilters] = useState<TransactionFilters>({ page: 1, limit: 10 });
  const queryClient = useQueryClient();
  
  // Get current user from auth store
  const { user } = useAuthStore();

  const { data: transactionsData, isLoading, error } = useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => transactionsApi.getAll(filters),
    retry: 3,
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  const { data: accounts } = useQuery({
    queryKey: ['accounts'],
    queryFn: accountsApi.getAll,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

  // Ensure data is always arrays with proper null checks
  const accountsArray = Array.isArray(accounts) ? accounts : [];
  const categoriesArray = Array.isArray(categories) ? categories : [];
  const transactionsArray = transactionsData?.data && Array.isArray(transactionsData.data) ? transactionsData.data : [];

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      account_id: '',
      category_id: '',
      amount: undefined,
      type: 'expense',
      description: '',
      occurred_at: format(new Date(), 'yyyy-MM-dd'),
      currency: 'IDR',
    },
  });

  const createMutation = useMutation({
    mutationFn: transactionsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Transaction created successfully');
      setIsOpen(false);
      form.reset();
    },
    onError: () => toast.error('Failed to create transaction'),
  });

  // Helper function to build full nested payload
  const buildFullPayload = (data: TransactionFormData, existingTransaction?: Transaction) => {
    const selectedAccount = accounts?.find(acc => acc.id === data.account_id);
    const selectedCategory = categories?.find(cat => cat.id === data.category_id);
    
    if (!selectedAccount || !selectedCategory || !user) {
      throw new Error('Missing required data');
    }

    return {
      id: existingTransaction?.id || crypto.randomUUID(),
      user_id: user.id,
      account_id: data.account_id,
      category_id: data.category_id,
      amount: data.amount,
      currency: data.currency,
      description: data.description,
      external_id: existingTransaction?.external_id || crypto.randomUUID(),
      raw_event_id: existingTransaction?.raw_event_id || crypto.randomUUID(),
      type: data.type,
      occurred_at: data.occurred_at,
      created_at: existingTransaction?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      account: {
        id: selectedAccount.id,
        name: selectedAccount.name,
        type: selectedAccount.type,
        user_id: selectedAccount.user_id,
        created_at: selectedAccount.created_at,
        transactions: selectedAccount.transactions || [],
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
        },
      },
      category: {
        id: selectedCategory.id,
        name: selectedCategory.name,
        type: selectedCategory.type,
        user_id: user.id,
        created_at: selectedCategory.createdAt || new Date().toISOString(),
        transactions: [],
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
        },
      },
      raw_event: {
        id: existingTransaction?.raw_event?.id || crypto.randomUUID(),
        external_id: existingTransaction?.raw_event?.external_id || crypto.randomUUID(),
        source: existingTransaction?.raw_event?.source || "manual",
        provider_hint: existingTransaction?.raw_event?.provider_hint || "manual_entry",
        mail_from: existingTransaction?.raw_event?.mail_from || "",
        mail_to: existingTransaction?.raw_event?.mail_to || "",
        subject: existingTransaction?.raw_event?.subject || `Manual transaction: ${data.description}`,
        message_id: existingTransaction?.raw_event?.message_id || "",
        payload: JSON.stringify(data),
        status: existingTransaction?.raw_event?.status || "processed",
        error_message: existingTransaction?.raw_event?.error_message || "",
        received_at: existingTransaction?.raw_event?.received_at || new Date().toISOString(),
        created_at: existingTransaction?.raw_event?.created_at || new Date().toISOString(),
        user_id: user.id,
        transactions: existingTransaction?.raw_event?.transactions || [],
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
        },
      },
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
      },
    };
  };

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      transactionsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Transaction updated successfully');
      setIsOpen(false);
      setEditingTransaction(null);
      form.reset();
    },
    onError: () => toast.error('Failed to update transaction'),
  });

  const deleteMutation = useMutation({
    mutationFn: transactionsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Transaction deleted successfully');
    },
    onError: () => toast.error('Failed to delete transaction'),
  });

  const onSubmit = (data: TransactionFormData) => {
    try {
      if (editingTransaction) {
        // Build full payload for update
        const fullUpdatePayload = buildFullPayload(data, editingTransaction);
        updateMutation.mutate({ id: editingTransaction.id, data: fullUpdatePayload });
      } else {
        // Build full payload for create
        const fullCreatePayload = buildFullPayload(data);
        createMutation.mutate(fullCreatePayload as any);
      }
    } catch (error) {
      console.error('Transaction submission error:', error);
      toast.error('Missing required data. Please refresh and try again.');
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    form.reset({
      account_id: transaction.account_id,
      category_id: transaction.category_id,
      amount: transaction.amount,
      type: transaction.type,
      description: transaction.description,
      occurred_at: format(new Date(transaction.occurred_at || transaction.created_at), 'yyyy-MM-dd'),
      currency: transaction.currency,
    });
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Transactions</h1>
            <p className="text-muted-foreground">Track all your income and expenses</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingTransaction(null); form.reset(); }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingTransaction ? 'Edit Transaction' : 'Create Transaction'}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="income">Income</SelectItem>
                            <SelectItem value="expense">Expense</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="account_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select account" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {accountsArray.map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categoriesArray.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="1000.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Monthly salary" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="occurred_at"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    {editingTransaction ? 'Update' : 'Create'}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <Select
                onValueChange={(value) => setFilters({ ...filters, type: value as 'income' | 'expense' | undefined })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
              <Select
                onValueChange={(value) => setFilters({ ...filters, accountId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All accounts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All accounts</SelectItem>
                  {accountsArray.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="date"
                placeholder="Start date"
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
              <Input
                type="date"
                placeholder="End date"
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Memuat transaksi...
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && error && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-red-600">
                      Gagal memuat transaksi. Silakan refresh halaman.
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && !error && (!transactionsData || !transactionsData.data || transactionsArray.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Tidak ada transaksi ditemukan
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && !error && transactionsData && transactionsData.data && transactionsArray.length > 0 && 
                  transactionsArray.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{format(new Date(transaction.occurred_at || transaction.created_at), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>{transaction.category?.name || 'from email'}</TableCell>
                      <TableCell>{transaction.account?.name || 'from email'}</TableCell>
                      <TableCell>
                        <span
                          className={`capitalize ${
                            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {transaction.type === 'income' ? 'Income' : 'Expense'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                          {transaction.type === 'income' ? '+' : '-'}
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: transaction.currency || 'IDR',
                          }).format(transaction.amount)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(transaction)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(transaction.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((filters.page || 1) - 1) * (filters.limit || 10) + 1} to{' '}
            {Math.min((filters.page || 1) * (filters.limit || 10), transactionsData?.total || 0)} of{' '}
            {transactionsData?.total || 0} transactions
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={filters.page === 1}
              onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={!transactionsData || filters.page === transactionsData.totalPages}
              onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
