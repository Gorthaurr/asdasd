/**
 * Слайс корзины: словарь { id: qty }
 * 
 * Обеспечивает управление товарами в корзине с персистентностью в localStorage.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getJSON } from '../../utils/storage';


/**
 * Тип для одной операции изменения количества
 */
interface ChangePayload { 
    id: string; 
    delta: number; 
}


const cartSlice = createSlice({
    name: 'cart', // имя ветки
    initialState: { 
        items: getJSON('techhome_cart', {} as Record<string, number>) 
    }, // читаем корзину из localStorage
    reducers: {
        /**
         * Добавить 1 шт товара в корзину
         */
        add: (s, a: PayloadAction<string>) => {
            const id = a.payload; // ID товара
            s.items[id] = (s.items[id] || 0) + 1; // инкремент
        },
        
        /**
         * Изменить количество товара на delta
         */
        change: (s, a: PayloadAction<ChangePayload>) => {
            const { id, delta } = a.payload; // распаковка
            const cur = s.items[id] || 0; // текущее кол-во
            const next = Math.max(0, cur + delta); // не уходим в минус
            if (next === 0) {
                delete s.items[id]; // 0 — удаляем ключ
                // Удаляем также из сохраненных данных
                if (typeof window !== 'undefined') {
                    const cartProducts = JSON.parse(localStorage.getItem('techhome_cart_products') || '{}');
                    delete cartProducts[id];
                    localStorage.setItem('techhome_cart_products', JSON.stringify(cartProducts));
                }
            } else {
                s.items[id] = next; // иначе записываем
            }
        },
        
        /**
         * Удалить позицию из корзины
         */
        remove: (s, a: PayloadAction<string>) => { 
            delete s.items[a.payload];
            // Удаляем также из сохраненных данных
            if (typeof window !== 'undefined') {
                const cartProducts = JSON.parse(localStorage.getItem('techhome_cart_products') || '{}');
                delete cartProducts[a.payload];
                localStorage.setItem('techhome_cart_products', JSON.stringify(cartProducts));
            }
        },
        
        /**
         * Очистить корзину полностью
         */
        clear: (s) => { 
            s.items = {};
            // Очищаем также сохраненные данные товаров
            if (typeof window !== 'undefined') {
                localStorage.removeItem('techhome_cart_products');
            }
        }
    }
});


// Экспорт экшенов с понятными именами
export const { 
    add: addToCart, 
    change: changeQty, 
    remove: removeFromCart, 
    clear: clearCart 
} = cartSlice.actions;

// Экспорт редьюсера
export default cartSlice.reducer;