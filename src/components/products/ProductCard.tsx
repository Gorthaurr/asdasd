// Карточка товара: кликабельное превью/название → страница товара,
// «сердце» избранного (активное = синяя заливка), контроль количества (− qty +)

import { useMemo, useState, useEffect } from "react";
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
    const [isHovered, setIsHovered] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

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

    const handleAddToCart = () => {
        if (qty === 0) {
            dispatch(addToCart(p.id));
        } else {
            dispatch(changeQty({ id: p.id, delta: +1 }));
        }
    };

    return (
        <article 
            className={`card animated-card ${isVisible ? 'visible' : ''} ${isHovered ? 'hovered' : ''}`} 
            data-id={p.id}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="thumb">
                {/* Кнопка избранного — всегда сверху (см. overrides.css) */}
                <button
                    className={`fav animated-fav${isFav ? " is-active" : ""}`}
                    aria-pressed={isFav}
                    title={isFav ? "Убрать из избранного" : "В избранное"}
                    aria-label="Избранное"
                    onClick={() => dispatch(toggleFav(p.id))}
                >
                    {/* Анимированное сердце */}
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                        <path 
                            className="heart-path"
                            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <div className="fav-ripple"></div>
                </button>

                {/* Превью — ссылка на страницу товара */}
                <Link to={`/product/${p.id}`} aria-label={`Перейти к товару: ${p.name}`} className="product-link">
                    <div className="image-container">
                        {/* Бейдж скидки */}
                        {p.oldPrice && (
                            <div className="discount-badge">
                                <span>-{Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)}%</span>
                            </div>
                        )}
                        
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
                        <div className="image-overlay">
                            <span className="view-details">Подробнее</span>
                        </div>
                    </div>
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
                    <div className="price-info">
                        <strong className="cost">{fmtCurrency(p.price)}</strong>
                        {p.oldPrice && (
                            <span className="old-price">{fmtCurrency(p.oldPrice)}</span>
                        )}
                    </div>

                    {/* Контроль количества: − qty + */}
                    <div className="qty-inline" aria-label="Количество в корзине">
                        <button
                            className="qty-btn animated-qty-btn"
                            aria-label="Убрать одну штуку"
                            title="Убрать"
                            onClick={() => qty > 0 && dispatch(changeQty({ id: p.id, delta: -1 }))}
                            disabled={qty === 0}
                        >−</button>

                        <span className="qty-count" aria-live="polite">{qty}</span>

                        <button
                            className="qty-btn animated-qty-btn"
                            aria-label="Добавить одну штуку"
                            title="Добавить"
                            onClick={handleAddToCart}
                        >+</button>
                    </div>
                </div>
            </div>
            
            {/* Анимированные эффекты */}
            <div className="card-glow"></div>
            <div className="card-particles">
                <div className="particle particle-1"></div>
                <div className="particle particle-2"></div>
                <div className="particle particle-3"></div>
            </div>
        </article>
    );
}
