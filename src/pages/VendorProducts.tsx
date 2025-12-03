import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import logger from "@/lib/logger";
import { toast } from "sonner";
import { playClickSound } from "@/utils/sounds";
import ProductModal from "@/components/ProductModal";
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
  Heart,
  Plus,
  Minus,
  ArrowLeft,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";

// مكون معلومات المورد
const VendorInfo = ({ vendor }: { vendor: any }) => {
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* صورة المورد */}
          <div className="flex-shrink-0">
            <div 
              className="w-24 h-24 rounded-full bg-cover bg-center mx-auto lg:mx-0"
              style={{ 
                backgroundImage: `url(${vendor.logo || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=100&h=100&fit=crop'})` 
              }}
            />
          </div>

          {/* معلومات المورد */}
          <div className="flex-1 text-center lg:text-right">
            <h1 className="text-3xl font-bold mb-2">{vendor.name_ar || vendor.name}</h1>
            <p className="text-lg text-gray-600 mb-4">{vendor.category || 'عام'}</p>
            
            {/* التقييم */}
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${
                      i < Math.floor(vendor.rating || 4.5) 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
                    }`} 
                  />
                ))}
              </div>
              <span className="font-medium">{vendor.rating || 4.5}</span>
              <span className="text-sm text-gray-500">({vendor.reviews_count || 0} تقييم)</span>
            </div>

            {/* الإحصائيات */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Package className="h-6 w-6 mx-auto mb-1 text-primary" />
                <div className="text-xl font-bold">{vendor.products_count || 0}</div>
                <div className="text-sm text-gray-600">منتج</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <ShoppingCart className="h-6 w-6 mx-auto mb-1 text-green-600" />
                <div className="text-xl font-bold">{vendor.orders_count || 0}</div>
                <div className="text-sm text-gray-600">طلب</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <MapPin className="h-6 w-6 mx-auto mb-1 text-blue-600" />
                <div className="text-sm font-bold">{vendor.city || 'غير محدد'}</div>
                <div className="text-sm text-gray-600">المدينة</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Store className="h-6 w-6 mx-auto mb-1 text-purple-600" />
                <div className="text-sm font-bold">{vendor.governorate || 'غير محدد'}</div>
                <div className="text-sm text-gray-600">المحافظة</div>
      </div>
    </div>
    
            {/* الوصف */}
            {vendor.description && (
              <p className="text-gray-600 mb-4">{vendor.description}</p>
            )}

            {/* معلومات الاتصال */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {vendor.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{vendor.phone}</span>
                </div>
              )}
              {vendor.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{vendor.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// مكون البحث والفلترة
const SearchAndFilters = ({ 
  searchQuery, 
  setSearchQuery, 
  sortBy, 
  setSortBy, 
  category, 
  setCategory,
  onSearch 
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  category: string;
  setCategory: (cat: string) => void;
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
              placeholder="ابحث عن منتج..."
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
              <SelectItem value="price_asc">السعر: من الأقل للأعلى</SelectItem>
              <SelectItem value="price_desc">السعر: من الأعلى للأقل</SelectItem>
              <SelectItem value="rating">التقييم</SelectItem>
              <SelectItem value="sales">الأكثر مبيعاً</SelectItem>
            </SelectContent>
          </Select>
      </div>
      
        {/* فلتر الفئة */}
        <div className="w-full lg:w-48">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="جميع الفئات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الفئات</SelectItem>
              <SelectItem value="fruits-vegetables">خضروات وفواكه</SelectItem>
              <SelectItem value="dairy">منتجات الألبان</SelectItem>
              <SelectItem value="meat-poultry">لحوم ودواجن</SelectItem>
              <SelectItem value="bakery">مخبوزات</SelectItem>
              <SelectItem value="frozen">مجمدات</SelectItem>
              <SelectItem value="cleaning">منظفات</SelectItem>
              <SelectItem value="baby-care">منتجات الأطفال</SelectItem>
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

// مكون بطاقة المنتج
const ProductCard = ({ 
  product, 
  onWishlistToggle, 
  onViewProduct,
  isWishlisted 
}: { 
  product: any;
  onWishlistToggle: (productId: number) => void;
  onViewProduct: (productId: number) => void;
  isWishlisted: boolean;
}) => {
  const [quantity, setQuantity] = useState(1);
  const qc = useQueryClient();

  const handleAddToCart = async () => {
    // Play click sound
    playClickSound();
    
    try {
      logger.info('محاولة إضافة منتج للسلة', { productId: product.id, quantity });
      await api.cart.add(product.id, quantity);
      qc.invalidateQueries({ queryKey: ["cart", "count"] });
      qc.invalidateQueries({ queryKey: ["cart"] });
      toast.success('تم إضافة المنتج إلى السلة بنجاح! 🛒', {
        description: product.name,
        duration: 5000,
        className: 'toast-success',
      });
    } catch (error) {
      logger.error('خطأ في إضافة المنتج للسلة', { productId: product.id, error });
      toast.error('حدث خطأ أثناء إضافة المنتج للسلة ❌', {
        description: 'يرجى المحاولة مرة أخرى',
        duration: 5000,
        className: 'toast-error',
      });
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative">
        {/* صورة المنتج */}
        <div 
          className="h-48 bg-cover bg-center relative"
          style={{ 
            backgroundImage: `url(${product.main_image || product.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop'})` 
          }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
          
          {/* الشارات */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {product.is_featured && (
              <Badge className="bg-yellow-500 text-white text-xs">
                مميز
              </Badge>
            )}
            {product.is_fresh && (
              <Badge className="bg-green-500 text-white text-xs">
                طازج
              </Badge>
            )}
            {product.is_on_sale && (
              <Badge className="bg-red-500 text-white text-xs">
                خصم {product.discount_percentage}%
              </Badge>
            )}
          </div>

          {/* زر المفضلة */}
          <button
            onClick={() => onWishlistToggle(product.id)}
            className="absolute top-4 left-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
          >
            <Heart 
              className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
            />
          </button>

          {/* زر العرض السريع */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => onViewProduct(product.id)}
            >
              <Eye className="h-4 w-4 ml-2" />
              عرض سريع
            </Button>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        {/* اسم المنتج */}
        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {product.name}
        </h3>

        {/* التقييم */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating || 4.5) 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'text-gray-300'
                }`} 
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">({product.reviews_count || 0})</span>
        </div>

        {/* السعر */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold text-primary">
            {product.price} د.ك
          </span>
          {product.original_price && product.original_price > product.price && (
            <span className="text-sm text-gray-500 line-through">
              {product.original_price} د.ك
            </span>
          )}
          </div>
          
        {/* الكمية */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center">{quantity}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <span className="text-sm text-gray-600">
            متوفر: {product.stock}
          </span>
        </div>

        {/* زر الإضافة للسلة */}
        <Button 
          className="w-full" 
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          <ShoppingCart className="h-4 w-4 ml-2" />
          {product.stock === 0 ? 'غير متوفر' : 'أضف للسلة'}
        </Button>
      </CardContent>
    </Card>
  );
};

// مكون Pagination جذاب
const PaginationComponent = ({
  currentPage,
  totalPages,
  totalItems,
  perPage,
  onPageChange,
  className = ""
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * perPage + 1;
  const endItem = Math.min(currentPage * perPage, totalItems);

  // حساب الصفحات المرئية
  const maxVisiblePages = 7;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 ${className}`}>
      {/* معلومات الصفحة */}
      <div className="text-sm text-gray-600">
        عرض <span className="font-semibold text-gray-900">{startItem}</span> إلى{' '}
        <span className="font-semibold text-gray-900">{endItem}</span> من{' '}
        <span className="font-semibold text-gray-900">{totalItems}</span> منتج
      </div>

      {/* أزرار التنقل */}
      <div className="flex items-center gap-2">
        {/* زر الصفحة الأولى */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="hidden sm:flex"
          title="الصفحة الأولى"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        {/* زر السابق */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">السابق</span>
        </Button>

        {/* أرقام الصفحات */}
        <div className="flex items-center gap-1">
          {startPage > 1 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(1)}
                className="w-10 h-10 p-0 font-medium"
              >
                1
              </Button>
              {startPage > 2 && (
                <span className="text-gray-400 px-2">...</span>
              )}
            </>
          )}

          {pages.map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 p-0 font-medium transition-all ${
                currentPage === page
                  ? "bg-primary text-white shadow-md scale-105"
                  : "hover:bg-gray-100"
              }`}
            >
              {page}
            </Button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <span className="text-gray-400 px-2">...</span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(totalPages)}
                className="w-10 h-10 p-0 font-medium"
              >
                {totalPages}
              </Button>
            </>
          )}
        </div>

        {/* زر التالي */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1"
        >
          <span className="hidden sm:inline">التالي</span>
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* زر الصفحة الأخيرة */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="hidden sm:flex"
          title="الصفحة الأخيرة"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// المكون الرئيسي
const VendorProducts = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const qc = useQueryClient();
  
  // قراءة المعاملات من URL أو استخدام القيم الافتراضية
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'created_at');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [wishlistedProducts, setWishlistedProducts] = useState<Set<number>>(new Set());

  // تحديد نوع المسار - هل هو للمورد المسجل أم للجمهور العام
  const isVendorDashboard = window.location.pathname === '/vendor/products';

  // دوال معالجة الأمنيات والعرض السريع
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
      logger.error('خطأ في تحديث قائمة الأمنيات', { productId, error });
      toast.error('حدث خطأ أثناء تحديث قائمة الأمنيات');
    }
  };

  const handleViewProduct = (productId: number) => {
    try {
      setSelectedProductId(productId);
    } catch (error) {
      logger.error('خطأ في فتح تفاصيل المنتج', { productId, error });
      toast.error('حدث خطأ أثناء فتح تفاصيل المنتج');
    }
  };

  // جلب بيانات المورد (فقط للجمهور العام)
  const { data: vendorData, isLoading: vendorLoading } = useQuery({
    queryKey: ["vendor", id],
    queryFn: () => api.getVendor(id!),
    enabled: !!id && !isVendorDashboard,
    onError: (error) => {
      logger.error('خطأ في تحميل بيانات المورد', { vendorId: id, error });
    }
  });

  // دالة تحديث URL parameters
  const updateSearchParams = (updates: { search?: string; sort?: string; category?: string; page?: number }) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (updates.search !== undefined) {
      if (updates.search) {
        newParams.set('search', updates.search);
      } else {
        newParams.delete('search');
      }
    }
    
    if (updates.sort !== undefined) {
      newParams.set('sort', updates.sort);
    }
    
    if (updates.category !== undefined) {
      if (updates.category === 'all') {
        newParams.delete('category');
      } else {
        newParams.set('category', updates.category);
      }
    }
    
    if (updates.page !== undefined) {
      if (updates.page === 1) {
        newParams.delete('page');
      } else {
        newParams.set('page', updates.page.toString());
      }
    }
    
    setSearchParams(newParams);
  };

  // جلب منتجات المورد مع pagination
  const { data: productsData, isLoading: productsLoading, error, refetch } = useQuery({
    queryKey: ["vendor-products", id, searchQuery, sortBy, category, currentPage, isVendorDashboard],
    queryFn: async () => {
      logger.info('بدء تحميل منتجات المورد', { 
        vendorId: id, 
        searchQuery, 
        sortBy, 
        category, 
        page: currentPage,
        isVendorDashboard 
      });
      
      try {
        if (isVendorDashboard) {
          // للمورد المسجل - استخدام API المحمي
          const response = await api.vendor.products.list({ 
            search: searchQuery, 
            sort_by: sortBy, 
            category_id: category === 'all' ? undefined : category,
            page: currentPage
          });
          logger.info('استجابة API للمورد المسجل:', response);
          return response;
        } else {
          // للجمهور العام - استخدام API العام
          const response = await api.vendorProducts(id!, { 
            search: searchQuery, 
            sort_by: sortBy, 
            category_id: category === 'all' ? undefined : category,
            page: currentPage
          });
          logger.info('استجابة API للجمهور العام:', response);
          return response;
        }
      } catch (error) {
        logger.error('خطأ في استدعاء API:', error);
        throw error;
      }
    },
    enabled: !!id || isVendorDashboard,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (error) => {
      logger.error('خطأ في تحميل منتجات المورد', { vendorId: id, searchQuery, sortBy, category, page: currentPage, error });
    },
    onSuccess: (data) => {
      logger.info('تم تحميل منتجات المورد بنجاح', { 
        vendorId: id, 
        productsCount: data?.products?.data?.length || 0,
        currentPage: data?.products?.meta?.current_page || currentPage,
        totalPages: data?.products?.meta?.last_page || 1,
        data: data
      });
    }
  });

  const vendor = vendorData?.data || productsData?.vendor;
  
  // Extract products from different possible response structures
  let products = [];
  let paginationMeta = null;
  
  if (productsData) {
    if (productsData.products?.data && Array.isArray(productsData.products.data)) {
      products = productsData.products.data;
      paginationMeta = productsData.products.meta;
    } else if (productsData.products && Array.isArray(productsData.products)) {
      products = productsData.products;
    } else if (productsData.data && Array.isArray(productsData.data)) {
      products = productsData.data;
    } else if (Array.isArray(productsData)) {
      products = productsData;
    }
    
    // محاولة الحصول على meta من أماكن مختلفة
    if (!paginationMeta) {
      paginationMeta = productsData.products?.meta || productsData.meta || null;
    }
  }

  // دالة معالجة البحث
  const handleSearch = () => {
    logger.info('بدء البحث في منتجات المورد', { vendorId: id, searchQuery, sortBy, category });
    // إعادة تعيين الصفحة إلى 1 عند البحث
    updateSearchParams({ search: searchQuery, page: 1 });
  };

  // دالة معالجة تغيير الصفحة
  const handlePageChange = (page: number) => {
    logger.info('تغيير الصفحة', { vendorId: id, page });
    updateSearchParams({ page });
    // التمرير إلى أعلى الصفحة
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // دالة معالجة تغيير الترتيب
  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    updateSearchParams({ sort: newSort, page: 1 });
  };

  // دالة معالجة تغيير الفئة
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    updateSearchParams({ category: newCategory, page: 1 });
  };

  // للمورد المسجل، لا نحتاج لتحميل بيانات المورد
  if (vendorLoading && !isVendorDashboard) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات المورد...</p>
        </div>
      </div>
    );
  }

  // للجمهور العام، تحقق من وجود المورد
  if (!isVendorDashboard && !vendor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Store className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold mb-2">المورد غير موجود</h3>
          <p className="text-gray-600 mb-4">لم نتمكن من العثور على المورد المطلوب</p>
          <Button onClick={() => navigate('/vendors')}>
            العودة للموردين
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* زر العودة - فقط للجمهور العام */}
      {!isVendorDashboard && (
        <div className="container mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/vendors')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 ml-2" />
            العودة للموردين
          </Button>
        </div>
      )}

      <div className="container mx-auto px-4 pb-8">
        {/* معلومات المورد - فقط للجمهور العام */}
        {!isVendorDashboard && vendor && <VendorInfo vendor={vendor} />}

        {/* البحث والفلترة */}
        <SearchAndFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={handleSortChange}
          category={category}
          setCategory={handleCategoryChange}
          onSearch={handleSearch}
        />

        {/* شريط الأدوات */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">
              {isVendorDashboard 
                ? `منتجاتي (${products.length})` 
                : `منتجات ${vendor?.name_ar || vendor?.name} (${products.length})`
              }
            </h2>
            {productsLoading && (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            )}
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

        {/* قائمة المنتجات */}
        {productsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="w-full h-48 bg-gray-200"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
          ))}
        </div>
        ) : error ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold mb-2">حدث خطأ في تحميل المنتجات</h3>
            <p className="text-gray-600 mb-4">
              {error instanceof Error ? error.message : 'خطأ غير معروف'}
            </p>
            <Button onClick={() => refetch()}>
              المحاولة مرة أخرى
              </Button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold mb-2">لا توجد منتجات</h3>
            <p className="text-gray-600">
              {searchQuery ? 'لم نجد منتجات تطابق بحثك' : 'لا توجد منتجات متاحة من هذا المورد حالياً'}
            </p>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {products.map((product: any) => (
              <ProductCard
                key={product.id}
                product={product}
                onWishlistToggle={handleWishlistToggle}
                onViewProduct={handleViewProduct}
                isWishlisted={wishlistedProducts.has(product.id)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {paginationMeta && paginationMeta.last_page > 1 && (
          <PaginationComponent
            currentPage={paginationMeta.current_page || currentPage}
            totalPages={paginationMeta.last_page}
            totalItems={paginationMeta.total}
            perPage={paginationMeta.per_page || 20}
            onPageChange={handlePageChange}
            className="mt-8"
          />
        )}
      </div>

      {/* Product Modal */}
      <ProductModal
        productId={selectedProductId}
        isOpen={!!selectedProductId}
        onClose={() => setSelectedProductId(null)}
        isVendorDashboard={isVendorDashboard}
      />
    </div>
  );
};

export default VendorProducts;