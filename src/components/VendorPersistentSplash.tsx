import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Store, Package, TrendingUp, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VendorPersistentSplashProps {
  isVisible: boolean;
  onClose?: () => void;
}

const VendorPersistentSplash: React.FC<VendorPersistentSplashProps> = ({ 
  isVisible, 
  onClose 
}) => {
  const [loadingText, setLoadingText] = useState('جاري التحميل...');
  const [showCloseButton, setShowCloseButton] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // تغيير نص التحميل بشكل مستمر
      const textInterval = setInterval(() => {
        setLoadingText(prev => {
          switch (prev) {
            case 'جاري التحميل...':
              return 'جاري تحضير لوحة التحكم...';
            case 'جاري تحضير لوحة التحكم...':
              return 'جاري تحميل البيانات...';
            case 'جاري تحميل البيانات...':
              return 'مرحباً بك في لوحة تحكم المورد';
            case 'مرحباً بك في لوحة تحكم المورد':
              return 'إدارة متجرك بسهولة ومرونة';
            case 'إدارة متجرك بسهولة ومرونة':
              return 'جاري التحميل...';
            default:
              return 'جاري التحميل...';
          }
        });
      }, 2000);

      // إظهار زر الإغلاق بعد 5 ثوان
      const closeButtonTimer = setTimeout(() => {
        setShowCloseButton(true);
      }, 5000);

      return () => {
        clearInterval(textInterval);
        clearTimeout(closeButtonTimer);
      };
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
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
            <pattern id="vendorPersistentGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#10b981" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#vendorPersistentGrid)" />
        </svg>
      </div>

      {/* Close Button */}
      {showCloseButton && onClose && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 left-4 z-10 bg-white/80 hover:bg-white shadow-lg"
        >
          <X className="h-5 w-5" />
        </Button>
      )}

      <div className="relative flex flex-col items-center">
        {/* Main Logo Animation - Continuous */}
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "linear"
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
            {/* Outer Ring - Continuous Rotation */}
            <motion.circle
              cx="70"
              cy="70"
              r="65"
              stroke="url(#vendorPersistentGradient1)"
              strokeWidth="4"
              fill="none"
              animate={{ 
                pathLength: [0, 1, 0],
                rotate: [0, 360]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Inner Circle Background */}
            <circle cx="70" cy="70" r="55" fill="url(#vendorPersistentGradient2)" />
            
            {/* Central Icon - Store/Dashboard Symbol */}
            <motion.g
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Store Building */}
              <rect x="45" y="50" width="50" height="35" rx="3" fill="white" />
              <rect x="50" y="45" width="40" height="10" rx="2" fill="white" />
              
              {/* Store Windows */}
              <rect x="52" y="55" width="8" height="8" rx="1" fill="url(#vendorPersistentGradient3)" />
              <rect x="65" y="55" width="8" height="8" rx="1" fill="url(#vendorPersistentGradient3)" />
              <rect x="78" y="55" width="8" height="8" rx="1" fill="url(#vendorPersistentGradient3)" />
              
              {/* Store Door */}
              <rect x="60" y="70" width="10" height="15" rx="1" fill="url(#vendorPersistentGradient3)" />
              
              {/* Store Sign */}
              <rect x="55" y="40" width="30" height="8" rx="2" fill="white" />
              <text x="70" y="46" textAnchor="middle" className="text-xs font-bold fill-emerald-600">STORE</text>
            </motion.g>

            {/* Floating Icons - Continuous Movement */}
            <motion.g>
              {/* Package Icon */}
              <motion.g
                animate={{ 
                  x: [0, 10, 0],
                  y: [0, -5, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <rect x="25" y="25" width="12" height="12" rx="2" fill="url(#vendorPersistentGradient4)" />
                <rect x="27" y="27" width="8" height="8" rx="1" fill="white" />
              </motion.g>
              
              {/* Chart Icon */}
              <motion.g
                animate={{ 
                  x: [0, -10, 0],
                  y: [0, 5, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <rect x="103" y="25" width="12" height="12" rx="2" fill="url(#vendorPersistentGradient4)" />
                <path d="M105 30 L107 28 L109 32 L111 30 L113 35" stroke="white" strokeWidth="1.5" fill="none" />
              </motion.g>
              
              {/* Users Icon */}
              <motion.g
                animate={{ 
                  x: [0, 8, 0],
                  y: [0, 8, 0],
                  rotate: [0, 3, 0]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <rect x="25" y="103" width="12" height="12" rx="2" fill="url(#vendorPersistentGradient4)" />
                <circle cx="29" cy="107" r="2" fill="white" />
                <circle cx="33" cy="107" r="2" fill="white" />
                <circle cx="31" cy="111" r="1.5" fill="white" />
              </motion.g>
              
              {/* Package Icon */}
              <motion.g
                animate={{ 
                  x: [0, -8, 0],
                  y: [0, -8, 0],
                  rotate: [0, -3, 0]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <rect x="103" y="103" width="12" height="12" rx="2" fill="url(#vendorPersistentGradient4)" />
                <rect x="105" y="105" width="8" height="8" rx="1" fill="white" />
              </motion.g>
            </motion.g>

            {/* Floating Particles - Continuous */}
            <motion.g>
              {[...Array(12)].map((_, i) => (
                <motion.circle
                  key={i}
                  cx={30 + (i * 8)}
                  cy={20 + Math.sin(i) * 15}
                  r="1.5"
                  fill="url(#vendorPersistentGradient5)"
                  animate={{ 
                    opacity: [0, 1, 0],
                    y: [10, -10, 10],
                    scale: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2 + (i * 0.2),
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.g>

            {/* Gradients */}
            <defs>
              <linearGradient id="vendorPersistentGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
              <linearGradient id="vendorPersistentGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id="vendorPersistentGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
              <linearGradient id="vendorPersistentGradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <radialGradient id="vendorPersistentGradient5" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f59e0b" />
              </radialGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Brand Text */}
        <motion.div
          animate={{ 
            y: [0, -5, 0],
            scale: [1, 1.02, 1]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
            إنجب
          </h1>
          <p className="text-gray-600 text-xl font-medium mb-2">
            لوحة التحكم
          </p>
          <p className="text-gray-500 text-sm">
            إدارة متجرك بسهولة ومرونة
          </p>
        </motion.div>

        {/* Loading Animation - Continuous */}
        <motion.div
          className="mt-8"
        >
          <div className="flex space-x-2 rtl:space-x-reverse mb-4">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 1, 0.7],
                  y: [0, -5, 0]
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
          
          <motion.div
            key={loadingText}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-gray-600 text-sm font-medium"
          >
            {loadingText}
          </motion.div>
        </motion.div>

        {/* Progress Bar - Continuous */}
        <motion.div
          className="mt-6 h-2 bg-gray-200 rounded-full overflow-hidden w-64"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"
            animate={{ 
              width: ["0%", "100%", "0%"],
              x: [0, 0, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Features Icons - Continuous Movement */}
        <motion.div
          animate={{ 
            y: [0, -3, 0],
            scale: [1, 1.02, 1]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mt-8 flex space-x-6 rtl:space-x-reverse"
        >
          <motion.div 
            className="flex flex-col items-center"
            animate={{ 
              y: [0, -2, 0],
              rotate: [0, 2, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-2">
              <Store className="h-5 w-5 text-emerald-600" />
            </div>
            <span className="text-xs text-gray-600">إدارة المتجر</span>
          </motion.div>
          <motion.div 
            className="flex flex-col items-center"
            animate={{ 
              y: [0, 2, 0],
              rotate: [0, -2, 0]
            }}
            transition={{ 
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-xs text-gray-600">المنتجات</span>
          </motion.div>
          <motion.div 
            className="flex flex-col items-center"
            animate={{ 
              y: [0, -2, 0],
              rotate: [0, 2, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <span className="text-xs text-gray-600">التقارير</span>
          </motion.div>
          <motion.div 
            className="flex flex-col items-center"
            animate={{ 
              y: [0, 2, 0],
              rotate: [0, -2, 0]
            }}
            transition={{ 
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
              <Users className="h-5 w-5 text-orange-600" />
            </div>
            <span className="text-xs text-gray-600">العملاء</span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default VendorPersistentSplash;
