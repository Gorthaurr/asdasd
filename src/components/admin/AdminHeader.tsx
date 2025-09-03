import { useAuth } from '../../hooks/useAuth';

const AdminHeader = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    console.log('AdminHeader: handleLogout called');
    console.log('Current user:', user);
    console.log('Logout function:', typeof logout);
    
    try {
      logout();
      console.log('Logout function executed successfully');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <header className="admin-header">
      <div className="admin-header-title">
        <span style={{ color: 'var(--admin-text-muted)' }}>
          {new Date().toLocaleDateString('ru-RU', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </span>
      </div>

      <div className="admin-header-actions">
        <div className="admin-user-menu">
          <span>{user?.full_name || user?.username}</span>
          <button 
            className="btn btn-secondary btn-sm" 
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
