// Страница оформления заказа: форма + сводка корзины (без кнопки «Назад в каталог»)

import { FormEvent, useState, useEffect } from 'react'; // локальное состояние/типы формы
import { useDispatch, useSelector } from 'react-redux'; // Redux-хуки
import { useNavigate } from 'react-router-dom'; // навигация (Link удалён)
import { selectCartDetailed as selectCartDetailedApi, selectCartItems } from '../features/catalog/apiSelectors'; // строки корзины и сумма
import { clearCart } from '../features/cart/cartSlice'; // экшен очистки корзины
import { fmtCurrency } from '../utils/format';
import { toast } from '../utils/toast'; // форматирование суммы
import { useGetProductsQuery } from '../api/productsApi'; // хук для загрузки товаров

export default function Checkout() {
  const dispatch = useDispatch(); // отправка экшенов
  const navigate = useNavigate(); // переходы между страницами
  
  // Получаем ID товаров из корзины
  const cartItems = useSelector(selectCartItems);
  const cartIds = Object.keys(cartItems).map(id => Number(id));
  
  // Загружаем первую страницу товаров чтобы заполнить кэш
  // Это позволит selectCartDetailed найти хотя бы некоторые товары
  const { isLoading } = useGetProductsQuery({
    page: 1,
    page_size: 50, // загружаем побольше товаров
    include_images: true,
    include_attributes: true
  }, {
    skip: cartIds.length === 0 // не делаем запрос если корзина пуста
  });
  
  const { rows, sum } = useSelector(selectCartDetailedApi); // данные корзины

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

  // Состояние ошибок валидации
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Валидация формы
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.firstName.trim()) newErrors.firstName = 'Укажите ваше имя';
    if (!form.lastName.trim()) newErrors.lastName = 'Укажите вашу фамилию';
    if (!form.phone.trim()) newErrors.phone = 'Укажите номер телефона';
    if (!form.email.trim()) newErrors.email = 'Укажите email адрес';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Некорректный email адрес';
    if (!form.address.trim()) newErrors.address = 'Укажите адрес доставки';
    if (!form.city.trim()) newErrors.city = 'Укажите город';
    if (!form.zip.trim()) newErrors.zip = 'Укажите почтовый индекс';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Кастомизация стандартных сообщений валидации
  const handleInvalid = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    const input = e.currentTarget;
    const field = input.id;
    
    const customMessages: Record<string, string> = {
      firstName: '👤 Пожалуйста, укажите ваше имя',
      lastName: '👥 Пожалуйста, укажите вашу фамилию', 
      phone: '📱 Пожалуйста, укажите номер телефона',
      email: '📧 Пожалуйста, укажите корректный email',
      address: '🏠 Пожалуйста, укажите адрес доставки',
      city: '🏙️ Пожалуйста, укажите город',
      zip: '📮 Пожалуйста, укажите почтовый индекс'
    };

    setErrors(prev => ({ ...prev, [field]: customMessages[field] || 'Заполните это поле' }));
    input.focus();
  };

  // Submit: (демо) логируем, показываем toast, чистим корзину и уводим на главную
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!rows.length) {
      toast.warning('Добавьте товары перед оформлением заказа', 'Корзина пуста');
      return;
    }

    if (!validateForm()) {
      toast.error('Пожалуйста, заполните все обязательные поля', 'Проверьте форму');
      return;
    }

    console.log('ORDER_DRAFT', { form, items: rows, total: sum });
    toast.success('Спасибо за заказ! Мы свяжемся с вами в ближайшее время', 'Заказ оформлен');
    dispatch(clearCart());
    setTimeout(() => navigate('/'), 2000); // возврат на главную через 2 сек
  };

  return (
    <main className="container checkout-page">
      {/* Заголовок страницы (кнопка «Назад в каталог» удалена по просьбе) */}
      <h1>Оформление заказа</h1>

      {/* Две колонки: форма (слева) + сводка (справа) */}
      <div className="checkout-grid">
        {/* Левая колонка — форма */}
        <form className="checkout-form" onSubmit={onSubmit}>
          <fieldset>
            <legend data-section="personal">Контакты</legend>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">Имя*</label>
                <input
                  id="firstName"
                  required
                  className={errors.firstName ? 'error' : ''}
                  value={form.firstName}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, firstName: e.target.value }));
                    if (errors.firstName) {
                      setErrors(prev => ({ ...prev, firstName: '' }));
                    }
                  }}
                  placeholder="Иван"
                  title="👤 Укажите ваше имя"
                  onInvalid={handleInvalid}
                />
                {errors.firstName && <div className="form-error">{errors.firstName}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Фамилия*</label>
                <input
                  id="lastName"
                  required
                  className={errors.lastName ? 'error' : ''}
                  value={form.lastName}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, lastName: e.target.value }));
                    if (errors.lastName) {
                      setErrors(prev => ({ ...prev, lastName: '' }));
                    }
                  }}
                  placeholder="Иванов"
                  title="👥 Укажите вашу фамилию"
                  onInvalid={handleInvalid}
                />
                {errors.lastName && <div className="form-error">{errors.lastName}</div>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Телефон*</label>
                <input
                  id="phone"
                  required
                  type="tel"
                  className={errors.phone ? 'error' : ''}
                  value={form.phone}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, phone: e.target.value }));
                    if (errors.phone) {
                      setErrors(prev => ({ ...prev, phone: '' }));
                    }
                  }}
                  placeholder="+7 999 000-00-00"
                  title="📱 Укажите номер телефона"
                  onInvalid={handleInvalid}
                />
                {errors.phone && <div className="form-error">{errors.phone}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="email">Email*</label>
                <input
                  id="email"
                  required
                  type="email"
                  className={errors.email ? 'error' : ''}
                  value={form.email}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, email: e.target.value }));
                    if (errors.email) {
                      setErrors(prev => ({ ...prev, email: '' }));
                    }
                  }}
                  placeholder="you@example.com"
                  title="📧 Укажите email адрес"
                  onInvalid={handleInvalid}
                />
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend data-section="delivery">Доставка</legend>
            <div className="form-group">
              <label htmlFor="address">Адрес*</label>
              <input
                id="address"
                required
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                placeholder="Улица, дом, квартира"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">Город*</label>
                <input
                  id="city"
                  required
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  placeholder="Москва"
                />
              </div>
              <div className="form-group">
                <label htmlFor="zip">Индекс*</label>
                <input
                  id="zip"
                  required
                  value={form.zip}
                  onChange={(e) => setForm((f) => ({ ...f, zip: e.target.value }))}
                  placeholder="101000"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="comment">Комментарий к заказу</label>
              <textarea
                id="comment"
                rows={3}
                value={form.comment}
                onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
                placeholder="Например: позвоните за 30 минут до доставки"
              />
            </div>
          </fieldset>

          <fieldset>
            <legend data-section="payment">Оплата</legend>
            <div className="payment-options">
              <div className="payment-option">
                <input
                  type="radio"
                  id="card"
                  name="payment"
                  checked={form.payment === 'card'}
                  onChange={() => setForm((f) => ({ ...f, payment: 'card' }))}
                />
                <label htmlFor="card" data-payment="card">Картой онлайн</label>
              </div>
              <div className="payment-option">
                <input
                  type="radio"
                  id="cod"
                  name="payment"
                  checked={form.payment === 'cod'}
                  onChange={() => setForm((f) => ({ ...f, payment: 'cod' }))}
                />
                <label htmlFor="cod" data-payment="cod">Наличными/картой при получении</label>
              </div>
            </div>
          </fieldset>

          <button className="checkout-submit" type="submit" disabled={!rows.length}>
            Подтвердить заказ
          </button>
          {!rows.length && (
            <p style={{ color: 'var(--muted)', marginTop: 8 }}>
              Корзина пуста — добавьте товары, чтобы оформить заказ.
            </p>
          )}
        </form>

        {/* Правая колонка — сводка заказа */}
        <aside className="order-summary">
          <h2>Ваш заказ</h2>
          <div className="order-items">
            {isLoading ? (
              <div className="loading-cart" style={{ textAlign: 'center', padding: '40px 20px' }}>
                🔄 Загружаем товары...
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '8px 0 0 0' }}>
                  Пожалуйста, подождите
                </p>
              </div>
            ) : rows.length === 0 ? (
              <div className="empty-cart">
                🛒 Корзина пуста
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '8px 0 0 0' }}>
                  Вернитесь в каталог и добавьте товары
                </p>
              </div>
            ) : (
              rows.map((it) => (
                <div key={it.id} className="order-row">
                  {it.images?.[0]?.url ? (
                    <img 
                      src={it.images[0].url} 
                      alt={it.name}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      background: 'var(--bg-muted)', 
                      borderRadius: 'var(--radius)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem'
                    }}>
                      📦
                    </div>
                  )}
                  <div className="order-row-info">
                    <div className="order-row-name">
                      {it.name === 'Товар не найден' ? `🔄 Товар #${it.id}` : it.name}
                    </div>
                    <div className="order-row-details">×{it.qty}</div>
                  </div>
                  <div className="row-sum">
                    {fmtCurrency(it.price * it.qty)}
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
