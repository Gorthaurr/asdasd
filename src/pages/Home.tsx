import Hero from '../sections/Hero';
import CategoriesGrid from '../sections/CategoriesGrid';
import PromoSection from '../sections/PromoSection';
import ProductsGridApi from '../sections/ProductsGridApi';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { ProductDisplaySection } from './sections/ProductDisplaySection';

export default function Home() {
  const selectedCategory = useSelector((s: RootState) => s.catalog.chip);

  // Если выбрана конкретная категория (не "Все"), показываем товары этой категории
  // Иначе показываем каталог категорий
  const showCategories = selectedCategory === 'Все' || !selectedCategory;

  return (
    <>
      {/* Header уже выводится в макете App, поэтому локальный HeaderSection убираем */}
      <ProductDisplaySection />
      <main className="container" style={{ paddingTop: 0, marginTop: 0 }}>
        {showCategories ? <PromoSection /> : <ProductsGridApi />}
      </main>
    </>
  );
}
