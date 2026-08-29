import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

type UserRole = 'farmer' | 'vet' | 'admin';

export type UserProfile = {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
};

type AuthContextType = {
  user: any | null;
  profile: UserProfile | null;
  session: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string, 
    password: string, 
    userData: { full_name: string; role: UserRole; phone?: string }
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  updateProfile: (
    updates: Partial<Pick<UserProfile, 'full_name' | 'avatar_url' | 'phone' | 'role'>>
  ) => Promise<{ error: Error | null }>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Auto-login for demo
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Auto-login as demo user
        const mockUser = {
          id: '1',
          email: 'demo@demo.com',
          user_metadata: {
            full_name: 'राजकुमार किसान',
            role: 'farmer',
            phone: '+91 98765 43210'
          }
        };
        
        const mockProfile: UserProfile = {
          id: '1',
          email: 'demo@demo.com',
          full_name: 'राजकुमार किसान',
          role: 'farmer',
          avatar_url: null,
          phone: '+91 98765 43210',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        setUser(mockUser);
        setProfile(mockProfile);
        setSession({ user: mockUser });
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const result = await supabase.auth.signIn({ email, password });
      const user = result.user;
      const session = result.session;
      const error = result.error;
      
      if (error) {
        return { error };
      }

      if (user && session) {
        const mockProfile: UserProfile = {
          id: user.id,
          email: user.email || '',
          full_name: (user as any).user_metadata?.full_name || 'Demo User',
          role: (user as any).user_metadata?.role || 'farmer',
          avatar_url: null,
          phone: (user as any).user_metadata?.phone || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        setUser(user);
        setProfile(mockProfile);
        setSession(session);
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }, []);

  const signUp = useCallback(async (
    email: string, 
    password: string, 
    userData: { full_name: string; role: UserRole; phone?: string }
  ) => {
    try {
      const result = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      const user = result.user;
      const session = result.session;
      const error = result.error;
      
      if (error) {
        return { error: error as Error };
      }

      if (user) {
        const mockProfile: UserProfile = {
          id: user.id,
          email: user.email || '',
          full_name: userData.full_name,
          role: userData.role,
          avatar_url: null,
          phone: userData.phone || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        setUser(user);
        setProfile(mockProfile);
        setSession(session);
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      const result = await supabase.auth.signOut();
      const error = result.error;
      
      if (error) {
        return { error: error as Error };
      }

      setUser(null);
      setProfile(null);
      setSession(null);
      
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }, []);

  const updateProfile = useCallback(async (
    updates: Partial<Pick<UserProfile, 'full_name' | 'avatar_url' | 'phone' | 'role'>>
  ) => {
    try {
      if (profile) {
        const updatedProfile = { 
          ...profile, 
          ...updates, 
          updated_at: new Date().toISOString() 
        };
        setProfile(updatedProfile);
        setUser((prev: any) => prev ? { ...prev, user_metadata: { ...prev.user_metadata, ...updates } } : null);
      }
      
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }, [profile]);

  const refreshSession = useCallback(async () => {
    try {
      const result = await supabase.auth.getSession();
      const session = result.session;
      const error = result.error;
      if (!error && session) {
        setSession(session);
        setUser(session.user);
      }
    } catch (error) {
      console.error('Session refresh error:', error);
    }
  }, []);

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
