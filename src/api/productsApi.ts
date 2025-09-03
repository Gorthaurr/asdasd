// RTK Query API-сервис для продуктов
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ProductApi, ProductsResponse, CategoryApi } from '../types/api';

// Параметры для запроса продуктов
export interface ProductsQueryParams {
    page?: number;
    page_size?: number;
    category_id?: number;
    category_slug?: string;
    q?: string;
    price_min?: number;
    price_max?: number;
    sort?: string;
    include_images?: boolean;
    include_attributes?: boolean;
}

export const productsApi = createApi({
    reducerPath: 'productsApi', // ключ в сторе
    baseQuery: fetchBaseQuery({ 
        baseUrl: (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:8000',
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    tagTypes: ['Products', 'Categories'], // теги для инвалидации
    endpoints: (builder) => ({
        // GET /api/v1/products - список продуктов
        getProducts: builder.query<ProductsResponse, ProductsQueryParams>({
            query: (params) => ({ 
                url: '/api/v1/products', 
                params: {
                    ...params,
                    include_images: true, // всегда включаем изображения
                    include_attributes: true, // всегда включаем атрибуты
                }
            }),
            providesTags: (result) => 
                result 
                    ? [
                        ...result.items.map(({ id }) => ({ type: 'Products' as const, id })),
                        { type: 'Products', id: 'LIST' }
                    ]
                    : [{ type: 'Products', id: 'LIST' }]
        }),

// GET /api/v1/products/{id} - один продукт
        getProduct: builder.query<ProductApi, string>({
            query: (id) => ({ 
                url: `/api/v1/products/${id}`,
                params: {
                    include_images: true,
                    include_attributes: true,
                }
            }),
            providesTags: (result, error, id) => [{ type: 'Products', id }]
        }),

        // GET /api/v1/categories - категории
        getCategories: builder.query<CategoryApi[], void>({
            query: () => '/api/v1/categories',
            providesTags: [{ type: 'Categories', id: 'LIST' }]
        }),
    })
});

export const { 
    useGetProductsQuery, 
    useGetProductQuery,
    useGetCategoriesQuery 
} = productsApi; // хуки для компонентов