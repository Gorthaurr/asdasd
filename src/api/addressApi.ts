// API клиент для автодополнения адресов
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface AddressSuggestionData {
  postal_code?: string;
  country: string;
  region?: string;
  city?: string;
  street?: string;
  house?: string;
  flat?: string;
}

export interface AddressSuggestion {
  value: string;
  unrestricted_value: string;
  data: AddressSuggestionData;
}

export interface AddressSuggestionsResponse {
  suggestions: AddressSuggestion[];
}

export const addressApi = createApi({
  reducerPath: 'addressApi',
  baseQuery: fetchBaseQuery({
    baseUrl: (import.meta as any).env.VITE_API_URL || 'https://api.technofame.store',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Получение подсказок адресов
    getAddressSuggestions: builder.query<AddressSuggestion[], { query: string; count?: number }>({
      query: ({ query, count = 10 }) => ({
        url: '/api/v1/address/suggestions',
        params: {
          q: query,
          count: count,
        },
      }),
      transformResponse: (response: AddressSuggestionsResponse) => response.suggestions,
    }),
  }),
});

export const { useGetAddressSuggestionsQuery } = addressApi;
