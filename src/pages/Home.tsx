// Главная страница: промо-блок + грид товаров
import React from 'react';
import Hero from '../sections/Hero'; // верхний блок с поиском/сортировкой/чипсами
import ProductsGrid from '../sections/ProductsGrid'; // грид и пагинация


export default function Home(){
    return (
        <main className="container" style={{ padding: '16px 0 0' }}>
            <Hero />
            <ProductsGrid />
        </main>
    );
}