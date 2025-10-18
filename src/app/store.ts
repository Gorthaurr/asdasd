// Конфигурация Redux store и middleware для персиста
import { configureStore } from '@reduxjs/toolkit'; // фабрика стора
import catalogReducer from '../features/catalog/catalogSlice'; // слайс каталога
import favsReducer from '../features/favs/favsSlice'; // слайс избранного
import cartReducer from '../features/cart/cartSlice'; // слайс корзины
// import enhancedCartReducer from '../features/cart/enhancedCartSlice'; // временно отключено
import { productsApi } from '../api/productsApi'; // RTK Query API сервис
import { addressApi } from '../api/addressApi'; // API для автодополнения адресов
import { setJSON } from '../utils/storage'; // утилита записи JSON в localStorage


// Мидлварь: сохраняет избранное/корзину после каждого экшена
// const persistMiddleware = (storeAPI: any) => (next: any) => (action: any) => {
//     const prevState = storeAPI.getState(); // читаем состояние ДО action
//     const result = next(action); // пробрасываем экшен дальше
//     const newState = storeAPI.getState(); // читаем новое состояние
    
//     // Сравниваем favs
//     const favsChanged = JSON.stringify(prevState.favs.ids) !== JSON.stringify(newState.favs.ids);
//     if (favsChanged) {
//         setJSON('techhome_favs', newState.favs.ids);
//     } else {
//         console.log('persistMiddleware: favs not changed, skipping save');
//     }
    
//     // Сравниваем cart
//     const cartChanged = JSON.stringify(prevState.cart.items) !== JSON.stringify(newState.cart.items);
//     if (cartChanged) {
//         setJSON('techhome_cart', newState.cart.items);
//     } else {
//         console.log('persistMiddleware: cart not changed, skipping save');
//     }
    
//     return result;
// };
console.log('persistMiddleware disabled; using direct storage in slices');


export const store = configureStore({
    reducer: {
        catalog: catalogReducer, // регистрируем редьюсер каталога
        favs: favsReducer, // редьюсер избранного
        cart: cartReducer, // редьюсер корзины
        // enhancedCart: enhancedCartReducer, // временно отключено
        [productsApi.reducerPath]: productsApi.reducer, // RTK Query API
        [addressApi.reducerPath]: addressApi.reducer, // API автодополнения адресов
    },
    middleware: (gdm) => {
        const base = gdm(); // базовые middleware RTK
        return base.concat(productsApi.middleware, addressApi.middleware); // без persist
    }
});


// Типы корневого состояния и dispatch для удобства в компонентах
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;