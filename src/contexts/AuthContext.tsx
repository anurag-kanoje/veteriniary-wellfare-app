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
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
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
    updates: Partial<Pick<UserProfile, 'full_name' | 'avatar_url' | 'phone' | 'role' | 'address' | 'city' | 'state'>>
  ) => Promise<{ error: Error | null }>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const session = await supabase.auth.session();
        
        if (session) {
          setUser(session.user);
          setSession(session);
          
          // Fetch user profile from database
          const profileResult = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          const { data: profileData } = profileResult;
          
          if (profileData) {
            setProfile(profileData as UserProfile);
          }
        }
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
      const result = await supabase.auth.signIn({
        email,
        password,
      });

      const { data, error } = result;

      if (error) {
        return { error };
      }

      const user = data?.user;
      const session = data?.session;

      if (user && session) {
        setUser(user);
        setSession(session);
        
        // Fetch user profile
        const profileResult = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        
        const { data: profileData } = profileResult;
        
        if (profileData) {
          setProfile(profileData as UserProfile);
        }
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
      });

      const { data, error } = result;

      if (error) {
        return { error };
      }

      const user = data?.user;
      const session = data?.session;

      if (user && session) {
        setUser(user);
        setSession(session);
        
        // Create user profile in database
        const profileResult = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email,
            full_name: userData.full_name,
            role: userData.role,
            phone: userData.phone || null,
          })
          .select()
          .single();
        
        const { data: profileData, error: profileError } = profileResult;
        
        if (profileError) {
          console.error('Profile creation error:', profileError);
        } else if (profileData) {
          setProfile(profileData as UserProfile);
        }
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  }, []);

  const updateProfile = useCallback(async (
    updates: Partial<Pick<UserProfile, 'full_name' | 'avatar_url' | 'phone' | 'role' | 'address' | 'city' | 'state'>>
  ) => {
    try {
      if (!user) {
        return { error: new Error('No user logged in') };
      }

      const result = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select();

      const { data, error } = result;

      if (error) {
        return { error };
      }

      if (data && data.length > 0) {
        setProfile(data[0] as UserProfile);
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }, [user]);

  const refreshSession = useCallback(async () => {
    try {
      const session = await supabase.auth.session();
      if (session) {
        setSession(session);
        setUser(session.user);
        
        // Fetch user profile
        const profileResult = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        const { data: profileData } = profileResult;
        
        if (profileData) {
          setProfile(profileData as UserProfile);
        }
      }
    } catch (error) {
      console.error('Session refresh error:', error);
    }
  }, []);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setUser(session.user);
          setSession(session);
          
          // Fetch user profile
          const { data: profileData } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileData) {
            setProfile(profileData as UserProfile);
          }
        } else {
          setUser(null);
          setProfile(null);
          setSession(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
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