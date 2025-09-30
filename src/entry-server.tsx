import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';
import { catalogSlice } from './features/catalog/catalogSlice';
import { cartSlice } from './features/cart/cartSlice';
import { favsSlice } from './features/favs/favsSlice';

interface RenderResult {
  html: string;
  state: any;
}

export async function render(url: string): Promise<RenderResult> {
  try {
    // Создаём store для SSR
    const store = configureStore({
      reducer: {
        catalog: catalogSlice.reducer,
        cart: cartSlice.reducer,
        favs: favsSlice.reducer,
      },
      preloadedState: {
        catalog: {
          chip: 'Все',
          favoriteOnly: false,
          products: [],
          categories: [],
          loading: false,
          error: null
        },
        cart: {},
        favs: { ids: [] }
      }
    });

    // Загружаем данные для SSR (если нужно)
    // await store.dispatch(fetchCategories());

    // Рендерим React в строку
    const html = renderToString(
      <Provider store={store}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </Provider>
    );

    const state = store.getState();
    
    return { html, state };
  } catch (error) {
    console.error('SSR Error:', error);
    return { html: '', state: {} };
  }
}
