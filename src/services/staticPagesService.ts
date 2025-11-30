import { API_ENDPOINTS } from '@/config/api';

export interface StaticPage {
  id: number;
  slug: string;
  title: string;
  content: string;
  meta_description?: string;
  meta_keywords?: string;
  is_active: boolean;
  is_fixed: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

class StaticPagesService {
  /**
   * جلب جميع الصفحات الثابتة
   */
  async getAllPages(): Promise<ApiResponse<StaticPage[]>> {
    try {
      const response = await fetch(API_ENDPOINTS.STATIC_PAGES?.ALL || '/api/static-pages');
      return await response.json();
    } catch (error) {
      console.error('Error fetching static pages:', error);
      return {
        success: false,
        message: 'حدث خطأ في جلب الصفحات'
      };
    }
  }

  /**
   * جلب صفحة محددة بالـ slug
   */
  async getPageBySlug(slug: string): Promise<ApiResponse<StaticPage>> {
    try {
      const response = await fetch(API_ENDPOINTS.STATIC_PAGES?.DETAIL?.(slug) || `/api/static-pages/${slug}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching static page:', error);
      return {
        success: false,
        message: 'حدث خطأ في جلب الصفحة'
      };
    }
  }

  /**
   * جلب صفحة شروط الخدمة
   */
  async getTermsPage(): Promise<ApiResponse<StaticPage>> {
    try {
      const response = await fetch(API_ENDPOINTS.STATIC_PAGES?.TERMS || '/api/terms');
      return await response.json();
    } catch (error) {
      console.error('Error fetching terms page:', error);
      return {
        success: false,
        message: 'حدث خطأ في جلب صفحة شروط الخدمة'
      };
    }
  }

  /**
   * جلب صفحة سياسة الخصوصية
   */
  async getPrivacyPage(): Promise<ApiResponse<StaticPage>> {
    try {
      const response = await fetch(API_ENDPOINTS.STATIC_PAGES?.PRIVACY || '/api/privacy');
      return await response.json();
    } catch (error) {
      console.error('Error fetching privacy page:', error);
      return {
        success: false,
        message: 'حدث خطأ في جلب صفحة سياسة الخصوصية'
      };
    }
  }

  /**
   * جلب صفحة سياسة الاسترداد
   */
  async getRefundPage(): Promise<ApiResponse<StaticPage>> {
    try {
      const response = await fetch(API_ENDPOINTS.STATIC_PAGES?.REFUND || '/api/refund');
      return await response.json();
    } catch (error) {
      console.error('Error fetching refund page:', error);
      return {
        success: false,
        message: 'حدث خطأ في جلب صفحة سياسة الاسترداد'
      };
    }
  }

  /**
   * جلب الصفحات الثابتة فقط
   */
  async getFixedPages(): Promise<ApiResponse<StaticPage[]>> {
    try {
      const response = await fetch(API_ENDPOINTS.STATIC_PAGES?.FIXED || '/api/static-pages/fixed');
      return await response.json();
    } catch (error) {
      console.error('Error fetching fixed pages:', error);
      return {
        success: false,
        message: 'حدث خطأ في جلب الصفحات الثابتة'
      };
    }
  }

  /**
   * جلب الصفحات القابلة للتعديل
   */
  async getEditablePages(): Promise<ApiResponse<StaticPage[]>> {
    try {
      const response = await fetch(API_ENDPOINTS.STATIC_PAGES?.EDITABLE || '/api/static-pages/editable');
      return await response.json();
    } catch (error) {
      console.error('Error fetching editable pages:', error);
      return {
        success: false,
        message: 'حدث خطأ في جلب الصفحات القابلة للتعديل'
      };
    }
  }
}

export const staticPagesService = new StaticPagesService();
export default staticPagesService;
