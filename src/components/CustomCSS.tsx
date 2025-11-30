import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

interface CustomCSSProps {
  type?: 'frontend' | 'admin';
}

const CustomCSS = ({ type = 'frontend' }: CustomCSSProps) => {
  const { data: designData } = useQuery({
    queryKey: ['settings', 'design'],
    queryFn: api.settings.design,
    retry: 1,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const customCSS = designData?.data?.custom_css || '';
  const adminCustomCSS = (designData?.data as any)?.admin_custom_css || '';

  useEffect(() => {
    // إزالة أي CSS مخصص سابق
    const existingStyle = document.getElementById(`custom-css-${type}`);
    if (existingStyle) {
      existingStyle.remove();
    }

    // إضافة CSS مخصص جديد
    if (customCSS && type === 'frontend') {
      const style = document.createElement('style');
      style.id = `custom-css-${type}`;
      style.textContent = customCSS;
      document.head.appendChild(style);
    }

    if (adminCustomCSS && type === 'admin') {
      const style = document.createElement('style');
      style.id = `custom-css-${type}`;
      style.textContent = adminCustomCSS;
      document.head.appendChild(style);
    }

    // تنظيف عند إلغاء التحميل
    return () => {
      const style = document.getElementById(`custom-css-${type}`);
      if (style) {
        style.remove();
      }
    };
  }, [customCSS, adminCustomCSS, type]);

  return null; // هذا المكون لا يعرض أي شيء مرئي
};

export default CustomCSS;
