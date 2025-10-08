import { Button } from '@/components/ui/button';
import { Download, Smartphone } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { toast } from 'sonner';

export const PWAInstallButton = () => {
  const { canInstall, isInstalled, promptInstall } = usePWAInstall();

  const handleInstall = async () => {
    const success = await promptInstall();
    if (success) {
      toast.success('App installed successfully!');
    } else {
      toast.error('Installation was cancelled or failed');
    }
  };

  // Don't show anything if already installed or can't install
  if (isInstalled || !canInstall) {
    return null;
  }

  return (
    <Button
      onClick={handleInstall}
      variant="outline"
      size="sm"
      className="flex items-center space-x-2 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
    >
      <Smartphone className="w-4 h-4" />
      <Download className="w-4 h-4" />
      <span className="hidden sm:inline">Install App</span>
      <span className="sm:hidden">Install</span>
    </Button>
  );
};

export default PWAInstallButton;