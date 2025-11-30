import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Package, TrendingUp, Users } from 'lucide-react';

interface VendorSplashScreenProps {
  isVisible: boolean;
  onComplete?: () => void;
  duration?: number;
}

const VendorSplashScreen: React.FC<VendorSplashScreenProps> = ({ 
  isVisible, 
  onComplete, 
  duration = 3000 
}) => {
  const [showContent, setShowContent] = useState(false);
  const [loadingText, setLoadingText] = useState('جاري التحميل...');

  useEffect(() => {
    if (isVisible) {
      setShowContent(true);
      
      // تغيير نص التحميل
      const textInterval = setInterval(() => {
        setLoadingText(prev => {
          switch (prev) {
            case 'جاري التحميل...':
              return 'جاري تحضير لوحة التحكم...';
            case 'جاري تحضير لوحة التحكم...':
              return 'جاري تحميل البيانات...';
            case 'جاري تحميل البيانات...':
              return 'مرحباً بك في لوحة تحكم المورد';
            default:
              return 'جاري التحميل...';
          }
        });
      }, 800);

      const timer = setTimeout(() => {
        setShowContent(false);
        clearInterval(textInterval);
        setTimeout(() => {
          onComplete?.();
        }, 500);
      }, duration);

      return () => {
        clearTimeout(timer);
        clearInterval(textInterval);
      };
    }
  }, [isVisible, duration, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && showContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-blue-50"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="vendorGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#10b981" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#vendorGrid)" />
            </svg>
          </div>

          <div className="relative flex flex-col items-center">
            {/* Main Logo Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                duration: 1.2, 
                ease: "easeOut",
                type: "spring",
                stiffness: 100 
              }}
              className="mb-8"
            >
              <svg
                width="140"
                height="140"
                viewBox="0 0 140 140"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-2xl"
              >
                {/* Outer Ring */}
                <motion.circle
                  cx="70"
                  cy="70"
                  r="65"
                  stroke="url(#vendorGradient1)"
                  strokeWidth="4"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                />
                
                {/* Inner Circle Background */}
                <circle cx="70" cy="70" r="55" fill="url(#vendorGradient2)" />
                
                {/* Central Icon - Store/Dashboard Symbol */}
                <motion.g
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 1 }}
                >
                  {/* Store Building */}
                  <rect x="45" y="50" width="50" height="35" rx="3" fill="white" />
                  <rect x="50" y="45" width="40" height="10" rx="2" fill="white" />
                  
                  {/* Store Windows */}
                  <rect x="52" y="55" width="8" height="8" rx="1" fill="url(#vendorGradient3)" />
                  <rect x="65" y="55" width="8" height="8" rx="1" fill="url(#vendorGradient3)" />
                  <rect x="78" y="55" width="8" height="8" rx="1" fill="url(#vendorGradient3)" />
                  
                  {/* Store Door */}
                  <rect x="60" y="70" width="10" height="15" rx="1" fill="url(#vendorGradient3)" />
                  
                  {/* Store Sign */}
                  <rect x="55" y="40" width="30" height="8" rx="2" fill="white" />
                  <text x="70" y="46" textAnchor="middle" className="text-xs font-bold fill-emerald-600">STORE</text>
                </motion.g>

                {/* Floating Icons */}
                <motion.g>
                  {/* Package Icon */}
                  <motion.g
                    initial={{ opacity: 0, scale: 0, x: 20, y: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                  >
                    <rect x="25" y="25" width="12" height="12" rx="2" fill="url(#vendorGradient4)" />
                    <rect x="27" y="27" width="8" height="8" rx="1" fill="white" />
                  </motion.g>
                  
                  {/* Chart Icon */}
                  <motion.g
                    initial={{ opacity: 0, scale: 0, x: -20, y: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.4 }}
                  >
                    <rect x="103" y="25" width="12" height="12" rx="2" fill="url(#vendorGradient4)" />
                    <path d="M105 30 L107 28 L109 32 L111 30 L113 35" stroke="white" strokeWidth="1.5" fill="none" />
                  </motion.g>
                  
                  {/* Users Icon */}
                  <motion.g
                    initial={{ opacity: 0, scale: 0, x: 20, y: -20 }}
                    animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.6 }}
                  >
                    <rect x="25" y="103" width="12" height="12" rx="2" fill="url(#vendorGradient4)" />
                    <circle cx="29" cy="107" r="2" fill="white" />
                    <circle cx="33" cy="107" r="2" fill="white" />
                    <circle cx="31" cy="111" r="1.5" fill="white" />
                  </motion.g>
                  
                  {/* Package Icon */}
                  <motion.g
                    initial={{ opacity: 0, scale: 0, x: -20, y: -20 }}
                    animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.8 }}
                  >
                    <rect x="103" y="103" width="12" height="12" rx="2" fill="url(#vendorGradient4)" />
                    <rect x="105" y="105" width="8" height="8" rx="1" fill="white" />
                  </motion.g>
                </motion.g>

                {/* Floating Particles */}
                <motion.g>
                  {[...Array(12)].map((_, i) => (
                    <motion.circle
                      key={i}
                      cx={30 + (i * 8)}
                      cy={20 + Math.sin(i) * 15}
                      r="1.5"
                      fill="url(#vendorGradient5)"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ 
                        opacity: [0, 1, 0],
                        y: [10, -10, 10]
                      }}
                      transition={{
                        duration: 2,
                        delay: 2 + (i * 0.1),
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                  ))}
                </motion.g>

                {/* Gradients */}
                <defs>
                  <linearGradient id="vendorGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="50%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                  <linearGradient id="vendorGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                  <linearGradient id="vendorGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                  <linearGradient id="vendorGradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                  <radialGradient id="vendorGradient5" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </radialGradient>
                </defs>
              </svg>
            </motion.div>

            {/* Brand Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
                مزارع الطيبات
              </h1>
              <p className="text-gray-600 text-xl font-medium mb-2">
                لوحة تحكم المورد
              </p>
              <p className="text-gray-500 text-sm">
                إدارة متجرك بسهولة ومرونة
              </p>
            </motion.div>

            {/* Loading Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.8 }}
              className="mt-8"
            >
              <div className="flex space-x-2 rtl:space-x-reverse mb-4">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                      duration: 0.8,
                      delay: i * 0.2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                ))}
              </div>
              
              <motion.div
                key={loadingText}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-gray-600 text-sm font-medium"
              >
                {loadingText}
              </motion.div>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "250px" }}
              transition={{ duration: 1, delay: 2 }}
              className="mt-6 h-2 bg-gray-200 rounded-full overflow-hidden"
            >
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: duration / 1000 - 0.5, delay: 2.2 }}
              />
            </motion.div>

            {/* Features Icons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.5 }}
              className="mt-8 flex space-x-6 rtl:space-x-reverse"
            >
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
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VendorSplashScreen;
