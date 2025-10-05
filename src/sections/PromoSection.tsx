import { useGetProductsQuery } from '../api/productsApi';
import ProductCard from '../components/products/ProductCard';
import { transformProduct } from '../utils/apiTransform';

export default function PromoSection() {
  const { data, isLoading } = useGetProductsQuery({
    page: 1,
    page_size: 10,
    include_images: true,
    include_attributes: true
  });

  if (isLoading || !data?.items?.length) return null;

  const products = data.items.map(transformProduct).slice(0, 6);

  return (
    <section className="promo-section">
      <h2 className="section-title">Акции</h2>
      <div className="promo-scroll">
        {products.map((product) => (
          <div key={product.id} className="promo-card-wrapper">
            <ProductCard p={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
