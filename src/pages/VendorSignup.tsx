import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Store, Eye, EyeOff, Loader2, CheckCircle, MapPin, Building2 } from 'lucide-react';
import vendorAuthService from '@/services/vendorAuth';
import locationApi from '@/services/locationApi';
import { api } from '@/lib/api';
import type { VendorSignupData } from '@/services/vendorAuth';
import type { Governorate, City, BusinessCategory } from '@/services/locationApi';

export default function VendorSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<VendorSignupData>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    business_name: '',
    business_type: '',
    address: '',
    commercial_record: '',
    tax_number: '',
    bank_account: '',
    bank_name: '',
    city: '',
    governorate: '',
    business_categories: [],
    // New fields
    postal_code: '',
    description: '',
    delivery_fee: '0',
    free_delivery_threshold: '0',
    governorate_id: 0,
    city_id: 0,
    is_featured: false,
    is_fresh: false,
    category: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [dataPrefilled, setDataPrefilled] = useState(false);
  
  // بيانات الموقع وفئات الأعمال
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [businessCategories, setBusinessCategories] = useState<BusinessCategory[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  // التحقق من حالة تسجيل الدخول
  useEffect(() => {
    if (vendorAuthService.isLoggedIn()) {
      navigate('/vendor/dashboard');
    }
  }, [navigate]);

  // تحميل بيانات العميل المسجل للتحسين تجربة المستخدم
  useEffect(() => {
    const loadCustomerData = async () => {
      try {
        // محاولة جلب بيانات العميل المسجل
        const data = await api.auth.me();
        if (data.user) {
          const user = data.user;
          // ملء البيانات الأساسية من بيانات العميل
          setFormData(prev => ({
            ...prev,
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            // يمكن إضافة المزيد من الحقول إذا كانت متاحة
          }));
          setDataPrefilled(true);
        }
      } catch (error) {
        // لا نعرض خطأ للمستخدم، فقط لا نملأ البيانات
        console.log('No customer data available for pre-fill');
      }
    };

    loadCustomerData();
  }, []);

  // تحميل البيانات الأولية
  useEffect(() => {
    const loadInitialData = async () => {
      setLoadingLocations(true);
      try {
        const [governoratesData, categoriesData] = await Promise.all([
          locationApi.getGovernorates(),
          locationApi.getBusinessCategories()
        ]);
        console.log('Governorates loaded:', governoratesData);
        console.log('Business categories loaded:', categoriesData);
        console.log('Business categories length:', categoriesData.length);
        setGovernorates(governoratesData);
        setBusinessCategories(categoriesData);
      } catch (error) {
        console.error('Error loading initial data:', error);
        setError('خطأ في تحميل البيانات. يرجى المحاولة مرة أخرى.');
      } finally {
        setLoadingLocations(false);
      }
    };

    loadInitialData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Set city_id when city changes
      ...(name === 'city' && { city_id: parseInt(value) || 0 })
    }));
    // إزالة رسالة الخطأ عند البدء في الكتابة
    if (error) setError('');
  };

  // معالجة تغيير المحافظة
  const handleGovernorateChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const governorateId = e.target.value;
    setFormData(prev => ({
      ...prev,
      governorate: governorateId,
      governorate_id: parseInt(governorateId) || 0,
      city: '', // إعادة تعيين المدينة عند تغيير المحافظة
      city_id: 0
    }));

    if (governorateId) {
      try {
        setLoadingLocations(true);
        const citiesData = await locationApi.getCitiesByGovernorate(parseInt(governorateId));
        setCities(citiesData);
      } catch (error) {
        console.error('Error loading cities:', error);
        setError('خطأ في تحميل المدن. يرجى المحاولة مرة أخرى.');
      } finally {
        setLoadingLocations(false);
      }
    } else {
      setCities([]);
    }
  };

  // معالجة تغيير فئات الأعمال
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      business_categories: checked
        ? [...prev.business_categories, categoryId]
        : prev.business_categories.filter(id => id !== categoryId)
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.password_confirmation) {
      setError('كلمة المرور وتأكيد كلمة المرور غير متطابقتين');
      return false;
    }
    if (formData.password.length < 8) {
      setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      return false;
    }
    if (!formData.commercial_record.trim()) {
      setError('رقم السجل التجاري مطلوب');
      return false;
    }
    if (!formData.tax_number.trim()) {
      setError('الرقم الضريبي مطلوب');
      return false;
    }
    if (!formData.bank_account.trim()) {
      setError('رقم الحساب البنكي مطلوب');
      return false;
    }
    if (!formData.bank_name.trim()) {
      setError('اسم البنك مطلوب');
      return false;
    }
    if (!formData.governorate) {
      setError('المحافظة مطلوبة');
      return false;
    }
    if (!formData.city) {
      setError('المدينة مطلوبة');
      return false;
    }
    if (formData.business_categories.length === 0) {
      setError('يجب اختيار فئة عمل واحدة على الأقل');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');

    try {
      await vendorAuthService.signup(formData);
      setSuccess(true);
      
      // بعد 2 ثانية، يتم التوجيه إلى لوحة التحكم
        setTimeout(() => {
        navigate('/vendor/dashboard');
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'حدث خطأ أثناء التسجيل');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">تم التسجيل بنجاح!</h2>
          <p className="text-gray-600 mb-4">
              مرحباً بك في مزارع الطيبات. سيتم توجيهك إلى لوحة التحكم قريباً...
            </p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
            </div>
        </CardContent>
      </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full mb-4">
            <Store className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">مزارع الطيبات</h1>
          <p className="text-gray-600">انضم كمورد جديد</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">ابدأ رحلتك معنا</CardTitle>
        <CardDescription>
              انضم إلى منصة مزارع الطيبات وابدأ بيع منتجاتك
        </CardDescription>
        {dataPrefilled && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">تم ملء البيانات تلقائياً من حسابك كعميل</span>
            </div>
          </div>
        )}
      </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
                  <Label htmlFor="name">الاسم الكامل *</Label>
            <Input 
              id="name" 
              name="name"
                    type="text"
              value={formData.name}
              onChange={handleInputChange}
                    placeholder="الاسم الكامل"
              required
                    className="text-right"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني *</Label>
            <Input 
              id="email" 
              name="email"
              type="email" 
              value={formData.email}
              onChange={handleInputChange}
                    placeholder="example@domain.com"
              required
                    className="text-right"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">كلمة المرور *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="كلمة المرور (8 أحرف على الأقل)"
                      required
                      className="text-right pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password_confirmation">تأكيد كلمة المرور *</Label>
                  <div className="relative">
                    <Input
                      id="password_confirmation"
                      name="password_confirmation"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.password_confirmation}
                      onChange={handleInputChange}
                      placeholder="تأكيد كلمة المرور"
                      required
                      className="text-right pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
          </div>
          
          <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف</Label>
            <Input 
              id="phone" 
              name="phone"
                  type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+965 12345678" 
                  className="text-right"
            />
          </div>
          
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
                  <Label htmlFor="business_name">اسم المتجر/الشركة</Label>
            <Input 
                    id="business_name"
                    name="business_name"
                    type="text"
                    value={formData.business_name}
              onChange={handleInputChange}
                    placeholder="اسم المتجر أو الشركة"
                    className="text-right"
            />
          </div>
          
          <div className="space-y-2">
                  <Label htmlFor="business_type">نوع النشاط</Label>
                  <select
                    id="business_type"
                    name="business_type"
                    value={formData.business_type}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md text-right"
                  >
                    <option value="">اختر نوع النشاط</option>
                    <option value="agriculture">زراعة</option>
                    <option value="livestock">تربية حيوانات</option>
                    <option value="dairy">منتجات ألبان</option>
                    <option value="poultry">دواجن</option>
                    <option value="fishing">صيد</option>
                    <option value="other">أخرى</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">العنوان</Label>
                <Input
              id="address" 
              name="address"
                  type="text"
              value={formData.address}
              onChange={handleInputChange}
                  placeholder="العنوان الكامل"
                  className="text-right"
            />
          </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postal_code">الرمز البريدي</Label>
                  <Input
                    id="postal_code"
                    name="postal_code"
                    type="text"
                    value={formData.postal_code}
                    onChange={handleInputChange}
                    placeholder="الرمز البريدي"
                    className="text-right"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">فئة النشاط</Label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md text-right"
                  >
                    <option value="">اختر فئة النشاط</option>
                    <option value="fresh_produce">منتجات طازجة</option>
                    <option value="dairy">منتجات ألبان</option>
                    <option value="meat">لحوم</option>
                    <option value="seafood">مأكولات بحرية</option>
                    <option value="beverages">مشروبات</option>
                    <option value="other">أخرى</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">وصف النشاط</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange(e as any)}
                  placeholder="وصف مختصر عن نشاطك التجاري"
                  className="w-full p-3 border border-gray-300 rounded-md text-right min-h-[100px] resize-none"
                  rows={3}
                />
              </div>

              {/* الحقول الإلزامية الجديدة */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">المعلومات التجارية (إلزامية)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                    <Label htmlFor="commercial_record">رقم السجل التجاري *</Label>
              <Input 
                      id="commercial_record"
                      name="commercial_record"
                      type="text"
                      value={formData.commercial_record}
                onChange={handleInputChange}
                      placeholder="رقم السجل التجاري"
                required
                      className="text-right"
              />
            </div>

            <div className="space-y-2">
                    <Label htmlFor="tax_number">الرقم الضريبي *</Label>
              <Input 
                      id="tax_number"
                      name="tax_number"
                      type="text"
                      value={formData.tax_number}
                onChange={handleInputChange}
                      placeholder="الرقم الضريبي"
                required
                      className="text-right"
              />
            </div>
          </div>
          
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
                    <Label htmlFor="bank_account">رقم الحساب البنكي *</Label>
                    <Input
                      id="bank_account"
                      name="bank_account"
                      type="text"
                      value={formData.bank_account}
              onChange={handleInputChange}
                      placeholder="رقم الحساب البنكي"
                      required
                      className="text-right"
            />
          </div>
          
          <div className="space-y-2">
                    <Label htmlFor="bank_name">اسم البنك *</Label>
            <Input 
                      id="bank_name"
                      name="bank_name"
                      type="text"
                      value={formData.bank_name}
              onChange={handleInputChange}
                      placeholder="اسم البنك"
              required
                      className="text-right"
            />
          </div>
                </div>
              </div>

              {/* معلومات التوصيل */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">معلومات التوصيل</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="delivery_fee">رسوم التوصيل (دينار)</Label>
                    <Input
                      id="delivery_fee"
                      name="delivery_fee"
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.delivery_fee}
                      onChange={handleInputChange}
                      placeholder="0.0"
                      className="text-right"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="free_delivery_threshold">حد التوصيل المجاني (دينار)</Label>
                    <Input
                      id="free_delivery_threshold"
                      name="free_delivery_threshold"
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.free_delivery_threshold}
                      onChange={handleInputChange}
                      placeholder="0.0"
                      className="text-right"
                    />
                  </div>
                </div>
              </div>

              {/* معلومات الموقع */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  معلومات الموقع (إلزامية)
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="governorate">المحافظة *</Label>
                    <select
                      id="governorate"
                      name="governorate"
                      value={formData.governorate}
                      onChange={handleGovernorateChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right text-gray-900 bg-white"
                      disabled={loadingLocations}
                    >
                      <option value="">اختر المحافظة</option>
                      {governorates.map((gov) => (
                        <option key={gov.id} value={gov.id}>
                          {gov.name}
                        </option>
                      ))}
                    </select>
          </div>
          
          <div className="space-y-2">
                    <Label htmlFor="city">المدينة *</Label>
                    <select
                      id="city"
                      name="city"
                      value={formData.city}
              onChange={handleInputChange}
              required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right text-gray-900 bg-white"
                      disabled={!formData.governorate || loadingLocations}
                    >
                      <option value="">اختر المدينة</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
          </div>
          
              {/* فئات الأعمال */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-green-600" />
                  فئات الأعمال (إلزامية)
                </h3>
                
                {loadingLocations ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">جاري تحميل فئات الأعمال...</span>
                  </div>
                ) : businessCategories.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>لا توجد فئات أعمال متاحة</p>
                    <p className="text-sm">يرجى المحاولة مرة أخرى</p>
                    <div className="mt-4 p-2 bg-yellow-50 rounded text-xs text-yellow-700">
                      Debug: businessCategories.length = {businessCategories.length}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {businessCategories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2 rtl:space-x-reverse">
                        <input
                          type="checkbox"
                          id={`category-${category.id}`}
                          checked={formData.business_categories.includes(category.id.toString())}
                          onChange={(e) => handleCategoryChange(category.id.toString(), e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <Label 
                          htmlFor={`category-${category.id}`}
                          className="text-sm font-medium text-gray-700 cursor-pointer"
                        >
                          {category.name}
            </Label>
                      </div>
                    ))}
                  </div>
                )}
                
                {formData.business_categories.length > 0 && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      تم اختيار {formData.business_categories.length} فئة عمل
                    </p>
                  </div>
                )}
          </div>
          
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">شروط الانضمام:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• يجب أن تكون منتجاتك طازجة وعالية الجودة</li>
                  <li>• الالتزام بمواعيد التوصيل المحددة</li>
                  <li>• توفير صور واضحة للمنتجات</li>
                  <li>• الالتزام بأسعار منافسة وعادلة</li>
                  <li>• توفير جميع الوثائق التجارية المطلوبة</li>
                  <li>• التأكد من صحة البيانات المالية المقدمة</li>
                  <li>• تحديد موقعك الجغرافي بدقة</li>
                  <li>• اختيار فئات الأعمال المناسبة لنشاطك</li>
                </ul>
          </div>
          
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || loadingLocations}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                    جاري التسجيل...
                  </>
                ) : loadingLocations ? (
                  <>
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                    جاري تحميل البيانات...
                  </>
                ) : (
                  'انضم كمورد'
                )}
          </Button>
        </form>
        
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                لديك حساب بالفعل؟{' '}
                <Link 
                  to="/vendor/login" 
                  className="text-emerald-600 hover:text-emerald-500 font-medium"
                >
                  سجل دخولك
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link 
                to="/" 
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                العودة إلى الموقع الرئيسي
              </Link>
        </div>
      </CardContent>
    </Card>
        </div>
    </div>
  );
}