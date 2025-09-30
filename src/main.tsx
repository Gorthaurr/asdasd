// Импорты стилей
import './styles/global.css';
import './styles/modern-user.css';
import './styles/user-effects.css';
import './styles/cart-drawer.css';
import './styles/product-checkout.css';
import './styles/alerts.css';
import './styles/light-override.css';
import './styles/product-gallery.css';
import './styles/admin.css';
import './styles/admin-modern.css';
import './styles/overrides.css';
import './styles/animations.css';
import './styles/components.css';

// Проверяем, есть ли предзагруженное состояние (SSR)
if (document.getElementById('root')?.innerHTML.trim()) {
  // Если есть SSR контент - гидрируем
  import('./entry-client');
} else {
  // Если нет - обычный рендер
  import('./app/store').then(({ store }) => {
    import('react-dom/client').then(({ createRoot }) => {
      import('./App').then(({ default: App }) => {
        import('./components/common/ErrorBoundary').then(({ default: ErrorBoundary }) => {
          import('react-redux').then(({ Provider }) => {
            createRoot(document.getElementById('root')!).render(
              <ErrorBoundary>
                <Provider store={store}>
                  <App />
                </Provider>
              </ErrorBoundary>
            );
          });
        });
      });
    });
  });
}
