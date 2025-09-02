import React from 'react';
import { Link } from 'react-router-dom';

const QuickActions: React.FC = () => {
  const actions = [
    {
      title: '➕ Добавить продукт',
      description: 'Создать новый продукт в каталоге',
      icon: '📦',
      path: '/admin/products/new',
      color: 'blue'
    },
    {
      title: '👥 Управление пользователями',
      description: 'Просмотр и редактирование пользователей',
      icon: '👥',
      path: '/admin/users',
      color: 'green'
    },
    {
      title: '🛒 Просмотр заказов',
      description: 'Управление заказами и их статусами',
      icon: '🛒',
      path: '/admin/orders',
      color: 'orange'
    },
    {
      title: '🏷️ Категории',
      description: 'Управление категориями продуктов',
      icon: '🏷️',
      path: '/admin/categories',
      color: 'purple'
    },
    {
      title: '⚙️ Настройки',
      description: 'Системные настройки и конфигурация',
      icon: '⚙️',
      path: '/admin/settings',
      color: 'gray'
    },
    {
      title: '📊 Подробная статистика',
      description: 'Детальная аналитика и отчеты',
      icon: '📊',
      path: '/admin/analytics',
      color: 'teal'
    }
  ];

  return (
    <div className="quick-actions">
      <h2>🚀 Быстрые действия</h2>
      <p>Выберите действие для быстрого доступа к функциям управления</p>
      
      <div className="actions-grid">
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.path}
            className={`action-card action-${action.color}`}
          >
            <div className="action-icon">
              {action.icon}
            </div>
            <div className="action-content">
              <h3>{action.title}</h3>
              <p>{action.description}</p>
            </div>
            <div className="action-arrow">
              →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
