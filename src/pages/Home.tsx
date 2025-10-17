import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../app/store';
import { useGetProductsQuery, useGetCategoriesQuery } from '../api/productsApi';
import { setChip, setPage, applyFilters } from '../features/catalog/catalogSlice';
import { addToCart } from '../features/cart/cartSlice';
import { toggleFav } from '../features/favs/favsSlice';
import ProductGrid from '../components/user/ProductGrid';
import CategoryIcon from '../components/user/CategoryIcon';
import Pagination from '../components/user/Pagination';
import FiltersPanel from '../components/user/FiltersPanel';
import type { Product, FilterState } from '../types/product';
import type { ProductApi } from '../types/api';

export default function Home() {
  const dispatch = useDispatch();
  const catalogState = useSelector((s: RootState) => s.catalog);
  const favorites = useSelector((s: RootState) => s.favs.ids);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filtersPanelOpen, setFiltersPanelOpen] = useState(false);

  // Получаем категории
  const { data: categoriesData } = useGetCategoriesQuery();
  
  // Получаем товары
  const { data: productsData, isLoading } = useGetProductsQuery({
    page: catalogState.page,
    page_size: catalogState.pageSize,
    category_slug: catalogState.chip !== 'Все' ? catalogState.chip : undefined,
    q: catalogState.q || undefined,
  });

  // Transform API products to UI products
  const transformProduct = (apiProduct: ProductApi): Product => ({
    id: apiProduct.id,
    name: apiProduct.name,
    category: String(apiProduct.category_id),
    price: (apiProduct.price_cents || 0) / 100,
    rating: 4.5, // Mock
    images: apiProduct.images,
    brand: apiProduct.name.split(' ')[0], // Mock: first word as brand
    reviews: 127, // Mock
    inStock: true, // Mock
    description: apiProduct.description,
  });

  const products: Product[] = useMemo(() => {
    if (!productsData?.items) return [];
    return productsData.items.map(transformProduct);
  }, [productsData]);

  // Categories list for sidebar
  const categories = useMemo(() => {
    const cats = [{ id: 'Все', slug: 'Все', name: 'Все категории', count: productsData?.meta.total || 0 }];
    if (categoriesData) {
      cats.push(...categoriesData.map(cat => ({
        id: cat.slug,
        slug: cat.slug,
        name: cat.slug,
        count: 0
      })));
    }
    return cats;
  }, [categoriesData, productsData]);

  // Available brands
  const availableBrands = useMemo(() => {
    return Array.from(new Set(products.map(p => p.brand || 'Unknown'))).filter(b => b !== 'Unknown');
  }, [products]);

  // Price range
  const priceRange = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 1000000 };
    const prices = products.map(p => p.price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices))
    };
  }, [products]);

  // Current filters
  const filters: FilterState = {
    category: catalogState.chip,
    priceRange: catalogState.priceRange,
    brands: catalogState.brands,
    inStock: catalogState.inStock,
    sortBy: catalogState.sort as any,
    sortDirection: catalogState.sortDirection,
  };

  // Handlers
  const handleCategoryChange = (categorySlug: string) => {
    dispatch(setChip(categorySlug));
    setSidebarOpen(false);
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    dispatch(applyFilters(newFilters));
  };

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product.id));
  };

  const handleAddToWishlist = (productId: string) => {
    dispatch(toggleFav(productId));
  };

  const isInWishlist = (productId: string): boolean => {
    return favorites.includes(productId);
  };

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-content">
          <div className="sidebar-header">
            <div className="sidebar-title">
              <span className="sidebar-icon">📂</span>
              <h2>Категории товаров</h2>
            </div>
            <button className="close-button" onClick={() => setSidebarOpen(false)}>
              ✕
            </button>
          </div>
          
          <div className="categories-section">
            <p className="categories-description">Выберите категорию для просмотра товаров</p>
            <div className="categories-grid">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`category-card ${filters.category === category.id ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(category.slug)}
                >
                  <CategoryIcon category={category.slug} size="md" />
                  <span className="category-name">{category.name}</span>
                  {category.count > 0 && <span className="category-count">{category.count}</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              {filters.category === 'Все' 
                ? 'TechnoFame - Лучшая бытовая техника' 
                : categories.find(cat => cat.id === filters.category)?.name || 'Категория'
              }
            </h1>
            <p className="hero-subtitle">
              {productsData?.meta.total || 0} товаров по выгодным ценам
            </p>
          </div>
        </section>

        {/* Filters and Sort Bar */}
        <section className="filters-sort-bar">
          <div className="filters-sort-content">
            <div className="filters-section">
              <button 
                className="filters-toggle-btn"
                onClick={() => setFiltersPanelOpen(true)}
              >
                <span className="filter-icon">⚙️</span>
                <span>Фильтры</span>
              </button>
            </div>
            
            <div className="sort-section">
              <span className="sort-label">Сортировка:</span>
              <select 
                value={filters.sortBy}
                onChange={(e) => handleFiltersChange({...filters, sortBy: e.target.value as any})}
                className="sort-select"
              >
                <option value="newest">Сначала новые</option>
                <option value="price">По цене</option>
                <option value="name">По названию</option>
                <option value="rating">По рейтингу</option>
              </select>
              <button 
                className="sort-direction-btn"
                onClick={() => handleFiltersChange({
                  ...filters, 
                  sortDirection: filters.sortDirection === 'asc' ? 'desc' : 'asc'
                })}
                title={filters.sortDirection === 'asc' ? 'По возрастанию' : 'По убыванию'}
              >
                {filters.sortDirection === 'asc' ? '↑' : '↓'}
              </button>
            </div>
            
            <div className="results-info">
              <span className="results-count">
                {productsData?.meta.total || 0} товаров
              </span>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="products-section">
          <ProductGrid
            products={products}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            isInWishlist={isInWishlist}
            loading={isLoading}
          />
          
          {/* Pagination */}
          {productsData && (
            <Pagination
              currentPage={catalogState.page}
              totalPages={productsData.meta.total_pages}
              onPageChange={handlePageChange}
              totalItems={productsData.meta.total}
              itemsPerPage={catalogState.pageSize}
            />
          )}
        </section>
      </main>

      {/* Filters Panel */}
      <FiltersPanel
        filters={filters}
        onFiltersChange={handleFiltersChange}
        availableBrands={availableBrands}
        minPrice={priceRange.min}
        maxPrice={priceRange.max}
        isOpen={filtersPanelOpen}
        onClose={() => setFiltersPanelOpen(false)}
      />

      <style>{`
        .app-layout {
          display: grid;
          grid-template-columns: 1fr;
          min-height: calc(100vh - 80px);
          position: relative;
        }

        /* Sidebar */
        .sidebar {
          position: fixed;
          top: 80px;
          left: -100%;
          width: 100%;
          height: calc(100vh - 80px);
          background: var(--surface-primary);
          z-index: 1000;
          transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: var(--shadow-xl);
        }

        .sidebar-open {
          left: 0;
        }

        .sidebar-content {
          padding: var(--space-6);
          height: 100%;
          overflow-y: auto;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-8);
          padding-bottom: var(--space-4);
          border-bottom: 1px solid var(--border-light);
        }

        .sidebar-title {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .sidebar-icon {
          font-size: var(--text-2xl);
        }

        .sidebar-header h2 {
          font-size: var(--text-2xl);
          font-weight: var(--font-bold);
          color: var(--text-primary);
          margin: 0;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 24px;
          color: var(--text-tertiary);
          cursor: pointer;
          padding: var(--space-2);
          border-radius: var(--radius-md);
          transition: all 0.2s ease;
        }

        .close-button:hover {
          background: var(--surface-tertiary);
          color: var(--text-primary);
        }

        .categories-description {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          margin-bottom: var(--space-4);
          text-align: center;
        }

        .categories-grid {
          display: grid;
          gap: var(--space-3);
        }

        .category-card {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-4);
          background: var(--surface-secondary);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          width: 100%;
        }

        .category-card:hover {
          background: var(--surface-tertiary);
          border-color: var(--primary);
          transform: translateY(-1px);
        }

        .category-card.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }

        .category-name {
          flex: 1;
          font-weight: var(--font-medium);
        }

        .category-count {
          font-size: var(--text-sm);
          opacity: 0.7;
        }

        /* Main Content */
        .main-content {
          padding: 0;
          background: var(--surface-secondary);
        }

        /* Hero Section */
        .hero-section {
          background: var(--gradient-primary);
          color: var(--text-inverse);
          padding: 40px 20px;
          text-align: center;
        }

        .hero-title {
          font-size: var(--text-5xl);
          font-weight: var(--font-extrabold);
          margin-bottom: var(--space-4);
        }

        .hero-subtitle {
          font-size: var(--text-xl);
          opacity: 0.9;
          margin: 0;
        }

        /* Filters and Sort Bar */
        .filters-sort-bar {
          background: var(--surface-primary);
          border-bottom: 1px solid var(--border-light);
          padding: 20px;
          position: sticky;
          top: 80px;
          z-index: 100;
        }

        .filters-sort-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-6);
          max-width: 1400px;
          margin: 0 auto;
        }

        .filters-toggle-btn {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3) var(--space-4);
          background: var(--surface-secondary);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: var(--font-medium);
        }

        .filters-toggle-btn:hover {
          border-color: var(--primary);
          transform: translateY(-1px);
        }

        .sort-section {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .sort-select {
          padding: var(--space-3) var(--space-4);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          background: var(--surface-primary);
          cursor: pointer;
        }

        .sort-direction-btn {
          width: 40px;
          height: 40px;
          background: var(--surface-secondary);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sort-direction-btn:hover {
          border-color: var(--primary);
        }

        .results-count {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          background: var(--surface-secondary);
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-md);
        }

        /* Products Section */
        .products-section {
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
        }

        @media (min-width: 768px) {
          .app-layout {
            grid-template-columns: 300px 1fr;
          }
          
          .sidebar {
            position: relative;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            box-shadow: none;
            border-right: 1px solid var(--border-light);
          }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: var(--text-4xl);
          }

          .filters-sort-content {
            flex-wrap: wrap;
          }

          .results-info {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
