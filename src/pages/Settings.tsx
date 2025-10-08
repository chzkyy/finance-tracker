import { useMe } from '@/hooks/useAuth';
import { useDisconnectOAuth } from '@/hooks/useOAuth';
import GoogleOAuthButton from '@/components/GoogleOAuthButton';
import Loading from '@/components/Loading';
import ErrorState from '@/components/ErrorState';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { User, Mail, AlertCircle } from 'lucide-react';

const SettingsIndex = () => {
    const { data: user, isLoading, error, refetch } = useMe();
    const disconnectOAuth = useDisconnectOAuth();

    const handleDisconnect = async () => {
        try {
            await disconnectOAuth.mutateAsync('google');
            refetch();
        } catch (error) {
            console.error('Disconnect failed:', error);
        }
    };

    const handleRefresh = () => {
        refetch();
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <Loading message="Memuat pengaturan..." />
                </div>
            </DashboardLayout>
        );
    }

    if (error || !user) {
        return (
            <DashboardLayout>
                <ErrorState
                    message="Gagal memuat pengaturan"
                    description="Terjadi kesalahan saat mengambil data. Silakan coba lagi."
                    onRetry={refetch}
                />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Pengaturan</h1>
                    <p className="text-gray-600 mt-1 text-sm sm:text-base">Kelola profil dan integrasi akun Anda</p>
                </div>

                {/* User Info */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 sm:p-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Informasi Akun</h3>
                            <div className="flex items-center space-x-2 text-gray-600 mt-1">
                                <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                <span className="text-sm sm:text-base truncate">{user.email}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* OAuth Integrations */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Integrasi Akun</h3>
                    <p className="text-gray-600 mb-6 text-sm sm:text-base">
                        Hubungkan akun email Anda untuk sinkronisasi data dan notifikasi
                    </p>

                    <div className="space-y-4">
                        {/* Google */}
                        <div className="p-3 sm:p-4 border border-gray-200 rounded-lg">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900">Google</h4>
                                        <p className="text-xs text-gray-500">Gmail integration</p>
                                    </div>
                                </div>
                                <div className="w-full sm:flex-1 sm:ml-4">
                                      <GoogleOAuthButton onDisconnect={handleDisconnect} onRefresh={handleRefresh} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="flex items-start space-x-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>Jika Anda sudah terhubung, Anda dapat memutuskan koneksi</span>
                        </div>
                        <button
                            onClick={handleDisconnect}
                            disabled={disconnectOAuth.isPending}
                            className="mt-4 text-sm text-red-600 hover:text-red-500 font-medium disabled:opacity-50 transition-colors"
                        >
                            {disconnectOAuth.isPending ? 'Memutuskan...' : 'Putuskan Semua Koneksi'}
                        </button>
                    </div>
                </div>

                {/* Actions */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Aksi Akun</h3>
                    <div className="space-y-3">
                        <p className="text-gray-600 text-sm sm:text-base">
                            Gunakan tombol di atas untuk menghubungkan atau memutuskan koneksi dengan layanan OAuth.
                        </p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SettingsIndex;
