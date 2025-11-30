// Auth Error Handler
import vendorAuthService from './vendorAuth';

export interface AuthError extends Error {
  status?: number;
  isAuthError?: boolean;
  response?: {
    status: number;
    data?: {
      message?: string;
      error?: string;
    };
  };
}

class AuthErrorHandler {
  private static readonly AUTH_ERROR_CODES = [401, 403];
  private static readonly AUTH_ERROR_MESSAGES = [
    'Unauthenticated',
    'Unauthorized',
    'Token expired',
    'Invalid token',
    'Token not found',
    'Token blacklisted',
    'Token has been revoked'
  ];

  /**
   * Check if error is authentication related
   */
  static isAuthError(error: any): boolean {
    // Check HTTP status code
    if (error?.status && this.AUTH_ERROR_CODES.includes(error.status)) {
      return true;
    }

    // Check response status
    if (error?.response?.status && this.AUTH_ERROR_CODES.includes(error.response.status)) {
      return true;
    }

    // Check error messages
    const errorMessage = error?.message || error?.response?.data?.message || error?.response?.data?.error || '';
    if (this.AUTH_ERROR_MESSAGES.some(msg => errorMessage.toLowerCase().includes(msg.toLowerCase()))) {
      return true;
    }

    // Check explicit flag
    return error?.isAuthError === true;
  }

  /**
   * Handle authentication errors
   */
  static async handleAuthError(error: AuthError): Promise<void> {
    console.error('🔒 Authentication error:', error);

    const errorMessage = error?.message || 
                        error?.response?.data?.message || 
                        error?.response?.data?.error || 
                        'Authentication error occurred';

    // Log the error details
    console.log({
      status: error?.status || error?.response?.status,
      message: errorMessage,
      type: 'AUTH_ERROR'
    });

    try {
      // Attempt to refresh token first
      const authService = vendorAuthService;
      const refreshed = await authService.refreshToken();

      if (!refreshed) {
        // If refresh failed, force logout
        await authService.logout();
        
        // Redirect to login page
        if (window.location.pathname !== '/vendor/login') {
          // Store the current path for redirect after login
          sessionStorage.setItem('auth_redirect', window.location.pathname);
          window.location.href = '/vendor/login';
        }
      }
    } catch (refreshError) {
      console.error('❌ Token refresh failed:', refreshError);
      // Force logout on refresh error
      const authService = vendorAuthService;
      await authService.logout();
      
      if (window.location.pathname !== '/vendor/login') {
        sessionStorage.setItem('auth_redirect', window.location.pathname);
        window.location.href = '/vendor/login';
      }
    }
  }

  /**
   * Wrap API calls with authentication error handling
   */
  static async withAuthErrorHandling<T>(
    apiCall: () => Promise<T>,
    fallback?: () => T | null
  ): Promise<T | null> {
    try {
      return await apiCall();
    } catch (error) {
      if (this.isAuthError(error)) {
        await this.handleAuthError(error as AuthError);
        return fallback ? fallback() : null;
      }
      throw error;
    }
  }

  /**
   * Get a user-friendly error message
   */
  static getErrorMessage(error: any): string {
    if (this.isAuthError(error)) {
      return 'يرجى تسجيل الدخول مرة أخرى للمتابعة';
    }
    return error?.message || error?.response?.data?.message || 'حدث خطأ غير متوقع';
  }
}

export default AuthErrorHandler;
