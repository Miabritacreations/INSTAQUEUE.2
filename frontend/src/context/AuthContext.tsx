import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { User } from '../types';
import { authService } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const login = useCallback(async (email: string, password: string) => {
    const response = await authService.login(email, password);
    setUser(response.data.user);
    setToken(response.data.token);
    localStorage.setItem('token', response.data.token);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    await authService.register(name, email, password);
  }, []);

  const logout = useCallback(async () => {
    try {
      // Call backend logout endpoint
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with logout even if backend call fails
    } finally {
      // Clear local state and storage
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
