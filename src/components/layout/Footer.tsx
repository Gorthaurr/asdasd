// Минималистичный, симметричный футер без картинок/соцсетей.
// Секции: бренд (текстом), "Покупателям", "Поддержка" + нижняя строка копирайта.

import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="site-footer">{/* оболочка футера */}
            <div className="container footer-simple">{/* сетка футера */}
                {/* Бренд — только текст, без изображений */}
                <section className="fs-brand">
                    <h3 className="fs-title">TechHome</h3>{/* имя бренда */}
                    <p className="fs-caption">Бытовая техника для дома — просто и удобно</p>{/* краткий слоган */}
                </section>

                {/* Колонка "Покупателям" */}
                <nav className="fs-col" aria-label="Покупателям">
                    <h4>Покупателям</h4>
                    <ul>
                        <li><Link to="/">Каталог</Link></li>
                        <li><a href="#">Доставка и оплата</a></li>
                        <li><a href="#">Возврат</a></li>
                        <li><Link to="/checkout">Оформление заказа</Link></li>
                    </ul>
                </nav>

                {/* Колонка "Поддержка" */}
                <nav className="fs-col" aria-label="Поддержка">
                    <h4>Поддержка</h4>
                    <ul>
                        <li><a href="#">FAQ</a></li>
                        <li><a href="#">Гарантия</a></li>
                        <li><a href="#">Конфиденциальность</a></li>
                    </ul>
                </nav>
            </div>

            {/* Нижняя строка — всегда по центру/ровно распределена */}
            <div className="container fs-bottom">
                <span>© {year} TechHome</span>{/* копирайт */}
                <span className="fs-legal">
          <a href="#">Условия использования</a> · <a href="#">Политика конфиденциальности</a>
        </span>
            </div>
        </footer>
    );
}
