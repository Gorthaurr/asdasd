import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import LoadingSpinner from '../common/LoadingSpinner';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="admin-loading">
        <LoadingSpinner size="large" />
        <p>Загрузка админ-панели...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="admin-error">
        <h2>Ошибка доступа</h2>
        <p>Вы не авторизованы для доступа к админ-панели.</p>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <div className="admin-content">
          {title && <h1 className="admin-page-title">{title}</h1>}
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
