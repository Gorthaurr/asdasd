import React, { useState, useEffect } from 'react';
import { adminApi } from '../api/adminApi';
import AdminLayout from '../components/admin/AdminLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProductImageGallery from '../components/admin/ProductImageGallery';

interface Product {
  id: string;
  name: string;
  category_id: number;
  category_name?: string;
  price_raw?: string;
  price_cents?: number;
  description?: string;
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
  const [pendingImageChanges, setPendingImageChanges] = useState<{
    uploaded: File[];
    deleted: number[];
    primaryImageId: number | null;
    reordered: boolean;
  }>({
    uploaded: [],
    deleted: [],
    primaryImageId: null,
    reordered: false
  });

  const resetImageChanges = () => {
    setPendingImageChanges({
      uploaded: [],
      deleted: [],
      primaryImageId: null,
      reordered: false
    });
  };

  // Получаем изображения с учетом pending изменений
  const getImagesWithPendingChanges = () => {
    if (!selectedProduct?.images) return [];

    let images = [...selectedProduct.images];

    // Удаляем изображения, помеченные для удаления
    images = images.filter(img => !pendingImageChanges.deleted.includes(img.id));

    // Добавляем заглушки для новых изображений
    const newImagesCount = pendingImageChanges.uploaded.length;
    for (let i = 0; i < newImagesCount; i++) {
      images.push({
        id: -1 - i, // Временный отрицательный ID для новых изображений
        path: '',
        filename: pendingImageChanges.uploaded[i].name,
        url: URL.createObjectURL(pendingImageChanges.uploaded[i]),
        is_primary: false,
        sort_order: images.length,
        status: 'pending'
      });
    }

    return images;
  };

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

