// Слайс избранного: массив ID товаров
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getJSON } from '../../utils/storage';


const favsSlice = createSlice({
name: 'favs', // имя ветки состояния
initialState: { 
    ids: (() => {
        const stored = getJSON('techhome_favs', [] as string[]);
        if (!Array.isArray(stored)) {
            console.warn('Invalid favs data: not an array, resetting');
            localStorage.removeItem('techhome_favs');
            return [];
        }
        const filtered = stored.filter(id => typeof id === 'string');
        if (filtered.length !== stored.length) {
            console.warn('Invalid favs data: non-string IDs removed');
        }
        console.log('Loaded favs IDs:', filtered);
        return filtered;
    })()
}, // начальное состояние из localStorage с валидацией
reducers: {
toggleFav: (s, a: PayloadAction<string>) => { // переключить товар в избранном
    const id = a.payload;
    const idx = s.ids.indexOf(id);
    if (idx >= 0) {
        s.ids.splice(idx, 1);
        console.log('Removed from favs:', id);
    } else {
        s.ids.push(id);
        console.log('Added to favs:', id);
    }
    
    // Сохраняем в localStorage
    try {
        localStorage.setItem('techhome_favs', JSON.stringify(s.ids));
        console.log('Saved favs to localStorage:', s.ids);
    } catch (e) {
        console.error('Failed to save favs to localStorage:', e);
    }
}
}
});


export const { toggleFav } = favsSlice.actions; // экспорт экшена
export const { toggleFav: toggleFavorite } = favsSlice.actions; // алиас для совместимости
export default favsSlice.reducer; // экспорт редьюсера
