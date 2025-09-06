import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI, tokenStorage, User } from '@/lib/api';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    username: string;
    email: string;
    password: string;
    password_confirm: string;
    full_name?: string;
  }) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.login({ email, password });
          const { user, tokens } = response.data;
          
          tokenStorage.setTokens(tokens.access, tokens.refresh);
          set({ user, isAuthenticated: true, isLoading: false });
          
          toast.success(`Welcome back, ${user.display_name}!`);
        } catch (error: any) {
          set({ isLoading: false });
          const message = error.response?.data?.non_field_errors?.[0] || 'Login failed';
          toast.error(message);
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.register(data);
          const { user, tokens } = response.data;
          
          tokenStorage.setTokens(tokens.access, tokens.refresh);
          set({ user, isAuthenticated: true, isLoading: false });
          
          toast.success(`Welcome to SynergySphere, ${user.display_name}!`);
        } catch (error: any) {
          set({ isLoading: false });
          const errors = error.response?.data;
          if (errors) {
            Object.keys(errors).forEach(key => {
              const messages = Array.isArray(errors[key]) ? errors[key] : [errors[key]];
              messages.forEach((message: string) => toast.error(message));
            });
          }
          throw error;
        }
      },

      logout: () => {
        tokenStorage.clearTokens();
        set({ user: null, isAuthenticated: false });
        toast.success('Logged out successfully');
      },

      checkAuth: async () => {
        const token = tokenStorage.getAccessToken();
        if (!token) {
          set({ user: null, isAuthenticated: false, isLoading: false });
          return;
        }

        set({ isLoading: true });
        try {
          const response = await authAPI.getCurrentUser();
          set({ user: response.data, isAuthenticated: true, isLoading: false });
        } catch (error) {
          tokenStorage.clearTokens();
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      updateUser: (userData: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...userData } });
        }
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

export const useAuth = () => {
  const store = useAuthStore();
  
  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    login: store.login,
    register: store.register,
    logout: store.logout,
    checkAuth: store.checkAuth,
    updateUser: store.updateUser,
  };
};