// Селекторы для работы с API данными
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { transformProduct } from '../../utils/apiTransform';

// Базовые выборки состояния
export const selectCatalog = (s: RootState) => s.catalog; // ветка каталога
export const selectFavIds = (s: RootState) => s.favs.ids; // избранные ID
export const selectCartItems = (s: RootState) => s.cart.items; // корзина

// Селектор для создания ключа запроса
const selectQueryKey = createSelector(
    [selectCatalog],
    (catalog) => JSON.stringify({
        page: catalog.page,
        page_size: catalog.pageSize,
        q: catalog.q || undefined,
        category_slug: catalog.chip !== 'Все' ? catalog.chip : undefined,
        sort: mapSortToApi(catalog.sort),
        include_images: true,
        include_attributes: true,
    })
);

// Получение данных из API кэша с учетом параметров
export const selectApiProducts = createSelector(
    [(state: RootState) => state.productsApi.queries, selectQueryKey],
    (queries, queryKey) => {
        // Ищем запрос с нужными параметрами
        const productsQuery = Object.values(queries).find(
            (query: any) => query?.endpointName === 'getProducts' && 
                           query?.status === 'fulfilled' &&
                           query?.originalArgs &&
                           JSON.stringify(query.originalArgs) === queryKey
        );
        
        return productsQuery?.data?.items || [];
    }
);

export const selectApiMeta = createSelector(
    [(state: RootState) => state.productsApi.queries, selectQueryKey],
    (queries, queryKey) => {
        // Ищем запрос с нужными параметрами
        const productsQuery = Object.values(queries).find(
            (query: any) => query?.endpointName === 'getProducts' && 
                           query?.status === 'fulfilled' &&
                           query?.originalArgs &&
                           JSON.stringify(query.originalArgs) === queryKey
        );
        
        return productsQuery?.data?.meta;
    }
);

// Преобразованные продукты для frontend
export const selectTransformedProducts = createSelector(
    selectApiProducts,
    (apiProducts) => apiProducts.map(transformProduct)
);

// Количество товаров в корзине (для бейджа)
export const selectCartCount = createSelector(selectCartItems, (items) =>
    Object.values(items).reduce((a, b) => a + b, 0) // суммируем значения словаря
);

// Подробная корзина: строки и сумма (используем данные из API кэша)
export const selectCartDetailed = createSelector(
    selectCartItems,
    selectApiProducts,
    (items, apiProducts) => {
        const rows = Object.entries(items).map(([id, qty]) => {
            const product = apiProducts.find((p: any) => p.id === id);
            if (!product) return null;
            
            return {
                id: product.id,
                name: product.name,
                price: product.price_cents ? product.price_cents / 100 : 0,
                qty: qty as number
            };
        }).filter(Boolean);
        
        const sum = rows.reduce((acc, r) => acc + r.price * r.qty, 0);
        return { rows, sum };
    }
);

/**
 * Преобразует сортировку frontend в формат API
 */
function mapSortToApi(sort: string): string {
    switch (sort) {
        case 'popular': return 'name'; // по популярности - по названию
        case 'priceAsc': return 'price';
        case 'priceDesc': return '-price';
        case 'new': return '-name'; // новые - по названию в обратном порядке
        default: return 'name';
    }
}
