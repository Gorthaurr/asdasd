import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../app/store';
import { useGetProductsQuery, useGetCategoriesQuery } from '../api/productsApi';
import { setChip, setPage, setSort, applyFilters } from '../features/catalog/catalogSlice';
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
  const catalogState = useSelector((s: RootState) => s.catalog);
  const favorites = useSelector((s: RootState) => s.favs.ids);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filtersPanelOpen, setFiltersPanelOpen] = useState(false);

  // Слушаем событие для открытия sidebar
  React.useEffect(() => {
    const handleToggleSidebar = () => {
      setSidebarOpen(prev => !prev);
    };
    window.addEventListener('toggleSidebar', handleToggleSidebar);
    return () => window.removeEventListener('toggleSidebar', handleToggleSidebar);
  }, []);

  // Получаем категории
  const { data: categoriesData } = useGetCategoriesQuery();
  
  // Получаем товары (загружаем ВСЕ для клиентской фильтрации)
  const { data: productsData, isLoading } = useGetProductsQuery({
    page: 1,
    page_size: 100, // Загружаем больше товаров для клиентской фильтрации
    category_slug: catalogState.chip !== 'Все' ? catalogState.chip : undefined,
    q: catalogState.q || undefined,
  });

  // Transform API products to UI products
  const allProducts: Product[] = useMemo(() => {
    if (!productsData?.items) return [];
    return productsData.items.map(transformProduct);
  }, [productsData]);

  // Apply client-side filters and sorting
  const products: Product[] = useMemo(() => {
    let filtered = [...allProducts];

    // Filter by price range
    if (catalogState.priceRange[0] > 0 || catalogState.priceRange[1] < 1000000) {
      filtered = filtered.filter(product =>
        product.price >= catalogState.priceRange[0] && 
        product.price <= catalogState.priceRange[1]
      );
    }

    // Filter by brands
    if (catalogState.brands.length > 0) {
      filtered = filtered.filter(product => 
        product.brand && catalogState.brands.includes(product.brand)
      );
    }

    // Filter by in stock
    if (catalogState.inStock) {
      filtered = filtered.filter(product => product.inStock !== false);
    }

    // Apply sorting
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
        case 'newest':
          result = b.id.localeCompare(a.id);
          break;
        case 'popular':
        default:
          result = (b.rating || 0) - (a.rating || 0);
          break;
      }
      
      // Apply sort direction
      return catalogState.sortDirection === 'asc' ? result : -result;
    });

    console.log('🔍 Filtered products:', filtered.length);
    return filtered;
  }, [allProducts, catalogState.priceRange, catalogState.brands, catalogState.inStock, catalogState.sort, catalogState.sortDirection]);

  // Apply pagination to filtered products
  const paginatedProducts = useMemo(() => {
    const startIndex = (catalogState.page - 1) * catalogState.pageSize;
    const paginated = products.slice(startIndex, startIndex + catalogState.pageSize);
    console.log('📄 Paginated products:', paginated.map(p => ({ id: p.id, name: p.name })));
    return paginated;
  }, [products, catalogState.page, catalogState.pageSize]);

  // Categories list for sidebar
  const categories = useMemo(() => {
    const cats = [{ id: 'Все', slug: 'Все', name: 'Все категории', count: productsData?.meta.total || 0 }];
    if (categoriesData) {
      console.log('📁 Categories from API:', categoriesData);
      cats.push(...categoriesData.map(cat => ({
        id: cat.slug,
        slug: cat.slug,
        name: cat.slug,
        count: 0
      })));
    }
    console.log('📁 Final categories:', cats);
    return cats;
  }, [categoriesData, productsData]);

  // Available brands (from all products, not filtered)
  const availableBrands = useMemo(() => {
    return Array.from(new Set(allProducts.map(p => p.brand || 'Unknown'))).filter(b => b !== 'Unknown');
  }, [allProducts]);

  // Price range (from all products, not filtered)
  const priceRange = useMemo(() => {
    if (allProducts.length === 0) return { min: 0, max: 1000000 };
    const prices = allProducts.map(p => p.price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices))
    };
  }, [allProducts]);

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
    console.log('🔄 Category change:', categorySlug);
    console.log('📊 Current chip:', catalogState.chip);
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
    console.log('📄 Page change:', page);
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
                value={catalogState.sort}
                onChange={(e) => dispatch(setSort(e.target.value))}
                className="sort-select"
              >
                <option value="popular">Популярные</option>
                <option value="new">Сначала новые</option>
                <option value="priceAsc">Цена: по возрастанию</option>
                <option value="priceDesc">Цена: по убыванию</option>
                <option value="name">По названию</option>
                <option value="rating">По рейтингу</option>
              </select>
            </div>
            
            <div className="results-info">
              <span className="results-count">
                {products.length} товаров
              </span>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="products-section">
          <ProductGrid
            products={paginatedProducts}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            isInWishlist={isInWishlist}
            loading={isLoading}
          />
          
            {/* Pagination */}
            {products.length > 0 && (() => {
              const totalPages = Math.ceil(products.length / catalogState.pageSize);
              console.log('📊 Pagination:', { 
                currentPage: catalogState.page, 
                totalPages, 
                totalItems: products.length, 
                itemsPerPage: catalogState.pageSize 
              });
              return (
                <Pagination
                  currentPage={catalogState.page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  totalItems={products.length}
                  itemsPerPage={catalogState.pageSize}
                />
              );
            })()}
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
