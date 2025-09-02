import Hero from '../sections/Hero';
import ProductsGridApi from '../sections/ProductsGridApi';

export default function Home() {
  return (
    <main className="container" style={{ padding: '16px 0 0' }}>
      <Hero />
      <ProductsGridApi />
    </main>
  );
}
