// Страница оформления заказа: форма + сводка корзины (без кнопки «Назад в каталог»)

import { FormEvent, useState } from 'react'; // локальное состояние/типы формы
import { useDispatch, useSelector } from 'react-redux'; // Redux-хуки
import { useNavigate } from 'react-router-dom'; // навигация (Link удалён)
import { selectCartDetailed } from '../features/catalog/selectors'; // строки корзины и сумма
import { clearCart } from '../features/cart/cartSlice'; // экшен очистки корзины
import { fmtCurrency } from '../utils/format'; // форматирование суммы

export default function Checkout() {
  const dispatch = useDispatch(); // отправка экшенов
  const navigate = useNavigate(); // переходы между страницами
  const { rows, sum } = useSelector(selectCartDetailed); // данные корзины

  // Простое состояние формы (валидация базовая на required)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    payment: 'card', // способ оплаты: card | cod
    comment: '',
  });

  // Submit: (демо) логируем, показываем alert, чистим корзину и уводим на главную
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!rows.length) {
      alert('Корзина пуста. Добавьте товары перед оформлением.');
      return;
    }
    console.log('ORDER_DRAFT', { form, items: rows, total: sum });
    alert('Заказ оформлен (демо). Спасибо!');
    dispatch(clearCart());
    navigate('/'); // возврат на главную
  };

  return (
    <main className="container checkout-page">
      {/* Заголовок страницы (кнопка «Назад в каталог» удалена по просьбе) */}
      <h1 style={{ marginTop: 16 }}>Оформление заказа</h1>

      {/* Две колонки: форма (слева) + сводка (справа) */}
      <div className="checkout-grid">
        {/* Левая колонка — форма */}
        <form className="panel" onSubmit={onSubmit}>
          <fieldset>
            <legend>Контакты</legend>
            <div className="two-col">
              <label>
                Имя*
                <input
                  required
                  value={form.firstName}
                  onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                  placeholder="Иван"
                />
              </label>
              <label>
                Фамилия*
                <input
                  required
                  value={form.lastName}
                  onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                  placeholder="Иванов"
                />
              </label>
            </div>
            <div className="two-col">
              <label>
                Телефон*
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+7 999 000-00-00"
                />
              </label>
              <label>
                Email*
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                />
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend>Доставка</legend>
            <label>
              Адрес*
              <input
                required
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                placeholder="Улица, дом, квартира"
              />
            </label>
            <div className="two-col">
              <label>
                Город*
                <input
                  required
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  placeholder="Москва"
                />
              </label>
              <label>
                Индекс*
                <input
                  required
                  value={form.zip}
                  onChange={(e) => setForm((f) => ({ ...f, zip: e.target.value }))}
                  placeholder="101000"
                />
              </label>
            </div>
            <label>
              Комментарий к заказу
              <textarea
                rows={3}
                value={form.comment}
                onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
                placeholder="Например: позвоните за 30 минут до доставки"
              />
            </label>
          </fieldset>

          <fieldset>
            <legend>Оплата</legend>
            <label className="radio">
              <input
                type="radio"
                name="payment"
                checked={form.payment === 'card'}
                onChange={() => setForm((f) => ({ ...f, payment: 'card' }))}
              />
              <span>Картой онлайн</span>
            </label>
            <label className="radio">
              <input
                type="radio"
                name="payment"
                checked={form.payment === 'cod'}
                onChange={() => setForm((f) => ({ ...f, payment: 'cod' }))}
              />
              <span>Наличными/картой при получении</span>
            </label>
          </fieldset>

          <button className="btn primary" type="submit" disabled={!rows.length}>
            Подтвердить заказ
          </button>
          {!rows.length && (
            <p style={{ color: 'var(--muted)', marginTop: 8 }}>
              Корзина пуста — добавьте товары, чтобы оформить заказ.
            </p>
          )}
        </form>

        {/* Правая колонка — сводка заказа */}
        <aside className="panel">
          <h3 style={{ marginTop: 0 }}>Ваш заказ</h3>
          <div className="order-list">
            {rows.length === 0 ? (
              <div className="empty">Корзина пуста</div>
            ) : (
              rows.map((it) => (
                <div key={it.id} className="order-row">
                  <div className="row-title">
                    <div className="dot" aria-hidden="true" />
                    <div>
                      <div className="name">{it.name}</div>
                      <div className="muted">{it.category}</div>
                    </div>
                  </div>
                  <div className="row-sum">
                    ×{it.qty} • {fmtCurrency(it.price * it.qty)}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="sepline" />
          <div className="totals">
            <div>Товары</div>
            <div>
              <strong>{fmtCurrency(sum)}</strong>
            </div>
            <div>Доставка</div>
            <div>
              <strong>{rows.length ? 'Бесплатно' : '—'}</strong>
            </div>
            <div className="total-line">Итого</div>
            <div className="total-line">
              <strong>{fmtCurrency(sum)}</strong>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
