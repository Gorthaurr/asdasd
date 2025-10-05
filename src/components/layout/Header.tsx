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
    <header className="header">
      <div className="container header__row">
        <Link to="/" className="logo">GLANCE</Link>
        
        <form className="search" role="search">
          <label className="search__wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            <input className="search__field" type="text" placeholder="Поиск" />
          </label>
        </form>

        <div className="header__right">
          <button className="icon-btn" onClick={() => { window.location.href = "/?fav=1"; }} aria-label="Каталог">≡</button>
          <button className="icon-btn" onClick={() => dispatch(openDrawer())} aria-label="Корзина">🛒{cartCount > 0 && <span className="badge">{cartCount}</span>}</button>
          <button className="icon-btn" aria-label="Профиль">👤</button>
        </div>
      </div>
    </header>
  );
}
