import React from "react";
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

    return (
        <header>
            <div className="container nav" role="navigation" aria-label="Основная навигация">
                <div className="brand">
                    <Link to="/" aria-label="Перейти в каталог">
                        <div className="logo" aria-hidden="true"></div>
                    </Link>
                    <div className="title">TechHome<small>Бытовая техника • магазин</small></div>
                </div>

                <div className="actions">
                    <button
                        className="icon-btn"
                        aria-label="Переключить избранное"
                        aria-pressed={favOnly}
                        title={favOnly ? "Показать все" : "Только избранное"}
                        onClick={toggleFavorites}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.65-7 10-7 10Z"
                                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <span className="badge" aria-live="polite">{favCount}</span>
                    </button>

                    <button className="icon-btn" title="Корзина" aria-label="Открыть корзину" onClick={()=>dispatch(openDrawer())}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M3 3h2l.4 2M7 13h10l3-8H6.4M7 13l-1.6-8M7 13l-2 6h12m-8 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm8 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"
                                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <span className="badge" aria-live="polite">{cartCount}</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
