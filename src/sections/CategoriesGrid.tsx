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

  // Иконки для категорий - SVG иконки вместо эмодзи
  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName) {
      case 'Холодильники':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M5 3h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2"/>
            <path d="M9 7h6M9 12h6M9 17h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="7" cy="9" r="1" fill="currentColor"/>
            <circle cx="7" cy="14" r="1" fill="currentColor"/>
          </svg>
        );
      case 'Стиральные машины':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 3v6M21 12h-6M3 12h6M12 21v-6" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      case 'Посудомоечные машины':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2"/>
            <circle cx="9" cy="10" r="1" fill="currentColor"/>
            <circle cx="15" cy="10" r="1" fill="currentColor"/>
            <circle cx="9" cy="14" r="1" fill="currentColor"/>
            <circle cx="15" cy="14" r="1" fill="currentColor"/>
          </svg>
        );
      case 'Плиты':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2"/>
            <circle cx="8" cy="11" r="2" stroke="currentColor" strokeWidth="2"/>
            <circle cx="16" cy="11" r="2" stroke="currentColor" strokeWidth="2"/>
            <circle cx="8" cy="16" r="2" stroke="currentColor" strokeWidth="2"/>
            <circle cx="16" cy="16" r="2" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      case 'Духовые шкафы':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2"/>
            <path d="M7 10h2M15 10h2M7 14h2M15 14h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="18" r="1" fill="currentColor"/>
          </svg>
        );
      case 'Микроволновые печи':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2"/>
            <circle cx="8" cy="11" r="1" fill="currentColor"/>
            <circle cx="12" cy="11" r="1" fill="currentColor"/>
            <circle cx="16" cy="11" r="1" fill="currentColor"/>
            <path d="M6 15h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case 'Вытяжки':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M12 2v8M8 6l4 4 4-4M3 14h18a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2"/>
            <path d="M7 18h2M11 18h2M15 18h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case 'Кондиционеры':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2"/>
            <path d="M7 10h10M7 14h10M12 8v8" stroke="currentColor" strokeWidth="2"/>
            <circle cx="9" cy="12" r="1" fill="currentColor"/>
            <circle cx="15" cy="12" r="1" fill="currentColor"/>
          </svg>
        );
      case 'Водонагреватели':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M12 2v6M8 4h8M3 14h18a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2"/>
            <circle cx="8" cy="18" r="1" fill="currentColor"/>
            <circle cx="12" cy="18" r="1" fill="currentColor"/>
            <circle cx="16" cy="18" r="1" fill="currentColor"/>
          </svg>
        );
      case 'Телевизоры':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
            <circle cx="9" cy="15" r="1" fill="currentColor"/>
            <path d="M7 18h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case 'Ноутбуки':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2"/>
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2"/>
            <line x1="2" y1="16" x2="22" y2="16" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      case 'Смартфоны':
      case 'Планшеты':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="2"/>
            <circle cx="12" cy="18" r="1" fill="currentColor"/>
            <path d="M9 6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case 'Кофемашины':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M6 2h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2"/>
            <path d="M4 8h16v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8z" stroke="currentColor" strokeWidth="2"/>
            <circle cx="8" cy="18" r="1" fill="currentColor"/>
            <path d="M16 8v4" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      case 'Блендеры':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2"/>
            <path d="M7 10v4M11 10v4M15 10v4" stroke="currentColor" strokeWidth="2"/>
            <path d="M9 18h6a2 2 0 0 0 2-2v-2H7v2a2 2 0 0 0 2 2z" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      case 'Мультиварки':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2"/>
            <circle cx="9" cy="12" r="1" fill="currentColor"/>
            <circle cx="12" cy="12" r="1" fill="currentColor"/>
            <circle cx="15" cy="12" r="1" fill="currentColor"/>
            <path d="M7 16h10" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      case 'Пароварки':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2"/>
            <path d="M7 10h10M7 14h10" stroke="currentColor" strokeWidth="2"/>
            <circle cx="9" cy="18" r="1" fill="currentColor"/>
            <circle cx="15" cy="18" r="1" fill="currentColor"/>
          </svg>
        );
      case 'Утюги':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M12 2l8 4v6c0 4-4 8-8 8s-8-4-8-8V6l8-4z" stroke="currentColor" strokeWidth="2"/>
            <path d="M8 10h8M10 14h4" stroke="currentColor" strokeWidth="2"/>
            <circle cx="16" cy="18" r="2" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      case 'Пылесосы':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2"/>
            <path d="M7 10v4M11 10v4M15 10v4" stroke="currentColor" strokeWidth="2"/>
            <path d="M5 18h14a2 2 0 0 0 2-2v-2H3v2a2 2 0 0 0 2 2z" stroke="currentColor" strokeWidth="2"/>
            <circle cx="19" cy="16" r="2" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      default:
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2"/>
            <path d="M9 10h6M9 14h6" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
    }
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
        <h1 className="categories-title">
          <span className="title-line">🏪 Премиальная техника</span>
          <span className="title-line highlight">по категориям</span>
        </h1>
        <p className="categories-subtitle">Выберите категорию для просмотра лучших товаров</p>
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
              {getCategoryIcon(category.slug)}
            </div>
            <h3 className="category-name">{category.slug}</h3>
            <p className="category-description">
              Лучшие товары категории
            </p>
            <div className="category-arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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
