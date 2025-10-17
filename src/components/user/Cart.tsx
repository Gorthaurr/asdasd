import React, { useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../app/store';
import { changeQty, removeFromCart, clearCart } from '../../features/cart/cartSlice';
import { useGetProductsQuery, useGetProductQuery } from '../../api/productsApi';
import type { Product } from '../../types/product';
import { transformProduct } from '../../utils/productTransform';
import './Cart.css';

interface CartItem extends Product {
  quantity: number;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  
  const cart = useSelector((s: RootState) => s.cart.items);
  const cartIds = useMemo(() => Object.keys(cart).filter(id => cart[id] > 0), [cart]);
  
  // Для первоначальной загрузки товаров из большого набора
  const { data: productsData } = useGetProductsQuery({
    page: 1,
    page_size: 1000,
  });

  // Загружаем товары по ID'ам из корзины (максимум нужно загрузить отдельно)
  const items: CartItem[] = useMemo(() => {
    const key = 'techhome_cart_products';
    const raw = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    const snapshot: Record<string, Product> = raw ? (()=>{ try { return JSON.parse(raw); } catch { return {}; } })() : {};

    if (!productsData?.items && Object.keys(snapshot).length === 0) return [];
    
    const productsMap = new Map((productsData?.items || []).map(p => [String(p.id), p]));
    
    return Object.keys(cart)
      .filter(id => cart[id] > 0)
      .map(id => {
        const apiProduct = productsMap.get(id);
        if (apiProduct) {
          const product = transformProduct(apiProduct);
          return { ...product, quantity: cart[id] };
        }
        // fallback к снапшоту
        const snap = snapshot[id];
        if (snap) {
          return { ...snap, quantity: cart[id] } as CartItem;
        }
        return null;
      })
      .filter((item): item is CartItem => item !== null);
  }, [productsData, cart]);

  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    const currentQty = cart[productId] || 0;
    const delta = quantity - currentQty;
    dispatch(changeQty({ id: productId, delta }));
  };

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  useEffect(() => {
    if (!isOpen) return;
    
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    closeBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div
        className="cart-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        onClick={(e) => e.stopPropagation()}
        ref={dialogRef}
      >
        <div className="cart-header">
          <h2 id="cart-title" className="cart-title">Корзина</h2>
          <button ref={closeBtnRef} className="cart-close" onClick={onClose} aria-label="Закрыть корзину">
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">🛒</div>
            <h3>Корзина пуста</h3>
            <p>Добавьте товары из каталога</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  
                  <div className="cart-item-info">
                    <h4 className="cart-item-name">{item.name}</h4>
                    <p className="cart-item-brand">{item.brand}</p>
                    <div className="cart-item-price">
                      {formatPrice(item.price)}
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="cart-item-original-price">
                          {formatPrice(item.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="cart-item-controls">
                    <div className="quantity-controls">
                      <button
                        className="quantity-btn"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveItem(item.id)}
                      title="Удалить товар"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-summary" aria-live="polite">
                <div className="cart-summary-row">
                  <span>Товаров: {totalItems}</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="cart-summary-row cart-total">
                  <span>Итого:</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <div className="cart-actions">
                <button className="cart-clear-btn" onClick={handleClearCart}>
                  Очистить корзину
                </button>
                <button 
                  className="cart-checkout-btn"
                  onClick={() => {
                    onClose();
                    navigate('/checkout');
                  }}
                >
                  Оформить заказ
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
