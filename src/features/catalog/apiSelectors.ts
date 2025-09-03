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

// Фильтрованные товары с учетом избранного
export const selectFilteredApiProducts = createSelector(
    [selectTransformedProducts, selectCatalog, selectFavIds],
    (products, catalog, favIds) => {
        console.log('Filtering products:', {
            totalProducts: products.length,
            favoriteOnly: catalog.favoriteOnly,
            favIds: favIds,
            favCount: favIds.length
        });
        
        if (!catalog.favoriteOnly) {
            console.log('Showing all products:', products.length);
            return products; // показываем все товары
        }
        // фильтруем только избранные
        const filtered = products.filter(p => favIds.includes(p.id));
        console.log('Showing only favorites:', filtered.length);
        return filtered;
    }
);

// Количество товаров в корзине (для бейджа)
export const selectCartCount = createSelector(selectCartItems, (items) =>
    Object.values(items).reduce((a, b) => a + b, 0) // суммируем значения словаря
);

// Количество избранных товаров среди API товаров
export const selectFavCount = createSelector(
    [selectTransformedProducts, selectFavIds],
    (products, favIds) => {
        // Считаем сколько товаров из API находятся в избранном
        return products.filter(p => favIds.includes(p.id)).length;
    }
);

// Селектор для получения ВСЕХ товаров из всех кэшированных запросов API
export const selectAllCachedProducts = createSelector(
    [(state: RootState) => state.productsApi.queries],
    (queries) => {
        const allProducts: any[] = [];
        const seenIds = new Set<string>();
        
        // Собираем товары из всех успешных запросов
        Object.values(queries).forEach((query: any) => {
            if (query?.status === 'fulfilled' && query?.data?.items) {
                query.data.items.forEach((product: any) => {
                    // Избегаем дубликатов по UUID
                    if (!seenIds.has(product.id)) {
                        seenIds.add(product.id);
                        allProducts.push(transformProduct(product));
                    }
                });
            }
        });
        
        return allProducts;
    }
);

// Подробная корзина: строки и сумма (используем ВСЕ кэшированные товары + localStorage)
export const selectCartDetailed = createSelector(
    selectCartItems,
    selectAllCachedProducts,
    (items, allProducts) => {
        // Загружаем сохраненные данные товаров из localStorage
        const savedProducts = JSON.parse(localStorage.getItem('techhome_cart_products') || '{}');
        
        const rows = Object.entries(items).map(([id, qty]) => {
            // Сначала ищем в кэше API
            let product = allProducts.find((p: any) => p.id === Number(id));
            
            // Если не нашли в кэше, ищем в localStorage
            if (!product && savedProducts[id]) {
                product = savedProducts[id];
            }
            
            if (!product) {
                return {
                    id: Number(id),
                    name: 'Товар не найден',
                    category: 'Неизвестно',
                    price: 0,
                    qty: qty as number,
                    images: []
                };
            }
            
            return {
                id: product.id,
                name: product.name,
                category: product.category,
                price: product.price,
                images: product.images || [],
                qty: qty as number
            };
        });
        
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
