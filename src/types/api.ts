// Типы для API интеграции
export interface ProductApi {
    id: string;
    category_id: number;
    name: string;
    price_raw?: string;
    price_cents?: number;
    description?: string;
    images?: ProductImage[];
    attributes?: ProductAttribute[];
}

// Тип изображения продукта
export interface ProductImage {
    id: number;
    path: string;
    filename: string;
    sort_order: number;
    is_primary: boolean;
    status: string;
    url?: string;
    urls?: Record<string, string>;
    file_size?: number;
    mime_type?: string;
    width?: number;
    height?: number;
    alt_text?: string;
}

// Тип атрибута продукта
export interface ProductAttribute {
    id: number;
    key: string;
    value: string;
}

// Тип ответа API для списка продуктов
export interface ProductsResponse {
    items: ProductApi[];
    meta: {
        page: number;
        page_size: number;
        total: number;
        total_pages: number;
    };
}

// Тип категории из API
export interface CategoryApi {
    id: number;
    slug: string;
}
