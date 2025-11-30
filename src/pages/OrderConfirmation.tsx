import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag,
  Phone,
  MapPin,
  CheckCircle,
  Truck,
  Clock,
  Package,
  Download,
  Share2,
  Copy,
  Star,
  Navigation
} from "lucide-react";
import { getImageUrl } from "@/config/api";
import { useState, useEffect } from "react";
import apiService from "../services/api";


const SuccessMessage = () => (
  <div className="text-center py-12">
    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <CheckCircle className="h-12 w-12 text-green-600" />
    </div>
    <h1 className="text-3xl font-bold mb-4 text-green-800">تم تأكيد طلبك بنجاح!</h1>
    <p className="text-lg text-gray-600 mb-8">
      شكراً لك على ثقتك بنا. سيتم تحضير طلبك وتوصيله إليك في الوقت المحدد.
    </p>
    
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button size="lg" asChild>
        <Link to="/profile">
          <Navigation className="h-4 w-4 ml-2" />
          تتبع الطلب
        </Link>
      </Button>
      <Button variant="outline" size="lg" asChild>
        <Link to="/categories">
          <ShoppingBag className="h-4 w-4 ml-2" />
          متابعة التسوق
        </Link>
      </Button>
    </div>
  </div>
);

const OrderDetails = ({ order, onDownloadInvoice }: { order: any, onDownloadInvoice: (orderNumber: string) => void }) => {
  if (!order) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>تفاصيل الطلب</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">جاري تحميل تفاصيل الطلب...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleDownloadInvoice = () => {
    if (onDownloadInvoice) {
      onDownloadInvoice(order.order_number);
    }
  };

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(order.order_number);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          تفاصيل الطلب
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleDownloadInvoice}>
              <Download className="h-4 w-4 ml-2" />
              تحميل الفاتورة
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3">معلومات الطلب</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">رقم الطلب:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-medium">{order.order_number}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopyOrderNumber}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">تاريخ الطلب:</span>
                <span>{new Date(order.created_at).toLocaleDateString('ar-KW')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">طريقة الدفع:</span>
                <span>{order.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">حالة الطلب:</span>
                <Badge variant="outline">{order.status_label}</Badge>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">التوصيل</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <div className="font-medium text-blue-600">نوع التوصيل</div>
                  <div className="text-sm text-gray-600">{order.delivery_type_label}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-600 mt-0.5" />
                <div>
                  <div className="font-medium">عنوان التوصيل</div>
                  <div className="text-sm text-gray-600">
                    {order.delivery_address}, {order.delivery_city}, {order.delivery_governorate}
                  </div>
                </div>
              </div>
              {order.delivery_phone && (
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-gray-600 mt-0.5" />
                  <div>
                    <div className="font-medium">هاتف التوصيل</div>
                    <div className="text-sm text-gray-600">{order.delivery_phone}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const OrderItems = ({ order }: { order: any }) => {
  if (!order) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>المنتجات المطلوبة</CardTitle>
          <CardDescription>جاري التحميل...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 pb-4 border-b last:border-b-0 animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const orderItems = order.items || [];

  if (orderItems.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>المنتجات المطلوبة</CardTitle>
          <CardDescription>لا توجد منتجات في الطلب</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">لا توجد منتجات في الطلب</p>
            <Button asChild className="mt-4">
              <Link to="/categories">متابعة التسوق</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>المنتجات المطلوبة</CardTitle>
        <CardDescription>{orderItems.length} منتج</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          {orderItems.map((item: any) => (
            <div key={item.id} className="flex items-center gap-4 pb-4 border-b last:border-b-0">
              <div 
                className="w-16 h-16 bg-cover bg-center rounded-lg"
                style={{ backgroundImage: `url(${getImageUrl(item.product?.image)})` }}
              ></div>
              <div className="flex-1">
                <h4 className="font-medium">{item.product?.name || 'منتج غير محدد'}</h4>
                <p className="text-sm text-gray-600">{order.vendor?.name || 'غير محدد'}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-gray-600">الكمية: {item.quantity}</span>
                  <span className="font-medium">{item.total.toFixed(3)} د.ك</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span>المجموع الفرعي</span>
            <span>{order.subtotal.toFixed(3)} د.ك</span>
          </div>
          <div className="flex justify-between">
            <span>رسوم التوصيل</span>
            <span>{order.delivery_fee.toFixed(3)} د.ك</span>
          </div>
          <div className="flex justify-between">
            <span>ضريبة القيمة المضافة (15%)</span>
            <span>{order.tax_amount.toFixed(3)} د.ك</span>
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between text-lg font-bold">
              <span>المجموع الكلي</span>
              <span>{order.total.toFixed(3)} د.ك</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const DeliveryTracker = () => {
  const steps = [
    { id: 1, name: "تأكيد الطلب", completed: true, time: "2:15 مساءً" },
    { id: 2, name: "تحضير الطلب", completed: true, time: "2:30 مساءً" },
    { id: 3, name: "خرج للتوصيل", completed: false, current: true, time: "3:00 مساءً" },
    { id: 4, name: "تم التوصيل", completed: false, time: "3:30 مساءً" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-blue-600" />
          تتبع الطلب
        </CardTitle>
        <CardDescription>تابع حالة طلبك لحظة بلحظة</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step.completed ? 'bg-green-500 text-white' :
                step.current ? 'bg-blue-500 text-white' :
                'bg-gray-200 text-gray-600'
              }`}>
                {step.completed ? <CheckCircle className="h-4 w-4" /> : step.id}
              </div>
              <div className="flex-1">
                <div className={`font-medium ${
                  step.current || step.completed ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.name}
                </div>
                <div className="text-sm text-gray-600">{step.time}</div>
              </div>
              {step.current && (
                <Badge className="bg-blue-100 text-blue-700">جاري التنفيذ</Badge>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Truck className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-800">مندوب التوصيل في الطريق</span>
          </div>
          <p className="text-sm text-blue-700">
            طلبك خرج للتوصيل وسيصل خلال 30 دقيقة تقريباً
          </p>
          <Button variant="outline" size="sm" className="mt-3 w-full">
            <Phone className="h-4 w-4 ml-2" />
            اتصال بمندوب التوصيل
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const NextSteps = () => {
  const actions = [
    {
      icon: Star,
      title: "قيم تجربتك",
      description: "ساعدنا في تحسين خدماتنا بتقييم طلبك",
      buttonText: "تقييم الطلب",
      link: "/account"
    },
    {
      icon: Package,
      title: "طلب مساعدة",
      description: "هل تحتاج مساعدة بخصوص طلبك؟",
      buttonText: "تواصل معنا",
      link: "/contact"
    },
    {
      icon: ShoppingBag,
      title: "طلب جديد",
      description: "اطلب منتجات أخرى من نفس الموردين",
      buttonText: "إعادة الطلب",
      link: "/categories"
    }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {actions.map((action, index) => (
        <Card key={index} className="text-center hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <action.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">{action.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{action.description}</p>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to={action.link}>{action.buttonText}</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};


export default function OrderConfirmation() {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const orderNumbers = searchParams.get('orders')?.split(',').filter(num => num.trim() !== '') || [];

  useEffect(() => {
    const loadOrderData = async () => {
      console.log('🔍 Order numbers from URL:', orderNumbers);
      console.log('🔍 Full URL search params:', Object.fromEntries(searchParams.entries()));
      console.log('🔍 Current URL:', window.location.href);
      console.log('🔍 URL pathname:', window.location.pathname);
      console.log('🔍 URL search:', window.location.search);
      
      if (orderNumbers.length === 0) {
        console.error('❌ No order numbers found in URL');
        console.error('❌ This usually means:');
        console.error('   1. Checkout redirect failed to include order numbers');
        console.error('   2. User navigated directly to /order-confirmation without completing checkout');
        console.error('   3. URL parameters were lost during navigation');
        setError('لم يتم العثور على رقم الطلب في الرابط. تأكد من أن عملية الدفع تمت بنجاح.');
        setLoading(false);
        return;
      }

      try {
        // Load the first order for now (in a real app, you might want to show all orders)
        const orderNumber = orderNumbers[0];
        console.log('🔍 Loading order:', orderNumber);
        console.log('🔍 API endpoint will be called for order confirmation');
        
        const response = await apiService.getOrderConfirmation(orderNumber);
        console.log('📡 API Response received:', response);
        console.log('📡 Response type:', typeof response);
        console.log('📡 Response keys:', Object.keys(response || {}));
        
        if (response && response.success) {
          setOrder(response.order);
          console.log('✅ Order loaded successfully:', response.order);
          console.log('✅ Order details:', {
            id: response.order?.id,
            order_number: response.order?.order_number,
            status: response.order?.status,
            total: response.order?.total
          });
        } else {
          const errorMsg = response?.message || 'فشل في تحميل تفاصيل الطلب';
          setError(errorMsg);
          console.error('❌ API Error:', errorMsg);
          console.error('❌ Full response:', response);
        }
      } catch (err) {
        console.error('❌ Network Error:', err);
        console.error('❌ Error type:', typeof err);
        console.error('❌ Error message:', err instanceof Error ? err.message : 'Unknown error');
        console.error('❌ Error stack:', err instanceof Error ? err.stack : 'No stack trace');
        const errorMessage = err instanceof Error ? err.message : 'خطأ غير معروف';
        setError('حدث خطأ في الاتصال بالخادم: ' + errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadOrderData();
  }, [orderNumbers]);

  const handleDownloadInvoice = async (orderNumber: string) => {
    try {
      await apiService.downloadInvoice(orderNumber);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('حدث خطأ في تحميل الفاتورة');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل تفاصيل الطلب...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto p-6">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">خطأ في تحميل الطلب</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-right">
            <h3 className="font-semibold text-yellow-800 mb-2">معلومات التشخيص:</h3>
            <div className="text-sm text-yellow-700 space-y-1">
              <p><strong>الرابط الحالي:</strong> {window.location.href}</p>
              <p><strong>معاملات الرابط:</strong> {Object.keys(Object.fromEntries(searchParams.entries())).length > 0 ? JSON.stringify(Object.fromEntries(searchParams.entries())) : 'لا توجد'}</p>
              <p><strong>أرقام الطلبات الموجودة:</strong> {orderNumbers.length}</p>
            </div>
          </div>
          
          {orderNumbers.length > 0 && (
            <div className="bg-gray-100 p-4 rounded-lg mb-4 text-sm">
              <p className="font-medium mb-2">أرقام الطلبات المطلوبة:</p>
              <p className="text-gray-600">{orderNumbers.join(', ')}</p>
            </div>
          )}
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">الحلول المقترحة:</h3>
            <ul className="text-sm text-blue-700 space-y-1 text-right">
              <li>1. تأكد من إتمام عملية الدفع بنجاح</li>
              <li>2. تحقق من وجود منتجات في السلة قبل الدفع</li>
              <li>3. جرب إعادة عملية الدفع</li>
              <li>4. تحقق من اتصال الإنترنت</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link to="/">العودة للرئيسية</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link to="/checkout">إعادة المحاولة</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link to="/api-test">فحص النظام</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <SuccessMessage />
        
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-6">
            <OrderDetails order={order} onDownloadInvoice={handleDownloadInvoice} />
            <OrderItems order={order} />
          </div>
          
          <div>
            <DeliveryTracker />
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">الخطوات التالية</h2>
          <NextSteps />
        </div>
      </main>
    </div>
  );
}