import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../api/adminApi';

export interface User {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  is_admin: boolean;
  is_super_admin: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('admin_token'),
    isAuthenticated: false,
    isLoading: true,
  });

  // Проверяем токен при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token');
      if (token) {
        try {
          // Проверяем токен на сервере и получаем данные пользователя
          const response = await adminApi.getUserProfile();
          setAuthState(prev => ({
            ...prev,
            user: response,
            isAuthenticated: true,
            isLoading: false,
          }));
        } catch (error) {
          console.error('Token validation failed:', error);
          // Токен недействителен
          localStorage.removeItem('admin_token');
          setAuthState(prev => ({
            ...prev,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          }));
        }
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
        }));
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<void> => {
    try {
      console.log('Attempting login with:', { username, password: '***' });
      const response = await adminApi.login(username, password);
      console.log('Login response:', response);
      
      const { access_token, user } = response;
      console.log('Extracted token:', access_token ? 'Token received' : 'No token');
      console.log('Extracted user:', user);
      
      // Сохраняем токен в localStorage
      localStorage.setItem('admin_token', access_token);
      console.log('Token saved to localStorage');
      
      // Обновляем состояние
      setAuthState({
        user,
        token: access_token,
        isAuthenticated: true,
        isLoading: false,
      });
      console.log('Auth state updated, isAuthenticated:', true);
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Ошибка аутентификации');
    }
  }, []);

  const logout = useCallback(() => {
    // Удаляем токен из localStorage
    localStorage.removeItem('admin_token');
    
    // Сбрасываем состояние
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const hasPermission = useCallback((permission: string): boolean => {
    if (!authState.user) return false;
    
    if (authState.user.is_super_admin) return true;
    
    if (permission === 'admin' && authState.user.is_admin) return true;
    
    return false;
  }, [authState.user]);

  return {
    user: authState.user,
    token: authState.token,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    login,
    logout,
    hasPermission,
  };
};
