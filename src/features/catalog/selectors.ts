// Селекторы: фильтрация → сортировка → пагинация, плюс корзина и категории
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import type { Product } from '../../types/product';
import products from '../../mocks/products.json'; // мок-данные (заменим на API позднее)


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
        if (cfg.q) items = items.filter(p => p.name.toLowerCase().includes(cfg.q.toLowerCase())); // поиск
        if (cfg.chip !== 'Все') items = items.filter(p => p.category === cfg.chip); // категория
        if (cfg.favoriteOnly) items = items.filter(p => favIds.includes(p.id)); // только избранные


        items = [...items]; // копия для сортировки
        switch (cfg.sort) { // применяем сортировку
            case 'priceAsc': items.sort((a,b)=>a.price-b.price); break; // по цене ↑
            case 'priceDesc': items.sort((a,b)=>b.price-a.price); break; // по цене ↓
            case 'new': items.sort((a,b)=>b.id-a.id); break; // по новизне (id)
            default: items.sort((a,b)=>b.rating-a.rating); // популярность (рейтинг)
        }
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
export const selectCartDetailed = createSelector(selectCartItems, () => products as Product[], (items, list) => {
    const rows = Object.entries(items).map(([id, qty]) => ({ ...list.find(p=>p.id===Number(id))!, qty })); // мердж по id
    const sum = rows.reduce((acc, r) => acc + r.price * r.qty, 0); // общая сумма
    return { rows, sum }; // возвращаем структуру для UI
});