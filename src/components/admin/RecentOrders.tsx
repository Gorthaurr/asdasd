import { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import LoadingSpinner from '../common/LoadingSpinner';

interface Order {
  id: string;
  customer_name: string;
  total_cents: number;
  status: string;
  created_at: string;
  items_count: number;
}

const RecentOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await adminApi.getOrders({ page: 1, page_size: 5 });
        setOrders(response.items);
      } catch (err) {
        setError('Ошибка загрузки заказов');
        console.error('Error fetching orders:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'pending':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Выполнен';
      case 'pending':
        return 'В ожидании';
      case 'cancelled':
        return 'Отменен';
      default:
        return status;
    }
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
      <div className="recent-orders">
        <div className="section-header">
          <h3>🛒 Недавние заказы</h3>
        </div>
        <div className="loading-container">
          <LoadingSpinner size="medium" />
          <p>Загрузка заказов...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recent-orders">
        <div className="section-header">
          <h3>🛒 Недавние заказы</h3>
        </div>
        <div className="error-container">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <h3 className="admin-card-title">🛒 Недавние заказы</h3>
      </div>
      <div className="admin-card-content">

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-item">
            <div className="order-header">
              <span className="order-number">#{order.id.slice(0, 8)}</span>
              <span className={`order-status ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </span>
            </div>

            <div className="order-details">
              <div className="customer-info">
                <span className="customer-name">{order.customer_name}</span>
                <span className="order-date">{formatDate(order.created_at)}</span>
              </div>

              <div className="order-amount">
                {(order.total_cents / 100).toLocaleString('ru-RU')} ₽
                <div className="items-count">{order.items_count} поз.</div>
              </div>
            </div>

            <div className="order-actions">
              <button 
                className="action-btn view-btn"
                onClick={() => window.location.href = `/admin/orders/${order.id}`}
              >
                👁️ Просмотр
              </button>
              <button 
                className="action-btn edit-btn"
                onClick={() => window.location.href = `/admin/orders/${order.id}/edit`}
              >
                ✏️ Редактировать
              </button>
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="no-orders">
          <p>📭 Заказов пока нет</p>
        </div>
      )}
      </div>
    </div>
  );
};

export default RecentOrders;
