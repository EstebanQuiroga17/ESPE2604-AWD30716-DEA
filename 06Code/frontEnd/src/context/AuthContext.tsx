import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User, SriConnectionStatus } from '../types';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface AuthContextValue {
  currentUser: User | null;
  isAuthenticated: boolean;
  sriConnectionStatus: SriConnectionStatus;
  login: (identifier: string, password: string) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  loginAsAdmin: () => void;
  logout: () => void;
  connectToSri: (username: string, password: string) => Promise<boolean>;
  disconnectFromSri: () => void;
  updateCurrentUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const stored = typeof window !== 'undefined' ? localStorage.getItem('currentUser') : null;
  const initialUser = stored ? JSON.parse(stored) as User : null;
  if (initialUser) {
    axios.defaults.headers.common['X-User-Id'] = initialUser.id;
  }
  const [currentUser, setCurrentUser] = useState<User | null>(initialUser);
  const [sriConnectionStatus, setSriConnectionStatus] = useState<SriConnectionStatus>('disconnected');

  const login = useCallback(async (identifier: string, password: string): Promise<boolean> => {
    if (!identifier || !password) {
      console.error('Login validation: identifier and password are required');
      return false;
    }
    try {
      const response = await axios.post(`${API_URL}/users/login`, {
        email: identifier,
        password: password
      });
      if (response.data.success) {
        const user = response.data.data;
        setCurrentUser(user);
        try { localStorage.setItem('currentUser', JSON.stringify(user)); } catch {}
        // set header for subsequent requests
        axios.defaults.headers.common['X-User-Id'] = user.id;
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  }, []);

  const register = useCallback(async (data: any): Promise<boolean> => {
    try {
      const response = await axios.post(`${API_URL}/users/register`, data);
      if (response.data.success) {
        setCurrentUser(response.data.data);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Register error:", error);
      return false;
    }
  }, []);

  const loginAsAdmin = useCallback(() => {
    
    setCurrentUser({
      id: '07787dd8-aafa-4c6d-a49c-07595438199d',
      ruc: '1790011223002',
      role: 'admin',
      firstName: 'David',
      lastName: 'Admin',
      email: 'david26@gmail.com',
      birthDate: '1990-01-01',
      createdAt: '2026-05-04T02:06:07.024Z'
    });
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setSriConnectionStatus('disconnected');
    try { localStorage.removeItem('currentUser'); } catch {}
    delete axios.defaults.headers.common['X-User-Id'];
  }, []);

  const connectToSri = useCallback(async (username: string, password: string): Promise<boolean> => {
    setSriConnectionStatus('pending');
    await new Promise(resolve => setTimeout(resolve, 2000));
    if (username && password) {
      setSriConnectionStatus('connected');
      return true;
    }
    setSriConnectionStatus('disconnected');
    return false;
  }, []);

  const disconnectFromSri = useCallback(() => {
    setSriConnectionStatus('disconnected');
  }, []);

  const updateCurrentUser = useCallback((data: Partial<User>) => {
    setCurrentUser(prev => prev ? { ...prev, ...data } : null);
  }, []);

  const contextValue: AuthContextValue = {
    currentUser,
    isAuthenticated: currentUser !== null,
    sriConnectionStatus,
    login,
    register,
    loginAsAdmin,
    logout,
    connectToSri,
    disconnectFromSri,
    updateCurrentUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
