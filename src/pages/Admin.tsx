import React from 'react';
import { useAuth } from '../hooks/useAuth';
import AdminLayout from '../components/admin/AdminLayout';
import DashboardStats from '../components/admin/DashboardStats';
import QuickActions from '../components/admin/QuickActions';
import RecentOrders from '../components/admin/RecentOrders';
import TopProducts from '../components/admin/TopProducts';

const Admin = () => {
  const { user } = useAuth();

  return (
    <AdminLayout title="Панель управления">
      <div className="admin-dashboard">
        <div className="welcome-message">
          <p>Добро пожаловать, <strong>{user?.full_name || user?.username}</strong>!</p>
        </div>

        <DashboardStats />
        <QuickActions />

        <div className="admin-grid">
          <RecentOrders />
          <TopProducts />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Admin;
