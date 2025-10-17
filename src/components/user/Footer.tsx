import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">TechnoFame</h3>
            <p className="footer-description">
              Ваш надежный партнер в мире бытовой техники. 
              Качественная техника от ведущих производителей по доступным ценам.
            </p>
            <div className="footer-contact">
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span>+7 (800) 555-35-35</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <span>info@technofame.ru</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <span>Москва, ул. Техническая, 123</span>
              </div>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Каталог</h4>
            <ul className="footer-links">
              <li><a href="/category/холодильники">Холодильники</a></li>
              <li><a href="/category/стиральные-машины">Стиральные машины</a></li>
              <li><a href="/category/варочные-панели">Варочные панели</a></li>
              <li><a href="/category/духовые-шкафы">Духовые шкафы</a></li>
              <li><a href="/category/посудомоечные-машины">Посудомоечные машины</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Покупателям</h4>
            <ul className="footer-links">
              <li><a href="/delivery">Доставка и оплата</a></li>
              <li><a href="/warranty">Гарантия</a></li>
              <li><a href="/returns">Возврат товара</a></li>
              <li><a href="/assembly">Сборка и установка</a></li>
              <li><a href="/credit">Кредит и рассрочка</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">О компании</h4>
            <ul className="footer-links">
              <li><a href="/about">О нас</a></li>
              <li><a href="/contacts">Контакты</a></li>
              <li><a href="/careers">Вакансии</a></li>
              <li><a href="/news">Новости</a></li>
              <li><a href="/partners">Партнерам</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Мы в соцсетях</h4>
            <div className="social-links">
              <a href="https://vk.com/technofame" className="social-link" target="_blank" rel="noopener noreferrer">
                <span>VKontakte</span>
              </a>
              <a href="https://telegram.me/technofame" className="social-link" target="_blank" rel="noopener noreferrer">
                <span>Telegram</span>
              </a>
              <a href="https://instagram.com/technofame" className="social-link" target="_blank" rel="noopener noreferrer">
                <span>Instagram</span>
              </a>
              <a href="https://youtube.com/technofame" className="social-link" target="_blank" rel="noopener noreferrer">
                <span>YouTube</span>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="footer-copyright">
              <p>&copy; 2024 TechnoFame. Все права защищены.</p>
            </div>
            <div className="footer-legal">
              <a href="/privacy">Политика конфиденциальности</a>
              <a href="/terms">Пользовательское соглашение</a>
              <a href="/cookies">Политика cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

