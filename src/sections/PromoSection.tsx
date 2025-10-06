import { useRef } from 'react';
import { useGetProductsQuery } from '../api/productsApi';
import ProductCard from '../components/products/ProductCard';
import { transformProduct } from '../utils/apiTransform';

export default function PromoSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, error } = useGetProductsQuery({
    page: 1,
    page_size: 12,
    include_images: true,
    include_attributes: true,
    sort: '-name' // сортировка по названию в обратном порядке для разнообразия
  });


  if (isLoading) {
    return (
      <section className="promo-section">
        <h2 className="section-title">Акции</h2>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Загружаем акции...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="promo-section">
        <h2 className="section-title">Акции</h2>
        <div className="error-state">
          <div className="error-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </div>
          <p>Ошибка загрузки акций</p>
          <small>{error.message || 'Попробуйте обновить страницу'}</small>
        </div>
      </section>
    );
  }

  if (!data?.items?.length) {
    return (
      <section className="promo-section">
        <h2 className="section-title">Акции</h2>
        <div className="empty-state">
          <p>Акций пока нет</p>
        </div>
      </section>
    );
  }

  const products = data.items.map(transformProduct);

  const scrollByStep = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const step = el.clientWidth * 0.9; // почти экран
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };



  return (
    <section className="promo-section" style={{ marginLeft: 0, marginRight: 0, marginTop: 0 }}>
      <h2 className="section-title">Акции</h2>
      <div className="promo-carousel" style={{ position: 'relative' }}>
        <button
          className="promo-arrow promo-arrow--left"
          aria-label="Назад"
          onClick={() => scrollByStep(-1)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div className="promo-scroll scrollbar-hide" ref={trackRef}>
          {products.map((product) => (
            <div key={product.id} className="promo-card-wrapper">
              <ProductCard p={product} />
            </div>
          ))}
        </div>
        <button
          className="promo-arrow promo-arrow--right"
          aria-label="Вперёд"
          onClick={() => scrollByStep(1)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </section>
  );
}
