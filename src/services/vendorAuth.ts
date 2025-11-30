import apiService from './api';
import AuthErrorHandler, { AuthError } from './authErrorHandler';
import { debounce } from 'lodash';

export interface VendorLoginData {
  email: string;
  password: string;
}

export interface VendorSignupData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
  business_name: string;
  business_type: string;
  address: string;
  postal_code: string;
  category: string;
  description: string;
  commercial_record: string;
  tax_number: string;
  bank_account: string;
  bank_name: string;
  delivery_fee: string;
  free_delivery_threshold: string;
  governorate: string;
  city: string;
  business_categories: string[];
  governorate_id?: number;
  city_id?: number;
  is_featured?: boolean;
  is_fresh?: boolean;
}

export interface VendorProfile {
  id: number;
  name: string;
  email: string;
  status: string;
  created_at: string;
  updated_at: string;
}

class VendorAuthService {
  private static instance: VendorAuthService;
  private tokenRefreshInterval: NodeJS.Timeout | null = null;
  private readonly TOKEN_KEY = 'vendor_auth_token';
  private readonly PROFILE_KEY = 'vendor_profile';
  private readonly TOKEN_REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes in milliseconds
  private readonly PROFILE_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

  private lastProfileFetch: number = 0;
  private cachedProfile: VendorProfile | null = null;

  public constructor() {
    this.initializeTokenRefresh();
  }

  public static getInstance(): VendorAuthService {
    if (!VendorAuthService.instance) {
      VendorAuthService.instance = new VendorAuthService();
    }
    return VendorAuthService.instance;
  }

  private initializeTokenRefresh(): void {
    if (this.getToken()) {
      this.startTokenRefreshInterval();
    }
  }

  private startTokenRefreshInterval(): void {
    if (this.tokenRefreshInterval) {
      clearInterval(this.tokenRefreshInterval);
    }
    this.tokenRefreshInterval = setInterval(() => {
      this.refreshToken().catch(error => {
        console.error('🔄 Token refresh failed:', error);
      });
    }, this.TOKEN_REFRESH_INTERVAL);
  }

