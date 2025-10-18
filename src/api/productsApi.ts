// RTK Query API-сервис для продуктов
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ProductApi, ProductsResponse, CategoryApi } from '../types/api';

// Параметры для запроса продуктов
export interface ProductsQueryParams {
    page?: number;
    page_size?: number; // Убрано =100, defaults не в interface
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
        baseUrl: (import.meta as any).env.VITE_API_URL || 'https://api.technofame.store',
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    tagTypes: ['Products', 'Categories'], // теги для инвалидации
    endpoints: (builder) => ({
        // GET /api/v1/products - список продуктов
        getProducts: builder.query<ProductsResponse, ProductsQueryParams>({
            query: (params) => {
                console.log('Fetching products with params:', params);
                const queryParams = {
                    ...params,
                    page_size: params.page_size ?? 20, // Теперь backend принимает до 100
                    include_images: params.include_images ?? true,
                    include_attributes: params.include_attributes ?? true,
                };
                return {
                    url: '/api/v1/products',
                    params: queryParams,
                };
            },
            transformResponse: (response: ProductsResponse) => ({
                ...response,
                items: response.items.map(item => ({ ...item, id: String(item.id) }))
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
            transformResponse: (response: ProductApi) => ({ ...response, id: String(response.id) }),
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