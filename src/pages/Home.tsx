import CategoriesGrid from '../sections/CategoriesGrid';
import SEOHead from '../components/common/SEOHead';

export default function Home() {
  return (
    <>
      <SEOHead 
        title="TechnoFame - Премиальная бытовая техника"
        description="Премиальная бытовая техника от ведущих мировых производителей. Широкий ассортимент, гарантия качества, быстрая доставка."
        keywords="бытовая техника, холодильники, стиральные машины, телевизоры, ноутбуки, смартфоны, кухонная техника"
        ogTitle="TechnoFame - Премиальная бытовая техника"
        ogDescription="Бытовая, цифровая, садовая и аудио техника широкого сегмента от ведущих мировых производителей"
        ogUrl="https://technofame.store"
        canonical="https://technofame.store"
      />
      <main className="container" style={{ padding: '0' }}>
        <CategoriesGrid />
      </main>
    </>
  );
}
