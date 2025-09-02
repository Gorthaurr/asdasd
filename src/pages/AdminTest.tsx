import React, { useState } from 'react';
import { adminApi } from '../api/adminApi';
import AdminLayout from '../components/admin/AdminLayout';

const AdminTest = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testEndpoint = async (name: string, testFn: () => Promise<any>) => {
    try {
      addResult(`🧪 Тестируем ${name}...`);
      const result = await testFn();
      addResult(`✅ ${name} - успешно: ${JSON.stringify(result).slice(0, 100)}...`);
    } catch (error: any) {
      addResult(`❌ ${name} - ошибка: ${error.message}`);
    }
  };



  const runAllTests = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      // Тест статистики дашборда
      await testEndpoint('Dashboard Stats', () => adminApi.getDashboardStats());
      
      // Тест продуктов
      await testEndpoint('Products List', () => adminApi.getProducts({ page: 1, page_size: 5 }));
      
      // Тест категорий
      await testEndpoint('Categories List', () => adminApi.getCategories());
      
      // Тест заказов
      await testEndpoint('Orders List', () => adminApi.getOrders({ page: 1, page_size: 5 }));
      
      // Тест пользователей
      await testEndpoint('Users List', () => adminApi.getUsers({ page: 1, page_size: 5 }));
      
      addResult('🎉 Все тесты завершены!');
    } catch (error) {
      addResult(`💥 Критическая ошибка: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout title="🧪 Тестирование Admin API">
      <div className="admin-actions">
        <button 
          className="btn btn-primary" 
          onClick={runAllTests}
          disabled={isLoading}
        >
          {isLoading ? '⏳ Тестируем...' : '🚀 Запустить тесты'}
        </button>
      </div>

      <div className="admin-content">
        <div className="test-results">
          <h2>📋 Результаты тестов:</h2>
          <div className="results-log">
            {testResults.length === 0 ? (
              <p>Нажмите "Запустить тесты" чтобы начать</p>
            ) : (
              testResults.map((result, index) => (
                <div 
                  key={index} 
                  className={`log-entry ${
                    result.includes('✅') ? 'success' : 
                    result.includes('❌') ? 'error' : 
                    result.includes('🎉') ? 'complete' : 'info'
                  }`}
                >
                  {result}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="test-info">
          <h3>ℹ️ Информация о тестах</h3>
          <ul>
            <li>Тестирование статистики дашборда</li>
            <li>Получение списка продуктов</li>
            <li>Получение списка категорий</li>
            <li>Получение списка заказов</li>
            <li>Получение списка пользователей</li>
          </ul>
          <p><strong>Примечание:</strong> Для успешного тестирования необходимо быть авторизованным как администратор.</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminTest;
