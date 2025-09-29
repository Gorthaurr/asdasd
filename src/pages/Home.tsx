import Hero from '../sections/Hero';
import CategoriesGrid from '../sections/CategoriesGrid';
import ProductsGridApi from '../sections/ProductsGridApi';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';

export default function Home() {
  const selectedCategory = useSelector((s: RootState) => s.catalog.chip);
  const favoriteOnly = useSelector((s: RootState) => s.catalog.favoriteOnly);

  // Если включено избранное, всегда показываем товары (не категории)
  // Если выбрана конкретная категория (не "Все"), показываем товары этой категории
  // Иначе показываем каталог категорий
  const showCategories = !favoriteOnly && (selectedCategory === 'Все' || !selectedCategory);

  return (
    <main className="container" style={{ padding: showCategories ? '0' : '16px 0 0' }}>
      {showCategories ? <CategoriesGrid /> : (
        <>
          <Hero />
          <ProductsGridApi />
        </>
      )}
    </main>
  );
}
