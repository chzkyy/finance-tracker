import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, TrendingUp } from 'lucide-react';

export default function Reports() {
  return (
    <DashboardLayout>
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Clock className="h-10 w-10 text-primary" />
            </div>
            
            <h1 className="mb-2 text-3xl font-bold">Coming Soon</h1>
            
            <p className="mb-6 text-muted-foreground">
              Advanced financial reports and analytics are coming soon. 
              Stay tuned for detailed insights into your financial data!
            </p>
            
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Reports & Analytics</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