  // Синхронизируем высоту блока атрибутов с блоком изображений
  React.useEffect(() => {
    const syncHeight = () => {
      const imagesSection = document.querySelector('.modal-section:has(.product-image-gallery)') as HTMLElement;
      const attributesSection = document.querySelector('.modal-section:has([data-attributes-content])') as HTMLElement;
      
      if (imagesSection && attributesSection) {
        const imagesHeight = imagesSection.offsetHeight;
        attributesSection.style.height = `${imagesHeight}px`;
        
        // Настраиваем скролл для атрибутов
        const attributesContent = attributesSection.querySelector('[data-attributes-content]') as HTMLElement;
        if (attributesContent) {
          const headerHeight = 60; // Высота заголовка
          attributesContent.style.maxHeight = `${imagesHeight - headerHeight}px`;
          attributesContent.style.overflowY = 'auto';
        }
      }
    };

    if (selectedProduct) {
      const timer = setTimeout(syncHeight, 200);
      return () => clearTimeout(timer);
    }
  }, [selectedProduct, getImagesWithPendingChanges().length]);

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
             console.log('Product data received:', product);
       console.log('Product images:', product.images);
       console.log('First image details:', product.images?.[0]);
       if (product.images?.[0]) {
         console.log('First image URL:', product.images[0].url);
         console.log('First image path:', product.images[0].path);
         console.log('Constructed fallback URL:', `http://localhost:8000/static/${product.images[0].path}`);
       }
      setSelectedProduct(product);
      setIsEditing(false);
      setEditFormData({
        name: product.name,
        category_id: product.category_id,
        price_raw: product.price_raw,
        price_cents: product.price_cents ? product.price_cents / 100 : '', // Конвертируем в рубли для редактирования
        description: product.description,

      });
    } catch (err) {
      console.error('Error fetching product:', err);
      alert('Ошибка загрузки продукта');
    }
  };

  const handleStartEdit = () => {
    // Сбрасываем изменения изображений при начале редактирования
    resetImageChanges();
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Сбрасываем изменения изображений
    resetImageChanges();
    // Восстанавливаем оригинальные данные
    if (selectedProduct) {
      setEditFormData({
        name: selectedProduct.name,
        category_id: selectedProduct.category_id,
        price_raw: selectedProduct.price_raw,
        price_cents: selectedProduct.price_cents ? selectedProduct.price_cents / 100 : '', // Конвертируем в рубли
        description: selectedProduct.description,

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

      // Применяем изменения изображений
      await applyImageChanges();

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

      });

      // Сбрасываем изменения изображений после успешного сохранения
      resetImageChanges();

    } catch (err) {
      console.error('Error updating product:', err);
      alert('Ошибка обновления продукта');
    }
  };

  const applyImageChanges = async () => {
    if (!selectedProduct) return;

    // Применяем загрузку новых изображений
    for (const file of pendingImageChanges.uploaded) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('alt_text', `Изображение для ${selectedProduct.name}`);
      formData.append('sort_order', '0');
      formData.append('is_primary', 'false');

      const token = localStorage.getItem('admin_token');
      const response = await fetch(`http://localhost:8000/api/v1/admin/products/${selectedProduct.id}/images/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload image: ${response.status}`);
      }
    }

    // Применяем установку главного изображения
    if (pendingImageChanges.primaryImageId) {
      await adminApi.setPrimaryImage(selectedProduct.id, pendingImageChanges.primaryImageId);
    }

    // Применяем удаление изображений
    for (const imageId of pendingImageChanges.deleted) {
      await adminApi.deleteProductImage(selectedProduct.id, imageId);
    }

    // Применяем изменение порядка (если нужно)
    if (pendingImageChanges.reordered) {
      // Получаем текущий порядок изображений из галереи
      const currentImages = getImagesWithPendingChanges();
      // Для reorder используем только существующие изображения (id > 0)
      const existingImageIds = currentImages
        .filter(img => img.id > 0)
        .map(img => img.id);
      await adminApi.reorderProductImages(selectedProduct.id, existingImageIds);
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

      // Вместо немедленной загрузки, сохраняем файл в локальном состоянии
      setPendingImageChanges(prev => ({
        ...prev,
        uploaded: [...prev.uploaded, file]
      }));

      alert('Изображение добавлено к загрузке. Сохраните товар для применения изменений.');
    } catch (err) {
      console.error('Error preparing image for upload:', err);
      alert('Ошибка подготовки изображения');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSetPrimaryImage = async (imageId: number) => {
    if (!selectedProduct) return;
    
    try {
      // Сохраняем изменение в локальном состоянии вместо немедленного применения
      setPendingImageChanges(prev => ({
        ...prev,
        primaryImageId: imageId
      }));

      alert('Главное изображение изменено. Сохраните товар для применения изменений.');
    } catch (err) {
      console.error('Error preparing primary image change:', err);
      alert('Ошибка изменения главного изображения');
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!selectedProduct) return;

    try {
      // Сохраняем изменение в локальном состоянии вместо немедленного применения
      setPendingImageChanges(prev => ({
        ...prev,
        deleted: [...prev.deleted, imageId]
      }));

      alert('Изображение добавлено к удалению. Сохраните товар для применения изменений.');
    } catch (err) {
      console.error('Error preparing image deletion:', err);
      alert('Ошибка подготовки удаления изображения');
    }
  };

    const handleReorderImages = async (imageIds: number[]) => {
    if (!selectedProduct) return;

    try {
      // Сохраняем изменение в локальном состоянии вместо немедленного применения
      setPendingImageChanges(prev => ({
        ...prev,
        reordered: true
      }));

      alert('Порядок изображений изменен. Сохраните товар для применения изменений.');
    } catch (err) {
      console.error('Error preparing image reordering:', err);
      alert('Ошибка изменения порядка изображений');
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



              {/* Изображения и атрибуты */}
              <div className="modal-grid-2" style={{ display: 'flex', gap: '1.5rem' }}>
                {/* Изображения */}
                <div className="modal-section" style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ margin: 0 }}>🖼️ Изображения ({getImagesWithPendingChanges().length})</h4>
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
                  
                  <ProductImageGallery
                    images={getImagesWithPendingChanges()}
                    isEditing={isEditing}
                    onSetPrimary={handleSetPrimaryImage}
                    onDeleteImage={handleDeleteImage}
                    onReorderImages={handleReorderImages}
                  />
                </div>

                {/* Атрибуты */}
                <div className="modal-section" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ margin: 0 }}>🏷️ Атрибуты ({selectedProduct.attributes?.length || 0})</h4>
                    <div style={{ width: '140px' }}></div>
                  </div>
                  {selectedProduct.attributes && selectedProduct.attributes.length > 0 ? (
                    <div data-attributes-content style={{ display: 'grid', gap: '0.75rem' }}>
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
