// Грид товаров + пагинация с реальным API
import React from 'react';
import { useSelector } from 'react-redux';
import { useGetProductsQuery } from '../api/productsApi';
import { selectFilteredApiProducts, selectApiMeta } from '../features/catalog/apiSelectors';
import ProductCard from '../components/products/ProductCard';
import PaginationApi from '../components/products/PaginationApi';
import type { RootState } from '../app/store';

export default function ProductsGridApi() {
  const catalog = useSelector((s: RootState) => s.catalog);

  // Запрос к API с параметрами из состояния каталога
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
        {products.map((p: any) => (
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
      {meta && <PaginationApi meta={meta} />}
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
