import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// HeaderMenus removed: use global Header from Layout
import { api } from "@/lib/api";
import { getImageUrl } from "@/config/api";
import { ShoppingCart, Star, Filter, Apple, Coffee, Drumstick, Cookie, Flower2, Sparkles, Baby, Shirt } from "lucide-react";

// Page-specific header removed — use global Layout's Header to avoid duplicates.

const iconMap: Record<string, any> = {
  "fruits-vegetables": Apple,
  dairy: Coffee,
  "meat-poultry": Drumstick,
  bakery: Cookie,
  frozen: Flower2,
  cleaning: Sparkles,
  "baby-care": Baby,
  "personal-care": Shirt
};

const friendlyName: Record<string, string> = {
  "fruits-vegetables": "خضروات وفواكه",
  dairy: "منتجات الألبان",
  "meat-poultry": "لحوم ودواجن",
  bakery: "مخبوزات",
  frozen: "مجمد��ت",
  cleaning: "منظفات",
  "baby-care": "منتجات الأطفال",
  "personal-care": "العناية الشخصية"
};

// Fallback products if API fails
const fallbackProducts = [
  { id: 1, name: "تفاح أحمر طازج - كيلو", price: 12, originalPrice: 15, rating: 4.8, image: "https://images.pexels.com/photos/3746517/pexels-photo-3746517.jpeg", category: "fruits-vegetables" },
  { id: 2, name: "حليب طازج كامل الدسم - لتر", price: 8, originalPrice: 10, rating: 4.9, image: "https://images.pexels.com/photos/18258533/pexels-photo-18258533.jpeg", category: "dairy" },
  { id: 3, name: "خبز صامولي طازج - 12 رغيف", price: 18, originalPrice: 24, rating: 4.7, image: "https://images.pexels.com/photos/2680601/pexels-photo-2680601.jpeg", category: "bakery" },
  { id: 4, name: "دجاج طازج كامل - 2 كيلو", price: 42, originalPrice: 60, rating: 4.7, image: "https://images.pexels.com/photos/9219093/pexels-photo-9219093.jpeg", category: "meat-poultry" },
  { id: 5, name: "طماطم كرزية طازجة - 500 جرام", price: 12, originalPrice: 15, rating: 4.6, image: "https://images.pexels.com/photos/10763771/pexels-photo-10763771.jpeg", category: "fruits-vegetables" },
  { id: 6, name: "جبنة بيضاء طازجة - 250 جرام", price: 15, originalPrice: 18, rating: 4.8, image: "https://images.pexels.com/photos/10165775/pexels-photo-10165775.jpeg", category: "dairy" }
];

export default function CategoryPage() {
  const { slug } = useParams();
  const active = slug ?? "";
  const Icon = iconMap[active] || Filter;
  const title = friendlyName[active] || "قسم المنتجات";

  // Fetch products for this category
  const { data: productsData, isLoading } = useQuery({
    queryKey: ["categoryProducts", active],
    queryFn: () => api.categoryProducts(active),
    enabled: !!active,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Use API data or fallback
  const allProducts = productsData?.data || fallbackProducts;

  const [sort, setSort] = useState("popular");

  const products = useMemo(() => {
    if (isLoading) return [];
    const filtered = allProducts.filter(p => p.category === active);
    const arr = filtered.length ? filtered : allProducts;
    switch (sort) {
      case "price-asc":
        return [...arr].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...arr].sort((a, b) => b.price - a.price);
      case "rating":
        return [...arr].sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
      default:
        return arr;
    }
  }, [active, sort]);

  return (
    <div className="min-h-screen">
      <section className="py-10 border-b bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon className="w-8 h-8 text-primary" />
              <div>
                <h1 className="mb-1 text-3xl font-bold">{title}</h1>
                <p className="text-gray-600">تصفح أفضل المنتجات في قسم {title}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">ترتيب حسب:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-3 py-2 text-sm border rounded-md"
              >
                <option value="popular">الأكثر شيوعاً</option>
                <option value="price-asc">السعر (تصاعدي)</option>
                <option value="price-desc">السعر (تنازلي)</option>
                <option value="rating">الأعلى تقييماً</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <main className="container px-4 py-8 mx-auto">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="mb-4 bg-gray-200 rounded-lg aspect-square"></div>
                  <div className="h-4 mb-2 bg-gray-200 rounded"></div>
                  <div className="h-3 mb-2 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
            <Card key={product.id} className="transition-all cursor-pointer group hover:shadow-lg">
              <CardContent className="p-4">
                <div className="relative mb-4">
                  <Link to={`/product/${product.id}`}>
                    {(() => {
                      // الحصول على رابط الصورة - إضافة main_image كأولوية
                      const imageUrl = getImageUrl(
                        (product as any).main_image || 
                        (product as any).image_url || 
                        product.image || 
                        (product as any).featured_image
                      );
                      
                      // سجلات تصحيح للتحقق من مسارات الصور
                      console.log('Product image debug:', {
                        productId: product.id,
                        productName: product.name,
                        main_image: (product as any).main_image,
                        image_url: (product as any).image_url,
                        image: product.image,
                        featured_image: (product as any).featured_image,
                        finalImageUrl: imageUrl,
                        hasImage: !!((product as any).main_image || (product as any).image_url || product.image || (product as any).featured_image)
                      });
                      
                      // التحقق من صحة رابط الصورة
                      const hasValidImage = imageUrl && 
                        imageUrl !== '/placeholder.svg' && 
                        !imageUrl.includes('undefined') && 
                        !imageUrl.includes('null') &&
                        (imageUrl.startsWith('http') || imageUrl.startsWith('/'));

                      return (
                        <div
                          className="bg-center bg-cover rounded-lg aspect-square"
                          style={{ 
                            backgroundImage: hasValidImage ? `url(${imageUrl})` : 'none',
                            backgroundColor: '#f3f4f6' // إضافة لون خلفية في حالة عدم تحميل الصورة
                          }}
                        >
                          {/* عرض أيقونة بديلة في حالة عدم وجود صورة صالحة */}
                          {!hasValidImage && (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingCart className="h-16 w-16 text-gray-400" />
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </Link>
                  <Badge variant="destructive" className="absolute text-xs top-2 right-2">
                    -{Math.max(0, Math.round((1 - product.price / ((product as any).originalPrice || product.price)) * 100))}%
                  </Badge>
                </div>

                <Link to={`/product/${product.id}`} className="block">
                  <h3 className="mb-1 text-sm font-medium transition-colors line-clamp-2 group-hover:text-primary">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center gap-1 mb-2 text-xs">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="font-medium">{Number(product.rating ?? 0).toFixed(1)}</span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="font-bold text-primary">{product.price} دينار</span>
                  <span className="text-xs text-gray-500 line-through">{(product as any).originalPrice || product.price} دينار</span>
                </div>

                <Button className="w-full" size="sm">
                  <ShoppingCart className="w-3 h-3 ml-2" />
                  إضافة للسلة
                </Button>
              </CardContent>
            </Card>
          ))}
          </div>
        )}
      </main>
    </div>
  );
}
