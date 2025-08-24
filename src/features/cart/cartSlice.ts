// Слайс корзины: словарь { id: qty }
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getJSON } from '../../utils/storage';


// Тип для одной операции изменения количества
interface ChangePayload { id: number; delta: number; }


const cartSlice = createSlice({
    name: 'cart', // имя ветки
    initialState: { items: getJSON('techhome_cart', {} as Record<number, number>) }, // читаем корзину
    reducers: {
        add: (s, a: PayloadAction<number>) => { // добавить 1 шт
            const id = a.payload; // ID товара
            s.items[id] = (s.items[id] || 0) + 1; // инкремент
        },
        change: (s, a: PayloadAction<ChangePayload>) => { // изменить на delta
            const { id, delta } = a.payload; // распаковка
            const cur = s.items[id] || 0; // текущее кол-во
            const next = Math.max(0, cur + delta); // не уходим в минус
            if (next === 0) delete s.items[id]; // 0 — удаляем ключ
            else s.items[id] = next; // иначе записываем
        },
        remove: (s, a: PayloadAction<number>) => { delete s.items[a.payload]; }, // удалить позицию
        clear: (s) => { s.items = {}; } // очистить корзину
    }
});


export const { add: addToCart, change: changeQty, remove: removeFromCart, clear: clearCart } = cartSlice.actions; // экшены
export default cartSlice.reducer; // редьюсер