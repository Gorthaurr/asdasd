// Слайс избранного: массив ID товаров
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getJSON } from '../../utils/storage';


const favsSlice = createSlice({
name: 'favs', // имя ветки состояния
initialState: { 
    ids: (() => {
        const stored = getJSON('techhome_favs', [] as string[]);
        // Если это не массив - сбрасываем
        if (!Array.isArray(stored)) {
            localStorage.removeItem('techhome_favs');
            return [];
        }
        // Фильтруем только строковые ID
        return stored.filter(id => typeof id === 'string');
    })()
}, // начальное состояние из localStorage с валидацией
reducers: {
toggleFav: (s, a: PayloadAction<string>) => { // переключить товар в избранном
const id = a.payload; // ID товара
const i = s.ids.indexOf(id); // ищем позицию
if (i >= 0) s.ids.splice(i, 1); // если уже есть — удалить
else s.ids.push(id); // иначе — добавить
}
}
});


export const { toggleFav } = favsSlice.actions; // экспорт экшена
export const { toggleFav: toggleFavorite } = favsSlice.actions; // алиас для совместимости
export default favsSlice.reducer; // экспорт редьюсера
