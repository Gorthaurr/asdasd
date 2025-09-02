import React, { useState, useEffect } from 'react';
import { adminApi } from '../api/adminApi';
import AdminLayout from '../components/admin/AdminLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface Category {
  id: number;
  slug: string;
  products_count: number;
}

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCategorySlug, setNewCategorySlug] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await adminApi.getCategories();
      setCategories(data);
    } catch (err) {
      setError('Ошибка загрузки категорий');
      console.error('Error fetching categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategorySlug.trim()) return;

    try {
      await adminApi.createCategory({ slug: newCategorySlug.trim() });
      setNewCategorySlug('');
      setShowCreateForm(false);
      fetchCategories();
    } catch (err) {
      console.error('Error creating category:', err);
      alert('Ошибка создания категории');
    }
  };

  const handleUpdateCategory = async (categoryId: number, newSlug: string) => {
    if (!newSlug.trim()) return;

    try {
      await adminApi.updateCategory(categoryId, { slug: newSlug.trim() });
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      console.error('Error updating category:', err);
      alert('Ошибка обновления категории');
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту категорию?')) return;

    try {
      await adminApi.deleteCategory(categoryId);
      fetchCategories();
    } catch (err: any) {
      console.error('Error deleting category:', err);
      const message = err.response?.data?.detail || 'Ошибка удаления категории';
      alert(message);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="🏷️ Управление категориями">
        <div className="loading-container">
          <LoadingSpinner size="large" />
          <p>Загрузка категорий...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="🏷️ Управление категориями">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={fetchCategories}>Повторить попытку</button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="🏷️ Управление категориями">
      <div className="admin-actions">
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          ➕ Добавить категорию
        </button>
      </div>

      {showCreateForm && (
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <div className="admin-card-header">
            <h3 className="admin-card-title">Создать новую категорию</h3>
          </div>
          <div className="admin-card-content">
            <form onSubmit={handleCreateCategory} className="admin-form">
              <div className="form-group">
                <label className="form-label">Slug категории:</label>
                <input
                  type="text"
                  value={newCategorySlug}
                  onChange={(e) => setNewCategorySlug(e.target.value)}
                  placeholder="например: smartphones"
                  className="form-input"
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="submit" className="btn btn-primary">
                  Создать
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewCategorySlug('');
                  }}
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-content">
        <div className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Slug</th>
                <th>Количество продуктов</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>#{category.id}</td>
                  <td>
                    {editingCategory?.id === category.id ? (
                      <input
                        type="text"
                        defaultValue={category.slug}
                        className="form-input"
                        onBlur={(e) => handleUpdateCategory(category.id, e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleUpdateCategory(category.id, (e.target as HTMLInputElement).value);
                          }
                        }}
                        autoFocus
                      />
                    ) : (
                      <span 
                        style={{ cursor: 'pointer' }}
                        onClick={() => setEditingCategory(category)}
                      >
                        {category.slug}
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={`status-badge ${category.products_count > 0 ? 'status-completed' : 'status-pending'}`}>
                      {category.products_count} товаров
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => setEditingCategory(category)}
                      >
                        ✏️ Изменить
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteCategory(category.id)}
                        disabled={category.products_count > 0}
                        title={category.products_count > 0 ? 'Нельзя удалить категорию с товарами' : 'Удалить категорию'}
                      >
                        🗑️ Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {categories.length === 0 && (
            <div className="empty-state">
              <p>🏷️ Категории не найдены</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;
