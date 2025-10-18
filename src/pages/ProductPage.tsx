import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingCart, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../app/store';
import { toggleFavorite } from '../features/favs/favsSlice';
import { addToCart } from '../features/cart/cartSlice';
import { useGetProductQuery } from '../api/productsApi';
import type { Product } from '../types/product';
import { transformProduct } from '../utils/productTransform';
import './ProductPage.css';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  
  const favorites = useSelector((s: RootState) => s.favs.ids);
  
  // Получаем продукт по ID
  const { data: productData, isLoading, error } = useGetProductQuery(id || '');

  if (isLoading) {
    return (
      <div className="product-page">
        <div className="product-page-container">
          <div className="loading">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (error || !productData) {
    return (
      <div className="product-not-found">
        <h1>Товар не найден</h1>
        <button onClick={() => navigate('/')} className="back-button">
          <ArrowLeft size={20} />
          Вернуться в каталог
        </button>
        </div>
    );
  }

  // Transform API product to UI product
  const product = transformProduct(productData);
  const isInWishlist = favorites.includes(product.id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Создаем галерею изображений
  const productImages = product.images && product.images.length > 0
    ? product.images.slice(0, 4).map(img => img.urls?.original || product.image || '')
    : [product.image || ''];

  const handleAddToCart = () => {
    // Сохраняем данные товара для checkout
    const cartProducts = JSON.parse(localStorage.getItem('techhome_cart_products') || '{}');
    cartProducts[product.id] = {
      name: product.name,
      price: product.price,
      image: product.image,
      brand: product.brand
    };
    localStorage.setItem('techhome_cart_products', JSON.stringify(cartProducts));
    
    // Добавляем в корзину
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product.id));
    }
  };

  const handleToggleWishlist = () => {
    dispatch(toggleFavorite(product.id));
  };

  return (
    <div className="product-page">
      <div className="product-page-container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <button onClick={() => navigate('/')} className="back-button">
            <ArrowLeft size={20} />
            Каталог
          </button>
          <span>›</span>
          <span>{product.brand}</span>
          <span>›</span>
          <span>{product.name}</span>
        </div>

        <div className="product-page-content">
          {/* Image Gallery */}
          <div className="product-gallery">
            <div className="thumbnails">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} - вид ${index + 1}`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80x80/f3f4f6/9ca3af?text=No+Image';
                    }}
                  />
                </button>
              ))}
            </div>
            
            <div className="main-image-container">
              <img 
                src={productImages[selectedImage]} 
                alt={product.name}
                className="main-image"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=No+Image';
                }}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-brand">
              <span className="brand-label">Бренд:</span>
              <span className="brand-name">{product.brand}</span>
            </div>

            {/* Rating */}
            <div className="product-rating">
              <div className="stars">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star 
                    key={star}
                    size={20}
                    className={star <= product.rating ? 'filled' : 'empty'}
                  />
                ))}
              </div>
              <span className="rating-value">{product.rating}</span>
              <span className="rating-reviews">({product.reviews} отзывов)</span>
            </div>

            {/* Price */}
            <div className="product-price">
              <div className="price-current">
                {formatPrice(product.price)}
              </div>
            </div>

            {/* Features */}
            <div className="product-features">
              <h3>Основные характеристики</h3>
              <div className="features-grid">
                {product.features?.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span className="feature-text">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="product-actions">
              <div className="quantity-selector">
                <label>Количество:</label>
                <div className="quantity-controls">
                  <button
                    className="quantity-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus size={14} />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    className="quantity-input"
                  />
                  <button
                    className="quantity-btn"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="action-buttons">
            <button
                  className="add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingCart size={18} />
                  {product.inStock ? 'Добавить в корзину' : 'Нет в наличии'}
            </button>

            <button
                  className={`wishlist-btn ${isInWishlist ? 'active' : ''}`}
                  onClick={handleToggleWishlist}
                  title={isInWishlist ? "Удалить из избранного" : "Добавить в избранное"}
                >
                  <Heart size={18} fill={isInWishlist ? 'currentColor' : 'none'} />
            </button>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications - moved to bottom */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="product-specifications-bottom">
            <h3>Технические характеристики</h3>
            <div className="specifications-grid-bottom">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="specification-item-bottom">
                  <span className="specification-key">{key}:</span>
                  <span className="specification-value">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
