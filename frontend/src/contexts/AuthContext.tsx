import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  login as loginService,
  register as registerService,
  logout as logoutService,
  verifyToken,
  getCurrentUser,
  setTokens,
  removeTokens,
  LoginCredentials,
  RegisterCredentials,
  UserInfo,
} from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserInfo | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (credentials: RegisterCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Verify token and load user on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const result = await verifyToken();
        if (result.success && result.user) {
          setIsAuthenticated(true);
          setUser(result.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
          removeTokens();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setIsAuthenticated(false);
        setUser(null);
        removeTokens();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await loginService(credentials);

      if (response.success && response.access_token && response.refresh_token && response.user) {
        setTokens(response.access_token, response.refresh_token);
        setIsAuthenticated(true);
        setUser(response.user);
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Échec de la connexion' };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur de connexion au serveur',
      };
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await registerService(credentials);

      if (response.success && response.access_token && response.refresh_token && response.user) {
        setTokens(response.access_token, response.refresh_token);
        setIsAuthenticated(true);
        setUser(response.user);
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Échec de l\'inscription' };
      }
    } catch (error: any) {
      console.error('Register error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur de connexion au serveur',
      };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await logoutService();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      removeTokens();
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const userData = await getCurrentUser();
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
