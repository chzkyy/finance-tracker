import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  created_at: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (token, user) => {
        localStorage.setItem('auth_token', token);
        set({ token, user, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('auth_token');
        set({ token: null, user: null, isAuthenticated: false });
      },
      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
      // Ensure token is synced from localStorage on hydration
      onRehydrateStorage: () => (state) => {
        if (state) {
          const token = localStorage.getItem('auth_token');
          if (token && !state.token) {
            state.token = token;
            state.isAuthenticated = true;
          } else if (!token && state.token) {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
          }
        }
      },
    }
  )
);
