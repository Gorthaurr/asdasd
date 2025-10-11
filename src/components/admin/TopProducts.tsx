import { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import LoadingSpinner from '../common/LoadingSpinner';

interface Product {
  id: string;
  name: string;
  price_cents?: number;
  category_name?: string;
  images_count: number;
  has_images: boolean;
}

const TopProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Обработчики для кнопок
  const handleViewProduct = async (productId: string) => {
    try {
      const product = await adminApi.getProduct(productId);
      console.log('Product details:', product);
      // Открываем товар на сайте
      window.open(`/product/${productId}`, '_blank');
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Ошибка загрузки товара');
    }
  };

  const handleEditProduct = async (productId: string) => {
    try {
      const product = await adminApi.getProduct(productId);
      console.log('Product for editing:', product);
      
      // Создаем более удобный интерфейс для редактирования
      const currentPrice = product.price_cents ? (product.price_cents / 100).toLocaleString('ru-RU') : 'Не указана';
      
      const editChoice = prompt(
        `Редактировать товар #${productId}\n\n` +
        `Название: ${product.name}\n` +
        `Цена: ${currentPrice} ₽\n` +
        `Категория: ${product.category_name || 'Не указана'}\n\n` +
        `Что хотите изменить?\n` +
        `1 - Название\n` +
        `2 - Цену\n` +
        `Введите номер (1 или 2):`
      );
      
      if (editChoice === '1') {
        const newName = prompt(`Изменить название товара\nТекущее название: ${product.name}\nВведите новое название:`, product.name);
        if (newName && newName !== product.name) {
          await adminApi.updateProduct(productId, { name: newName });
          alert(`Название товара изменено с "${product.name}" на "${newName}"`);
          window.location.reload();
        }
      } else if (editChoice === '2') {
        const newPrice = prompt(`Изменить цену товара\nТекущая цена: ${currentPrice} ₽\nВведите новую цену в рублях:`, currentPrice.replace(/\s/g, ''));
        if (newPrice && newPrice !== currentPrice.replace(/\s/g, '')) {
          const priceInCents = Math.round(parseFloat(newPrice) * 100);
          if (!isNaN(priceInCents) && priceInCents > 0) {
            await adminApi.updateProduct(productId, { price_cents: priceInCents });
            alert(`Цена товара изменена с ${currentPrice} ₽ на ${newPrice} ₽`);
            window.location.reload();
          } else {
            alert('Неверная цена. Введите корректное число.');
          }
        }
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Ошибка обновления товара');
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await adminApi.getProducts({ page: 1, page_size: 5 });
        setProducts(response.items);
      } catch (err) {
        setError('Ошибка загрузки продуктов');
        console.error('Error fetching products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="top-products">
        <div className="section-header">
          <h3>🔥 Топ продуктов</h3>
        </div>
        <div className="loading-container">
          <LoadingSpinner size="medium" />
          <p>Загрузка продуктов...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="top-products">
        <div className="section-header">
          <h3>🔥 Топ продуктов</h3>
        </div>
        <div className="error-container">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <h3 className="admin-card-title">🔥 Топ продуктов</h3>
      </div>
      <div className="admin-card-content">

      <div className="products-list">
        {products.map((product, index) => (
          <div key={product.id} className="product-item">
            <div className="product-rank">#{index + 1}</div>

            <div className="product-image">
              {product.has_images ? (
                <div className="image-placeholder">🖼️</div>
              ) : (
                <div className="no-image">📦</div>
              )}
            </div>

            <div className="product-info">
              <h4 className="product-name">{product.name}</h4>
              <p className="product-category">{product.category_name || 'Без категории'}</p>
              <div className="product-stats">
                <span className="product-price">
                  {product.price_cents 
                    ? (product.price_cents).toLocaleString('ru-RU') + ' ₽'
                    : 'Цена не указана'
                  }
                </span>
                <span className="product-images">
                  {product.has_images ? `${product.images_count} фото` : 'Без фото'}
                </span>
              </div>
            </div>

            <div className="product-actions">
              <button 
                className="action-btn view-btn"
                onClick={() => handleViewProduct(product.id)}
                title="Просмотр товара"
              >
                👁️
              </button>
              <button 
                className="action-btn edit-btn"
                onClick={() => handleEditProduct(product.id)}
                title="Редактировать товар"
              >
                ✏️
              </button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="no-products">
          <p>📦 Продуктов пока нет</p>
        </div>
      )}
      </div>
    </div>
  );
};

export default TopProducts;
