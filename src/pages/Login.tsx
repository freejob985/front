import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";

export default function Login() {
  const nav = useNavigate();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{email?: string, password?: string}>({});

  // Check if user is already logged in
  const { data: meData, isLoading: meLoading } = useQuery({ 
    queryKey: ["auth", "me"], 
    queryFn: api.auth.me,
    retry: false
  });

  useEffect(() => {
    if (!meLoading && meData?.user) {
      console.log('User already logged in, redirecting to account:', meData.user);
      nav("/account");
    }
  }, [meData, meLoading, nav]);

  const validateForm = () => {
    const newErrors: {email?: string, password?: string} = {};
    
    if (!email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
    }
    
    if (!password.trim()) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (password.length < 6) {
      newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      console.log('Attempting login with:', { email, password: '***' });
      const response = await api.auth.login({ email, password }) as any;
      console.log('Login response:', response);
      
      if (response.success) {
        console.log('Login successful, invalidating queries...');
        // Invalidate and refetch user data
        await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
        
        console.log('Refetching user data...');
        // Force refetch user data
        const meData = await queryClient.refetchQueries({ queryKey: ["auth", "me"] });
        console.log('Refetched user data:', meData);
        
        toast.success("تم تسجيل الدخول بنجاح! 🎉", {
          description: `مرحباً ${response.user?.name || 'بك'}، أهلاً وسهلاً`,
          duration: 4000,
          className: 'toast-success',
        });
        
        console.log('Navigating to account page...');
        // Navigate to account page immediately
        nav("/account");
      } else {
        console.error('Login failed:', response);
        throw new Error(response.message || 'فشل تسجيل الدخول');
      }
      
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = "فشل تسجيل الدخول";
      let errorDescription = "يرجى التحقق من البيانات المدخلة";
      
      if (error.message) {
        if (error.message.includes('credentials') || error.message.includes('invalid')) {
          errorMessage = "بيانات الدخول غير صحيحة";
          errorDescription = "يرجى التحقق من البريد الإلكتروني وكلمة المرور";
        } else if (error.message.includes('email')) {
          errorMessage = "البريد الإلكتروني غير صحيح";
          errorDescription = "يرجى إدخال بريد إلكتروني صحيح";
        } else if (error.message.includes('password')) {
          errorMessage = "كلمة المرور غير صحيحة";
          errorDescription = "يرجى التحقق من كلمة المرور";
        } else {
          errorDescription = error.message;
        }
      }
      
      toast.error(errorMessage, {
        description: errorDescription,
        duration: 5000,
        className: 'toast-error',
      });
    } finally {
      setLoading(false);
    }
  };
  if (meLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحقق من حالة تسجيل الدخول...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">مرحباً بعودتك</h1>
          <p className="text-gray-600">سجل دخولك للوصول إلى حسابك</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center">تسجيل الدخول</CardTitle>
            <p className="text-sm text-gray-600 text-center">
              أدخل بياناتك للوصول إلى حسابك
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  البريد الإلكتروني
                </Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="أدخل بريدك الإلكتروني"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`pr-10 ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                    disabled={loading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span className="text-red-500">⚠</span>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  كلمة المرور
                </Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="أدخل كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`pr-10 pl-10 ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span className="text-red-500">⚠</span>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full h-12 text-lg font-medium"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    جارٍ تسجيل الدخول...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    تسجيل الدخول
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">أو</span>
                </div>
              </div>

              {/* Register Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  ليس لديك حساب؟{" "}
                  <Link 
                    to="/register" 
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    إنشاء حساب جديد
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            بالاستمرار، أنت توافق على{" "}
            <Link to="/terms" className="text-primary hover:underline">
              شروط الاستخدام
            </Link>{" "}
            و{" "}
            <Link to="/privacy" className="text-primary hover:underline">
              سياسة الخصوصية
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
