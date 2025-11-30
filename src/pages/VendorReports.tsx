import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  Download,
  Filter,
  ArrowLeft,
  PieChart,
  LineChart
} from "lucide-react";
import { useState, useEffect } from "react";
import VendorHeader from "@/components/VendorHeader";
import vendorAuthService from "@/services/vendorAuth";
import type { VendorProfile } from "@/services/vendorAuth";
import { api } from "@/lib/api";

const SalesChart = ({ salesData, loading }: { salesData: any; loading: boolean }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>إحصائيات المبيعات</CardTitle>
            <CardDescription>المبيعات خلال آخر 30 يوم</CardDescription>
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
        {loading ? (
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">جاري تحميل البيانات...</p>
            </div>
          </div>
        ) : salesData && salesData.sales_data && salesData.sales_data.length > 0 ? (
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <p className="text-gray-600">إجمالي المبيعات: {salesData.total_sales} دينار</p>
              <p className="text-sm text-gray-500">عدد الطلبات: {salesData.total_orders}</p>
            </div>
          </div>
        ) : (
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">لا توجد بيانات مبيعات</p>
              <p className="text-sm text-gray-500">سيتم عرض إحصائيات المبيعات هنا عند توفرها</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const TopProductsChart = ({ productsData, loading }: { productsData: any; loading: boolean }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>أفضل المنتجات</CardTitle>
            <CardDescription>المنتجات الأكثر مبيعاً</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 ml-2" />
            تصدير
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">جاري تحميل البيانات...</p>
            </div>
          </div>
        ) : productsData && productsData.products_with_sales && productsData.products_with_sales.length > 0 ? (
          <div className="h-64 bg-gray-50 rounded-lg p-4">
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {productsData.products_with_sales.slice(0, 5).map((product: any) => (
                <div key={product.id} className="flex justify-between items-center p-2 bg-white rounded">
                  <span className="text-sm font-medium">{product.name}</span>
                  <div className="text-right">
                    <span className="text-sm text-gray-600">{product.sales_count} مبيع</span>
                    <span className="text-xs text-gray-500 block">{product.revenue} دينار</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">لا توجد بيانات منتجات</p>
              <p className="text-sm text-gray-500">سيتم عرض إحصائيات المنتجات هنا عند توفرها</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const RevenueChart = ({ revenueData, loading }: { revenueData: any; loading: boolean }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>الإيرادات</CardTitle>
            <CardDescription>الإيرادات الشهرية</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 ml-2" />
            تصدير
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">جاري تحميل البيانات...</p>
            </div>
          </div>
        ) : revenueData && revenueData.revenue_data && revenueData.revenue_data.length > 0 ? (
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <LineChart className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <p className="text-gray-600">إجمالي الإيرادات: {revenueData.total_revenue} دينار</p>
              <p className="text-sm text-gray-500">متوسط قيمة الطلب: {revenueData.average_order_value} دينار</p>
            </div>
          </div>
        ) : (
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <LineChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">لا توجد بيانات إيرادات</p>
              <p className="text-sm text-gray-500">سيتم عرض إحصائيات الإيرادات هنا عند توفرها</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ReportFilters = ({ dateRange, setDateRange, category, setCategory }: { 
  dateRange: string; 
  setDateRange: (value: string) => void; 
  category: string; 
  setCategory: (value: string) => void; 
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>تصفية التقارير</CardTitle>
        <CardDescription>اختر الفترة والفئة لعرض التقارير</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">الفترة الزمنية</label>
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
            >
              <option value="7">آخر 7 أيام</option>
              <option value="30">آخر 30 يوم</option>
              <option value="90">آخر 3 أشهر</option>
              <option value="365">آخر سنة</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">الفئة</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
            >
              <option value="all">جميع الفئات</option>
              <option value="fruits-vegetables">خضروات وفواكه</option>
              <option value="dairy">منتجات الألبان</option>
              <option value="meat-poultry">لحوم ودواجن</option>
              <option value="bakery">مخبوزات</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <Button className="w-full">
              <Filter className="h-4 w-4 ml-2" />
              تطبيق التصفية
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const QuickStats = ({ salesData, productsData, loading }: { salesData: any; productsData: any; loading: boolean }) => {
  const stats = [
    {
      title: "إجمالي المبيعات",
      value: loading ? "..." : salesData ? `${salesData.total_sales || 0} دينار` : "0 دينار",
      change: "+12.5%",
      changeType: "increase",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "عدد الطلبات",
      value: loading ? "..." : salesData ? `${salesData.total_orders || 0}` : "0",
      change: "+8",
      changeType: "increase",
      icon: ShoppingCart,
      color: "text-blue-600"
    },
    {
      title: "المنتجات النشطة",
      value: loading ? "..." : productsData ? `${productsData.product_statistics?.active_products || 0}` : "0",
      change: "+5",
      changeType: "increase",
      icon: Package,
      color: "text-purple-600"
    },
    {
      title: "إجمالي المنتجات",
      value: loading ? "..." : productsData ? `${productsData.product_statistics?.total_products || 0}` : "0",
      change: "-3",
      changeType: "decrease",
      icon: Users,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

export default function VendorReports() {
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [salesData, setSalesData] = useState<any>(null);
  const [productsData, setProductsData] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any>(null);
  const [dateRange, setDateRange] = useState('30');
  const [category, setCategory] = useState('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVendorData = async () => {
      try {
        // التحقق من حالة تسجيل الدخول
        if (!vendorAuthService.isLoggedIn()) {
          navigate('/vendor/login');
          return;
        }

        const vendorData = await vendorAuthService.getCurrentVendor();
        setVendor(vendorData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading vendor data:', error);
        navigate('/vendor/login');
      }
    };

    loadVendorData();
  }, [navigate]);

  useEffect(() => {
    const loadReportsData = async () => {
      if (!vendor) return;
      
      try {
        setReportsLoading(true);
        setError(null);
        
        // حساب التواريخ
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - parseInt(dateRange));
        
        const dateFrom = startDate.toISOString().split('T')[0];
        const dateTo = endDate.toISOString().split('T')[0];
        
        // تحميل بيانات التقارير
        const [salesResponse, productsResponse, revenueResponse] = await Promise.all([
          api.vendor.reports.sales({ date_from: dateFrom, date_to: dateTo }),
          api.vendor.reports.products({ date_from: dateFrom, date_to: dateTo, category: category !== 'all' ? category : undefined }),
          api.vendor.reports.revenue({ date_from: dateFrom, date_to: dateTo })
        ]);
        
        if (salesResponse.success) {
          setSalesData(salesResponse.data);
        } else {
          console.error('Sales report error:', salesResponse);
        }
        
        if (productsResponse.success) {
          setProductsData(productsResponse.data);
        } else {
          console.error('Products report error:', productsResponse);
        }
        
        if (revenueResponse.success) {
          setRevenueData(revenueResponse.data);
        } else {
          console.error('Revenue report error:', revenueResponse);
        }
        
      } catch (error) {
        console.error('Error loading reports data:', error);
        setError('حدث خطأ في تحميل بيانات التقارير. يرجى المحاولة مرة أخرى.');
      } finally {
        setReportsLoading(false);
      }
    };

    loadReportsData();
  }, [vendor, dateRange, category]);

  const handleLogout = async () => {
    try {
      await vendorAuthService.logout();
      navigate('/vendor/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/vendor/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <VendorHeader 
        onLogout={handleLogout}
        title="تقارير المورد"
        subtitle="مزارع الطيبات"
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link to="/vendor/dashboard">
              <ArrowLeft className="h-4 w-4 ml-2" />
              العودة للوحة التحكم
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">تقارير المورد</h1>
          <p className="text-gray-600">عرض وتحليل أداء متجرك</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="text-red-600 ml-3">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-red-800">خطأ في تحميل البيانات</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        <QuickStats salesData={salesData} productsData={productsData} loading={reportsLoading} />
        <ReportFilters 
          dateRange={dateRange} 
          setDateRange={setDateRange} 
          category={category} 
          setCategory={setCategory} 
        />

        <div className="grid lg:grid-cols-2 gap-8">
          <SalesChart salesData={salesData} loading={reportsLoading} />
          <TopProductsChart productsData={productsData} loading={reportsLoading} />
        </div>

        <div className="mt-8">
          <RevenueChart revenueData={revenueData} loading={reportsLoading} />
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>تقرير الطلبات</CardTitle>
              <CardDescription>تفاصيل الطلبات حسب الحالة</CardDescription>
            </CardHeader>
            <CardContent>
              {reportsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
                      <div className="h-6 bg-gray-300 rounded w-8 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : salesData && salesData.sales_by_status ? (
                <div className="space-y-4">
                  {Object.entries(salesData.sales_by_status).map(([status, data]: [string, any]) => (
                    <div key={status} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{status}</span>
                      <Badge className="bg-blue-100 text-blue-800">{data.orders_count || 0}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">لا توجد بيانات</span>
                    <Badge className="bg-gray-100 text-gray-800">0</Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>تقرير المنتجات</CardTitle>
              <CardDescription>أداء المنتجات</CardDescription>
            </CardHeader>
            <CardContent>
              {reportsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
                      <div className="h-6 bg-gray-300 rounded w-8 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : productsData && productsData.products_by_type ? (
                <div className="space-y-4">
                  {Object.entries(productsData.products_by_type).map(([type, count]: [string, any]) => (
                    <div key={type} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{type === 'active' ? 'نشطة' : type === 'inactive' ? 'غير نشطة' : type === 'featured' ? 'مميزة' : 'طازجة'}</span>
                      <Badge className="bg-green-100 text-green-800">{count}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">لا توجد بيانات</span>
                    <Badge className="bg-gray-100 text-gray-800">0</Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
