import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Types
interface Offer {
  id: number;
  title: string;
  description: string;
  image: string;
  images?: string;
  original_price: number;
  offer_price: number;
  discount_percentage: number;
  discount_amount: number;
  discount_type: string;
  min_quantity: number;
  max_quantity: number;
  stock: number;
  start_date: string;
  end_date: string;
  is_featured: boolean;
  is_limited_time: boolean;
  category: {
    id: number;
    name: string;
  };
}
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock,
  ShoppingBag,
  ArrowLeft,
  Star,
  Heart,
  Share2,
  Tag,
  Calendar,
  Package,
  Truck
} from "lucide-react";
import { apiService } from "@/config/api";
import { getImageUrl } from "@/config/api";
import { api } from "@/lib/api";

const OfferDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchOffer = async () => {
      if (!id) {
        setError('معرف العرض غير صحيح');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await apiService.getOfferDetails(id);
        setOffer(response.data);
      } catch (err) {
        console.error('Error fetching offer:', err);
        setError('حدث خطأ في تحميل تفاصيل العرض');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOffer();
    }
  }, [id]);

  const formatPrice = (price: number) => {
    return `${price} د.ك`;
  };

  const getTimeLeft = (endDate: string) => {
    if (!endDate) return 'غير محدد';
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'انتهى العرض';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days} يوم و ${hours} ساعة`;
    if (hours > 0) return `${hours} ساعة و ${minutes} دقيقة`;
    return `${minutes} دقيقة`;
  };

  const handleAddToCart = async () => {
    if (!offer) return;
    
    try {
      const response = await api.cart.add(offer.id, quantity, '', 'offer');
      console.log('✅ Cart response:', response);
      
      toast.success('تم إضافة العرض إلى السلة بنجاح! 🛒', {
        duration: 3000,
        className: 'toast-success',
      });
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      toast.error('حدث خطأ أثناء إضافة العرض للسلة ❌', {
        duration: 3000,
        className: 'toast-error',
      });
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (offer && newQuantity >= 1 && newQuantity <= (offer.max_quantity || 10)) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل تفاصيل العرض...</p>
        </div>
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'العرض غير موجود'}</p>
          <Button onClick={() => navigate('/offers')}>
            <ArrowLeft className="h-4 w-4 ml-2" />
            العودة للعروض
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/offers')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              العودة للعروض
            </Button>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{offer.category?.name}</Badge>
              {offer.is_featured && (
                <Badge className="bg-red-500 text-white">
                  <Star className="h-3 w-3 ml-1" />
                  مميز
                </Badge>
              )}
              {offer.is_limited_time && (
                <Badge className="bg-orange-500 text-white">
                  <Clock className="h-3 w-3 ml-1" />
                  محدود الوقت
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img 
                src={getImageUrl(offer.image)} 
                alt={offer.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Additional Images */}
            {offer.images && (
              <div className="grid grid-cols-4 gap-2">
                {JSON.parse(offer.images).map((image: string, index: number) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img 
                      src={getImageUrl(image)} 
                      alt={`${offer.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{offer.title}</h1>
              <p className="text-gray-600 text-lg">{offer.description}</p>
            </div>

            {/* Price Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-3xl font-bold text-primary">
                  {formatPrice(offer.offer_price)}
                </div>
                <div className="text-xl text-gray-500 line-through">
                  {formatPrice(offer.original_price)}
                </div>
                <Badge className="bg-red-500 text-white text-lg px-3 py-1">
                  -{offer.discount_percentage}%
                </Badge>
              </div>
              <div className="text-green-600 font-semibold">
                وفرت {formatPrice(offer.discount_amount)}
              </div>
            </div>

            {/* Time Left */}
            {offer.end_date && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-orange-700">
                  <Clock className="h-5 w-5" />
                  <span className="font-semibold">ينتهي العرض خلال:</span>
                  <span className="text-lg font-bold">{getTimeLeft(offer.end_date)}</span>
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">الكمية:</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= (offer.max_quantity || 10)}
                  >
                    +
                  </Button>
                </div>
                <span className="text-sm text-gray-500">
                  متوفر: {offer.stock} قطعة
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleAddToCart}
                className="w-full text-lg py-6"
                size="lg"
              >
                <ShoppingBag className="h-5 w-5 ml-2" />
                أضف للسلة
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  المفضلة
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  مشاركة
                </Button>
              </div>
            </div>

            {/* Offer Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">تفاصيل العرض</h3>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <span>نوع الخصم:</span>
                  <span className="font-medium">
                    {offer.discount_type === 'percentage' ? 'نسبة مئوية' : 
                     offer.discount_type === 'fixed' ? 'مبلغ ثابت' : 'عرض خاص'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-500" />
                  <span>الحد الأدنى:</span>
                  <span className="font-medium">{offer.min_quantity} قطعة</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>تاريخ البداية:</span>
                  <span className="font-medium">
                    {offer.start_date ? new Date(offer.start_date).toLocaleDateString('ar-SA') : 'غير محدد'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-gray-500" />
                  <span>التوصيل:</span>
                  <span className="font-medium text-green-600">متوفر</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferDetails;
