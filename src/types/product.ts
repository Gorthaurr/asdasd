import type { ProductImage } from './api';

// Тип товара — единая точка правды по полям каталога
export interface Product {
    id: string; // UUID from API
    name: string;
    category: string;
    price: number;
    oldPrice?: number;
    rating: number;
    images?: ProductImage[]; // images for the product
    brand?: string;
    reviews?: number;
    inStock?: boolean;
    features?: string[];
    description?: string;
    specifications?: Record<string, string>;
    image?: string; // primary image URL
    originalPrice?: number;
    heatingType?: string; // тип нагрева для варочных панелей
}

// Тип состояния фильтров
export interface FilterState {
    category: string;
    priceRange: [number, number];
    brands: string[];
    heatingTypes: string[];
    inStock: boolean;
    sortBy: 'name' | 'price' | 'rating' | 'newest';
    sortDirection: 'asc' | 'desc';
}