/**
 * معالج الأخطاء الشامل للتطبيق
 */

export interface ApiError {
  message: string;
  status?: number;
  statusText?: string;
  data?: any;
}

export class ErrorHandler {
  /**
   * معالجة أخطاء API
   */
  static handleApiError(error: any): ApiError {
    console.error('API Error:', error);

    // خطأ في الشبكة
    if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
      return {
        message: 'خطأ في الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.',
        status: 0,
        statusText: 'Network Error'
      };
    }

    // خطأ في timeout
    if (error.message?.includes('timeout')) {
      return {
        message: 'انتهت مهلة الطلب. يرجى المحاولة مرة أخرى.',
        status: 408,
        statusText: 'Request Timeout'
      };
    }

    // خطأ في JSON
    if (error.message?.includes('non-JSON') || error.message?.includes('Invalid JSON')) {
      return {
        message: 'خطأ في تنسيق البيانات من الخادم. يرجى المحاولة مرة أخرى.',
        status: 500,
        statusText: 'Invalid Response Format'
      };
    }

    // خطأ 503 Service Unavailable
    if (error.status === 503) {
      return {
        message: 'الخدمة غير متاحة مؤقتاً. يرجى المحاولة مرة أخرى بعد قليل.',
        status: 503,
        statusText: 'Service Unavailable'
      };
    }

    // خطأ 502 Bad Gateway
    if (error.status === 502) {
      return {
        message: 'خطأ في الخادم. يرجى المحاولة مرة أخرى.',
        status: 502,
        statusText: 'Bad Gateway'
      };
    }

    // خطأ 504 Gateway Timeout
    if (error.status === 504) {
      return {
        message: 'انتهت مهلة الخادم. يرجى المحاولة مرة أخرى.',
        status: 504,
        statusText: 'Gateway Timeout'
      };
    }

    // خطأ 404 Not Found
    if (error.status === 404) {
      return {
        message: 'المورد المطلوب غير موجود.',
        status: 404,
        statusText: 'Not Found'
      };
    }

    // خطأ 401 Unauthorized
    if (error.status === 401) {
      return {
        message: 'غير مصرح لك بالوصول. يرجى تسجيل الدخول مرة أخرى.',
        status: 401,
        statusText: 'Unauthorized'
      };
    }

    // خطأ 403 Forbidden
    if (error.status === 403) {
      return {
        message: 'ليس لديك صلاحية للوصول إلى هذا المورد.',
        status: 403,
        statusText: 'Forbidden'
      };
    }

    // خطأ 422 Validation Error
    if (error.status === 422) {
      // استخراج رسالة الفالديشن من الخطأ
      let validationMessage = 'خطأ في البيانات المرسلة. يرجى التحقق من المعلومات المدخلة.';
      
      if (error.message) {
        validationMessage = error.message;
      } else if (error.data?.message) {
        validationMessage = error.data.message;
      } else if (error.data?.errors) {
        // استخراج أول خطأ من مصفوفة الأخطاء
        const firstError = Object.values(error.data.errors)[0];
        if (Array.isArray(firstError) && firstError.length > 0) {
          validationMessage = firstError[0];
        }
      }
      
      return {
        message: validationMessage,
        status: 422,
        statusText: 'Validation Error',
        data: error.data
      };
    }

    // خطأ 500 Internal Server Error
    if (error.status === 500) {
      return {
        message: 'خطأ داخلي في الخادم. يرجى المحاولة مرة أخرى لاحقاً.',
        status: 500,
        statusText: 'Internal Server Error'
      };
    }

    // خطأ عام
    return {
      message: error.message || 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
      status: error.status || 500,
      statusText: error.statusText || 'Unknown Error',
      data: error.data
    };
  }

  /**
   * عرض رسالة خطأ للمستخدم
   */
  static showError(error: any, toast?: any) {
    const apiError = this.handleApiError(error);
    
    if (toast) {
      toast.error(apiError.message, {
        description: `خطأ ${apiError.status}: ${apiError.statusText}`,
        duration: 5000,
      });
    } else {
      console.error('Error:', apiError);
    }

    return apiError;
  }

  /**
   * تسجيل الخطأ للمطورين
   */
  static logError(error: any, context?: string) {
    const apiError = this.handleApiError(error);
    
    console.group(`🚨 Error${context ? ` in ${context}` : ''}`);
    console.error('Message:', apiError.message);
    console.error('Status:', apiError.status);
    console.error('Status Text:', apiError.statusText);
    if (apiError.data) {
      console.error('Data:', apiError.data);
    }
    console.error('Original Error:', error);
    console.groupEnd();

    // يمكن إضافة إرسال الخطأ إلى خدمة مراقبة الأخطاء هنا
    // مثل Sentry أو LogRocket
  }

  /**
   * التحقق من إمكانية إعادة المحاولة
   */
  static shouldRetry(error: any): boolean {
    const status = error.status;
    return status === 503 || status === 502 || status === 504 || status === 0;
  }

  /**
   * حساب تأخير إعادة المحاولة
   */
  static getRetryDelay(retryCount: number): number {
    const baseDelay = 1000; // 1 second
    const maxDelay = 10000; // 10 seconds
    const delay = baseDelay * Math.pow(2, retryCount); // Exponential backoff
    return Math.min(delay, maxDelay);
  }
}

export default ErrorHandler;
