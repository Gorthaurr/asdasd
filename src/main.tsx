import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import './styles/global.css';
import './styles/modern-user.css';
import './styles/user-effects.css';
import './styles/cart-drawer.css';
import './styles/product-checkout.css';
import './styles/light-override.css';
import './styles/admin.css';
import './styles/admin-modern.css';
import ErrorBoundary from './components/common/ErrorBoundary';
import './styles/overrides.css';
import './styles/animations.css';
import './styles/components.css';

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <Provider store={store}>
      <App />
    </Provider>
  </ErrorBoundary>
);
