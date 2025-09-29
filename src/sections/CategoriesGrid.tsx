// Красивый каталог категорий для главной страницы
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetCategoriesQuery } from '../api/productsApi';
import { useCatalogUrlActions } from '../routing/useCatalogUrlActions';
import type { RootState } from '../app/store';

const styles = `
  .categories-section {
    min-height: 100vh;
    padding: 60px 20px 40px;
    max-width: 1600px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    background: #0a0a0a;
    position: relative;
  }

  .categories-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 30% 20%, rgba(212, 175, 55, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 70% 80%, rgba(230, 195, 74, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(192, 192, 192, 0.03) 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
  }

  .categories-header {
    text-align: center;
    margin-bottom: 30px;
  }

  .categories-title {
    font-size: 2.8rem;
    font-weight: 900;
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin: 0 0 12px 0;
    text-align: center;
  }

  .categories-title .title-line {
    display: block;
    color: #1f2937;
  }

  .categories-title .highlight {
    background: linear-gradient(135deg, #d4af37, #e6c34a);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 4px 8px rgba(212, 175, 55, 0.3);
  }

  .categories-subtitle {
    font-size: 1rem;
    color: #6b7280;
    margin: 0;
    font-weight: 500;
  }

  .categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin: 0 auto;
    max-width: 1400px;
    justify-items: center;
  }

  .category-card {
    position: relative;
    background: linear-gradient(135deg, #374151, #1f2937);
    border-radius: 16px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    overflow: hidden;
    min-height: 140px;
    max-width: 280px;
    width: 100%;
    opacity: 0;
    transform: translateY(20px);
  }

  .category-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4), 0 0 30px rgba(212, 175, 55, 0.2);
    border-color: rgba(212, 175, 55, 0.3);
  }

  .category-card.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .category-icon {
    font-size: 2.5rem;
    line-height: 1;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    margin-bottom: 6px;
  }

  .category-name {
    font-size: 1.1rem;
    font-weight: 700;
    color: #ffffff;
    margin: 0 0 4px 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }

  .category-description {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
    line-height: 1.3;
  }

  .category-arrow {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 24px;
    height: 24px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(8px);
    transition: all 0.3s ease;
    color: #ffffff;
    font-size: 12px;
  }

  .category-card:hover .category-arrow {
    background: rgba(212, 175, 55, 0.2);
    transform: translateX(4px);
  }

  .category-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(230, 195, 74, 0.05));
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  .category-card:hover .category-overlay {
    opacity: 1;
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    color: #6b7280;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(212, 175, 55, 0.3);
    border-top: 3px solid #d4af37;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Мобильные стили */
  @media (max-width: 768px) {
    .categories-section {
      padding: 40px 16px 30px;
    }

    .categories-header {
      margin-bottom: 24px;
    }

    .categories-title {
      font-size: 1.6rem;
      margin-bottom: 6px;
    }

    .categories-subtitle {
      font-size: 0.85rem;
    }

    .categories-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      max-width: 100%;
    }

    .category-card {
      padding: 18px;
      min-height: 130px;
      max-width: none;
    }

    .category-icon {
      font-size: 2.2rem;
    }

    .category-name {
      font-size: 1rem;
    }

    .category-description {
      font-size: 0.8rem;
    }

    .category-icon svg {
      width: 24px !important;
      height: 24px !important;
    }
  }
`;

export default function CategoriesGrid() {
  const { setChip } = useCatalogUrlActions();
  const [isVisible, setIsVisible] = useState(false);

  // Добавляем стили в head
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Запрос категорий из API
  const { data: categories = [], isLoading, error } = useGetCategoriesQuery(undefined, {
    staleTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Иконки для категорий - эмодзи иконки
  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName) {
      case 'варочные-панели':
      case 'Плиты':
        return '🔥'; // огонь для варочной панели
      case 'винные-шкафы':
        return '🍷'; // вино для винных шкафов
      case 'холодильники':
      case 'Холодильники':
        return '❄️'; // снежинка для холодильника
      case 'встраиваемые-кофемашины':
      case 'Кофемашины':
        return '☕';
      case 'вытяжки':
      case 'Вытяжки':
        return '💨';
      case 'духовые-шкафы':
      case 'Духовые шкафы':
        return '🔥';
      case 'климатическое-оборудование':
      case 'Кондиционеры':
        return '🌡️';
      case 'микроволновые-печи':
      case 'Микроволновые печи':
        return '📡'; // антенна/волны для микроволновки
      case 'морозильные-камеры':
      case 'Морозильные камеры':
        return '🧊';
      case 'посудомоечные-машины':
      case 'Посудомоечные машины':
        return '🧽';
      case 'стиральные-машины':
      case 'Стиральные машины':
        return '👕';
      case 'сушильные-машины':
      case 'Сушильные машины':
        return '🌬️'; // ветер для сушилки
      case 'Водонагреватели':
        return '🚿';
      case 'Телевизоры':
        return '📺';
      case 'Ноутбуки':
        return '💻';
      case 'Смартфоны':
      case 'Планшеты':
        return '📱';
      case 'Блендеры':
        return '🥤';
      case 'Мультиварки':
        return '🍲';
      case 'Пароварки':
        return '🍽️';
      case 'Утюги':
        return '👔';
      case 'Пылесосы':
        return '🧹';
      default:
        return '📦';
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
