import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock,
  Zap,
  Flame,
  Crown,
  ShoppingBag,
  ArrowRight,
  Filter,
  SortAsc,
  Grid3X3,
  List
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { apiService } from "@/config/api";
import { getImageUrl } from "@/config/api";
import { api } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { playClickSound } from "@/utils/sounds";

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
  offers_count: number;
}


const Hero = () => (
  <section className="bg-gradient-to-r from-red-50 to-orange-50 py-16">
    <div className="container mx-auto px-4">
      <div className="text-center max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Flame className="h-8 w-8 text-red-500" />
          <h1 className="text-4xl md:text-5xl font-bold">
            العروض اليومية
          </h1>
          <Flame className="h-8 w-8 text-red-500" />
        </div>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          اكتشف أفضل العروض والخصومات على المنتجات الغذائية والاستهلاكية. عروض محدودة بكميات محدودة!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="text-lg px-8 py-4 h-auto bg-red-600 hover:bg-red-700">
            <ShoppingBag className="h-5 w-5 ml-2" />
            تسوق الآن
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto">
            <Clock className="h-5 w-5 ml-2" />
            عروض محدودة الوقت
          </Button>
        </div>
      </div>
    </div>
  </section>
);

const FeaturedOffers = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const qc = useQueryClient();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const response = await apiService.getFeaturedOffers();
        setOffers(response.data || []);
      } catch (err) {
        console.error('Error fetching offers:', err);
        setError('حدث خطأ في تحميل العروض');
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

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
    // Play click sound
    playClickSound();
    
    try {
      // إضافة العرض للسلة
      const response = await api.cart.add(offer.id, 1, '', 'offer');
      console.log('✅ Cart response:', response);
      
      // تحديث عداد السلة
      qc.invalidateQueries({ queryKey: ["cart", "count"] });
      qc.invalidateQueries({ queryKey: ["cart"] });
      
      // إظهار رسالة نجاح
      toast.success('تم إضافة العرض إلى السلة بنجاح! 🛒', {
        description: offer.title,
        duration: 5000,
        className: 'toast-success',
      });
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      toast.error('حدث خطأ أثناء إضافة العرض للسلة ❌', {
        description: 'يرجى المحاولة مرة أخرى',
        duration: 5000,
        className: 'toast-error',
      });
    }
  };

  const handleViewDetails = (offer: Offer) => {
    // الانتقال لصفحة تفاصيل العرض
    navigate(`/offers/${offer.id}`);
  };

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">جاري تحميل العروض...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">العروض المميزة</h2>
            <p className="text-gray-600">عروض محدودة بكميات محدودة</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <SortAsc className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {offers.map((offer) => (
            <Card key={offer.id} className={`group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden ${offer.is_featured ? 'ring-2 ring-red-500' : ''}`}>
              {offer.is_featured && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-red-500 text-white">
                    <Crown className="h-3 w-3 ml-1" />
                    مميز
                  </Badge>
                </div>
              )}
              
              <div className="relative">
                <div 
                  className="h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url(${getImageUrl(offer.image)})` }}
                >
                  <div className="absolute inset-0 bg-black/30"></div>
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-red-500 text-white text-lg font-bold px-3 py-1">
                      -{offer.discount_percentage}%
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Clock className="h-4 w-4" />
                        <span>متبقي: {getTimeLeft(offer.end_date)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="mb-3">
                  <Badge variant="outline" className="text-xs mb-2">
                    {offer.category?.name || 'عرض'}
                  </Badge>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {offer.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {offer.description}
                  </p>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">{formatPrice(offer.offer_price)}</span>
                    <span className="text-sm text-gray-500 line-through">{formatPrice(offer.original_price)}</span>
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
      </div>
    </section>
  );
};

const FlashSale = () => {
  const [flashOffers, setFlashOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlashOffers = async () => {
      try {
        setLoading(true);
        const response = await apiService.getFlashSaleOffers();
        setFlashOffers(response.data || []);
      } catch (err) {
        console.error('Error fetching flash offers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashOffers();
  }, []);

  const getTimeLeft = (endDate: string) => {
    if (!endDate) return 'غير محدد';
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'انتهى';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `ينتهي خلال ${hours} ساعة`;
    if (minutes > 0) return `ينتهي خلال ${minutes} دقيقة`;
    return 'ينتهي قريباً';
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-r from-red-500 to-orange-500 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="mt-4 opacity-90">جاري تحميل عروض البرق...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-r from-red-500 to-orange-500 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="h-8 w-8" />
            <h2 className="text-3xl font-bold">تخفيضات البرق</h2>
            <Zap className="h-8 w-8" />
          </div>
          <p className="text-xl opacity-90">عروض سريعة تنتهي قريباً!</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {flashOffers.slice(0, 3).map((offer) => (
            <Card key={offer.id} className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold mb-2">{offer.discount_percentage}%</div>
                <div className="text-lg mb-4">{offer.title}</div>
                <div className="text-sm opacity-80 mb-4">{getTimeLeft(offer.end_date)}</div>
                <Button className="bg-white text-red-500 hover:bg-gray-100">
                  تسوق الآن
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const CategoryOffers = () => {
  const [categories, setCategories] = useState<OfferCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await apiService.getOfferCategories();
        setCategories(response.data || []);
      } catch (err) {
        console.error('Error fetching offer categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleViewCategoryOffers = (category: OfferCategory) => {
    // الانتقال لصفحة عروض القسم
    navigate(`/offers/category/${category.id}`);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">جاري تحميل أقسام العروض...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">عروض الأقسام</h2>
          <p className="text-xl text-gray-600">عروض خاصة على كل قسم</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="group hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
              <div className="relative">
                <div 
                  className="h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url(${getImageUrl(category.image)})` }}
                >
                  <div className="absolute inset-0 bg-black/30"></div>
                  <div className="absolute top-4 right-4">
                    <Badge className={`${category.color} text-sm font-bold`}>
                      {category.offers_count} عرض
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 right-4 left-4">
                    <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-4">
                <Button 
                  onClick={() => handleViewCategoryOffers(category)}
                  className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                >
                  تصفح العروض
                  <ArrowRight className="h-4 w-4 mr-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};



export default function Offers() {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedOffers />
      <FlashSale />
      <CategoryOffers />
      {/* <WeeklyDeals /> */}
    </div>
  );
}