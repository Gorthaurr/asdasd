import React from 'react';

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  total_amount: number;
  status: string;
  created_at: string;
}

const RecentOrders: React.FC = () => {
  // Моковые данные для демонстрации
  const mockOrders: Order[] = [
    {
      id: '1',
      order_number: 'ORD-001',
      customer_name: 'Иван Петров',
      total_amount: 15000,
      status: 'pending',
      created_at: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      order_number: 'ORD-002',
      customer_name: 'Мария Сидорова',
      total_amount: 25000,
      status: 'completed',
      created_at: '2024-01-15T09:15:00Z'
    },
    {
      id: '3',
      order_number: 'ORD-003',
      customer_name: 'Алексей Козлов',
      total_amount: 8000,
      status: 'pending',
      created_at: '2024-01-15T08:45:00Z'
    }
  ];

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
      minute: '2-digit'
    });
  };

  return (
    <div className="recent-orders">
      <div className="section-header">
        <h3>🛒 Недавние заказы</h3>
        <button className="view-all-btn">Посмотреть все</button>
      </div>
      
      <div className="orders-list">
        {mockOrders.map((order) => (
          <div key={order.id} className="order-item">
            <div className="order-header">
              <span className="order-number">{order.order_number}</span>
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
                {order.total_amount.toLocaleString('ru-RU')} ₽
              </div>
            </div>
            
            <div className="order-actions">
              <button className="action-btn view-btn">👁️ Просмотр</button>
              <button className="action-btn edit-btn">✏️ Редактировать</button>
            </div>
          </div>
        ))}
      </div>
      
      {mockOrders.length === 0 && (
        <div className="no-orders">
          <p>📭 Заказов пока нет</p>
        </div>
      )}
    </div>
  );
};

export default RecentOrders;
