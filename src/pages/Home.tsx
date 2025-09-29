import Hero from '../sections/Hero';
import CategoriesGrid from '../sections/CategoriesGrid';
import ProductsGridApi from '../sections/ProductsGridApi';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';

export default function Home() {
  const selectedCategory = useSelector((s: RootState) => s.catalog.chip);

  // Если выбрана конкретная категория (не "Все"), показываем товары этой категории
  // Иначе показываем каталог категорий
  const showCategories = selectedCategory === 'Все' || !selectedCategory;

  return (
    <main className="container" style={{ padding: '16px 0 0' }}>
      <Hero />
      {showCategories ? <CategoriesGrid /> : <ProductsGridApi />}
    </main>
  );
}
