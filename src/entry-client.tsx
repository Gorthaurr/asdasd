import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';
import { catalogSlice } from './features/catalog/catalogSlice';
import { cartSlice } from './features/cart/cartSlice';
import { favsSlice } from './features/favs/favsSlice';

// Получаем предзагруженное состояние
const preloadedState = (window as any).__PRELOADED_STATE__ || {};

// Создаём store с предзагруженным состоянием
const store = configureStore({
  reducer: {
    catalog: catalogSlice.reducer,
    cart: cartSlice.reducer,
    favs: favsSlice.reducer,
  },
  preloadedState
});

// Гидрируем React на клиенте
hydrateRoot(
  document.getElementById('root')!,
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

// Очищаем предзагруженное состояние
delete (window as any).__PRELOADED_STATE__;
