import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { login as loginApi, loginAdmin, register as registerApi, getProfile } from '@/lib/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  cart?: Array<{ product: string; quantity: number }>;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<User>;
  adminSignIn: (email: string, password: string) => Promise<User>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = 'threads_trinkets_auth_token';

const getStoredToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

const setStoredToken = (token: string) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

const clearStoredToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshProfile = async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      return;
    }

    try {
      setLoading(true);
      const profile = await getProfile();
      setUser(profile);
      setError(null);
    } catch (err) {
      clearStoredToken();
      setUser(null);
      setError((err as Error).message || 'Unable to load profile');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<User> => {
    setLoading(true);
    setError(null);

    try {
      const result = await loginApi({ email, password });
      setStoredToken(result.token);
      setUser(result.user);
      return result.user;
    } catch (err) {
      setError((err as Error).message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const adminSignIn = async (email: string, password: string): Promise<User> => {
    setLoading(true);
    setError(null);

    try {
      const result = await loginAdmin({ email, password });
      setStoredToken(result.token);
      setUser(result.user);
      return result.user;
    } catch (err) {
      setError((err as Error).message || 'Admin login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await registerApi({ name, email, password });
      setStoredToken(result.token);
      setUser(result.user);
    } catch (err) {
      setError((err as Error).message || 'Sign-up failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    clearStoredToken();
    setUser(null);
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, signIn, adminSignIn, signUp, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
