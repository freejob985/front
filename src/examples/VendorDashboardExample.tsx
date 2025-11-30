// Example: Vendor Dashboard with improved authentication handling
// مثال: لوحة تحكم البائع مع معالجة محسنة للمصادقة

import React, { useEffect, useState } from 'react';
import vendorAuthService from '../services/vendorAuth';
import AuthErrorHandler from '../services/authErrorHandler';
import apiService from '../services/api';

interface DashboardData {
  stats: any;
  recentOrders: any[];
  topProducts: any[];
  notifications: any[];
}

const VendorDashboardExample: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize dashboard with authentication check
  const initializeDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      // Step 1: Check login status with server validation
      console.log('🔍 Checking vendor login status...');
      const loginStatus = await vendorAuthService.checkLoginStatus();
      
      if (!loginStatus) {
        console.warn('⚠️ Vendor not authenticated, redirecting to login');
        setError('يرجى تسجيل الدخول للوصول إلى لوحة التحكم');
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);
      console.log('✅ Vendor authenticated, loading dashboard data...');

      // Step 2: Load dashboard data with error handling
      const [stats, recentOrders, topProducts, notifications] = await Promise.all([
        AuthErrorHandler.withAuthErrorHandling(
          () => apiService.get('/vendor/dashboard/stats'),
          () => ({ total_orders: 0, total_revenue: 0, pending_orders: 0 })
        ),
        AuthErrorHandler.withAuthErrorHandling(
          () => apiService.get('/vendor/dashboard/recent-orders'),
          () => []
        ),
        AuthErrorHandler.withAuthErrorHandling(
          () => apiService.get('/vendor/dashboard/top-products'),
          () => []
        ),
        AuthErrorHandler.withAuthErrorHandling(
          () => apiService.get('/vendor/dashboard/notifications'),
          () => []
        )
      ]);

      // Step 3: Set dashboard data
      setDashboardData({
        stats: stats || { total_orders: 0, total_revenue: 0, pending_orders: 0 },
        recentOrders: recentOrders || [],
        topProducts: topProducts || [],
        notifications: notifications || []
      });

      console.log('✅ Dashboard data loaded successfully');

    } catch (error) {
      console.error('❌ Error initializing dashboard:', error);
      setError('حدث خطأ أثناء تحميل بيانات لوحة التحكم');
    } finally {
      setLoading(false);
    }
  };

  // Load dashboard on component mount
  useEffect(() => {
    initializeDashboard();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await vendorAuthService.logout();
      setIsAuthenticated(false);
      setDashboardData(null);
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  // Not authenticated state
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">غير مصرح بالوصول</h2>
          <p className="text-gray-600 mb-6">{error || 'يرجى تسجيل الدخول للوصول إلى لوحة التحكم'}</p>
          <button
            onClick={() => window.location.href = '/vendor/login'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            تسجيل الدخول
          </button>
        </div>
      </div>
    );
  }

  // Dashboard content
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">لوحة تحكم البائع</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">إجمالي الطلبات</h3>
            <p className="text-3xl font-bold text-blue-600">
              {dashboardData?.stats?.total_orders || 0}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">إجمالي الإيرادات</h3>
            <p className="text-3xl font-bold text-green-600">
              ${dashboardData?.stats?.total_revenue || 0}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">الطلبات المعلقة</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {dashboardData?.stats?.pending_orders || 0}
            </p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">الطلبات الأخيرة</h2>
          </div>
          <div className="p-6">
            {dashboardData?.recentOrders?.length ? (
              <div className="space-y-4">
                {dashboardData.recentOrders.map((order, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">طلب #{order.id}</p>
                      <p className="text-sm text-gray-600">{order.customer_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${order.total}</p>
                      <p className="text-sm text-gray-600">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">لا توجد طلبات حديثة</p>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">أفضل المنتجات</h2>
          </div>
          <div className="p-6">
            {dashboardData?.topProducts?.length ? (
              <div className="space-y-4">
                {dashboardData.topProducts.map((product, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{product.sales_count} مبيعة</p>
                      <p className="text-sm text-gray-600">${product.revenue}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">لا توجد منتجات</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboardExample;
