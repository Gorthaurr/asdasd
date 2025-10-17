import React from 'react';
import ProductCard from './ProductCard';
import type { Product } from '../../types/product';
import './ProductGrid.css';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  loading?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onAddToCart,
  onAddToWishlist,
  isInWishlist,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="product-grid">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="product-card-skeleton">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton-line skeleton-line-short"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line skeleton-line-medium"></div>
              <div className="skeleton-line skeleton-line-short"></div>
              <div className="skeleton-button"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔍</div>
        <h3>Товары не найдены</h3>
        <p>Попробуйте изменить параметры поиска или фильтры</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onAddToWishlist={onAddToWishlist}
          isInWishlist={isInWishlist(product.id)}
        />
      ))}
    </div>
  );
};

export default ProductGrid;

