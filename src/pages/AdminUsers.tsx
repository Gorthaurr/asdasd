import React, { useState, useEffect } from 'react';
import { adminApi, User } from '../api/adminApi';
import AdminLayout from '../components/admin/AdminLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.getUsers({
        q: searchQuery || undefined,
        role: roleFilter || undefined,
        is_active: activeFilter,
        page: 1,
        page_size: 50,
      });
      setUsers(response.items);
    } catch (err) {
      setError('Ошибка загрузки пользователей');
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchQuery, roleFilter, activeFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const getRoleText = (user: User) => {
    if (user.is_super_admin) return 'Супер-админ';
    if (user.is_admin) return 'Админ';
    return 'Пользователь';
  };

  const getRoleBadgeClass = (user: User) => {
    if (user.is_super_admin) return 'status-completed';
    if (user.is_admin) return 'status-paid';
    return 'status-pending';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <AdminLayout title="👥 Управление пользователями">
        <div className="loading-container">
          <LoadingSpinner size="large" />
          <p>Загрузка пользователей...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="👥 Управление пользователями">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={fetchUsers}>Повторить попытку</button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="👥 Управление пользователями">
      <div className="admin-actions">
        <button className="btn btn-primary">➕ Добавить пользователя</button>
      </div>

      <div className="admin-filters">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Поиск по имени, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn btn-secondary">🔍 Найти</button>
        </form>

        <div className="filter-group">
          <label>Роль:</label>
          <select 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">Все роли</option>
            <option value="user">Пользователи</option>
            <option value="admin">Админы</option>
            <option value="super_admin">Супер-админы</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Статус:</label>
          <select 
            value={activeFilter === undefined ? '' : activeFilter.toString()} 
            onChange={(e) => {
              const value = e.target.value;
              setActiveFilter(value === '' ? undefined : value === 'true');
            }}
            className="filter-select"
          >
            <option value="">Все</option>
            <option value="true">Активные</option>
            <option value="false">Неактивные</option>
          </select>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Пользователь</th>
                <th>Email</th>
                <th>Роль</th>
                <th>Статус</th>
                <th>Создан</th>
                <th>Последний вход</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>#{user.id.slice(0, 8)}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'var(--admin-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '0.875rem'
                      }}>
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <strong>{user.full_name || user.username}</strong>
                        {user.full_name && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                            @{user.username}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`status-badge ${getRoleBadgeClass(user)}`}>
                      {getRoleText(user)}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.is_active ? 'status-completed' : 'status-canceled'}`}>
                      {user.is_active ? 'Активен' : 'Неактивен'}
                    </span>
                  </td>
                  <td>{formatDate(user.created_at)}</td>
                  <td>
                    {user.last_login ? formatDate(user.last_login) : (
                      <span style={{ color: 'var(--admin-text-muted)' }}>Никогда</span>
                    )}
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="btn btn-sm btn-secondary">👁️ Просмотр</button>
                      <button className="btn btn-sm btn-primary">✏️ Изменить</button>
                      <button className="btn btn-sm btn-danger">🗑️ Удалить</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="empty-state">
              <p>👥 Пользователи не найдены</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
