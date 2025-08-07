import { supabase } from './supabase';
import type { SignUpCredentials, SignInCredentials, User, AuthError } from '@/types/auth';

export class AuthService {
  /**
   * Sign up a new user
   */
  static async signUp(credentials: SignUpCredentials) {
    try {
      const { email, password, firstName, lastName } = credentials;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  /**
   * Sign in an existing user
   */
  static async signIn(credentials: SignInCredentials) {
    try {
      const { email, password } = credentials;
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  /**
   * Sign out the current user
   */
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }

      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  /**
   * Get the current session
   */
  static async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }

      return { session, error: null };
    } catch (error: any) {
      return { session: null, error: error.message };
    }
  }

  /**
   * Get the current user
   */
  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        throw error;
      }

      return { user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        throw error;
      }

      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  /**
   * Update user password
   */
  static async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) {
        throw error;
      }

      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  /**
   * Update user metadata
   */
  static async updateProfile(updates: Partial<User>) {
    try {
      const { error } = await supabase.auth.updateUser({
        data: updates,
      });
      
      if (error) {
        throw error;
      }

      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }
}