import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

// Default category images
const getDefaultCategoryImage = (categorySlug: string) => {
  const defaultImages: Record<string, string> = {
    'fruits-vegetables': 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=300&fit=crop',
    'dairy': 'https://images.unsplash.com/photo-1550583724-b2696b85b150?w=400&h=300&fit=crop',
    'meat-poultry': 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop',
    'bakery': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
    'frozen': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    'cleaning': 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=400&h=300&fit=crop',
    'baby-care': 'https://images.unsplash.com/photo-1515488042361-ee00e0d4d8b4?w=400&h=300&fit=crop',
    'personal-care': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop',
    'beverages': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop',
    'snacks': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
  };
  
  return defaultImages[categorySlug] || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop';
};

// FontAwesome to Lucide icon mapping
const mapFontAwesomeToLucide = (faClass: string) => {
  const iconMap: Record<string, any> = {
    // Fruits & Vegetables
    'fas fa-apple-alt': Apple,
    'fas fa-carrot': Apple,
    'fas fa-lemon': Apple,
    'fas fa-pepper-hot': Apple,
    
    // Dairy
    'fas fa-milk': Coffee,
    'fas fa-cheese': Coffee,
    
    // Meat & Poultry
    'fas fa-drumstick-bite': Drumstick,
    'fas fa-bacon': Drumstick,
    'fas fa-fish': Drumstick,
    
    // Bakery
    'fas fa-bread-slice': Cookie,
    'fas fa-cookie': Cookie,
    'fas fa-cake': Cookie,
    
    // Frozen
    'fas fa-snowflake': Flower2,
    
    // Cleaning
    'fas fa-spray-can': Sparkles,
    'fas fa-broom': Sparkles,
    'fas fa-soap': Sparkles,
    
    // Baby care
    'fas fa-baby': Baby,
    'fas fa-baby-carriage': Baby,
    
    // Cooking
    'fas fa-utensils': ChefHat,
    'fas fa-blender': ChefHat,
    'fas fa-mortar-pestle': ChefHat,
    
    // Default
    'default': ShoppingBag
  };
  
  // Try to find exact match first
  if (iconMap[faClass]) {
    return iconMap[faClass];
  }
  
  // Try to match by category keyword
  const lowerFaClass = faClass.toLowerCase();
  if (lowerFaClass.includes('apple') || lowerFaClass.includes('fruit') || lowerFaClass.includes('vegetable') || lowerFaClass.includes('carrot') || lowerFaClass.includes('lemon') || lowerFaClass.includes('pepper')) {
    return Apple;
  }
  if (lowerFaClass.includes('milk') || lowerFaClass.includes('coffee') || lowerFaClass.includes('dairy') || lowerFaClass.includes('cheese') || lowerFaClass.includes('ice-cream')) {
    return Coffee;
  }
  if (lowerFaClass.includes('meat') || lowerFaClass.includes('drumstick') || lowerFaClass.includes('bacon') || lowerFaClass.includes('fish')) {
    return Drumstick;
  }
  if (lowerFaClass.includes('bread') || lowerFaClass.includes('cookie') || lowerFaClass.includes('bakery') || lowerFaClass.includes('cake')) {
    return Cookie;
  }
  if (lowerFaClass.includes('frozen') || lowerFaClass.includes('snow') || lowerFaClass.includes('snowflake')) {
    return Flower2;
  }
  if (lowerFaClass.includes('clean') || lowerFaClass.includes('spray') || lowerFaClass.includes('soap') || lowerFaClass.includes('broom')) {
    return Sparkles;
  }
  if (lowerFaClass.includes('baby') || lowerFaClass.includes('carriage')) {
    return Baby;
  }
  if (lowerFaClass.includes('cook') || lowerFaClass.includes('utensil') || lowerFaClass.includes('blender') || lowerFaClass.includes('mortar')) {
    return ChefHat;
  }
  
  // Default fallback
  return ShoppingBag;
};

import { 
  ShoppingBag,
  Search,
  Filter,
  Grid3X3,
  List,
  Apple,
  Coffee,
  Drumstick,
  Cookie,
  Flower2,
  Sparkles,
  Baby,
  ChefHat,
  Star,
  Store
} from "lucide-react";


