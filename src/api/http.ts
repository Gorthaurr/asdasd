// Axios-инстанс: подключим, когда будет реальный бэкенд
import axios from 'axios'; // HTTP-клиент


const http = axios.create({
    baseURL: (import.meta as any).env.VITE_API_BASE_URL, // базовый URL берём из .env
    timeout: 10000, // таймаут 10 секунд
});


// Примеры интерцепторов (раскомментировать при необходимости):
// http.interceptors.request.use(cfg => { /* auth, headers */ return cfg; });
// http.interceptors.response.use(r => r, err => Promise.reject(err));


export default http; // экспортируем инстанс