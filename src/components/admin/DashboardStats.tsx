import { useState, useEffect } from 'react';
import { adminApi, DashboardStats as DashboardStatsType } from '../../api/adminApi';
import LoadingSpinner from '../common/LoadingSpinner';

const DashboardStats = () => {
  const [stats, setStats] = useState<DashboardStatsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await adminApi.getDashboardStats();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Ошибка загрузки статистики');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="stats-loading">
        <LoadingSpinner size="medium" />
        <p>Загрузка статистики...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="stats-error">
        <p>{error || 'Не удалось загрузить статистику'}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-stats">
      <h2>📊 Статистика системы</h2>

      <div className="stats-grid">
        {/* Пользователи */}
        <div className="stat-card users-stats">
          <div className="stat-header">
            <h3>👥 Пользователи</h3>
            <span className="stat-icon">👥</span>
          </div>
          <div className="stat-content">
            <div className="stat-item">
              <span className="stat-label">Всего:</span>
              <span className="stat-value">{stats.total_users}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Активных:</span>
              <span className="stat-value">{stats.active_users}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Админов:</span>
              <span className="stat-value">{stats.admin_users}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Супер-админов:</span>
              <span className="stat-value">{stats.super_admin_users}</span>
            </div>
          </div>
        </div>

        {/* Продукты */}
        <div className="stat-card products-stats">
          <div className="stat-header">
            <h3>📦 Продукты</h3>
            <span className="stat-icon">📦</span>
          </div>
          <div className="stat-content">
            <div className="stat-item">
              <span className="stat-label">Всего:</span>
              <span className="stat-value">{stats.product_stats.total_products}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Активных:</span>
              <span className="stat-value">{stats.product_stats.active_products}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">С изображениями:</span>
              <span className="stat-value">{stats.product_stats.products_with_images}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Без изображений:</span>
              <span className="stat-value">{stats.product_stats.products_without_images}</span>
            </div>
          </div>
        </div>

        {/* Заказы */}
        <div className="stat-card orders-stats">
          <div className="stat-header">
            <h3>🛒 Заказы</h3>
            <span className="stat-icon">🛒</span>
          </div>
          <div className="stat-content">
            <div className="stat-item">
              <span className="stat-label">Всего:</span>
              <span className="stat-value">{stats.order_stats.total_orders}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">В ожидании:</span>
              <span className="stat-value">{stats.order_stats.pending_orders}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Выполнено:</span>
              <span className="stat-value">{stats.order_stats.completed_orders}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Отменено:</span>
              <span className="stat-value">{stats.order_stats.cancelled_orders}</span>
            </div>
            <div className="stat-item revenue">
              <span className="stat-label">Выручка:</span>
              <span className="stat-value">
                {stats.order_stats.total_revenue.toLocaleString('ru-RU')} ₽
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
