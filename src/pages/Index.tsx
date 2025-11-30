import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingBag,
  ShoppingCart,
  Star,
  Heart,
  Eye,
  Apple,
  Coffee,
  Cookie,
  Flower2,
  Shirt,
  Baby,
  Sparkles,
  Percent,
  Clock,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Drumstick,
  Store
} from "lucide-react";
import ProductModal from "@/components/ProductModal";

// Explicit import to ensure ShoppingCart is available
const ShoppingCartIcon = ShoppingCart;
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { getImageUrl, API_ENDPOINTS } from "@/config/api";
import { playClickSound } from "@/utils/sounds";


const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fallbackSlides = [
    {
      id: 1,
      title: "خضروات وفواكه طازجة يومياً",
      subtitle: "جودة عالية وأسعار مناسبة للجميع",
      description: "احصل على أفضل الخضروات والفواكه الطازجة مباشرة من المزارع إلى منزلك",
      button_text: "تسوق الخضروات",
      button_url: "/categories/fruits-vegetables",
      gradient_color: "from-green-600 to-emerald-600",
      background_image: "https://images.pexels.com/photos/8805175/pexels-photo-8805175.jpeg",
      badge: "طازج يومياً"
    },
    {
      id: 2,
      title: "عروض هائلة على منتجات الألبان",
      subtitle: "خصومات تصل إلى 40% على جميع المنتجات",
      description: "��كتشف تشكيلة واسعة من منتجات الألبان الطازجة والمعلبة بأفضل الأسعار",
      button_text: "اطلع على العروض",
      button_url: "/offers",
      gradient_color: "from-blue-500 to-cyan-500",
      background_image: "https://images.pexels.com/photos/8064204/pexels-photo-8064204.jpeg",
      badge: "خصم 40%"
    },
    {
      id: 3,
      title: "اللحوم الطازجة والمجمدة",
      subtitle: "جودة مضمونة وحفظ آمن",
      description: "تشكيلة متنوعة من اللحوم الطازجة والمجمدة مع ضمان الجودة والنظافة",
      button_text: "تصفح اللحوم",
      button_url: "/categories/meat-poultry",
      gradient_color: "from-red-500 to-rose-500",
      background_image: "https://images.pexels.com/photos/19352815/pexels-photo-19352815.jpeg",
      badge: "جودة مضمونة"
    }
  ];

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        console.log('Fetching sliders from:', API_ENDPOINTS.SLIDERS?.ALL || '/api/sliders');
        const response = await fetch(API_ENDPOINTS.SLIDERS?.ALL || '/api/sliders');
        console.log('Response status:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('Sliders data received:', data);
          setSlides(data.data || []);
        } else {
          console.log('Response not ok, using fallback slides');
          setSlides(fallbackSlides);
        }
      } catch (error) {
        console.error('Error fetching sliders:', error);
        setSlides(fallbackSlides);
      } finally {
        setLoading(false);
      }
    };

    fetchSliders();
  }, []);

  const displaySlides = slides.length > 0 ? slides : fallbackSlides;
  
  // Debug info only in development
  if (import.meta.env.DEV) {
    console.log('Current slides state:', slides);
    console.log('Display slides:', displaySlides);
  }

  useEffect(() => {
    if (displaySlides.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % displaySlides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [displaySlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % displaySlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + displaySlides.length) % displaySlides.length);
  };

  if (loading) {
    return (
      <section className="relative overflow-hidden">
        <div className="relative h-[500px] md:h-[600px] bg-gray-200 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل السلايدرات...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[500px] md:h-[600px]">
        {displaySlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              index === currentSlide ? 'translate-x-0' : 
              index < currentSlide ? '-translate-x-full' : 'translate-x-full'
            }`}
          >
            <div
              className={`h-full ${slide.gradient_color || 'bg-gradient-to-r from-gray-400 to-gray-600'} flex items-center bg-cover bg-center relative`}
              style={slide.background_image ? {
                backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${slide.background_image})`
              } : {}}
            >
              <div className="container mx-auto px-4">
                <div className="max-w-2xl text-white">
                  <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/20">
                    {slide.badge}
                  </Badge>
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                    {slide.title}
                  </h1>
                  <h2 className="text-xl md:text-2xl mb-6 opacity-90">
                    {slide.subtitle}
                  </h2>
                  <p className="text-lg mb-8 opacity-80 leading-relaxed">
                    {slide.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {slide.button_text && (
                      <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-8 py-4 h-auto" asChild>
                        <Link to={slide.button_url || '#'}>
                          {slide.button_text}
                          <ArrowRight className="h-5 w-5 mr-2" />
                        </Link>
                      </Button>
                    )}
                    <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-4 h-auto">
                      التوصيل المجاني
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/20 text-white hover:bg-white/30 h-12 w-12"
        onClick={prevSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/20 text-white hover:bg-white/30 h-12 w-12"
        onClick={nextSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      
      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
        {displaySlides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  );
};

const CategoriesBar = () => {
  const iconMap: Record<string, any> = {
    "fruits-vegetables": Apple,
    "dairy": Coffee,
    "meat-poultry": Drumstick,
    "bakery": Cookie,
    "frozen": Flower2,
    "cleaning": Sparkles,
    "baby-care": Baby,
    "personal-care": Shirt,
    "grocery": ShoppingBag,
    "beverages": Coffee,
    "snacks": Cookie,
    "health": Sparkles,
  };

  const { data, isLoading } = useQuery({ 
    queryKey: ["categories"], 
    queryFn: api.categories,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Extract categories from API response
  const categories = data?.data || [];

  if (isLoading) {
    return (
      <section className="bg-gray-50 py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">تسوق حسب الأقسام</h2>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gray-200 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">تسوق حسب الأقسام</h2>
            <p className="text-gray-600">اكتشف جميع المنتجات الغذائية والاستهلاكية</p>
          </div>
          <Link to="/categories">
            <Button variant="outline" size="sm">
              عرض جميع الأقسام
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category: any) => {
            const Icon = iconMap[category.slug] || Sparkles;
            const bgColor = category.slug === 'fruits-vegetables' ? 'bg-green-50 text-green-600' :
                           category.slug === 'dairy' ? 'bg-blue-50 text-blue-600' :
                           category.slug === 'meat-poultry' ? 'bg-red-50 text-red-600' :
                           category.slug === 'bakery' ? 'bg-orange-50 text-orange-600' :
                           category.slug === 'frozen' ? 'bg-cyan-50 text-cyan-600' :
                           'bg-gray-50 text-gray-600';
            
            return (
              <Card key={category.slug} className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
                <div className="relative">
                  <div 
                    className="h-48 bg-cover bg-center relative"
                    style={{ 
                      backgroundImage: `url(${category.image_url || category.image || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'})` 
                    }}
                  >
                    <div className="absolute inset-0 bg-black/30"></div>
                    <div className="absolute bottom-4 right-4 left-4">
                      <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bgColor} mb-3`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <Link to={`/categories/${category.slug}`}>
                          <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                            {category.name_ar}
                          </h3>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4" />
                      <span>{category.subcategories_count || 0} قسم فرعي</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Store className="h-4 w-4" />
                      <span>{category.products_count || 0} منتج</span>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                    asChild
                  >
                    <Link to={`/categories/${category.slug}`}>
                      تصفح القسم
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const OffersSection = () => {
  const { data } = useQuery({ queryKey: ["offers", 1], queryFn: () => api.offers(1) });
  const items = (data?.data ?? []).slice(0, 3);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">العروض اليومية</h2>
            <p className="text-gray-600">عروض خاصة على أفضل المنتجات الغذائية</p>
          </div>
          <Link to="/offers">
            <Button variant="outline">
              <Percent className="h-4 w-4 ml-2" />
              عرض جميع العروض
            </Button>
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((p) => {
            const discount = p.original_price && p.original_price > p.price ? Math.round(((Number(p.original_price) - Number(p.price)) / Number(p.original_price)) * 100) : 0;
            const bgImage = p.image ? p.image : "/placeholder.svg";
            return (
              <Card key={p.id} className="group hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                <div
                  className={`h-48 relative bg-cover bg-center`}
                  style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${bgImage})`,
                  }}
                >
                  <div className="absolute top-4 right-4">
                    <Badge variant="destructive" className="text-lg px-3 py-1">خصم {discount}%</Badge>
                  </div>
                  <div className="absolute bottom-4 right-4 left-4">
                    <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4">
                      <h3 className="font-bold text-lg mb-1">{p.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{p.vendor?.name ?? ""}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-orange-600">
                          <Clock className="h-4 w-4" />
                          متاح الآن
                        </div>
                        <Link to={`/product/${p.id}`}>
                          <Button size="sm">تسوق الآن</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const PopularProducts = () => {
  const qc = useQueryClient();
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [wishlistedProducts, setWishlistedProducts] = useState<Set<number>>(new Set());
  
  const { data, isLoading } = useQuery({ 
    queryKey: ["featured"], 
    queryFn: api.featured,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Fallback data if API fails
  const fallbackProducts = [
    {
      id: 1,
      name: "منتج تجريبي 1",
      price: 2.500,
      original_price: 3.000,
      image: "/placeholder.svg",
      rating: 4.5,
      is_fresh: true,
      reviews_count: 12,
      vendor: { name: "متجر تجريبي" }
    },
    {
      id: 2,
      name: "منتج تجريبي 2", 
      price: 1.800,
      original_price: null,
      image: "/placeholder.svg",
      rating: 4.2,
      is_fresh: false,
      reviews_count: 8,
      vendor: { name: "متجر تجريبي" }
    }
  ];
  
  const products = Array.isArray(data) ? data : fallbackProducts;

  const handleWishlistToggle = async (productId: number) => {
    try {
      if (wishlistedProducts.has(productId)) {
        await api.wishlist.remove(productId);
        setWishlistedProducts(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
        toast.success('تم إزالة المنتج من قائمة الأمنيات');
      } else {
        await api.wishlist.add(productId);
        setWishlistedProducts(prev => new Set(prev).add(productId));
        toast.success('تم إضافة المنتج إلى قائمة الأمنيات');
      }
      qc.invalidateQueries({ queryKey: ["wishlist"] });
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error('حدث خطأ أثناء تحديث قائمة الأمنيات');
    }
  };

  const handleViewProduct = (productId: number) => {
    try {
      setSelectedProductId(productId);
    } catch (error) {
      console.error('Error opening product modal:', error);
      toast.error('حدث خطأ أثناء فتح تفاصيل المنتج');
    }
  };

  if (isLoading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">المنتجات الأكثر طلباً</h2>
              <p className="text-gray-600">المنتجات المفضلة لدى عملائنا</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-0">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-6 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">المنتجات الأكثر طلباً</h2>
            <p className="text-gray-600">المنتجات المفضلة لدى عملائنا</p>
          </div>
          <Link to="/search">
            <Button variant="outline">
              <TrendingUp className="h-4 w-4 ml-2" />
              عرض المزيد من المنتجات
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => {
            const rating = Math.floor(Number(product.rating ?? 0));
            const bgImage = getImageUrl((product as any).image_url || product.image);
            const discount = product.original_price && Number(product.original_price) > Number(product.price)
              ? Math.round(((Number(product.original_price) - Number(product.price)) / Number(product.original_price)) * 100)
              : 0;
            return (
              <Card key={product.id} className="group hover:shadow-lg transition-all cursor-pointer">
                <CardContent className="p-0">
                  <div className="relative">
                    <Link to={`/product/${product.id}`}>
                      <div
                        className={`aspect-square rounded-t-lg flex items-center justify-center bg-cover bg-center`}
                        style={{ backgroundImage: `url(${bgImage})` }}
                      >
                        {!(product as any).image_url && !product.image && <ShoppingBag className="h-16 w-16 text-gray-400" />}
                      </div>
                    </Link>
                    {discount > 0 && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="destructive" className="text-xs">-{discount}%</Badge>
                      </div>
                    )}
                    {product.is_fresh && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-green-500 text-white text-xs">طازج</Badge>
                      </div>
                    )}
                    <div className="absolute top-12 left-2 flex flex-col gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 bg-white/80 hover:bg-white"
                        onClick={() => handleWishlistToggle(product.id)}
                      >
                        <Heart className={`h-4 w-4 ${wishlistedProducts.has(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 bg-white/80 hover:bg-white"
                        onClick={() => handleViewProduct(product.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-gray-500 mb-1">{product.vendor?.name ?? ''}</div>
                    <Link to={`/product/${product.id}`} className="block">
                      <h3 className="font-medium text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">{product.name}</h3>
                    </Link>
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">({product.reviews_count ?? 0})</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-bold text-primary">{Number(product.price).toFixed(3)} دينار</span>
                      {product.original_price && (
                        <span className="text-xs text-gray-500 line-through">{Number(product.original_price).toFixed(3)} دينار</span>
                      )}
                    </div>
                    <Button 
                      className="w-full" 
                      size="sm"
                      onClick={async () => {
                        // Play click sound
                        playClickSound();
                        
                        try {
                          await api.cart.add(product.id, 1);
                          qc.invalidateQueries({ queryKey: ["cart", "count"] });
                          qc.invalidateQueries({ queryKey: ["cart"] });
                          toast.success('تم إضافة المنتج إلى السلة بنجاح! 🛒', {
                            description: product.name,
                            duration: 5000,
                            className: 'toast-success',
                          });
                        } catch (error) {
                          toast.error('حدث خطأ أثناء إضافة المنتج للسلة ❌', {
                            description: 'يرجى المحاولة مرة أخرى',
                            duration: 5000,
                            className: 'toast-error',
                          });
                        }
                      }}
                    >
                      <ShoppingCartIcon className="h-4 w-4 ml-2" />
                      إضافة للسلة
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      
      <ProductModal
        productId={selectedProductId}
        isOpen={!!selectedProductId}
        onClose={() => setSelectedProductId(null)}
      />
    </section>
  );
};



export default function Index() {
  return (
    <>
      <HeroSlider />
      <CategoriesBar />
      <OffersSection />
      <PopularProducts />
    </>
  );
}
