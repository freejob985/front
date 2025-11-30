import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { 
  Search,
  Grid3X3,
  List,
  Star,
  Store,
  MapPin,
  Phone,
  Mail,
  Package,
  ShoppingCart,
  Eye,
  Heart,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

// مكون البحث والفلترة
const SearchAndFilters = ({ 
  searchQuery, 
  setSearchQuery, 
  sortBy, 
  setSortBy, 
  category, 
  setCategory,
  categories,
  onSearch 
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  category: string;
  setCategory: (cat: string) => void;
  categories: any[];
  onSearch: () => void;
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* حقل البحث */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="ابحث عن مورد أو منتج..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearch()}
              className="pr-10"
            />
          </div>
        </div>

        {/* فلتر الترتيب */}
        <div className="w-full lg:w-48">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="ترتيب حسب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">الأحدث</SelectItem>
              <SelectItem value="name">الاسم</SelectItem>
              <SelectItem value="rating">التقييم</SelectItem>
              <SelectItem value="products_count">عدد المنتجات</SelectItem>
              <SelectItem value="orders_count">عدد الطلبات</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* فلتر الأقسام */}
        <div className="w-full lg:w-48">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="جميع الأقسام" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأقسام</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id || cat.slug} value={cat.slug || cat.id}>
                  {cat.name_ar || cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* زر البحث */}
        <Button onClick={onSearch} className="w-full lg:w-auto">
          <Search className="h-4 w-4 ml-2" />
          بحث
        </Button>
      </div>
    </div>
  );
};

