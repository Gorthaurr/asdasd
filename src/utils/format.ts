// Форматирование валюты EUR для RU-локали
export const fmtCurrency = (n:number) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'EUR' }).format(n);