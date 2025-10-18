// Селекторы: фильтрация → сортировка → пагинация, плюс корзина и категории
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import type { Product } from '../../types/product';
// Удалить: import products from '../../mocks/products.json';


// Базовые выборки состояния
export const selectCatalog = (s: RootState) => s.catalog; // ветка каталога
export const selectFavIds = (s: RootState) => s.favs.ids; // избранные ID
export const selectCartItems = (s: RootState) => s.cart.items; // корзина


// Категории из данных (с «Все» в начале)
export const selectCategories = createSelector(
    () => products as Product[], // источник — массив товаров
    (list) => ['Все', ...Array.from(new Set(list.map(p => p.category)))] // уникальные категории
);


// Полный список после фильтров и сортировки
export const selectFilteredSorted = createSelector(
    () => products as Product[], // данные (моки)
    selectCatalog, // конфиг каталога
    selectFavIds, // список избранных
    (list, cfg, favIds) => {
        let items = list; // начинаем со всех
        if (cfg.q) items = items.filter(p => p.name.toLowerCase().includes(cfg.q.toLowerCase().trim())); // поиск с trim
        if (cfg.chip !== 'Все') items = items.filter(p => p.category === cfg.chip); // категория
        if (cfg.favoriteOnly) items = items.filter(p => favIds.includes(p.id)); // только избранные
        console.log('Filtered items count:', items.length);


        items = [...items]; // копия для сортировки
        switch (cfg.sort) { // применяем сортировку
            case 'popular': items.sort((a,b)=>b.rating-a.rating); break; // популярность (рейтинг) по умолчанию
            case 'priceAsc': items.sort((a,b)=> (cfg.sortDirection === 'asc' ? a.price - b.price : b.price - a.price)); break;
            case 'priceDesc': items.sort((a,b)=> (cfg.sortDirection === 'asc' ? b.price - a.price : a.price - b.price)); break;
            case 'nameAsc': items.sort((a,b)=> (cfg.sortDirection === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name))); break;
            case 'nameDesc': items.sort((a,b)=> (cfg.sortDirection === 'asc' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name))); break;
            case 'rating': items.sort((a,b)=> (cfg.sortDirection === 'asc' ? a.rating - b.rating : b.rating - a.rating)); break;
            case 'discount': items.sort((a,b)=>{
                const discountA = a.oldPrice ? ((a.oldPrice - a.price) / a.oldPrice) * 100 : 0;
                const discountB = b.oldPrice ? ((b.oldPrice - b.price) / b.oldPrice) * 100 : 0;
                return cfg.sortDirection === 'asc' ? discountA - discountB : discountB - discountA;
            }); break;
            case 'new': items.sort((a,b)=> (cfg.sortDirection === 'asc' ? a.id - b.id : b.id - a.id)); break;
            default: items.sort((a,b)=>b.rating-a.rating);
        }
        console.log('Applied sorting:', cfg.sort, 'direction:', cfg.sortDirection);
        return items; // отдаем упорядоченный список
    }
);
// Нарезка страниц
export const selectPaged = createSelector(selectFilteredSorted, selectCatalog, (items, cfg) => {
    const total = items.length; // всего
    const totalPages = Math.max(1, Math.ceil(total / cfg.pageSize)); // число страниц
    const page = Math.min(cfg.page, totalPages); // безопасный номер страницы
    const start = (page - 1) * cfg.pageSize; // начало диапазона
    const end = start + cfg.pageSize; // конец диапазона
    return { items: items.slice(start, end), total, totalPages, page }; // выдаем срез
});


// Количество товаров в корзине (для бейджа)
export const selectCartCount = createSelector(selectCartItems, (items)=>
    Object.values(items).reduce((a,b)=>a+b,0) // суммируем значения словаря
);


// Подробная корзина: строки и сумма
export const selectCartDetailed = createSelector(
  selectCartItems,
  (state: RootState) => state.products.entities,  // Из RTK Query, id str UUID
  (items, productsEntities) => {
    const rows: CartRow[] = [];
    let sum = 0;

    for (const [id, qty] of Object.entries(items)) {
      const product = productsEntities[id];  // id как str
      if (product) {
        rows.push({ 
          id: product.id,  // str UUID
          name: product.name,
          price: product.price_cents / 100,
          qty,
          images: product.images || []
        });
        sum += (product.price_cents / 100) * qty;
      } else {
        rows.push({ id, name: 'Товар не загружен (проверьте API)', price: 0, qty });
      }
    }

    return { rows, sum };
  }
);

