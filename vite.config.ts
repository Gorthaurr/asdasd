// Конфиг Vite: подключаем плагин React
import { defineConfig } from 'vite'; // импорт фабрики конфигурации Vite
import react from '@vitejs/plugin-react'; // плагин для поддержки React/JSX/fast refresh


export default defineConfig({
    plugins: [react()], // регистрируем плагин
});