// مكون بطاقة المورد
const VendorCard = ({ vendor, onViewProducts }: { vendor: any; onViewProducts: (vendorId: number) => void }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
      <div className="relative flex-shrink-0">
        {/* صورة الغلاف */}
        <div 
          className="h-56 sm:h-48 bg-cover bg-center relative"
          style={{ 
            backgroundImage: `url(${vendor.cover_image || vendor.logo || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop'})` 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          
          {/* الشارات */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {vendor.is_featured && (
              <Badge className="bg-yellow-500 text-white text-xs px-2 py-1">
                مميز
              </Badge>
            )}
            {vendor.is_fresh && (
              <Badge className="bg-green-500 text-white text-xs px-2 py-1">
                طازج يومياً
              </Badge>
            )}
          </div>

          {/* زر المفضلة */}
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="absolute top-3 left-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-sm"
          >
            <Heart 
              className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
            />
          </button>

          {/* معلومات المورد */}
          <div className="absolute bottom-0 right-0 left-0 p-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-t-lg p-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-14 h-14 rounded-full bg-cover bg-center flex-shrink-0 border-2 border-white shadow-md"
                  style={{ 
                    backgroundImage: `url(${vendor.logo || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=100&h=100&fit=crop'})` 
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg group-hover:text-primary transition-colors truncate">
                    {vendor.name_ar || vendor.name}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">{vendor.category || 'عام'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4 sm:p-6 flex-1 flex flex-col">
        {/* التقييم والموقع */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-sm">{vendor.rating || 4.5}</span>
            <span className="text-xs text-gray-500">({vendor.reviews_count || 0})</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{vendor.city || vendor.governorate || 'غير محدد'}</span>
          </div>
        </div>

        {/* الإحصائيات */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Package className="h-5 w-5 mx-auto mb-2 text-primary" />
            <div className="text-lg font-bold text-gray-900">{vendor.products_count || 0}</div>
            <div className="text-xs text-gray-600">منتج</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <ShoppingCart className="h-5 w-5 mx-auto mb-2 text-green-600" />
            <div className="text-lg font-bold text-gray-900">{vendor.orders_count || 0}</div>
            <div className="text-xs text-gray-600">طلب</div>
          </div>
        </div>

        {/* الوصف */}
        {vendor.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
            {vendor.description}
          </p>
        )}

        {/* معلومات الاتصال */}
        <div className="space-y-2 mb-4 text-xs text-gray-600">
          {vendor.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{vendor.phone}</span>
            </div>
          )}
          {vendor.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{vendor.email}</span>
            </div>
          )}
        </div>

        {/* الأزرار */}
        <div className="flex gap-2 mt-auto pt-2">
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 text-xs h-8"
            onClick={() => onViewProducts(vendor.id)}
          >
            <Eye className="h-3 w-3 ml-1" />
            عرض المنتجات
          </Button>
          <Button 
            variant="default" 
            size="sm"
            className="flex-1 text-xs h-8"
            onClick={() => onViewProducts(vendor.id)}
          >
            <Store className="h-3 w-3 ml-1" />
            زيارة المورد
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// مكون Pagination
const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void; 
}) => {
  const pages = [];
  const maxVisiblePages = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        السابق
      </Button>
      
      <div className="flex items-center gap-1">
        {startPage > 1 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
              className="w-8 h-8 p-0"
            >
              1
            </Button>
            {startPage > 2 && <span className="text-gray-500">...</span>}
          </>
        )}
        
        {pages.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            className="w-8 h-8 p-0"
          >
            {page}
          </Button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="text-gray-500">...</span>}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              className="w-8 h-8 p-0"
            >
              {totalPages}
            </Button>
          </>
        )}
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1"
      >
        التالي
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

// المكون الرئيسي
const Vendors = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [category, setCategory] = useState('all');
  const [categories, setCategories] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(12);

  // جلب الأقسام
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.categories();
        setCategories(response.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // جلب الموردين
  const { data: vendorsData, isLoading, error, refetch } = useQuery({
    queryKey: ["vendors", searchQuery, sortBy, category, currentPage],
    queryFn: () => api.vendors({ 
      search: searchQuery, 
      sort_by: sortBy, 
      category: category === 'all' ? undefined : category,
      page: currentPage,
      per_page: perPage
    } as any),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const vendors = vendorsData?.data || [];
  const totalPages = (vendorsData as any)?.meta?.last_page || 1;

  const handleSearch = () => {
    setCurrentPage(1);
    refetch();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewProducts = (vendorId: number) => {
    navigate(`/vendors/${vendorId}/products`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* الهيدر */}
      <section className="bg-gradient-to-r from-green-50 to-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              موردو المنتجات الغذائية
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              اكتشف أفضل الموردين الموثوقين للمنتجات الغذائية والاستهلاكية
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* البحث والفلترة */}
        <SearchAndFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          category={category}
          setCategory={setCategory}
          categories={categories}
          onSearch={handleSearch}
        />

        {/* شريط الأدوات */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl sm:text-2xl font-bold">
              الموردون ({vendors.length})
            </h2>
            {isLoading && (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="flex-1 sm:flex-none"
            >
              <Grid3X3 className="h-4 w-4" />
              <span className="hidden sm:inline mr-2">شبكة</span>
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="flex-1 sm:flex-none"
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline mr-2">قائمة</span>
            </Button>
          </div>
        </div>

        {/* قائمة الموردين */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="animate-pulse h-full">
                <div className="w-full h-56 sm:h-48 bg-gray-200"></div>
                <CardContent className="p-4 sm:p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="h-16 bg-gray-200 rounded"></div>
                    <div className="h-16 bg-gray-200 rounded"></div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-gray-200 rounded flex-1"></div>
                    <div className="h-8 bg-gray-200 rounded flex-1"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <Store className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold mb-2">حدث خطأ في تحميل الموردين</h3>
            <p className="text-gray-600 mb-4">
              {error instanceof Error ? error.message : 'خطأ غير معروف'}
            </p>
            <Button onClick={() => refetch()}>
              المحاولة مرة أخرى
            </Button>
          </div>
        ) : vendors.length === 0 ? (
          <div className="text-center py-12">
            <Store className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold mb-2">لا توجد موردين</h3>
            <p className="text-gray-600">
              {searchQuery ? 'لم نجد موردين يطابقون بحثك' : 'لا توجد موردين مسجلين حالياً'}
            </p>
          </div>
        ) : (
          <div className={`grid gap-4 sm:gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1 max-w-4xl mx-auto'
          }`}>
            {vendors.map((vendor: any) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                onViewProducts={handleViewProducts}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Vendors;
