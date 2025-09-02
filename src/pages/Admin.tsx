import React from 'react';
import { useAuth } from '../hooks/useAuth';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import DashboardStats from '../components/admin/DashboardStats';
import QuickActions from '../components/admin/QuickActions';
import RecentOrders from '../components/admin/RecentOrders';
import TopProducts from '../components/admin/TopProducts';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Admin: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  console.log('Admin component - auth state:', { user, isAuthenticated, isLoading });

  if (isLoading) {
    console.log('Admin component - showing loading state');
    return (
      <div className="admin-loading">
        <LoadingSpinner size="large" />
        <p>Загрузка админ-панели...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    console.log('Admin component - showing error state:', { isAuthenticated, user: !!user });
    return (
      <div className="admin-error">
        <h2>Ошибка доступа</h2>
        <p>Вы не авторизованы для доступа к админ-панели.</p>
      </div>
    );
  }

  console.log('Admin component - showing admin panel');

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <div className="admin-content">
          <div className="admin-dashboard">
            <h1>Панель управления</h1>
            <p>Добро пожаловать, {user.full_name || user.username}!</p>
            
            <DashboardStats />
            <QuickActions />
            
            <div className="admin-grid">
              <RecentOrders />
              <TopProducts />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
