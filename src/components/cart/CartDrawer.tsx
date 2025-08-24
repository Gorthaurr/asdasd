// Выдвижная корзина: меняем кнопку на Link к /checkout и закрываем дровер

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";                  // ← добавили Link
import { closeDrawer } from "../../features/catalog/catalogSlice";
import { changeQty } from "../../features/cart/cartSlice";
import { selectCartDetailed } from "../../features/catalog/selectors";
import { fmtCurrency } from "../../utils/format";
import type { RootState } from "../../app/store";

export default function CartDrawer(){
    const dispatch = useDispatch();
    const open = useSelector((s:RootState)=>s.catalog.drawerOpen);
    const { rows, sum } = useSelector(selectCartDetailed);

    useEffect(()=>{
        const onKey = (e:KeyboardEvent)=>{ if (e.key==='Escape' && open) dispatch(closeDrawer()); };
        window.addEventListener('keydown', onKey);
        return ()=> window.removeEventListener('keydown', onKey);
    }, [open]);

    return (
        <>
            <div id="overlay" className={'overlay' + (open? ' open':'')} aria-hidden={!open} onClick={()=>dispatch(closeDrawer())} />
            <aside id="drawer" className={'drawer' + (open? ' open':'')} aria-label="Корзина" aria-hidden={!open} role="dialog" aria-modal="true">
                <header className="container" style={{ padding: '14px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'space-between' }}>
                        <h3 style={{ margin: 0 }}>Корзина</h3>
                        <button className="icon-btn" aria-label="Закрыть корзину" onClick={()=>dispatch(closeDrawer())}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                        </button>
                    </div>
                </header>

                <div className="body" id="cartList">
                    {rows.length===0 ? (
                        <div className="empty">Корзина пуста</div>
                    ) : (
                        rows.map(it => (
                            <div className="cart-item" key={it.id} data-id={it.id}>
                                <div className="cart-thumb"></div>
                                <div>
                                    <div style={{ fontWeight: 700 }}>{it.name}</div>
                                    <div style={{ color: 'var(--muted)', fontSize: '.92rem' }}>{it.category}</div>
                                    <div style={{ marginTop: 6 }}>{fmtCurrency(it.price)}</div>
                                </div>
                                <div className="qty">
                                    <button aria-label="Уменьшить" onClick={()=>dispatch(changeQty({ id: it.id, delta: -1 }))}>−</button>
                                    <span>{it.qty}</span>
                                    <button aria-label="Увеличить" onClick={()=>dispatch(changeQty({ id: it.id, delta: +1 }))}>+</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="footer">
                    <div className="summary"><span>Товары</span><strong id="sumItems">{fmtCurrency(sum)}</strong></div>
                    <div className="summary"><span>Доставка</span><strong id="sumShip">{rows.length? 'Бесплатно':'—'}</strong></div>
                    <div className="summary" style={{ fontWeight: 800 }}><span>Итого</span><strong id="sumTotal">{fmtCurrency(sum)}</strong></div>
                    {/* ✅ Переход к оформлению: закрываем дровер и уходим на /checkout */}
                    <Link className="checkout" id="checkoutBtn" to="/checkout" onClick={()=>dispatch(closeDrawer())}>
                        Оформить заказ
                    </Link>
                </div>
            </aside>
        </>
    );
}
