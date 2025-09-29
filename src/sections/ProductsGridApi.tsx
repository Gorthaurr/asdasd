// Грид товаров + пагинация с реальным API
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetProductsQuery } from '../api/productsApi';
import { selectFilteredApiProducts, selectApiMeta } from '../features/catalog/apiSelectors';
import ProductCard from '../components/products/ProductCard';
import PaginationApi from '../components/products/PaginationApi';
import type { RootState } from '../app/store';

const productsGridStyles = `
  .grid{
    display:grid; 
    grid-template-columns:repeat(12, 1fr); 
    gap:16px
  }

  .card{
    background:linear-gradient(180deg, #1a1a1a, #0f0f0f); 
    border:1px solid #e5e7eb; 
    border-radius:16px; 
    overflow:hidden; 
    display:flex; 
    flex-direction:column;
    transition: all 0.3s ease;
    box-shadow: 0 8px 25px rgba(0,0,0,0.3);
  }

  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 40px rgba(0,0,0,0.4);
    border-color: #d4af37;
  }

  .thumb{
    position:relative; 
    height: 280px; 
    background:linear-gradient(145deg, #1a1a1a 0%, #0f0f0f 100%); 
    border-radius: 12px; 
    overflow: hidden
  }

  /* Стили для изображений товаров */
  .image-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 0;
    overflow: hidden;
    display: block;
    background: linear-gradient(145deg, #1a1a1a 0%, #0f0f0f 100%);
  }

  .product-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: transform 0.3s ease;
    border-radius: 0;
  }

  .product-image:hover {
    transform: scale(1.05);
  }

  /* Стили для SVG placeholder */
  .placeholder-svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 80px;
    opacity: 0.3;
    color: #6b7280;
  }

  /* Мобильные стили */
  @media (max-width: 768px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    
    .thumb {
      height: 200px;
    }
  }

  @media (max-width: 480px) {
    .grid {
      grid-template-columns: 1fr;
      gap: 8px;
    }
    
    .thumb {
      height: 180px;
    }
  }
`;

export default function ProductsGridApi() {
  const catalog = useSelector((s: RootState) => s.catalog);
  
  // Проверяем, находимся ли на странице избранного
  const isOnFavoritesPage = catalog.favoriteOnly;

  // Добавляем стили в head
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = productsGridStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Запрос к API с параметрами из состояния каталога - ОПТИМИЗИРОВАННЫЙ
  const { data, isLoading, error, refetch } = useGetProductsQuery(
    {
      page: catalog.page,
      page_size: catalog.pageSize,
      q: catalog.q || undefined,
      category_slug: catalog.chip !== 'Все' ? catalog.chip : undefined,
      sort: mapSortToApi(catalog.sort),
      include_images: true,
      include_attributes: true,
    },
    {
      // Принудительно перезапрашиваем данные при изменении параметров
      refetchOnMountOrArgChange: true,
      // Кэшируем на 2 минуты для быстрой навигации
      staleTime: 2 * 60 * 1000,
      // Не блокируем загрузку категорий
      refetchOnWindowFocus: false,
    }
  );

  // Получаем данные через селекторы
  const products = useSelector(selectFilteredApiProducts);
  const meta = useSelector(selectApiMeta);

  if (isLoading) {
    return (
      <section className="grid animated-grid" aria-live="polite">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Загружаем товары...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="grid animated-grid" aria-live="polite">
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
      </section>
    );
  }

  return (
    <section className="grid animated-grid" aria-live="polite">
      <div id="products" className="products">
        {products
          .filter((p: any, index: number, arr: any[]) => 
            arr.findIndex(item => item.id === p.id) === index
          )
          .map((p: any) => (
            <ProductCard key={p.id} p={p} />
          ))}
        {products.length === 0 && (
          <div id="empty" className="empty animated-empty-state">
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
            <small>Уточните запрос или снимите фильтры</small>
          </div>
        )}
      </div>
      {meta && meta.total_pages > 1 && products.length > 0 && !isOnFavoritesPage && <PaginationApi meta={meta} />}
    </section>
  );
}

/**
 * Преобразует сортировку frontend в формат API
 */
function mapSortToApi(sort: string): string {
  switch (sort) {
    case 'popular':
      return 'name'; // по популярности - по названию
    case 'priceAsc':
      return 'price';
    case 'priceDesc':
      return '-price';
    case 'new':
      return '-name'; // новые - по названию в обратном порядке
    default:
      return 'name';
  }
}
