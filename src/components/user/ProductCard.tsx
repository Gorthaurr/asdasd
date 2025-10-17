import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import type { Product } from '../../types/product';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (productId: string) => void;
  isInWishlist: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onAddToWishlist,
  isInWishlist,
}) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Mock data for rating and reviews (not in API yet)
  const rating = product.rating || 4.5;
  const reviews = 127;
  const inStock = true;

  // Get primary image
  const primaryImage = product.images && product.images.length > 0 
    ? product.images[0].urls?.original 
    : 'https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=No+Image';

  return (
    <div 
      className="product-card"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Image Section */}
      <div className={`product-image-container ${imageLoaded ? 'loaded' : ''}`}>
        <img 
          src={imageError ? 'https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=No+Image' : primaryImage} 
          alt={product.name}
          className={`product-image ${imageLoaded ? 'loaded' : ''}`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
        />
        
        {/* Wishlist Button */}
        <button 
          className={`wishlist-button ${isInWishlist ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAddToWishlist(product.id);
          }}
          title={isInWishlist ? "Удалить из избранного" : "Добавить в избранное"}
        >
          <Heart size={18} fill={isInWishlist ? 'currentColor' : 'none'} />
        </button>

        {/* Stock Badge */}
        {!inStock && (
          <div className="stock-badge">
            Нет в наличии
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="product-content">
        {/* Brand & Name */}
        <div className="product-header">
          <div className="product-brand">{product.category || 'Техника'}</div>
          <h3 className="product-name" title={product.name}>
            {product.name}
          </h3>
        </div>

        {/* Rating */}
        <div className="product-rating">
          <div className="stars">
            {[1, 2, 3, 4, 5].map(star => (
              <Star 
                key={star}
                size={14}
                className={star <= rating ? 'filled' : 'empty'}
              />
            ))}
          </div>
          <span className="rating-count">({reviews})</span>
        </div>

        {/* Price */}
        <div className="product-price">
          <span className="current-price">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <span className="old-price">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button 
          className={`add-to-cart-button ${!inStock ? 'disabled' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          disabled={!inStock}
        >
          <ShoppingCart size={16} />
          {inStock ? 'В корзину' : 'Нет в наличии'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

