import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Filter,
  Grid,
  List,
  Star,
  Heart,
  ShoppingCart,
  ArrowLeft,
  Package,
  ChevronRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { getImageUrl } from "@/config/api";
import { playClickSound, playSuccessSound, playErrorSound } from "@/utils/sounds";


const SearchFilters = ({ onFiltersChange }: { onFiltersChange: (filters: any) => void }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || "");
  const [selectedSubcategory, setSelectedSubcategory] = useState(searchParams.get('subcategory') || "");
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || "");
  const [selectedRating, setSelectedRating] = useState(searchParams.get('rating') || "");
  const [isAvailable, setIsAvailable] = useState(searchParams.get('available') === 'true');
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const [isApplyingFilters, setIsApplyingFilters] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize price range from URL params (only once on mount)
  useEffect(() => {
    const minPrice = searchParams.get('min_price');
    const maxPrice = searchParams.get('max_price');
    if (minPrice || maxPrice) {
      setPriceRange([
        minPrice ? Number(minPrice) : 0,
        maxPrice ? Number(maxPrice) : 500
      ]);
    }
    setIsInitialized(true);
  }, []);

  // Fetch categories with subcategories
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: api.categories,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch brands from API
  const { data: brandsData, isLoading: brandsLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: api.brands,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const categories = categoriesData?.data || [];
  const brands = brandsData?.data || [];

  const toggleCategoryExpansion = (categoryId: number) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(""); // Reset subcategory when main category changes
  };

  const handleSubcategorySelect = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId);
  };

  // Function to apply filters immediately
  const applyFilters = () => {
    setIsApplyingFilters(true);
    
    const filters = {
      category: selectedCategory,
      subcategory: selectedSubcategory,
      brand: selectedBrand,
      rating: selectedRating,
      available: isAvailable,
      min_price: priceRange[0] > 0 ? priceRange[0] : undefined,
      max_price: priceRange[1] < 500 ? priceRange[1] : undefined
    };
    
    // Update URL with new filters
    const newParams = new URLSearchParams(searchParams);
    
    // Clear existing filter params
    newParams.delete('category');
    newParams.delete('subcategory');
    newParams.delete('brand');
    newParams.delete('rating');
    newParams.delete('available');
    newParams.delete('min_price');
    newParams.delete('max_price');
    newParams.delete('page'); // Reset to page 1 when filters change
    
    // Set new filter params
    if (selectedCategory) {
      newParams.set('category', selectedCategory);
    }
    if (selectedSubcategory) {
      newParams.set('subcategory', selectedSubcategory);
    }
    if (selectedBrand) {
      newParams.set('brand', selectedBrand);
    }
    if (selectedRating) {
      newParams.set('rating', selectedRating);
    }
    if (isAvailable) {
      newParams.set('available', 'true');
    }
    if (priceRange[0] > 0) {
      newParams.set('min_price', priceRange[0].toString());
    }
    if (priceRange[1] < 500) {
      newParams.set('max_price', priceRange[1].toString());
    }
    
    // Navigate to search with filters
    navigate(`/search?${newParams.toString()}`);
    
    // Notify parent component
    onFiltersChange(filters);
    
    // Reset loading state after a short delay
    setTimeout(() => {
      setIsApplyingFilters(false);
    }, 500);
  };

  // Apply filters when any filter changes (except price which is debounced)
  useEffect(() => {
    // Don't apply until initialized
    if (!isInitialized) {
      return;
    }
    
    // Don't apply if all filters are empty/default
    if (!selectedCategory && !selectedSubcategory && !selectedBrand && !selectedRating && !isAvailable) {
      return;
    }
    
    applyFilters();
  }, [selectedCategory, selectedSubcategory, selectedBrand, selectedRating, isAvailable, isInitialized]);

  // Debounce price range changes to avoid too many API calls
  useEffect(() => {
    // Don't apply until initialized
    if (!isInitialized) {
      return;
    }
    
    // Don't apply if price is at default values
    if (priceRange[0] === 0 && priceRange[1] === 500) {
      return;
    }
    
    const timeoutId = setTimeout(() => {
      applyFilters();
    }, 500); // 500ms delay for price range changes

    return () => clearTimeout(timeoutId);
  }, [priceRange, isInitialized]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          فلترة النتائج
          {isApplyingFilters && (
            <div className="ml-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Range */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            نطاق السعر
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1">من</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-full border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <div className="flex items-center justify-center pt-6">
                <span className="text-gray-400 font-medium">-</span>
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1">إلى</label>
                <Input
                  type="number"
                  placeholder="500"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>السعر بالدينار الكويتي</span>
              <span className="font-medium">{priceRange[0]} - {priceRange[1]} د.ك</span>
            </div>
          </div>
        </div>

        {/* Categories with Subcategories */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            الأقسام والأقسام الفرعية
          </h4>
          {categoriesLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-12 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {categories.map((category: any) => (
                <div key={category.id} className="group">
                  {/* Main Category */}
                  <div 
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-200 cursor-pointer"
                    onClick={() => toggleCategoryExpansion(category.id)}
                  >
                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={selectedCategory === category.id.toString()}
                        onChange={(e) => handleCategorySelect(e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-800">{category.name_ar}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                            {category.subcategories_count || 0} قسم فرعي
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {category.products_count || 0} منتج
                          </Badge>
                        </div>
                      </div>
                    </label>
                    {category.subcategories && category.subcategories.length > 0 && (
                      <div className="flex items-center">
                        <div className={`transform transition-transform duration-200 ${
                          expandedCategories.includes(category.id) ? 'rotate-90' : ''
                        }`}>
                          <ChevronRight className="h-4 w-4 text-gray-500" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Subcategories */}
                  {expandedCategories.includes(category.id) && category.subcategories && (
                    <div className="mt-2 ml-4 space-y-1 border-r-2 border-blue-200 pr-2">
                      {category.subcategories.map((subcategory: any, index: number) => (
                        <div 
                          key={subcategory.id} 
                          className={`p-2 rounded-md hover:bg-blue-50 transition-colors duration-150 ${
                            index === category.subcategories.length - 1 ? '' : 'border-b border-gray-100'
                          }`}
                        >
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name="subcategory"
                              value={subcategory.id}
                              checked={selectedSubcategory === subcategory.id.toString()}
                              onChange={(e) => handleSubcategorySelect(e.target.value)}
                              className="w-3 h-3 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <div className="flex-1">
                              <span className="text-sm text-gray-700 font-medium">{subcategory.name_ar}</span>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600">
                                  {subcategory.products_count || 0} منتج
                                </Badge>
                              </div>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Brands */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            الماركات
          </h4>
          {brandsLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded-md"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {brands.slice(0, 5).map((brand: any) => (
                <label key={brand.id} className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-green-50 transition-colors duration-150">
                  <input
                    type="radio"
                    name="brand"
                    value={brand.id}
                    checked={selectedBrand === brand.id.toString()}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-700">{brand.name_ar || brand.name}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-600">
                        {brand.products_count || 0} منتج
                      </Badge>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Rating */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            التقييم
          </h4>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <label key={rating} className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-yellow-50 transition-colors duration-150">
                <input
                  type="radio"
                  name="rating"
                  value={rating}
                  checked={selectedRating === rating.toString()}
                  onChange={(e) => setSelectedRating(e.target.value)}
                  className="w-4 h-4 text-yellow-600 border-gray-300 focus:ring-yellow-500"
                />
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: rating }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    ))}
                    {Array.from({ length: 5 - rating }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 text-gray-300" />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-700">فأكثر</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            التوفر
          </h4>
          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50/30 transition-all duration-200">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <span className="text-sm font-medium text-gray-700">المنتجات المتوفرة فقط</span>
          </label>
        </div>

        <div className="space-y-3 pt-4 border-t border-gray-200">
          <Button 
            variant="outline" 
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2.5 rounded-lg transition-colors duration-200"
            onClick={() => {
              // Clear all filters
              setSelectedCategory("");
              setSelectedSubcategory("");
              setSelectedBrand("");
              setSelectedRating("");
              setIsAvailable(false);
              setPriceRange([0, 500]);
              setExpandedCategories([]);
              
              // Navigate to search without filters
              const newParams = new URLSearchParams(searchParams);
              newParams.delete('category');
              newParams.delete('subcategory');
              newParams.delete('brand');
              newParams.delete('rating');
              newParams.delete('available');
              newParams.delete('min_price');
              newParams.delete('max_price');
              
              navigate(`/search?${newParams.toString()}`);
            }}
          >
            مسح جميع الفلاتر
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const ProductCard = ({ product, viewMode }: { product: any, viewMode: 'grid' | 'list' }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const queryClient = useQueryClient();
  
  // Calculate discount percentage
  const discount = product.original_price && Number(product.original_price) > Number(product.price) 
    ? Math.round(((Number(product.original_price) - Number(product.price)) / Number(product.original_price)) * 100)
    : 0;
  
  // Get image URL using the same method as main page
  const imageUrl = getImageUrl(product.image_url || product.image);
  
  // Check if product is in stock
  const inStock = product.stock > 0;

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: (productId: number) => api.cart.add(productId, 1),
    onSuccess: () => {
      // Play success sound
      playSuccessSound();
      toast.success('تم إضافة المنتج إلى السلة بنجاح! 🛒', {
        description: product.name,
        duration: 5000,
        className: 'toast-success',
      });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart", "count"] });
    },
    onError: (error: any) => {
      // Play error sound
      playErrorSound();
      toast.error('حدث خطأ أثناء إضافة المنتج للسلة ❌', {
        description: 'يرجى المحاولة مرة أخرى',
        duration: 5000,
        className: 'toast-error',
      });
      console.error("Add to cart error:", error);
    },
  });

  const handleAddToCart = () => {
    if (inStock) {
      // Play click sound
      playClickSound();
      addToCartMutation.mutate(product.id);
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex gap-4">
          <div 
            className="w-24 h-24 bg-cover bg-center rounded-lg flex-shrink-0"
            style={{ backgroundImage: `url(${imageUrl})` }}
          ></div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-medium text-lg">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.vendor?.name || ''}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFavorite(!isFavorite)}
                className="text-gray-400 hover:text-red-500"
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{Number(product.rating ?? 0).toFixed(1)}</span>
                <span className="text-sm text-gray-600">({product.reviews_count || 0})</span>
              </div>
              {inStock ? (
                <Badge className="bg-green-100 text-green-800">متوفر</Badge>
              ) : (
                <Badge className="bg-red-100 text-red-800">غير متوفر</Badge>
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{product.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-green-600">{Number(product.price).toFixed(3)} دينار</span>
                {product.original_price && (
                  <span className="text-sm text-gray-500 line-through">{Number(product.original_price).toFixed(3)} دينار</span>
                )}
                {discount > 0 && (
                  <Badge className="bg-red-100 text-red-800">خصم {discount}%</Badge>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/product/${product.id}`}>
                    <Package className="h-4 w-4 ml-2" />
                    عرض
                  </Link>
                </Button>
                <Button 
                  size="sm" 
                  disabled={!inStock || addToCartMutation.isPending}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-4 w-4 ml-2" />
                  {addToCartMutation.isPending ? "جاري الإضافة..." : "إضافة للسلة"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative">
        <div 
          className="w-full h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        ></div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-600 hover:text-red-500"
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
        {discount > 0 && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white">
            خصم {discount}%
          </Badge>
        )}
        {!inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge className="bg-red-500 text-white">غير متوفر</Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="font-medium text-sm leading-tight">{product.name}</h3>
          <p className="text-xs text-gray-600 mt-1">{product.vendor?.name || ''}</p>
        </div>
        
        <div className="flex items-center gap-1 mb-2">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-medium">{Number(product.rating ?? 0).toFixed(1)}</span>
          <span className="text-xs text-gray-600">({product.reviews_count || 0})</span>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="font-bold text-green-600">{Number(product.price).toFixed(3)} دينار</span>
          {product.original_price && (
            <span className="text-xs text-gray-500 line-through">{Number(product.original_price).toFixed(3)} دينار</span>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link to={`/product/${product.id}`}>
              عرض
            </Link>
          </Button>
          <Button 
            size="sm" 
            className="flex-1" 
            disabled={!inStock || addToCartMutation.isPending}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-3 w-3 ml-1" />
            {addToCartMutation.isPending ? "جاري..." : "إضافة"}
          </Button>
        </div>
        
      </CardContent>
    </Card>
  );
};

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const subcategory = searchParams.get('subcategory') || '';
  const brand = searchParams.get('brand') || '';
  const rating = searchParams.get('rating') || '';
  const available = searchParams.get('available') || '';
  const minPrice = searchParams.get('min_price') || '';
  const maxPrice = searchParams.get('max_price') || '';
  const productId = searchParams.get('product_id') || '';
  const sort = searchParams.get('sort') || 'relevance';
  const page = parseInt(searchParams.get('page') || '1', 10);
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState(sort);
  
  // Update sortBy when sort parameter changes
  useEffect(() => {
    setSortBy(sort);
  }, [sort]);
  
  // Fetch search results from API
  const { data: searchData, isLoading: searchLoading, error: searchError } = useQuery({
    queryKey: ["search", query, category, subcategory, brand, rating, available, minPrice, maxPrice, productId, sortBy, page],
    queryFn: async () => {
      try {
        // If no query and no filters, show all products by using a general search
        const searchParams = {
          q: query || '', // Allow empty query to show all products
          category: category,
          subcategory: subcategory,
          brand: brand,
          product_id: productId, // Add product_id parameter
          sort: sortBy,
          page: page, // Use the current page from URL
          per_page: 16, // Set to 16 products per page
          min_price: minPrice ? Number(minPrice) : undefined,
          max_price: maxPrice ? Number(maxPrice) : undefined,
          rating: rating ? Number(rating) : undefined,
          available: available === 'true' ? true : undefined
        };
        
        console.log('Search API Call with params:', searchParams);
        const result = await api.search(searchParams);
        console.log('API Search Result:', result);
        return result;
      } catch (error) {
        console.error('Search API Error:', error);
        // Return a fallback structure
        return {
          data: [],
          meta: {
            total: 0,
            per_page: 16,
            current_page: 1,
            last_page: 1
          }
        };
      }
    },
    retry: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Fallback mock data for testing
  const mockResults = [
    {
      id: 1,
      name: "تفاح أحمر طازج - كيلو",
      vendor: { name: "مزارع الطيبات" },
      price: 12,
      original_price: 15,
      stock: 10,
      rating: 4.8,
      reviews_count: 156,
      image_url: "https://images.pexels.com/photos/3746517/pexels-photo-3746517.jpeg",
      description: "تفاح أحمر طازج ومقرمش، مصدره محلي من أفضل المزارع"
    },
    {
      id: 2,
      name: "خيار طازج محلي - كيلو",
      vendor: { name: "البستان الطازج" },
      price: 8,
      original_price: null,
      stock: 0,
      rating: 4.9,
      reviews_count: 89,
      image_url: "https://images.pexels.com/photos/8805175/pexels-photo-8805175.jpeg",
      description: "خيار طازج ومقرمش، مثالي للسلطات والعصائر"
    }
  ];
  
  const searchResults = Array.isArray(searchData?.data) ? searchData.data : (searchError ? mockResults : []);
  
  // Debug: Log the API response to understand the structure
  console.log('Search API Response:', searchData);
  console.log('Search Loading:', searchLoading);
  console.log('Search Error:', searchError);
  console.log('Search Results:', searchResults);
  const meta = searchData?.meta || {
    total: searchResults.length,
    per_page: 16,
    current_page: 1,
    last_page: 1
  };

  return (
    <div className="space-y-6">
      {/* Search Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">نتائج البحث</h2>
              <p className="text-gray-600">
                {query ? `البحث عن "${query}"` : 'جميع المنتجات'} - 
                تم العثور على {meta?.total || searchResults.length} منتج
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">ترتيب حسب:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.set('sort', e.target.value);
                    newParams.delete('page'); // Reset to page 1 when sorting changes
                    setSearchParams(newParams);
                  }}
                  className="px-3 py-1 border rounded-md text-sm"
                >
                  <option value="relevance">الأهمية</option>
                  <option value="price-low">السعر من الأقل للأعلى</option>
                  <option value="price-high">السعر من الأعلى للأقل</option>
                  <option value="rating">الأعلى تقييماً</option>
                  <option value="newest">الأحدث</option>
                </select>
              </div>
              
              <div className="flex items-center gap-1 border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {searchLoading ? (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "space-y-4"
        }>
          {Array.from({ length: 8 }).map((_, i) => (
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
      ) : searchError ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">حدث خطأ في البحث</h3>
            <p className="text-gray-600 mb-4">
              يرجى المحاولة مرة أخرى
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              إعادة المحاولة
            </Button>
          </CardContent>
        </Card>
      ) : searchResults.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">لم يتم العثور على نتائج</h3>
            <p className="text-gray-600 mb-4">
              جرب تغيير كلمات البحث أو تعديل الفلاتر
            </p>
            <Button variant="outline" asChild>
              <Link to="/">
                العودة للصفحة الرئيسية
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "space-y-4"
        }>
          {Array.isArray(searchResults) && searchResults.map((product) => (
            <ProductCard key={product.id} product={product} viewMode={viewMode} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {Array.isArray(searchResults) && searchResults.length > 0 && meta && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                عرض {((meta.current_page - 1) * meta.per_page) + 1}-{Math.min(meta.current_page * meta.per_page, meta.total)} من {meta.total} منتج
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={meta.current_page <= 1}
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.set('page', (meta.current_page - 1).toString());
                    setSearchParams(newParams);
                  }}
                >
                  السابق
                </Button>
                {Array.from({ length: Math.min(5, meta.last_page) }, (_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <Button
                      key={pageNumber}
                      variant={pageNumber === meta.current_page ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        const newParams = new URLSearchParams(searchParams);
                        newParams.set('page', pageNumber.toString());
                        setSearchParams(newParams);
                      }}
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={meta.current_page >= meta.last_page}
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.set('page', (meta.current_page + 1).toString());
                    setSearchParams(newParams);
                  }}
                >
                  التالي
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default function SearchResultsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 ml-2" />
              العودة للمتجر
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <SearchFilters onFiltersChange={() => {}} />
          </div>
          
          <div className="lg:col-span-3">
            <SearchResults />
          </div>
        </div>
      </main>
    </div>
  );
}
