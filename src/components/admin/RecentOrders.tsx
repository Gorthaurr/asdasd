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

  // Обработчики для кнопок
  const handleViewOrder = async (orderId: string) => {
    try {
      const order = await adminApi.getOrder(orderId);
      console.log('Order details:', order);
      // Можно открыть модальное окно или перейти на страницу заказа
      alert(`Заказ #${orderId}\nКлиент: ${order.customer_name}\nСумма: ${order.total_cents.toLocaleString('ru-RU')} ₽\nСтатус: ${order.status}`);
    } catch (error) {
      console.error('Error fetching order:', error);
      alert('Ошибка загрузки заказа');
    }
  };

  const handleEditOrder = async (orderId: string) => {
    try {
      const order = await adminApi.getOrder(orderId);
      console.log('Order for editing:', order);
      
      // Создаем более удобный интерфейс для редактирования
      const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      const statusLabels = {
        'pending': 'Ожидает',
        'processing': 'В обработке', 
        'shipped': 'Отправлен',
        'delivered': 'Доставлен',
        'cancelled': 'Отменен'
      };
      
      const currentStatusLabel = statusLabels[order.status as keyof typeof statusLabels] || order.status;
      
      const newStatus = prompt(
        `Редактировать заказ #${orderId}\n\n` +
        `Клиент: ${order.customer_name}\n` +
        `Сумма: ${order.total_cents.toLocaleString('ru-RU')} ₽\n` +
        `Текущий статус: ${currentStatusLabel}\n\n` +
        `Доступные статусы:\n${statuses.map(s => `- ${s}`).join('\n')}\n\n` +
        `Введите новый статус:`,
        order.status
      );
      
      if (newStatus && newStatus !== order.status) {
        if (statuses.includes(newStatus)) {
          await adminApi.updateOrderStatus(orderId, newStatus);
          const newStatusLabel = statusLabels[newStatus as keyof typeof statusLabels] || newStatus;
          alert(`Статус заказа #${orderId} изменен с "${currentStatusLabel}" на "${newStatusLabel}"`);
          // Обновляем список заказов
          window.location.reload();
        } else {
          alert('Неверный статус. Используйте один из доступных статусов.');
        }
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Ошибка обновления заказа');
    }
  };

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
                {order.total_cents.toLocaleString('ru-RU')} ₽
                <div className="items-count">{order.items_count} поз.</div>
              </div>
            </div>

            <div className="order-actions">
              <button 
                className="action-btn view-btn"
                onClick={() => handleViewOrder(order.id)}
                title="Просмотреть заказ"
              >
                👁️ Просмотр
              </button>
              <button 
                className="action-btn edit-btn"
                onClick={() => handleEditOrder(order.id)}
                title="Редактировать заказ"
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