const Hero = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/search');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="bg-gradient-to-r from-green-50 to-blue-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            أقسام السوبر ماركت
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            اكتشف جميع المنتجات الغذائية والاستهلاكية من موردين موثوقين
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="flex items-center bg-white rounded-full px-6 py-3 shadow-sm min-w-[400px]">
              <Search className="h-5 w-5 text-gray-400 ml-3" />
              <input 
                type="text" 
                placeholder="ابحث عن أي منتج غذائي تريده..." 
                className="flex-1 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button size="sm" className="rounded-full mr-2" onClick={handleSearch}>
                بحث
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CategoryGrid = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.categories();
        console.log('API Response:', response);
        console.log('Is Array:', Array.isArray(response));
        
        // Handle different response formats
        let categoriesData: any[] = [];
        if (Array.isArray(response)) {
          categoriesData = response;
        } else if (response && (response as any).data && Array.isArray((response as any).data)) {
          categoriesData = (response as any).data;
        } else if (response && (response as any).categories && Array.isArray((response as any).categories)) {
          categoriesData = (response as any).categories;
        } else {
          console.warn('Unexpected API response format:', response);
          categoriesData = [];
        }
        
        console.log('Categories data processed:', categoriesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to static data if API fails
        console.log('Using fallback data');
        setCategories([
          {
            id: "fruits-vegetables",
            slug: "fruits-vegetables",
            name: "خضروات وفواكه",
            name_ar: "خضروات وفواكه",
            name_en: "Fruits & Vegetables",
            icon: Apple,
            count: "2,450 منتج",
            suppliers: "120 مورد",
            color: "bg-green-50 text-green-600",
            popular: true,
            image: "https://images.pexels.com/photos/8805175/pexels-photo-8805175.jpeg"
          },
          {
            id: "dairy",
            slug: "dairy",
            name: "منتجات الألبان",
            name_ar: "منتجات الألبان",
            name_en: "Dairy Products",
            icon: Coffee,
            count: "1,320 منتج",
            suppliers: "85 مورد",
            color: "bg-blue-50 text-blue-600",
            popular: true,
            image: "https://images.pexels.com/photos/8064204/pexels-photo-8064204.jpeg"
          },
          {
            id: "meat-poultry",
            name_ar: "لحوم ودواجن",
            name_en: "Meat & Poultry",
            icon: Drumstick,
            count: "890 منتج",
            suppliers: "65 مورد",
            color: "bg-red-50 text-red-600",
            popular: true,
            image: "https://images.pexels.com/photos/19352815/pexels-photo-19352815.jpeg"
          },
          {
            id: "bakery",
            name_ar: "مخبوزات",
            name_en: "Bakery",
            icon: Cookie,
            count: "1,560 منتج",
            suppliers: "95 مورد",
            color: "bg-orange-50 text-orange-600",
            image: "https://images.pexels.com/photos/2680601/pexels-photo-2680601.jpeg"
          },
          {
            id: "frozen",
            name_ar: "مجمدات",
            name_en: "Frozen Foods",
            icon: Flower2,
            count: "780 منتج",
            suppliers: "45 مورد",
            color: "bg-cyan-50 text-cyan-600",
            image: "https://images.pexels.com/photos/4846308/pexels-photo-4846308.jpeg"
          },
          {
            id: "cleaning",
            name_ar: "منظفات ومنتجات التنظيف",
            name_en: "Cleaning Products",
            icon: Sparkles,
            count: "1,240 منتج",
            suppliers: "75 مورد",
            color: "bg-purple-50 text-purple-600",
            image: "https://images.pexels.com/photos/30688912/pexels-photo-30688912.jpeg"
          },
          {
            id: "baby-care",
            name_ar: "منتجات الأطفال",
            name_en: "Baby Care",
            icon: Baby,
            count: "680 منتج",
            suppliers: "35 مورد",
            color: "bg-pink-50 text-pink-600",
            image: "https://images.pexels.com/photos/8805175/pexels-photo-8805175.jpeg"
          },
          {
            id: "cooking",
            name_ar: "أدوات الطبخ",
            name_en: "Cooking Tools",
            icon: ChefHat,
            count: "920 منتج",
            suppliers: "55 مورد",
            color: "bg-indigo-50 text-indigo-600",
            image: "https://images.pexels.com/photos/4846308/pexels-photo-4846308.jpeg"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">جاري تحميل الأقسام...</p>
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
            <h2 className="text-3xl font-bold mb-2">أقسام السوبر ماركت</h2>
            <p className="text-gray-600">اختر القسم المناسب لك وابدأ التسوق</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(() => {
            console.log('Categories in render:', categories);
            console.log('Is Array in render:', Array.isArray(categories));
            if (!Array.isArray(categories)) return null;
            return categories.map((category) => (
            <Card key={category.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
              <div className="relative">
                <div 
                  className="h-48 bg-cover bg-center relative"
                  style={{ 
                    backgroundImage: `url(${category.image_url || category.image || getDefaultCategoryImage(category.slug || category.id)})` 
                  }}
                >
                  <div className="absolute inset-0 bg-black/30"></div>
                  <div className="absolute top-4 right-4">
                    {category.popular && (
                      <Badge variant="destructive" className="text-xs">
                        الأكثر شعبية
                      </Badge>
                    )}
                  </div>
                  <div className="absolute bottom-4 right-4 left-4">
                    <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category.color || 'bg-gray-50 text-gray-600'} mb-3`}>
                        {category.icon && typeof category.icon === 'string' ? (
                          // Check if it's a FontAwesome class that needs mapping
                          category.icon.startsWith('fas fa-') ? (
                            (() => {
                              const LucideIcon = mapFontAwesomeToLucide(category.icon);
                              return <LucideIcon className="h-5 w-5" />;
                            })()
                          ) : (
                            // Regular CSS class
                            <i className={`${category.icon} text-lg`}></i>
                          )
                        ) : category.icon ? (
                          <category.icon className="h-5 w-5" />
                        ) : (
                          <ShoppingBag className="h-5 w-5" />
                        )}
                      </div>
                      <Link to={`/categories/${category.slug || category.id}`}>
                        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                          {category.name_ar || category.name}
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
                    <span>{category.count || `${category.subcategories_count || 0} قسم فرعي`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Store className="h-4 w-4" />
                    <span>{category.suppliers || `${category.products_count || 0} منتج`}</span>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                  asChild
                >
                  <Link to={`/categories/${category.slug || category.id}`}>
                    تصفح القسم
                  </Link>
                </Button>
              </CardContent>
            </Card>
            ));
          })()}
        </div>
      </div>
    </section>
  );
};

const FeaturedSuppliers = () => {
  const navigate = useNavigate();
  
  // Get featured vendors from API
  const { data: vendorsData, isLoading, error } = useQuery({
    queryKey: ["featuredVendors"],
    queryFn: async () => {
      console.log('🔍 Fetching featured vendors from API...');
      try {
        const result = await api.featuredVendors();
        console.log('✅ Featured vendors API response:', result);
        return result;
      } catch (err) {
        console.error('❌ Featured vendors API error:', err);
        throw err;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Transform API data to match expected format
  console.log('📊 Vendors data for transformation:', vendorsData);
  const suppliers = vendorsData?.data?.map(vendor => {
    console.log('🔄 Transforming vendor:', vendor);
    return {
      id: vendor.id,
      name: vendor.name_ar || vendor.name,
      category: vendor.category,
      rating: vendor.rating,
      products: vendor.products_count,
      fresh: vendor.is_fresh,
      image: vendor.logo || "https://images.pexels.com/photos/8805175/pexels-photo-8805175.jpeg",
      orders: (vendor as any).orders_count || 0, // Use actual order count from API
      city: vendor.city,
      governorate: vendor.governorate
    };
  }) || [];
  console.log('✨ Transformed suppliers:', suppliers);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">الموردون المميزون</h2>
          <p className="text-xl text-gray-600">أفضل الموردين الموثقين في كل قسم</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="w-full h-32 bg-gray-200"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))
          ) : error ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">حدث خطأ في تحميل الموردين المميزين</p>
              <p className="text-sm text-gray-400 mt-2">Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
            </div>
          ) : suppliers.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">لا توجد موردين مميزين حالياً</p>
            </div>
          ) : (
            suppliers.map((supplier, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
              onClick={() => navigate(`/vendors/${supplier.id}/products`)}
            >
              <div className="relative">
                <div 
                  className="w-full h-32 bg-cover bg-center"
                  style={{ backgroundImage: `url(${supplier.image})` }}
                >
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Store className="h-12 w-12 text-white" />
                  </div>
                  {supplier.fresh && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-green-500 text-white text-xs">
                        طازج يومياً
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                  {supplier.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{supplier.category}</p>
                
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{supplier.rating}</span>
                    </div>
                    <span className="text-gray-600">{supplier.products} منتج</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{supplier.orders || 0} طلب</span>
                    <span>{supplier.city || supplier.governorate || 'غير محدد'}</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/vendors/${supplier.id}/products`);
                  }}
                >
                  زيارة المورد
                </Button>
              </CardContent>
            </Card>
            ))
          )}
        </div>
        
        {/* رابط عرض جميع الموردين */}
        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/vendors')}
            className="px-8"
          >
            <Store className="h-5 w-5 ml-2" />
            عرض جميع الموردين
          </Button>
        </div>
      </div>
    </section>
  );
};


export default function Categories() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <FeaturedSuppliers />
    </>
  );
}
