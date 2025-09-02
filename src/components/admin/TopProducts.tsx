import React from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  sales_count: number;
  category: string;
  image_url?: string;
}

const TopProducts: React.FC = () => {
  // Моковые данные для демонстрации
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'iPhone 15 Pro',
      price: 120000,
      sales_count: 45,
      category: 'Смартфоны',
      image_url: '/images/iphone15.jpg'
    },
    {
      id: '2',
      name: 'MacBook Air M2',
      price: 180000,
      sales_count: 32,
      category: 'Ноутбуки',
      image_url: '/images/macbook-air.jpg'
    },
    {
      id: '3',
      name: 'AirPods Pro',
      price: 25000,
      sales_count: 78,
      category: 'Аксессуары',
      image_url: '/images/airpods-pro.jpg'
    },
    {
      id: '4',
      name: 'iPad Air',
      price: 65000,
      sales_count: 28,
      category: 'Планшеты',
      image_url: '/images/ipad-air.jpg'
    },
    {
      id: '5',
      name: 'Apple Watch Series 9',
      price: 45000,
      sales_count: 56,
      category: 'Умные часы',
      image_url: '/images/apple-watch.jpg'
    }
  ];

  return (
    <div className="top-products">
      <div className="section-header">
        <h3>🔥 Топ продуктов</h3>
        <button className="view-all-btn">Посмотреть все</button>
      </div>
      
      <div className="products-list">
        {mockProducts.map((product, index) => (
          <div key={product.id} className="product-item">
            <div className="product-rank">
              #{index + 1}
            </div>
            
            <div className="product-image">
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="no-image">📦</div>
              )}
            </div>
            
            <div className="product-info">
              <h4 className="product-name">{product.name}</h4>
              <p className="product-category">{product.category}</p>
              <div className="product-stats">
                <span className="product-price">
                  {product.price.toLocaleString('ru-RU')} ₽
                </span>
                <span className="product-sales">
                  Продаж: {product.sales_count}
                </span>
              </div>
            </div>
            
            <div className="product-actions">
              <button className="action-btn view-btn">👁️</button>
              <button className="action-btn edit-btn">✏️</button>
            </div>
          </div>
        ))}
      </div>
      
      {mockProducts.length === 0 && (
        <div className="no-products">
          <p>📦 Продуктов пока нет</p>
        </div>
      )}
    </div>
  );
};

export default TopProducts;
