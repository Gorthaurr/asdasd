/**
 * Утилиты для работы с localStorage
 * 
 * Обеспечивает безопасное сохранение и загрузку JSON данных
 * с обработкой ошибок и fallback значениями.
 */

/**
 * Получает JSON данные из localStorage с fallback значением
 * 
 * @param key - Ключ для поиска в localStorage
 * @param def - Значение по умолчанию при ошибке или отсутствии данных
 * @returns Данные из localStorage или значение по умолчанию
 * 
 * @example
 * const cart = getJSON('cart', {});
 */
export const getJSON = <T>(key: string, def: T): T => {
    try { 
        const raw = localStorage.getItem(key); 
        if (!raw) {
            console.log(`Storage getJSON: No data for key ${key}, returning default`);
            return def;
        }
        const parsed = JSON.parse(raw) as T;
        console.log(`Storage getJSON: Loaded for ${key}:`, parsed);
        return parsed;
    } catch (e) { 
        console.error(`Storage getJSON error for ${key}:`, e);
        localStorage.removeItem(key); // сбрасываем поврежденные данные
        return def; 
    }
};

/**
 * Сохраняет данные в localStorage в формате JSON
 * 
 * @param key - Ключ для сохранения
 * @param val - Значение для сохранения
 * 
 * @example
 * setJSON('cart', { items: [] });
 */
export const setJSON = (key: string, val: unknown): void => {
    try {
        const json = JSON.stringify(val);
        localStorage.setItem(key, json);
        console.log(`Storage setJSON: Saved for ${key}:`, val);
    } catch (error) {
        console.error(`Failed to save to localStorage for ${key}:`, error);
    }
};