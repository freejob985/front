import { Link } from 'react-router-dom';
import { ROUTES, getImageUrl } from '../../config/api';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

// Footer Logo Component
const FooterLogo = ({ isLoading, footerLogo, siteName }: { 
  isLoading: boolean; 
  footerLogo: string; 
  siteName: string; 
}) => {
  if (isLoading) {
    return (
      <div className="h-12 w-32 mb-4 bg-gray-700 rounded animate-pulse flex items-center justify-center">
        <span className="text-gray-400 text-sm">جاري التحميل...</span>
      </div>
    );
  }

  return (
    <img 
      src={footerLogo} 
      alt={`${siteName} Logo`} 
      className="h-12 w-auto mb-4 brightness-0 invert hover:opacity-80 transition-opacity"
      onError={(e) => {
        if (import.meta.env.DEV) {
          console.warn('⚠️ Footer logo failed to load, using fallback');
        }
        e.currentTarget.src = "/images/logo.png";
      }}
    />
  );
};

// Main Categories Component
const MainCategories = () => {
  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ['mainCategories'],
    queryFn: api.mainCategories,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const categories = categoriesData?.data || [];

  if (isLoading) {
    return (
      <div>
        <h4 className="text-lg font-semibold mb-4">الأقسام الرئيسية</h4>
        <ul className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <li key={i} className="animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-24"></div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div>
      <h4 className="text-lg font-semibold mb-4">الأقسام الرئيسية</h4>
      <ul className="space-y-2">
        <li>
          <Link 
            to={ROUTES.CATEGORIES} 
            className="text-gray-300 hover:text-white transition-colors"
          >
            جميع الأقسام
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category.id}>
            <Link 
              to={`/categories/${category.slug}`} 
              className="text-gray-300 hover:text-white transition-colors"
            >
              {category.name_ar}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Supermarket Categories Component
const SupermarketCategories = () => {
  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ['supermarketCategories'],
    queryFn: api.supermarketCategories,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const categories = categoriesData?.data || [];

  if (isLoading) {
    return (
      <div>
        <h4 className="text-lg font-semibold mb-4">أقسام السوبر ماركت</h4>
        <ul className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <li key={i} className="animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-24"></div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div>
      <h4 className="text-lg font-semibold mb-4">أقسام السوبر ماركت</h4>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.id}>
            <Link 
              to={`/categories/${category.slug}`} 
              className="text-gray-300 hover:text-white transition-colors"
            >
              {category.name_ar}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Footer = () => {
  // جلب الإعدادات العامة للموقع
  const { data: settingsData, isLoading: settingsLoading, error: settingsError } = useQuery({
    queryKey: ['settings', 'general'],
    queryFn: api.settings.general,
    retry: 1,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // جلب إعدادات التصميم (لشعار الفوتر)
  const { data: designData, isLoading: designLoading, error: designError } = useQuery({
    queryKey: ['settings', 'design'],
    queryFn: api.settings.design,
    retry: 1,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const settings = settingsData?.data;
  const designSettings = designData?.data;
  
  // معالجة الأخطاء
  if (settingsError) {
    console.error('❌ Error loading general settings:', settingsError);
  }
  if (designError) {
    console.error('❌ Error loading design settings:', designError);
  }
  
  // تحديد شعار الفوتر مع معالجة أفضل للأخطاء
  const getFooterLogo = () => {
    // أولوية: شعار الفوتر المخصص من إعدادات التصميم
    if (designSettings?.site_footer_logo_url) {
      return getImageUrl(designSettings.site_footer_logo_url);
    }
    
    // ثانوية: شعار الموقع العام
    if (settings?.site_logo_url) {
      return getImageUrl(settings.site_logo_url);
    }
    
    // افتراضي: شعار افتراضي
    return "/images/logo.png";
  };

  const footerLogo = getFooterLogo();
  const siteName = settings?.site_name || "إنجب";
  const isLoading = settingsLoading || designLoading;

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <FooterLogo 
              isLoading={isLoading}
              footerLogo={footerLogo}
              siteName={siteName}
            />
            <p className="text-gray-300 mb-4 leading-relaxed">
              منصة التسوق الإلكتروني الرائدة في الكويت، نقدم لك أفضل المنتجات الغذائية والاستهلاكية من موردين موثوقين.
            </p>
            <div className="flex space-x-4 space-x-reverse">
              {settings?.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-facebook-f"></i>
                </a>
              )}
              {settings?.twitter_url && (
                <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-twitter"></i>
                </a>
              )}
              {settings?.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-instagram"></i>
                </a>
              )}
              {settings?.linkedin_url && (
                <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              )}
            </div>
          </div>

          {/* Main Categories */}
          <MainCategories />

          {/* Supermarket Categories */}
          <SupermarketCategories />

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  من نحن
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  اتصل بنا
                </Link>
              </li>
              <li>
                <Link to="/delivery" className="text-gray-300 hover:text-white transition-colors">
                  التوصيل
                </Link>
              </li>
              <li>
                <Link to="/offers" className="text-gray-300 hover:text-white transition-colors">
                  العروض
                </Link>
              </li>
              <li>
                <Link to="/fresh" className="text-gray-300 hover:text-white transition-colors">
                  المنتجات الطازجة
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-700 pt-8 mb-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-center gap-3 text-gray-300">
              <Phone className="h-5 w-5" />
              <span>{settings?.contact_phone || "+965 50 123 4567"}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Mail className="h-5 w-5" />
              <span>{settings?.contact_email || "info@engeb.com"}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <MapPin className="h-5 w-5" />
              <span>{settings?.contact_address || "مدينة الكويت، دولة الكويت"}</span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 {settings?.site_name || "إنجب"}. جميع الحقوق محفوظة.
            </div>
            <div className="flex space-x-6 space-x-reverse text-sm">
              <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                سياسة الخصوصية
              </a>
              <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
                شروط الاستخدام
              </a>
              <a href="/refund" className="text-gray-400 hover:text-white transition-colors">
                سياسة الاسترداد
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
