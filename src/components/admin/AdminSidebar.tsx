import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AdminSidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const menuItems = [
    {
      path: '/admin',
      label: '📊 Дашборд',
      icon: '📊',
      permission: 'admin'
    },
    {
      path: '/admin/users',
      label: '👥 Пользователи',
      icon: '👥',
      permission: 'admin'
    },
    {
      path: '/admin/products',
      label: '📦 Продукты',
      icon: '📦',
      permission: 'admin'
    },
    {
      path: '/admin/orders',
      label: '🛒 Заказы',
      icon: '🛒',
      permission: 'admin'
    },
    {
      path: '/admin/categories',
      label: '🏷️ Категории',
      icon: '🏷️',
      permission: 'admin'
    },
    {
      path: '/admin/settings',
      label: '⚙️ Настройки',
      icon: '⚙️',
      permission: 'super_admin'
    }
  ];

  const hasPermission = (permission: string) => {
    if (!user) return false;
    if (user.is_super_admin) return true;
    if (permission === 'admin' && user.is_admin) return true;
    return false;
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h2>🔐 Админка</h2>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => {
            if (!hasPermission(item.permission)) return null;
            
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <p className="username">{user?.username}</p>
            <p className="role">
              {user?.is_super_admin ? 'Супер-админ' : 'Админ'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
