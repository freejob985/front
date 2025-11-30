import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Types
interface Offer {
  id: number;
  title: string;
  description: string;
  image: string;
  original_price: number;
  offer_price: number;
  discount_percentage: number;
  discount_amount: number;
  end_date: string;
  is_featured: boolean;
  is_limited_time: boolean;
  category: {
    id: number;
    name: string;
  };
}

interface OfferCategory {
  id: number;
  name: string;
  description: string;
  image: string;
  color: string;
}
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  Filter,
  SortAsc,
  Grid3X3,
  List,
  Star,
  Flame
} from "lucide-react";
import { apiService } from "@/config/api";
import { getImageUrl } from "@/config/api";
import { api } from "@/lib/api";

const CategoryOffers = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState<OfferCategory | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError('معرف القسم غير صحيح');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // جلب تفاصيل القسم
        const categoryResponse = await apiService.getOfferCategoryDetails(id);
        setCategory(categoryResponse.data);
        
        // جلب عروض القسم
        const offersResponse = await apiService.getOfferCategoryOffers(id);
        setOffers(offersResponse.data.data || []);
        
      } catch (err) {
        console.error('Error fetching category offers:', err);
        setError('حدث خطأ في تحميل عروض القسم');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
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
    
    if (diff <= 0) return 'انتهى';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} يوم`;
    if (hours > 0) return `${hours} ساعة`;
    return 'أقل من ساعة';
  };

  const handleAddToCart = async (offer: Offer) => {
    try {
      const response = await api.cart.add(offer.id, 1, '', 'offer');
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

  const handleViewDetails = (offer: Offer) => {
    navigate(`/offers/${offer.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل عروض القسم...</p>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'القسم غير موجود'}</p>
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
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/offers')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              العودة للعروض
            </Button>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div 
                className="w-16 h-16 rounded-full bg-cover bg-center"
                style={{ backgroundImage: `url(${getImageUrl(category.image)})` }}
              ></div>
              <h1 className="text-3xl font-bold">{category.name}</h1>
            </div>
            <p className="text-gray-600 text-lg">{category.description}</p>
            <Badge className={`${category.color} mt-2`}>
              {offers.length} عرض متاح
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters and View Options */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 ml-2" />
              فلترة
            </Button>
            <Button variant="outline" size="sm">
              <SortAsc className="h-4 w-4 ml-2" />
              ترتيب
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Offers Grid/List */}
        {offers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <ShoppingBag className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold mb-2">لا توجد عروض متاحة</h3>
            <p className="text-gray-600">لا توجد عروض في هذا القسم حالياً</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-4"
          }>
            {offers.map((offer) => (
              <Card key={offer.id} className={`group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden ${
                offer.is_featured ? 'ring-2 ring-red-500' : ''
              } ${viewMode === 'list' ? 'flex' : ''}`}>
                
                {/* Image */}
                <div className={`relative ${viewMode === 'list' ? 'w-48 h-48' : 'h-48'}`}>
                  <div 
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${getImageUrl(offer.image)})` }}
                  >
                    <div className="absolute inset-0 bg-black/30"></div>
                    
                    {offer.is_featured && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-red-500 text-white">
                          <Star className="h-3 w-3 ml-1" />
                          مميز
                        </Badge>
                      </div>
                    )}
                    
                    {offer.is_limited_time && (
                      <div className="absolute top-4 left-4 z-10">
                        <Badge className="bg-orange-500 text-white">
                          <Flame className="h-3 w-3 ml-1" />
                          محدود
                        </Badge>
                      </div>
                    )}
                    
                    <div className="absolute top-4 left-4">
                      <Badge className={`${category.color} text-lg font-bold px-3 py-1`}>
                        -{offer.discount_percentage}%
                      </Badge>
                    </div>
                    
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>متبقي: {getTimeLeft(offer.end_date)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <CardContent className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="mb-3">
                    <h3 className={`font-semibold mb-2 group-hover:text-primary transition-colors ${
                      viewMode === 'list' ? 'text-lg' : 'text-base'
                    }`}>
                      {offer.title}
                    </h3>
                    <p className={`text-gray-600 ${
                      viewMode === 'list' ? 'text-sm' : 'text-sm'
                    }`}>
                      {offer.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-primary ${
                        viewMode === 'list' ? 'text-xl' : 'text-lg'
                      }`}>
                        {formatPrice(offer.offer_price)}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(offer.original_price)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      وفرت {formatPrice(offer.discount_amount)}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleAddToCart(offer)}
                      className="flex-1 group-hover:bg-primary group-hover:text-white transition-colors"
                    >
                      <ShoppingBag className="h-4 w-4 ml-2" />
                      أضف للسلة
                    </Button>
                    <Button 
                      onClick={() => handleViewDetails(offer)}
                      variant="outline"
                      className="px-4"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryOffers;
