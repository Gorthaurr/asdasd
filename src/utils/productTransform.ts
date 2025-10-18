import type { Product } from '../types/product';
import type { ProductApi } from '../types/api';

/**
 * Трансформирует данные товара из API в формат UI
 */
export function transformProduct(apiProduct: ProductApi): Product {
  // Извлекаем бренд из attributes
  const brandAttr = apiProduct.attributes?.find(attr => attr.key === 'Бренд');
  const brand = brandAttr?.value || apiProduct.name.split(' ')[0] || 'Unknown';

  // Преобразуем attributes в specifications объект
  const specifications: Record<string, string> = {};
  apiProduct.attributes?.forEach(attr => {
    specifications[attr.key] = attr.value;
  });

  // Извлекаем features (ключевые характеристики для карточки)
  const features: string[] = [];
  const featureKeys = [
    'Тип загрузки',
    'Загрузка белья (кг)',
    'Класс энергопотребления',
    'Максимальная скорость отжима (об/мин)',
    'Количество программ стирки',
    'Класс стирки'
  ];
  
  apiProduct.attributes?.forEach(attr => {
    if (featureKeys.includes(attr.key)) {
      features.push(`${attr.key}: ${attr.value}`);
    }
  });

  return {
    id: apiProduct.id,
    name: apiProduct.name,
    category: String(apiProduct.category_id),
    price: apiProduct.price_cents || 0, // price_cents уже в рублях, НЕ в копейках
    rating: 4.5, // TODO: получать из API когда добавят
    images: apiProduct.images,
    brand: brand,
    reviews: 127, // TODO: получать из API когда добавят
    inStock: true, // TODO: получать из API когда добавят
    features: features.length > 0 ? features : undefined,
    description: apiProduct.description,
    specifications: Object.keys(specifications).length > 0 ? specifications : undefined,
    image: apiProduct.images?.[0]?.urls?.original || apiProduct.images?.[0]?.url || '',
    originalPrice: undefined, // TODO: получать из API когда добавят
  };
}


