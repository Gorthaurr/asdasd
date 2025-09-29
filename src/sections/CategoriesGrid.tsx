// Красивый каталог категорий для главной страницы
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetCategoriesQuery } from '../api/productsApi';
import { useCatalogUrlActions } from '../routing/useCatalogUrlActions';
import type { RootState } from '../app/store';

export default function CategoriesGrid() {
  const { setChip } = useCatalogUrlActions();
  const [isVisible, setIsVisible] = useState(false);

  // Запрос категорий из API
  const { data: categories = [], isLoading, error } = useGetCategoriesQuery(undefined, {
    staleTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Иконки для категорий
  const categoryIcons: { [key: string]: string } = {
    'Холодильники': '❄️',
    'Стиральные машины': '🌀',
    'Посудомоечные машины': '🍽️',
    'Плиты': '🔥',
    'Духовые шкафы': '🥧',
    'Микроволновые печи': '📡',
    'Вытяжки': '💨',
    'Кондиционеры': '❄️',
    'Водонагреватели': '🚿',
    'Телевизоры': '📺',
    'Ноутбуки': '💻',
    'Смартфоны': '📱',
    'Планшеты': '📱',
    'Кофемашины': '☕',
    'Блендеры': '🥤',
    'Мультиварки': '🍲',
    'Пароварки': '🍽️',
    'Утюги': '👔',
    'Пылесосы': '🧹',
    'Стиральные машины': '🌀',
  };

  // Цвета для категорий
  const categoryColors: { [key: string]: string } = {
    'Холодильники': 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    'Стиральные машины': 'linear-gradient(135deg, #06b6d4, #0891b2)',
    'Посудомоечные машины': 'linear-gradient(135deg, #10b981, #059669)',
    'Плиты': 'linear-gradient(135deg, #f59e0b, #d97706)',
    'Духовые шкафы': 'linear-gradient(135deg, #ef4444, #dc2626)',
    'Микроволновые печи': 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    'Вытяжки': 'linear-gradient(135deg, #6366f1, #4f46e5)',
    'Кондиционеры': 'linear-gradient(135deg, #06b6d4, #0891b2)',
    'Водонагреватели': 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    'Телевизоры': 'linear-gradient(135deg, #7c3aed, #5b21b6)',
    'Ноутбуки': 'linear-gradient(135deg, #059669, #047857)',
    'Смартфоны': 'linear-gradient(135deg, #dc2626, #b91c1c)',
    'Планшеты': 'linear-gradient(135deg, #d97706, #b45309)',
    'Кофемашины': 'linear-gradient(135deg, #92400e, #78350f)',
    'Блендеры': 'linear-gradient(135deg, #be123c, #9f1239)',
    'Мультиварки': 'linear-gradient(135deg, #c2410c, #9a3412)',
    'Пароварки': 'linear-gradient(135deg, #15803d, #166534)',
    'Утюги': 'linear-gradient(135deg, #a16207, #854d0e)',
    'Пылесосы': 'linear-gradient(135deg, #7c2d12, #9a3412)',
  };

  if (isLoading) {
    return (
      <section className="categories-section" aria-live="polite">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Загружаем категории...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="categories-section" aria-live="polite">
        <div className="error-state">
          <div className="error-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </div>
          <p>Ошибка загрузки категорий</p>
          <small>Попробуйте обновить страницу</small>
        </div>
      </section>
    );
  }

  return (
    <section className="categories-section" aria-live="polite">
      <div className="categories-header">
        <h2 className="categories-title">🏪 Каталог категорий</h2>
        <p className="categories-subtitle">Выберите категорию для просмотра товаров</p>
      </div>

      <div className="categories-grid">
        {categories.map((category: any, index: number) => (
          <div
            key={category.id}
            className={`category-card animated-category ${isVisible ? 'visible' : ''}`}
            style={{
              animationDelay: `${index * 0.1}s`,
              background: categoryColors[category.slug] || 'linear-gradient(135deg, #374151, #1f2937)'
            }}
            onClick={() => setChip(category.slug)}
            role="button"
            tabIndex={0}
            aria-label={`Перейти к категории ${category.slug}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setChip(category.slug);
              }
            }}
          >
            <div className="category-icon">
              {categoryIcons[category.slug] || '📦'}
            </div>
            <div className="category-content">
              <h3 className="category-name">{category.slug}</h3>
              <p className="category-description">
                Лучшие товары категории {category.slug.toLowerCase()}
              </p>
            </div>
            <div className="category-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 18l6-6-6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="category-overlay"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
