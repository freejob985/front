import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { debounce } from 'lodash';
import { SECURE_API_CONFIG } from './security';
import AuthErrorHandler, { AuthError } from '../services/authErrorHandler';
import vendorAuthService from '../services/vendorAuth';
import SettingsService from '../services/settingsService';

// Get settings service instance
const settingsService = SettingsService.getInstance();

// API Configuration with dynamic URL support
export const API_CONFIG = {
  get BASE_URL() {
    return SECURE_API_CONFIG.BASE_URL;
  },
  get API_URL() {
    return SECURE_API_CONFIG.API_URL;
  },
  get API_PREFIX() {
    return SECURE_API_CONFIG.API_PREFIX;
  },
  get ADMIN_URL() {
    return SECURE_API_CONFIG.ADMIN_URL;
  },
  get APP_URL() {
    return settingsService.getSiteUrl();
  },
  get APP_NAME() {
    return import.meta.env.VITE_APP_NAME || 'Engeb';
  }
};

// Function to get API endpoints with dynamic URL
const getApiEndpoints = () => {
  const apiUrl = SECURE_API_CONFIG.API_URL;
  
  return {
    ABOUT: {
      ALL: `${apiUrl}/about`,
      HERO: `${apiUrl}/about/hero`,
      STORY: `${apiUrl}/about/story`,
      VALUES: `${apiUrl}/about/values`,
      STATISTICS: `${apiUrl}/about/statistics`,
      TEAM: `${apiUrl}/about/team`,
      MISSION: `${apiUrl}/about/mission`,
      SECTION: (section: string) => `${apiUrl}/about/section/${section}`
    },
    SLIDERS: {
      ALL: `${apiUrl}/sliders`,
      DETAIL: (id: string) => `${apiUrl}/sliders/${id}`
    },
    PRODUCTS: {
      FEATURED: `${apiUrl}/products/featured`,
      FRESH: `${apiUrl}/products/fresh`,
      OFFERS: `${apiUrl}/products/offers`,
      DETAIL: (id: string) => `${apiUrl}/products/${id}`
    },
    OFFERS: {
      ALL: `${apiUrl}/offers`,
      FEATURED: `${apiUrl}/offers/featured`,
      FLASH_SALE: `${apiUrl}/offers/flash-sale`,
      SEARCH: `${apiUrl}/offers/search`,
      DETAIL: (id: string) => `${apiUrl}/offers/${id}`,
      BY_CATEGORY: (categoryId: string) => `${apiUrl}/offers/category/${categoryId}`
    },
    OFFER_CATEGORIES: {
      ALL: `${apiUrl}/offer-categories`,
      DETAIL: (id: string) => `${apiUrl}/offer-categories/${id}`,
      OFFERS: (id: string) => `${apiUrl}/offer-categories/${id}/offers`
    },
    CATEGORIES: {
      ALL: `${apiUrl}/categories`,
      DETAIL: (id: string) => `${apiUrl}/categories/${id}`,
      PRODUCTS: (id: string) => `${apiUrl}/categories/${id}/products`
    },
    CART: {
      ALL: `${apiUrl}/cart`,
      COUNT: `${apiUrl}/cart/count`,
      ADD: `${apiUrl}/cart`,
      UPDATE: (productId: string) => `${apiUrl}/cart/${productId}`,
      REMOVE: (productId: string) => `${apiUrl}/cart/${productId}`,
      CLEAR: `${apiUrl}/cart`
    },
    STATIC_PAGES: {
      ALL: `${apiUrl}/static-pages`,
      DETAIL: (slug: string) => `${apiUrl}/static-pages/${slug}`,
      FIXED: `${apiUrl}/static-pages/fixed`,
      EDITABLE: `${apiUrl}/static-pages/editable`,
      TERMS: `${apiUrl}/terms`,
      PRIVACY: `${apiUrl}/privacy`,
      REFUND: `${apiUrl}/refund`
    },
    SETTINGS: {
      GENERAL: `${apiUrl}/settings/general`,
      ALL: `${apiUrl}/settings`
    },
    CONTACT_METHODS: {
      ALL: `${apiUrl}/contact-methods`
    },
    VENDOR: {
      AUTH: {
        LOGIN: `${apiUrl}/vendor/auth/login`,
        REGISTER: `${apiUrl}/vendor/auth/register`,
        LOGOUT: `${apiUrl}/vendor/auth/logout`,
        ME: `${apiUrl}/vendor/auth/me`,
        REFRESH: `${apiUrl}/vendor/auth/refresh`
      },
      DASHBOARD: {
        STATS: `${apiUrl}/vendor/dashboard/stats`,
        ORDERS: `${apiUrl}/vendor/dashboard/orders`,
        PRODUCTS: `${apiUrl}/vendor/dashboard/products`,
        NOTIFICATIONS: `${apiUrl}/vendor/dashboard/notifications`
      }
    }
  };
};

