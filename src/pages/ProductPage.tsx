// Страница товара: слева фото, справа краткие характеристики.
// «Подробнее» скроллит к полным характеристикам, клик по рейтингу — к отзывам.
// Сердце — как в карточке (активная синяя заливка); контроль количества: − qty +.

import { useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import products from "../mocks/products.json";
import type { Product } from "../types/product";
import { fmtCurrency } from "../utils/format";
import { selectCartItems, selectFavIds } from "../features/catalog/selectors";
import { addToCart, changeQty } from "../features/cart/cartSlice";
import { toggleFav } from "../features/favs/favsSlice";

export default function ProductPage(){
    const { id } = useParams();
    const product = useMemo<Product | undefined>(() => {
        const pid = Number(id);
        return (products as Product[]).find(p => p.id === pid);
    }, [id]);

    const dispatch = useDispatch();
    const cart = useSelector(selectCartItems);
    const favIds = useSelector(selectFavIds);
    const isFav = product ? favIds.includes(product.id) : false;
    const qty = product ? (cart[product.id] ?? 0) : 0;

    const fullSpecsRef = useRef<HTMLDivElement>(null);
    const reviewsRef = useRef<HTMLDivElement>(null);

    const details = useMemo(() => {
        if (!product) return null;
        const mainSpecs = [
            { label: "Категория", value: product.category },
            { label: "Модель", value: product.name },
            { label: "Цена", value: fmtCurrency(product.price) },
            { label: "Рейтинг", value: product.rating.toFixed(1) },
        ];
        const fullSpecs = [
            { label: "Питание", value: "220–240 В" },
            { label: "Гарантия", value: "24 мес" },
            { label: "Страна", value: "ЕС" },
            { label: "Артикул", value: `TH-${product.id.toString().padStart(5, "0")}` },
            { label: "Материал корпуса", value: "ABS пластик/металл" },
            { label: "Комплектация", value: "Базовый набор" },
            { label: "Уровень шума", value: "до 60 dB" },
            { label: "Энергопотребление", value: "A+" },
        ];
        const description =
            "Современная техника для ежедневных задач. Модель сочетает надёжность, удобство и лаконичный дизайн. Подходит для повседневного использования, проста в обслуживании.";
        const reviews = [
            { user: "Алексей", rating: 5, text: "Качество отличное, пользуемся каждый день." },
            { user: "Мария", rating: 4, text: "Хорошая модель, доставка быстрая." },
            { user: "Иван", rating: 4, text: "Цена/качество на уровне, рекомендую." },
        ];
        return { mainSpecs, fullSpecs, description, reviews };
    }, [product]);

    if (!product || !details) {
        return (
            <main className="container" style={{ padding: "24px 0" }}>
                <h2>Товар не найден</h2>
                <p>Проверьте ссылку или вернитесь на главную страницу.</p>
            </main>
        );
    }

    const smoothScrollTo = (el: HTMLElement | null) => {
        if (!el) return;
        const y = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: "smooth" });
    };

    const ratingStars = useMemo(()=>{
        const full = Math.floor(product.rating);
        const half = product.rating - full >= 0.5;
        return (
            <span className="stars" aria-hidden="true" style={{ cursor: "pointer" }}>
        {Array.from({length:5}).map((_,i)=>(
            <svg key={i} width="18" height="18" viewBox="0 0 24 24">
                <path
                    d="M12 3.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.4L12 18.6 6.2 21.3l1.1-6.4L2.6 10.3l6.5-.9 2.9-5.9z"
                    fill={i<full ? "currentColor" : i===full && half ? "currentColor" : "none"}
                    opacity={i===full && half ? .5 : 1}
                    stroke="currentColor"
                    strokeWidth=".8"
                />
            </svg>
        ))}
      </span>
        );
    }, [product.rating]);

    return (
        <main className="container product-page" style={{ padding: "16px 0 40px" }}>
            <section className="product-page-grid">
                {/* Фото (плейсхолдер) */}
                <div className="product-gallery">
                    <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={`Изображение: ${product.name}`}>
                        <defs>
                            <linearGradient id={`pg${product.id}`} x1="0" x2="1">
                                <stop offset="0%" stopColor="#1c2340" />
                                <stop offset="100%" stopColor="#0f1428" />
                            </linearGradient>
                        </defs>
                        <rect width="800" height="600" fill={`url(#pg${product.id})`} />
                        <g fill="#6ea8fe" opacity="0.9">
                            <rect x="220" y="140" width="360" height="260" rx="24" />
                            <rect x="250" y="170" width="300" height="200" rx="12" fill="#182039" />
                            <rect x="370" y="460" width="60" height="14" rx="7" fill="#7cf3d0" />
                        </g>
                    </svg>
                </div>

                {/* Сводка и действия */}
                <div className="product-summary">
                    <h1 style={{ marginTop: 0 }}>{product.name}</h1>

                    {/* Рейтинг кликабелен → к отзывам */}
                    <div
                        role="button"
                        title="Перейти к отзывам"
                        onClick={() => smoothScrollTo(reviewsRef.current)}
                        style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer", color: "var(--muted)" }}
                    >
                        {ratingStars}
                        <strong>{product.rating.toFixed(1)}</strong>
                        <span>(отзывы)</span>
                    </div>

                    {/* Краткие характеристики */}
                    <ul className="specs-list">
                        {details.mainSpecs.map((s) => (
                            <li key={s.label}>
                                <span>{s.label}</span>
                                <span>{s.value}</span>
                            </li>
                        ))}
                    </ul>

                    {/* Действия: − qty +, Подробнее, Сердце */}
                    <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 10 }}>
                        <strong className="cost" style={{ fontSize: "1.15rem" }}>{fmtCurrency(product.price)}</strong>

                        <div className="qty-inline" aria-label="Количество в корзине">
                            <button
                                className="qty-btn"
                                aria-label="Убрать одну штуку"
                                onClick={() => qty > 0 && dispatch(changeQty({ id: product.id, delta: -1 }))}
                                disabled={qty===0}
                            >−</button>
                            <span className="qty-count" aria-live="polite">{qty}</span>
                            <button
                                className="qty-btn"
                                aria-label="Добавить одну штуку"
                                onClick={() => {
                                    if (qty === 0) dispatch(addToCart(product.id));
                                    else dispatch(changeQty({ id: product.id, delta: +1 }));
                                }}
                            >+</button>
                        </div>

                        <button className="btn" onClick={() => smoothScrollTo(fullSpecsRef.current)} title="К полным характеристикам">
                            Подробнее
                        </button>

                        {/* Сердце-избранное: активная синяя заливка как в карточке */}
                        <button
                            className={`fav${isFav ? " is-active" : ""}`}
                            aria-label="Добавить в избранное"
                            title="Добавить/убрать из избранного"
                            onClick={() => dispatch(toggleFav(product.id))}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.65-7 10-7 10Z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </section>

            {/* Полные характеристики */}
            <section ref={fullSpecsRef} id="full-specs" className="panel" style={{ marginTop: 16 }}>
                <h2 style={{ marginTop: 0 }}>Характеристики</h2>
                <dl className="full-specs">
                    {details.fullSpecs.map(s => (
                        <div key={s.label} className="fs-row">
                            <dt>{s.label}</dt>
                            <dd>{s.value}</dd>
                        </div>
                    ))}
                </dl>

                <h3>Описание</h3>
                <p style={{ color: "var(--muted)" }}>{details.description}</p>
            </section>

            {/* Отзывы */}
            <section ref={reviewsRef} id="reviews" className="panel" style={{ marginTop: 16 }}>
                <h2 style={{ marginTop: 0 }}>Отзывы покупателей</h2>
                <div className="reviews">
                    {details.reviews.map((r, i) => (
                        <article key={i} className="review">
                            <header>
                                <strong>{r.user}</strong>
                                <span className="stars" aria-hidden="true" title={`${r.rating} из 5`} style={{ marginLeft: 8 }}>
                  {Array.from({length:5}).map((_,j)=>(
                      <svg key={j} width="14" height="14" viewBox="0 0 24 24">
                          <path
                              d="M12 3.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.4L12 18.6 6.2 21.3l1.1-6.4L2.6 10.3l6.5-.9 2.9-5.9z"
                              fill={j < r.rating ? "currentColor" : "none"}
                              stroke="currentColor"
                              strokeWidth=".8"
                          />
                      </svg>
                  ))}
                </span>
                            </header>
                            <p>{r.text}</p>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}
