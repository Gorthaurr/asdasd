/**
 * Карточка товара: кликабельное превью/название → страница товара
 *
 * Функциональность:
 * - «сердце» избранного (активное = синяя заливка)
 * - Контроль количества (− qty +)
 * - Анимированные эффекты при наведении
 */

import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFav } from '../../features/favs/favsSlice';
import { addToCart, changeQty } from '../../features/cart/cartSlice';
import { selectFavIds, selectCartItems } from '../../features/catalog/selectors';
import { fmtCurrency } from '../../utils/format';
import type { Product } from '../../types/product';

/**
 * Компонент карточки товара
 *
 * Отображает основную информацию о товаре с возможностью:
 * - Перехода на страницу товара
 * - Добавления в избранное
 * - Управления количеством в корзине
 */
export default function ProductCard({ p }: { p: Product }) {
  const dispatch = useDispatch();
  const favIds = useSelector(selectFavIds);
  const cartItems = useSelector(selectCartItems);
  const isFav = favIds.includes(p.id);
  const qty = cartItems[p.id] ?? 0;
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Проверяем, находимся ли на странице избранного
  const isOnFavoritesPage = window.location.search.includes('fav=1');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const ratingStars = useMemo(() => {
    const full = Math.floor(p.rating);
    const half = p.rating - full >= 0.5;
    return (
      <span className="stars" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} width="16" height="16" viewBox="0 0 24 24">
            <path
              d="M12 3.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.4L12 18.6 6.2 21.3l1.1-6.4L2.6 10.3l6.5-.9 2.9-5.9z"
              fill={i < full ? 'currentColor' : i === full && half ? 'currentColor' : 'none'}
              opacity={i === full && half ? 0.5 : 1}
              stroke="currentColor"
              strokeWidth=".8"
            />
          </svg>
        ))}
      </span>
    );
  }, [p.rating]);

  const handleAddToCart = () => {
    if (qty === 0) {
      dispatch(addToCart(p.id));
      // Сохраняем минимальные данные о товаре в localStorage для Checkout
      const cartProducts = JSON.parse(localStorage.getItem('techhome_cart_products') || '{}');
      cartProducts[p.id] = {
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        images: p.images
      };
      localStorage.setItem('techhome_cart_products', JSON.stringify(cartProducts));
    } else {
      dispatch(changeQty({ id: p.id, delta: +1 }));
    }
  };

  return (
    <article className="card">
      <div className="card__media">
        <button
          className={`fav${isFav ? ' is-active' : ''}`}
          onClick={() => dispatch(toggleFav(p.id))}
          aria-label="В избранное"
          style={{ position: 'absolute', right: 8, top: 8 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {p.oldPrice && (
          <span className="card__badge">- {Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)} %</span>
        )}

        <Link to={`/product/${p.originalId || p.id}`} aria-label={`Перейти к товару: ${p.name}`} className="product-link">
          <div className="image-container">
            {/* Изображение товара */}
            {(() => {
              const primaryImage = p.images?.find(img => img.is_primary);
              const displayImage = primaryImage || (p.images && p.images.length > 0 ? p.images[0] : null);
              return displayImage ? (
                <img src={displayImage.url} alt={displayImage.alt_text || p.name} className="product-image" loading="lazy" />
              ) : null;
            })()}
          </div>
        </Link>
      </div>

      <div className="content">
        <h3 className="card__title">
          <Link to={`/product/${p.originalId || p.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>{p.name}</Link>
        </h3>
        <div className="instock">В наличии</div>
        <div className="price">
          <div className="price__now">{fmtCurrency(p.price)}</div>
          {p.oldPrice && <div className="price__old">{fmtCurrency(p.oldPrice)}</div>}
        </div>
        <div className="card__actions">
          <button className="btn btn--ghost" aria-label="В избранное">♡</button>
          <button className="btn btn--primary" onClick={handleAddToCart}>В корзину</button>
        </div>
      </div>
    </article>
  );
}
