import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import './styles/tw.css';
import './styles/tokens.css';
import './styles/glance-theme.css';
import './styles/cart-drawer.css';
import './styles/product-checkout.css';
import './styles/alerts.css';
import './styles/product-gallery.css';
import './styles/admin.css';
import './styles/admin-modern.css';
import ErrorBoundary from './components/common/ErrorBoundary';
import './styles/animations.css';

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <Provider store={store}>
      <App />
    </Provider>
  </ErrorBoundary>
);
