import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Heart, Menu } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../app/store';
import { setDrawerOpen } from '../../features/catalog/catalogSlice';
import { useCatalogUrlActions } from '../../routing/useCatalogUrlActions';
import { useGetProductsQuery } from '../../api/productsApi';
import SearchAutocomplete from './SearchAutocomplete';
import type { Product } from '../../types/product';
import { transformProduct } from '../../utils/productTransform';
import './Header.css';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setQ: setQUrl } = useCatalogUrlActions();
  const cartCount = useSelector((s: RootState) => Object.values(s.cart.items).reduce((sum, qty) => sum + qty, 0));
  const wishlistCount = useSelector((s: RootState) => s.favs.ids.length);

  // Получаем товары для автокомплита (все товары из каталога)
  const catalogProducts = useSelector((s: RootState) => s.catalog);
  const { data: productsData } = useGetProductsQuery({
    page: 1,
    page_size: 20, // Backend max
    include_images: true,
  });

  // Transform API products to UI products for search
  const products: Product[] = useMemo(() => {
    if (!productsData?.items) return [];
    return productsData.items.map(transformProduct);
  }, [productsData]);

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    setQUrl(query); // Используем URL-синхронизацию
    // Если мы не на главной странице, переходим туда
    if (window.location.pathname !== '/') {
      navigate('/');
    }
  };

  const handleMenuToggle = () => {
    window.dispatchEvent(new CustomEvent('toggleSidebar'));
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <button className="menu-toggle" onClick={handleMenuToggle}>
            <Menu size={24} />
          </button>
          <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <h1>TechnoFame</h1>
            <span>Бытовая техника</span>
          </div>
        </div>

        <div className="header-center">
          <SearchAutocomplete
            products={products}
            onSearch={handleSearch}
            placeholder="Поиск товаров..."
          />
        </div>

        <div className="header-right">
          <button className="header-action" onClick={() => navigate('/wishlist')}>
            <Heart size={24} />
            <span className="action-label">Избранное</span>
            {wishlistCount > 0 && <span className="wishlist-badge">{wishlistCount}</span>}
          </button>
          <button className="header-action cart-button" onClick={() => dispatch(setDrawerOpen(true))}>
            <ShoppingCart size={24} />
            <span className="action-label">Корзина</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          <button className="header-action">
            <User size={24} />
            <span className="action-label">Профиль</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
