import { RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  description?: string;
  onRetry?: () => void;
}

const ErrorState = ({ message, description, onRetry }: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 text-red-500">
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">{message}</h3>
        {description && (
          <p className="text-gray-600 mb-4">{description}</p>
        )}
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Coba Lagi
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorState;