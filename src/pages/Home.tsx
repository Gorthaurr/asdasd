import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../app/store';
import { useGetProductsQuery, useGetCategoriesQuery } from '../api/productsApi';
import { applyFilters, setPageSize } from '../features/catalog/catalogSlice';
import { useCatalogUrlActions } from '../routing/useCatalogUrlActions';
import { addToCart } from '../features/cart/cartSlice';
import { toggleFav } from '../features/favs/favsSlice';
import ProductGrid from '../components/user/ProductGrid';
import CategoryIcon from '../components/user/CategoryIcon';
import Pagination from '../components/user/Pagination';
import FiltersPanel from '../components/user/FiltersPanel';
import type { Product, FilterState } from '../types/product';
import { transformProduct } from '../utils/productTransform';

export default function Home() {
  const dispatch = useDispatch();
  const { setChip: setChipUrl, setPage: setPageUrl, setSort: setSortUrl } = useCatalogUrlActions();
  const catalogState = useSelector((s: RootState) => s.catalog);
  const favorites = useSelector((s: RootState) => s.favs.ids);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filtersPanelOpen, setFiltersPanelOpen] = useState(false);

  React.useEffect(() => {
    const handleToggleSidebar = () => {
      setSidebarOpen(prev => !prev);
    };
    window.addEventListener('toggleSidebar', handleToggleSidebar);
    return () => window.removeEventListener('toggleSidebar', handleToggleSidebar);
  }, []);

  // Получаем категории
  const { data: categoriesData } = useGetCategoriesQuery();
  
  // Вычисляем ID выбранной категории по slug
  const selectedCategoryId = React.useMemo(() => {
    if (!categoriesData) return undefined;
    const found = categoriesData.find(cat => cat.slug === catalogState.chip);
    return found?.id;
  }, [categoriesData, catalogState.chip]);
  
  // Получаем товары с поиском, фильтром категории и пагинацией
  const { data: productsData, isLoading, refetch } = useGetProductsQuery({
    page: catalogState.page,
    page_size: catalogState.pageSize,
    category_slug: catalogState.chip !== 'Все' ? catalogState.chip : undefined,
    category_id: catalogState.chip !== 'Все' ? selectedCategoryId : undefined,
    q: catalogState.q || undefined,
    include_images: true,
    include_attributes: true,
  }, {
    refetchOnMountOrArgChange: true,
  });

  // Transform API products to UI products
  const products: Product[] = useMemo(() => {
    if (!productsData?.items) return [];
    const transformed = productsData.items.map(transformProduct);
    
    // Сохраняем все товары для поиска (обновляем при каждой загрузке)
    try {
      const existing = localStorage.getItem('techhome_all_products');
      const existingProducts = existing ? JSON.parse(existing) : [];
      const merged = [...existingProducts];
      
      transformed.forEach(product => {
        const index = merged.findIndex(p => p.id === product.id);
        if (index >= 0) {
          merged[index] = product; // обновляем
        } else {
          merged.push(product); // добавляем новый
        }
      });
      
      localStorage.setItem('techhome_all_products', JSON.stringify(merged));
      console.log('Updated all products cache for search:', merged.length);
    } catch (e) {
      console.error('Error saving products for search:', e);
    }
    
    return transformed;
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

  // Фильтрация на клиенте (для локальных фильтров)
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Сортировка
    filtered.sort((a, b) => {
      let result = 0;
      
      switch (catalogState.sort) {
        case 'priceAsc':
          result = a.price - b.price;
          break;
        case 'priceDesc':
          result = b.price - a.price;
          break;
        case 'name':
          result = a.name.localeCompare(b.name);
          break;
        case 'rating':
          result = (b.rating || 0) - (a.rating || 0);
          break;
        case 'new':
          result = new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
          break;
        case 'popular':
        default:
          result = (b.rating || 0) - (a.rating || 0);
          break;
      }
      
      return result;
    });

    return filtered;
  }, [products, catalogState.sort]);

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
    setChipUrl(categorySlug); // Используем URL-синхронизацию вместо прямого dispatch
    setSidebarOpen(false);
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    dispatch(applyFilters(newFilters));
    dispatch(setPage(1));
  };

  const handleAddToCart = (product: Product) => {
    try {
      const key = 'techhome_cart_products';
      const raw = localStorage.getItem(key);
      const map = raw ? JSON.parse(raw) as Record<string, Product> : {};
      map[product.id] = product;
      localStorage.setItem(key, JSON.stringify(map));
    } catch {}
    dispatch(addToCart(product.id));
  };

  const handleAddToWishlist = (productId: string) => {
    try {
      // найдём продукт в текущем списке (если он есть на странице)
      const product = products.find(p => p.id === productId);
      if (product) {
        const key = 'techhome_favs_products';
        const raw = localStorage.getItem(key);
        const map = raw ? JSON.parse(raw) as Record<string, Product> : {};
        map[product.id] = product;
        localStorage.setItem(key, JSON.stringify(map));
      }
    } catch {}
    dispatch(toggleFav(productId));
  };

  const isInWishlist = (productId: string): boolean => {
    return favorites.includes(productId);
  };

  const handlePageChange = (page: number) => {
    console.log('handlePageChange called with:', page);
    setPageUrl(page); // Используем URL-синхронизацию
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (sortValue: string) => {
    console.log('handleSortChange called with:', sortValue);
    setSortUrl(sortValue); // Используем URL-синхронизацию
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
                {(filters.category !== 'Все' || filters.brands.length > 0 || filters.inStock || 
                  filters.priceRange[0] > priceRange.min || filters.priceRange[1] < priceRange.max) && (
                  <span className="active-indicator"></span>
                )}
              </button>
            </div>
            
            <div className="sort-section">
              <span className="sort-label">Сортировка:</span>
              <select 
                value={catalogState.sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="sort-select"
              >
                <option value="rating">По рейтингу</option>
                <option value="priceAsc">Цена: по возрастанию</option>
                <option value="priceDesc">Цена: по убыванию</option>
                <option value="nameAsc">По названию: А-Я</option>
                <option value="nameDesc">По названию: Я-А</option>
              </select>
            </div>
            
            <div className="sort-section">
              <span className="sort-label">Показывать:</span>
              <select 
                value={catalogState.pageSize}
                onChange={(e) => {
                  const newSize = Number(e.target.value);
                  console.log('PageSize changed to:', newSize);
                  dispatch(setPageSize(newSize));
                }}
                className="sort-select"
              >
                <option value="20">20 товаров</option>
                <option value="40">40 товаров</option>
                <option value="60">60 товаров</option>
                <option value="80">80 товаров</option>
                <option value="100">100 товаров</option>
              </select>
            </div>
            
            <div className="results-info">
              <span className="results-count">
                {filteredProducts.length} товаров
              </span>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="products-section">
          <ProductGrid
            products={filteredProducts}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            isInWishlist={isInWishlist}
            loading={isLoading}
          />
          
          {/* Pagination */}
          {productsData && productsData.meta.total_pages > 1 && (
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
          margin-bottom: var(--space-8);
          padding-bottom: var(--space-4);
          border-bottom: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          justify-content: space-between;
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
          cursor: pointer;
          color: var(--text-secondary);
          display: none;
        }

        .sidebar-open .close-button {
          display: block;
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

        .main-content {
          padding: 0;
          background: var(--surface-secondary);
        }

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
          position: relative;
        }

        .filters-toggle-btn:hover {
          border-color: var(--primary);
          transform: translateY(-1px);
        }

        .active-indicator {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 8px;
          height: 8px;
          background: var(--primary);
          border-radius: 50%;
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

        .results-count {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          background: var(--surface-secondary);
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-md);
        }

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

          .close-button {
            display: none;
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
