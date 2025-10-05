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
}