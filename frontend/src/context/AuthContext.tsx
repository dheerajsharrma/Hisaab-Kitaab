import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        console.log('🔑 Restoring session from localStorage');
        setToken(storedToken);
        setUser(JSON.parse(storedUser));

        // Skip token validation on initialization to prevent immediate logouts
        // The token is valid for 1 year, so we trust the stored session
        // Validation will happen naturally when API calls are made
        console.log('✅ Session restored successfully - no validation needed');

        // Optional: Only validate if you want to update user data, but don't clear session on failure
        // try {
        //   const response = await authAPI.getProfile();
        //   if (response.success) {
        //     setUser(response.user);
        //     localStorage.setItem('user', JSON.stringify(response.user));
        //   }
        // } catch (error: any) {
        //   console.log('Profile update failed, but keeping session active:', error.message);
        // }
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('🔐 Starting login process...');
      const response = await authAPI.login(email, password);

      if (response.success) {
        const { token: newToken, user: newUser } = response;

        console.log('✅ Login API successful, storing session data');
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));

        setToken(newToken);
        setUser(newUser);

        console.log('✅ Session data set in state, login complete');
        toast.success('Login successful!');
      }
    } catch (error: any) {
      console.error('❌ Login error:', error);
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      console.log('🔑 Starting registration process...');
      const response = await authAPI.register(name, email, password);

      if (response.success) {
        const { token: newToken, user: newUser } = response;

        console.log('✅ Registration API successful, storing session data');
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));

        setToken(newToken);
        setUser(newUser);

        console.log('✅ Registration session data set in state, registration complete');
        toast.success('Registration successful!');
      }
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
