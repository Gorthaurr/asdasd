// Карточка товара: кликабельное превью/название → страница товара,
// «сердце» избранного (активное = синяя заливка), контроль количества (− qty +)

import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleFav } from "../../features/favs/favsSlice";
import { addToCart, changeQty } from "../../features/cart/cartSlice";
import { selectFavIds, selectCartItems } from "../../features/catalog/selectors";
import { fmtCurrency } from "../../utils/format";
import type { Product } from "../../types/product";

export default function ProductCard({ p }: { p: Product }) {
    const dispatch = useDispatch();
    const favIds = useSelector(selectFavIds);
    const cartItems = useSelector(selectCartItems);
    const isFav = favIds.includes(p.id);
    const qty = cartItems[p.id] ?? 0;

    const ratingStars = useMemo(() => {
        const full = Math.floor(p.rating);
        const half = p.rating - full >= 0.5;
        return (
            <span className="stars" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} width="16" height="16" viewBox="0 0 24 24">
                <path
                    d="M12 3.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.4L12 18.6 6.2 21.3l1.1-6.4L2.6 10.3l6.5-.9 2.9-5.9z"
                    fill={i < full ? "currentColor" : i === full && half ? "currentColor" : "none"}
                    opacity={i === full && half ? 0.5 : 1}
                    stroke="currentColor"
                    strokeWidth=".8"
                />
            </svg>
        ))}
      </span>
        );
    }, [p.rating]);

    return (
        <article className="card" data-id={p.id}>
            <div className="thumb">
                {/* Кнопка избранного — всегда сверху (см. overrides.css) */}
                <button
                    className={`fav${isFav ? " is-active" : ""}`}
                    aria-pressed={isFav}
                    title={isFav ? "Убрать из избранного" : "В избранное"}
                    aria-label="Избранное"
                    onClick={() => dispatch(toggleFav(p.id))}
                >
                    {/* Простое сердце; активная заливка задаётся в CSS */}
                    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.65-7 10-7 10Z"/>
                    </svg>
                </button>

                {/* Превью — ссылка на страницу товара */}
                <Link to={`/product/${p.id}`} aria-label={`Перейти к товару: ${p.name}`}>
                    <svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Изображение товара">
                        <defs>
                            <linearGradient id={`g${p.id}`} x1="0" x2="1">
                                <stop offset="0%" stopColor="#1c2340" />
                                <stop offset="100%" stopColor="#0f1428" />
                            </linearGradient>
                        </defs>
                        <rect width="600" height="400" fill={`url(#g${p.id})`} />
                        <g fill="#6ea8fe" opacity="0.9">
                            <rect x="140" y="80" width="320" height="240" rx="24" />
                            <rect x="170" y="110" width="260" height="180" rx="12" fill="#182039" />
                            <rect x="270" y="300" width="60" height="12" rx="6" fill="#7cf3d0" />
                        </g>
                    </svg>
                </Link>
            </div>

            <div className="content">
                {/* Название — тоже ссылка */}
                <div className="name">
                    <Link to={`/product/${p.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                        {p.name}
                    </Link>
                </div>

                <div className="meta">
                    <span className="cat">{p.category}</span> • {ratingStars}
                    <span className="rating" style={{ marginLeft: 6 }}>{p.rating.toFixed(1)}</span>
                </div>

                <div className="price" style={{ gap: 12 }}>
                    <strong className="cost">{fmtCurrency(p.price)}</strong>

                    {/* Контроль количества: − qty + */}
                    <div className="qty-inline" aria-label="Количество в корзине">
                        <button
                            className="qty-btn"
                            aria-label="Убрать одну штуку"
                            title="Убрать"
                            onClick={() => qty > 0 && dispatch(changeQty({ id: p.id, delta: -1 }))}
                            disabled={qty === 0}
                        >−</button>

                        <span className="qty-count" aria-live="polite">{qty}</span>

                        <button
                            className="qty-btn"
                            aria-label="Добавить одну штуку"
                            title="Добавить"
                            onClick={() => {
                                if (qty === 0) dispatch(addToCart(p.id));
                                else dispatch(changeQty({ id: p.id, delta: +1 }));
                            }}
                        >+</button>
                    </div>
                </div>
            </div>
        </article>
    );
}
