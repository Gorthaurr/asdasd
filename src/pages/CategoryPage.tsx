/**
 * Страница категории с "проваливающейся" навигацией
 * Показывает товары выбранной категории с фильтрами и сортировкой
 */

import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useGetProductsQuery, useGetCategoriesQuery } from '../api/productsApi';
import ProductCard from '../components/products/ProductCard';
import SEOHead from '../components/common/SEOHead';

// Анимированное поле поиска
function AnimatedSearch({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`animated-search ${isFocused ? 'focused' : ''}`}>
      <div className="search-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path 
            d="M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round"
          />
        </svg>
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        type="text"
        placeholder="Поиск в категории..."
        autoComplete="off"
        aria-label="Поиск по товарам"
      />
      {value && (
        <button
          type="button"
          className="search-clear"
          onClick={() => onChange('')}
          aria-label="Очистить поиск"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path 
              d="M18 6L6 18M6 6l12 12" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

// Анимированный селект сортировки
function AnimatedSortSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { value: 'popular', label: '🔥 Сначала популярные' },
    { value: 'priceAsc', label: '💰 Цена: по возрастанию' },
    { value: 'priceDesc', label: '💎 Цена: по убыванию' },
    { value: 'new', label: '✨ Новинки' },
    { value: 'rating', label: '⭐ По рейтингу' },
  ];

  useEffect(() => {
    const handleClickOutside = () => setIsOpen(false);
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div className="animated-select" onClick={(e) => e.stopPropagation()}>
      <button
        className={`select-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span>{options.find(o => o.value === value)?.label || 'Сортировка'}</span>
        <svg className={`arrow ${isOpen ? 'rotate' : ''}`} width="16" height="16" viewBox="0 0 24 24">
          <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" fill="none"/>
        </svg>
      </button>
      
      {isOpen && (
        <div className="select-dropdown">
          {options.map((option) => (
            <button
              key={option.value}
              className={`select-option ${value === option.value ? 'active' : ''}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const [localSearch, setLocalSearch] = useState('');
  const [localSort, setLocalSort] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);

  // Получаем категории для отображения информации
  const { data: categories = [] } = useGetCategoriesQuery();
  const currentCategory = categories.find((cat: any) => cat.slug === slug);

  // Запрос товаров категории
  const { data, isLoading, error } = useGetProductsQuery({
    page: currentPage,
    page_size: 12,
    q: localSearch || undefined,
    category_slug: slug,
    sort: mapSortToApi(localSort),
    include_images: true,
    include_attributes: true,
  });

  const products = data?.items.map((apiProduct: any) => ({
    id: parseInt(apiProduct.id) || 0,
    originalId: apiProduct.id,
    name: apiProduct.name || 'Товар',
    category: slug || '',
    price: apiProduct.price_cents ? apiProduct.price_cents / 100 : 0,
    rating: 4.5,
    images: apiProduct.images || []
  })) || [];

  const meta = data?.meta;

  // Обработчики поиска и сортировки
  const handleSearch = (value: string) => {
    setLocalSearch(value);
    setCurrentPage(1);
  };

  const handleSort = (value: string) => {
    setLocalSort(value);
    setCurrentPage(1);
  };

  // Получение эмодзи для категории
  const getCategoryEmoji = (categorySlug: string) => {
    const emojiMap: Record<string, string> = {
      'варочные-панели': '🔥',
      'холодильники': '❄️',
      'встраиваемые-кофемашины': '☕',
      'вытяжки': '💨',
      'духовые-шкафы': '🔥',
      'климатическое-оборудование': '🌡️',
      'микроволновые-печи': '📡',
      'морозильные-камеры': '🧊',
      'посудомоечные-машины': '🧽',
      'стиральные-машины': '👕',
      'сушильные-машины': '🌬️',
      'винные-шкафы': '🍷',
    };
    return emojiMap[categorySlug] || '📦';
  };

  if (!slug) {
    return (
      <main className="container" style={{ padding: '24px 0' }}>
        <div className="error-state">
          <p>Категория не указана</p>
        </div>
      </main>
    );
  }

  return (
    <>
      <SEOHead 
        title={`${slug} - каталог товаров | TechnoFame`}
        description={`Купить ${slug} в интернет-магазине TechnoFame. Широкий выбор, доставка, гарантия.`}
        keywords={`${slug}, бытовая техника, купить`}
      />
      
      <main className="container category-page" style={{ padding: '16px 0' }}>
        {/* Breadcrumbs - хлебные крошки */}
        <nav className="breadcrumbs" aria-label="Навигация">
          <Link to="/" className="breadcrumb-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Главная
          </Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-item active">
            {getCategoryEmoji(slug)} {slug}
          </span>
        </nav>

        {/* Заголовок категории */}
        <div className="category-header">
          <div className="category-title-section">
            <button 
              className="back-button"
              onClick={() => navigate('/')}
              aria-label="Вернуться к категориям"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h1 className="category-title">
              <span className="category-emoji">{getCategoryEmoji(slug)}</span>
              <span className="category-name">{slug}</span>
            </h1>
          </div>
          
          {data && (
            <div className="category-stats">
              <div className="stat-badge">
                <span className="stat-value">{meta?.total || 0}</span>
                <span className="stat-label">товаров</span>
              </div>
            </div>
          )}
        </div>

        {/* Панель поиска и сортировки */}
        <div className="category-controls">
          <AnimatedSearch value={localSearch} onChange={handleSearch} />
          <AnimatedSortSelect value={localSort} onChange={handleSort} />
        </div>

        {/* Список товаров */}
        <section className="category-products">
          {isLoading && (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Загружаем товары...</p>
            </div>
          )}

          {error && (
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
              <p>Ошибка загрузки товаров</p>
              <small>Попробуйте обновить страницу</small>
            </div>
          )}

          {!isLoading && !error && (
            <>
              <div className="products">
                {products.map((p: any) => (
                  <ProductCard key={p.id} p={p} />
                ))}
                
                {products.length === 0 && (
                  <div className="empty animated-empty-state">
                    <div className="empty-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                    <p>Ничего не найдено</p>
                    <small>Попробуйте изменить параметры поиска</small>
                  </div>
                )}
              </div>

              {meta && meta.total_pages > 1 && products.length > 0 && (
                <div className="pagination-wrapper">
                  <button
                    className="btn secondary"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    ← Назад
                  </button>
                  <span className="pagination-info">
                    Страница {currentPage} из {meta.total_pages}
                  </span>
                  <button
                    className="btn secondary"
                    onClick={() => setCurrentPage(Math.min(meta.total_pages, currentPage + 1))}
                    disabled={currentPage === meta.total_pages}
                  >
                    Вперёд →
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </>
  );
}

/**
 * Преобразует сортировку frontend в формат API
 */
function mapSortToApi(sort: string): string {
  switch (sort) {
    case 'popular':
      return 'name';
    case 'priceAsc':
      return 'price';
    case 'priceDesc':
      return '-price';
    case 'new':
      return '-name';
    case 'rating':
      return '-name';
    default:
      return 'name';
  }
}
