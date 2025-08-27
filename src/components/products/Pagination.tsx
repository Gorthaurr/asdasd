// Пагинация: Prev / номера / Next
import React from 'react';
import { useSelector } from 'react-redux';
import { useCatalogUrlActions } from '../../routing/useCatalogUrlActions';
import { selectPaged } from '../../features/catalog/selectors';
import type { RootState } from '../../app/store';


export default function Pagination(){
    const { setPage } = useCatalogUrlActions(); // используем URL-действия
    const { totalPages, page, total } = useSelector((s:RootState)=>selectPaged(s)); // метаданные
    if (!total) return null; // если товаров нет — пагинация не нужна
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1); // массив страниц
    const goto = (p:number) => setPage(Math.min(Math.max(1, p), totalPages)); // безопасный переход
    return (
        <div className="animated-pagination" style={{ gridColumn: '1/-1', display: 'flex', gap: 8, justifyContent: 'center', margin: '16px 0 8px' }}>
            <button className="btn animated-pagination-btn" onClick={()=>goto(page-1)} disabled={page<=1}>
                <span>‹ Предыдущая</span>
                <div className="btn-ripple"></div>
            </button>
            {pages.map(p => (
                <button 
                    key={p} 
                    className={`btn animated-pagination-btn ${p===page ? 'active' : ''}`} 
                    onClick={()=>goto(p)}
                >
                    <span>{p}</span>
                    <div className="btn-ripple"></div>
                    <div className="btn-glow"></div>
                </button>
            ))}
            <button className="btn animated-pagination-btn" onClick={()=>goto(page+1)} disabled={page>=totalPages}>
                <span>Следующая ›</span>
                <div className="btn-ripple"></div>
            </button>
        </div>
    );
}