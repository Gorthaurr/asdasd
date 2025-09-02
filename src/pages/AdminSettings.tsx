import React, { useState, useEffect } from 'react';
import { adminApi } from '../api/adminApi';
import AdminLayout from '../components/admin/AdminLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface SystemSettings {
  site_name: string;
  site_description: string;
  maintenance_mode: boolean;
  registration_enabled: boolean;
  max_upload_size: number;
  allowed_file_types: string[];
}

const AdminSettings = () => {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const data = await adminApi.getSystemSettings();
      setSettings(data);
    } catch (err) {
      setError('Ошибка загрузки настроек');
      console.error('Error fetching settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      setIsSaving(true);
      await adminApi.updateSystemSettings(settings);
      alert('Настройки успешно сохранены!');
    } catch (err) {
      console.error('Error saving settings:', err);
      alert('Ошибка сохранения настроек');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof SystemSettings, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  if (isLoading) {
    return (
      <AdminLayout title="⚙️ Системные настройки">
        <div className="loading-container">
          <LoadingSpinner size="large" />
          <p>Загрузка настроек...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error || !settings) {
    return (
      <AdminLayout title="⚙️ Системные настройки">
        <div className="error-container">
          <p>{error || 'Не удалось загрузить настройки'}</p>
          <button onClick={fetchSettings}>Повторить попытку</button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="⚙️ Системные настройки">
      <div className="admin-content">
        <form onSubmit={handleSaveSettings}>
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">🏠 Основные настройки</h3>
            </div>
            <div className="admin-card-content">
              <div className="admin-form">
                <div className="form-group">
                  <label className="form-label">Название сайта:</label>
                  <input
                    type="text"
                    value={settings.site_name}
                    onChange={(e) => handleInputChange('site_name', e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Описание сайта:</label>
                  <textarea
                    value={settings.site_description}
                    onChange={(e) => handleInputChange('site_description', e.target.value)}
                    className="form-textarea"
                    rows={3}
                  />
                </div>

                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={settings.maintenance_mode}
                      onChange={(e) => handleInputChange('maintenance_mode', e.target.checked)}
                    />
                    <span className="form-label">Режим обслуживания</span>
                  </label>
                  <small style={{ color: 'var(--admin-text-muted)' }}>
                    При включении сайт будет недоступен для обычных пользователей
                  </small>
                </div>

                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={settings.registration_enabled}
                      onChange={(e) => handleInputChange('registration_enabled', e.target.checked)}
                    />
                    <span className="form-label">Разрешить регистрацию</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">📁 Настройки загрузки файлов</h3>
            </div>
            <div className="admin-card-content">
              <div className="admin-form">
                <div className="form-group">
                  <label className="form-label">Максимальный размер файла (в байтах):</label>
                  <input
                    type="number"
                    value={settings.max_upload_size}
                    onChange={(e) => handleInputChange('max_upload_size', parseInt(e.target.value))}
                    className="form-input"
                    min="1"
                  />
                  <small style={{ color: 'var(--admin-text-muted)' }}>
                    Текущий лимит: {(settings.max_upload_size / 1024 / 1024).toFixed(1)} MB
                  </small>
                </div>

                <div className="form-group">
                  <label className="form-label">Разрешенные типы файлов:</label>
                  <input
                    type="text"
                    value={settings.allowed_file_types.join(', ')}
                    onChange={(e) => handleInputChange('allowed_file_types', e.target.value.split(',').map(s => s.trim()))}
                    className="form-input"
                    placeholder="jpg, png, gif, webp"
                  />
                  <small style={{ color: 'var(--admin-text-muted)' }}>
                    Разделяйте типы файлов запятыми
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className="admin-actions">
            <button 
              type="submit" 
              className="btn btn-primary btn-lg"
              disabled={isSaving}
            >
              {isSaving ? '💾 Сохранение...' : '💾 Сохранить настройки'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary btn-lg"
              onClick={fetchSettings}
              disabled={isSaving}
            >
              🔄 Отменить изменения
            </button>
          </div>
        </form>

        <div className="admin-card" style={{ marginTop: '2rem' }}>
          <div className="admin-card-header">
            <h3 className="admin-card-title">ℹ️ Системная информация</h3>
          </div>
          <div className="admin-card-content">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <strong>Версия системы:</strong>
                <div style={{ color: 'var(--admin-text-muted)' }}>1.0.0</div>
              </div>
              <div>
                <strong>Backend:</strong>
                <div style={{ color: 'var(--admin-text-muted)' }}>FastAPI + Python</div>
              </div>
              <div>
                <strong>Frontend:</strong>
                <div style={{ color: 'var(--admin-text-muted)' }}>React + TypeScript</div>
              </div>
              <div>
                <strong>База данных:</strong>
                <div style={{ color: 'var(--admin-text-muted)' }}>PostgreSQL</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
