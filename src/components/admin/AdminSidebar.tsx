import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AdminSidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const menuItems = [
    {
      path: '/admin',
      label: 'Дашборд',
      icon: '📊',
      permission: 'admin',
    },
    {
      path: '/admin/products',
      label: 'Продукты',
      icon: '📦',
      permission: 'admin',
    },
    {
      path: '/admin/orders',
      label: 'Заказы',
      icon: '🛒',
      permission: 'admin',
    },
    {
      path: '/admin/categories',
      label: 'Категории',
      icon: '🏷️',
      permission: 'admin',
    },
    {
      path: '/admin/users',
      label: 'Пользователи',
      icon: '👥',
      permission: 'admin',
    },
    {
      path: '/admin/test',
      label: 'Тестирование',
      icon: '🧪',
      permission: 'admin',
    },
    {
      path: '/admin/settings',
      label: 'Настройки',
      icon: '⚙️',
      permission: 'super_admin',
    },
  ];

  const hasPermission = (permission: string) => {
    if (!user) return false;
    if (user.is_super_admin) return true;
    if (permission === 'admin' && user.is_admin) return true;
    return false;
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-logo">
        <span style={{ fontSize: '2rem' }}>🏠</span>
        <h2>TechHome Admin</h2>
      </div>

      <nav>
        <ul className="admin-nav">
          {menuItems.map((item) => {
            if (!hasPermission(item.permission)) return null;

            const isActive = location.pathname === item.path;

            return (
              <li key={item.path} className="admin-nav-item">
                <Link to={item.path} className={`admin-nav-link ${isActive ? 'active' : ''}`}>
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div style={{ marginTop: 'auto', padding: '1rem 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            background: 'var(--admin-primary)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white',
            fontWeight: '600'
          }}>
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={{ margin: '0', color: 'white', fontSize: '0.875rem', fontWeight: '500' }}>
              {user?.username}
            </p>
            <p style={{ margin: '0', color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>
              {user?.is_super_admin ? 'Супер-админ' : 'Админ'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
