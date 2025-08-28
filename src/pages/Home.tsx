// Главная страница: промо-блок + грид товаров с API
import React from 'react';
import Hero from '../sections/Hero'; // верхний блок с поиском/сортировкой/чипсами
import ProductsGridApi from '../sections/ProductsGridApi'; // грид и пагинация с API


export default function Home(){
    return (
        <main className="container" style={{ padding: '16px 0 0' }}>
            <Hero />
            <ProductsGridApi />
        </main>
    );
}