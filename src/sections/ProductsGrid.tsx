// Грид товаров + пагинация
import React from 'react';
import { useSelector } from 'react-redux';
import { selectPaged } from '../features/catalog/selectors';
import ProductCard from '../components/products/ProductCard';
import Pagination from '../components/products/Pagination';
import type { RootState } from '../app/store';


export default function ProductsGrid(){
    const paged = useSelector((s:RootState)=>selectPaged(s)); // берём порцию товаров и метаданные
    return (
        <section className="grid animated-grid" aria-live="polite">
            <div id="products" className="products">
                {paged.items.map(p => <ProductCard key={p.id} p={p} />)}
                {paged.items.length===0 && (
                    <div id="empty" className="empty animated-empty-state">
                        <div className="empty-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                <path d="M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" strokeWidth="1.5"/>
                            </svg>
                        </div>
                        <p>Ничего не найдено</p>
                        <small>Уточните запрос или снимите фильтры</small>
                    </div>
                )}
            </div>
            <Pagination />
        </section>
    );
}