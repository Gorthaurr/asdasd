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
        q: catalog.q?.trim() || undefined,
        category_slug: catalog.chip !== 'Все' ? catalog.chip : undefined,
        sort: mapSortToApi(`${catalog.sort}_${catalog.sortDirection}`), // учитываем direction
        price_min: catalog.priceRange[0] > 0 ? catalog.priceRange[0] : undefined,
        price_max: catalog.priceRange[1] < 1000000 ? catalog.priceRange[1] : undefined,
        brands: catalog.brands.length > 0 ? catalog.brands.join(',') : undefined,
        heating_types: catalog.heatingTypes.length > 0 ? catalog.heatingTypes.join(',') : undefined,
        in_stock: catalog.inStock ? true : undefined,
        include_images: true,
        include_attributes: true,
    })
);
// console.log('Generated query key:', queryKey, 'with filters:', { price_min, price_max, brands, in_stock });

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

// Фильтрованные товары с учетом избранного и дедупликацией
export const selectFilteredApiProducts = createSelector(
    [selectTransformedProducts, selectCatalog, selectFavIds],
    (products, catalog, favIds) => {
        console.log('Filtering products:', {
            totalProducts: products.length,
            favoriteOnly: catalog.favoriteOnly,
            favIds: favIds,
            favCount: favIds.length
        });
        
        // ДЕДУПЛИКАЦИЯ товаров по ID
        const uniqueProducts = products.filter((p: any, index: number, arr: any[]) => 
            arr.findIndex(item => item.id === p.id) === index
        );
        
        console.log('After deduplication:', {
            original: products.length,
            unique: uniqueProducts.length
        });
        
        let filtered = uniqueProducts;
        console.log('Before price filter:', filtered.length);
        if (catalog.priceRange) {
            filtered = filtered.filter(p => p.price >= catalog.priceRange[0] && p.price <= catalog.priceRange[1]);
            console.log('After price filter:', filtered.length);
        }
        console.log('Before brands filter:', filtered.length);
        if (catalog.brands.length > 0) {
            filtered = filtered.filter(p => catalog.brands.includes(p.brand));
            console.log('After brands filter:', filtered.length);
        }
        console.log('Before heating types filter:', filtered.length);
        if (catalog.heatingTypes.length > 0) {
            filtered = filtered.filter(p => p.heatingType && catalog.heatingTypes.includes(p.heatingType));
            console.log('After heating types filter:', filtered.length);
        }
        console.log('Before inStock filter:', filtered.length);
        if (catalog.inStock) {
            filtered = filtered.filter(p => p.stock > 0);
            console.log('After inStock filter:', filtered.length);
        }
        if (catalog.favoriteOnly) {
            filtered = filtered.filter(p => favIds.includes(p.id));
            console.log('After favoriteOnly filter:', filtered.length);
        }
        console.log('Filtered API products count:', filtered.length);
        return filtered;
    }
);

// Количество товаров в корзине (для бейджа)
export const selectCartCount = createSelector(selectCartItems, (items) =>
    Object.values(items).reduce((a, b) => a + b, 0) // суммируем значения словаря
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

// Количество избранных товаров среди API товаров
export const selectFavCount = createSelector(
    [selectAllCachedProducts, selectFavIds],
    (allProducts, favIds) => {
        // Считаем сколько товаров из всех кэшированных API запросов находятся в избранном
        // Если товары еще не загружены, возвращаем 0
        if (!allProducts || allProducts.length === 0) {
            return 0;
        }
        return allProducts.filter(p => favIds.includes(p.id)).length;
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
            // Сначала ищем в кэше API (id теперь str)
            let product = allProducts.find((p: any) => p.id === id);
            
            // Если не нашли в кэше, ищем в localStorage
            if (!product && savedProducts[id]) {
                product = savedProducts[id];
            }
            
            if (!product) {
                return {
                    id: id,
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
