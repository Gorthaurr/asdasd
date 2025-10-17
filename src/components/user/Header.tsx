import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Heart, Menu } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../app/store';
import { openDrawer } from '../../features/catalog/catalogSlice';
import { useGetProductsQuery } from '../../api/productsApi';
import SearchAutocomplete from './SearchAutocomplete';
import type { Product } from '../../types/product';
import type { ProductApi } from '../../types/api';
import './Header.css';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartCount = useSelector((s: RootState) => Object.values(s.cart.items).reduce((sum, qty) => sum + qty, 0));
  const wishlistCount = useSelector((s: RootState) => s.favs.ids.length);

  // Получаем товары для автокомплита
  const { data: productsData } = useGetProductsQuery({
    page: 1,
    page_size: 50,
  });

  // Transform API products to UI products for search
  const products: Product[] = useMemo(() => {
    if (!productsData?.items) return [];
    return productsData.items.map((apiProduct: ProductApi) => ({
      id: apiProduct.id,
      name: apiProduct.name,
      category: String(apiProduct.category_id),
      price: (apiProduct.price_cents || 0) / 100,
      rating: 4.5,
      images: apiProduct.images,
      brand: apiProduct.name.split(' ')[0],
    }));
  }, [productsData]);

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <button className="menu-toggle" onClick={() => {}}>
            <Menu size={24} />
          </button>
          <div className="logo" onClick={() => navigate('/')}>
            <h1>TechnoFame</h1>
            <span>Бытовая техника</span>
          </div>
        </div>

        <div className="header-center">
          <SearchAutocomplete
            products={products}
            placeholder="Поиск товаров..."
          />
        </div>

        <div className="header-right">
          <button className="header-action" onClick={() => navigate('/wishlist')}>
            <Heart size={24} />
            <span className="action-label">Избранное</span>
            {wishlistCount > 0 && <span className="wishlist-badge">{wishlistCount}</span>}
          </button>
          <button className="header-action cart-button" onClick={() => dispatch(openDrawer())}>
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

