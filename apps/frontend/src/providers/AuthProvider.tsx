'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { api } from '@/lib/api';

interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  mfaEnabled: boolean;
  mustChangePassword: boolean;
  dataScopes: Array<{ type: string; entityId?: string; label?: string }>;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, mfaCode?: string) => Promise<{ success: boolean; mfaRequired?: boolean; error?: string }>;
  logout: () => Promise<void>;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      api.post('/auth/me').then(({ data }) => setUser(data.user)).catch(() => sessionStorage.clear()).finally(() => setIsLoading(false));
    } else { setIsLoading(false); }
  }, []);

  const login = useCallback(async (email: string, password: string, mfaCode?: string) => {
    try {
      const { data } = await api.post('/auth/login', { email, password, mfaCode });
      if (data.mfaRequired) return { success: false, mfaRequired: true };
      sessionStorage.setItem('accessToken', data.accessToken);
      sessionStorage.setItem('refreshToken', data.refreshToken);
      setUser(data.user);
      return { success: true };
    } catch (err: any) { return { success: false, error: err.response?.data?.message || 'Login failed' }; }
  }, []);

  const logout = useCallback(async () => {
    try { const rt = sessionStorage.getItem('refreshToken'); if (rt) await api.post('/auth/logout', { refreshToken: rt }); } catch {}
    sessionStorage.clear(); setUser(null); window.location.href = '/login';
  }, []);

  const hasRole = useCallback((role: string) => user?.roles.includes(role) || false, [user]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
