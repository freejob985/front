import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Star,
  Eye,
  Edit,
  Plus,
  Download,
  Filter,
  BarChart3,
  AlertCircle,
  Bell
} from "lucide-react";
import { useState, useEffect } from "react";
import VendorSplashScreen from "@/components/VendorSplashScreen";
import VendorHeader from "@/components/VendorHeader";
import vendorAuthService from "@/services/vendorAuth";
import type { VendorProfile } from "@/services/vendorAuth";
import { api } from "@/lib/api";


const StatsCards = ({ statsData }: { statsData: any }) => {
  const stats = [
    {
      title: "إجمالي المبيعات",
      value: `${statsData?.total_sales || 0} دينار`,
      change: `${statsData?.total_sales_change >= 0 ? '+' : ''}${statsData?.total_sales_change || 0}%`,
      changeType: statsData?.total_sales_change >= 0 ? "increase" : "decrease",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "الطلبات الجديدة",
      value: `${statsData?.new_orders || 0}`,
      change: `${statsData?.new_orders_change >= 0 ? '+' : ''}${statsData?.new_orders_change || 0}`,
      changeType: statsData?.new_orders_change >= 0 ? "increase" : "decrease",
      icon: ShoppingCart,
      color: "text-blue-600"
    },
    {
      title: "المنتجات النشطة",
      value: `${statsData?.active_products || 0}`,
      change: `${statsData?.active_products_change >= 0 ? '+' : ''}${statsData?.active_products_change || 0}`,
      changeType: statsData?.active_products_change >= 0 ? "increase" : "decrease",
      icon: Package,
      color: "text-purple-600"
    },
    {
      title: "العملاء الجدد",
      value: `${statsData?.new_customers || 0}`,
      change: `${statsData?.new_customers_change >= 0 ? '+' : ''}${statsData?.new_customers_change || 0}`,
      changeType: statsData?.new_customers_change >= 0 ? "increase" : "decrease",
      icon: Users,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  {stat.changeType === "increase" ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    stat.changeType === "increase" ? "text-green-600" : "text-red-600"
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-600">من الشهر الماضي</span>
                </div>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const QuickActions = () => {
  const actions = [
    {
      title: "إضافة منتج جديد",
      description: "أضف منتج جديد لمتجرك",
      icon: Plus,
      link: "/vendor/add-product",
      color: "bg-green-500"
    },
    {
      title: "منتجاتي",
      description: "تعديل وإدارة منتجاتك",
      icon: Package,
      link: "/vendor/products",
      color: "bg-blue-500"
    },
    {
      title: "طلبات المورد",
      description: "متابعة الطلبات الجديدة",
      icon: ShoppingCart,
      link: "/vendor/orders",
      color: "bg-purple-500"
    },
    {
      title: "التقارير",
      description: "عرض تقرير المبيعات",
      icon: BarChart3,
      link: "/vendor/reports",
      color: "bg-orange-500"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>الإجراءات السريعة</CardTitle>
        <CardDescription>الوصول السريع للمهام الأساسية</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <Link key={index} to={action.link}>
              <div className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer">
                <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium">{action.title}</h4>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const RecentOrders = ({ orders }: { orders: any[] }) => {

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "shipped": return "bg-purple-100 text-purple-800";
      case "delivered": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "في الانتظار";
      case "processing": return "قيد التحضير";
      case "shipped": return "تم الشحن";
      case "delivered": return "تم التوصيل";
      default: return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>الطلبات الأخيرة</CardTitle>
            <CardDescription>آخر الطلبات الواردة</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/vendor/orders">
              عرض الكل
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!orders || orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>لا توجد طلبات حتى الآن</p>
            </div>
          ) : (
            orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div>
                  <h4 className="font-medium">{order.order_number || order.id}</h4>
                  <p className="text-sm text-gray-600">{order.customer_name}</p>
                </div>
                <div className="text-sm">
                  <p>{order.items_count} منتج</p>
                  <p className="text-gray-600">{new Date(order.created_at).toLocaleDateString('ar-KW')}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{order.total} دينار</p>
                <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </Badge>
              </div>
            </div>
          ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const TopProducts = ({ products }: { products: any[] }) => {

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>أفضل المنتجات</CardTitle>
            <CardDescription>المنتجات الأكثر مبيعاً</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/vendor/products">
              منتجاتي
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!products || products.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>لا توجد منتجات بعد</p>
            </div>
          ) : (
            products.map((product, index) => (
            <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
              <div 
                className="w-12 h-12 bg-cover bg-center rounded-lg"
                style={{ backgroundImage: `url(${product.image || 'https://images.pexels.com/photos/3746517/pexels-photo-3746517.jpeg'})` }}
              ></div>
              <div className="flex-1">
                <h4 className="font-medium">{product.name}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{product.sales_count} مبيعة</span>
                  <span>{product.revenue} دينار</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{Number(product.rating ?? 0).toFixed(1)}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const SalesChart = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>إحصائيات المبيعات</CardTitle>
            <CardDescription>المبيعات خلال آخر 7 أيام</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 ml-2" />
              تصدير
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 ml-2" />
              تصفية
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">رسم بياني للمبيعات</p>
            <p className="text-sm text-gray-500">سيتم عرض إحصائيات المبيعات هنا</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const NotificationsPanel = ({ notifications, onMarkAllRead }: { notifications: any[]; onMarkAllRead: () => void }) => {

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order": return <ShoppingCart className="h-4 w-4 text-blue-600" />;
      case "stock": return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "review": return <Star className="h-4 w-4 text-yellow-600" />;
      case "order_status": return <ShoppingCart className="h-4 w-4 text-green-600" />;
      default: return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getNotificationColor = (color: string) => {
    switch (color) {
      case "success": return "bg-green-50 border-green-200";
      case "warning": return "bg-yellow-50 border-yellow-200";
      case "error": return "bg-red-50 border-red-200";
      case "info": return "bg-blue-50 border-blue-200";
      default: return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>الإشعارات</CardTitle>
          <Button variant="ghost" size="sm" onClick={onMarkAllRead}>
            تحديد الكل كمقروء
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>لا توجد إشعارات</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div key={notification.id} className={`flex items-start gap-3 p-3 rounded-lg border ${
                notification.unread 
                  ? getNotificationColor(notification.color || 'info') 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                {getNotificationIcon(notification.type)}
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{notification.title}</h4>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {notification.time_ago || new Date(notification.created_at).toLocaleDateString('ar-KW')}
                  </p>
                </div>
                {notification.unread && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function VendorDashboard() {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // التحقق من حالة تسجيل الدخول
        if (!vendorAuthService.isLoggedIn()) {
          navigate('/vendor/login');
          return;
        }

        // الحصول على معلومات المورد
        const vendorData = await vendorAuthService.getCurrentVendor();
        setVendor(vendorData);

        // جلب بيانات لوحة التحكم
        try {
          console.log('جاري تحميل بيانات لوحة التحكم...');
          
          const [statsResponse, ordersResponse, productsResponse, notificationsResponse] = await Promise.all([
            api.vendor.dashboard.stats(),
            api.vendor.dashboard.recentOrders(),
            api.vendor.dashboard.topProducts(),
            api.vendor.dashboard.notifications()
          ]);

          console.log('استجابة الإحصائيات:', statsResponse);
          console.log('استجابة الطلبات:', ordersResponse);
          console.log('استجابة المنتجات:', productsResponse);
          console.log('استجابة الإشعارات:', notificationsResponse);

          if (statsResponse.success) {
            setStatsData(statsResponse.data);
          }
          
          // معالجة الطلبات - دعم response structures مختلفة
          if (ordersResponse.success && Array.isArray(ordersResponse.data)) {
            setRecentOrders(ordersResponse.data);
          } else if (ordersResponse.success) {
            // بعض APIs قد ترجع الطلبات في orders بدلاً من data
            const ordersData = (ordersResponse as any).orders;
            if (Array.isArray(ordersData)) {
              setRecentOrders(ordersData);
            }
          }
          
          // معالجة المنتجات - دعم response structures مختلفة
          if (productsResponse.success && Array.isArray(productsResponse.data)) {
            setTopProducts(productsResponse.data);
          } else if (productsResponse.success) {
            // بعض APIs قد ترجع المنتجات في products بدلاً من data
            const productsData = (productsResponse as any).products;
            if (Array.isArray(productsData)) {
              setTopProducts(productsData);
            }
          }
          
          // معالجة الإشعارات - دعم response structures مختلفة
          if (notificationsResponse.success && Array.isArray(notificationsResponse.data)) {
            setNotifications(notificationsResponse.data);
          } else if (notificationsResponse.success) {
            // بعض APIs قد ترجع الإشعارات في notifications بدلاً من data
            const notificationsData = (notificationsResponse as any).notifications;
            if (Array.isArray(notificationsData)) {
              setNotifications(notificationsData);
            }
          }
        } catch (apiError) {
          console.error('Error loading dashboard data:', apiError);
          // استخدام بيانات وهمية في حالة فشل API
          setStatsData({
            total_sales: 1569,
            total_sales_change: 12.5,
            new_orders: 24,
            new_orders_change: 8,
            active_products: 127,
            active_products_change: 5,
            new_customers: 42,
            new_customers_change: -3
          });
          setRecentOrders([
            {
              id: "ORD-001234",
              order_number: "ORD-001234",
              customer_name: "أحمد محمد",
              customer_phone: "+965 12345678",
              customer_address: "الكويت - حولي",
              total: 45,
              status: "pending",
              status_label: "في الانتظار",
              items_count: 3,
              created_at: "2024-01-15T10:30:00Z",
              items: [
                { name: "تفاح أحمر طازج - كيلو", quantity: 2, price: 24, image: "https://images.pexels.com/photos/3746517/pexels-photo-3746517.jpeg" },
                { name: "خيار طازج محلي - كيلو", quantity: 1, price: 8, image: "https://images.pexels.com/photos/8805175/pexels-photo-8805175.jpeg" }
              ]
            }
          ]);
          setTopProducts([
            {
              id: 1,
              name: "تفاح أحمر طازج - كيلو",
              sales_count: 156,
              revenue: 1872,
              rating: 4.8,
              image: "https://images.pexels.com/photos/3746517/pexels-photo-3746517.jpeg"
            }
          ]);
          // Keep existing notifications if API fails
          console.log('Using fallback notifications data');
        }

        // إظهار SplashScreen لمدة 3 ثوان ثم إخفاؤها
        setTimeout(() => {
          setShowSplash(false);
          setLoading(false);
        }, 3000);

      } catch (error) {
        console.error('Error initializing dashboard:', error);
        navigate('/vendor/login');
      }
    };

    initializeDashboard();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await vendorAuthService.logout();
      navigate('/vendor/login');
    } catch (error) {
      console.error('Logout error:', error);
      // حتى لو فشل API، نعيد التوجيه
      navigate('/vendor/login');
    }
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
    setLoading(false);
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      const response = await api.vendor.dashboard.markNotificationsRead() as { success: boolean };
      if (response.success) {
        setNotifications(notifications.map(notification => ({ ...notification, unread: false })));
        // You can add toast notification here if you have a toast system
        console.log('تم تحديد جميع الإشعارات كمقروءة');
      } else {
        console.error('حدث خطأ في تحديد الإشعارات كمقروءة');
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  if (loading) {
    return (
      <VendorSplashScreen 
        isVisible={showSplash}
        onComplete={handleSplashComplete}
        duration={3000}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <VendorHeader 
        onLogout={handleLogout}
        title="لوحة تحكم المورد"
        subtitle="مزارع الطيبات"
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">
            مرحباً بك، {vendor?.name || 'مزارع الطيبات'}
          </h2>
          <p className="text-gray-600">إليك نظرة عامة على أداء متجرك اليوم</p>
        </div>

        <div className="space-y-8">
          <StatsCards statsData={statsData} />
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <SalesChart />
              <RecentOrders orders={recentOrders} />
            </div>
            
            <div className="space-y-8">
              <QuickActions />
              <TopProducts products={topProducts} />
              <NotificationsPanel notifications={notifications} onMarkAllRead={handleMarkAllNotificationsRead} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
