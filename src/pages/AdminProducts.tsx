import React, { useState, useEffect } from 'react';
import { adminApi } from '../api/adminApi';
import AdminLayout from '../components/admin/AdminLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface Product {
  id: string;
  name: string;
  category_id: number;
  category_name?: string;
  price_raw?: string;
  price_cents?: number;
  description?: string;
  product_url?: string;
  images_count: number;
  has_images: boolean;
}

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});
  const [categories, setCategories] = useState<any[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchProducts = async (page = 1, search = '') => {
    try {
      setIsLoading(true);
      const response = await adminApi.getProducts({
        page,
        page_size: 20,
        q: search || undefined,
      });
      setProducts(response.items);
      setTotalPages(response.meta.total_pages);
      setCurrentPage(page);
    } catch (err) {
      setError('Ошибка загрузки продуктов');
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, searchQuery);
  }, [currentPage]);

  // Загружаем категории при монтировании
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await adminApi.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Закрытие модального окна по ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    if (selectedProduct || showCreateForm) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedProduct, showCreateForm]);

  const closeModal = () => {
    setSelectedProduct(null);
    setIsEditing(false);
    setShowCreateForm(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts(1, searchQuery);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот продукт?')) return;
    
    try {
      await adminApi.deleteProduct(productId);
      fetchProducts(currentPage, searchQuery);
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Ошибка удаления продукта');
    }
  };

  const handleViewProduct = async (productId: string) => {
    try {
      const product = await adminApi.getProduct(productId);
      setSelectedProduct(product);
      setIsEditing(false);
      setEditFormData({
        name: product.name,
        category_id: product.category_id,
        price_raw: product.price_raw,
        price_cents: product.price_cents ? product.price_cents / 100 : '', // Конвертируем в рубли для редактирования
        description: product.description,
        product_url: product.product_url,
      });
    } catch (err) {
      console.error('Error fetching product:', err);
      alert('Ошибка загрузки продукта');
    }
  };

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Восстанавливаем оригинальные данные
    if (selectedProduct) {
      setEditFormData({
        name: selectedProduct.name,
        category_id: selectedProduct.category_id,
        price_raw: selectedProduct.price_raw,
        price_cents: selectedProduct.price_cents ? selectedProduct.price_cents / 100 : '', // Конвертируем в рубли
        description: selectedProduct.description,
        product_url: selectedProduct.product_url,
      });
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedProduct) return;
    
    try {
      // Конвертируем цену из рублей в копейки перед отправкой
      const dataToSave = {
        ...editFormData,
        price_cents: editFormData.price_cents ? Math.round(editFormData.price_cents * 100) : null
      };
      
      await adminApi.updateProduct(selectedProduct.id, dataToSave);
      setIsEditing(false);
      fetchProducts(currentPage, searchQuery);
      // Обновляем данные в модальном окне
      const updatedProduct = await adminApi.getProduct(selectedProduct.id);
      setSelectedProduct(updatedProduct);
      // Обновляем форму с новыми данными
      setEditFormData({
        name: updatedProduct.name,
        category_id: updatedProduct.category_id,
        price_raw: updatedProduct.price_raw,
        price_cents: updatedProduct.price_cents ? updatedProduct.price_cents / 100 : '',
        description: updatedProduct.description,
        product_url: updatedProduct.product_url,
      });
    } catch (err) {
      console.error('Error updating product:', err);
      alert('Ошибка обновления продукта');
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAttributeChange = (attrId: number, field: 'key' | 'value', value: string) => {
    if (!selectedProduct || !selectedProduct.attributes) return;
    
    const updatedAttributes = selectedProduct.attributes.map(attr => 
      attr.id === attrId ? { ...attr, [field]: value } : attr
    );
    
    setSelectedProduct({
      ...selectedProduct,
      attributes: updatedAttributes
    });
  };

  const handleImageUpload = async (file: File) => {
    if (!selectedProduct) return;
    
    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('alt_text', `Изображение для ${selectedProduct.name}`);
      formData.append('sort_order', '0');
      formData.append('is_primary', 'false');

      // Используем админский эндпоинт для загрузки с авторизацией
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`http://localhost:8000/api/v1/admin/products/${selectedProduct.id}/images/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        // Обновляем данные продукта
        const updatedProduct = await adminApi.getProduct(selectedProduct.id);
        setSelectedProduct(updatedProduct);
        alert('Изображение успешно загружено!');
      } else {
        const errorText = await response.text();
        console.error('Upload response:', response.status, errorText);
        throw new Error(`Ошибка загрузки: ${response.status} - ${errorText}`);
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Ошибка загрузки изображения');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSetPrimaryImage = async (imageId: number) => {
    if (!selectedProduct) return;
    
    try {
      await adminApi.setPrimaryImage(selectedProduct.id, imageId);
      
      // Обновляем данные продукта
      const updatedProduct = await adminApi.getProduct(selectedProduct.id);
      setSelectedProduct(updatedProduct);
      
      alert('Главное изображение установлено!');
    } catch (err) {
      console.error('Error setting primary image:', err);
      alert('Ошибка установки главного изображения');
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="📦 Управление продуктами">
        <div className="loading-container">
          <LoadingSpinner size="large" />
          <p>Загрузка продуктов...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="📦 Управление продуктами">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={() => fetchProducts(currentPage, searchQuery)}>
            Повторить попытку
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="📦 Управление продуктами">
      <div className="admin-actions">
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateForm(true)}
        >
          ➕ Добавить продукт
        </button>
      </div>

      <div className="admin-filters">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Поиск продуктов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn btn-secondary">🔍 Найти</button>
        </form>
      </div>

      <div className="admin-content">
        <div className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Название</th>
                <th>Категория</th>
                <th>Цена</th>
                <th>Изображения</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>#{product.id.slice(0, 8)}</td>
                  <td>
                    <div className="product-name">
                      <strong>{product.name}</strong>
                      {product.description && (
                        <small>{product.description.slice(0, 100)}...</small>
                      )}
                    </div>
                  </td>
                  <td>{product.category_name || 'Без категории'}</td>
                  <td>
                    {product.price_cents 
                      ? (product.price_cents / 100).toLocaleString('ru-RU') + ' ₽'
                      : 'Не указана'
                    }
                  </td>
                  <td>
                    <span className={`images-badge ${product.has_images ? 'has-images' : 'no-images'}`}>
                      {product.has_images ? `${product.images_count} фото` : 'Без фото'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => handleViewProduct(product.id)}
                      >
                        👁️ Просмотр / Изменить
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        🗑️ Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {products.length === 0 && (
            <div className="empty-state">
              <p>📦 Продукты не найдены</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="btn btn-secondary"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
            >
              ← Предыдущая
            </button>
            <span className="pagination-info">
              Страница {currentPage} из {totalPages}
            </span>
            <button 
              className="btn btn-secondary"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
            >
              Следующая →
            </button>
          </div>
        )}
      </div>

      {/* Модальное окно просмотра/редактирования продукта */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px' }}>
            <div className="modal-header">
              <h3>📦 {isEditing ? 'Редактирование продукта' : 'Детали продукта'}</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {!isEditing ? (
                  <button className="btn btn-sm btn-primary" onClick={handleStartEdit}>
                    ✏️ Редактировать
                  </button>
                ) : (
                  <>
                    <button className="btn btn-sm btn-success" onClick={handleSaveEdit}>
                      💾 Сохранить
                    </button>
                    <button className="btn btn-sm btn-secondary" onClick={handleCancelEdit}>
                      ❌ Отмена
                    </button>
                  </>
                )}
                <button className="btn btn-sm btn-secondary" onClick={closeModal}>
                  ✕ Закрыть
                </button>
              </div>
            </div>
            <div className="modal-body">
              {/* Основная информация и цена */}
              <div className="modal-grid-2">
                <div className="modal-section">
                  <h4>📋 Основная информация</h4>
                  <div className="modal-field">
                    <span className="modal-field-label">Название:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editFormData.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="form-input"
                        placeholder="Название товара"
                      />
                    ) : (
                      <div className="modal-field-value" style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                        {selectedProduct.name}
                      </div>
                    )}
                  </div>
                  
                  <div className="modal-field">
                    <span className="modal-field-label">Категория:</span>
                    {isEditing ? (
                      <select
                        value={editFormData.category_id || ''}
                        onChange={(e) => handleInputChange('category_id', parseInt(e.target.value))}
                        className="form-select"
                      >
                        <option value="">Выберите категорию</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.slug} ({cat.products_count} товаров)
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="modal-field-value">
                        {selectedProduct.category_name || (
                          <span className="modal-field-empty">Не указана</span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="modal-field">
                    <span className="modal-field-label">ID продукта:</span>
                    <div className="modal-field-value">
                      <code style={{ background: 'var(--admin-primary-light)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                        {selectedProduct.id}
                      </code>
                    </div>
                  </div>
                </div>
                
                <div className="modal-section">
                  <h4>💰 Цена и стоимость</h4>
                  <div className="modal-field">
                    <span className="modal-field-label">Цена в рублях:</span>
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.01"
                        value={editFormData.price_cents || ''}
                        onChange={(e) => handleInputChange('price_cents', parseFloat(e.target.value))}
                        className="form-input"
                        placeholder="Цена в рублях (например: 181272.00)"
                      />
                    ) : (
                      <div className="modal-field-value" style={{ 
                        color: 'var(--admin-success)', 
                        fontSize: '1.5rem', 
                        fontWeight: '700',
                        justifyContent: 'center'
                      }}>
                        {selectedProduct.price_cents 
                          ? (selectedProduct.price_cents / 100).toLocaleString('ru-RU') + ' ₽'
                          : <span className="modal-field-empty">Не указана</span>
                        }
                      </div>
                    )}
                  </div>
                  
                  <div className="modal-field">
                    <span className="modal-field-label">Формат отображения цены:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editFormData.price_raw || ''}
                        onChange={(e) => handleInputChange('price_raw', e.target.value)}
                        className="form-input"
                        placeholder="например: 181 272 ₽"
                      />
                    ) : (
                      <div className="modal-field-value">
                        {selectedProduct.price_raw || (
                          <span className="modal-field-empty">Не указан</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Описание - на всю ширину */}
              <div className="modal-section modal-full-width">
                <h4>📝 Описание товара</h4>
                <div className="modal-field">
                  {isEditing ? (
                    <textarea
                      value={editFormData.description || ''}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="form-textarea"
                      rows={5}
                      placeholder="Подробное описание товара..."
                      style={{ width: '100%', resize: 'vertical' }}
                    />
                  ) : (
                    <div className="modal-field-value" style={{ 
                      minHeight: '100px',
                      alignItems: 'flex-start',
                      padding: 'var(--admin-spacing)'
                    }}>
                      {selectedProduct.description || (
                        <span className="modal-field-empty">Описание не указано</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Ссылка на товар - на всю ширину */}
              <div className="modal-section modal-full-width">
                <h4>🔗 Ссылка на товар</h4>
                <div className="modal-field">
                  {isEditing ? (
                    <input
                      type="url"
                      value={editFormData.product_url || ''}
                      onChange={(e) => handleInputChange('product_url', e.target.value)}
                      className="form-input"
                      placeholder="https://example.com/product"
                      style={{ width: '100%' }}
                    />
                  ) : (
                    selectedProduct.product_url ? (
                      <div className="modal-field-value">
                        <a 
                          href={selectedProduct.product_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn btn-primary btn-sm"
                          style={{ textDecoration: 'none' }}
                        >
                          🌐 Открыть на сайте
                        </a>
                        <span style={{ marginLeft: '1rem', fontSize: '0.875rem', color: 'var(--admin-text-muted)' }}>
                          {selectedProduct.product_url}
                        </span>
                      </div>
                    ) : (
                      <div className="modal-field-value">
                        <span className="modal-field-empty">Ссылка не указана</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Изображения и атрибуты */}
              <div className="modal-grid-2">
                {/* Изображения */}
                <div className="modal-section">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ margin: 0 }}>🖼️ Изображения ({selectedProduct.images?.length || 0})</h4>
                    {isEditing && (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file);
                          }}
                          style={{ display: 'none' }}
                          id="image-upload"
                        />
                        <label htmlFor="image-upload" className="btn btn-primary btn-sm" style={{ cursor: 'pointer' }}>
                          {uploadingImage ? '📤 Загрузка...' : '📤 Добавить изображение'}
                        </label>
                      </div>
                    )}
                  </div>
                  
                  {selectedProduct.images && selectedProduct.images.length > 0 ? (
                    <div style={{ display: 'grid', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto' }}>
                      {selectedProduct.images.map((img: any) => (
                        <div key={img.id} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem',
                          background: 'var(--admin-secondary-light)',
                          border: `2px solid ${img.is_primary ? 'var(--admin-success)' : 'var(--admin-border)'}`,
                          borderRadius: 'var(--admin-radius)'
                        }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            background: img.is_primary ? 'var(--admin-success)' : 'var(--admin-primary)',
                            borderRadius: 'var(--admin-radius)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.25rem',
                            color: 'white'
                          }}>
                            {img.is_primary ? '⭐' : '🖼️'}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '600', fontSize: '0.875rem', color: 'var(--admin-text)' }}>
                              {img.filename}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                              Порядок: {img.sort_order} • {img.status}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {img.is_primary ? (
                              <span className="status-badge status-completed">Главное</span>
                            ) : (
                              isEditing && (
                                <button
                                  className="btn btn-sm btn-success"
                                  onClick={() => handleSetPrimaryImage(img.id)}
                                  title="Сделать главным"
                                >
                                  ⭐ Главное
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ 
                      padding: 'var(--admin-spacing-xl)', 
                      textAlign: 'center',
                      background: 'var(--admin-secondary-light)',
                      borderRadius: 'var(--admin-radius)',
                      border: '2px dashed var(--admin-border)',
                      color: 'var(--admin-text-muted)'
                    }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📷</div>
                      <div>Изображения не загружены</div>
                      {isEditing && (
                        <div style={{ marginTop: '1rem' }}>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file);
                            }}
                            style={{ display: 'none' }}
                            id="image-upload-empty"
                          />
                          <label htmlFor="image-upload-empty" className="btn btn-primary" style={{ cursor: 'pointer' }}>
                            📤 Загрузить первое изображение
                          </label>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Атрибуты */}
                <div className="modal-section">
                  <h4>🏷️ Атрибуты ({selectedProduct.attributes?.length || 0})</h4>
                  {selectedProduct.attributes && selectedProduct.attributes.length > 0 ? (
                    <div style={{ display: 'grid', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto' }}>
                      {selectedProduct.attributes.map((attr: any) => (
                        <div key={attr.id} style={{ 
                          padding: '0.75rem',
                          background: 'var(--admin-secondary-light)',
                          border: '1px solid var(--admin-border)',
                          borderRadius: 'var(--admin-radius)'
                        }}>
                          {isEditing ? (
                            <div style={{ display: 'grid', gap: '0.5rem' }}>
                              <div>
                                <span className="modal-field-label">Ключ:</span>
                                <input
                                  type="text"
                                  value={attr.key}
                                  onChange={(e) => handleAttributeChange(attr.id, 'key', e.target.value)}
                                  className="form-input"
                                  placeholder="Название атрибута"
                                />
                              </div>
                              <div>
                                <span className="modal-field-label">Значение:</span>
                                <input
                                  type="text"
                                  value={attr.value}
                                  onChange={(e) => handleAttributeChange(attr.id, 'value', e.target.value)}
                                  className="form-input"
                                  placeholder="Значение атрибута"
                                />
                              </div>
                            </div>
                          ) : (
                            <>
                              <div style={{ fontWeight: '600', fontSize: '0.875rem', color: 'var(--admin-primary)', marginBottom: '0.25rem' }}>
                                {attr.key}
                              </div>
                              <div style={{ fontSize: '0.875rem', color: 'var(--admin-text)' }}>
                                {attr.value}
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ 
                      padding: 'var(--admin-spacing-xl)', 
                      textAlign: 'center',
                      background: 'var(--admin-secondary-light)',
                      borderRadius: 'var(--admin-radius)',
                      border: '2px dashed var(--admin-border)',
                      color: 'var(--admin-text-muted)'
                    }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏷️</div>
                      <div>Атрибуты не указаны</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;
