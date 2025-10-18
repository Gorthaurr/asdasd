import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, User, MapPin, CheckCircle } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../app/store';
import { clearCart } from '../features/cart/cartSlice';
import { useGetProductsQuery } from '../api/productsApi';
import type { Product } from '../types/product';
import type { ProductApi } from '../types/api';
import './CheckoutPage.css';
import { getJSON } from '../utils/storage'; // Правильный импорт

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface OrderForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  apartment: string;
  comment: string;
}

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((s: RootState) => s.cart.items);
  const [orderForm, setOrderForm] = useState<OrderForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    apartment: '',
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Получаем ID товаров из корзины
  const cartProductIds = Object.keys(cart || {});
  
  useEffect(() => {
    console.log('Checkout mounted, cart from Redux:', cart);
    console.log('Cart product IDs:', cartProductIds);
  }, [cart]);

  // Загружаем товары из localStorage если есть сохраненные данные
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  useEffect(() => {
    // Пробуем загрузить сохраненные данные товаров
    const savedProducts = getJSON('techhome_cart_products', {} as Record<string, any>);
    console.log('Saved cart products from storage:', savedProducts);
    
    const items: CartItem[] = cartProductIds.map(id => {
      const product = savedProducts[id];
      if (product) {
        return {
          id: id,
          name: product.name || 'Товар',
          price: product.price || 0,
          quantity: cart[id] || 1,
          image: product.image || ''
        };
      }
      return null;
    }).filter(Boolean) as CartItem[];
    
    console.log('Cart items loaded:', items);
    setCartItems(items);
  }, [cart]);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOrderForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Подготавливаем данные заказа согласно схеме бекенда
      const orderData = {
        customer: {
          name: `${orderForm.firstName} ${orderForm.lastName}`,
          email: orderForm.email,
          phone: orderForm.phone,
          address: `${orderForm.address}, ${orderForm.apartment}`,
          city: orderForm.city,
          postal_code: ""
        },
        items: cartItems.map(item => ({
          product_id: item.id,
          qty: item.quantity
        })),
        comment: orderForm.comment,
        shipping_cents: 0,
        currency: "RUB"
      };

      // Отправляем заказ на сервер
      const response = await fetch('https://api.technofame.store/api/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Ошибка при создании заказа');
      }

      const result = await response.json();
      console.log('Заказ создан:', result);

      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Очищаем корзину
      dispatch(clearCart());
      
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error);
      setIsSubmitting(false);
      alert('Произошла ошибка при оформлении заказа. Попробуйте еще раз.');
    }
  };

  if (showSuccess) {
    return (
      <div className="checkout-success">
        <div className="success-content">
          <CheckCircle className="success-icon" />
          <h1>Заказ успешно оформлен!</h1>
          <p>Спасибо за покупку в TechnoFame!</p>
          <p>Номер заказа: #TF-{Date.now().toString().slice(-6)}</p>
          <p>Мы свяжемся с вами в ближайшее время.</p>
          <div className="success-actions">
            <button onClick={() => navigate('/')} className="btn-primary">
              Вернуться в магазин
            </button>
          </div>
        </div>
      </div>
    );
  }

  // cart уже является объектом items {id: quantity}, не {items: {...}}
  const cartItemsCount = Object.keys(cart || {}).length;
  
  console.log('Cart items count:', cartItemsCount, 'cartItems array:', cartItems.length);

  if (cartItemsCount === 0) {
    return (
      <div className="checkout-empty">
        <div className="empty-content">
          <ShoppingCart className="empty-icon" />
          <h1>Корзина пуста</h1>
          <p>Добавьте товары в корзину, чтобы оформить заказ</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Перейти к покупкам
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>Оформление заказа</h1>
          <p>Заполните контактные данные для связи с вами</p>
        </div>

        <div className="checkout-content">
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit} className="checkout-form">
              {/* Контактная информация */}
              <div className="form-section">
                <h3 className="section-title">
                  <User className="section-icon" />
                  Контактная информация
                </h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">Имя *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={orderForm.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Фамилия *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={orderForm.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={orderForm.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Телефон *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={orderForm.phone}
                      onChange={handleInputChange}
                      placeholder="+7 (999) 123-45-67"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Адрес доставки */}
              <div className="form-section">
                <h3 className="section-title">
                  <MapPin className="section-icon" />
                  Адрес доставки
                </h3>
                <div className="form-group">
                  <label htmlFor="city">Город *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={orderForm.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address">Адрес *</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={orderForm.address}
                    onChange={handleInputChange}
                    placeholder="Улица, дом"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="apartment">Квартира/офис</label>
                  <input
                    type="text"
                    id="apartment"
                    name="apartment"
                    value={orderForm.apartment}
                    onChange={handleInputChange}
                    placeholder="Квартира, офис, этаж"
                  />
                </div>
              </div>

              {/* Комментарий */}
              <div className="form-section">
                <div className="form-group">
                  <label htmlFor="comment">Комментарий к заказу</label>
                  <textarea
                    id="comment"
                    name="comment"
                    value={orderForm.comment}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Дополнительная информация для курьера..."
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="btn-secondary"
                >
                  Вернуться к покупкам
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                >
                  {isSubmitting ? 'Оформляем заказ...' : `Оформить заказ за ${calculateTotal().toLocaleString()} ₽`}
                </button>
              </div>
            </form>
          </div>

          <div className="checkout-summary">
            <div className="summary-header">
              <h3>Ваш заказ</h3>
              <span>{cartItems.length} товар{cartItems.length > 1 ? 'а' : ''}</span>
            </div>

            <div className="summary-items">
              {cartItems.map((item) => (
                <div key={item.id} className="summary-item">
                  <img src={item.image} alt={item.name} className="item-image" />
                  <div className="item-details">
                    <h4 className="item-name">{item.name}</h4>
                    <span className="item-quantity">× {item.quantity}</span>
                  </div>
                  <span className="item-price">
                    {(item.price * item.quantity).toLocaleString()} ₽
                  </span>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="total-row total-final">
                <span>Итого</span>
                <span>{calculateTotal().toLocaleString()} ₽</span>
              </div>
              <div className="delivery-note">
                <p>📞 После оформления заказа с вами свяжется менеджер для уточнения деталей доставки и оплаты</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
