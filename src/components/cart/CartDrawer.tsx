import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { closeDrawer } from '../../features/catalog/catalogSlice';
import { changeQty } from '../../features/cart/cartSlice';
import { selectCartDetailed } from '../../features/catalog/selectors';
import { fmtCurrency } from '../../utils/format';
import type { RootState } from '../../app/store';

export default function CartDrawer() {
  const dispatch = useDispatch();
  const open = useSelector((s: RootState) => s.catalog.drawerOpen);
  const { rows, sum } = useSelector(selectCartDetailed);
  const [isVisible, setIsVisible] = useState(false);

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
              <div className="empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h9m-9 0a2 2 0 100 4 2 2 0 000-4zm9 0a2 2 0 100 4 2 2 0 000-4z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
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
                  <div className="cart-thumb animated-thumb"></div>
                  <div className="cart-content">
                    <div className="cart-name">{it.name}</div>
                    <div className="cart-category">{it.category}</div>
                    <div className="cart-price">{fmtCurrency(it.price)}</div>
                  </div>
                  <div className="qty animated-qty">
                    <button
                      className="qty-btn animated-qty-btn"
                      aria-label="Уменьшить"
                      onClick={() => dispatch(changeQty({ id: it.id, delta: -1 }))}
                    >
                      <span>−</span>
                      <div className="qty-btn-ripple"></div>
                      <div className="qty-btn-glow"></div>
                    </button>
                    <span className="qty-count">{it.qty}</span>
                    <button
                      className="qty-btn animated-qty-btn"
                      aria-label="Увеличить"
                      onClick={() => dispatch(changeQty({ id: it.id, delta: +1 }))}
                    >
                      <span>+</span>
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
          <div className="summary animated-summary">
            <span>Доставка</span>
            <strong id="sumShip">{rows.length ? 'Бесплатно' : '—'}</strong>
          </div>
          <div className="summary animated-summary total">
            <span>Итого</span>
            <strong id="sumTotal">{fmtCurrency(sum)}</strong>
          </div>
          {/* ✅ Переход к оформлению: закрываем дровер и уходим на /checkout */}
          <Link
            className="checkout animated-checkout"
            id="checkoutBtn"
            to="/checkout"
            onClick={() => dispatch(closeDrawer())}
          >
            <span>Оформить заказ</span>
            <div className="checkout-ripple"></div>
            <div className="checkout-glow"></div>
          </Link>
        </div>
      </aside>
    </>
  );
}
