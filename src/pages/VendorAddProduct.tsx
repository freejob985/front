import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Package,
  ArrowLeft,
  Upload,
  X,
  Save,
  Eye,
  Info,
  DollarSign
} from "lucide-react";
import { useState, useEffect } from "react";
import VendorHeader from "@/components/VendorHeader";
import vendorAuthService from "@/services/vendorAuth";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { TagsInput } from "@/components/ui/tags-input";

// Types for data from API
interface Brand {
  id: number;
  name: string;
  name_ar: string;
}

interface Category {
  id: number;
  name_ar: string;
  name_en: string;
}

interface Subcategory {
  id: number;
  name_ar: string;
  category_id: number;
}

interface Governorate {
  id: number;
  name_ar: string;
}

interface City {
  id: number;
  name_ar: string;
  governorate_id: number;
}


const ProductImages = ({ images, setImages, errors }: { images: File[], setImages: (images: File[]) => void, errors: { [key: string]: string } }) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const newFiles = Array.from(files);
    const totalImages = images.length + newFiles.length;
    
    if (totalImages > 5) {
      alert('لا يمكن إضافة أكثر من 5 صور');
      return;
    }
    
    // التحقق من حجم ونوع الملفات
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    const validFiles: File[] = [];
    
    for (const file of newFiles) {
      // التحقق من نوع الملف
      if (!allowedTypes.includes(file.type)) {
        alert(`الملف ${file.name} ليس صورة صالحة. الأنواع المسموحة: JPG, PNG, WEBP`);
        continue;
      }
      
      // التحقق من حجم الملف
      if (file.size > maxSize) {
        alert(`الملف ${file.name} حجمه كبير جداً. الحد الأقصى 5 ميجابايت`);
        continue;
      }
      
      validFiles.push(file);
    }
    
    if (validFiles.length === 0) return;
    
    // إضافة الملفات الصالحة
    const updatedImages = [...images, ...validFiles];
    setImages(updatedImages);
    
    // إنشاء معاينات للصور الجديدة
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
    
    // إعادة تعيين قيمة input للسماح بإضافة نفس الملف مرة أخرى
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>صور المنتج</span>
          <Badge variant="outline">{images.length} / 5</Badge>
        </CardTitle>
        <CardDescription>
          أضف صور عالية الجودة لمنتجك (JPG, PNG, WEBP - حتى 5MB لكل صورة)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {previewUrls.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <div 
                className="aspect-square bg-cover bg-center rounded-lg border"
                style={{ backgroundImage: `url(${imageUrl})` }}
              ></div>
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
                type="button"
              >
                <X className="h-3 w-3" />
              </Button>
              {index === 0 && (
                <Badge className="absolute bottom-2 left-2 text-xs">
                  الصورة الرئيسية
                </Badge>
              )}
            </div>
          ))}
          
          {images.length < 5 && (
            <label
              htmlFor="product-images"
              className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-primary transition-colors cursor-pointer"
            >
              <Upload className="h-6 w-6 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">إضافة صورة</span>
              <input
                id="product-images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          )}
        </div>
        
        {errors.images && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <X className="h-4 w-4 text-red-600 mt-0.5" />
              <p className="text-sm text-red-600 font-medium">⚠️ {errors.images}</p>
            </div>
          </div>
        )}

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">نصائح للصور:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>استخدم صور بدقة عالية (1080x1080 على الأقل)</li>
                <li>اجعل خلفية الصورة بيضاء أو شفافة</li>
                <li>أظهر المنتج من زوايا مختلفة</li>
                <li>تجنب النصوص المرسومة على الصورة</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const BasicInfo = ({ formData, setFormData, brands, categories, subcategories, governorates, cities, toast, errors }: { 
  formData: any; 
  setFormData: (data: any) => void;
  brands: Brand[];
  categories: Category[];
  subcategories: Subcategory[];
  governorates: Governorate[];
  cities: City[];
  toast: any;
  errors: { [key: string]: string };
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>المعلومات الأساسية</CardTitle>
        <CardDescription>
          أدخل المعلومات الأساسية لمنتجك
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className={errors.name ? "text-red-600" : ""}>
            اسم المنتج *
          </Label>
          <Input 
            id="name" 
            placeholder="مثال: تفاح أحمر طازج - كيلو"
            className={`text-right ${errors.name ? "border-red-500 focus:ring-red-500" : ""}`}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">⚠️ {errors.name}</p>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category_id" className={errors.category_id ? "text-red-600" : ""}>
              الفئة *
            </Label>
            <select 
              id="category_id" 
              className={`w-full p-3 border rounded-md ${errors.category_id ? "border-red-500" : "border-gray-300"}`}
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value, subcategory_id: '' })}
            >
              <option value="">اختر الفئة</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name_ar}</option>
              ))}
            </select>
            {errors.category_id && (
              <p className="text-sm text-red-600 mt-1">⚠️ {errors.category_id}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subcategory">الفئة الفرعية</Label>
            <select 
              id="subcategory" 
              className="w-full p-3 border border-gray-300 rounded-md"
              value={formData.subcategory_id}
              onChange={(e) => setFormData({ ...formData, subcategory_id: e.target.value })}
              disabled={!formData.category_id}
            >
              <option value="">اختر الفئة الفرعية</option>
              {subcategories
                .filter((sub) => sub.category_id === parseInt(formData.category_id))
                .map((sub) => (
                  <option key={sub.id} value={sub.id}>{sub.name_ar}</option>
                ))}
            </select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description" className={errors.description ? "text-red-600" : ""}>
            وصف المنتج *
          </Label>
          <Textarea 
            id="description" 
            placeholder="اكتب وصفاً تفصيلياً عن المنتج، مميزاته، وفوائده..."
            rows={4}
            className={`text-right ${errors.description ? "border-red-500 focus:ring-red-500" : ""}`}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          {errors.description && (
            <p className="text-sm text-red-600 mt-1">⚠️ {errors.description}</p>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sku">رمز المنتج (SKU) *</Label>
            <div className="flex gap-2">
              <Input 
                id="sku" 
                placeholder="مثال: APPLE-001"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                required
                className="flex-1"
              />
              <Button 
                type="button"
                variant="outline" 
                size="sm"
                onClick={() => {
                  if (formData.name && formData.category_id) {
                    const generatedSKU = generateSKU(formData.name, formData.category_id);
                    setFormData({ ...formData, sku: generatedSKU });
                    toast({
                      title: "تم توليد SKU",
                      description: `SKU: ${generatedSKU}`,
                      variant: "default",
                    });
                  } else {
                    toast({
                      title: "تنبيه",
                      description: "يجب إدخال اسم المنتج واختيار الفئة أولاً",
                      variant: "destructive",
                    });
                  }
                }}
                disabled={!formData.name || !formData.category_id}
              >
                توليد
              </Button>
            </div>
            <p className="text-xs text-gray-500">رمز فريد للمنتج (سيتم توليده تلقائياً إذا ترك فارغاً)</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="brand_id" className={errors.brand_id ? "text-red-600" : ""}>
              العلامة التجارية *
            </Label>
            <select 
              id="brand_id" 
              className={`w-full p-3 border rounded-md ${errors.brand_id ? "border-red-500" : "border-gray-300"}`}
              value={formData.brand_id}
              onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
            >
              <option value="">اختر العلامة التجارية</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
            {errors.brand_id && (
              <p className="text-sm text-red-600 mt-1">⚠️ {errors.brand_id}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="origin">بلد المنشأ</Label>
            <Input 
              id="origin" 
              placeholder="مثال: الكويت"
              value={formData.origin}
              onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit" className={errors.unit ? "text-red-600" : ""}>
              وحدة القياس *
            </Label>
            <select 
              id="unit" 
              className={`w-full p-3 border rounded-md ${errors.unit ? "border-red-500" : "border-gray-300"}`}
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            >
              <option value="">اختر وحدة القياس</option>
              <option value="كيلو">كيلو</option>
              <option value="جرام">جرام</option>
              <option value="لتر">لتر</option>
              <option value="مل">مل</option>
              <option value="قطعة">قطعة</option>
              <option value="علبة">علبة</option>
              <option value="كرتون">كرتون</option>
              <option value="باكيت">باكيت</option>
            </select>
            {errors.unit && (
              <p className="text-sm text-red-600 mt-1">⚠️ {errors.unit}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="governorate">المحافظة</Label>
            <select 
              id="governorate" 
              className="w-full p-3 border border-gray-300 rounded-md"
              value={formData.governorate_id}
              onChange={(e) => setFormData({ ...formData, governorate_id: e.target.value, city_id: '' })}
            >
              <option value="">اختر المحافظة</option>
              {governorates.map((gov) => (
                <option key={gov.id} value={gov.id}>{gov.name_ar}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="city">المدينة</Label>
            <select 
              id="city" 
              className="w-full p-3 border border-gray-300 rounded-md"
              value={formData.city_id}
              onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
              disabled={!formData.governorate_id}
            >
              <option value="">اختر المدينة</option>
              {cities
                .filter((city) => city.governorate_id === parseInt(formData.governorate_id))
                .map((city) => (
                  <option key={city.id} value={city.id}>{city.name_ar}</option>
                ))}
            </select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="expiry_date">تاريخ الانتهاء</Label>
          <Input 
            id="expiry_date" 
            type="date"
            value={formData.expiry_date}
            onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="nutritional_info">المعلومات الغذائية</Label>
          <Textarea 
            id="nutritional_info" 
            placeholder="أدخل المعلومات الغذائية للمنتج (السعرات، البروتين، الدهون، إلخ...)"
            rows={3}
            className="text-right"
            value={formData.nutritional_info}
            onChange={(e) => setFormData({ ...formData, nutritional_info: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label>خصائص المنتج</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox 
                id="fresh" 
                checked={formData.is_fresh}
                onCheckedChange={(checked) => setFormData({ ...formData, is_fresh: !!checked })}
              />
              <Label htmlFor="fresh" className="text-sm">طازج</Label>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox 
                id="organic" 
                checked={formData.is_organic}
                onCheckedChange={(checked) => setFormData({ ...formData, is_organic: !!checked })}
              />
              <Label htmlFor="organic" className="text-sm">عضوي</Label>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox 
                id="local" 
                checked={formData.is_local}
                onCheckedChange={(checked) => setFormData({ ...formData, is_local: !!checked })}
              />
              <Label htmlFor="local" className="text-sm">محلي</Label>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox 
                id="halal" 
                checked={formData.is_halal}
                onCheckedChange={(checked) => setFormData({ ...formData, is_halal: !!checked })}
              />
              <Label htmlFor="halal" className="text-sm">حلال</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PricingInventory = ({ formData, setFormData, errors }: { formData: any; setFormData: (data: any) => void; errors: { [key: string]: string } }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>السعر والمخزون</CardTitle>
        <CardDescription>
          حدد سعر المنتج وكمية المخزون
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price" className={errors.price ? "text-red-600" : ""}>
              السعر (دينار) *
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                id="price" 
                type="number" 
                placeholder="0.00"
                className={`pl-10 ${errors.price ? "border-red-500 focus:ring-red-500" : ""}`}
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            {errors.price && (
              <p className="text-sm text-red-600 mt-1">⚠️ {errors.price}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="comparePrice">السعر المقارن (اختياري)</Label>
            <Input 
              id="comparePrice" 
              type="number" 
              placeholder="السعر قبل الخصم"
              value={formData.original_price}
              onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="costPrice">سعر التكلفة</Label>
            <Input 
              id="costPrice" 
              type="number" 
              placeholder="التكلفة الفعلية"
              value={formData.cost_price}
              onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profit">هامش الربح</Label>
            <Input 
              id="profit" 
              type="text" 
              placeholder="سيتم حسابه تلقائياً"
              disabled
              value={formData.price && formData.cost_price ? (formData.price - formData.cost_price).toFixed(2) : ''}
            />
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h4 className="font-medium mb-4">إدارة المخزون</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock" className={errors.stock ? "text-red-600" : ""}>
                الكمية المتوفرة *
              </Label>
              <Input 
                id="stock" 
                type="number" 
                placeholder="الكمية في المخزن"
                className={errors.stock ? "border-red-500 focus:ring-red-500" : ""}
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
              {errors.stock && (
                <p className="text-sm text-red-600 mt-1">⚠️ {errors.stock}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="minStock">الحد الأدنى للمخزون</Label>
              <Input 
                id="minStock" 
                type="number" 
                placeholder="تنبيه عند انخفاض الكمية"
                value={formData.min_stock}
                onChange={(e) => setFormData({ ...formData, min_stock: e.target.value })}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2 space-x-reverse mt-4">
            <Checkbox 
              id="trackStock" 
              checked={formData.track_stock}
              onCheckedChange={(checked) => setFormData({ ...formData, track_stock: !!checked })}
            />
            <Label htmlFor="trackStock" className="text-sm">
              تتبع المخزون (سيتم خصم الكمية عند كل عملية بيع)
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ShippingSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>إعدادات الشحن</CardTitle>
        <CardDescription>
          حدد معلومات الشحن والتوصيل للمنتج
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="weight">الوزن (كيلوجرام)</Label>
            <Input 
              id="weight" 
              type="number" 
              placeholder="1.0"
              step="0.1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dimensions">الأبعاد (سم)</Label>
            <Input 
              id="dimensions" 
              placeholder="الطول × العرض × الارتفاع"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label className="text-base font-medium">طرق التوصيل المتاحة</Label>
            <div className="mt-2 space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox id="standardDelivery" defaultChecked />
                  <Label htmlFor="standardDelivery">توصيل عادي (1-2 يوم)</Label>
                </div>
                <Input 
                  type="number" 
                  placeholder="10"
                  className="w-20 text-center"
                />
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox id="expressDelivery" />
                  <Label htmlFor="expressDelivery">توصيل سريع (نفس اليوم)</Label>
                </div>
                <Input 
                  type="number" 
                  placeholder="20"
                  className="w-20 text-center"
                />
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox id="freeDelivery" />
                  <Label htmlFor="freeDelivery">توصيل مجاني (للطلبات +10 دينار)</Label>
                </div>
                <span className="text-sm text-gray-600">مجاني</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="preparationTime">وقت التحضير</Label>
          <select id="preparationTime" className="w-full p-3 border border-gray-300 rounded-md">
            <option value="same-day">نفس اليوم</option>
            <option value="1-day">يوم واحد</option>
            <option value="2-3-days">2-3 أيام</option>
            <option value="1-week">أسبوع</option>
          </select>
        </div>
      </CardContent>
    </Card>
  );
};

const SEOSettings = ({ formData, setFormData }: { formData: any; setFormData: (data: any) => void }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>إعدادات الظهور والبحث</CardTitle>
        <CardDescription>
          حسّن ظهور منتجك في نتائج البحث
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="searchKeywords">كلمات البحث المفتاحية</Label>
          <TagsInput
            value={formData.search_keywords}
            onChange={(tags) => setFormData({ ...formData, search_keywords: tags })}
            placeholder="اكتب كلمة واضغط Enter أو فاصلة للإضافة"
          />
          <p className="text-sm text-gray-600">
            أضف كلمات مفتاحية تساعد العملاء في العثور على منتجك. اضغط Enter أو فاصلة لإضافة كلمة.
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="metaDescription">وصف مختصر للبحث</Label>
          <Textarea 
            id="metaDescription" 
            placeholder="وصف مختصر وجذاب للمنتج يظهر في نتائج البحث"
            rows={3}
            value={formData.meta_description}
            onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
          />
          <p className="text-sm text-gray-600">
            الحد الأقصى 160 حرف. هذا النص سيظهر في نتائج البحث.
          </p>
        </div>
        
        <div className="space-y-4">
          <Label className="text-base font-medium">إعدادات الرؤية</Label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox 
                id="featured" 
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData({ ...formData, is_featured: !!checked })}
              />
              <Label htmlFor="featured">منتج مميز (يظهر في الصفحة الرئيسية)</Label>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox 
                id="newProduct" 
                checked={formData.is_new}
                onCheckedChange={(checked) => setFormData({ ...formData, is_new: !!checked })}
              />
              <Label htmlFor="newProduct">منتج جديد</Label>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox 
                id="bestseller" 
                checked={formData.is_bestseller}
                onCheckedChange={(checked) => setFormData({ ...formData, is_bestseller: !!checked })}
              />
              <Label htmlFor="bestseller">الأكثر مبيعاً</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PreviewActions = ({ onSubmit, loading }: { onSubmit: (e: React.FormEvent) => void; loading: boolean }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>معاينة وحفظ</CardTitle>
        <CardDescription>
          راجع المنتج واحفظه أو انشره
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Button variant="outline" className="flex-1" type="button">
            <Eye className="h-4 w-4 ml-2" />
            معاينة المنتج
          </Button>
          <Button variant="outline" className="flex-1" type="button">
            <Save className="h-4 w-4 ml-2" />
            حفظ كمسودة
          </Button>
        </div>
        
        <Button size="lg" className="w-full" onClick={onSubmit} disabled={loading}>
          <Package className="h-4 w-4 ml-2" />
          {loading ? 'جاري الحفظ...' : 'نشر المنتج'}
        </Button>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            بنشر المنتج، فإنك توافق على{" "}
            <Link to="/vendor/terms" className="text-primary hover:underline">
              شروط وأحكام الموردين
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// دالة لتوليد SKU تلقائياً
const generateSKU = (name: string, categoryId: string) => {
  const timestamp = Date.now().toString().slice(-6);
  const namePrefix = name.replace(/\s+/g, '').substring(0, 3).toUpperCase();
  const categoryPrefix = categoryId ? `CAT${categoryId}` : 'GEN';
  return `${categoryPrefix}-${namePrefix}-${timestamp}`;
};

// دالة لترجمة أسماء الحقول إلى العربية
const getFieldNameInArabic = (fieldName: string): string => {
  const fieldNames: { [key: string]: string } = {
    'name': 'اسم المنتج',
    'description': 'وصف المنتج',
    'price': 'السعر',
    'original_price': 'السعر المقارن',
    'stock': 'الكمية المتوفرة',
    'category_id': 'الفئة',
    'subcategory_id': 'الفئة الفرعية',
    'sku': 'رمز المنتج (SKU)',
    'brand_id': 'العلامة التجارية',
    'unit': 'وحدة القياس',
    'origin': 'بلد المنشأ',
    'weight': 'الوزن',
    'dimensions': 'الأبعاد',
    'governorate_id': 'المحافظة',
    'city_id': 'المدينة',
    'expiry_date': 'تاريخ الانتهاء',
    'nutritional_info': 'المعلومات الغذائية',
    'cost_price': 'سعر التكلفة',
    'min_stock': 'الحد الأدنى للمخزون',
    'meta_description': 'وصف مختصر للبحث',
    'search_keywords': 'كلمات البحث المفتاحية',
    'images': 'صور المنتج',
    'images[]': 'صور المنتج',
  };
  
  return fieldNames[fieldName] || fieldName;
};

export default function VendorAddProduct() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [productImages, setProductImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    stock: '',
    category_id: '',
    subcategory_id: '',
    sku: '',
    brand_id: '',
    origin: '',
    weight: '',
    unit: '',
    dimensions: '',
    governorate_id: '',
    city_id: '',
    expiry_date: '',
    nutritional_info: '',
    is_fresh: false,
    is_organic: false,
    is_local: false,
    is_halal: false,
    is_featured: false,
    is_new: false,
    is_bestseller: false,
    search_keywords: [] as string[],
    meta_description: '',
    cost_price: '',
    min_stock: '',
    track_stock: true
  });

  useEffect(() => {
    const loadVendorData = async () => {
      try {
        // التحقق من حالة تسجيل الدخول
        if (!vendorAuthService.isLoggedIn()) {
          navigate('/vendor/login');
          return;
        }
        
        // تحميل البيانات من API
        await loadFormData();
      } catch (error) {
        console.error('Error loading vendor data:', error);
        navigate('/vendor/login');
      }
    };

    loadVendorData();
  }, [navigate]);

  // دالة لتحميل البيانات من API
  const loadFormData = async () => {
    try {
      // تحميل العلامات التجارية
      const brandsResponse = await api.brands() as any;
      if (brandsResponse.success) {
        setBrands(brandsResponse.data);
      }
      
      // تحميل الفئات
      const categoriesResponse = await api.get<{ success: boolean; data: Category[] }>('/categories') as any;
      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data);
      }
      
      // تحميل الفئات الفرعية
      const subcategoriesResponse = await api.get<{ success: boolean; data: Subcategory[] }>('/subcategories') as any;
      if (subcategoriesResponse.success) {
        setSubcategories(subcategoriesResponse.data);
      }
      
      // تحميل المحافظات
      const governoratesResponse = await api.get<{ success: boolean; data: Governorate[] }>('/governorates') as any;
      if (governoratesResponse.success) {
        setGovernorates(governoratesResponse.data);
      }
      
      // تحميل المدن
      const citiesResponse = await api.get<{ success: boolean; data: City[] }>('/cities') as any;
      if (citiesResponse.success) {
        setCities(citiesResponse.data);
      }
      
    } catch (error) {
      console.error('Error loading form data:', error);
      toast({
        title: "خطأ في تحميل البيانات",
        description: "حدث خطأ في تحميل بيانات النموذج. حاول تحديث الصفحة.",
        variant: "destructive",
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // التحقق من الحقول المطلوبة
    if (!formData.name || !formData.name.trim()) {
      newErrors.name = "اسم المنتج مطلوب";
    }

    if (!formData.description || !formData.description.trim()) {
      newErrors.description = "وصف المنتج مطلوب";
    }

    if (!formData.price || formData.price === '') {
      newErrors.price = "السعر مطلوب";
    }

    if (!formData.stock || formData.stock === '') {
      newErrors.stock = "الكمية المتوفرة مطلوبة";
    }

    if (!formData.category_id || formData.category_id === '') {
      newErrors.category_id = "يجب اختيار الفئة";
    }

    if (!formData.unit || formData.unit === '') {
      newErrors.unit = "يجب اختيار وحدة القياس";
    }

    if (!formData.brand_id || formData.brand_id === '') {
      newErrors.brand_id = "يجب اختيار العلامة التجارية";
    }

    if (productImages.length === 0) {
      newErrors.images = "يجب إضافة صورة واحدة على الأقل";
    }

    setErrors(newErrors);

    // إذا كانت هناك أخطاء، قم بالتمرير إلى أول حقل به خطأ
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // مسح الأخطاء السابقة
      setErrors({});

      // التحقق من صحة النموذج
      if (!validateForm()) {
        toast({
          title: "❌ يوجد حقول مطلوبة",
          description: "يرجى ملء جميع الحقول المطلوبة المحددة باللون الأحمر",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // توليد SKU إذا لم يتم إدخاله
      let sku = formData.sku.trim();
      if (!sku) {
        sku = generateSKU(formData.name, formData.category_id);
        console.log('تم توليد SKU تلقائياً:', sku);
      }

      // طباعة البيانات للتحقق
      console.log('🔍 البيانات من النموذج:', {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        stock: formData.stock,
        category_id: formData.category_id,
        unit: formData.unit,
      });

      // إنشاء FormData لإرسال البيانات مع الصور
      const formDataToSend = new FormData();
      
      // إضافة البيانات النصية - تأكد من أنها ليست فارغة
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('price', formData.price.toString());
      formDataToSend.append('stock', formData.stock.toString());
      formDataToSend.append('category_id', formData.category_id.toString());
      formDataToSend.append('sku', sku);
      formDataToSend.append('unit', formData.unit);
      
      // إضافة الحقول الاختيارية
      if (formData.original_price) formDataToSend.append('original_price', formData.original_price.toString());
      if (formData.subcategory_id) formDataToSend.append('subcategory_id', formData.subcategory_id.toString());
      if (formData.brand_id) formDataToSend.append('brand_id', formData.brand_id.toString());
      if (formData.origin) formDataToSend.append('origin', formData.origin.trim());
      if (formData.weight) formDataToSend.append('weight', formData.weight.toString());
      if (formData.dimensions) formDataToSend.append('dimensions', formData.dimensions.trim());
      if (formData.governorate_id) formDataToSend.append('governorate_id', formData.governorate_id.toString());
      if (formData.city_id) formDataToSend.append('city_id', formData.city_id.toString());
      if (formData.expiry_date) formDataToSend.append('expiry_date', formData.expiry_date);
      if (formData.nutritional_info) formDataToSend.append('nutritional_info', formData.nutritional_info.trim());
      if (formData.cost_price) formDataToSend.append('cost_price', formData.cost_price.toString());
      if (formData.min_stock) formDataToSend.append('min_stock', formData.min_stock.toString());
      if (formData.meta_description) formDataToSend.append('meta_description', formData.meta_description.trim());
      
      // إضافة القيم المنطقية
      formDataToSend.append('is_fresh', formData.is_fresh ? '1' : '0');
      formDataToSend.append('is_organic', formData.is_organic ? '1' : '0');
      formDataToSend.append('is_local', formData.is_local ? '1' : '0');
      formDataToSend.append('is_halal', formData.is_halal ? '1' : '0');
      formDataToSend.append('is_featured', formData.is_featured ? '1' : '0');
      formDataToSend.append('is_new', formData.is_new ? '1' : '0');
      formDataToSend.append('is_bestseller', formData.is_bestseller ? '1' : '0');
      formDataToSend.append('track_stock', formData.track_stock ? '1' : '0');
      
      // إضافة الكلمات المفتاحية
      if (formData.search_keywords.length > 0) {
        formDataToSend.append('search_keywords', formData.search_keywords.join(', '));
      }
      
      // إضافة الصور
      productImages.forEach((image, index) => {
        formDataToSend.append(`images[]`, image);
        // تحديد الصورة الرئيسية (الصورة الأولى)
        if (index === 0) {
          formDataToSend.append('main_image_index', '0');
        }
      });

      // طباعة محتويات FormData للتحقق
      console.log('📦 محتويات FormData:');
      const formDataEntries: any = {};
      for (let [key, value] of formDataToSend.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File(${value.name}, ${value.size} bytes)`);
          formDataEntries[key] = `File(${value.name})`;
        } else {
          console.log(`${key}: ${value}`);
          formDataEntries[key] = value;
        }
      }
      
      console.log('📊 ملخص FormData:', formDataEntries);
      console.log('إرسال بيانات المنتج مع', productImages.length, 'صورة');
      console.log('SKU المُولد:', sku);
      console.log('🔄 نوع البيانات:', formDataToSend instanceof FormData ? 'FormData' : typeof formDataToSend);
      
      const response = await api.vendor.products.create(formDataToSend) as any;
      console.log('استجابة API:', response);
      
      if (response.success) {
        // عرض رسالة نجاح
        toast({
          title: "✅ تم إضافة المنتج بنجاح!",
          description: "تم إضافة المنتج بنجاح وفي انتظار موافقة الإدارة",
          variant: "default",
          duration: 5000, // 5 ثواني
        });
        
        // الانتقال إلى صفحة المنتجات بعد ثانية
        setTimeout(() => {
          navigate('/vendor/products');
        }, 1000);
      } else {
        toast({
          title: "خطأ في إضافة المنتج",
          description: response.message || "حدث خطأ في إضافة المنتج. حاول مرة أخرى.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error creating product:', error);
      
      // معالجة أخطاء التحقق من الصحة (422)
      if (error.status === 422 && error.validationErrors) {
        // إضافة الأخطاء إلى state الأخطاء
        const newErrors: { [key: string]: string } = {};
        Object.entries(error.validationErrors).forEach(([field, messages]: [string, any]) => {
          if (Array.isArray(messages)) {
            newErrors[field] = messages[0]; // أخذ أول رسالة خطأ
          } else {
            newErrors[field] = messages;
          }
        });
        setErrors(newErrors);

        // عرض رسائل التحقق التفصيلية
        const errorMessages = Object.entries(error.validationErrors)
          .map(([field, messages]: [string, any]) => {
            const fieldName = getFieldNameInArabic(field);
            if (Array.isArray(messages)) {
              return `• ${fieldName}: ${messages.join(', ')}`;
            }
            return `• ${fieldName}: ${messages}`;
          })
          .join('\n');
        
        toast({
          title: "❌ فشل التحقق من صحة البيانات",
          description: errorMessages || error.message,
          variant: "destructive",
        });

        // التمرير إلى أول حقل به خطأ
        const firstErrorField = Object.keys(newErrors)[0];
        const element = document.getElementById(firstErrorField);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
      } else {
        // معالجة الأخطاء الأخرى
        const errorMessage = error.message || "حدث خطأ في إضافة المنتج. حاول مرة أخرى.";
        toast({
          title: "❌ خطأ في إضافة المنتج",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await vendorAuthService.logout();
      navigate('/vendor/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/vendor/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <VendorHeader 
        onLogout={handleLogout}
        title="إضافة منتج جديد"
        subtitle="مزارع الطيبات"
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link to="/vendor/dashboard">
              <ArrowLeft className="h-4 w-4 ml-2" />
              العودة للوحة التحكم
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">إضافة منتج جديد</h1>
          <p className="text-gray-600">املأ جميع المعلومات المطلوبة لإضافة منتج جديد لمتجرك</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <ProductImages images={productImages} setImages={setProductImages} errors={errors} />
              <BasicInfo 
                formData={formData} 
                setFormData={setFormData}
                brands={brands}
                categories={categories}
                subcategories={subcategories}
                governorates={governorates}
                cities={cities}
                toast={toast}
                errors={errors}
              />
              <PricingInventory formData={formData} setFormData={setFormData} errors={errors} />
              <ShippingSettings />
              <SEOSettings formData={formData} setFormData={setFormData} />
            </div>
            
            <div className="space-y-6">
              <PreviewActions onSubmit={handleSubmit} loading={loading} />
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">نصائح لمنتج ناجح</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <p className="text-sm">استخدم صور عالية الجودة وواضحة</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <p className="text-sm">اكتب وصف تفصيلي ومفيد</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <p className="text-sm">حدد سعر منافس ومناسب</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <p className="text-sm">اختر الفئة المناسبة للمنتج</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <p className="text-sm">أضف كلمات مفتاحية مناسبة</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
