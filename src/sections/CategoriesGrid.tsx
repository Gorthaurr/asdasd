// Красивый каталог категорий для главной страницы
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useGetCategoriesQuery } from '../api/productsApi';
import { useCatalogUrlActions } from '../routing/useCatalogUrlActions';
import type { RootState } from '../app/store';

export default function CategoriesGrid() {
  const { setChip } = useCatalogUrlActions();
  const [isVisible, setIsVisible] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Запрос категорий из API
  const { data: categories = [], isLoading, error } = useGetCategoriesQuery(undefined, {
    staleTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollNext = () => {
    const el = trackRef.current; if (!el) return;
    const step = el.clientWidth * 0.9;
    el.scrollBy({ left: step, behavior: 'smooth' });
  };

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

  // Соответствие slug -> имя файла иконки в public/icons
  const slugToIcon: Record<string, string> = {
    'варочные-панели': 'Варочные панели.png',
    'винные-шкафы': 'Винные шкафы.png',
    'вытяжки': 'Вытяжки.png',
    'духовые-шкафы': 'Духовые шкафы.png',
    'климатическое-оборудование': 'Климатическое-оборудование.png',
    'микроволновые-печи': 'микроволновые печи.png',
    'морозильные-камеры': 'Морозильные камеры.png',
    'посудомоечные-машины': 'Посудомоечные машины.png',
    'стиральные-машины': 'Стиральные машины.png',
    'сушильные-машины': 'Сушильные машины.png',
    'холодильники': 'Холодильники.png',
  };

  const getIconPath = (slug: string) => {
    if (slugToIcon[slug]) return `/icons/${slugToIcon[slug]}`;
    // Фолбэк: заменяем тире на пробелы и пытаемся с заглавной
    const guess = slug.replace(/-/g, ' ');
    return `/icons/${guess.charAt(0).toUpperCase()}${guess.slice(1)}.png`;
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
    <section className="container" aria-live="polite">
      <h2 className="section-title">Каталог</h2>

      <div className="cats-wrapper">
        <div className="cats-scroll" ref={trackRef}>
          {categories.map((category: any) => (
            <article
              key={category.id}
              className="cat"
              onClick={() => setChip(category.slug)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setChip(category.slug);
                }
              }}
              aria-label={`Перейти к категории ${category.slug}`}
            >
              <div className="cat__img">
                <img 
                  src={getIconPath(category.slug)} 
                  alt={category.slug}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = getCategoryIcon(category.slug);
                  }}
                />
              </div>
              <div className="cat__title">{category.slug}</div>
            </article>
          ))}
        </div>
        <button className="carousel-btn next cats-next" aria-label="Вперёд" onClick={scrollNext}>›</button>
      </div>
    </section>
  );
}
