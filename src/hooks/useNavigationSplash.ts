import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface UseNavigationSplashOptions {
  enabled?: boolean;
  duration?: number;
  excludeRoutes?: string[];
  adminRoutesOnly?: boolean;
}

export const useNavigationSplash = (options: UseNavigationSplashOptions = {}) => {
  const {
    enabled = true,
    duration = 1500,
    excludeRoutes = ['/'],
    adminRoutesOnly = true
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!enabled) return;

    // Check if current route should show splash
    const shouldShowSplash = () => {
      const currentPath = location.pathname;
      
      // Skip excluded routes
      if (excludeRoutes.includes(currentPath)) return false;
      
      // If adminRoutesOnly is true, only show for specific admin routes (not vendor routes)
      if (adminRoutesOnly) {
        return currentPath.startsWith('/admin') ||
               currentPath.includes('dashboard') && !currentPath.startsWith('/vendor');
      }
      
      return true;
    };

    if (shouldShowSplash()) {
      setIsNavigating(true);
      setIsVisible(true);
    }
  }, [location.pathname, enabled, excludeRoutes, adminRoutesOnly]);

  const handleSplashComplete = () => {
    setIsVisible(false);
    setIsNavigating(false);
  };

  return {
    isVisible,
    isNavigating,
    onComplete: handleSplashComplete,
    duration
  };
};

export default useNavigationSplash;
