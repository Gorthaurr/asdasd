/**
 * Утилиты для форматирования данных
 * 
 * Содержит функции для преобразования чисел, дат и других типов данных
 * в читаемый для пользователя формат.
 */

/**
 * Форматирует число в валюту (RUB) с русской локалью
 *
 * @param n - Число для форматирования
 * @returns Отформатированная строка валюты
 *
 * @example
 * fmtCurrency(1234.56) // "1 234,56 ₽"
 */
export const fmtCurrency = (n: number): string => {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(n);
};