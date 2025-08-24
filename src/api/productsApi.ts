/*
// RTK Query API-сервис для продуктов
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product } from '../types/product';


export const productsApi = createApi({
reducerPath: 'productsApi', // ключ в сторе
baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_BASE_URL }), // базовый запросчик
tagTypes: ['Products'], // тег для инвалидации
endpoints: (builder) => ({
// GET /products?search=&category=&sort=&page=&pageSize=
getProducts: builder.query<{ items: Product[]; total: number }, Record<string, any>>({
query: (params) => ({ url: '/products', params }), // прокидываем параметры
providesTags: (result)=> ['Products'] // кэш-тегирование
})
})
});


export const { useGetProductsQuery } = productsApi; // хук для компонентов
*/