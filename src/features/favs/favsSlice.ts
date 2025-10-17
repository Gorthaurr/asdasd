// Слайс избранного: массив ID товаров
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getJSON } from '../../utils/storage';


const favsSlice = createSlice({
name: 'favs', // имя ветки состояния
initialState: { ids: getJSON('techhome_favs', [] as string[]) }, // начальное состояние из localStorage
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
