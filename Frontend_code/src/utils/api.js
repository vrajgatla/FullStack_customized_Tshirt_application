// API service utility for centralized API calls
const API_BASE_URL = '/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async signup(userData) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateProfile(userData, token) {
    return this.request('/auth/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
  }

  // Product endpoints
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/tshirts${queryString ? `?${queryString}` : ''}`);
  }

  async getProduct(id) {
    return this.request(`/tshirts/${id}`);
  }

  getProductImage(id) {
    return `${this.baseURL}/tshirts/${id}/image`;
  }

  getProductThumbnail(id) {
    return `${this.baseURL}/tshirts/${id}/thumbnail`;
  }

  async getTrendingProducts() {
    return this.request('/tshirts/trending');
  }

  async getProductPreview(brand, color) {
    return this.request(`/tshirts/preview?brand=${encodeURIComponent(brand)}&color=${encodeURIComponent(color)}`);
  }

  // Category endpoints
  async getCategories() {
    return this.request('/categories');
  }

  // Brand endpoints
  async getBrands() {
    return this.request('/brands');
  }

  async getUsedBrands() {
    return this.request('/brands/used');
  }

  // Color endpoints
  async getColors() {
    return this.request('/colors');
  }

  async getUsedColors() {
    return this.request('/colors/used');
  }

  // Design endpoints
  async getDesigns(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/designs${queryString ? `?${queryString}` : ''}`);
  }

  getDesignImage(id) {
    return `${this.baseURL}/designs/${id}/image`;
  }

  // Designed T-shirt endpoints
  async getDesignedTshirts(params = {}, token) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/designed-tshirts${queryString ? `?${queryString}` : ''}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
  }

  async getDesignedTshirt(id, token) {
    return this.request(`/designed-tshirts/${id}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
  }

  getDesignedTshirtImage(id) {
    return `${this.baseURL}/designed-tshirts/${id}/image`;
  }

  getDesignedTshirtThumbnail(id) {
    return `${this.baseURL}/designed-tshirts/${id}/thumbnail`;
  }

  downloadDesignedTshirt(id) {
    return `${this.baseURL}/designed-tshirts/${id}/download`;
  }

  async getFeaturedDesignedTshirts() {
    return this.request('/designed-tshirts/featured');
  }

  async searchDesignedTshirts(query, page = 0, size = 10, token) {
    return this.request(`/designed-tshirts/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
  }

  async saveDesignedTshirt(designedTshirtData, imageFile, adminUsername, token) {
    const formData = new FormData();
    formData.append('designedTshirt', JSON.stringify(designedTshirtData));
    formData.append('adminUsername', adminUsername);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const url = `${this.baseURL}/designed-tshirts`;
    const config = {
      method: 'POST',
      body: formData,
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `HTTP ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Save Designed T-shirt Error:', error);
      throw error;
    }
  }

  async updateDesignedTshirt(id, designedTshirtData, imageFile, token) {
    const formData = new FormData();
    formData.append('designedTshirt', JSON.stringify(designedTshirtData));
    
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const url = `${this.baseURL}/designed-tshirts/${id}`;
    const config = {
      method: 'PUT',
      body: formData,
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Update Designed T-shirt Error:', error);
      throw error;
    }
  }

  async deleteDesignedTshirt(id, token) {
    return this.request(`/designed-tshirts/${id}`, {
      method: 'DELETE',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
  }

  async getDesignedTshirtsByAdmin(adminUsername, token) {
    return this.request(`/designed-tshirts/admin/${encodeURIComponent(adminUsername)}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
  }

  async getDesignedTshirtsCount(token) {
    return this.request('/designed-tshirts/count', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
  }

  // Order endpoints
  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrders(token) {
    return this.request('/orders', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async getOrder(id, token) {
    return this.request(`/orders/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Utility methods
  async uploadFile(endpoint, formData, token) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Upload Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Error handling utility
  handleError(error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return 'Network error. Please check your connection.';
    }
    return error.message || 'An unexpected error occurred.';
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService; 