/**
 * Утилиты для форматирования данных
 * 
 * Содержит функции для преобразования чисел, дат и других типов данных
 * в читаемый для пользователя формат.
 */

/**
 * Форматирует число в валюту (EUR) с русской локалью
 * 
 * @param n - Число для форматирования
 * @returns Отформатированная строка валюты
 * 
 * @example
 * fmtCurrency(1234.56) // "1 234,56 €"
 */
export const fmtCurrency = (n: number): string => {
    return new Intl.NumberFormat('ru-RU', { 
        style: 'currency', 
        currency: 'EUR' 
    }).format(n);
};