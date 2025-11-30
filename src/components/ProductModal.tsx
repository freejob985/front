import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  ShoppingCart,
  Heart,
  Star,
  Plus,
  Minus,
  CheckCircle,
  Clock,
  Package,
  Truck,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { getImageUrl } from "@/config/api";
import { playClickSound } from "@/utils/sounds";

interface ProductModalProps {
  productId: number | null;
  isOpen: boolean;
  onClose: () => void;
  isVendorDashboard?: boolean;
}

export default function ProductModal({ productId, isOpen, onClose, isVendorDashboard = false }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const qc = useQueryClient();

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const { data, isLoading, isError } = useQuery<{ product: any }>({
    queryKey: isVendorDashboard ? ["vendor-product", productId] : ["product", productId],
    queryFn: () => isVendorDashboard ? api.vendor.products.getById(productId!) : api.product(productId!),
    enabled: !!productId && isOpen,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const product = data?.product;

  const computed = product ? {
    price: product.price ?? 0,
    original: product.original_price ?? undefined,
    discount: product.original_price && product.original_price > product.price 
      ? Math.round((1 - product.price / product.original_price) * 100) 
      : 0,
    inStock: (product.stock ?? 0) > 0,
    stockCount: product.stock ?? 0,
    rating: typeof product.rating === 'number' ? product.rating : 0,
    reviews: product.reviews_count ?? 0,
  } : null;

  const incrementQuantity = () => setQuantity((prev) => Math.min(prev + 1, computed?.stockCount || 1));
  const decrementQuantity = () => setQuantity((prev) => Math.max(prev - 1, 1));

  const handleAddToCart = async () => {
    if (!product) return;
    
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
      console.error('Error adding to cart:', error);
      toast.error('حدث خطأ أثناء إضافة المنتج للسلة ❌', {
        description: 'يرجى المحاولة مرة أخرى',
        duration: 5000,
        className: 'toast-error',
      });
    }
  };

  const handleWishlistToggle = async () => {
    if (!product) return;
    
    try {
      if (isWishlisted) {
        await api.wishlist.remove(product.id);
        toast.success('تم إزالة المنتج من قائمة الأمنيات');
      } else {
        await api.wishlist.add(product.id);
        toast.success('تم إضافة المنتج إلى قائمة الأمنيات');
      }
      setIsWishlisted(!isWishlisted);
      qc.invalidateQueries({ queryKey: ["wishlist"] });
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error('حدث خطأ أثناء تحديث قائمة الأمنيات');
    }
  };

  if (!isOpen || !productId) return null;

  return (
    <>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
          transition: background 0.2s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:active {
          background: #64748b;
        }
        .modal-backdrop {
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .modal-content {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .floating-animation {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .glow-effect {
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
        }
        .pulse-glow {
          animation: pulse-glow 2s infinite;
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
          50% { box-shadow: 0 0 30px rgba(99, 102, 241, 0.6); }
        }
        .bounce-in {
          animation: bounce-in 0.6s ease-out;
        }
        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        .slide-in-right {
          animation: slide-in-right 0.5s ease-out;
        }
        @keyframes slide-in-right {
          0% { transform: translateX(100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        .slide-in-left {
          animation: slide-in-left 0.5s ease-out;
        }
        @keyframes slide-in-left {
          0% { transform: translateX(-100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        .fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        @keyframes fade-in-up {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .scale-in {
          animation: scale-in 0.4s ease-out;
        }
        @keyframes scale-in {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      <div className="fixed inset-0 bg-black/60 modal-backdrop flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
        <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[95vh] modal-content border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-300 transform hover:scale-[1.02] transition-all flex flex-col glow-effect pulse-glow bounce-in">
          {/* Header with gradient background */}
          <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20"></div>
            <div className="relative px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm hover:scale-110 transition-transform duration-200 shadow-lg">
                    <Sparkles className="h-7 w-7" />
                  </div>
                  <h2 className="text-3xl font-bold tracking-wide">تفاصيل المنتج</h2>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onClose}
                  className="text-white hover:bg-white/20 rounded-full p-3 transition-all duration-200 hover:scale-110 shadow-lg border border-white/20"
                >
                  <X className="h-7 w-7" />
                </Button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-blue-600 animate-pulse" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">جاري تحميل تفاصيل المنتج</h3>
              <p className="text-gray-600">يرجى الانتظار قليلاً...</p>
            </div>
          ) : isError || !product ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg hover:scale-110 transition-transform duration-200">
                <X className="h-10 w-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">حدث خطأ أثناء جلب تفاصيل المنتج</h3>
              <p className="text-gray-600 mb-6 text-lg">يرجى المحاولة مرة أخرى</p>
              <Button 
                onClick={onClose} 
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 hover:scale-105"
              >
                إغلاق
              </Button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-8">
                <div className="grid lg:grid-cols-2 gap-10">
                  {/* Product Image */}
                  <div className="space-y-6 slide-in-left">
                    <div className="relative group">
                      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden shadow-xl border-4 border-white relative">
                        <div
                          className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                          style={{ 
                            backgroundImage: `url(${getImageUrl(product.image_url || product.image || "/placeholder.svg")})` 
                          }}
                        ></div>
                        {/* Overlay effect */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      {/* Floating badges */}
                      <div className="absolute top-6 right-6 flex flex-col gap-3">
                        {product.is_fresh && (
                          <div className="bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-pulse floating-animation">
                            طازج
                          </div>
                        )}
                        {computed?.discount && computed.discount > 0 && (
                          <div className="bg-rose-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg floating-animation" style={{animationDelay: '0.5s'}}>
                            خصم {computed.discount}%
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-8 slide-in-right">
                    {/* Header with category and rating */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {product.is_fresh && (
                            <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 text-sm font-semibold rounded-full shadow-lg animate-pulse hover:scale-105 transition-transform duration-200">
                              طازج
                            </Badge>
                          )}
                          {computed?.discount && computed.discount > 0 && (
                            <Badge className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 text-sm font-semibold rounded-full shadow-lg hover:scale-105 transition-transform duration-200">
                              خصم {computed.discount}%
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 bg-yellow-50 px-5 py-3 rounded-full hover:bg-yellow-100 transition-colors duration-200 cursor-pointer shadow-sm">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${i < Math.floor(computed?.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-semibold text-gray-700">
                            {computed?.rating?.toFixed(1)} ({computed?.reviews})
                          </span>
                        </div>
                      </div>
                      
                      <h1 className="text-4xl font-bold leading-tight gradient-text">
                        {product.name}
                      </h1>
                      
                      {product.vendor?.name && (
                        <p className="text-gray-600 text-lg">بواسطة <span className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200 cursor-pointer">{product.vendor.name}</span></p>
                      )}
                    </div>

                    {/* Price Section */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-200 relative overflow-hidden fade-in-up">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/20 to-teal-100/20"></div>
                      <div className="relative flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-4 mb-2">
                            <span className="text-4xl font-bold text-emerald-600 drop-shadow-sm">
                              {computed?.price} دينار
                            </span>
                            {computed?.original && computed.original > computed.price && (
                              <span className="text-2xl text-gray-500 line-through">
                                {computed.original} دينار
                              </span>
                            )}
                          </div>
                          {computed?.discount && computed.discount > 0 && (
                            <div className="text-lg text-emerald-600 font-semibold bg-emerald-100 px-3 py-1 rounded-full inline-block">
                              وفر {(computed.original! - computed.price).toFixed(1)} دينار
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 text-gray-600 mb-1">
                            <Package className="h-5 w-5" />
                            <span className="font-semibold">المخزون</span>
                          </div>
                          <div className="text-2xl font-bold text-gray-800">
                            {computed?.stockCount || 0} قطعة
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="bg-gradient-to-r from-slate-50 to-indigo-50 p-6 rounded-2xl border border-slate-200 scale-in">
                      <label className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <div className="p-1 bg-indigo-500 rounded">
                          <Package className="h-4 w-4 text-white" />
                        </div>
                        اختر الكمية:
                      </label>
                      <div className="flex items-center justify-center gap-6">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={decrementQuantity}
                          disabled={quantity <= 1}
                          className="h-12 w-12 rounded-full border-2 hover:bg-gray-100 transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          <Minus className="h-6 w-6" />
                        </Button>
                        <div className="bg-white px-8 py-4 rounded-xl border-2 border-gray-200 min-w-[5rem] text-center shadow-lg">
                          <span className="text-3xl font-bold text-gray-800">
                            {quantity}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={incrementQuantity}
                          disabled={quantity >= (computed?.stockCount || 1)}
                          className="h-12 w-12 rounded-full border-2 hover:bg-gray-100 transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          <Plus className="h-6 w-6" />
                        </Button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4 fade-in-up">
                      <Button
                        onClick={handleAddToCart}
                        disabled={!computed?.inStock}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-4 text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group shimmer"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <ShoppingCart className="h-6 w-6 mr-3 relative z-10" />
                        <span className="relative z-10">إضافة للسلة - {((computed?.price || 0) * quantity).toFixed(1)} دينار</span>
                      </Button>
                      <Button
                        onClick={handleWishlistToggle}
                        variant="outline"
                        className="w-full border-2 border-rose-300 text-rose-600 hover:bg-rose-50 py-4 text-xl font-bold rounded-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <Heart className={`h-6 w-6 mr-3 relative z-10 ${isWishlisted ? 'fill-current' : ''}`} />
                        <span className="relative z-10">{isWishlisted ? 'إزالة من الأمنيات' : 'أضف إلى الأمنيات'}</span>
                      </Button>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-200 scale-in">
                      <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors duration-200 group cursor-pointer">
                        <div className="p-2 bg-indigo-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
                          <Truck className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors duration-200">توصيل مجاني</span>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors duration-200 group cursor-pointer">
                        <div className="p-2 bg-emerald-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
                          <Shield className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-semibold text-gray-800 group-hover:text-emerald-700 transition-colors duration-200">ضمان الجودة</span>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors duration-200 group cursor-pointer">
                        <div className="p-2 bg-amber-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
                          <Clock className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-semibold text-gray-800 group-hover:text-amber-700 transition-colors duration-200">توصيل سريع</span>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-violet-50 rounded-xl hover:bg-violet-100 transition-colors duration-200 group cursor-pointer">
                        <div className="p-2 bg-violet-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
                          <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-semibold text-gray-800 group-hover:text-violet-700 transition-colors duration-200">ضمان الإرجاع</span>
                      </div>
                    </div>

                    {product.description && (
                      <div className="bg-gradient-to-r from-slate-50 to-indigo-50 p-6 rounded-2xl border border-slate-200 relative overflow-hidden fade-in-up">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/20 to-slate-100/20"></div>
                        <div className="relative">
                          <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <div className="p-1 bg-indigo-500 rounded hover:scale-110 transition-transform duration-200">
                              <Package className="h-4 w-4 text-white" />
                            </div>
                            وصف المنتج
                          </h4>
                          <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}