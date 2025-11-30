import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  CreditCard,
  ShoppingBag,
  Star
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { getImageUrl } from "@/config/api";

export default function OrderDetails() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  
  const { data, isLoading, error } = useQuery({ 
    queryKey: ["order", orderId], 
    queryFn: () => api.orders.getById(Number(orderId)),
    enabled: !!orderId
  });

  const order = data?.order;

  const getStatusBadge = (status: string, label: string) => {
    const statusConfig: Record<string, string> = {
      delivered: "bg-green-100 text-green-800 border-green-200",
      shipped: "bg-blue-100 text-blue-800 border-blue-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      confirmed: "bg-blue-100 text-blue-800 border-blue-200",
      preparing: "bg-blue-100 text-blue-800 border-blue-200",
      ready: "bg-blue-100 text-blue-800 border-blue-200",
    };
    const cls = statusConfig[status] ?? "bg-gray-100 text-gray-800 border-gray-200";
    return <Badge className={`${cls} border`}>{label}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "shipped":
      case "ready":
        return <Truck className="h-5 w-5 text-blue-600" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "pending":
      case "confirmed":
      case "preparing":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "border-l-green-500";
      case "shipped":
      case "ready":
        return "border-l-blue-500";
      case "cancelled":
        return "border-l-red-500";
      case "pending":
      case "confirmed":
      case "preparing":
        return "border-l-yellow-500";
      default:
        return "border-l-gray-500";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل تفاصيل الطلب...</p>
        </div>
      </div>
    );
  }

  // Debug information
  console.log("Order data:", order);
  console.log("Order items:", order?.items);
  console.log("Items count:", order?.items_count);

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">لم يتم العثور على الطلب</h2>
          <p className="text-gray-600 mb-6">الطلب المطلوب غير موجود أو تم حذفه</p>
          <Button onClick={() => navigate('/account')}>
            <ArrowLeft className="h-4 w-4 ml-2" />
            العودة للحساب
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/account')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 ml-2" />
            العودة للحساب
          </Button>
          <h1 className="text-3xl font-bold mb-2">تفاصيل الطلب #{order.order_number}</h1>
          <p className="text-gray-600">
            تم الطلب في {order.created_at ? new Date(order.created_at).toLocaleDateString('ar-SA') : 'غير محدد'}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Status */}
          <div className="lg:col-span-2 space-y-6">
            <Card className={`border-l-4 ${getStatusColor(order.status)}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(order.status)}
                    <div>
                      <CardTitle>حالة الطلب</CardTitle>
                      <CardDescription>متابعة حالة طلبك الحالية</CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(order.status, order.status_label)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium">تم تأكيد الطلب</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString('ar-SA') : ''}
                    </span>
                  </div>
                  
                  {order.status === 'delivered' && (
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Truck className="h-5 w-5 text-green-600" />
                        <span className="font-medium">تم التسليم</span>
                      </div>
                      <span className="text-sm text-gray-600">تم التسليم بنجاح</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  منتجات الطلب
                  {order.items && order.items.length > 0 && (
                    <Badge variant="outline" className="mr-2">
                      {order.items.length} منتج
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {order.items && order.items.length > 0 ? (
                  <div className="space-y-4">
                    {order.items.map((item: any, index: number) => (
                      <div key={index} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="relative">
                          <div
                            className="w-16 h-16 bg-cover bg-center rounded-lg border"
                            style={{ 
                              backgroundImage: item.image ? `url(${getImageUrl(item.image)})` : 'none',
                              backgroundColor: item.image ? 'transparent' : '#f3f4f6'
                            }}
                          >
                            {!item.image && (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                                <ShoppingBag className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-1">{item.name || item.product_name || 'منتج غير محدد'}</h4>
                          <p className="text-sm text-gray-600 mb-2">الكمية: {item.quantity || item.qty || 1}</p>
                          <p className="text-sm text-gray-500">سعر الوحدة: {item.price || item.unit_price || 0} دينار</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">المجموع</p>
                          <p className="text-lg font-bold text-green-600">{item.total || item.subtotal || (item.price * item.quantity) || 0} دينار</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">لا توجد منتجات في هذا الطلب</p>
                    <p className="text-sm text-gray-500">
                      {order.items_count ? `يجب أن يحتوي الطلب على ${order.items_count} منتج` : 'لم يتم العثور على تفاصيل المنتجات'}
                    </p>
                    {/* Debug information */}
                    <details className="mt-4 text-left">
                      <summary className="cursor-pointer text-xs text-gray-400">معلومات التصحيح</summary>
                      <pre className="text-xs text-gray-500 mt-2 p-2 bg-gray-100 rounded">
                        {JSON.stringify(order, null, 2)}
                      </pre>
                    </details>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ملخص الطلب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>المجموع الفرعي</span>
                  <span>{order.subtotal || order.total} دينار</span>
                </div>
                <div className="flex justify-between">
                  <span>رسوم التوصيل</span>
                  <span className="text-green-600">مجاني</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>المجموع الكلي</span>
                  <span>{order.total} دينار</span>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  معلومات التوصيل
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">{order.delivery_address?.title || 'العنوان'}</p>
                  <p className="text-sm text-gray-600">{order.delivery_address?.address}</p>
                  <p className="text-sm text-gray-600">
                    {order.delivery_address?.city} - {order.delivery_address?.governorate}
                  </p>
                </div>
                {order.delivery_notes && (
                  <div>
                    <p className="font-medium text-sm">ملاحظات التوصيل:</p>
                    <p className="text-sm text-gray-600">{order.delivery_notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  معلومات الدفع
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>طريقة الدفع</span>
                    <span className="font-medium">
                      {order.payment_method === 'cash' ? 'الدفع عند الاستلام' : 
                       order.payment_method === 'card' ? 'بطاقة ائتمان' :
                       order.payment_method === 'knet' ? 'كي نت' : 'محفظة إلكترونية'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>حالة الدفع</span>
                    <Badge className="bg-green-100 text-green-800">مدفوع</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              {order.status === 'delivered' && (
                <Button className="w-full" size="lg">
                  <Star className="h-4 w-4 ml-2" />
                  تقييم الطلب
                </Button>
              )}
              <Button variant="outline" className="w-full" size="lg">
                <ShoppingBag className="h-4 w-4 ml-2" />
                إعادة الطلب
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
