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
        <section className="grid" aria-live="polite">
            <div id="products" className="products">
                {paged.items.map(p => <ProductCard key={p.id} p={p} />)}
                {paged.items.length===0 && <div id="empty" className="empty">Ничего не найдено. Уточните запрос или снимите фильтры.</div>}
            </div>
            <Pagination />
        </section>
    );
}