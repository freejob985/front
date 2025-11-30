import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { getImageUrl } from "@/config/api";
import { playClickSound, playSuccessSound, playErrorSound } from "@/utils/sounds";
import logger from "@/lib/logger";
import { 
  ShoppingCart, 
  Star, 
  Grid3X3, 
  List, 
  ArrowLeft,
  Search,
  SlidersHorizontal,
  XCircle
} from "lucide-react";

const CategoryProducts = () => {
  const { slug } = useParams<{ slug: string }>();
  console.log(slug);
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState<Set<number>>(new Set());
  const queryClient = useQueryClient();

  // Fetch category details
  const { data: categoryData, isLoading: categoryLoading } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => api.get<{ success: boolean; data: any }>(`/categories/${slug}`),
    enabled: !!slug,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    onError: (error) => {
      logger.error('خطأ في تحميل بيانات القسم', { slug, error });
    }
  });

  // Fetch category products
  const { data: productsData, isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ['categoryProducts', slug, sortBy],
    queryFn: async () => {
      logger.info('بدء تحميل منتجات القسم', { slug, sortBy });
      try {
        const result = await api.categoryProducts(slug!, { sort: sortBy });
        logger.info('تم تحميل منتجات القسم بنجاح', { slug, sortBy, productsCount: result?.data?.length || 0 });
        return result;
      } catch (error) {
        logger.error('خطأ في تحميل منتجات القسم', { slug, sortBy, error });
        throw error;
      }
    },
    enabled: !!slug,
    retry: 1,
    staleTime: 2 * 60 * 1000,
    onError: (error) => {
      logger.error('خطأ في استعلام منتجات القسم', { slug, sortBy, error });
    }
  });

  const category = categoryData?.data;
  
  // Safe data extraction with better error handling
  let products = [];
  
  if (productsData) {
    try {
      // Debug the raw response structure
      const data = productsData as any;
      console.log('🔍 Raw productsData structure:', data);
      console.log('🔍 productsData keys:', Object.keys(data));
      
      // Try different possible data structures based on what we see
      if (Array.isArray(data)) {
        products = data;
      } else if (data.data && Array.isArray(data.data)) {
        products = data.data;
      } else if (data.products && Array.isArray(data.products)) {
        products = data.products;
      } else if (data.products && data.products.data && Array.isArray(data.products.data)) {
        products = data.products.data;
      } else if (data.items && Array.isArray(data.items)) {
        products = data.items;
      } else if (data.results && Array.isArray(data.results)) {
        products = data.results;
      } else {
        // If none of the above work, try to find any array property
        const allKeys = Object.keys(data);
        for (const key of allKeys) {
          const value = data[key];
          if (Array.isArray(value) && value.length > 0) {
            console.log(`🔍 Found potential products array in key '${key}':`, value);
            products = value;
            break;
          }
        }
      }
    } catch (error) {
      console.error('❌ Error processing productsData:', error);
      products = [];
    }
  } else {
    console.warn('⚠️ productsData is null or undefined');
  }
  
  console.log('🔍 Extracted products:', products);
  console.log('🔍 Products count:', products.length);
  
  // If no products found, try to show some debug info
  if (products.length === 0 && productsData) {
    console.log('⚠️ No products found, but we have data:', productsData);
    console.log('⚠️ Data structure analysis:', {
      isArray: Array.isArray(productsData),
      hasData: 'data' in productsData,
      hasProducts: 'products' in productsData,
      dataType: typeof productsData,
      dataKeys: Object.keys(productsData)
    });
  }
  
  // If still no products and no error, try to show some fallback products for debugging
  if (products.length === 0 && !productsError && !productsLoading) {
    console.log('⚠️ No products found and no error - this might be a data structure issue');
    console.log('⚠️ Full productsData object:', JSON.stringify(productsData, null, 2));
    
    // Try to extract products from any possible structure
    if (productsData) {
      const allKeys = Object.keys(productsData);
      console.log('⚠️ Available keys in productsData:', allKeys);
      
      // Look for any array property that might contain products
      for (const key of allKeys) {
        const value = (productsData as any)[key];
        if (Array.isArray(value) && value.length > 0) {
          console.log(`⚠️ Found array in key '${key}' with ${value.length} items:`, value);
        }
      }
    }
  }
  
  // Debug product structure
  if (products.length > 0) {
    console.log('🔍 First product structure:', products[0]);
    console.log('🔍 Product keys:', Object.keys(products[0]));
    
    // Check if products have image data
    const firstProduct = products[0];
    console.log('🔍 First product image data:', {
      image: firstProduct.image,
      image_url: firstProduct.image_url,
      featured_image: firstProduct.featured_image,
      images: firstProduct.images,
      images_urls: firstProduct.images_urls
    });
    
    // Test getImageUrl with first product
    const testImageUrl = getImageUrl(firstProduct.image_url || firstProduct.image || firstProduct.featured_image);
    console.log('🔍 Test getImageUrl result:', testImageUrl);
    
    // Test if image URL is valid
    const isValidUrl = testImageUrl && 
      testImageUrl !== '/placeholder.svg' && 
      !testImageUrl.includes('undefined') && 
      !testImageUrl.includes('null') &&
      (testImageUrl.startsWith('http') || testImageUrl.startsWith('/'));
    console.log('🔍 Is valid URL:', isValidUrl);
    
    // Test different image sources
    console.log('🔍 Testing different image sources:');
    console.log('  - image_url:', firstProduct.image_url);
    console.log('  - image:', firstProduct.image);
    console.log('  - featured_image:', firstProduct.featured_image);
    console.log('  - images:', firstProduct.images);
    console.log('  - images_urls:', firstProduct.images_urls);
    
    // Test if any of the image sources are valid
    const hasAnyImage = firstProduct.image_url || firstProduct.image || firstProduct.featured_image || 
      (firstProduct.images && firstProduct.images.length > 0) || 
      (firstProduct.images_urls && firstProduct.images_urls.length > 0);
    console.log('🔍 Has any image source:', hasAnyImage);
  }
  
  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: (productId: number) => {
      logger.info('بدء إضافة منتج للسلة', { productId });
      return api.cart.add(productId, 1);
    },
    onSuccess: (_, productId) => {
      logger.info('تم إضافة المنتج للسلة بنجاح', { productId });
      // Remove from loading state
      setLoadingProducts(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
      // Play success sound
      playSuccessSound();
      toast.success('تم إضافة المنتج إلى السلة بنجاح! 🛒', {
        duration: 5000,
        className: 'toast-success',
      });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart", "count"] });
    },
    onError: (error: any, productId) => {
      logger.error('خطأ في إضافة المنتج للسلة', { productId, error });
      // Remove from loading state
      setLoadingProducts(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
      // Play error sound
      playErrorSound();
      toast.error('حدث خطأ أثناء إضافة المنتج للسلة ❌', {
        description: 'يرجى المحاولة مرة أخرى',
        duration: 5000,
        className: 'toast-error',
      });
    },
  });

  const handleAddToCart = (productId: number) => {
    logger.info('تم النقر على زر إضافة للسلة', { productId });
    // Add to loading state
    setLoadingProducts(prev => new Set(prev).add(productId));
    // Play click sound
    playClickSound();
    addToCartMutation.mutate(productId);
  };
  
  // Debug logging
  console.log('🔍 Category data:', categoryData);
  console.log('🔍 Products data:', productsData);
  console.log('🔍 Products array:', products);
  console.log('🔍 Products count:', products.length);
  console.log('🔍 Products error:', productsError);
  console.log('🔍 API URL:', `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}/categories/${slug}/products?sort=${sortBy}`);
  console.log('🔍 Slug:', slug);
  console.log('🔍 SortBy:', sortBy);
  
  // Additional debugging for API calls
  if (productsError) {
    console.error('❌ Products API Error Details:', {
      message: productsError instanceof Error ? productsError.message : 'Unknown error',
      stack: productsError instanceof Error ? productsError.stack : undefined,
      error: productsError
    });
  }

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setSearchParams({ sort: newSort });
  };


  if (categoryLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">القسم غير موجود</h1>
          <p className="text-gray-600 mb-8">عذراً، لا يمكن العثور على القسم المطلوب</p>
          <Link to="/categories">
            <Button>
              <ArrowLeft className="w-4 h-4 ml-2" />
              العودة للأقسام
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/categories">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 ml-2" />
                  العودة للأقسام
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{category.name_ar}</h1>
                <p className="text-gray-600 mt-1">
                  {products.length} منتج متاح
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-4 h-4 ml-2" />
                فلترة
              </Button>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">ترتيب حسب:</label>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="popular">الأكثر شيوعاً</option>
                  <option value="price-asc">السعر (تصاعدي)</option>
                  <option value="price-desc">السعر (تنازلي)</option>
                  <option value="rating">الأعلى تقييماً</option>
                  <option value="name-asc">الاسم (أ-ي)</option>
                  <option value="name-desc">الاسم (ي-أ)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        {productsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : productsError ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-12 h-12 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">خطأ في تحميل المنتجات</h3>
            <p className="text-gray-600 mb-6">حدث خطأ أثناء تحميل منتجات هذا القسم</p>
            <div className="space-y-2">
              <p className="text-sm text-red-600">تفاصيل الخطأ: {productsError instanceof Error ? productsError.message : 'خطأ غير معروف'}</p>
              <Button onClick={() => window.location.reload()}>
                إعادة المحاولة
              </Button>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد منتجات</h3>
            <p className="text-gray-600 mb-6">لا توجد منتجات متاحة في هذا القسم حالياً</p>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                القسم: {slug} | الترتيب: {sortBy}
              </p>
              <div className="space-x-2">
                <Link to="/categories">
                  <Button>تصفح الأقسام الأخرى</Button>
                </Link>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  إعادة المحاولة
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {products.map((product: any) => {
              // Calculate discount percentage
              const discount = product.original_price && Number(product.original_price) > Number(product.price) 
                ? Math.round(((Number(product.original_price) - Number(product.price)) / Number(product.original_price)) * 100)
                : 0;
              
              // Get image URL using the same method as other pages - إضافة main_image كأولوية
              const imageUrl = getImageUrl(
                product.main_image || 
                product.image_url || 
                product.image || 
                product.featured_image
              );
              
              // Debug logging for image URL
              console.log('🔍 Product image debug:', {
                productId: product.id,
                productName: product.name,
                main_image: product.main_image,
                image_url: product.image_url,
                image: product.image,
                featured_image: product.featured_image,
                finalImageUrl: imageUrl,
                hasImage: !!(product.main_image || product.image_url || product.image || product.featured_image)
              });
              
              // Check if we have a valid image URL
              const hasValidImage = imageUrl && 
                imageUrl !== '/placeholder.svg' && 
                !imageUrl.includes('undefined') && 
                !imageUrl.includes('null') &&
                (imageUrl.startsWith('http') || imageUrl.startsWith('/'));
              
              // Check if product is in stock
              const inStock = product.stock > 0;

              return (
                <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardContent className={`p-4 ${viewMode === 'list' ? 'flex gap-4' : ''}`}>
                    <div className={`relative ${viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : 'mb-4'}`}>
                      <Link to={`/product/${product.id}`}>
                        <div
                          className={`bg-center bg-cover rounded-lg ${
                            viewMode === 'list' ? 'w-full h-full' : 'aspect-square'
                          }`}
                          style={{ 
                            backgroundImage: hasValidImage ? `url(${imageUrl})` : 'none',
                            backgroundColor: hasValidImage ? 'transparent' : '#f3f4f6'
                          }}
                        >
                          {/* Fallback icon if no image */}
                          {!hasValidImage && (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <ShoppingCart className="h-16 w-16 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </Link>
                      {discount > 0 && (
                        <Badge variant="destructive" className="absolute top-2 right-2 text-xs">
                          -{discount}%
                        </Badge>
                      )}
                      {!inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                          <Badge className="bg-red-500 text-white">غير متوفر</Badge>
                        </div>
                      )}
                    </div>

                    <div className={`flex-1 ${viewMode === 'list' ? 'flex flex-col justify-between' : ''}`}>
                      <div>
                        <Link to={`/product/${product.id}`}>
                          <h3 className={`font-semibold mb-2 group-hover:text-primary transition-colors ${
                            viewMode === 'list' ? 'text-lg' : 'text-sm'
                          }`}>
                            {product.name}
                          </h3>
                        </Link>

                        {viewMode === 'grid' && (
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                            {product.description || 'منتج عالي الجودة'}
                          </p>
                        )}

                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-medium">{Number(product.rating || 0).toFixed(1)}</span>
                          <span className="text-xs text-gray-500">({product.reviews_count || 0})</span>
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-lg font-bold text-primary">
                            {Number(product.price).toFixed(3)} دينار
                          </span>
                          {product.original_price && product.original_price > product.price && (
                            <span className="text-sm text-gray-500 line-through">
                              {Number(product.original_price).toFixed(3)} دينار
                            </span>
                          )}
                        </div>
                      </div>

                      <Button 
                        className="w-full" 
                        size="sm"
                        disabled={!inStock || loadingProducts.has(product.id)}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('🛒 Button clicked for product:', product.id, product.name);
                          handleAddToCart(product.id);
                        }}
                      >
                        <ShoppingCart className="w-4 h-4 ml-2" />
                        {loadingProducts.has(product.id) ? "جاري الإضافة..." : "إضافة للسلة"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
