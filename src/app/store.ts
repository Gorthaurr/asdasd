// Конфигурация Redux store и middleware для персиста
import { configureStore } from '@reduxjs/toolkit'; // фабрика стора
import catalogReducer from '../features/catalog/catalogSlice'; // слайс каталога
import favsReducer from '../features/favs/favsSlice'; // слайс избранного
import cartReducer from '../features/cart/cartSlice'; // слайс корзины
// import enhancedCartReducer from '../features/cart/enhancedCartSlice'; // временно отключено
import { productsApi } from '../api/productsApi'; // RTK Query API сервис
import { setJSON } from '../utils/storage'; // утилита записи JSON в localStorage


// Мидлварь: сохраняет избранное/корзину после каждого экшена
const persistMiddleware = (storeAPI: any) => (next: any) => (action: any) => {
    const result = next(action); // пробрасываем экшен дальше
    const st = storeAPI.getState(); // читаем новое состояние
    setJSON('techhome_favs', st.favs.ids); // сохраняем избранное
    setJSON('techhome_cart', st.cart.items); // сохраняем корзину
    return result; // возвращаем результат next
};


export const store = configureStore({
    reducer: {
        catalog: catalogReducer, // регистрируем редьюсер каталога
        favs: favsReducer, // редьюсер избранного
        cart: cartReducer, // редьюсер корзины
        // enhancedCart: enhancedCartReducer, // временно отключено
        [productsApi.reducerPath]: productsApi.reducer, // RTK Query API
    },
    middleware: (gdm) => {
        const base = gdm(); // базовые middleware RTK
        return base.concat(productsApi.middleware, persistMiddleware); // с RTK Query
    }
});


// Типы корневого состояния и dispatch для удобства в компонентах
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;