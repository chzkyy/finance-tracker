import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { dashboardApi } from '@/api/dashboard';
import { transactionsApi } from '@/api/transactions';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const getMonthName = (month: number): string => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return monthNames[month - 1] || 'Unknown';
};

export default function Dashboard() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
  
  // Get first day of current month for from_date
  const firstDayOfMonth = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`;
  
  // Pagination state for transactions
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data: summary, isLoading, error } = useQuery({
    queryKey: ['dashboard', currentYear, currentMonth],
    queryFn: () => dashboardApi.getSummary(currentYear, currentMonth),
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get recent transactions from current month
  const { data: transactionsData, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['dashboard-transactions', firstDayOfMonth, currentPage],
    queryFn: () => transactionsApi.getAll({ 
      page: currentPage, 
      limit: 10,
      startDate: firstDayOfMonth 
    }),
    retry: 3,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-96 items-center justify-center">
          <div className="text-lg text-muted-foreground">Loading dashboard...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-destructive mb-2">Failed to load dashboard</p>
            <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Financial overview for {summary ? `${getMonthName(summary.month)} ${summary.year}` : 'current period'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Saldo</CardTitle>
              <TrendingUp className={`h-4 w-4 ${(summary?.saldo_akhir || 0) >= 0 ? 'text-success' : 'text-destructive'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${(summary?.saldo_akhir || 0) >= 0 ? 'text-success' : 'text-destructive'}`}>
                Rp {summary?.saldo_akhir.toLocaleString('id-ID') || '0'}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                Rp {summary?.total_income.toLocaleString('id-ID') || '0'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Expense</CardTitle>
              <ArrowDownRight className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                Rp {summary?.total_expense.toLocaleString('id-ID') || '0'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Net Income</CardTitle>
              <TrendingUp className={`h-4 w-4 ${(summary?.net_income || 0) >= 0 ? 'text-success' : 'text-destructive'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${(summary?.net_income || 0) >= 0 ? 'text-success' : 'text-destructive'}`}>
                Rp {summary?.net_income.toLocaleString('id-ID') || '0'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Transactions
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {transactionsData?.total || 0} transactions this month
            </p>
          </CardHeader>
          <CardContent>
            {isLoadingTransactions ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-sm text-muted-foreground">Loading transactions...</div>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {transactionsData?.data?.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{transaction.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.type === 'income' 
                              ? 'bg-success/10 text-success' 
                              : 'bg-destructive/10 text-destructive'
                          }`}>
                            {transaction.type === 'income' ? '↑' : '↓'} {transaction.type}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Intl.DateTimeFormat('id-ID', {
                              timeZone: 'Asia/Jakarta',
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            }).format(new Date(transaction.occurred_at))}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-semibold ${
                          transaction.type === 'income' ? 'text-success' : 'text-destructive'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}Rp {transaction.amount.toLocaleString('id-ID')}
                        </p>
                        <p className="text-xs text-muted-foreground">{transaction.currency}</p>
                      </div>
                    </div>
                  ))}
                  
                  {(!transactionsData?.data || transactionsData.data.length === 0) && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No transactions found for this month</p>
                    </div>
                  )}
                </div>
                
                {/* Pagination Controls */}
                {transactionsData && transactionsData.totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t mt-4">
                    <div className="text-sm text-muted-foreground">
                      Page {transactionsData.page} of {transactionsData.totalPages}
                      <span className="ml-2">
                        ({transactionsData.total} total transactions)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={transactionsData.page <= 1}
                        className="flex items-center gap-1"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={transactionsData.page >= transactionsData.totalPages}
                        className="flex items-center gap-1"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
