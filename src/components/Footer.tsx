import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

// مكون لجلب الأقسام الرئيسية
const MainCategoriesList = () => {
  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ['categories', 'main'],
    queryFn: api.mainCategories,
    retry: 1,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const categories = categoriesData?.data || [];

  if (isLoading) {
    return (
      <ul className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <li key={i} className="h-4 bg-gray-700 rounded animate-pulse"></li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="space-y-2">
      {categories.map((category: any) => (
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
  );
};

// مكون لجلب أقسام السوبر ماركت
const SupermarketCategoriesList = () => {
  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ['categories', 'supermarket'],
    queryFn: api.supermarketCategories,
    retry: 1,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const categories = categoriesData?.data || [];

  if (isLoading) {
    return (
      <ul className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <li key={i} className="h-4 bg-gray-700 rounded animate-pulse"></li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="space-y-2">
      {categories.map((category: any) => (
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
  );
};

const Footer = () => {
  // جلب الإعدادات العامة للموقع
  const { data: settingsData } = useQuery({
    queryKey: ['settings', 'general'],
    queryFn: api.settings.general,
    retry: 1,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const settings = settingsData?.data;

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">إنجب</h3>
            <p className="text-gray-300 mb-4">
              منصة التسوق الإلكتروني الرائدة في الكويت، نقدم لك أفضل المنتجات الغذائية والاستهلاكية من موردين موثوقين.
            </p>
            <div className="flex space-x-4 space-x-reverse">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">الأقسام الرئيسية</h4>
            <MainCategoriesList />
          </div>

          {/* Supermarket Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">أقسام السوبر ماركت</h4>
            <SupermarketCategoriesList />
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">معلومات الاتصال</h4>
            <div className="space-y-3">
              {settings?.contact_phone && (
                <div className="flex items-center gap-2">
                  <i className="fas fa-phone text-primary"></i>
                  <a 
                    href={`tel:${settings.contact_phone}`}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {settings.contact_phone}
                  </a>
                </div>
              )}
              {settings?.contact_email && (
                <div className="flex items-center gap-2">
                  <i className="fas fa-envelope text-primary"></i>
                  <a 
                    href={`mailto:${settings.contact_email}`}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {settings.contact_email}
                  </a>
                </div>
              )}
              {settings?.contact_address && (
                <div className="flex items-start gap-2">
                  <i className="fas fa-map-marker-alt text-primary mt-1"></i>
                  <span className="text-gray-300">
                    {settings.contact_address}
                  </span>
                </div>
              )}
            </div>
          </div>

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

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 إنجب. جميع الحقوق محفوظة.
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
