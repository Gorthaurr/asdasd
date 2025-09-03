/**
 * Галерея изображений товара с миниатюрами.
 * Похожа на галерею Озона: главное изображение + миниатюры снизу.
 */

import { useState, useCallback } from 'react';
import type { Product } from '../../types/product';

interface ProductImageGalleryProps {
  product: Product;
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ product }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const hasImages = product.images && product.images.length > 0;
  const images = product.images || [];
  const selectedImage = images[selectedImageIndex];

  // Обработчик ошибки загрузки изображения
  const handleImageError = useCallback((index: number) => {
    setImageErrors(prev => new Set(prev).add(index));
  }, []);

  // Обработчик клика по миниатюре
  const handleThumbnailClick = useCallback((index: number) => {
    if (!imageErrors.has(index)) {
      setSelectedImageIndex(index);
    }
  }, [imageErrors]);

  // Fallback SVG для отсутствующих изображений
  const renderFallbackSVG = () => (
    <svg
      viewBox="0 0 800 600"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`Изображение: ${product.name}`}
      className="product-gallery-fallback"
    >
      <defs>
        <linearGradient id={`pg${product.id}`} x1="0" x2="1">
          <stop offset="0%" stopColor="#1c2340" />
          <stop offset="100%" stopColor="#0f1428" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill={`url(#pg${product.id})`} />
      <g fill="#6ea8fe" opacity="0.9">
        <rect x="220" y="140" width="360" height="260" rx="24" />
        <rect x="250" y="170" width="300" height="200" rx="12" fill="#182039" />
        <rect x="370" y="460" width="60" height="14" rx="7" fill="#7cf3d0" />
      </g>
    </svg>
  );

  return (
    <div className="product-image-gallery">
      {/* Главное изображение */}
      <div className="main-image-container">
        {hasImages && selectedImage && !imageErrors.has(selectedImageIndex) ? (
          <img
            src={selectedImage.url}
            alt={selectedImage.alt_text || product.name}
            className="main-product-image"
            loading="eager"
            onError={() => handleImageError(selectedImageIndex)}
          />
        ) : (
          renderFallbackSVG()
        )}
        
        {/* Индикатор количества изображений */}
        {images.length > 1 && (
          <div className="image-counter">
            {selectedImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Миниатюры (если больше одного изображения) */}
      {images.length > 1 && (
        <div className="thumbnails-container">
          <div className="thumbnails-grid">
            {images.map((image, index) => (
              <button
                key={index}
                className={`thumbnail-button ${
                  index === selectedImageIndex ? 'active' : ''
                } ${imageErrors.has(index) ? 'error' : ''}`}
                onClick={() => handleThumbnailClick(index)}
                disabled={imageErrors.has(index)}
                title={`Изображение ${index + 1}`}
              >
                {!imageErrors.has(index) ? (
                  <img
                    src={image.url}
                    alt={`${product.name} - изображение ${index + 1}`}
                    className="thumbnail-image"
                    loading="lazy"
                    onError={() => handleImageError(index)}
                  />
                ) : (
                  <div className="thumbnail-error">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 13.5l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                )}
                
                {/* Активный индикатор */}
                {index === selectedImageIndex && (
                  <div className="thumbnail-active-indicator" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
