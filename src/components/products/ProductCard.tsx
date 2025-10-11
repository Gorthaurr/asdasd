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
import CategoryIcon from '../common/CategoryIcon';
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
  const isFav = favIds.includes(Number(p.id));
  const qty = cartItems[Number(p.id)] ?? 0;
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
    <article
      className={`card animated-card enhanced-hover breathing stagger-animation ${isVisible ? 'visible' : ''} ${isHovered ? 'hovered' : ''}`}
      data-id={p.id}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="thumb">
        {/* Кнопка избранного — всегда сверху (см. overrides.css) */}
                  <button
            className={`fav animated-fav${isFav ? ' is-active' : ''}`}
            aria-pressed={isFav}
            title={isFav ? '💔 Убрать из избранного' : '💖 В избранное'}
            aria-label="Избранное"
            onClick={() => {
              console.log('Toggling favorite for product:', p.id, 'current isFav:', isFav);
              dispatch(toggleFav(Number(p.id)));
            }}
          >
            {/* Иконка избранного */}
            <img 
              src="/icons/Избранное.png" 
              alt="Избранное"
              style={{ 
                width: '18px', 
                height: '18px',
                filter: isFav ? 'none' : 'grayscale(100%) opacity(0.5)'
              }}
            />
            <div className="fav-ripple"></div>
          </button>

        {/* Превью — ссылка на страницу товара */}
        <Link
          to={`/product/${p.id}`}
          aria-label={`Перейти к товару: ${p.name}`}
          className="product-link"
        >
          <div className="image-container">
            {/* Бейдж скидки */}
            {p.oldPrice && (
              <div className="discount-badge">
                <span>🔥 -{Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)}%</span>
              </div>
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
            <div className="image-overlay">
              <span className="view-details">Подробнее</span>
            </div>
          </div>
        </Link>
      </div>

      <div className="content">
        {/* Название — тоже ссылка */}
        <div className="name">
          <Link
            to={`/product/${p.id}`}
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            {p.name}
          </Link>
        </div>

        <div className="meta">
          <span className="cat">
            <CategoryIcon categorySlug={p.category} size={16} className="category-icon-inline" />
            {p.category}
          </span> • {ratingStars}
          <span className="rating" style={{ marginLeft: 6 }}>
            ⭐ {p.rating.toFixed(1)}
          </span>
        </div>

        <div className="price" style={{ gap: 12 }}>
          <div className="price-info">
            <strong className="cost">💰 {fmtCurrency(p.price)}</strong>
            {p.oldPrice && <span className="old-price">🏷️ {fmtCurrency(p.oldPrice)}</span>}
          </div>

          {/* Контроль количества: − qty + (скрываем на странице избранного) */}
          {!isOnFavoritesPage && (
          <div className="qty-inline" aria-label="Количество в корзине">
            <button
              className="qty-btn animated-qty-btn magnetic-btn"
              aria-label="Убрать одну штуку"
              title="➖ Убрать"
              onClick={() => qty > 0 && dispatch(changeQty({ id: p.id, delta: -1 }))}
              disabled={qty === 0}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <div className="qty-btn-ripple"></div>
              <div className="qty-btn-glow"></div>
            </button>

            <span className="qty-count gradient-text-primary" aria-live="polite">
              {qty}
            </span>

            <button
              className="qty-btn animated-qty-btn magnetic-btn"
              aria-label="Добавить одну штуку"
              title="➕ Добавить"
              onClick={handleAddToCart}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <div className="qty-btn-ripple"></div>
              <div className="qty-btn-glow"></div>
            </button>
          </div>
          )}
        </div>
      </div>

      {/* Анимированные эффекты */}
      <div className="card-glow"></div>
      <div className="card-particles">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
      </div>
      <div className="morphing-bg"></div>
      <div className="parallax-bg"></div>
    </article>
  );
}
