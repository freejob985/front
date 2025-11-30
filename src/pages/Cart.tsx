import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingBag,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Truck,
  ArrowLeft,
  CreditCard,
  Tag
} from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api, CartItem as ApiCartItem } from "@/lib/api";
import { getImageUrl } from "@/config/api";
import { toast } from 'sonner';

// دالة تشغيل الأصوات
const playNotificationSound = (type: 'success' | 'error' | 'info') => {
  try {
    // استخدام Web Audio API لإنشاء أصوات بسيطة
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // تحديد التردد والنغمة حسب نوع الإشعار
    if (type === 'success') {
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
    } else if (type === 'error') {
      oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime + 0.1);
    } else {
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
    }
    
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (error) {
    console.warn('Could not play notification sound:', error);
  }
};


const CartItem = ({ item, onUpdateQuantity, onRemove }: {
  item: ApiCartItem,
  onUpdateQuantity: (id: number, quantity: number) => void,
  onRemove: (id: number) => void
}) => {
  const incrementQuantity = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const decrementQuantity = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div 
            className="w-20 h-20 bg-cover bg-center rounded-lg"
            style={{ backgroundImage: `url(${getImageUrl(item.image)})` }}
          ></div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg">{item.name}</h3>
                {item.vendor?.name && (
                  <p className="text-gray-600 text-sm">{item.vendor.name}</p>
                )}
                {item.is_fresh && (
                  <Badge className="bg-green-500 text-white text-xs mt-1">طازج</Badge>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onRemove(item.id)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={decrementQuantity}
                    disabled={item.quantity <= 1}
                    className="h-8 w-8"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="px-3 py-1 min-w-[40px] text-center text-sm">{item.quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={incrementQuantity}
                    className="h-8 w-8"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="text-right">
                  <div className="font-bold text-lg">{(item.price * item.quantity).toFixed(1)} دينار</div>
                  {item.original_price && item.original_price > item.price && (
                    <div className="text-sm text-gray-500 line-through">
                      {(item.original_price * item.quantity).toFixed(1)} دينار
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const OrderSummary = ({ subtotal, savings, deliveryFee, tax, couponDiscount, total }: { 
  subtotal: number; 
  savings: number; 
  deliveryFee: number; 
  tax: number; 
  couponDiscount?: number;
  total: number; 
}) => {
  return (
    <Card className="sticky top-24">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-6">ملخص الطلب</h3>
        
        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span>المجموع الفرعي</span>
            <span>{subtotal.toFixed(1)} دينار</span>
          </div>
          
          {savings > 0 && (
            <div className="flex justify-between text-green-600">
              <span>التوفير</span>
              <span>-{savings.toFixed(1)} دينار</span>
            </div>
          )}
          
          {couponDiscount && couponDiscount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>خصم الكوبون</span>
              <span>-{couponDiscount.toFixed(1)} دينار</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span>رسوم التوصيل</span>
            <span className={deliveryFee === 0 ? "text-green-600" : ""}>
              {deliveryFee === 0 ? "مجاني" : `${deliveryFee} دينار`}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>ضريبة القيمة المضافة (15%)</span>
            <span>{tax.toFixed(1)} دينار</span>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>المجموع الكلي</span>
              <span>{total.toFixed(1)} دينار</span>
            </div>
          </div>
        </div>
        
        {deliveryFee > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-orange-700">
              <Truck className="h-4 w-4" />
              <span className="text-sm">
                أضف {(Math.max(0, 10 - subtotal)).toFixed(1)} دينار للحصول على توصيل مجاني
              </span>
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          <Button size="lg" className="w-full" asChild>
            <Link to="/checkout">
              <CreditCard className="h-4 w-4 ml-2" />
              المتابعة للدفع
            </Link>
          </Button>
          
          <Button variant="outline" size="lg" className="w-full" asChild>
            <Link to="/categories">
              <ShoppingBag className="h-4 w-4 ml-2" />
              متابعة التسوق
            </Link>
          </Button>
        </div>
        
      </CardContent>
    </Card>
  );
};

const EmptyCart = () => (
  <div className="text-center py-16">
    <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <ShoppingCart className="h-16 w-16 text-gray-400" />
    </div>
    <h2 className="text-2xl font-bold mb-4">سلة التسوق فارغة</h2>
    <p className="text-gray-600 mb-8">لم تقم بإضافة أي منتجات إلى سلة التسوق بعد</p>
    <Button size="lg" asChild>
      <Link to="/categories">
        <ShoppingBag className="h-4 w-4 ml-2" />
        ابدأ التسوق الآن
      </Link>
    </Button>
  </div>
);

const PromoCode = ({ onCouponApplied, onCouponRemoved }: { 
  onCouponApplied: () => void; 
  onCouponRemoved: () => void; 
}) => {
  const [promoCode, setPromoCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  const applyPromoCode = async () => {
    if (!promoCode.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await api.cart.applyCoupon(promoCode.trim());
      if (response.success) {
        setAppliedCoupon(response.coupon);
        onCouponApplied();
        
        // Play success sound
        playNotificationSound('success');
        
        toast.success('تم التطبيق!', {
          description: response.message,
          duration: 3000,
        });
      } else {
        // Play error sound
        playNotificationSound('error');
        
        toast.error('خطأ!', {
          description: response.message || 'فشل في تطبيق كود الخصم',
          duration: 4000,
        });
      }
    } catch (error: any) {
      console.error('Error applying coupon:', error);
      
      // Play error sound
      playNotificationSound('error');
      
      let errorMessage = 'حدث خطأ أثناء تطبيق كود الخصم';
      
      // Handle specific error cases
      if (error.status === 422) {
        errorMessage = error.message || 'البيانات المرسلة غير صحيحة';
      } else if (error.status === 404) {
        errorMessage = 'كود الخصم غير موجود';
      } else if (error.status === 400) {
        errorMessage = 'طلب غير صحيح';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error('خطأ!', {
        description: errorMessage,
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeCoupon = async () => {
    setIsLoading(true);
    try {
      const response = await api.cart.removeCoupon();
      if (response.success) {
        setAppliedCoupon(null);
        setPromoCode("");
        onCouponRemoved();
        
        // Play success sound
        playNotificationSound('success');
        
        toast.success('تم الإزالة!', {
          description: response.message,
          duration: 3000,
        });
      }
    } catch (error: any) {
      console.error('Error removing coupon:', error);
      
      // Play error sound
      playNotificationSound('error');
      
      let errorMessage = 'حدث خطأ أثناء إزالة كود الخصم';
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error('خطأ!', {
        description: errorMessage,
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">كود الخصم</h3>
        
        {!appliedCoupon ? (
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="أدخل كود الخصم"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && applyPromoCode()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-primary"
              disabled={isLoading}
            />
            <Button 
              onClick={applyPromoCode} 
              disabled={!promoCode.trim() || isLoading}
            >
              {isLoading ? 'جاري التطبيق...' : 'تطبيق'}
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-green-600" />
              <div>
                <span className="text-green-700 font-medium">
                  تم تطبيق كود الخصم: {appliedCoupon.code}
                </span>
                <div className="text-sm text-green-600">
                  خصم: {appliedCoupon.discount_amount} دينار
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={removeCoupon}
              disabled={isLoading}
            >
              {isLoading ? 'جاري الإزالة...' : 'إزالة'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};



export default function Cart() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  
  // التحقق من تسجيل الدخول
  const { data: authData, isLoading: authLoading, isError: authError } = useQuery({ 
    queryKey: ["auth", "me"], 
    queryFn: api.auth.me, 
    retry: false 
  });

  const { data, isLoading, refetch } = useQuery({ queryKey: ["cart"], queryFn: api.cart.get });
  const items = data?.items ?? [];
  const totals = data?.totals ?? { subtotal: 0, savings: 0, delivery_fee: 0, tax: 0, coupon_discount: 0, total: 0, currency: "KWD", count: 0 };

  // توجيه المستخدم لتسجيل الدخول إذا لم يكن مسجلاً
  useEffect(() => {
    if (!authLoading && (authError || !authData?.user)) {
      navigate("/login");
    }
  }, [authLoading, authError, authData, navigate]);

  const updateQuantity = async (id: number, quantity: number) => {
    await api.cart.update(id, quantity);
    qc.invalidateQueries({ queryKey: ["cart"] });
  };

  const removeItem = async (id: number) => {
    if (confirm('هل أنت متأكد؟ هل تريد إزالة هذا المنتج من السلة؟')) {
      try {
        await api.cart.remove(id);
        qc.invalidateQueries({ queryKey: ["cart"] });
        toast.success('تم إزالة المنتج من السلة بنجاح');
      } catch (error) {
        toast.error('حدث خطأ أثناء حذف المنتج');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-gray-500">جاري التحميل...</div>
    );
  }

  if (!items.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyCart />
      </div>
    );
  }

  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link to="/categories">
              <ArrowLeft className="h-4 w-4 ml-2" />
              متابعة التسوق
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">سلة التسوق</h1>
          <p className="text-gray-600">{items.length} منتج في السلة</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>

            <PromoCode 
              onCouponApplied={() => refetch()} 
              onCouponRemoved={() => refetch()} 
            />
          </div>

          <div>
            <OrderSummary
              subtotal={totals.subtotal}
              savings={totals.savings}
              deliveryFee={totals.delivery_fee}
              tax={totals.tax}
              couponDiscount={totals.coupon_discount}
              total={totals.total}
            />
          </div>
        </div>
      </main>
    </>
  );
}
