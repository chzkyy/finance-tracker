import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';
import Loading from '@/components/Loading';
import ErrorState from '@/components/ErrorState';

interface CallbackResponse {
  success: boolean;
  message: string;
}

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        console.log('OAuth callback processing:', {
          code: code ? `${code.substring(0, 20)}...` : null,
          state: state ? `${state.substring(0, 50)}...` : null,
          allParams: Array.from(searchParams.entries())
        });

        if (!code || !state) {
          throw new Error('Missing authorization code or state parameter');
        }

        // Call the backend callback endpoint - only pass code and state as per your curl example
        const response = await axiosInstance.get<CallbackResponse>(
          `/oauth/google/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`
        );

        if (response.data.success) {
          toast.success(response.data.message || 'Google account connected successfully!');
          // Redirect to settings page
          navigate('/settings', { replace: true });
        } else {
          throw new Error(response.data.message || 'Failed to connect Google account');
        }
      } catch (error: any) {
        console.error('OAuth callback error:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to complete OAuth connection';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsProcessing(false);
      }
    };

    processCallback();
  }, [searchParams, navigate]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md w-full mx-4">
          <Loading message="Memproses koneksi Google..." />
          <p className="text-center text-gray-600 mt-4">
            Mohon tunggu sebentar, kami sedang menghubungkan akun Google Anda.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-4">
          <ErrorState
            message="Gagal menghubungkan akun Google"
            description={error}
            onRetry={() => navigate('/settings', { replace: true })}
          />
        </div>
      </div>
    );
  }

  // This shouldn't be reached, but just in case
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Koneksi Berhasil</h2>
          <p className="text-gray-600 mb-4">
            Akun Google Anda telah berhasil terhubung.
          </p>
          <button
            onClick={() => navigate('/settings', { replace: true })}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Kembali ke Pengaturan
          </button>
        </div>
      </div>
    </div>
  );
};

export default OAuthCallback;