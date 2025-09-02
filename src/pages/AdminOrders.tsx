import React, { useState, useEffect } from 'react';
import { adminApi } from '../api/adminApi';
import AdminLayout from '../components/admin/AdminLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface Order {
  id: string;
  status: string;
  currency: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  total_cents: number;
  created_at: string;
  items_count: number;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const fetchOrders = async (page = 1, status = '') => {
    try {
      setIsLoading(true);
      const response = await adminApi.getOrders({
        page,
        page_size: 20,
        status_filter: status || undefined,
      });
      setOrders(response.items);
      setTotalPages(response.meta.total_pages);
      setCurrentPage(page);
    } catch (err) {
      setError('Ошибка загрузки заказов');
      console.error('Error fetching orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage, statusFilter);
  }, [currentPage, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'pending':
        return 'status-pending';
      case 'paid':
        return 'status-paid';
      case 'shipped':
        return 'status-shipped';
      case 'canceled':
        return 'status-canceled';
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
      case 'paid':
        return 'Оплачен';
      case 'shipped':
        return 'Отправлен';
      case 'canceled':
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

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await adminApi.updateOrderStatus(orderId, newStatus);
      fetchOrders(currentPage, statusFilter);
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Ошибка изменения статуса заказа');
    }
  };

  const handleViewOrder = async (orderId: string) => {
    try {
      const order = await adminApi.getOrder(orderId);
      setSelectedOrder(order);
      setShowOrderDetails(true);
    } catch (err) {
      console.error('Error fetching order:', err);
      alert('Ошибка загрузки заказа');
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="🛒 Управление заказами">
        <div className="loading-container">
          <LoadingSpinner size="large" />
          <p>Загрузка заказов...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="🛒 Управление заказами">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={() => fetchOrders(currentPage, statusFilter)}>
            Повторить попытку
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="🛒 Управление заказами">

      <div className="admin-filters">
        <div className="filter-group">
          <label>Статус заказа:</label>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">Все заказы</option>
            <option value="pending">В ожидании</option>
            <option value="paid">Оплачен</option>
            <option value="shipped">Отправлен</option>
            <option value="completed">Выполнен</option>
            <option value="canceled">Отменен</option>
          </select>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID заказа</th>
                <th>Клиент</th>
                <th>Статус</th>
                <th>Сумма</th>
                <th>Позиций</th>
                <th>Дата</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id.slice(0, 8)}</td>
                  <td>
                    <div className="customer-info">
                      <strong>{order.customer_name}</strong>
                      {order.customer_email && (
                        <small>{order.customer_email}</small>
                      )}
                      {order.customer_phone && (
                        <small>{order.customer_phone}</small>
                      )}
                    </div>
                  </td>
                  <td>
                    <select
                      className={`status-select ${getStatusColor(order.status)}`}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      <option value="pending">В ожидании</option>
                      <option value="paid">Оплачен</option>
                      <option value="shipped">Отправлен</option>
                      <option value="completed">Выполнен</option>
                      <option value="canceled">Отменен</option>
                    </select>
                  </td>
                  <td>
                    <strong>
                      {(order.total_cents / 100).toLocaleString('ru-RU')} {order.currency}
                    </strong>
                  </td>
                  <td>{order.items_count} шт.</td>
                  <td>{formatDate(order.created_at)}</td>
                  <td>
                    <div className="table-actions">
                      <button 
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleViewOrder(order.id)}
                      >
                        👁️ Просмотр
                      </button>
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => handleViewOrder(order.id)}
                      >
                        📄 Детали
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {orders.length === 0 && (
            <div className="empty-state">
              <p>🛒 Заказы не найдены</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="btn btn-secondary"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
            >
              ← Предыдущая
            </button>
            <span className="pagination-info">
              Страница {currentPage} из {totalPages}
            </span>
            <button 
              className="btn btn-secondary"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
            >
              Следующая →
            </button>
          </div>
        )}
      </div>

      {/* Модальное окно деталей заказа */}
      {selectedOrder && showOrderDetails && (
        <div className="modal-overlay" onClick={() => setShowOrderDetails(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🛒 Детали заказа #{selectedOrder.id.slice(0, 8)}</h3>
              <button className="btn btn-sm btn-secondary" onClick={() => setShowOrderDetails(false)}>
                ✕ Закрыть
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <h4>👤 Информация о клиенте</h4>
                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    <div><strong>Имя:</strong> {selectedOrder.customer_name}</div>
                    {selectedOrder.customer_email && (
                      <div><strong>Email:</strong> {selectedOrder.customer_email}</div>
                    )}
                    {selectedOrder.customer_phone && (
                      <div><strong>Телефон:</strong> {selectedOrder.customer_phone}</div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4>📦 Информация о заказе</h4>
                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    <div><strong>Статус:</strong> 
                      <span className={`status-badge ${getStatusColor(selectedOrder.status)}`}>
                        {getStatusText(selectedOrder.status)}
                      </span>
                    </div>
                    <div><strong>Валюта:</strong> {selectedOrder.currency}</div>
                    <div><strong>Сумма:</strong> {(selectedOrder.total_cents / 100).toLocaleString('ru-RU')} ₽</div>
                    <div><strong>Создан:</strong> {formatDate(selectedOrder.created_at)}</div>
                  </div>
                </div>
              </div>

              {selectedOrder.shipping_address && (
                <div style={{ marginTop: '1.5rem' }}>
                  <h4>🚚 Адрес доставки</h4>
                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    <div><strong>Адрес:</strong> {selectedOrder.shipping_address}</div>
                    {selectedOrder.shipping_city && (
                      <div><strong>Город:</strong> {selectedOrder.shipping_city}</div>
                    )}
                    {selectedOrder.shipping_postal_code && (
                      <div><strong>Индекс:</strong> {selectedOrder.shipping_postal_code}</div>
                    )}
                  </div>
                </div>
              )}

              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div style={{ marginTop: '1.5rem' }}>
                  <h4>🛍️ Товары в заказе</h4>
                  <div className="admin-card">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Товар</th>
                          <th>Количество</th>
                          <th>Цена</th>
                          <th>Сумма</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map((item: any) => (
                          <tr key={item.id}>
                            <td>{item.item_name}</td>
                            <td>{item.qty} шт.</td>
                            <td>{(item.item_price_cents / 100).toLocaleString('ru-RU')} ₽</td>
                            <td>{((item.item_price_cents * item.qty) / 100).toLocaleString('ru-RU')} ₽</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {selectedOrder.comment && (
                <div style={{ marginTop: '1.5rem' }}>
                  <h4>💬 Комментарий</h4>
                  <p>{selectedOrder.comment}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;
