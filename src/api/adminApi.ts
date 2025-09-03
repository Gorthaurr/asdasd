import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

// Создаем экземпляр axios с базовым URL
const adminApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена к запросам
adminApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Интерцептор для обработки ошибок и автообновления токена
adminApiClient.interceptors.response.use(
  (response) => {
    // Если в ответе есть новый токен, обновляем его
    const newToken = response.headers['x-new-token'];
    if (newToken) {
      localStorage.setItem('admin_token', newToken);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Токен истек или недействителен
      localStorage.removeItem('admin_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Типы данных
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  expires_in: number;
  user: {
    id: string;
    username: string;
    email: string;
    full_name?: string;
    is_admin: boolean;
    is_super_admin: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    last_login?: string;
  };
}

export interface DashboardStats {
  total_users: number;
  active_users: number;
  admin_users: number;
  super_admin_users: number;
  product_stats: {
    total_products: number;
    active_products: number;
    products_with_images: number;
    products_without_images: number;
  };
  order_stats: {
    total_orders: number;
    pending_orders: number;
    completed_orders: number;
    cancelled_orders: number;
    total_revenue: number;
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  phone?: string;
  notes?: string;
  is_active: boolean;
  is_admin: boolean;
  is_super_admin: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
  avatar_url?: string;
}

export interface BulkActionRequest {
  action: 'delete' | 'activate' | 'deactivate' | 'move_category';
  ids: string[];
  category_id?: string;
}

// API методы
export const adminApi = {
  // Аутентификация
  async login(username: string, password: string): Promise<LoginResponse> {
    console.log('adminApi.login called with:', { username, password: '***' });
    console.log('Making request to:', '/admin/auth/login');
    
    try {
      const response = await adminApiClient.post('/admin/auth/login', {
        username,
        password,
      });
      console.log('API response received:', response);
      console.log('Response data:', response.data);
      console.log('Login successful, token:', response.data.access_token ? 'present' : 'missing');
      return response.data;
    } catch (error: any) {
      console.error('API login error:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      throw error;
    }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const response = await adminApiClient.post('/admin/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response.data;
  },

  // Дашборд
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await adminApiClient.get('/admin/dashboard/stats');
    return response.data;
  },

  // Пользователи
  async getUserProfile(): Promise<User> {
    const response = await adminApiClient.get('/admin/users/profile');
    return response.data;
  },

  async getUsers(params?: {
    q?: string;
    page?: number;
    page_size?: number;
    is_active?: boolean;
    role?: string;
  }): Promise<{items: User[], meta: any}> {
    const response = await adminApiClient.get('/admin/users', { params });
    return response.data;
  },

  async getUser(userId: string): Promise<User> {
    const response = await adminApiClient.get(`/admin/users/${userId}`);
    return response.data;
  },

  async createUser(userData: {
    username: string;
    email: string;
    password: string;
    full_name?: string;
    phone?: string;
    notes?: string;
    is_active?: boolean;
    is_admin?: boolean;
    is_super_admin?: boolean;
  }): Promise<User> {
    const response = await adminApiClient.post('/admin/users', userData);
    return response.data;
  },

  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    const response = await adminApiClient.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  async deleteUser(userId: string): Promise<{ message: string }> {
    const response = await adminApiClient.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Массовые операции
  async bulkActions(bulkData: BulkActionRequest): Promise<{ message: string }> {
    const response = await adminApiClient.post('/admin/bulk-actions', bulkData);
    return response.data;
  },

  // Системные настройки
  async getSystemSettings(): Promise<any> {
    const response = await adminApiClient.get('/admin/settings');
    return response.data;
  },

  async updateSystemSettings(settings: any): Promise<{ message: string }> {
    const response = await adminApiClient.put('/admin/settings', settings);
    return response.data;
  },

  // Управление продуктами
  async getProducts(params?: {
    q?: string;
    category_id?: number;
    page?: number;
    page_size?: number;
  }): Promise<{items: any[], meta: any}> {
    const response = await adminApiClient.get('/admin/products', { params });
    return response.data;
  },

  async createProduct(productData: {
    name: string;
    category_id: number;
    price_raw?: string;
    price_cents?: number;
    description?: string;

  }): Promise<any> {
    const response = await adminApiClient.post('/admin/products', productData);
    return response.data;
  },

  async updateProduct(productId: string, productData: any): Promise<any> {
    const response = await adminApiClient.put(`/admin/products/${productId}`, productData);
    return response.data;
  },

  async getProduct(productId: string): Promise<any> {
    const response = await adminApiClient.get(`/admin/products/${productId}`);
    return response.data;
  },

  async deleteProduct(productId: string): Promise<{ message: string }> {
    const response = await adminApiClient.delete(`/admin/products/${productId}`);
    return response.data;
  },

  async setPrimaryImage(productId: string, imageId: number): Promise<{ message: string }> {
    const response = await adminApiClient.put(`/admin/products/${productId}/images/${imageId}/primary`);
    return response.data;
  },

  async deleteProductImage(productId: string, imageId: number): Promise<{ message: string }> {
    const response = await adminApiClient.delete(`/admin/products/${productId}/images/${imageId}`);
    return response.data;
  },

  async reorderProductImages(productId: string, imageIds: number[]): Promise<{ message: string }> {
    const response = await adminApiClient.put(`/admin/products/${productId}/images/reorder`, { image_ids: imageIds });
    return response.data;
  },



  // Управление категориями
  async getCategories(): Promise<Array<{id: number, slug: string, products_count: number}>> {
    const response = await adminApiClient.get('/admin/categories');
    return response.data;
  },

  async createCategory(categoryData: { slug: string }): Promise<any> {
    const response = await adminApiClient.post('/admin/categories', categoryData);
    return response.data;
  },

  async updateCategory(categoryId: number, categoryData: { slug: string }): Promise<any> {
    const response = await adminApiClient.put(`/admin/categories/${categoryId}`, categoryData);
    return response.data;
  },

  async deleteCategory(categoryId: number): Promise<{ message: string }> {
    const response = await adminApiClient.delete(`/admin/categories/${categoryId}`);
    return response.data;
  },

  // Управление заказами
  async getOrders(params?: {
    status_filter?: string;
    page?: number;
    page_size?: number;
  }): Promise<{items: any[], meta: any}> {
    const response = await adminApiClient.get('/admin/orders', { params });
    return response.data;
  },

  async getOrder(orderId: string): Promise<any> {
    const response = await adminApiClient.get(`/admin/orders/${orderId}`);
    return response.data;
  },

  async updateOrderStatus(orderId: string, status: string): Promise<any> {
    const response = await adminApiClient.put(`/admin/orders/${orderId}/status`, { status });
    return response.data;
  },

  async updateOrder(orderId: string, orderData: any): Promise<any> {
    const response = await adminApiClient.put(`/admin/orders/${orderId}`, orderData);
    return response.data;
  },
};

export default adminApi;
