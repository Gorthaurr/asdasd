import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { openDrawer } from "../../features/catalog/catalogSlice";
import { selectCartCount, selectFavIds } from "../../features/catalog/selectors";
import type { RootState } from "../../app/store";
import { useCatalogUrlActions } from "../../routing/useCatalogUrlActions";

export default function Header(){
    const dispatch = useDispatch();
    const cartCount = useSelector(selectCartCount);
    const favCount  = useSelector(selectFavIds).length;
    const { toggleFavorites } = useCatalogUrlActions();
    const favOnly = useSelector((s:RootState)=>s.catalog.favoriteOnly);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <header className={`animated-header ${isVisible ? 'visible' : ''}`}>
            <div className="container nav" role="navigation" aria-label="Основная навигация">
                <div className="brand animated-brand">
                    <Link to="/" aria-label="Перейти в каталог" className="brand-link">
                        <div className="logo animated-logo" aria-hidden="true">
                            <div className="logo-glow"></div>
                            <div className="logo-particles">
                                <div className="logo-particle particle-1"></div>
                                <div className="logo-particle particle-2"></div>
                                <div className="logo-particle particle-3"></div>
                            </div>
                        </div>
                    </Link>
                    <div className="title animated-title">
                        <span className="title-main">TechHome</span>
                        <small className="title-subtitle">Бытовая техника • магазин</small>
                    </div>
                </div>

                <div className="actions animated-actions">
                    <button
                        className={`icon-btn animated-icon-btn ${favOnly ? 'is-active' : ''}`}
                        aria-label="Переключить избранное"
                        aria-pressed={favOnly}
                        title={favOnly ? "Показать все" : "Только избранное"}
                        onClick={toggleFavorites}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="icon-svg">
                            <path 
                                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                stroke="currentColor" 
                                strokeWidth="1.5" 
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="heart-path"
                            />
                        </svg>
                        {favCount > 0 && (
                            <span className="badge animated-badge">
                                <span className="badge-text">{favCount}</span>
                                <div className="badge-glow"></div>
                            </span>
                        )}
                        <div className="btn-ripple"></div>
                    </button>

                    <button 
                        className="icon-btn animated-icon-btn" 
                        title="Корзина" 
                        aria-label="Открыть корзину" 
                        onClick={()=>dispatch(openDrawer())}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="icon-svg">
                            <path 
                                d="M3 3h2l.4 2M7 13h10l3-8H6.4M7 13l-1.6-8M7 13l-2 6h12m-8 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm8 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"
                                stroke="currentColor" 
                                strokeWidth="1.5" 
                                strokeLinecap="round"
                                className="cart-path"
                            />
                        </svg>
                        {cartCount > 0 && (
                            <span className="badge animated-badge cart-badge">
                                <span className="badge-text">{cartCount}</span>
                                <div className="badge-glow"></div>
                            </span>
                        )}
                        <div className="btn-ripple"></div>
                    </button>
                </div>
            </div>
        </header>
    );
}
