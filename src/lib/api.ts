export type Vendor = { id: number; name: string };
export type Product = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  original_price?: number | null;
  stock: number;
  sku: string;
  image?: string | null;
  images?: string[] | null;
  image_url?: string | null;
  images_urls?: string[] | null;
  category: string;
  subcategory?: string | null;
  brand?: string | null;
  rating?: number;
  reviews_count?: number;
  sales_count?: number;
  vendor?: Vendor | null;
  is_fresh?: boolean;
  is_featured?: boolean;
};

export type Paginated<T> = { data: T[]; meta: { total: number; per_page: number; current_page: number; last_page: number } };

import { SECURE_API_CONFIG, SECURITY_CONFIG } from '../config/security';
import ErrorHandler from '../utils/errorHandler';

/**
 * Determine API base URL based on environment variables
 * 
 * Connection type is controlled by VITE_API_MODE variable:
 * - 'proxy': use local proxy to avoid CORS issues (default for development)
 * - 'direct': direct API connection (for production and testing)
 * 
 * This function now uses SECURE_API_CONFIG which properly handles all environment variables
 * 
 * @returns {string} API base URL
 */
const getApiBase = () => {
  // Use SECURE_API_CONFIG which properly handles environment variables
  const apiUrl = SECURE_API_CONFIG.API_URL;
  
  console.log('🔍 lib/api.ts - Using API URL from SECURE_API_CONFIG:', apiUrl);
  
  return apiUrl;
};

const API_BASE = getApiBase();
console.log('🔍 lib/api.ts - Final API_BASE:', API_BASE);

