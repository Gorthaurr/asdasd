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
        return raw ? JSON.parse(raw) as T : def; 
    } catch { 
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
        localStorage.setItem(key, JSON.stringify(val));
    } catch (error) {
        console.warn(`Failed to save to localStorage: ${error}`);
    }
};