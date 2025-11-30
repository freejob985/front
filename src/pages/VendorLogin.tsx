import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Store, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import vendorAuthService from '@/services/vendorAuth';
import type { VendorLoginData } from '@/services/vendorAuth';
import logger from '@/lib/logger';

export default function VendorLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<VendorLoginData>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // التحقق من حالة تسجيل الدخول
  useEffect(() => {
    if (vendorAuthService.isLoggedIn()) {
      navigate('/vendor/dashboard');
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // إزالة رسالة الخطأ عند البدء في الكتابة
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      logger.info('بدء عملية تسجيل دخول المورد', { email: formData.email });
      const result = await vendorAuthService.login(formData);
      
      if (result.success) {
        logger.info('تم تسجيل دخول المورد بنجاح', { email: formData.email, vendor: result.vendor });
        console.log('✅ Login successful, redirecting to dashboard...');
        
        // عرض رسالة نجاح
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: `مرحباً ${result.vendor?.name || 'بالمورد'}`,
          variant: "default",
        });
        
        // عند نجاح تسجيل الدخول، يتم التوجيه إلى لوحة التحكم
        navigate('/vendor/dashboard');
      } else {
        logger.error('فشل في تسجيل دخول المورد', { email: formData.email, message: result.message });
        console.error('❌ Login failed:', result.message);
        
        // تحسين رسالة الخطأ
        let errorMessage = 'فشل في تسجيل الدخول';
        if (result.message) {
          // إذا كانت الرسالة تحتوي على "تم تسجيل الدخول بنجاح"، فهذا خطأ في المنطق
          if (result.message.includes('تم تسجيل الدخول بنجاح')) {
            errorMessage = 'حدث خطأ في معالجة استجابة تسجيل الدخول. يرجى المحاولة مرة أخرى.';
          } else {
            errorMessage = result.message;
          }
        }
        
        // عرض رسالة خطأ
        toast({
          title: "فشل في تسجيل الدخول",
          description: errorMessage,
          variant: "destructive",
        });
        
        setError(errorMessage);
      }
    } catch (error: any) {
      logger.error('فشل في تسجيل دخول المورد', { email: formData.email, error: error.message });
      console.error('❌ Login error:', error);
      const errorMessage = error.message || 'حدث خطأ أثناء تسجيل الدخول';
      
      // عرض رسالة خطأ
      toast({
        title: "خطأ في تسجيل الدخول",
        description: errorMessage,
        variant: "destructive",
      });
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full mb-4">
            <Store className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">مزارع الطيبات</h1>
          <p className="text-gray-600">تسجيل دخول المورد</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">مرحباً بعودتك</CardTitle>
            <CardDescription>
              سجل دخولك للوصول إلى لوحة تحكم المورد
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
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

              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="كلمة المرور"
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

              <div className="flex items-center justify-between">
                <Link 
                  to="/vendor/forgot-password" 
                  className="text-sm text-emerald-600 hover:text-emerald-500"
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  'تسجيل الدخول'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ليس لديك حساب؟{' '}
                <Link 
                  to="/vendor/signup" 
                  className="text-emerald-600 hover:text-emerald-500 font-medium"
                >
                  انضم كمورد
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