// API Endpoints with dynamic URL support
export const API_ENDPOINTS = getApiEndpoints();

// Frontend Routes
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CATEGORIES: '/categories',
  OFFERS: '/offers',
  CONTACT: '/contact',
  CART: '/cart',
  CHECKOUT: '/checkout',
  PROFILE: '/profile',
  ORDERS: '/orders',
  WISHLIST: '/wishlist',
  VENDOR: {
    SIGNUP: '/vendor/signup',
    LOGIN: '/vendor/login',
    DASHBOARD: '/vendor/dashboard'
  },
  STATIC_PAGES: {
    TERMS: '/terms',
    PRIVACY: '/privacy',
    REFUND: '/refund'
  }
};

// Utility functions
export const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) {
    return '/placeholder.svg'; // Default placeholder image
  }
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Get the current base URL dynamically
  const baseUrl = SECURE_API_CONFIG.BASE_URL;
  
  // If it's a storage path, prepend the base URL
  if (imagePath.startsWith('storage/') || imagePath.startsWith('about-pages/') || imagePath.startsWith('logos/') || imagePath.startsWith('categories/') || imagePath.startsWith('products/') || imagePath.startsWith('reviews/') || imagePath.startsWith('settings/')) {
    return `${baseUrl}/storage/${imagePath}`;
  }
  
  // If it starts with a slash, it's already a relative path
  if (imagePath.startsWith('/')) {
    return `${baseUrl}${imagePath}`;
  }
  
  // For other paths, assume they're relative to the base URL
  return `${baseUrl}/${imagePath}`;
};

// Helper function to get product image URL
export const getProductImageUrl = (product: any): string => {
  const imagePath = product?.image_url || product?.image || product?.featured_image;
  return getImageUrl(imagePath);
};

// Helper function to get category image URL
export const getCategoryImageUrl = (category: any): string => {
  if (!category) {
    return 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop';
  }
  
  const imagePath = category?.image_url || category?.image || category?.banner_image;
  
  if (!imagePath) {
    // Return default category image based on category slug or name
    const categorySlug = category?.slug || category?.name_ar || category?.name_en || 'default';
    return getDefaultCategoryImage(categorySlug);
  }
  
  return getImageUrl(imagePath);
};

// Default category images
const getDefaultCategoryImage = (categorySlug: string) => {
  const defaultImages: { [key: string]: string } = {
    'fruits': 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=300&fit=crop',
    'vegetables': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
    'meat': 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop',
    'dairy': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop',
    'beverages': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop',
    'snacks': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    'bakery': 'https://images.unsplash.com/photo-1509440159596-1049088772a0?w=400&h=300&fit=crop',
    'frozen': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    'canned': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
    'spices': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop',
    'default': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'
  };
  
  return defaultImages[categorySlug.toLowerCase()] || defaultImages['default'];
};

class ApiService {
  private static instance: ApiService;
  private axiosInstance: AxiosInstance;
  private retryCount: Map<string, number> = new Map();

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_CONFIG.API_URL,
      timeout: 10000, // 10 seconds timeout
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    this.setupInterceptors();
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const authService = vendorAuthService;
        const token = authService.getToken();
        
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        const requestKey = `${originalRequest.method}-${originalRequest.url}`;
        const currentRetryCount = this.retryCount.get(requestKey) || 0;

