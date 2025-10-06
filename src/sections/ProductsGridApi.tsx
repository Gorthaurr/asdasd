// Грид товаров + пагинация с реальным API
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetProductsQuery, useGetCategoriesQuery } from '../api/productsApi';
import ProductCard from '../components/products/ProductCard';
import PaginationApi from '../components/products/PaginationApi';
import Filters from '../components/products/Filters';
import { useCatalogUrlActions } from '../routing/useCatalogUrlActions';
import type { RootState } from '../app/store';
import { transformProduct } from '../utils/apiTransform';

export default function ProductsGridApi() {
  const catalog = useSelector((s: RootState) => s.catalog);
  const { setSort } = useCatalogUrlActions();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Проверяем, находимся ли на странице избранного
  const isOnFavoritesPage = catalog.favoriteOnly;

  // Загружаем список категорий, чтобы сопоставить chip -> id
  const { data: categories } = useGetCategoriesQuery();
  const selectedCategoryId = useMemo(() => {
    if (!categories) return undefined;
    if (!catalog.chip || catalog.chip === 'Все') return undefined;
    // chip хранит человекочитаемый slug (например, "холодильники")
    const found = categories.find((c: any) => c.slug === catalog.chip);
    return found?.id;
  }, [categories, catalog.chip]);

  // Запрос к API: используем category_id, а не slug
  const { data, isLoading, error } = useGetProductsQuery(
    {
      page: catalog.page,
      page_size: catalog.pageSize,
      q: catalog.q || undefined,
      category_id: selectedCategoryId,
      sort: mapSortToApi(catalog.sort),
      include_images: true,
      include_attributes: true,
    },
    {
      refetchOnMountOrArgChange: true,
      staleTime: 2 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );

  // Преобразуем данные напрямую из ответа (без сложных селекторов)
  const products = useMemo(() => (data?.items || []).map(transformProduct), [data]);
  const meta = data?.meta;

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
    <section className="container" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '16px' }}>
      <Filters />
      
      <div className="catalog-content">
        <div className="toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button className="icon-btn" aria-label="Назад">‹</button>
            <h1 style={{ fontSize: 20, margin: 0 }}>{catalog.chip || 'Каталог'}</h1>
          </div>
          <div className="view-toggle">
            <button className={viewMode === 'grid' ? 'viewbtn active' : 'viewbtn'} onClick={() => setViewMode('grid')} aria-pressed={viewMode === 'grid'} aria-label="Плитка">▦</button>
            <button className={viewMode === 'list' ? 'viewbtn active' : 'viewbtn'} onClick={() => setViewMode('list')} aria-pressed={viewMode === 'list'} aria-label="Список">≣</button>
          </div>
        </div>
        
        <div id="products" className={`products ${viewMode === 'list' ? 'list-view' : ''}`}>
          {products
            .filter((p: any, index: number, arr: any[]) =>
              arr.findIndex(item => item.id === p.id) === index
            )
            .map((p: any) => (
              <div key={p.id} className="promo-card-wrapper">
                <ProductCard p={p} />
              </div>
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
