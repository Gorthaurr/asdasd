// Промо-блок: второй поиск, селект сортировки, чипсы категорий
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setQ, setSort } from '../features/catalog/catalogSlice';
import Chips from '../components/controls/Chips';
import type { RootState } from '../app/store';


// Локальный селект сортировки
function SortSelect({ value, onChange }: { value: string; onChange: (v:string)=>void }){
    return (
        <select className="select" aria-label="Сортировка" value={value} onChange={(e)=>onChange(e.target.value)}>
            <option value="popular">Сначала популярные</option>
            <option value="priceAsc">Цена: по возрастанию</option>
            <option value="priceDesc">Цена: по убыванию</option>
            <option value="new">Новинки</option>
        </select>
    );
}


export default function Hero(){
    const dispatch = useDispatch(); // доступ к диспетчеру
    const q = useSelector((s:RootState)=>s.catalog.q); // строка поиска из стора
    const sort = useSelector((s:RootState)=>s.catalog.sort); // текущая сортировка
    return (
        <section className="hero" aria-label="Промо">
            <div className="hero-card">
                <h1>Техника, которая упрощает жизнь</h1>
                <p>Выбирайте из сотен товаров: от кухонных помощников до климат‑систем. Умные фильтры, быстрый поиск, корзина и избранное — всё в одном месте.</p>
                <div className="search-row">
                    <div className="search" role="search">
                        {/* Иконка лупы (декоративная) */}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                        {/* Второе поле поиска (синхронизировано) */}
                        <input value={q} onChange={(e)=>dispatch(setQ(e.target.value))} type="search" placeholder="Например: пылесос, кофемашина…" autoComplete="off" aria-label="Поиск по товарам" />
                    </div>
                    {/* Селект сортировки */}
                    <SortSelect value={sort} onChange={(v)=>dispatch(setSort(v))} />
                </div>
                {/* Чипсы категорий */}
                <Chips />
            </div>
            {/* Блок доверия/статистики */}
            <div className="stat" aria-label="Качество сервиса">
                <div className="row"><strong>4.9/5</strong> по оценкам покупателей</div>
                <div className="spark" aria-hidden="true"></div>
                <div className="row"><strong>24/7</strong> поддержка • <strong>365</strong> дней возврата</div>
            </div>
        </section>
    );
}