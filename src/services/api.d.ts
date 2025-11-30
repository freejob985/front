// Type definitions for api.js
export interface ApiService {
  baseURL: string;
  request(options: { url: string; method: string; headers?: Record<string, string>; body?: string }): Promise<any>;
  get(endpoint: string, options?: RequestInit): Promise<any>;
  post(endpoint: string, data?: any, options?: RequestInit): Promise<any>;
  put(endpoint: string, data?: any, options?: RequestInit): Promise<any>;
  delete(endpoint: string, options?: RequestInit): Promise<any>;
  getCurrentUser(): Promise<any>;
  loginUser(email: string, password: string): Promise<any>;
  registerUser(userData: any): Promise<any>;
  updateProfile(userData: any): Promise<any>;
  vendorLogin(email: string, password: string): Promise<any>;
  vendorSignup(vendorData: any): Promise<any>;
  getVendorInfo(): Promise<any>;
  getAddresses(): Promise<any>;
  addAddress(addressData: any): Promise<any>;
  updateAddress(addressId: number, addressData: any): Promise<any>;
  deleteAddress(addressId: number): Promise<any>;
  setDefaultAddress(addressId: number): Promise<any>;
  getCheckoutData(): Promise<any>;
  submitCheckout(checkoutData: any): Promise<any>;
  getOrderConfirmation(orderNumber: string): Promise<any>;
  getOrderDetails(orderId: number): Promise<any>;
  downloadInvoice(orderNumber: string): Promise<void>;
  getCategories(): Promise<any>;
  getCategoriesPage(): Promise<any>;
  getCategoryProducts(categoryId: number, filters?: any): Promise<any>;
  getFeaturedVendors(): Promise<any>;
  getVendorDetails(vendorId: number): Promise<any>;
  getVendorProducts(vendorId: number): Promise<any>;
  getCart(): Promise<any>;
  addToCart(productId: number, quantity?: number, notes?: string): Promise<any>;
  updateCartItem(productId: number, quantity: number): Promise<any>;
  removeFromCart(productId: number): Promise<any>;
  clearCart(): Promise<any>;
  getSettings(): Promise<any>;
  getSettingsByGroup(group: string): Promise<any>;
}

declare const apiService: ApiService;
export default apiService;
