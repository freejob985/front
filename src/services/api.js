// API Service for connecting with Laravel backend
// Import logger
import logger from '../lib/logger';
import SettingsService from './settingsService';
import { SECURE_API_CONFIG } from '../config/security';

// Initialize settings service
const settingsService = SettingsService.getInstance();

class ApiService {
    constructor() {
        // Initialize with SECURE_API_CONFIG which handles environment variables correctly
        this.baseURL = SECURE_API_CONFIG.API_URL;
        console.log('🌐 API URL initialized from SECURE_API_CONFIG:', this.baseURL);
    }

    // Get current API base URL
    getApiBaseUrl() {
        return this.baseURL;
    }

    // Generic request method
    async request(options = {}) {
        // Fix for object URL issue - ensure endpoint is properly formatted
        const endpoint = typeof options.url === 'string' ? options.url : '';
        const url = `${this.baseURL}${endpoint}`;
        
        logger.info('بدء طلب API', { url, method: options.method || 'GET' });
        
        // Get vendor token if available
        const vendorToken = localStorage.getItem('vendor_auth_token');
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...(vendorToken && { 'Authorization': `Bearer ${vendorToken}` }),
                ...options.headers
            },
            credentials: 'include', // For session-based auth
            ...options,
            url: undefined // Remove url from options to avoid duplication
        };

        try {
            const response = await fetch(url, config);
            logger.info('استجابة API', { url, status: response.status });
            
            let data;
            try {
                data = await response.json();
            } catch (jsonError) {
                logger.error('خطأ في تحليل JSON', { url, error: jsonError });
                throw new Error('استجابة غير صحيحة من الخادم');
            }
            
            if (!response.ok) {
                logger.error('خطأ في استجابة API', { url, status: response.status, data });
                
                // معالجة خاصة لأخطاء المصادقة
                if (response.status === 401) {
                    const errorMessage = data?.message || data?.error || 'غير مصرح بالوصول. يرجى تسجيل الدخول مرة أخرى.';
                    const authError = new Error(errorMessage);
                    authError.status = 401;
                    authError.isAuthError = true;
                    throw authError;
                }
                
                const errorMessage = data?.message || data?.error || `خطأ في الخادم: ${response.status}`;
                const apiError = new Error(errorMessage);
                apiError.status = response.status;
                throw apiError;
            }
            
            logger.info('نجح طلب API', { url, status: response.status });
            return data;
        } catch (error) {
            logger.error('خطأ في طلب API', { url, error: error.message });
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('لا يمكن الاتصال بالخادم. تحقق من اتصال الإنترنت.');
            }
            if (error.message) {
                throw error;
            }
            throw new Error('حدث خطأ غير متوقع أثناء الاتصال بالخادم');
        }
    }

    // GET request
    async get(endpoint, options = {}) {
        return this.request({
            ...options,
            url: endpoint,
            method: 'GET'
        });
    }

    // POST request
    async post(endpoint, data = {}, options = {}) {
        return this.request({
            ...options,
            url: endpoint,
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // PUT request
    async put(endpoint, data = {}, options = {}) {
        return this.request({
            ...options,
            url: endpoint,
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // DELETE request
    async delete(endpoint, options = {}) {
        return this.request({
            ...options,
            url: endpoint,
            method: 'DELETE'
        });
    }

    // ==================== AUTH APIs ====================
    
    // Get current user info
    async getCurrentUser() {
        return this.get('/auth/me');
    }

    // Login user
    async loginUser(email, password) {
        return this.post('/auth/login', { email, password });
    }

    // Register user
    async registerUser(userData) {
        return this.post('/auth/register', userData);
    }

    // Update user profile
    async updateProfile(userData) {
        return this.put('/auth/profile', userData);
    }

    // ==================== VENDOR APIs ====================
    
    // Vendor login
    async vendorLogin(email, password) {
        logger.info('بدء تسجيل دخول المورد', { email });
        try {
            console.log('🔐 Sending vendor login request to:', `${this.baseURL}/vendor/auth/login`);
            console.log('📤 Login payload:', { email, password: '***' });
            
            const response = await this.post('/vendor/auth/login', { email, password });
            
            console.log('📥 Vendor login response:', response);
            logger.info('تم تسجيل دخول المورد بنجاح', { email, response });
            
            return response;
        } catch (error) {
            console.error('❌ Vendor login API error:', error);
            console.error('❌ Error details:', {
                message: error.message,
                status: error.status,
                response: error.response
            });
            
            logger.error('فشل في تسجيل دخول المورد', { email, error: error.message });
            throw error;
        }
    }

    // Vendor signup
    async vendorSignup(vendorData) {
        logger.info('بدء تسجيل مورد جديد', { email: vendorData.email, name: vendorData.name });
        try {
            const response = await this.post('/vendor/auth/register', vendorData);
            logger.info('تم تسجيل المورد بنجاح', { email: vendorData.email });
            return response;
        } catch (error) {
            logger.error('فشل في تسجيل المورد', { email: vendorData.email, error: error.message });
            throw error;
        }
    }

    // Get vendor info
    async getVendorInfo() {
        logger.info('جلب معلومات المورد');
        try {
            const response = await this.get('/vendor/auth/me');
            logger.info('تم جلب معلومات المورد بنجاح');
            return response;
        } catch (error) {
            logger.error('فشل في جلب معلومات المورد', { error: error.message });
            throw error;
        }
    }

    // ==================== ADDRESS APIs ====================
    
    // Get user addresses
    async getAddresses() {
        return this.get('/addresses');
    }

    // Add new address
    async addAddress(addressData) {
        return this.post('/addresses', addressData);
    }

    // Update address
    async updateAddress(addressId, addressData) {
        return this.put(`/addresses/${addressId}`, addressData);
    }

    // Delete address
    async deleteAddress(addressId) {
        return this.delete(`/addresses/${addressId}`);
    }

    // Set default address
    async setDefaultAddress(addressId) {
        return this.post(`/addresses/${addressId}/default`);
    }

    // ==================== CHECKOUT APIs ====================
    
    // Get checkout data
    async getCheckoutData() {
        return this.get('/checkout/data');
    }

    // Submit checkout
    async submitCheckout(checkoutData) {
        return this.post('/checkout', checkoutData);
    }

    // ==================== ORDER APIs ====================
    
    // Get order confirmation
    async getOrderConfirmation(orderNumber) {
        return this.get(`/orders/confirmation/${orderNumber}`);
    }

    // Get order details
    async getOrderDetails(orderId) {
        return this.get(`/orders/${orderId}/details`);
    }

    // Download invoice
    async downloadInvoice(orderNumber) {
        const response = await fetch(`${this.baseURL}/orders/invoice/${orderNumber}`, {
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('فشل في تحميل الفاتورة');
        }
        
        // Check if response is HTML
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
            // Open HTML in new window for printing
            const htmlContent = await response.text();
            const newWindow = window.open('', '_blank');
            newWindow.document.write(htmlContent);
            newWindow.document.close();
            
            // Focus on the new window
            newWindow.focus();
        } else {
            // Handle as blob for PDF download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoice-${orderNumber}.html`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }
    }

    // ==================== CATEGORIES APIs ====================
    
    // Get all categories
    async getCategories() {
        return this.get('/categories');
    }

    // Get categories page with products
    async getCategoriesPage() {
        return this.get('/categories/page');
    }

    // Get category products
    async getCategoryProducts(categoryId, filters = {}) {
        const params = new URLSearchParams(filters);
        return this.get(`/categories/${categoryId}/products?${params}`);
    }

    // ==================== VENDOR APIs ====================
    
    // Get featured vendors
    async getFeaturedVendors() {
        return this.get('/vendors/featured');
    }

    // Get vendor details
    async getVendorDetails(vendorId) {
        return this.get(`/vendors/${vendorId}`);
    }

    // Get vendor products
    async getVendorProducts(vendorId) {
        return this.get(`/vendors/${vendorId}/products`);
    }

    // ==================== CART APIs ====================
    
    // Get cart
    async getCart() {
        return this.get('/cart');
    }

    // Add to cart
    async addToCart(productId, quantity = 1, notes = '') {
        return this.post('/cart', { product_id: productId, quantity, notes });
    }

    // Update cart item
    async updateCartItem(productId, quantity) {
        return this.put(`/cart/${productId}`, { quantity });
    }

    // Remove from cart
    async removeFromCart(productId) {
        return this.delete(`/cart/${productId}`);
    }

    // Clear cart
    async clearCart() {
        return this.delete('/cart');
    }

    // ==================== SETTINGS APIs ====================
    
    // Get settings
    async getSettings() {
        return this.get('/settings');
    }

    // Get settings by group
    async getSettingsByGroup(group) {
        return this.get(`/settings/${group}`);
    }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;
