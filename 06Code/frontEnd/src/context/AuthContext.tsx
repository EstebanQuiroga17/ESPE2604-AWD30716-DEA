import React, { createContext, useContext, useState, useCallback } from 'react';
import type { TaxPayer, SriConnectionStatus, Workspace } from '../types';
import { MockWorkspaces } from '../data/mockData';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface AuthContextValue {
  currentUser: TaxPayer | null;
  isAuthenticated: boolean;
  sriConnectionStatus: SriConnectionStatus;
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  login: (identifier: string, password: string) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  loginAsAdmin: () => void;
  logout: () => void;
  connectToSri: (username: string, password: string) => Promise<boolean>;
  disconnectFromSri: () => void;
  updateCurrentUser: (data: Partial<TaxPayer>) => void;
  createWorkspace: (name: string, description: string, workspaceLocation: string, period: any) => Promise<Workspace | null>;
  deleteWorkspace: (workspaceId: string) => Promise<boolean>;
  selectWorkspace: (workspace: Workspace) => void;
  loadWorkspaces: () => Promise<void>;
  loginGoogle: (credential: string) => Promise<{ success: boolean; needsProfileCompletion?: boolean }>;
  completeProfile: (data: any) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const stored = typeof window !== 'undefined' ? localStorage.getItem('currentUser') : null;
  const initialUser = stored ? JSON.parse(stored) as TaxPayer : null;
  if (initialUser) {
    axios.defaults.headers.common['X-User-Id'] = initialUser.id;
  }
  const [currentUser, setCurrentUser] = useState<TaxPayer | null>(initialUser);
  const [sriConnectionStatus, setSriConnectionStatus] = useState<SriConnectionStatus>('disconnected');
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

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
        const mappedUser = { ...user, RUC: user.ruc, firstLastName: user.lastName, secondName: user.middleName, isAdmin: user.role === 'admin' };
        setCurrentUser(mappedUser);
        try { localStorage.setItem('currentUser', JSON.stringify(mappedUser)); } catch {}
        // set header for subsequent requests
        axios.defaults.headers.common['X-User-Id'] = mappedUser.id;
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
      const payload = {
        firstName: data.firstName,
        middleName: data.secondName,
        lastName: data.firstLastName,
        secondLastName: data.secondLastName,
        ruc: data.RUC,
        email: data.email,
        password: data.password,
        birthDate: data.birthDate
      };
      const response = await axios.post(`${API_URL}/users/register`, payload);
      if (response.data.success) {
        const user = response.data.data;
        setCurrentUser({ ...user, RUC: user.ruc, firstLastName: user.lastName, secondName: user.middleName });
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
      RUC: '1790011223002',
      isAdmin: true,
      firstName: 'David',
      firstLastName: 'Admin',
      email: 'david26@gmail.com',
      birthDate: '1990-01-01',
      createdAt: '2026-05-04T02:06:07.024Z'
    });
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setSriConnectionStatus('disconnected');
    setCurrentWorkspace(null);
    setWorkspaces([]);
    try { localStorage.removeItem('currentUser'); } catch {}
    try { localStorage.removeItem('currentWorkspace'); } catch {}
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

  const updateCurrentUser = useCallback((data: Partial<TaxPayer>) => {
    setCurrentUser(prev => prev ? { ...prev, ...data } : null);
  }, []);

  const createWorkspace = useCallback(async (name: string, description: string, workspaceLocation: string, period: any): Promise<Workspace | null> => {
    if (!currentUser) return null;
    try {
      const newWorkspace: Workspace = {
        id: `ws-${Date.now()}`,
        name,
        description,
        ownerId: currentUser.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sriConnectionStatus: 'disconnected',
        lastActivityAt: new Date().toISOString(),
        invoicesCount: 0,
        atsFilesCount: 0,
        workspaceLocation,
        period,
        processTracer: {
          invoicedDownloadStatus: false,
          atsXlsmGenerationStatus: false,
          atsXmlGenerationStatus: false,
        },
      };
      setWorkspaces(prev => [...prev, newWorkspace]);
      return newWorkspace;
    } catch (error) {
      console.error("Error creating workspace:", error);
      return null;
    }
  }, [currentUser]);

  const deleteWorkspace = useCallback(async (workspaceId: string): Promise<boolean> => {
    try {
      setWorkspaces(prev => prev.filter(ws => ws.id !== workspaceId));
      if (currentWorkspace?.id === workspaceId) {
        setCurrentWorkspace(null);
      }
      return true;
    } catch (error) {
      console.error("Error deleting workspace:", error);
      return false;
    }
  }, [currentWorkspace]);

  const selectWorkspace = useCallback((workspace: Workspace) => {
    setCurrentWorkspace(workspace);
    try {
      localStorage.setItem('currentWorkspace', JSON.stringify(workspace));
    } catch {}
  }, []);

  const loadWorkspaces = useCallback(async () => {
    if (!currentUser?.id) return;
    try {
      const mockWorkspaces = MockWorkspaces.map(ws => ({
        ...ws,
        ownerId: currentUser.id,
      }));
      setWorkspaces(mockWorkspaces);
      
      const stored = typeof window !== 'undefined' ? localStorage.getItem('currentWorkspace') : null;
      if (stored) {
        try {
          const saved = JSON.parse(stored) as Workspace;
          const found = mockWorkspaces.find(ws => ws.id === saved.id);
          if (found) setCurrentWorkspace(found);
        } catch {}
      }
    } catch (error) {
      console.error("Error loading workspaces:", error);
    }
  }, [currentUser?.id]);

  const contextValue: AuthContextValue = {
    currentUser,
    isAuthenticated: currentUser !== null,
    sriConnectionStatus,
    currentWorkspace,
    workspaces,
    login,
    register,
    loginAsAdmin,
    logout,
    connectToSri,
    disconnectFromSri,
    updateCurrentUser,
    createWorkspace,
    deleteWorkspace,
    selectWorkspace,
    loadWorkspaces,
  };

  const loginGoogle = useCallback(async (credential: string) => {
    try {
      const response = await axios.post(`${API_URL}/users/login/google`, { credential });
      if (response.data.success) {
        const user = response.data.data;
        const mappedUser = { ...user, RUC: user.ruc, firstLastName: user.lastName, secondName: user.middleName };
        if (!response.data.needsProfileCompletion) {
          setCurrentUser(mappedUser);
          try { localStorage.setItem('currentUser', JSON.stringify(mappedUser)); } catch {}
          axios.defaults.headers.common['X-User-Id'] = mappedUser.id;
        } else {
          try { localStorage.setItem('incompleteUser', JSON.stringify(mappedUser)); } catch {}
        }
        return { success: true, needsProfileCompletion: response.data.needsProfileCompletion };
      }
      return { success: false };
    } catch (error) {
      console.error("Google login error:", error);
      return { success: false };
    }
  }, []);

  const completeProfile = useCallback(async (data: any) => {
    try {
      const stored = localStorage.getItem('incompleteUser');
      if (!stored) return false;
      const incompleteUser = JSON.parse(stored);
      
      const payload = {
        email: incompleteUser.email,
        firstName: data.firstName,
        middleName: data.secondName,
        lastName: data.firstLastName,
        secondLastName: data.secondLastName,
        ruc: data.RUC,
        birthDate: data.birthDate
      };
      
      const response = await axios.post(`${API_URL}/users/complete-profile`, payload);
      if (response.data.success) {
        const user = response.data.data;
        const mappedUser = { ...user, RUC: user.ruc, firstLastName: user.lastName, secondName: user.middleName };
        setCurrentUser(mappedUser);
        try { 
          localStorage.setItem('currentUser', JSON.stringify(mappedUser));
          localStorage.removeItem('incompleteUser');
        } catch {}
        axios.defaults.headers.common['X-User-Id'] = mappedUser.id;
        return true;
      }
      return false;
    } catch (error) {
      console.error("Complete profile error:", error);
      return false;
    }
  }, []);

  contextValue.loginGoogle = loginGoogle;
  contextValue.completeProfile = completeProfile;

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
