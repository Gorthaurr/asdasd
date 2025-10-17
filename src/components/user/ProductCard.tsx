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

  // Получаем первое изображение товара
  const productImage = product.images?.[0]?.urls?.original || product.image || 'https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=No+Image';

  const handleCardClick = () => {
    console.log('🖱️ Product card clicked:', product.id, product.name);
    navigate(`/product/${product.id}`);
  };

  return (
    <div 
      className="product-card"
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <div className={`product-image-container ${imageLoaded ? 'loaded' : ''}`}>
        <img 
          src={imageError ? 'https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=No+Image' : productImage} 
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
        {product.inStock === false && (
          <div className="stock-badge">
            Нет в наличии
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="product-content">
        {/* Brand & Name */}
        <div className="product-header">
          <div className="product-brand">{product.brand || 'Brand'}</div>
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
                className={star <= (product.rating || 4.5) ? 'filled' : 'empty'}
              />
            ))}
          </div>
          <span className="rating-count">({product.reviews || 0})</span>
        </div>

        {/* Price */}
        <div className="product-price">
          <span className="current-price">
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button 
          className={`add-to-cart-button ${product.inStock === false ? 'disabled' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          disabled={product.inStock === false}
        >
          <ShoppingCart size={16} />
          {product.inStock !== false ? 'В корзину' : 'Нет в наличии'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
