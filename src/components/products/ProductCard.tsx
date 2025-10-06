/**
 * Карточка товара: детальное отображение как на странице товара
 *
 * Функциональность:
 * - Большая картинка товара
 * - Цветовые варианты
 * - Детальные характеристики
 * - Цена и кнопка "В корзину"
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
 * Компонент детальной карточки товара
 *
 * Отображает полную информацию о товаре:
 * - Большая картинка
 * - Цветовые варианты
 * - Детальные характеристики
 * - Цена и кнопка "В корзину"
 */
export default function ProductCard({ p }: { p: Product }) {
  const dispatch = useDispatch();
  const favIds = useSelector(selectFavIds);
  const cartItems = useSelector(selectCartItems);
  const isFav = favIds.includes(p.id);
  const qty = cartItems[p.id] as any || 0;
  const [selectedColor, setSelectedColor] = useState(0);

  // Моковые данные для цветовых вариантов
  const colorVariants = [
    { color: '#ef4444', name: 'Красный' },
    { color: '#000000', name: 'Черный' },
    { color: '#ffffff', name: 'Белый' }
  ];

  // Моковые данные характеристик
  const specifications = {
    'Экран': '6.1" / 2532×1170',
    'Количество ядер': '6',
    'Мощность блока питания': '20 Вт',
    'Оперативная память (RAM)': '6 ГБ',
    'Встроенная память (ROM)': '128 ГБ',
    'Основная камера Миникс': '64/2'
  };

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
    <div className="product-card-detailed">
      {/* Бейдж скидки */}
      {discount > 0 && (
        <div className="discount-badge">
          -{discount}%
        </div>
      )}

      <div className="product-card-content">
        {/* Большая картинка товара */}
        <div className="product-image-section">
          <div className="product-main-image">
            {displayImage ? (
              <img
                src={displayImage.url}
                alt={displayImage.alt_text || p.name}
                className="main-product-image"
              />
            ) : (
              <div className="no-image-large">📱</div>
            )}
          </div>
        </div>

        {/* Информация о товаре */}
        <div className="product-info-section">
          <h1 className="product-title">{p.name}</h1>

          {/* Цветовые варианты */}
          <div className="color-variants">
            <span className="color-label">Цвет:</span>
            <div className="color-options">
              {colorVariants.map((variant, index) => (
                <button
                  key={index}
                  className={`color-option ${selectedColor === index ? 'selected' : ''}`}
                  style={{ backgroundColor: variant.color }}
                  onClick={() => setSelectedColor(index)}
                  title={variant.name}
                />
              ))}
            </div>
          </div>

          {/* Цена и кнопка корзины */}
          <div className="product-purchase">
            <div className="product-price">
              <span className="current-price">{fmtCurrency(p.price)}</span>
              {p.oldPrice && (
                <span className="old-price">{fmtCurrency(p.oldPrice)}</span>
              )}
            </div>
            <button
              className="add-to-cart-btn"
              onClick={handleAddToCart}
            >
              В корзину
            </button>
          </div>

          {/* Детальные характеристики */}
          <div className="product-specifications">
            <h3 className="specs-title">Характеристики:</h3>
            <div className="specs-list">
              {Object.entries(specifications).map(([key, value]) => (
                <div key={key} className="spec-item">
                  <span className="spec-label">{key}:</span>
                  <span className="spec-value">{value}</span>
                </div>
              ))}
            </div>
            <button className="show-all-specs">Все характеристики</button>
          </div>

          {/* Разделитель */}
          <div className="section-divider"></div>

          {/* Отзывы */}
          <div className="product-reviews">
            <h3 className="reviews-title">Отзывы</h3>
            <div className="reviews-summary">
              <span className="reviews-count">1325 отзывов</span>
              <span className="reviews-rating">2000 оценок</span>
            </div>

            <div className="reviews-list">
              {/* Моковые отзывы */}
              <div className="review-item">
                <div className="review-avatar">Д</div>
                <div className="review-content">
                  <div className="review-header">
                    <span className="review-author">Дмитрий</span>
                    <span className="review-date">25.07</span>
                    <div className="review-stars">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className="star">★</span>
                      ))}
                    </div>
                  </div>
                  <div className="review-text">
                    <strong>Плюсы:</strong> Очень красивый, удобно пользоваться<br/>
                    <strong>Минусы:</strong> Нет
                  </div>
                  <button className="read-more">Читать полностью</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
