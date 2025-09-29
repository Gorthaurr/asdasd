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

  // Получение изображения или иконки для категории
  const getCategoryImage = (categoryName: string) => {
    // Сначала проверяем, есть ли реальное изображение
    const imagePath = `/icons/${categoryName}.png`;
    
    // Если есть изображение, возвращаем его
    if (categoryName === 'винные-шкафы') {
      return (
        <div className="category-image">
          <img 
            src="/icons/Винные шкафы.png" 
            alt={categoryName}
            onError={(e) => {
              // Если изображение не загрузилось, показываем эмодзи
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling.style.display = 'block';
            }}
          />
          <div className="category-fallback" style={{ display: 'none' }}>
            🍷
          </div>
        </div>
      );
    }
    
    // Для остальных категорий показываем эмодзи
    const getEmojiIcon = (name: string) => {
      switch (name) {
        case 'варочные-панели':
        case 'Плиты':
          return '🔥';
        case 'холодильники':
        case 'Холодильники':
          return '❄️';
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
          return '📡';
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
          return '🌬️';
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
    
    return (
      <div className="category-image">
        <div className="category-fallback">
          {getEmojiIcon(categoryName)}
        </div>
      </div>
    );
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
        
        <div className="categories-stats">
          <div className="stat-row">
            <strong className="stat-number">⭐ 4.9/5</strong>
            <span className="stat-label">📊 по оценкам покупателей</span>
          </div>
          <div className="stat-row">
            <strong className="stat-number">🕐 24/7</strong>
            <span className="stat-label">📞 поддержка клиентов</span>
          </div>
          <div className="stat-row">
            <strong className="stat-number">🔄 365</strong>
            <span className="stat-label">📅 дней возврата</span>
          </div>
          <div className="stat-row">
            <strong className="stat-number">🏆 10+</strong>
            <span className="stat-label">🎯 лет опыта</span>
          </div>
        </div>
        
        <div className="categories-features">
          <div className="feature-item">
            <div className="feature-icon">✅</div>
            <div className="feature-content">
              <h4 className="feature-title">🛡️ Гарантия качества</h4>
              <p className="feature-description">Вся техника с официальной гарантией, в заводской упаковке</p>
            </div>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">⭐</div>
            <div className="feature-content">
              <h4 className="feature-title">🏅 Премиальные бренды</h4>
              <p className="feature-description">Сотрудничаем со всеми мировыми производителями</p>
            </div>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">📦</div>
            <div className="feature-content">
              <h4 className="feature-title">🛍️ Широкий ассортимент</h4>
              <p className="feature-description">Тысячи товаров от ведущих производителей электроники</p>
            </div>
          </div>
        </div>
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
              {getCategoryImage(category.slug)}
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
