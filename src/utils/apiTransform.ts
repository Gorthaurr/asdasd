// Утилиты для преобразования данных из API в формат frontend
import type { Product } from '../types/product';
import type { ProductApi } from '../types/api';

/**
 * Преобразует продукт из API в формат frontend
 */
export function transformProduct(apiProduct: ProductApi): Product {
    // Проверяем, что ID существует
    if (!apiProduct.id) {
        console.error('Missing product ID:', apiProduct);
        throw new Error('Missing product ID');
    }

    return {
        id: apiProduct.id, // используем UUID напрямую
        name: apiProduct.name,
        category: getCategoryFromApi(apiProduct) || 'Другое',
        price: apiProduct.price_cents ? apiProduct.price_cents : 0, // конвертируем центы в рубли
        oldPrice: getOldPriceFromAttributes(apiProduct.attributes),
        rating: getRatingFromAttributes(apiProduct.attributes) || 4.5, // дефолтный рейтинг
        images: apiProduct.images, // передаем изображения
    };
}

/**
 * Получает категорию из API данных продукта
 */
function getCategoryFromApi(apiProduct: ProductApi): string | null {
    // Сначала пытаемся получить категорию из атрибутов
    const categoryFromAttributes = getCategoryFromAttributes(apiProduct.attributes);
    if (categoryFromAttributes) {
        return categoryFromAttributes;
    }
    
    // Если в атрибутах нет, используем category_id для определения категории
    // Это нужно будет дополнить маппингом category_id -> название категории
    // Пока возвращаем null, чтобы использовался fallback
    return null;
}

/**
 * Получает категорию из атрибутов продукта
 */
function getCategoryFromAttributes(attributes?: Array<{ key: string; value: string }>): string | null {
    if (!attributes) return null;
    
    const categoryAttr = attributes.find(attr => 
        attr.key.toLowerCase().includes('category') || 
        attr.key.toLowerCase().includes('категория')
    );
    
    return categoryAttr?.value || null;
}

/**
 * Получает старую цену из атрибутов продукта
 */
function getOldPriceFromAttributes(attributes?: Array<{ key: string; value: string }>): number | undefined {
    if (!attributes) return undefined;
    
    const oldPriceAttr = attributes.find(attr => 
        attr.key.toLowerCase().includes('old_price') || 
        attr.key.toLowerCase().includes('старая_цена')
    );
    
    if (oldPriceAttr?.value) {
        const price = parseFloat(oldPriceAttr.value);
        return isNaN(price) ? undefined : price;
    }
    
    return undefined;
}

/**
 * Получает рейтинг из атрибутов продукта
 */
function getRatingFromAttributes(attributes?: Array<{ key: string; value: string }>): number | null {
    if (!attributes) return null;
    
    const ratingAttr = attributes.find(attr => 
        attr.key.toLowerCase().includes('rating') || 
        attr.key.toLowerCase().includes('рейтинг')
    );
    
    if (ratingAttr?.value) {
        const rating = parseFloat(ratingAttr.value);
        return isNaN(rating) ? null : Math.min(5, Math.max(0, rating)); // ограничиваем 0-5
    }
    
    return null;
}
