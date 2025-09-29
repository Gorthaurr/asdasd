import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { openDrawer } from '../../features/catalog/catalogSlice';
import { selectCartCount } from '../../features/catalog/apiSelectors';
import { selectFavCount } from '../../features/catalog/apiSelectors';
import type { RootState } from '../../app/store';
import { useCatalogUrlActions } from '../../routing/useCatalogUrlActions';

export default function Header() {
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);
  const favCount = useSelector(selectFavCount);
  
  // Отладочная информация
  useEffect(() => {
    console.log('Header favCount:', favCount);
  }, [favCount]);
  
  // Принудительно очищаем избранное при первой загрузке
  useEffect(() => {
    const needsClearing = localStorage.getItem('needs_fav_clearing');
    if (!needsClearing) {
      console.log('Force clearing favorites and cart to fix React issues');
      localStorage.removeItem('techhome_favs');
      localStorage.removeItem('techhome_cart');
      localStorage.setItem('needs_fav_clearing', 'done');
      window.location.reload();
    }
  }, []);
  const { toggleFavorites } = useCatalogUrlActions();
  const favOnly = useSelector((s: RootState) => s.catalog.favoriteOnly);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <header className={`animated-header ${isVisible ? 'visible' : ''}`}>
      <div className="container nav" role="navigation" aria-label="Основная навигация">
        <div className="brand animated-brand">
          <Link to="/" aria-label="Перейти в каталог" className="brand-link">
            <div className="logo animated-logo" aria-hidden="true">
              <div className="logo-glow"></div>
              <div className="logo-particles">
                <div className="logo-particle particle-1"></div>
                <div className="logo-particle particle-2"></div>
                <div className="logo-particle particle-3"></div>
              </div>
            </div>
          </Link>
          <div className="title animated-title">
            <span className="title-main">🏪 TechnoFame</span>
            <small className="title-subtitle">✨ Премиальная бытовая техника</small>
          </div>
        </div>

        <div className="actions animated-actions">
          <button
            className="icon-btn animated-icon-btn"
            aria-label="Перейти к избранному"
            title="Избранные товары"
            onClick={() => {
              console.log('Navigating to favorites');
              window.location.href = "/?fav=1";
            }}
          >
            <span style={{ fontSize: '24px', lineHeight: 1 }}>💖</span>
            {favCount > 0 && (
              <span className="badge animated-badge">
                <span className="badge-text">{favCount}</span>
                <div className="badge-glow"></div>
              </span>
            )}
            <div className="btn-ripple"></div>
          </button>

          <button
            className="icon-btn animated-icon-btn"
            title="Корзина"
            aria-label="Открыть корзину"
            onClick={() => dispatch(openDrawer())}
          >
            <span style={{ fontSize: '24px', lineHeight: 1 }}>🛒</span>
            {cartCount > 0 && (
              <span className="badge animated-badge cart-badge">
                <span className="badge-text">{cartCount}</span>
                <div className="badge-glow"></div>
              </span>
            )}
            <div className="btn-ripple"></div>
          </button>
        </div>
      </div>
    </header>
  );
}
