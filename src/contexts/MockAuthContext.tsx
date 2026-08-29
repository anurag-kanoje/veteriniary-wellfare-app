import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

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
  user: UserProfile | null;
  profile: UserProfile | null;
  session: any;
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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mock user data for demo
  const mockUser: UserProfile = {
    id: '1',
    email: 'farmer@demo.com',
    full_name: 'राजकुमार किसान',
    role: 'farmer',
    avatar_url: null,
    phone: '+91 98765 43210',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  useEffect(() => {
    // Simulate loading and auto-login for demo
    setTimeout(() => {
      setUser(mockUser);
      setProfile(mockUser);
      setSession({ user: mockUser });
      setLoading(false);
    }, 1000);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === 'demo@demo.com' && password === 'demo123') {
        setUser(mockUser);
        setProfile(mockUser);
        setSession({ user: mockUser });
        return { error: null };
      } else {
        return { error: new Error('Invalid credentials. Use demo@demo.com / demo123') };
      }
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: UserProfile = {
        id: Date.now().toString(),
        email,
        full_name: userData.full_name,
        role: userData.role,
        avatar_url: null,
        phone: userData.phone || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setUser(newUser);
      setProfile(newUser);
      setSession({ user: newUser });
      
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
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
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (profile) {
        const updatedProfile = { ...profile, ...updates, updated_at: new Date().toISOString() };
        setProfile(updatedProfile);
        setUser(updatedProfile);
      }
      
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }, [profile]);

  const refreshSession = useCallback(async () => {
    // Mock refresh - no-op
    return;
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
