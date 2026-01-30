/**
 * Authentication Context Provider.
 * Manages user authentication state and provides auth methods.
 * Uses mock auth for development when USE_MOCK_AUTH is true.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, AuthCredentials, RegisterCredentials, ApiError } from '@/types';
import { authApi, setToken, getToken, removeToken } from '@/services/api';

// ============================================
// Configuration
// ============================================

// Flag to use mock auth (set to false when backend is connected)
const USE_MOCK_AUTH = true;

// Mock user for development
const MOCK_USER: User = {
  id: 'demo-user-1',
  email: 'demo@taskflow.com',
  name: 'Demo User',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// ============================================
// Types
// ============================================

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextValue extends AuthState {
  login: (credentials: AuthCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  loginDemo: () => void;
  logout: () => void;
  clearError: () => void;
}

// ============================================
// Context
// ============================================

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ============================================
// Provider Component
// ============================================

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true, // Start loading to check for existing token
    error: null,
  });

  // Check for existing token on mount
  useEffect(() => {
    const initAuth = async () => {
      // Check for demo mode first
      const isDemoMode = localStorage.getItem('taskflow_demo_mode') === 'true';
      if (isDemoMode) {
        setState({
          user: MOCK_USER,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return;
      }

      const token = getToken();
      if (token && !USE_MOCK_AUTH) {
        try {
          // Validate token by fetching user profile
          const { user } = await authApi.getProfile();
          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch {
          // Token invalid or expired
          removeToken();
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();
  }, []);

  // Listen for token expiration events from API
  useEffect(() => {
    const handleAuthExpired = () => {
      localStorage.removeItem('taskflow_demo_mode');
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Your session has expired. Please login again.',
      });
    };

    window.addEventListener('auth:expired', handleAuthExpired);
    return () => window.removeEventListener('auth:expired', handleAuthExpired);
  }, []);

  const login = useCallback(async (credentials: AuthCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      if (USE_MOCK_AUTH) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        // Simple validation for mock mode
        if (credentials.email && credentials.password.length >= 6) {
          const mockUser: User = {
            ...MOCK_USER,
            email: credentials.email,
            name: credentials.email.split('@')[0],
          };
          localStorage.setItem('taskflow_demo_mode', 'true');
          setState({
            user: mockUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          throw { message: 'Invalid credentials', status_code: 401 } as ApiError;
        }
      } else {
        const response = await authApi.login(credentials);
        setToken(response.access_token);
        setState({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      const apiError = error as ApiError;
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: apiError.message || 'Login failed. Please try again.',
      }));
      throw error;
    }
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      if (USE_MOCK_AUTH) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        // Create mock user from registration data
        const mockUser: User = {
          id: `user-${Date.now()}`,
          email: credentials.email,
          name: credentials.name,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        localStorage.setItem('taskflow_demo_mode', 'true');
        setState({
          user: mockUser,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        const response = await authApi.register(credentials);
        setToken(response.access_token);
        setState({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      const apiError = error as ApiError;
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: apiError.message || 'Registration failed. Please try again.',
      }));
      throw error;
    }
  }, []);

  const loginDemo = useCallback(() => {
    localStorage.setItem('taskflow_demo_mode', 'true');
    setState({
      user: MOCK_USER,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  }, []);

  const logout = useCallback(() => {
    removeToken();
    localStorage.removeItem('taskflow_demo_mode');
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const value: AuthContextValue = {
    ...state,
    login,
    register,
    loginDemo,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ============================================
// Hook
// ============================================

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
