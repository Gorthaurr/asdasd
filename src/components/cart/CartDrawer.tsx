import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { closeDrawer } from '../../features/catalog/catalogSlice';
import { changeQty } from '../../features/cart/cartSlice';
import { selectCartDetailed as selectCartDetailedApi } from '../../features/catalog/apiSelectors';
import { fmtCurrency } from '../../utils/format';
import type { RootState } from '../../app/store';

export default function CartDrawer() {
  const dispatch = useDispatch();
  const open = useSelector((s: RootState) => s.catalog.drawerOpen);
  const { rows, sum } = useSelector(selectCartDetailedApi);
  const [isVisible, setIsVisible] = useState(false);

  // Отладка изображений
  console.log('Cart items with images:', rows.map(r => ({
    id: r.id, 
    name: r.name, 
    hasImages: !!r.images, 
    imageCount: r.images?.length || 0,
    firstImage: r.images?.[0]
  })));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) dispatch(closeDrawer());
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <>
      <div
        id="overlay"
        className={`overlay animated-overlay ${open ? ' open' : ''} ${isVisible ? 'visible' : ''}`}
        aria-hidden={!open}
        onClick={() => dispatch(closeDrawer())}
      />
      <aside
        id="drawer"
        className={`drawer animated-drawer ${open ? ' open' : ''} ${isVisible ? 'visible' : ''}`}
        aria-label="Корзина"
        aria-hidden={!open}
        role="dialog"
        aria-modal="true"
      >
        <header className="container" style={{ padding: '14px 0' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              justifyContent: 'space-between',
            }}
          >
            <h3 style={{ margin: 0 }} className="drawer-title">
              Корзина
            </h3>
            <button
              className="icon-btn animated-close-btn"
              aria-label="Закрыть корзину"
              onClick={() => dispatch(closeDrawer())}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 6l12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <div className="close-ripple"></div>
            </button>
          </div>
        </header>

        <div className="body" id="cartList">
          {rows.length === 0 ? (
            <div className="empty animated-empty">
              <p>🛒</p>
              <p>Корзина пуста</p>
              <small>Добавьте товары для продолжения покупок</small>
            </div>
          ) : (
            <div className="cart-items-container">
              {rows.map((it, index) => (
                <div
                  className="cart-item animated-cart-item"
                  key={it.id}
                  data-id={it.id}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="cart-thumb animated-thumb">
                    {it.images && it.images.length > 0 ? (
                      <img 
                        src={it.images[0].url} 
                        alt={it.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          console.log('Image failed to load:', it.images[0]);
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = '<div class="no-image">📦</div>';
                          }
                        }}
                        onLoad={() => {
                          console.log('Image loaded successfully:', it.images[0].url);
                        }}
                      />
                    ) : (
                      <div className="no-image">📦</div>
                    )}
                  </div>
                  <div className="cart-content">
                    <div className="cart-name">{it.name || 'Товар не найден'}</div>
                    <div className="cart-category">{it.category || 'Без категории'}</div>
                    <div className="cart-price">{fmtCurrency(it.price)}</div>
                  </div>
                  <div className="qty animated-qty">
                    <button
                      className="qty-btn animated-qty-btn"
                      aria-label="Уменьшить"
                      onClick={() => dispatch(changeQty({ id: it.id, delta: -1 }))}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      <div className="qty-btn-ripple"></div>
                      <div className="qty-btn-glow"></div>
                    </button>
                    <span className="qty-count">{it.qty}</span>
                    <button
                      className="qty-btn animated-qty-btn"
                      aria-label="Увеличить"
                      onClick={() => dispatch(changeQty({ id: it.id, delta: +1 }))}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      <div className="qty-btn-ripple"></div>
                      <div className="qty-btn-glow"></div>
                    </button>
                  </div>
                  <div className="cart-item-glow"></div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="footer animated-footer">
          <div className="summary animated-summary">
            <span>Товары</span>
            <strong id="sumItems">{fmtCurrency(sum)}</strong>
          </div>
          <div className="summary animated-summary total">
            <span>Итого</span>
            <strong id="sumTotal">{fmtCurrency(sum)}</strong>
          </div>
          {/* ✅ Переход к оформлению: закрываем дровер и уходим на /checkout */}
          {rows.length > 0 ? (
            <Link
              className="checkout animated-checkout"
              id="checkoutBtn"
              to="/checkout"
              onClick={() => dispatch(closeDrawer())}
            >
              <span>💳 Оформить заказ</span>
              <div className="checkout-ripple"></div>
              <div className="checkout-glow"></div>
            </Link>
          ) : (
            <button
              className="checkout animated-checkout"
              disabled
              style={{ opacity: 0.5, cursor: 'not-allowed' }}
            >
              <span>🛒 Корзина пуста</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