  private stopTokenRefreshInterval(): void {
    if (this.tokenRefreshInterval) {
      clearInterval(this.tokenRefreshInterval);
      this.tokenRefreshInterval = null;
    }
  }

  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.startTokenRefreshInterval();
  }

  private removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.stopTokenRefreshInterval();
  }

  private setProfile(profile: VendorProfile): void {
    this.cachedProfile = profile;
    this.lastProfileFetch = Date.now();
    localStorage.setItem(this.PROFILE_KEY, JSON.stringify(profile));
  }

  private getStoredProfile(): VendorProfile | null {
    const profileStr = localStorage.getItem(this.PROFILE_KEY);
    if (!profileStr) return null;
    try {
      return JSON.parse(profileStr);
    } catch (error) {
      console.error('❌ Error parsing stored profile:', error);
      return null;
    }
  }

  private removeProfile(): void {
    this.cachedProfile = null;
    this.lastProfileFetch = 0;
    localStorage.removeItem(this.PROFILE_KEY);
  }

  public async login(data: VendorLoginData): Promise<{ success: boolean; message?: string; vendor?: any }> {
    try {
      console.log('🔐 Attempting vendor login for:', data.email);
      const response = await apiService.vendorLogin(data.email, data.password);
      console.log('📡 Vendor login response:', response);
      
      if (response?.success) {
        // Extract vendor data from response.data or response.vendor
        const vendor = response.data?.vendor || response.vendor;
        const token = response.data?.token || response.token;
        
        if (vendor) {
          // Store vendor data
          localStorage.setItem(this.PROFILE_KEY, JSON.stringify(vendor));
          this.cachedProfile = vendor;
          this.lastProfileFetch = Date.now();
          
          // Store token if available (even if null, we still consider login successful)
          if (token) {
            this.setToken(token);
          } else {
            console.log('ℹ️ No token provided, using session-based authentication');
          }
          
          console.log('✅ Vendor login successful:', vendor);
          return { success: true, vendor: vendor };
        } else {
          const errorMessage = response?.message || 'فشل في تسجيل الدخول. بيانات المورد غير متوفرة.';
          console.error('❌ Login failed - No vendor data in response:', response);
          return { success: false, message: errorMessage };
        }
      } else {
        const errorMessage = response?.message || 'فشل في تسجيل الدخول. تحقق من البيانات المدخلة.';
        console.error('❌ Login failed - Invalid response:', response);
        return { success: false, message: errorMessage };
      }
    } catch (error: any) {
      console.error('❌ Login failed with error:', error);
      const errorMessage = error?.message || error?.response?.data?.message || 'حدث خطأ أثناء تسجيل الدخول';
      return { success: false, message: errorMessage };
    }
  }

  public async logout(): Promise<void> {
    try {
      // For session-based auth, we don't need to call logout API
      // Just clear local data
      console.log('🚪 Logging out vendor...');
    } catch (error) {
      console.warn('⚠️ Logout failed:', error);
    } finally {
      this.removeToken();
      this.removeProfile();
      this.stopTokenRefreshInterval();
    }
  }

  public async refreshToken(): Promise<boolean> {
    try {
      // For session-based auth, we don't need token refresh
      // Just validate current session
      const response = await apiService.getVendorInfo();
      if (response?.success && response?.vendor) {
        this.cachedProfile = response.vendor;
        this.lastProfileFetch = Date.now();
        localStorage.setItem(this.PROFILE_KEY, JSON.stringify(response.vendor));
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Session validation failed:', error);
      return false;
    }
  }

  public async validateToken(): Promise<boolean> {
    try {
      const response = await apiService.getVendorInfo();
      return response?.success === true && !!response?.vendor;
    } catch (error) {
      if (AuthErrorHandler.isAuthError(error)) {
        await AuthErrorHandler.handleAuthError(error as AuthError);
        return false;
      }
      console.error('❌ Session validation failed:', error);
      return false;
    }
  }

  private debouncedFetchProfile = debounce(async () => {
    try {
      const response = await AuthErrorHandler.withAuthErrorHandling(
        () => apiService.getVendorInfo(),
        () => this.getStoredProfile()
      );

      if (response) {
        this.setProfile(response);
        return response;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Error fetching vendor profile:', error);
      return null;
    }
  }, 1000);

  public async fetchVendorProfile(force: boolean = false): Promise<VendorProfile | null> {
    // Return cached profile if it's still fresh
    if (!force && this.cachedProfile && (Date.now() - this.lastProfileFetch) < this.PROFILE_CACHE_DURATION) {
      return this.cachedProfile;
    }

    return this.debouncedFetchProfile();
  }

  public async getCurrentVendor(): Promise<VendorProfile | null> {
    if (!this.isAuthenticated()) {
      return null;
    }

    return this.fetchVendorProfile();
  }

  public isAuthenticated(): boolean {
    return !!this.getToken();
  }

  public isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  // التحقق من صحة token مع الخادم
  public async validateTokenWithServer(): Promise<boolean> {
    try {
      const token = this.getToken();
      if (!token) {
        console.log('🔍 No token found for validation');
        return false;
      }

      console.log('🔍 Validating token with server...');
      const response = await apiService.post('/vendor/auth/validate-token', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response?.success) {
        console.log('✅ Token validation successful');
        return true;
      } else {
        console.log('❌ Token validation failed:', response?.message);
        return false;
      }
    } catch (error) {
      console.error('❌ Token validation error:', error);
      return false;
    }
  }

  public async signup(data: VendorSignupData): Promise<void> {
    try {
      const response = await apiService.post('/vendor/signup', data);
      if (response?.success) {
        console.log('✅ Vendor signup successful');
        // You might want to automatically log in the user after signup
        // await this.login({ email: data.email, password: data.password });
      } else {
        throw new Error(response?.message || 'Signup failed');
      }
    } catch (error) {
      console.error('❌ Vendor signup error:', error);
      throw error;
    }
  }

  public async checkLoginStatus(): Promise<boolean> {
    return this.isAuthenticated();
  }
}

// Create singleton instance
const vendorAuthService = new VendorAuthService();

export default vendorAuthService;
