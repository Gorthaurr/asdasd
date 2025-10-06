import { useRef } from 'react';
import { useGetProductsQuery } from '../api/productsApi';
import ProductCard from '../components/products/ProductCard';
import { transformProduct } from '../utils/apiTransform';

export default function PromoSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { data, isLoading } = useGetProductsQuery({
    page: 1,
    page_size: 12,
    include_images: true,
    include_attributes: true
  });

  if (isLoading || !data?.items?.length) return null;

  const products = data.items.map(transformProduct);

  const scrollByStep = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const step = el.clientWidth * 0.9; // почти экран
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };



  return (
    <section className="promo-section">
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
