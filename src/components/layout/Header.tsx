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
    <header>
      <div className="container nav">
        <Link to="/" className="logo">GLANCE</Link>
        
        <div className="search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="text" placeholder="Поиск" />
        </div>

        <div className="actions">
          <button
            className="icon-btn"
            onClick={() => {
              window.location.href = "/?fav=1";
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            <span>Каталог</span>
          </button>

          <button
            className="icon-btn"
            onClick={() => dispatch(openDrawer())}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span>Корзина</span>
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </button>

          <button className="icon-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span>Профиль</span>
          </button>
        </div>
      </div>
    </header>
  );
}
