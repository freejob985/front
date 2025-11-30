import React, { useState, useEffect } from 'react';
import { staticPagesService, StaticPage } from '@/services/staticPagesService';

const Refund: React.FC = () => {
  const [page, setPage] = useState<StaticPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRefundPage();
  }, []);

  const loadRefundPage = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await staticPagesService.getRefundPage();
      
      if (response.success && response.data) {
        setPage(response.data);
      } else {
        setError(response.message || 'فشل في تحميل صفحة سياسة الاسترداد');
      }
    } catch (err) {
      console.error('Error loading refund page:', err);
      setError('حدث خطأ في تحميل الصفحة');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg">جاري تحميل صفحة سياسة الاسترداد...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 text-6xl mb-6">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">خطأ في تحميل المحتوى</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={loadRefundPage}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            <i className="fas fa-refresh mr-2"></i>
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">لا توجد بيانات للعرض</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <a href="/" className="text-2xl font-bold text-blue-600">
                <i className="fas fa-shopping-cart mr-2"></i>
                إنجب
              </a>
            </div>
            <nav className="hidden md:flex space-x-8 space-x-reverse">
              <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors">الرئيسية</a>
              <a href="/terms" className="text-gray-600 hover:text-blue-600 transition-colors">شروط الخدمة</a>
              <a href="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">سياسة الخصوصية</a>
              <a href="/refund" className="text-blue-600 font-semibold">سياسة الاسترداد</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{page.title}</h1>
            <div className="w-20 h-1 bg-blue-600 rounded"></div>
          </div>

          {/* Page Content */}
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />

          {/* Contact Section */}
          <div className="mt-12 p-6 bg-blue-50 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              <i className="fas fa-headset mr-2 text-blue-600"></i>
              تحتاج مساعدة؟
            </h3>
            <p className="text-gray-600 mb-4">
              إذا كان لديك أي استفسارات حول سياسة الاسترداد أو تحتاج مساعدة في طلب استرداد، 
              لا تتردد في التواصل معنا.
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="mailto:refund@engeb.com" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <i className="fas fa-envelope mr-2"></i>
                refund@engeb.com
              </a>
              <a 
                href="tel:+966501234567" 
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <i className="fas fa-phone mr-2"></i>
                +966 50 123 4567
              </a>
              <a 
                href="https://wa.me/966501234567" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <i className="fab fa-whatsapp mr-2"></i>
                واتساب
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">إنجب</h3>
              <p className="text-gray-300">منصة تسوق إلكترونية متكاملة تقدم أفضل المنتجات والخدمات لعملائنا الكرام.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">روابط مهمة</h3>
              <ul className="space-y-2">
                <li><a href="/terms" className="text-gray-300 hover:text-white transition-colors">شروط الخدمة</a></li>
                <li><a href="/privacy" className="text-gray-300 hover:text-white transition-colors">سياسة الخصوصية</a></li>
                <li><a href="/refund" className="text-gray-300 hover:text-white transition-colors">سياسة الاسترداد</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">تواصل معنا</h3>
              <div className="space-y-2">
                <p className="text-gray-300"><i className="fas fa-envelope mr-2"></i> info@engeb.com</p>
                <p className="text-gray-300"><i className="fas fa-phone mr-2"></i> +966 50 123 4567</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-300">&copy; 2024 إنجب. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Refund;
