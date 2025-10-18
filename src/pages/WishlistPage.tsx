import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, ArrowLeft, Trash2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../app/store';
import { toggleFav } from '../features/favs/favsSlice';
import { addToCart, changeQty } from '../features/cart/cartSlice';
import { applyFilters } from '../features/catalog/catalogSlice';
import { useGetProductsQuery } from '../api/productsApi';
import FiltersPanel from '../components/user/FiltersPanel';
import type { Product, FilterState } from '../types/product';
import { transformProduct } from '../utils/productTransform';
import './WishlistPage.css';

export default function WishlistPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const favorites = useSelector((s: RootState) => s.favs.ids);
  const catalogState = useSelector((s: RootState) => s.catalog);
  const [filtersPanelOpen, setFiltersPanelOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<FilterState | null>(null);
  
  // Преобразуем CatalogState в FilterState для совместимости
  const filters: FilterState = {
    category: catalogState.chip,
    priceRange: catalogState.priceRange,
    brands: catalogState.brands,
    inStock: catalogState.inStock,
    sortBy: catalogState.sort === 'rating' ? 'rating' :
            catalogState.sort === 'priceAsc' || catalogState.sort === 'priceDesc' ? 'price' :
            catalogState.sort === 'nameAsc' || catalogState.sort === 'nameDesc' ? 'name' : 'rating',
    sortDirection: catalogState.sortDirection
  };
  
  // Получаем все товары
  const { data: productsData } = useGetProductsQuery({
    page: 1,
    page_size: 1000,
  });

  // Transform и filter только избранные с датой добавления
  const wishlistItems = useMemo(() => {
    const key = 'techhome_favs_products';
    const raw = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    const snapshot: Record<string, Product> = raw ? (()=>{ try { return JSON.parse(raw); } catch { return {}; } })() : {};

    const base = (productsData?.items || [])
      .filter(p => favorites.includes(p.id))
      .map(p => transformProduct(p));

    // добавляем те, что есть в избранном, но их нет в API-странице
    const missing = favorites
      .filter(id => !base.find(x => x.id === id))
      .map(id => snapshot[id])
      .filter((p): p is Product => !!p);

    return [...base, ...missing].map(p => ({ ...p, addedAt: new Date().toISOString() }));
  }, [productsData, favorites]);

  // Получаем товары из избранного с фильтрацией и сортировкой
  const wishlistProducts = useMemo(() => {
    let filtered = [...wishlistItems];

    // Фильтр по цене
    filtered = filtered.filter(product =>
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Фильтр по брендам
    if (filters.brands.length > 0) {
      filtered = filtered.filter(product => filters.brands.includes(product.brand || ''));
    }

    // Фильтр по наличию
    if (filters.inStock) {
      filtered = filtered.filter(product => product.inStock);
    }

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
        case 'nameAsc':
          result = a.name.localeCompare(b.name);
          break;
        case 'nameDesc':
          result = b.name.localeCompare(a.name);
          break;
        case 'rating':
        default:
          result = (b.rating || 0) - (a.rating || 0);
          break;
      }
      
      return result;
    });

    return filtered;
  }, [wishlistItems, filters, catalogState.sort]);

  // Группируем товары по категориям
  const productsByCategory = wishlistProducts.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, (Product & { addedAt: string })[]>);

  const handleRemoveFromWishlist = (product: Product & { addedAt: string }) => {
    dispatch(toggleFav(product.id));
  };

  const handleAddToCartFromWishlist = (product: Product) => {
    dispatch(addToCart(product.id));
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setTempFilters(newFilters); // Сохраняем временные фильтры, но не применяем их
  };

  const handleApplyFilters = () => {
    if (tempFilters) {
      dispatch(applyFilters(tempFilters));
      setTempFilters(null);
    }
    setFiltersPanelOpen(false);
  };

  const handleCancelFilters = () => {
    setTempFilters(null);
    setFiltersPanelOpen(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-container">
          <div className="wishlist-header">
            <button 
              className="back-button"
              onClick={() => navigate('/')}
            >
              <ArrowLeft size={20} />
              Назад к товарам
            </button>
            <h1>Избранное</h1>
          </div>

          <div className="empty-wishlist">
            <div className="empty-icon">
              <Heart size={64} />
            </div>
            <h2>Ваш список избранного пуст</h2>
            <p>Добавьте товары, которые вам понравились, и они появятся здесь</p>
            <button 
              className="continue-shopping-btn"
              onClick={() => navigate('/')}
            >
              Продолжить покупки
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-container">
        <div className="wishlist-header">
          <button 
            className="back-button"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={20} />
            Назад к товарам
          </button>
          <div className="wishlist-title">
            <h1>Избранное</h1>
            <span className="wishlist-count">{wishlistItems.length} товаров</span>
          </div>
        </div>

        {/* Filters and Sort Bar */}
        <div className="filters-sort-bar">
          <div className="filters-sort-content">
            <div className="filters-section">
              <button 
                className="filters-toggle-btn"
                onClick={() => {
                  setTempFilters(filters); // Инициализируем временные фильтры текущими
                  setFiltersPanelOpen(true);
                }}
              >
                <span className="filter-icon">⚙️</span>
                <span>Фильтры</span>
                {(filters.category !== 'Все' || filters.brands.length > 0 || filters.inStock || 
                  filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000) && (
                  <span className="active-indicator"></span>
                )}
              </button>
            </div>
            
            <div className="sort-section">
              <span className="sort-label">Сортировка:</span>
              <select 
                value={catalogState.sort}
                onChange={(e) => {
                  const newFilters: FilterState = {
                    ...filters,
                    sortBy: (e.target.value === 'rating' ? 'rating' :
                           e.target.value === 'priceAsc' || e.target.value === 'priceDesc' ? 'price' :
                           e.target.value === 'nameAsc' || e.target.value === 'nameDesc' ? 'name' : 'rating') as 'name' | 'price' | 'rating' | 'newest',
                    sortDirection: (e.target.value === 'priceAsc' || e.target.value === 'nameAsc' ? 'asc' : 'desc') as 'asc' | 'desc'
                  };
                  dispatch(applyFilters(newFilters));
                }}
                className="sort-select"
              >
                <option value="rating">По рейтингу</option>
                <option value="priceAsc">Цена: по возрастанию</option>
                <option value="priceDesc">Цена: по убыванию</option>
                <option value="nameAsc">По названию: А-Я</option>
                <option value="nameDesc">По названию: Я-А</option>
              </select>
            </div>
            
            <div className="results-info">
              <span className="results-count">
                {wishlistProducts.length} товаров
              </span>
            </div>
          </div>
        </div>

        {/* Products by Categories */}
        {Object.entries(productsByCategory).map(([category, categoryProducts]) => (
          <div key={category} className="category-section">
            <div className="category-header">
              <h2 className="category-title">{category}</h2>
              <span className="category-count">{categoryProducts.length} товаров</span>
            </div>
            
            <div className="wishlist-grid">
              {categoryProducts.map((product) => (
                <div key={product.id} className="wishlist-item">
                  <div className="wishlist-item-image">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      onClick={() => navigate(`/product/${product.id}`)}
                    />
                    <button 
                      className="remove-from-wishlist"
                      onClick={() => handleRemoveFromWishlist(product)}
                      title="Удалить из избранного"
                    >
                      <Trash2 size={16} />
                    </button>
                    
                    {/* Product Status Badge */}
                    {!product.inStock && (
                      <div className="out-of-stock-badge">
                        Нет в наличии
                      </div>
                    )}
                  </div>

                  <div className="wishlist-item-content">
                    <div className="wishlist-item-info">
                      <h3 
                        className="wishlist-item-name"
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        {product.name}
                      </h3>
                      <p className="wishlist-item-brand">{product.brand}</p>
                      <div className="wishlist-item-rating">
                        <div className="stars">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span 
                              key={i} 
                              className={i < Math.floor(product.rating) ? 'filled' : 'empty'}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="rating-text">({product.reviews})</span>
                      </div>
                      
                      {/* Added Date */}
                      <div className="added-date">
                        Добавлено: {new Date(product.addedAt).toLocaleDateString('ru-RU')}
                      </div>
                    </div>

                    <div className="wishlist-item-actions">
                      <div className="wishlist-item-price">
                        {formatPrice(product.price)}
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="original-price">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      <button 
                        className={`add-to-cart-from-wishlist ${!product.inStock ? 'disabled' : ''}`}
                        onClick={() => handleAddToCartFromWishlist(product)}
                        disabled={!product.inStock}
                      >
                        <ShoppingCart size={16} />
                        {product.inStock ? 'В корзину' : 'Нет в наличии'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Recommendations Section */}
        {wishlistProducts.length > 0 && productsData && (
          <div className="recommendations-section">
            <h2>Рекомендации для вас</h2>
            <div className="recommendations-grid">
              {productsData.items
                .filter(p => !wishlistProducts.some(wp => wp.id === p.id))
                .slice(0, 4)
                .map(product => {
                  const transformedProduct = transformProduct(product);
                  return (
                    <div key={product.id} className="recommendation-item">
                      <div className="recommendation-image">
                        <img 
                          src={transformedProduct.image} 
                          alt={transformedProduct.name}
                          onClick={() => navigate(`/product/${product.id}`)}
                        />
                      </div>
                      <div className="recommendation-info">
                        <h4 onClick={() => navigate(`/product/${product.id}`)}>
                          {transformedProduct.name}
                        </h4>
                        <p>{transformedProduct.brand}</p>
                        <div className="recommendation-price">
                          {formatPrice(transformedProduct.price)}
                        </div>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>
        )}

        <div className="wishlist-footer">
          <div className="wishlist-summary">
            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-number">{wishlistItems.length}</span>
                <span className="stat-label">Товаров в избранном</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  {formatPrice(wishlistProducts.reduce((sum, p) => sum + p.price, 0))}
                </span>
                <span className="stat-label">Общая стоимость</span>
              </div>
            </div>
          </div>
          
          <div className="footer-actions">
            <button 
              className="continue-shopping-btn"
              onClick={() => navigate('/')}
            >
              Продолжить покупки
            </button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      <FiltersPanel
        filters={tempFilters || filters}
        onFiltersChange={handleFiltersChange}
        availableBrands={Array.from(new Set(wishlistItems.map(p => p.brand).filter((b): b is string => Boolean(b))))}
        minPrice={wishlistItems.length > 0 ? Math.min(...wishlistItems.map(p => p.price)) : 0}
        maxPrice={wishlistItems.length > 0 ? Math.max(...wishlistItems.map(p => p.price)) : 1000000}
        isOpen={filtersPanelOpen}
        onClose={handleCancelFilters}
        onApply={handleApplyFilters}
      />
    </div>
  );
}

