import express from 'express';
import { createServer as createViteServer } from 'vite';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Импорты React компонентов будут загружаться динамически

const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3000;

async function createServer() {
  const app = express();
  
  // Создаём Vite сервер в dev режиме
  let vite;
  if (!isProduction) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom'
    });
    app.use(vite.ssrLoadModule);
  } else {
    // В продакшене используем статические файлы
    app.use(express.static('dist/client'));
  }

  // Определяем ботов
  const isBot = (userAgent: string): boolean => {
    const botPatterns = [
      'googlebot', 'bingbot', 'yandexbot', 'baiduspider',
      'twitterbot', 'facebookexternalhit', 'rogerbot',
      'linkedinbot', 'embedly', 'quora', 'showyoubot',
      'outbrain', 'pinterest', 'slackbot', 'vkshare',
      'w3c_validator'
    ];
    return botPatterns.some(pattern => 
      userAgent.toLowerCase().includes(pattern)
    );
  };

  // SSR функция
  const render = async (url: string, userAgent: string) => {
    try {
      // Простой HTML для ботов
      const html = `
        <div id="root">
          <main class="container">
            <h1>TechnoFame - Премиальная бытовая техника</h1>
            <p>Премиальная бытовая техника от ведущих мировых производителей. Широкий ассортимент, гарантия качества, быстрая доставка.</p>
            <div class="categories-grid">
              <div class="category-card">
                <img src="/icons/Холодильники.png" alt="Холодильники" />
                <h3>Холодильники</h3>
              </div>
              <div class="category-card">
                <img src="/icons/Стиральные машины.png" alt="Стиральные машины" />
                <h3>Стиральные машины</h3>
              </div>
              <div class="category-card">
                <img src="/icons/Духовые шкафы.png" alt="Духовые шкафы" />
                <h3>Духовые шкафы</h3>
              </div>
            </div>
          </main>
        </div>
      `;
      
      return { html, state: {} };
    } catch (error) {
      console.error('SSR Error:', error);
      return { html: '', state: {} };
    }
  };

  // Обработка всех маршрутов
  app.get('*', async (req, res) => {
    const userAgent = req.get('User-Agent') || '';
    const isBotRequest = isBot(userAgent);

    try {
      if (isBotRequest) {
        // Для ботов - SSR
        const { html } = await render(req.url, userAgent);
        
        // Читаем HTML шаблон
        const template = isProduction 
          ? fs.readFileSync('dist/client/index.html', 'utf-8')
          : fs.readFileSync('index.html', 'utf-8');

        // Заменяем плейсхолдер
        const finalHtml = template.replace('<!--ssr-outlet-->', html);

        res.setHeader('Content-Type', 'text/html');
        res.send(finalHtml);
      } else {
        // Для обычных пользователей - SPA
        if (isProduction) {
          res.sendFile(path.resolve('dist/client/index.html'));
        } else {
          const template = fs.readFileSync('index.html', 'utf-8');
          res.send(template);
        }
      }
    } catch (error) {
      console.error('Render error:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`🤖 Bot detection: enabled`);
    console.log(`📦 Mode: ${isProduction ? 'production' : 'development'}`);
  });
}

createServer().catch(console.error);
