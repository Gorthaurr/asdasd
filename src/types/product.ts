import type { ProductImage } from './api';

// Тип товара — единая точка правды по полям каталога
export interface Product {
    id: number; // for compatibility with existing code
    originalId?: string; // original ID from API (string)
    name: string;
    category: string;
    price: number;
    oldPrice?: number;
    rating: number;
    images?: ProductImage[]; // images for the product
}