async function fetchJson<T>(path: string, init?: RequestInit, retryCount = 0): Promise<T> {
  const maxRetries = 3;

  const headers = new Headers(init?.headers || undefined);

  // Set security headers
  Object.entries(SECURE_API_CONFIG.SECURITY_HEADERS).forEach(([key, value]) => {
    headers.set(key, value);
  });

  // Set default headers only if body is not FormData
  // FormData requires the browser to set Content-Type automatically with boundary
  const isFormData = init?.body instanceof FormData;
  
  if (!isFormData) {
    Object.entries(SECURE_API_CONFIG.DEFAULT_HEADERS).forEach(([key, value]) => {
      if (!headers.has(key)) {
        headers.set(key, value);
      }
    });
  }

  // Add vendor token if available
  const vendorToken = localStorage.getItem('vendor_auth_token');
  if (vendorToken && path.includes('/vendor/')) {
    headers.set('Authorization', `Bearer ${vendorToken}`);
  }

  // Add session token if available
  const sessionToken = localStorage.getItem('session_token');
  if (sessionToken) {
    headers.set('X-Session-Token', sessionToken);
  }

  // If sending FormData, remove Content-Type header to let browser set it with boundary
  if (isFormData && headers.has('Content-Type')) {
    headers.delete('Content-Type');
    console.log('🔧 Removed Content-Type header for FormData request');
  }

  // Ensure path starts with / if it doesn't already
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const fullUrl = `${API_BASE}${normalizedPath}`;

  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, SECURE_API_CONFIG.TIMEOUT);

  try {
    // For development, we might need to handle CORS differently
    const fetchOptions: RequestInit = {
      credentials: SECURITY_CONFIG.CORS_CREDENTIALS as RequestCredentials,
      mode: SECURITY_CONFIG.CORS_MODE,
      signal: controller.signal,
      ...init,
      headers,
    };

    // Log request details for debugging
    if (isFormData) {
      console.log('📤 Sending FormData request to:', fullUrl);
      console.log('📋 Headers:', Array.from(headers.entries()));
    }

    const res = await fetch(fullUrl, fetchOptions);

    clearTimeout(timeoutId);

    if (!res.ok) {
      let errorMessage = `Request failed: ${res.status} ${res.statusText}`;
      let validationErrors: any = null;
      
      try {
        const errorText = await res.text();

        // محاولة تحليل JSON للخطأ
        try {
          const errorData = JSON.parse(errorText);
          
          // معالجة خطأ التحقق من الصحة (422)
          if (res.status === 422) {
            errorMessage = errorData.message || 'فشل التحقق من صحة البيانات';
            
            // استخراج رسائل التحقق من الصحة
            if (errorData.errors) {
              validationErrors = errorData.errors;
              
              // تكوين رسالة خطأ شاملة من جميع أخطاء التحقق
              const errorMessages = Object.entries(validationErrors)
                .map(([field, messages]: [string, any]) => {
                  if (Array.isArray(messages)) {
                    return `${field}: ${messages.join(', ')}`;
                  }
                  return `${field}: ${messages}`;
                })
                .join('\n');
              
              if (errorMessages) {
                errorMessage = `${errorMessage}\n\n${errorMessages}`;
              }
            }
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (parseError) {
          // إذا فشل تحليل JSON، استخدم النص كما هو
          if (errorText) {
            errorMessage = errorText;
          }
        }
      } catch (textError) {
        console.error('Error reading response text:', textError);
      }

      const error = new Error(errorMessage);
      (error as any).status = res.status;
      (error as any).statusText = res.statusText;
      (error as any).validationErrors = validationErrors;
      throw error;
    }

    // التحقق من نوع المحتوى قبل محاولة تحليل JSON
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.warn('Response is not JSON, content-type:', contentType);
      const textData = await res.text();
      console.warn('Response text:', textData);
      
      // تجاهل رسائل React DevTools
      if (textData.includes('react-devtools-bridge')) {
        console.warn('Ignoring React DevTools message');
        return { success: false, message: 'React DevTools message ignored' } as T;
      }
      
      // محاولة تحليل JSON حتى لو لم يكن Content-Type صحيح
      try {
        const jsonData = JSON.parse(textData);
        return jsonData;
      } catch (parseError) {
        throw new Error(`Server returned non-JSON response. Content-Type: ${contentType}, Response: ${textData.substring(0, 200)}...`);
      }
    }

    try {
      const jsonData = await res.json();
      return jsonData;
    } catch (jsonError) {
      console.error('Failed to parse JSON response:', jsonError);
      const textData = await res.text();
      console.error('Response text:', textData);
      
      // محاولة إعادة تحليل JSON
      try {
        const jsonData = JSON.parse(textData);
        return jsonData;
      } catch (retryParseError) {
        throw new Error(`Invalid JSON response from server. Response: ${textData.substring(0, 200)}...`);
      }
    }
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${SECURE_API_CONFIG.TIMEOUT}ms`);
      }

      // Check if it's a network error
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Network error: Unable to connect to server');
      }
      
      if (error.message.includes('ERR_NETWORK_CHANGED')) {
        throw new Error('Network connection changed - please try again');
      }
      
      if (error.message.includes('ERR_INTERNET_DISCONNECTED')) {
        throw new Error('No internet connection - please check your network');
      }
      
      if (error.message.includes('ERR_CONNECTION_REFUSED')) {
        throw new Error('Server is not responding - please try again later');
      }
    }

    // إعادة المحاولة للأخطاء القابلة للإعادة
    if (retryCount < maxRetries && ErrorHandler.shouldRetry(error)) {
      const delay = ErrorHandler.getRetryDelay(retryCount);
      console.warn(`Retrying request (${retryCount + 1}/${maxRetries}) after ${delay}ms due to error:`, (error as Error).message);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchJson<T>(path, init, retryCount + 1);
    }

    // تسجيل الخطأ
    ErrorHandler.logError(error, `API Request to ${path}`);

    // إعادة رمي الخطأ مع معالجة أفضل
    const apiError = ErrorHandler.handleApiError(error);
    const enhancedError = new Error(apiError.message);
    (enhancedError as any).status = apiError.status;
    (enhancedError as any).statusText = apiError.statusText;
    (enhancedError as any).data = apiError.data;
    throw enhancedError;
  }
}

export type CartItem = {
  id: number;
  name: string;
  price: number;
  original_price?: number | null;
  image?: string | null;
  vendor?: Vendor | null;
  quantity: number;
  stock: number;
  is_fresh?: boolean;
};

export type CartTotals = {
  subtotal: number;
  savings: number;
  delivery_fee: number;
  tax: number;
  coupon_discount?: number;
  total: number;
  currency: string;
  count: number;
};

export const api = {
  // Generic HTTP methods
  get: <T>(path: string) => fetchJson<T>(path),
  post: <T>(path: string, data?: any) => fetchJson<T>(path, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  }),
  put: <T>(path: string, data?: any) => fetchJson<T>(path, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  }),
  delete: <T>(path: string) => fetchJson<T>(path, {
    method: 'DELETE',
  }),

  sliders: () => fetchJson<{ success: boolean; data: Array<{ id: number; title: string; subtitle: string; description: string; button_text: string; button_url: string; gradient_color: string; background_image: string; badge: string }> }>(`/sliders`),
  categories: () => fetchJson<{ success: boolean; data: { name_ar: string; slug: string; image_url?: string; subcategories_count: number; products_count: number }[] }>(`/categories`),
  mainCategories: () => fetchJson<{ success: boolean; data: { id: number; name_ar: string; name_en: string; slug: string; image_url?: string; subcategories_count: number; products_count: number }[] }>(`/categories/main`),
  supermarketCategories: () => fetchJson<{ success: boolean; data: { id: number; name_ar: string; name_en: string; slug: string; image_url?: string; subcategories_count: number; products_count: number }[] }>(`/categories/supermarket`),
  brands: () => fetchJson<{ success: boolean; data: { id: number; name: string; name_ar: string; description?: string; logo_url?: string; products_count: number }[] }>(`/brands`),
  vendors: (params?: { search?: string; sort_by?: string; category?: string; page?: number; per_page?: number }) => {
    const sp = new URLSearchParams();
    if (params?.search) sp.set("search", params.search);
    if (params?.sort_by) sp.set("sort_by", params.sort_by);
    if (params?.category) sp.set("category", params.category);
    if (params?.page) sp.set("page", String(params.page));
    if (params?.per_page) sp.set("per_page", String(params.per_page));
    const qs = sp.toString();
    return fetchJson<{
      success: boolean;
      data: { id: number; name: string; name_ar: string; description?: string; logo?: string; cover_image?: string; rating: number; products_count: number; orders_count: number; is_featured: boolean; is_fresh: boolean; category: string; city: string; governorate: string; phone?: string; email?: string; address?: string }[];
      meta: { total: number; per_page: number; current_page: number; last_page: number }
    }>(`/vendors${qs ? `?${qs}` : ""}`);
  },
  getVendor: (id: string | number) => fetchJson<{ success: boolean; data: { id: number; name: string; name_ar: string; description?: string; logo?: string; cover_image?: string; rating: number; products_count: number; orders_count: number; is_featured: boolean; is_fresh: boolean; category: string; city: string; governorate: string; phone?: string; email?: string; address?: string } }>(`/vendors/${id}`),
  vendorProducts: (id: string | number, params?: { search?: string; sort_by?: string; category_id?: string; page?: number }) => {
    const sp = new URLSearchParams();
    if (params?.search) sp.set("search", params.search);
    if (params?.sort_by) sp.set("sort_by", params.sort_by);
    if (params?.category_id) sp.set("category_id", params.category_id);
    if (params?.page) sp.set("page", String(params.page));
    const qs = sp.toString();
    return fetchJson<{ success: boolean; vendor: any; products: Paginated<Product>; filters: any }>(`/vendors/${id}/products${qs ? `?${qs}` : ""}`);
  },
  featuredVendors: () => fetchJson<{ success: boolean; data: { id: number; name: string; name_ar: string; description?: string; logo?: string; rating: number; products_count: number; is_featured: boolean; is_fresh: boolean; category: string; city: string; governorate: string }[] }>(`/vendors/featured`),
  subcategories: (categoryId?: number) => {
    const url = categoryId ? `/subcategories?category_id=${categoryId}` : '/subcategories';
    return fetchJson<{ name: string; slug: string; products_count: number }[]>(url);
  },
  governorates: () => fetchJson<{ success: boolean; data: { id: number; name_ar: string; name_en: string; code: string; is_active: boolean; sort_order: number }[] }>(`/governorates`),
  cities: (governorateId?: number) => {
    const url = governorateId ? `/cities?governorate_id=${governorateId}` : '/cities';
    return fetchJson<{ success: boolean; data: { id: number; name_ar: string; name_en: string; code: string; is_active: boolean; sort_order: number; governorate_id: number }[] }>(url);
  },
  categoryProducts: (slug: string, params?: { sort?: string; page?: number; per_page?: number }) => {
    const sp = new URLSearchParams();
    if (params?.sort) sp.set("sort", params.sort);
    if (params?.page) sp.set("page", String(params.page));
    if (params?.per_page) sp.set("per_page", String(params.per_page));
    const qs = sp.toString();
    return fetchJson<{ category: { slug: string; name: string }; data: Product[]; meta: Paginated<Product>["meta"] }>(`/categories/${slug}/products${qs ? `?${qs}` : ""}`);
  },
  featured: () => fetchJson<Product[]>(`/products/featured`),
  fresh: (page = 1) => fetchJson<Paginated<Product>>(`/products/fresh?page=${page}`),
  offers: (page = 1) => fetchJson<Paginated<Product>>(`/products/offers?page=${page}`),
  product: (id: string | number) => fetchJson<{ product: Product; related: Product[]; similar: Product[] }>(`/products/${id}`),
  search: (params: {
    q?: string;
    category?: string;
    subcategory?: string;
    brand?: string | number;
    product_id?: string | number;
    sort?: string;
    page?: number;
    per_page?: number;
    min_price?: number;
    max_price?: number;
    rating?: number;
    available?: boolean;
  }) => {
    const sp = new URLSearchParams();
    if (params.q) sp.set("q", params.q);
    if (params.category) sp.set("category", params.category);
    if (params.subcategory) sp.set("subcategory", params.subcategory);
    if (params.brand !== undefined) sp.set("brand", String(params.brand));
    if (params.product_id !== undefined) sp.set("product_id", String(params.product_id));
    if (params.sort) sp.set("sort", params.sort);
    if (params.page) sp.set("page", String(params.page));
    if (params.per_page) sp.set("per_page", String(params.per_page));
    if (params.min_price !== undefined) sp.set("min_price", String(params.min_price));
    if (params.max_price !== undefined) sp.set("max_price", String(params.max_price));
    if (params.rating !== undefined) sp.set("rating", String(params.rating));
    if (params.available !== undefined) sp.set("available", String(params.available));
    return fetchJson<Paginated<Product>>(`/search?${sp.toString()}`);
  },
  searchAutocomplete: (query: string, limit = 4) => {
    const sp = new URLSearchParams();
    sp.set("q", query);
    sp.set("limit", String(limit));
    return fetchJson<{ results: Array<{ id: number; name: string; type: string; image?: string; price?: string; category?: string; brand?: string; url: string }>; total: number }>(`/search/autocomplete?${sp.toString()}`);
  },
  cart: {
    get: () => fetchJson<{ items: CartItem[]; totals: CartTotals }>(`/cart`, {
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      }
    }),
    count: () => fetchJson<{ count: number }>(`/cart/count`, {
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      }
    }),
    add: (product_id: number, quantity = 1, notes?: string, type: string = 'product') => {
      const payload: any = { product_id, quantity };
      if (notes) payload.notes = notes;
      if (type) payload.type = type;
      
      console.log('🛒 Adding to cart:', payload); // للتشخيص
      
      return fetchJson<{ success: boolean; items: CartItem[]; totals: CartTotals }>(`/cart`, {
        method: "POST",
        body: JSON.stringify(payload),
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }
      });
    },
    update: (product_id: number, quantity: number) =>
      fetchJson<{ success: boolean; items: CartItem[]; totals: CartTotals }>(`/cart/${product_id}`, {
        method: "PUT",
        body: JSON.stringify({ quantity }),
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }
      }),
    remove: (product_id: number) =>
      fetchJson<{ success: boolean; items: CartItem[]; totals: CartTotals }>(`/cart/${product_id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }
      }),
    clear: () => fetchJson<{ success: boolean; items: CartItem[]; totals: CartTotals }>(`/cart`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      }
    }),
    applyCoupon: (code: string) => fetchJson<{ success: boolean; message: string; coupon?: any; calculation?: any }>(`/cart/coupon/apply`, {
      method: "POST",
      body: JSON.stringify({ code }),
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      }
    }),
    removeCoupon: () => fetchJson<{ success: boolean; message: string }>(`/cart/coupon/remove`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      }
    }),
  },
  checkout: (payload: {
    name: string;
    email: string;
    phone: string;
    delivery_address: string;
    delivery_city: string;
    delivery_governorate: string;
    delivery_notes?: string;
    delivery_type: "immediate" | "fast" | "scheduled" | "free";
    requested_delivery_at?: string;
    payment_method: "cash" | "card" | "knet" | "wallet";
    notes?: string;
  }) => fetchJson<{ success: boolean; orders?: { id: number; order_number: string; vendor_id: number; total: number }[]; message?: string }>(`/checkout`, {
    method: "POST",
    body: JSON.stringify(payload),
    credentials: "include",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    }
  }),
  wishlist: {
    list: () => fetchJson<{ ids: number[]; items: Pick<Product, "id" | "name" | "image" | "original_price" | "price" | "vendor">[] }>(`/wishlist`, {
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      }
    }),
    add: (product_id: number) => fetchJson(`/wishlist`, {
      method: "POST",
      body: JSON.stringify({ product_id }),
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      }
    }),
    remove: (product_id: number) => fetchJson(`/wishlist/${product_id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      }
    }),
  },
  orders: {
    recent: () => fetchJson<{ success: boolean; orders: { id: number; order_number: string; status: string; status_label: string; total: number; created_at?: string; items_count?: number }[] }>(`/orders/recent`, {
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      }
    }),
    getById: (id: number) => fetchJson<{
      success: boolean; order: {
        id: number;
        order_number: string;
        status: string;
        status_label: string;
        total: number;
        subtotal?: number;
        created_at?: string;
        items_count?: number;
        items?: Array<{
          name: string;
          price: number;
          quantity: number;
          total: number;
          image?: string;
        }>;
        delivery_address?: {
          title: string;
          address: string;
          city: string;
          governorate: string;
        };
        delivery_notes?: string;
        payment_method: string;
      }
    }>(`/orders/${id}/details`, {
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      }
    }),
  },
  auth: {
    me: () => {
      return fetchJson<{ user: any }>(`/auth/me`, {
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }
      });
    },
    register: (payload: { name: string; email: string; password: string; phone?: string }) => fetchJson(`/auth/register`, {
      method: "POST",
      body: JSON.stringify(payload),
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      }
    }),
    login: (payload: { email: string; password: string }) => {
      return fetchJson(`/auth/login`, {
        method: "POST",
        body: JSON.stringify(payload),
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }
      });
    },
    logout: () => fetchJson(`/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      }
    }),
    updateProfile: (payload: { name?: string; family_name?: string; email?: string; phone?: string; birth_date?: string }) => fetchJson(`/auth/profile`, {
      method: "PUT",
      body: JSON.stringify(payload),
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      }
    }),
    changePassword: (payload: { current_password: string; password: string; password_confirmation: string }) => fetchJson(`/auth/change-password`, {
      method: "POST",
      body: JSON.stringify(payload),
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      }
    }),
  },
  addresses: {
    list: () => fetchJson<{ data: any[] }>(`/addresses`, {
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      }
    }),
    create: (payload: any) => fetchJson(`/addresses`, {
      method: "POST",
      body: JSON.stringify(payload),
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      }
    }),
    update: (id: number, payload: any) => fetchJson(`/addresses/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      }
    }),
    remove: (id: number) => fetchJson(`/addresses/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      }
    }),
    setDefault: (id: number) => fetchJson(`/addresses/${id}/default`, {
      method: "POST",
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      }
    }),
  },
  notificationSettings: {
    get: () => fetchJson<{
      success: boolean; settings: {
        email_notifications: boolean;
        sms_notifications: boolean;
        order_updates: boolean;
        promotions: boolean;
        newsletter: boolean;
      }
    }>(`/notification-settings`, {
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      }
    }),
    update: (settings: {
      email_notifications: boolean;
      sms_notifications: boolean;
      order_updates: boolean;
      promotions: boolean;
      newsletter: boolean;
    }) => fetchJson<{ success: boolean; message: string; settings: any }>(`/notification-settings`, {
      method: "PUT",
      body: JSON.stringify(settings),
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      }
    }),
    preferences: () => fetchJson<{ success: boolean; preferences: any }>(`/notification-preferences`, {
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      }
    }),
  },
  faqs: {
    list: (category?: string) => {
      const url = category ? `/faqs?category=${category}` : '/faqs';
      return fetchJson<{ success: boolean; data: Array<{ id: number; question_ar: string; answer_ar: string; category: string; sort_order: number }> }>(url);
    },
    categories: () => fetchJson<{ success: boolean; data: string[] }>(`/faqs/categories`),
    get: (id: number) => fetchJson<{ success: boolean; data: { id: number; question_ar: string; answer_ar: string; category: string; sort_order: number } }>(`/faqs/${id}`),
  },
  about: {
    all: () => fetchJson<{ success: boolean; data: any }>(`/about`),
    hero: () => fetchJson<{ success: boolean; data: any }>(`/about/hero`),
    story: () => fetchJson<{ success: boolean; data: any }>(`/about/story`),
    values: () => fetchJson<{ success: boolean; data: any }>(`/about/values`),
    statistics: () => fetchJson<{ success: boolean; data: any }>(`/about/statistics`),
    team: () => fetchJson<{ success: boolean; data: any }>(`/about/team`),
    mission: () => fetchJson<{ success: boolean; data: any }>(`/about/mission`),
  },
  settings: {
    general: () => fetchJson<{
      success: boolean;
      data: {
        site_name: string;
        site_logo: string;
        site_logo_url?: string;
        contact_phone: string;
        contact_email: string;
        contact_address: string;
        facebook_url?: string;
        twitter_url?: string;
        instagram_url?: string;
        linkedin_url?: string;
      }
    }>(`/settings/general`),
    design: () => fetchJson<{
      success: boolean;
      data: {
        primary_color: string;
        secondary_color: string;
        accent_color: string;
        custom_css: string;
        theme_mode: string;
        font_family: string;
        site_footer_logo?: string;
        site_footer_logo_url?: string;
      }
    }>(`/settings/design`),
    payment: () => fetchJson<{
      success: boolean;
      data: {
        payment_methods: string[];
        knet_enabled: boolean;
        stripe_enabled: boolean;
        delivery_fee: number;
        free_delivery_threshold: number;
      }
    }>(`/settings/payment`),
    email: () => fetchJson<{
      success: boolean;
      data: {
        mail_driver: string;
        mail_host: string;
        mail_port: number;
        mail_username: string;
        mail_encryption: string;
        mail_from_address: string;
        mail_from_name: string;
      }
    }>(`/settings/email`),
    seo: () => fetchJson<{
      success: boolean;
      data: {
        meta_title: string;
        meta_description: string;
        meta_keywords: string;
        og_title: string;
        og_description: string;
        og_image: string;
        google_analytics_id: string;
        google_tag_manager_id: string;
        facebook_pixel_id: string;
      }
    }>(`/settings/seo`),
    developer: () => fetchJson<{
      success: boolean;
      data: {
        maintenance_mode: boolean;
        maintenance_message: string;
        debug_mode: boolean;
        api_rate_limit: number;
        cache_duration: number;
        log_level: string;
      }
    }>(`/settings/developer`),
    all: () => fetchJson<{
      success: boolean;
      data: {
        general: any;
        email: any;
        payment: any;
        seo: any;
        design: any;
        developer: any;
      }
    }>(`/settings`),
  },
  supportChannels: {
    list: () => fetchJson<{
      success: boolean; data: Array<{
        id: number;
        title_ar: string;
        title_en?: string;
        description_ar: string;
        description_en?: string;
        contact_info: string;
        availability: string;
        icon?: string;
        color: string;
        sort_order: number;
        is_active: boolean
      }>
    }>(`/support-channels`),
    get: (id: number) => fetchJson<{
      success: boolean; data: {
        id: number;
        title_ar: string;
        title_en?: string;
        description_ar: string;
        description_en?: string;
        contact_info: string;
        availability: string;
        icon?: string;
        color: string;
        sort_order: number;
        is_active: boolean
      }
    }>(`/support-channels/${id}`),
  },
  admin: {
    notifications: {
      recent: () => fetchJson<{
        success: boolean; data: Array<{
          id: number;
          title: string;
          message: string;
          type: string;
          unread: boolean;
          created_at: string;
        }>
      }>(`/admin/notifications/recent`),
      unreadCount: () => fetchJson<{ success: boolean; data: { count: number } }>(`/admin/notifications/unread-count`),
      stats: () => fetchJson<{ success: boolean; data: any }>(`/admin/notifications/stats`),
    },
  },
  vendor: {
    // Vendor authentication
    auth: {
      me: () => fetchJson<{ success: boolean; vendor: any }>(`/vendor/auth/me`, {
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }
      }),
      login: (payload: { email: string; password: string }) => fetchJson(`/vendor/auth/login`, {
        method: "POST",
        body: JSON.stringify(payload),
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }
      }),
      register: (payload: any) => fetchJson(`/vendor/auth/register`, {
        method: "POST",
        body: JSON.stringify(payload),
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }
      }),
      logout: () => fetchJson(`/vendor/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }
      }),
      updateProfile: (payload: any) => fetchJson(`/vendor/auth/profile`, {
        method: "PUT",
        body: JSON.stringify(payload),
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }
      }),
    },
    // Vendor dashboard statistics
    dashboard: {
      stats: () => fetchJson<{
        success: boolean; data: {
          total_sales: number;
          total_sales_change: number;
          new_orders: number;
          new_orders_change: number;
          active_products: number;
          active_products_change: number;
          new_customers: number;
          new_customers_change: number;
        }
      }>(`/vendor/dashboard/stats`, {
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }
      }),
      recentOrders: () => fetchJson<{
        success: boolean; data: Array<{
          id: number;
          order_number: string;
          customer_name: string;
          customer_phone: string;
          customer_address: string;
          total: number;
          status: string;
          status_label: string;
          items_count: number;
          created_at: string;
          items: Array<{
            name: string;
            quantity: number;
            price: number;
            image?: string;
          }>;
        }>
      }>(`/vendor/dashboard/recent-orders`, {
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }
      }),
      topProducts: () => fetchJson<{
        success: boolean; data: Array<{
          id: number;
          name: string;
          sales_count: number;
          revenue: number;
          rating: number;
          image?: string;
        }>
      }>(`/vendor/dashboard/top-products`, {
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }
      }),
      notifications: () => fetchJson<{
        success: boolean; data: Array<{
          id: number;
          title: string;
          message: string;
          type: string;
          unread: boolean;
          created_at: string;
          time_ago?: string;
          icon?: string;
          color?: string;
          data?: any;
        }>
      }>(`/vendor/dashboard/notifications`, {
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }
      }),
      markNotificationsRead: () => fetchJson(`/vendor/dashboard/notifications/mark-read`, {
        method: "POST",
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }
      }),
      unreadCount: () => fetchJson<{ success: boolean; count: number }>(`/vendor/dashboard/notifications/unread-count`, {
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }
      }),
    },
    // Vendor products
    products: {
      list: (params?: { search?: string; sort_by?: string; category_id?: string; page?: number; status?: string }) => {
        const sp = new URLSearchParams();
        if (params?.search) sp.set("search", params.search);
        if (params?.sort_by) sp.set("sort_by", params.sort_by);
        if (params?.category_id) sp.set("category_id", params.category_id);
        if (params?.page) sp.set("page", String(params.page));
        if (params?.status) sp.set("status", params.status);
        const qs = sp.toString();
        return fetchJson<{ success: boolean; products: Paginated<Product>; filters: any }>(`/vendor/products${qs ? `?${qs}` : ""}`, {
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          }
        });
      },
      getById: (id: number) => fetchJson<{ success: boolean; product: any }>(`/vendor/products/${id}`, {
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }
      }),
      create: (payload: any) => {
        // إذا كانت البيانات عبارة عن FormData (تحتوي على صور)، لا تحولها إلى JSON
        // وأرسلها مباشرة كـ multipart/form-data
        if (payload instanceof FormData) {
          console.log('🚀 Creating product with FormData');
          return fetchJson(`/vendor/products`, {
            method: "POST",
            body: payload,
            credentials: "include",
            // لا نحدد أي headers هنا - سيتم التعامل معها في fetchJson
            // المتصفح سيضبط Content-Type تلقائياً مع boundary للـ multipart/form-data
          });
        }
        // إذا كانت البيانات عادية (JSON)
        return fetchJson(`/vendor/products`, {
          method: "POST",
          body: JSON.stringify(payload),
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          }
        });
      },
      update: (id: number, payload: any) => fetchJson(`/vendor/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }
      }),
      delete: (id: number) => fetchJson(`/vendor/products/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }
      }),
    },
    // Vendor orders
    orders: {
      list: (params?: { search?: string; status?: string; date_from?: string; date_to?: string; page?: number }) => {
        const sp = new URLSearchParams();
        if (params?.search) sp.set("search", params.search);
        if (params?.status) sp.set("status", params.status);
        if (params?.date_from) sp.set("date_from", params.date_from);
        if (params?.date_to) sp.set("date_to", params.date_to);
        if (params?.page) sp.set("page", String(params.page));
        const qs = sp.toString();
        return fetchJson<{
          success: boolean; orders: Array<{
            id: number;
            order_number: string;
            customer_name: string;
            customer_phone: string;
            customer_address: string;
            total: number;
            status: string;
            status_label: string;
            items_count: number;
            created_at: string;
            items: Array<{
              name: string;
              quantity: number;
              price: number;
              image?: string;
            }>;
          }>; meta: any
        }>(`/vendor/orders${qs ? `?${qs}` : ""}`, {
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          }
        });
      },
      getById: (id: number) => fetchJson<{
        success: boolean; order: {
          id: number;
          order_number: string;
          customer_name: string;
          customer_phone: string;
          customer_address: string;
          total: number;
          status: string;
          status_label: string;
          items_count: number;
          created_at: string;
          items: Array<{
            name: string;
            quantity: number;
            price: number;
            image?: string;
          }>;
        }
      }>(`/vendor/orders/${id}`, {
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }
      }),
      updateStatus: (id: number, status: string) => fetchJson(`/vendor/orders/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }
      }),
    },
    // Vendor reports
    reports: {
      sales: (params?: { date_from?: string; date_to?: string; period?: string }) => {
        const sp = new URLSearchParams();
        if (params?.date_from) sp.set("date_from", params.date_from);
        if (params?.date_to) sp.set("date_to", params.date_to);
        if (params?.period) sp.set("period", params.period);
        const qs = sp.toString();
        return fetchJson<{ success: boolean; data: any }>(`/vendor/reports/sales${qs ? `?${qs}` : ""}`, {
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          }
        });
      },
      products: (params?: { date_from?: string; date_to?: string; category?: string }) => {
        const sp = new URLSearchParams();
        if (params?.date_from) sp.set("date_from", params.date_from);
        if (params?.date_to) sp.set("date_to", params.date_to);
        if (params?.category) sp.set("category", params.category);
        const qs = sp.toString();
        return fetchJson<{ success: boolean; data: any }>(`/vendor/reports/products${qs ? `?${qs}` : ""}`, {
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          }
        });
      },
      revenue: (params?: { date_from?: string; date_to?: string }) => {
        const sp = new URLSearchParams();
        if (params?.date_from) sp.set("date_from", params.date_from);
        if (params?.date_to) sp.set("date_to", params.date_to);
        const qs = sp.toString();
        return fetchJson<{ success: boolean; data: any }>(`/vendor/reports/revenue${qs ? `?${qs}` : ""}`, {
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          }
        });
      },
    },
    // Vendor settings
    settings: {
      get: () => fetchJson<{ success: boolean; data: any }>(`/vendor/settings`, {
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }
      }),
      update: (payload: any) => fetchJson(`/vendor/settings`, {
        method: "PUT",
        body: JSON.stringify(payload),
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }
      }),
    },
    
    // Contact Methods
    contactMethods: {
      list: () => fetchJson<{ success: boolean; data: any[] }>('/contact-methods', {
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }
      }),
    },
  },
};