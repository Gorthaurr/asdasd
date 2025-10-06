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

  const discount = p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;
  const primaryImage = p.images?.find(img => img.is_primary);
  const displayImage = primaryImage || (p.images && p.images.length > 0 ? p.images[0] : null);

  return (
    <div className="w-[220px] h-[530px] bg-white">
      {/* Основной контейнер */}
      <div className="h-full p-6 flex flex-col">
        {/* Бейдж скидки */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 z-10 bg-[#EBBA1A] text-white text-xs font-medium px-2.5 py-1 rounded-md">
            -{discount}%
          </div>
        )}

        {/* Изображение товара */}
        <div className="flex-1 flex items-center justify-center mb-4">
          <div className="w-[169px] h-[216px] bg-gray-50 rounded-lg flex items-center justify-center">
            {displayImage ? (
              <img
                src={displayImage.url}
                alt={displayImage.alt_text || p.name}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            ) : (
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gray-300">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            )}
          </div>
        </div>

        {/* Точки для переключения картинок */}
        <div className="image-pagination-dots">
          <button className="image-pagination-dot active" aria-label="Изображение 1"></button>
          <button className="image-pagination-dot" aria-label="Изображение 2"></button>
          <button className="image-pagination-dot" aria-label="Изображение 3"></button>
          <button className="image-pagination-dot" aria-label="Изображение 4"></button>
        </div>

        {/* Название товара */}
        <h3 className="product-card-title text-base font-medium mb-3 leading-tight">
          <Link to={`/product/${p.originalId || p.id}`} className="hover:text-[#091D9E] transition-colors">
            {p.name}
          </Link>
        </h3>

        {/* Цена */}
        <div className="mb-4">
          <span className="text-lg font-medium text-black">{fmtCurrency(p.price)}</span>
          {p.oldPrice && (
            <span className="text-sm text-gray-400 line-through ml-2">{fmtCurrency(p.oldPrice)}</span>
          )}
        </div>

        {/* Наличие и сердечко */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-[#169B00] font-medium">Наличии</span>
          <button
            className={`product-favorite-btn w-10 h-10 flex items-center justify-center rounded-lg border transition-all ${
              isFav
                ? 'bg-white border-black text-black'
                : 'bg-white border-black text-gray-400 hover:border-[#091D9E] hover:text-[#091D9E]'
            }`}
            onClick={() => dispatch(toggleFav(p.id))}
            aria-label="В избранное"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>

        {/* Кнопка "В корзину" */}
        <button
          className="w-full bg-[#091D9E] text-white text-sm font-medium py-3 px-4 rounded-lg hover:bg-[#0a1a85] active:scale-[0.98] transition-all"
          onClick={handleAddToCart}
        >
          В корзину
        </button>
      </div>
    </div>
  );
}
