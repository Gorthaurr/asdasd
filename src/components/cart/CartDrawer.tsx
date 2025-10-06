import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { closeDrawer } from '../../features/catalog/catalogSlice';
import { changeQty, removeFromCart } from '../../features/cart/cartSlice';
import { selectCartDetailed as selectCartDetailedApi } from '../../features/catalog/apiSelectors';
import { fmtCurrency } from '../../utils/format';
import type { RootState } from '../../app/store';

export default function CartDrawer() {
  const dispatch = useDispatch();
  const open = useSelector((s: RootState) => s.catalog.drawerOpen);
  const { rows, sum } = useSelector(selectCartDetailedApi);
  const [isVisible, setIsVisible] = useState(false);

  // Убираем спам логов
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
                  className="cart-item-row"
                  key={it.id}
                  data-id={it.id}
                >
                  <div className="cart-item-checkbox">
                    <input
                      type="checkbox"
                      className="cart-checkbox"
                      defaultChecked={true}
                    />
                  </div>

                  <div className="cart-item-image">
                    {it.images && it.images.length > 0 ? (
                      <img
                        src={it.images[0].url}
                        alt={it.name}
                        className="cart-product-image"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = '<div class="no-image">📦</div>';
                          }
                        }}
                      />
                    ) : (
                      <div className="no-image">📦</div>
                    )}
                  </div>

                  <div className="cart-item-info">
                    <div className="cart-item-title">{it.name || 'Товар не найден'}</div>
                    <div className="cart-item-subtitle">{it.category || 'Без категории'}</div>
                  </div>

                  <div className="cart-item-price">
                    <div className="price-current">{fmtCurrency(it.price * it.qty)}</div>
                    {it.oldPrice && (
                      <div className="price-old">{fmtCurrency(it.oldPrice * it.qty)}</div>
                    )}
                  </div>

                  <div className="cart-item-controls">
                    <div className="quantity-controls">
                      <button
                        className="qty-btn qty-minus"
                        aria-label="Уменьшить количество"
                        onClick={() => dispatch(changeQty({ id: it.id, delta: -1 }))}
                      >
                        −
                      </button>
                      <span className="qty-display">{it.qty}</span>
                      <button
                        className="qty-btn qty-plus"
                        aria-label="Увеличить количество"
                        onClick={() => dispatch(changeQty({ id: it.id, delta: +1 }))}
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="remove-btn"
                      aria-label="Удалить товар"
                      onClick={() => dispatch(removeFromCart(it.id))}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="footer animated-footer">
          {rows.length > 0 && (
            <div className="cart-select-all">
              <input
                type="checkbox"
                className="cart-checkbox select-all-checkbox"
                defaultChecked={true}
              />
              <span>Выбрать всё</span>
            </div>
          )}

          <div className="summary animated-summary">
            <span>Итого:</span>
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
              <span>Оформить заказ</span>
              <div className="checkout-ripple"></div>
              <div className="checkout-glow"></div>
            </Link>
          ) : (
            <button
              className="checkout animated-checkout"
              disabled
              style={{ opacity: 0.5, cursor: 'not-allowed' }}
            >
              <span>Корзина пуста</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
