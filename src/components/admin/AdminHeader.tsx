import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const AdminHeader: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="admin-header">
      <div className="header-left">
        <h1>TechHome - Админ-панель</h1>
      </div>
      
      <div className="header-right">
        <div className="user-menu">
          <div className="user-info">
            <span className="username">{user?.username}</span>
            <span className="role">
              {user?.is_super_admin ? 'Супер-админ' : 'Админ'}
            </span>
          </div>
          
          <button 
            className="logout-button"
            onClick={handleLogout}
            title="Выйти из системы"
          >
            🚪 Выйти
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
