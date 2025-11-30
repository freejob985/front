import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, MessageCircle, ThumbsUp, ThumbsDown, Send } from "lucide-react";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/api";
import ErrorHandler from "@/utils/errorHandler";

interface Review {
  id: number;
  rating: number;
  comment: string;
  is_approved: boolean;
  is_anonymous: boolean;
  images: string[];
  images_urls?: string[];
  helpful_count?: number;
  not_helpful_count?: number;
  user_rating?: boolean | null;
  created_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  vendor: {
    id: number;
    name: string;
  };
}

interface ProductReviewsProps {
  productId: number;
  productName: string;
  currentRating: number;
  reviewsCount: number;
}

const StarRating = ({ 
  rating, 
  onRatingChange, 
  interactive = false 
}: { 
  rating: number; 
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
}) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onRatingChange?.(star)}
          disabled={!interactive}
          className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
        >
          <Star
            className={`h-5 w-5 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

const ReviewCard = ({ review, onRateReview }: { review: Review; onRateReview: (reviewId: number, isHelpful: boolean) => void }) => {
  const handleRateReview = (isHelpful: boolean) => {
    onRateReview(review.id, isHelpful);
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
              {review.is_anonymous ? 'م' : review.user.name.charAt(0)}
            </div>
            <div>
              <div className="font-semibold">
                {review.is_anonymous ? 'مستخدم مجهول' : review.user.name}
              </div>
              <div className="text-sm text-gray-500">
                {new Date(review.created_at).toLocaleDateString('ar-SA')}
              </div>
            </div>
          </div>
          <StarRating rating={review.rating} />
        </div>
        
        {review.comment && (
          <p className="text-gray-700 mb-3">{review.comment}</p>
        )}
        
        {review.images_urls && review.images_urls.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
            {review.images_urls.map((image: string, index: number) => (
              <img
                key={index}
                src={image}
                alt={`Review image ${index + 1}`}
                className="w-full h-20 object-cover rounded-lg"
              />
            ))}
          </div>
        )}
        
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <button 
            onClick={() => handleRateReview(true)}
            className={`flex items-center gap-1 transition-colors ${
              review.user_rating === true 
                ? 'text-green-600 bg-green-50 px-2 py-1 rounded' 
                : 'hover:text-green-600'
            }`}
          >
            <ThumbsUp className="h-4 w-4" />
            مفيد
            {review.helpful_count && review.helpful_count > 0 && (
              <span className="text-xs">({review.helpful_count})</span>
            )}
          </button>
          <button 
            onClick={() => handleRateReview(false)}
            className={`flex items-center gap-1 transition-colors ${
              review.user_rating === false 
                ? 'text-red-600 bg-red-50 px-2 py-1 rounded' 
                : 'hover:text-red-600'
            }`}
          >
            <ThumbsDown className="h-4 w-4" />
            غير مفيد
            {review.not_helpful_count && review.not_helpful_count > 0 && (
              <span className="text-xs">({review.not_helpful_count})</span>
            )}
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

const ReviewForm = ({ 
  productId, 
  onSuccess 
}: { 
  productId: number; 
  onSuccess: () => void;
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const queryClient = useQueryClient();

  // التحقق من تسجيل الدخول
  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_CONFIG.API_URL}/auth/me`, {
          credentials: 'include',
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(data.user !== null);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.log('Auth check failed:', error);
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  const createReviewMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(`${API_CONFIG.API_URL}/reviews/products`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('يجب تسجيل الدخول أولاً');
        }
        const error = await response.json();
        throw new Error(error.message || 'حدث خطأ أثناء إضافة التقييم');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast.success('تم إضافة التقييم بنجاح! ⭐');
      setRating(0);
      setComment("");
      setIsAnonymous(false);
      setImages([]);
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ["product", productId.toString()] });
      queryClient.invalidateQueries({ queryKey: ["reviews", productId.toString()] });
    },
    onError: (error: Error) => {
      ErrorHandler.showError(error, toast);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('يرجى اختيار تقييم للمنتج');
      return;
    }

    const formData = new FormData();
    formData.append('product_id', productId.toString());
    formData.append('rating', rating.toString());
    formData.append('comment', comment);
    formData.append('is_anonymous', isAnonymous ? '1' : '0');
    
    images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });

    createReviewMutation.mutate(formData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files.slice(0, 5)); // Limit to 5 images
  };

  if (!isLoggedIn) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            أضف تقييمك
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-600 mb-4">يجب تسجيل الدخول لإضافة تقييم</p>
          <Button 
            onClick={() => window.location.href = '/login'}
            className="bg-primary text-white"
          >
            تسجيل الدخول
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          أضف تقييمك
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">تقييمك للمنتج</Label>
            <StarRating 
              rating={rating} 
              onRatingChange={setRating}
              interactive={true}
            />
          </div>

          <div>
            <Label htmlFor="comment" className="text-sm font-medium mb-2 block">
              تعليقك (اختياري)
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="شاركنا تجربتك مع هذا المنتج..."
              className="min-h-[100px]"
            />
          </div>

          <div>
            <Label htmlFor="images" className="text-sm font-medium mb-2 block">
              صور (اختياري - حد أقصى 5 صور)
            </Label>
            <Input
              id="images"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="mb-2"
            />
            {images.length > 0 && (
              <div className="text-sm text-gray-600">
                تم اختيار {images.length} صورة
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
            />
            <Label htmlFor="anonymous" className="text-sm">
              نشر كتقييم مجهول
            </Label>
          </div>

          <Button 
            type="submit" 
            disabled={createReviewMutation.isPending || rating === 0}
            className="w-full"
          >
            {createReviewMutation.isPending ? (
              "جاري الإرسال..."
            ) : (
              <>
                <Send className="h-4 w-4 ml-2" />
                إرسال التقييم
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const RatingStats = ({ 
  stats 
}: { 
  stats: {
    total_reviews: number;
    average_rating: number;
    rating_distribution: Record<number, number>;
  } | null | undefined
}) => {
  // التحقق من وجود البيانات
  if (!stats) {
    return (
      <Card className="mb-6">
        <CardContent className="p-8 text-center text-gray-500">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>لا توجد إحصائيات متاحة</p>
        </CardContent>
      </Card>
    );
  }

  const totalReviews = stats?.total_reviews || 0;
  const averageRating = typeof stats?.average_rating === 'number' ? stats.average_rating : 0;
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>إحصائيات التقييمات</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
          <div>
            <StarRating rating={Math.round(averageRating)} />
            <div className="text-sm text-gray-600">{totalReviews} تقييم</div>
          </div>
        </div>

        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats?.rating_distribution?.[star] || 0;
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="text-sm w-8">{star}</span>
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8">{count}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default function ProductReviews({ 
  productId
}: ProductReviewsProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [filter, setFilter] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const queryClient = useQueryClient();

  // التحقق من تسجيل الدخول
  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_CONFIG.API_URL}/auth/me`, {
          credentials: 'include',
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(data.user !== null);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.log('Auth check failed:', error);
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ["reviews", productId.toString(), filter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filter !== 'all') {
        params.append('rating', filter);
      }
      
      const response = await fetch(`${API_CONFIG.API_URL}/products/${productId}/reviews?${params}`, {
        credentials: 'include',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      
      return response.json();
    },
    onError: (error) => {
      ErrorHandler.showError(error, toast);
    }
  });

  const { data: statsData } = useQuery({
    queryKey: ["reviews-stats", productId.toString()],
    queryFn: async () => {
      const response = await fetch(`${API_CONFIG.API_URL}/products/${productId}/reviews/stats`, {
        credentials: 'include',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch review stats');
      }
      
      return response.json();
    },
    onError: (error) => {
      ErrorHandler.showError(error, toast);
    }
  });

  const reviews = reviewsData?.data?.data || [];
  const stats = statsData?.data;

  // Function لتقييم التقييمات
  const rateReview = async (reviewId: number, isHelpful: boolean) => {
    try {
      const response = await fetch(`${API_CONFIG.API_URL}/reviews/products/${reviewId}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
        body: JSON.stringify({ is_helpful: isHelpful }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('يجب تسجيل الدخول أولاً');
          return;
        }
        const error = await response.json();
        throw new Error(error.message || 'حدث خطأ أثناء تقييم التقييم');
      }

      const result = await response.json();
      toast.success(result.message);
      
      // تحديث البيانات
      queryClient.invalidateQueries({ queryKey: ["reviews", productId.toString()] });
    } catch (error) {
      ErrorHandler.showError(error, toast);
    }
  };

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">تقييمات العملاء</h2>
        {isLoggedIn ? (
          <Button 
            onClick={() => setShowReviewForm(!showReviewForm)}
            variant="outline"
          >
            <MessageCircle className="h-4 w-4 ml-2" />
            {showReviewForm ? 'إخفاء النموذج' : 'أضف تقييمك'}
          </Button>
        ) : (
          <Button 
            onClick={() => window.location.href = '/login'}
            variant="outline"
          >
            <MessageCircle className="h-4 w-4 ml-2" />
            تسجيل الدخول لإضافة تقييم
          </Button>
        )}
      </div>

      {showReviewForm && isLoggedIn && (
        <ReviewForm 
          productId={productId} 
          onSuccess={() => setShowReviewForm(false)}
        />
      )}

      {stats && (
        <RatingStats stats={stats} />
      )}
      
      {!stats && !statsData && (
        <Card className="mb-6">
          <CardContent className="p-8 text-center text-gray-500">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>جاري تحميل إحصائيات التقييمات...</p>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm font-medium">تصفية حسب التقييم:</span>
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'الكل' },
            { value: '5', label: '5 نجوم' },
            { value: '4', label: '4 نجوم' },
            { value: '3', label: '3 نجوم' },
            { value: '2', label: '2 نجوم' },
            { value: '1', label: '1 نجمة' },
          ].map((option) => (
            <Button
              key={option.value}
              variant={filter === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(option.value as any)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {reviewsLoading ? (
        <div className="text-center py-8 text-gray-500">جاري تحميل التقييمات...</div>
      ) : reviews.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>لا توجد تقييمات بعد</p>
            <p className="text-sm">كن أول من يقيم هذا المنتج!</p>
          </CardContent>
        </Card>
      ) : (
        <div>
          {reviews.map((review: Review) => (
            <ReviewCard key={review.id} review={review} onRateReview={rateReview} />
          ))}
        </div>
      )}
    </div>
  );
}
