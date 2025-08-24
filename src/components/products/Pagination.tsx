// Пагинация: Prev / номера / Next
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPage } from '../../features/catalog/catalogSlice';
import { selectPaged } from '../../features/catalog/selectors';
import type { RootState } from '../../app/store';


export default function Pagination(){
    const dispatch = useDispatch(); // диспетчер
    const { totalPages, page, total } = useSelector((s:RootState)=>selectPaged(s)); // метаданные
    if (!total) return null; // если товаров нет — пагинация не нужна
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1); // массив страниц
    const goto = (p:number) => dispatch(setPage(Math.min(Math.max(1, p), totalPages))); // безопасный переход
    return (
        <div style={{ gridColumn: '1/-1', display: 'flex', gap: 8, justifyContent: 'center', margin: '16px 0 8px' }}>
            <button className="btn" onClick={()=>goto(page-1)} disabled={page<=1}>‹ Предыдущая</button>
            {pages.map(p => (
                <button key={p} className="btn" style={{ fontWeight: p===page? 800:500, borderColor: p===page? '#2e67c7':undefined }} onClick={()=>goto(p)}>{p}</button>
            ))}
            <button className="btn" onClick={()=>goto(page+1)} disabled={page>=totalPages}>Следующая ›</button>
        </div>
    );
}