// Грид товаров + пагинация с реальным API
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetProductsQuery } from '../api/productsApi';
import { selectFilteredApiProducts, selectApiMeta } from '../features/catalog/apiSelectors';
import ProductCard from '../components/products/ProductCard';
import PaginationApi from '../components/products/PaginationApi';
import Filters from '../components/products/Filters';
import { useCatalogUrlActions } from '../routing/useCatalogUrlActions';
import type { RootState } from '../app/store';

export default function ProductsGridApi() {
  const catalog = useSelector((s: RootState) => s.catalog);
  const { setSort } = useCatalogUrlActions();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Проверяем, находимся ли на странице избранного
  const isOnFavoritesPage = catalog.favoriteOnly;

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
    <section className="catalog-layout">
      <Filters />
      
      <div className="catalog-content">
        <div className="catalog-header">
          <div className="sort-control">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M7 12h10M11 18h2"/>
            </svg>
            <select 
              value={catalog.sort} 
              onChange={(e) => setSort(e.target.value)}
              className="sort-select"
            >
              <option value="popular">По популярности</option>
              <option value="priceAsc">Цена: по возрастанию</option>
              <option value="priceDesc">Цена: по убыванию</option>
              <option value="new">Новинки</option>
            </select>
          </div>
          
          <div className="view-toggle">
            <button 
              className={viewMode === 'grid' ? 'active' : ''}
              onClick={() => setViewMode('grid')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
            </button>
            <button 
              className={viewMode === 'list' ? 'active' : ''}
              onClick={() => setViewMode('list')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6"/>
                <line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/>
                <line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div id="products" className={`products ${viewMode === 'list' ? 'list-view' : ''}`}>
          {products
            .filter((p: any, index: number, arr: any[]) => 
              arr.findIndex(item => item.id === p.id) === index
            )
            .map((p: any) => (
              <ProductCard key={p.id} p={p} />
            ))}
          {products.length === 0 && (
            <div id="empty" className="empty">
              <p>Ничего не найдено</p>
              <small>Уточните запрос или снимите фильтры</small>
            </div>
          )}
        </div>
        {meta && meta.total_pages > 1 && products.length > 0 && !isOnFavoritesPage && <PaginationApi meta={meta} />}
      </div>
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
