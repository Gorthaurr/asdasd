/**
 * HTTP клиент для работы с API
 * 
 * Настроенный экземпляр Axios с базовой конфигурацией
 * для взаимодействия с backend API.
 */

import axios from 'axios';

/**
 * Настроенный HTTP клиент для API запросов
 * 
 * Конфигурация:
 * - Базовый URL из переменных окружения
 * - Таймаут 10 секунд
 * - Готовность для добавления интерцепторов
 */
const http = axios.create({
    baseURL: (import.meta as any).env.VITE_API_BASE_URL, // базовый URL из .env
    timeout: 10000, // таймаут 10 секунд
});

/**
 * Примеры интерцепторов для будущего использования:
 * 
 * // Добавление заголовков авторизации
 * http.interceptors.request.use(config => {
 *     const token = localStorage.getItem('auth_token');
 *     if (token) {
 *         config.headers.Authorization = `Bearer ${token}`;
 *     }
 *     return config;
 * });
 * 
 * // Обработка ошибок ответов
 * http.interceptors.response.use(
 *     response => response,
 *     error => {
 *         if (error.response?.status === 401) {
 *             // Обработка неавторизованного доступа
 *         }
 *         return Promise.reject(error);
 *     }
 * );
 */

export default http;