import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthService } from '@/services/auth';
import { supabase } from '@/services/supabase';
import type { AuthState, SignUpCredentials, SignInCredentials, User } from '@/types/auth';

interface AuthStore extends AuthState {
  // Actions
  signUp: (credentials: SignUpCredentials) => Promise<{ error: string | null }>;
  signIn: (credentials: SignInCredentials) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updateProfile: (updates: Partial<User>) => Promise<{ error: string | null }>;
  initialize: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      session: null,
      isLoading: false,
      isAuthenticated: false,

      // Actions
      signUp: async (credentials: SignUpCredentials) => {
        set({ isLoading: true });
        
        try {
          const { data, error } = await AuthService.signUp(credentials);
          
          if (error) {
            set({ isLoading: false });
            return { error };
          }

          if (data?.user && data?.session) {
            set({
              user: data.user,
              session: data.session,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({ isLoading: false });
          }

          return { error: null };
        } catch (error: any) {
          set({ isLoading: false });
          return { error: error.message || 'Sign up failed' };
        }
      },

      signIn: async (credentials: SignInCredentials) => {
        set({ isLoading: true });
        
        try {
          const { data, error } = await AuthService.signIn(credentials);
          
          if (error) {
            set({ isLoading: false });
            return { error };
          }

          if (data?.user && data?.session) {
            set({
              user: data.user,
              session: data.session,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({ isLoading: false });
          }

          return { error: null };
        } catch (error: any) {
          set({ isLoading: false });
          return { error: error.message || 'Sign in failed' };
        }
      },

      signOut: async () => {
        set({ isLoading: true });
        
        try {
          await AuthService.signOut();
          set({
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } catch (error: any) {
          console.error('Sign out error:', error);
          // Clear state anyway
          set({
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      resetPassword: async (email: string) => {
        set({ isLoading: true });
        
        try {
          const { error } = await AuthService.resetPassword(email);
          set({ isLoading: false });
          return { error };
        } catch (error: any) {
          set({ isLoading: false });
          return { error: error.message || 'Password reset failed' };
        }
      },

      updateProfile: async (updates: Partial<User>) => {
        set({ isLoading: true });
        
        try {
          const { error } = await AuthService.updateProfile(updates);
          
          if (!error && get().user) {
            set({
              user: { ...get().user!, ...updates },
              isLoading: false,
            });
          } else {
            set({ isLoading: false });
          }

          return { error };
        } catch (error: any) {
          set({ isLoading: false });
          return { error: error.message || 'Profile update failed' };
        }
      },

      initialize: async () => {
        set({ isLoading: true });
        
        try {
          const { session, error } = await AuthService.getSession();
          
          if (session?.user) {
            set({
              user: session.user,
              session,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({
              user: null,
              session: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } catch (error: any) {
          console.error('Auth initialization error:', error);
          set({
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      clearError: () => {
        // This can be extended if you add error state
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Set up auth state listener
supabase.auth.onAuthStateChange((event, session) => {
  const { user, isAuthenticated } = useAuthStore.getState();
  
  switch (event) {
    case 'SIGNED_IN':
      if (session?.user) {
        useAuthStore.setState({
          user: session.user,
          session,
          isAuthenticated: true,
          isLoading: false,
        });
      }
      break;
      
    case 'SIGNED_OUT':
      useAuthStore.setState({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
      });
      break;
      
    case 'TOKEN_REFRESHED':
      if (session?.user) {
        useAuthStore.setState({
          user: session.user,
          session,
          isAuthenticated: true,
        });
      }
      break;
      
    default:
      break;
  }
});