        if (AuthErrorHandler.isAuthError(error) && currentRetryCount < 3) {
          this.retryCount.set(requestKey, currentRetryCount + 1);

          try {
            const authService = vendorAuthService;
            const refreshed = await authService.refreshToken();

            if (refreshed) {
              const token = authService.getToken();
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              return this.axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            console.error('Token refresh failed during request retry:', refreshError);
          }
        }

        this.retryCount.delete(requestKey);
        return Promise.reject(error);
      }
    );
  }

  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance(config);
      return response.data;
    } catch (error) {
      if (AuthErrorHandler.isAuthError(error)) {
        await AuthErrorHandler.handleAuthError(error as AuthError);
      }
      throw error;
    }
  }

  // Auth methods
  public async login(data: any): Promise<any> {
    return this.request({
      method: 'POST',
      url: '/auth/login',
      data
    });
  }

  public async logout(): Promise<any> {
    return this.request({
      method: 'POST',
      url: '/auth/logout'
    });
  }

  public async refreshToken(): Promise<any> {
    return this.request({
      method: 'POST',
      url: '/auth/refresh'
    });
  }

  public async validateToken(): Promise<any> {
    return this.request({
      method: 'GET',
      url: '/auth/validate'
    });
  }

  private debouncedGetVendorInfo = debounce(
    async () => {
      return this.request({
        method: 'GET',
        url: '/vendor/auth/me'
      });
    },
    1000,
    { leading: true, trailing: true }
  );

  public async getVendorInfo(): Promise<any> {
    return this.debouncedGetVendorInfo();
  }

  // Dashboard methods
  private debouncedGetDashboardStats = debounce(
    async () => {
      return this.request({
        method: 'GET',
        url: '/vendor/dashboard/stats'
      });
    },
    1000,
    { leading: true, trailing: true }
  );

  public async getDashboardStats(): Promise<any> {
    return this.debouncedGetDashboardStats();
  }

  private debouncedGetDashboardOrders = debounce(
    async () => {
      return this.request({
        method: 'GET',
        url: '/vendor/dashboard/orders'
      });
    },
    1000,
    { leading: true, trailing: true }
  );

  public async getDashboardOrders(): Promise<any> {
    return this.debouncedGetDashboardOrders();
  }

  private debouncedGetDashboardProducts = debounce(
    async () => {
      return this.request({
        method: 'GET',
        url: '/vendor/dashboard/products'
      });
    },
    1000,
    { leading: true, trailing: true }
  );

  public async getDashboardProducts(): Promise<any> {
    return this.debouncedGetDashboardProducts();
  }

  private debouncedGetDashboardNotifications = debounce(
    async () => {
      return this.request({
        method: 'GET',
        url: '/vendor/dashboard/notifications'
      });
    },
    1000,
    { leading: true, trailing: true }
  );

  public async getDashboardNotifications(): Promise<any> {
    return this.debouncedGetDashboardNotifications();
  }

  // Profile methods
  public async updateProfile(data: any): Promise<any> {
    return this.request({
      method: 'POST',
      url: '/vendor/profile',
      data
    });
  }

  public async updatePassword(data: any): Promise<any> {
    return this.request({
      method: 'POST',
      url: '/vendor/auth/change-password',
      data
    });
  }

  public async updateSettings(data: any): Promise<any> {
    return this.request({
      method: 'POST',
      url: '/vendor/settings',
      data
    });
  }

  // Products methods
  public async getProducts(params?: any): Promise<any> {
    return this.request({
      method: 'GET',
      url: '/products',
      params
    });
  }

  public async getProductCategories(): Promise<any> {
    return this.request({
      method: 'GET',
      url: '/categories'
    });
  }

  // Offers methods
  public async getOffers(params?: any): Promise<any> {
    return this.request({
      method: 'GET',
      url: '/offers',
      params
    });
  }

  public async getFeaturedOffers(): Promise<any> {
    return this.request({
      method: 'GET',
      url: '/offers/featured'
    });
  }

  public async getFlashSaleOffers(): Promise<any> {
    return this.request({
      method: 'GET',
      url: '/offers/flash-sale'
    });
  }

  public async searchOffers(query: string): Promise<any> {
    return this.request({
      method: 'GET',
      url: '/offers/search',
      params: { q: query }
    });
  }

  public async getOfferDetails(offerId: string): Promise<any> {
    return this.request({
      method: 'GET',
      url: `/offers/${offerId}`
    });
  }

  public async getOffersByCategory(categoryId: string): Promise<any> {
    return this.request({
      method: 'GET',
      url: `/offers/category/${categoryId}`
    });
  }

  // Offer Categories methods
  public async getOfferCategories(): Promise<any> {
    return this.request({
      method: 'GET',
      url: '/offer-categories'
    });
  }

  public async getOfferCategoryDetails(categoryId: string): Promise<any> {
    return this.request({
      method: 'GET',
      url: `/offer-categories/${categoryId}`
    });
  }

  public async getOfferCategoryOffers(categoryId: string): Promise<any> {
    return this.request({
      method: 'GET',
      url: `/offer-categories/${categoryId}/offers`
    });
  }

  // Orders methods
  public async getOrders(params?: any): Promise<any> {
    return this.request({
      method: 'GET',
      url: '/orders',
      params
    });
  }

  public async getOrderDetails(orderId: string): Promise<any> {
    return this.request({
      method: 'GET',
      url: `/orders/${orderId}`
    });
  }

  public async updateOrderStatus(orderId: string, status: string): Promise<any> {
    return this.request({
      method: 'POST',
      url: `/orders/${orderId}/status`,
      data: { status }
    });
  }

  // Settings methods
  public async getSettings(): Promise<any> {
    return this.request({
      method: 'GET',
      url: '/settings'
    });
  }

  public async updateBusinessHours(data: any): Promise<any> {
    return this.request({
      method: 'POST',
      url: '/vendor/business-hours',
      data
    });
  }

  public async updateDeliveryAreas(data: any): Promise<any> {
    return this.request({
      method: 'POST',
      url: '/vendor/delivery-areas',
      data
    });
  }

  public async addToCart(data: any): Promise<any> {
    return this.request({
      method: 'POST',
      url: '/cart',
      data
    });
  }

  // Contact Methods
  public async getContactMethods(): Promise<any> {
    return this.request({
      method: 'GET',
      url: '/contact-methods'
    });
  }
}

export const apiService = ApiService.getInstance();
export default API_CONFIG;