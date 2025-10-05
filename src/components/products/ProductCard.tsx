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
      <div className="thumb">
        <button
          className={`fav${isFav ? ' is-active' : ''}`}
          onClick={() => dispatch(toggleFav(p.id))}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {/* Превью — ссылка на страницу товара */}
        <Link
          to={`/product/${p.originalId || p.id}`}
          aria-label={`Перейти к товару: ${p.name}`}
          className="product-link"
        >
          <div className="image-container">
            {p.oldPrice && (
              <div className="discount-badge">
                - {Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)} %
              </div>
            )}
            
            {!p.oldPrice && p.images && p.images.length > 1 && (
              <div className="new-badge">NEW</div>
            )}

            {/* Изображение товара */}
            {(() => {
              // Находим главное изображение или берем первое
              const primaryImage = p.images?.find(img => img.is_primary);
              const displayImage = primaryImage || (p.images && p.images.length > 0 ? p.images[0] : null);

              return displayImage ? (
                <img
                  src={displayImage.url}
                  alt={displayImage.alt_text || p.name}
                  className="product-image"
                  loading="lazy"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                  onError={(e) => {
                    // Fallback к SVG если изображение не загрузилось
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const svg = target.nextElementSibling as SVGElement;
                    if (svg) svg.style.display = 'block';
                  }}
                  onLoad={(e) => {
                    // Скрываем SVG placeholder когда изображение загрузилось
                    const svg = (e.target as HTMLImageElement).nextElementSibling as SVGElement;
                    if (svg) svg.style.display = 'none';
                  }}
                />
              ) : null;
            })()}

            {/* SVG placeholder (fallback) */}
            <svg
              viewBox="0 0 600 400"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Изображение товара"
              style={{ 
                display: p.images && p.images.length > 0 ? 'none' : 'block',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
              }}
            >
              <defs>
                <linearGradient id={`g${p.id}`} x1="0" x2="1">
                  <stop offset="0%" stopColor="#1c2340" />
                  <stop offset="100%" stopColor="#0f1428" />
                </linearGradient>
              </defs>
              <rect width="600" height="400" fill={`url(#g${p.id})`} />
              <g fill="#6ea8fe" opacity="0.9">
                <rect x="140" y="80" width="320" height="240" rx="24" />
                <rect x="170" y="110" width="260" height="180" rx="12" fill="#182039" />
                <rect x="270" y="300" width="60" height="12" rx="6" fill="#7cf3d0" />
              </g>
            </svg>
          </div>
          
          {p.images && p.images.length > 1 && (
            <div className="image-dots">
              {p.images.map((_, idx) => (
                <span key={idx} className={idx === 0 ? 'dot active' : 'dot'}></span>
              ))}
            </div>
          )}
        </Link>
      </div>

      <div className="content">
        {/* Название — тоже ссылка */}
        <div className="name">
          <Link
            to={`/product/${p.originalId || p.id}`}
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            {p.name}
          </Link>
        </div>

        <div className="meta">
          {p.category}
        </div>

        <div className="price">
          <div>
            <strong className="cost">{fmtCurrency(p.price)}</strong>
            {p.oldPrice && <span className="old-price">{fmtCurrency(p.oldPrice)}</span>}
          </div>
        </div>

        <div className="stock-status">В наличии</div>

        <button className="btn primary" onClick={handleAddToCart}>
          В корзину
        </button>
      </div>
    </article>
  );
}
