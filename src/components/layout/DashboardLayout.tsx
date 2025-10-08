import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Wallet,
  Tag,
  Receipt,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PWAInstallButton } from '@/components/PWAInstallButton';

interface DashboardLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Accounts', href: '/accounts', icon: Wallet },
  { name: 'Categories', href: '/categories', icon: Tag },
  { name: 'Transactions', href: '/transactions', icon: Receipt },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function DashboardLayout({ children }: Readonly<DashboardLayoutProps>) {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={closeSidebar}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              closeSidebar();
            }
          }}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 border-r bg-card transform transition-transform duration-300 ease-in-out",
        "lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b px-6">
            <h1 className="text-xl font-bold text-primary">FinanceTracker</h1>
            {/* Close button for mobile */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={closeSidebar}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={closeSidebar} // Close sidebar on mobile when navigation item is clicked
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="border-t p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">{user?.email}</p>
                <p className="truncate text-xs text-muted-foreground">User</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="flex h-16 items-center justify-between border-b bg-card px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-bold text-primary">FinanceTracker</h1>
          <PWAInstallButton />
        </div>
      </div>

      {/* Main Content */}
      <main className="lg:ml-64">
        <div className="container mx-auto p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
}
