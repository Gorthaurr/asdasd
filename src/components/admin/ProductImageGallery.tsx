import React, { useState } from 'react';
import { ProductImage } from '../../types/api';

interface ProductImageGalleryProps {
  images: ProductImage[];
  isEditing: boolean;
  onSetPrimary: (imageId: number) => void;
  onDeleteImage?: (imageId: number) => void;
  onReorderImages?: (imageIds: number[]) => void;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  isEditing,
  onSetPrimary,
  onDeleteImage,
  onReorderImages
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Сбрасываем выбранный индекс при изменении изображений
  React.useEffect(() => {
    setSelectedImageIndex(0);
  }, [images.length]);

  if (!images || images.length === 0) {
    return (
      <div className="product-gallery-empty">
        <div className="gallery-empty-icon">📷</div>
        <div className="gallery-empty-text">Изображения не загружены</div>
      </div>
    );
  }

  // Сортируем изображения: главное первое, остальные по порядку
  const sortedImages = [...images].sort((a, b) => {
    if (a.is_primary) return -1;
    if (b.is_primary) return 1;
    return a.sort_order - b.sort_order;
  });

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  return (
    <div className="product-image-gallery">
      {/* Главное изображение */}
      <div className="gallery-main-image">
        <img
          src={sortedImages[selectedImageIndex]?.url || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIGhlaWdodD0iNDAwIHZpZXdCb3g9IjAgMCA0MDAgNDAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI0YzRjRGNiIvPgo8cGF0aCBkPSJNMjAwIDEyNUMyMDAgMTI1IDE1MCAxNzUgMTAwIDE3NUM1MCAxNzUgMTAwIDEyNSA5MCAxMjVDOTAgMTI1IDE1MCA3NSAyMDAgNzVDMjUwIDc1IDMwMCAxMjUgMzAwIDEyNUMzMDAgMTI1IDI1MCAxNzUgMjAwIDE3NUMxNTAgMTc1IDkwIDEyNSA5MCAxMjVaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik04MCAyODBBODAgMjgwIDEwMCAzMDAgMTIwIDMwMEMxNDAgMzAwIDE2MCAyODAgMTYwIDI4MEMxNjAgMjgwIDE0MCAyNjAgMTIwIDI2MEMxMDAgMjYwIDgwIDI4MCA4MCAyODBaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0yNDAgMjgwQzI0MCAyODAgMjYwIDMwMCAyODAgMzAwQzMwMCAzMDAgMzIwIDI4MCAzMjAgMjgwQzMyMCAyODAgMzAwIDI2MCAyODAgMjYwQzI2MCAyNjAgMjQwIDI4MCAyNDAgMjgwWiIgZmlsbD0iIzlCOUJBQCIvPgo8L3N2Zz4K'}
          alt={sortedImages[selectedImageIndex]?.alt_text || `Изображение ${sortedImages[selectedImageIndex]?.filename}`}
          className="main-image"
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            const target = e.currentTarget;
            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIGhlaWdodD0iNDAwIHZpZXdCb3g9IjAgMCA0MDAgNDAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI0YzRjRGNiIvPgo8cGF0aCBkPSJNMjAwIDEyNUMyMDAgMTI1IDE1MCAxNzUgMTAwIDE3NUM1MCAxNzUgMTAwIDEyNSA5MCAxMjVDOTAgMTI1IDE1MCA3NSAyMDAgNzVDMjUwIDc1IDMwMCAxMjUgMzAwIDEyNUMzMDAgMTI1IDI1MCAxNzUgMjAwIDE3NUMxNTAgMTc1IDkwIDEyNSA5MCAxMjVaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik04MCAyODBBODAgMjgwIDEwMCAzMDAgMTIwIDMwMEMxNDAgMzAwIDE2MCAyODAgMTYwIDI4MEMxNjAgMjgwIDE0MCAyNjAgMTIwIDI2MEMxMDAgMjYwIDgwIDI4MCA4MCAyODBaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0yNDAgMjgwQzI0MCAyODAgMjYwIDMwMCAyODAgMzAwQzMwMCAzMDAgMzIwIDI4MCAzMjAgMjgwQzMyMCAyODAgMzAwIDI2MCAyODAgMjYwQzI2MCAyNjAgMjQwIDI4MCAyNDAgMjgwWiIgZmlsbD0iIzlCOUJBQCIvPgo8L3N2Zz4K';
          }}
        />
        {sortedImages[selectedImageIndex]?.is_primary && (
          <div className="primary-badge">
            <span>⭐ Главное</span>
          </div>
        )}
      </div>

      {/* Галерея маленьких изображений */}
      <div className="gallery-thumbnails">
        <div className="thumbnails-scroll">
          {sortedImages.map((image, index) => (
            <div
              key={image.id}
              className={`thumbnail-item ${image.is_primary ? 'primary' : ''} ${selectedImageIndex === index ? 'selected' : ''}`}
              onClick={() => handleImageClick(index)}
            >
              <img
                src={image.url || '/placeholder-image.jpg'}
                alt={image.alt_text || `Изображение ${image.filename}`}
                className="thumbnail-image"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  const target = e.currentTarget;
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MCAyNUMyOS41IDI1IDIxIDMzLjUgMjEgNDRDMjEgNTQuNSAyOS41IDYzIDQwIDYzQzUwLjUgNjMgNTkgNTQuNSA1OSA0NEM1OSAzMy41IDUwLjUgMjUgNDAgMjVaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0xNiA1NkMxNiA1NiAyMCA2MCAyNCA2MEMyOCA2MCAzMiA1NiAzMiA1NkMzMiA1NiAyOCA1MiAyNCA1MkMyMCA1MiAxNiA1NiAxNiA1NloiIGZpbGw9IiM5QjlCQTAiLz4KPHBhdGggZD0iTTQ4IDU2QzQ4IDU2IDUyIDYwIDU2IDYwQzYwIDYwIDY0IDU2IDY0IDU2QzY0IDU2IDYwIDUyIDU2IDUyQzUyIDUyIDQ4IDU2IDQ4IDU2WiIgZmlsbD0iIzlCOUJBQCIvPgo8L3N2Zz4K';
                }}
              />

              {/* Индикатор главного изображения */}
              {image.is_primary && (
                <div className="thumbnail-primary-indicator">
                  <span>⭐</span>
                </div>
              )}

              {/* Порядок изображения */}
              <span className="image-order">{index + 1}</span>

              {/* Кнопки управления */}
              {isEditing && (
                <div className="thumbnail-controls">
                  {!image.is_primary && onSetPrimary && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSetPrimary(image.id);
                      }}
                      className="btn btn-xs btn-primary"
                      title="Сделать главным"
                    >
                      ⭐
                    </button>
                  )}
                  {onDeleteImage && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteImage(image.id);
                      }}
                      className="btn btn-xs btn-danger"
                      title="Удалить изображение"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductImageGallery;
