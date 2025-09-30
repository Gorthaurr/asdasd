// Конфиг Vite для SSG: подключаем плагин React
import { defineConfig } from 'vite'; // импорт фабрики конфигурации Vite
import react from '@vitejs/plugin-react'; // плагин для поддержки React/JSX/fast refresh
import { prerender } from 'vite-plugin-prerender'; // плагин для статической генерации

export default defineConfig({
    plugins: [
        react(), // регистрируем плагин React
        prerender({
            routes: [
                '/',
                '/product/1', // примеры статических страниц товаров
                '/product/2',
                '/product/3',
            ],
            rendererOptions: {
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            }
        })
    ],
    build: {
        outDir: 'dist',
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    router: ['react-router-dom'],
                    redux: ['@reduxjs/toolkit', 'react-redux']
                }
            }
        }
    },
    root: '.',
    publicDir: 'public'
});
