import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  isVisible: boolean;
  onComplete?: () => void;
  duration?: number;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ 
  isVisible, 
  onComplete, 
  duration = 2000 
}) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowContent(true);
      const timer = setTimeout(() => {
        setShowContent(false);
        setTimeout(() => {
          onComplete?.();
        }, 500);
      }, duration);

      return () => clearTimeout(timer);
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
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#10b981" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
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
                width="120"
                height="120"
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-2xl"
              >
                {/* Outer Ring */}
                <motion.circle
                  cx="60"
                  cy="60"
                  r="55"
                  stroke="url(#gradient1)"
                  strokeWidth="3"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                />
                
                {/* Inner Circle Background */}
                <circle cx="60" cy="60" r="45" fill="url(#gradient2)" />
                
                {/* Central Icon - Shopping/Admin Symbol */}
                <motion.g
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 1 }}
                >
                  {/* Dashboard Grid */}
                  <rect x="35" y="35" width="12" height="12" rx="2" fill="white" />
                  <rect x="52" y="35" width="12" height="12" rx="2" fill="white" />
                  <rect x="69" y="35" width="12" height="12" rx="2" fill="white" />
                  <rect x="35" y="52" width="12" height="12" rx="2" fill="white" />
                  <rect x="52" y="52" width="12" height="12" rx="2" fill="white" />
                  <rect x="69" y="52" width="12" height="12" rx="2" fill="white" />
                  <rect x="35" y="69" width="12" height="12" rx="2" fill="white" />
                  <rect x="52" y="69" width="12" height="12" rx="2" fill="white" />
                  <rect x="69" y="69" width="12" height="12" rx="2" fill="white" />
                </motion.g>

                {/* Floating Particles */}
                <motion.g>
                  {[...Array(8)].map((_, i) => (
                    <motion.circle
                      key={i}
                      cx={30 + (i * 15)}
                      cy={20 + Math.sin(i) * 10}
                      r="2"
                      fill="url(#gradient3)"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ 
                        opacity: [0, 1, 0],
                        y: [10, -10, 10]
                      }}
                      transition={{
                        duration: 2,
                        delay: 1.5 + (i * 0.1),
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                  ))}
                </motion.g>

                {/* Gradients */}
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="50%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                  <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                  <radialGradient id="gradient3" cx="50%" cy="50%" r="50%">
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
                إنجب
              </h1>
              <p className="text-gray-600 text-lg font-medium">
                لوحة التحكم
              </p>
            </motion.div>

            {/* Loading Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.8 }}
              className="mt-8"
            >
              <div className="flex space-x-2 rtl:space-x-reverse">
                {[...Array(3)].map((_, i) => (
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
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "200px" }}
              transition={{ duration: 1, delay: 2 }}
              className="mt-6 h-1 bg-gray-200 rounded-full overflow-hidden"
            >
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: duration / 1000 - 0.5, delay: 2.2 }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
