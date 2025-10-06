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
    <article className="relative bg-white rounded-lg overflow-hidden flex flex-col h-full">
      {/* Бейдж скидки */}
      {discount > 0 && (
        <div className="absolute top-2 left-2 z-10 bg-[#EBBA1A] text-white text-xs font-medium px-2 py-1 rounded">
          -{discount}%
        </div>
      )}

      {/* Изображение товара */}
      <Link to={`/product/${p.originalId || p.id}`} className="block relative aspect-square bg-gray-50">
        {displayImage ? (
          <img 
            src={displayImage.url} 
            alt={displayImage.alt_text || p.name} 
            className="w-full h-full object-contain p-4"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
        )}
      </Link>

      {/* Контент карточки */}
      <div className="flex flex-col flex-1 p-3 gap-2">
        {/* Название */}
        <h3 className="text-sm font-normal line-clamp-2 min-h-[40px]">
          <Link to={`/product/${p.originalId || p.id}`} className="hover:text-[#091D9E] transition-colors">
            {p.name}
          </Link>
        </h3>

        {/* Цены */}
        <div className="flex items-center gap-2 mt-auto">
          <span className="text-lg font-medium text-black">{fmtCurrency(p.price)}</span>
          {p.oldPrice && (
            <span className="text-sm text-gray-400 line-through">{fmtCurrency(p.oldPrice)}</span>
          )}
        </div>

        {/* Наличие */}
        <div className="text-xs text-green-600">В наличии</div>

        {/* Кнопки */}
        <div className="flex gap-2 mt-2">
          <button 
            className="flex-1 bg-[#091D9E] text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-[#0a1a85] transition-colors"
            onClick={handleAddToCart}
          >
            В корзину
          </button>
          <button
            className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-colors ${
              isFav 
                ? 'bg-[#091D9E] border-[#091D9E] text-white' 
                : 'border-gray-300 text-gray-400 hover:border-[#091D9E] hover:text-[#091D9E]'
            }`}
            onClick={() => dispatch(toggleFav(p.id))}
            aria-label="В избранное"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
