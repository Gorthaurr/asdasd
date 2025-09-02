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

  // Проверяем токен при загрузке и периодически
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

    // Проверяем токен каждые 5 минут для автоматического обновления
    const interval = setInterval(checkAuth, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<void> => {
    try {
      console.log('useAuth.login starting...');
      const response = await adminApi.login(username, password);
      console.log('adminApi.login completed, response:', response);
      
      const { access_token, user } = response;
      console.log('Extracted token and user:', { token: access_token ? 'present' : 'missing', user: user ? 'present' : 'missing' });
      
      // Сохраняем токен и время входа в localStorage
      localStorage.setItem('admin_token', access_token);
      localStorage.setItem('admin_login_time', Date.now().toString());
      console.log('Token saved to localStorage');
      
      // Обновляем состояние
      setAuthState({
        user,
        token: access_token,
        isAuthenticated: true,
        isLoading: false,
      });
      console.log('Auth state updated successfully');
    } catch (error) {
      console.error('Login error in useAuth:', error);
      throw new Error('Ошибка аутентификации');
    }
  }, []);

  const logout = useCallback(() => {
    // Удаляем токен и время входа из localStorage
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_login_time');
    
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
