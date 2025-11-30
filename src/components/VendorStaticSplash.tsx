import React from 'react';
import { Store, Package, TrendingUp, Users } from 'lucide-react';

interface VendorStaticSplashProps {
  isVisible: boolean;
  onClose?: () => void;
}

const VendorStaticSplash: React.FC<VendorStaticSplashProps> = ({ 
  isVisible, 
  onClose 
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="vendorStaticGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#10b981" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#vendorStaticGrid)" />
        </svg>
      </div>

      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 transition-colors"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      <div className="relative flex flex-col items-center">
        {/* Main Logo - Static */}
        <div className="mb-8">
          <svg
            width="140"
            height="140"
            viewBox="0 0 140 140"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-2xl"
          >
            {/* Outer Ring - Static */}
            <circle
              cx="70"
              cy="70"
              r="65"
              stroke="url(#vendorStaticGradient1)"
              strokeWidth="4"
              fill="none"
            />
            
            {/* Inner Circle Background */}
            <circle cx="70" cy="70" r="55" fill="url(#vendorStaticGradient2)" />
            
            {/* Central Icon - Store/Dashboard Symbol - Static */}
            <g>
              {/* Store Building */}
              <rect x="45" y="50" width="50" height="35" rx="3" fill="white" />
              <rect x="50" y="45" width="40" height="10" rx="2" fill="white" />
              
              {/* Store Windows */}
              <rect x="52" y="55" width="8" height="8" rx="1" fill="url(#vendorStaticGradient3)" />
              <rect x="65" y="55" width="8" height="8" rx="1" fill="url(#vendorStaticGradient3)" />
              <rect x="78" y="55" width="8" height="8" rx="1" fill="url(#vendorStaticGradient3)" />
              
              {/* Store Door */}
              <rect x="60" y="70" width="10" height="15" rx="1" fill="url(#vendorStaticGradient3)" />
              
              {/* Store Sign */}
              <rect x="55" y="40" width="30" height="8" rx="2" fill="white" />
              <text x="70" y="46" textAnchor="middle" className="text-xs font-bold fill-emerald-600">STORE</text>
            </g>

            {/* Floating Icons - Static */}
            <g>
              {/* Package Icon */}
              <g>
                <rect x="25" y="25" width="12" height="12" rx="2" fill="url(#vendorStaticGradient4)" />
                <rect x="27" y="27" width="8" height="8" rx="1" fill="white" />
              </g>
              
              {/* Chart Icon */}
              <g>
                <rect x="103" y="25" width="12" height="12" rx="2" fill="url(#vendorStaticGradient4)" />
                <path d="M105 30 L107 28 L109 32 L111 30 L113 35" stroke="white" strokeWidth="1.5" fill="none" />
              </g>
              
              {/* Users Icon */}
              <g>
                <rect x="25" y="103" width="12" height="12" rx="2" fill="url(#vendorStaticGradient4)" />
                <circle cx="29" cy="107" r="2" fill="white" />
                <circle cx="33" cy="107" r="2" fill="white" />
                <circle cx="31" cy="111" r="1.5" fill="white" />
              </g>
              
              {/* Package Icon */}
              <g>
                <rect x="103" y="103" width="12" height="12" rx="2" fill="url(#vendorStaticGradient4)" />
                <rect x="105" y="105" width="8" height="8" rx="1" fill="white" />
              </g>
            </g>

            {/* Gradients */}
            <defs>
              <linearGradient id="vendorStaticGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
              <linearGradient id="vendorStaticGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id="vendorStaticGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
              <linearGradient id="vendorStaticGradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Brand Text - Static */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
            إنجب
          </h1>
          <p className="text-gray-600 text-xl font-medium mb-2">
            لوحة التحكم
          </p>
          <p className="text-gray-500 text-sm">
            إدارة متجرك بسهولة ومرونة
          </p>
        </div>

        {/* Loading Animation - Static */}
        <div className="mt-8">
          <div className="flex space-x-2 rtl:space-x-reverse mb-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"
              />
            ))}
          </div>
          
          <p className="text-gray-600 text-sm font-medium text-center">
            جاري التحميل...
          </p>
        </div>

        {/* Progress Bar - Static */}
        <div className="mt-6 h-2 bg-gray-200 rounded-full overflow-hidden w-64">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full w-3/4" />
        </div>

        {/* Features Icons - Static */}
        <div className="mt-8 flex space-x-6 rtl:space-x-reverse">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-2">
              <Store className="h-5 w-5 text-emerald-600" />
            </div>
            <span className="text-xs text-gray-600">إدارة المتجر</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-xs text-gray-600">المنتجات</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <span className="text-xs text-gray-600">التقارير</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
              <Users className="h-5 w-5 text-orange-600" />
            </div>
            <span className="text-xs text-gray-600">العملاء</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorStaticSplash;
