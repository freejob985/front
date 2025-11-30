import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Star,
  Heart,
  Plus,
  Minus,
  Truck,
  Shield,
  CheckCircle,
  Clock,
  Package,
  ArrowLeft,
  Share2
} from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api, Product } from "@/lib/api";
import { toast } from "sonner";
import { getImageUrl } from "@/config/api";
import { playClickSound } from "@/utils/sounds";
import ProductReviews from "@/components/ProductReviews";


const Breadcrumb = ({ productName }: { productName: string }) => (
  <section className="py-4 bg-gray-50 border-b">
    <div className="container mx-auto px-4">
      <div className="flex items-center gap-2 text-sm">
        <Link to="/" className="text-gray-500 hover:text-primary">الرئيسية</Link>
        <span className="text-gray-300">/</span>
        <Link to="/categories" className="text-gray-500 hover:text-primary">الأقسام</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-700 font-medium">{productName}</span>
      </div>
    </div>
  </section>
);

const ProductImageGallery = ({ images }: { images: string[] }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const safeImages = Array.isArray(images) && images.length > 0 ? images : ["/placeholder.svg"];

  return (
    <div className="space-y-4">
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${getImageUrl(safeImages[selectedImage])})` }}
        ></div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {safeImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
              selectedImage === index ? 'border-primary' : 'border-transparent'
            }`}
          >
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${getImageUrl(image)})` }}
            ></div>
          </button>
        ))}
      </div>
    </div>
  );
};

const ProductInfo = ({ product }: { product: Product }) => {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const qc = useQueryClient();

  const computed = useMemo(() => {
    const price = product.price ?? 0;
    const original = product.original_price ?? undefined;
    const discount = original && original > price ? Math.round((1 - price / original) * 100) : 0;
    const inStock = (product.stock ?? 0) > 0;
    const stockCount = product.stock ?? 0;
    const rating = typeof product.rating === 'number' ? product.rating : 0;
    const reviews = product.reviews_count ?? 0;
    return { price, original, discount, inStock, stockCount, rating, reviews };
  }, [product]);

  const incrementQuantity = () => setQuantity((prev) => Math.min(prev + 1, computed.stockCount || 1));
  const decrementQuantity = () => setQuantity((prev) => Math.max(prev - 1, 1));

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          {product.is_fresh && <Badge className="bg-green-500 text-white">طازج</Badge>}
          {computed.discount > 0 && (
            <Badge variant="destructive">خصم {computed.discount}%</Badge>
          )}
        </div>
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        {product.vendor?.name && (
          <p className="text-gray-600 mb-4">بواسطة {product.vendor.name}</p>
        )}

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${i < Math.floor(computed.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="font-medium">{Number(computed.rating).toFixed(1)}</span>
          <span className="text-gray-500">({computed.reviews} تقييم)</span>
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-3xl font-bold text-primary">{computed.price} دينار</div>
          {computed.original && computed.original > computed.price && (
            <div className="text-xl text-gray-500 line-through">{computed.original} دينار</div>
          )}
          {computed.discount > 0 && (
            <div className="text-green-600 font-medium">
              وفر {(computed.original! - computed.price).toFixed(1)} دينار
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mb-6">
          {computed.inStock ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-600 font-medium">متوفر في المخزن ({computed.stockCount} قطعة)</span>
            </>
          ) : (
            <>
              <Clock className="h-5 w-5 text-red-600" />
              <span className="text-red-600 font-medium">نفد من المخزن</span>
            </>
          )}
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center border rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              onClick={decrementQuantity}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={incrementQuantity}
              disabled={quantity >= (computed.stockCount || 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <span className="text-gray-600">الكمية</span>
        </div>

        <div className="flex gap-4 mb-6">
          <Button
            size="lg"
            className="flex-1"
            disabled={!computed.inStock}
            onClick={async () => {
              // Play click sound
              playClickSound();
              
              try {
                await api.cart.add(product.id, quantity);
                qc.invalidateQueries({ queryKey: ["cart", "count"] });
                qc.invalidateQueries({ queryKey: ["cart"] });
                toast.success('تم إضافة المنتج إلى السلة بنجاح! 🛒', {
                  description: `${product.name} - الكمية: ${quantity} قطعة`,
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
            <ShoppingCart className="h-5 w-5 ml-2" />
            إضافة للسلة - {(computed.price * quantity).toFixed(1)} دينار
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={async () => {
              try {
                if (isWishlisted) await api.wishlist.remove(product.id);
                else await api.wishlist.add(product.id);
                setIsWishlisted(!isWishlisted);
              } catch (_) {}
            }}
          >
            <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <Button variant="outline" size="lg">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        <Button variant="outline" size="lg" className="w-full mb-6">
          شراء الآن
        </Button>
      </div>

      <div className="border-t pt-6 space-y-4">
        <div className="flex items-center gap-3">
          <Truck className="h-5 w-5 text-green-600" />
          <span className="text-sm">توصيل مجاني للطلبات أكثر من 10 دينار</span>
        </div>
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-blue-600" />
          <span className="text-sm">ضمان الجودة أو استرداد المال</span>
        </div>
        <div className="flex items-center gap-3">
          <Package className="h-5 w-5 text-purple-600" />
          <span className="text-sm">تغليف آمن ومحكم</span>
        </div>
      </div>
    </div>
  );
};

const ProductTabs = ({ 
  description, 
  productId, 
  productName, 
  currentRating, 
  reviewsCount 
}: { 
  description?: string | null;
  productId: number;
  productName: string;
  currentRating: number;
  reviewsCount: number;
}) => {
  const [activeTab, setActiveTab] = useState("description");
  const tabs = [
    { id: "description", name: "الوصف" },
    { id: "delivery", name: "التوصيل" },
    { id: "reviews", name: `التقييمات (${reviewsCount})` }
  ];

  return (
    <div className="mt-12">
      <div className="border-b">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      <div className="py-8">
        {activeTab === "description" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">وصف المنتج</h3>
              <p className="text-gray-700 leading-relaxed">{description || "لا يوجد وصف متاح لهذا المنتج."}</p>
            </div>
          </div>
        )}

        {activeTab === "delivery" && (
          <div>
            <h3 className="text-lg font-semibold mb-4">معلومات التوصيل</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium">توصيل مجاني</div>
                  <div className="text-sm text-gray-600">للطلبات أكثر من 10 دينار</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium">توصيل سريع</div>
                  <div className="text-sm text-gray-600">خلال 30-60 دقيقة</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="font-medium">تغليف آمن</div>
                  <div className="text-sm text-gray-600">حفظ المنتجات الطازجة</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <ProductReviews
            productId={productId}
            productName={productName}
            currentRating={currentRating}
            reviewsCount={reviewsCount}
          />
        )}
      </div>
    </div>
  );
};

const RelatedProducts = ({ products }: { products: Product[] }) => {
  const queryClient = useQueryClient();
  
  if (!products?.length) return null;

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">منتجات ذات صلة</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => {
            const price = product.price ?? 0;
            const original = product.original_price ?? undefined;
            const discount = original && original > price ? Math.round((1 - price / original) * 100) : 0;
            const image = (product.image_url || product.images_urls?.[0] || product.image || product.images?.[0] || "/placeholder.svg");
            const inStock = (product.stock ?? 0) > 0;
            
            return (
              <Card key={product.id} className="group hover:shadow-lg transition-all cursor-pointer">
                <CardContent className="p-4">
                  <div className="relative mb-4">
                    <Link to={`/product/${product.id}`}>
                      <div
                        className="aspect-square bg-cover bg-center rounded-lg"
                        style={{ backgroundImage: `url(${image})` }}
                      ></div>
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

                  <Link to={`/product/${product.id}`} className="block">
                    <h3 className="font-medium text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-1 mb-2 text-xs">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{Number(product.rating ?? 0).toFixed(1)}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-bold text-primary">{price} دينار</span>
                    {original && original > price && (
                      <span className="text-xs text-gray-500 line-through">{original} دينار</span>
                    )}
                  </div>

                  <Button 
                    className="w-full" 
                    size="sm"
                    disabled={!inStock}
                    onClick={async () => {
                      if (!inStock) return;
                      
                      // Play click sound
                      playClickSound();
                      
                      try {
                        await api.cart.add(product.id, 1);
                        queryClient.invalidateQueries({ queryKey: ["cart", "count"] });
                        queryClient.invalidateQueries({ queryKey: ["cart"] });
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
                    <ShoppingCart className="h-3 w-3 ml-2" />
                    {inStock ? 'إضافة للسلة' : 'غير متوفر'}
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

export default function ProductDetails() {
  const { id } = useParams();
  const productId = id as string;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => api.product(productId!),
    enabled: !!productId,
  });

  const product = data?.product;
  const related = data?.related ?? [];
  const images = Array.isArray(product?.images_urls) && product.images_urls.length > 0
    ? product.images_urls
    : (product?.image_url ? [product.image_url] : ["/placeholder.svg"]);

  // حساب القيم المطلوبة للتقييمات
  const computed = useMemo(() => {
    if (!product) return { rating: 0, reviews: 0 };
    const price = product.price ?? 0;
    const original = product.original_price ?? undefined;
    const discount = original && original > price ? Math.round((1 - price / original) * 100) : 0;
    const inStock = (product.stock ?? 0) > 0;
    const stockCount = product.stock ?? 0;
    const rating = typeof product.rating === 'number' ? product.rating : 0;
    const reviews = product.reviews_count ?? 0;
    return { price, original, discount, inStock, stockCount, rating, reviews };
  }, [product]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-gray-500">جاري التحميل...</div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-red-600">حدث خطأ أثناء جلب بيانات المنتج.</div>
    );
  }

  return (
    <>
      <Breadcrumb productName={product.name} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link to="/categories">
              <ArrowLeft className="h-4 w-4 ml-2" />
              العودة للأقسام
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          <ProductImageGallery images={images} />
          <ProductInfo product={product} />
        </div>

        <ProductTabs 
          description={product.description}
          productId={product.id}
          productName={product.name}
          currentRating={computed.rating}
          reviewsCount={computed.reviews}
        />
      </main>

      <RelatedProducts products={related} />
    </>
  );
}
