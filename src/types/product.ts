// Тип товара — единая точка правды по полям каталога
export interface Product {
    id: number; // уникальный идентификатор
    name: string; // название товара
    category: string;// категория (для чипсов/фильтрации)
    price: number; // цена (EUR)
    rating: number; // рейтинг (0..5)
}