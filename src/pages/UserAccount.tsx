import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  User,
  MapPin,
  Package,
  Heart,
  Bell,
  Shield,
  Edit,
  LogOut,
  Phone,
  Mail,
  Calendar,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Settings,
  Plus,
  ShoppingBag,
  ShoppingCart,
  History,
  Bookmark,
  UserCircle,
  Percent
} from "lucide-react";
import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { getImageUrl } from "@/config/api";
import { playClickSound } from "@/utils/sounds";
import ErrorHandler from "@/utils/errorHandler";


const ProfileCard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { data, refetch } = useQuery({ 
    queryKey: ["auth", "me"], 
    queryFn: api.auth.me,
    onError: (error) => {
      ErrorHandler.showError(error, toast);
    }
  });
  const user = data?.user;
  const [profile, setProfile] = useState<any>({});

  React.useEffect(() => {
    if (user) {
      setProfile({
        name: user.name ?? "",
        familyName: user.family_name ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        birthDate: user.birth_date ?? "",
        joinDate: user.created_at ?? new Date().toISOString(),
      });
    }
  }, [user]);

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {profile.name ? profile.name.split(' ').map((n: string) => n[0]).join('') : 'U'}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-right">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{profile.name || 'المستخدم'}</h2>
              <p className="text-gray-600 mb-3">عضو منذ {profile.joinDate ? new Date(profile.joinDate).toLocaleDateString('ar-SA') : 'غير محدد'}</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Badge className="bg-green-100 text-green-800 px-3 py-1">عضو مميز</Badge>
                <Badge className="bg-blue-100 text-blue-800 px-3 py-1">متحقق</Badge>
              </div>
            </div>
            <Button
              variant={isEditing ? "default" : "outline"}
              size="lg"
              onClick={async () => {
                if (isEditing) {
                  try {
                    await api.auth.updateProfile({ 
                      name: profile.name || '', 
                      family_name: profile.familyName || '', 
                      email: profile.email || '', 
                      phone: profile.phone || '', 
                      birth_date: profile.birthDate || '' 
                    });
                    await refetch();
                    toast.success('تم تحديث الملف الشخصي بنجاح!');
                  } catch (error) {
                    ErrorHandler.showError(error, toast);
                  }
                }
                setIsEditing(!isEditing);
              }}
              className="min-w-[120px]"
            >
              <Edit className="h-4 w-4 ml-2" />
              {isEditing ? "حفظ التغييرات" : "تعديل الملف"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            تفاصيل الملف الشخصي
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">الاسم الأول</label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="h-5 w-5 text-gray-400" />
                  {isEditing ? (
                    <Input 
                      value={profile.name || ''} 
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="border-0 bg-transparent focus:ring-0"
                    />
                  ) : (
                    <span className="text-gray-900">{profile.name || 'غير محدد'}</span>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">اسم العائلة</label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="h-5 w-5 text-gray-400" />
                  {isEditing ? (
                    <Input 
                      value={profile.familyName || ''} 
                      onChange={(e) => setProfile({...profile, familyName: e.target.value})}
                      className="border-0 bg-transparent focus:ring-0"
                    />
                  ) : (
                    <span className="text-gray-900">{profile.familyName || 'غير محدد'}</span>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-400" />
                  {isEditing ? (
                    <Input 
                      type="email"
                      value={profile.email || ''} 
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      className="border-0 bg-transparent focus:ring-0"
                    />
                  ) : (
                    <span className="text-gray-900">{profile.email || 'غير محدد'}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">رقم الهاتف</label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-400" />
                  {isEditing ? (
                    <Input 
                      value={profile.phone || ''} 
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      className="border-0 bg-transparent focus:ring-0"
                    />
                  ) : (
                    <span className="text-gray-900">{profile.phone || 'غير محدد'}</span>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">تاريخ الميلاد</label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  {isEditing ? (
                    <Input 
                      type="date" 
                      value={profile.birthDate || ''} 
                      onChange={(e) => setProfile({...profile, birthDate: e.target.value})}
                      className="border-0 bg-transparent focus:ring-0"
                    />
                  ) : (
                    <span className="text-gray-900">{profile.birthDate ? new Date(profile.birthDate).toLocaleDateString('ar-SA') : 'غير محدد'}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AddressesCard = () => {
  const { data, refetch, isLoading } = useQuery({ 
    queryKey: ["addresses"], 
    queryFn: api.addresses.list,
    onError: (error) => {
      ErrorHandler.showError(error, toast);
    }
  });
  const addresses = data?.data ?? [];
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    title: "",
    address: "",
    city_id: "",
    governorate_id: "",
    phone: ""
  });

  // Load governorates and cities
  const { data: governoratesData } = useQuery({
    queryKey: ["governorates"],
    queryFn: api.governorates,
  });
  
  const { data: citiesData, refetch: refetchCities } = useQuery({
    queryKey: ["cities", newAddress.governorate_id],
    queryFn: () => api.cities(newAddress.governorate_id ? Number(newAddress.governorate_id) : undefined),
    enabled: !!newAddress.governorate_id,
  });

  const governorates = governoratesData?.data ?? [];
  const cities = citiesData?.data ?? [];

  const add = async () => {
    if (!newAddress.title || !newAddress.address || !newAddress.city_id || !newAddress.governorate_id) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    
    // Get selected city and governorate names
    const selectedGovernorate = governorates.find(g => g.id.toString() === newAddress.governorate_id);
    const selectedCity = cities.find(c => c.id.toString() === newAddress.city_id);
    
    if (!selectedGovernorate || !selectedCity) {
      toast.error('حدث خطأ في تحديد المدينة أو المحافظة');
      return;
    }
    
    try {
      await api.addresses.create({ 
        label: newAddress.title,
        address: newAddress.address,
        city: selectedCity.name_ar,
        governorate: selectedGovernorate.name_ar,
        phone: newAddress.phone,
        is_default: addresses.length === 0 
      });
      setNewAddress({ title: "", address: "", city_id: "", governorate_id: "", phone: "" });
      setShowAddForm(false);
      refetch();
      toast.success('تم إضافة العنوان بنجاح!');
    } catch (error) {
      ErrorHandler.showError(error, toast);
    }
  };

  const del = async (id: number) => { 
    try {
      await api.addresses.remove(id); 
      refetch();
      toast.success('تم حذف العنوان بنجاح!');
    } catch (error) {
      ErrorHandler.showError(error, toast);
    }
  };
  const setDefault = async (id: number) => { 
    try {
      await api.addresses.setDefault(id); 
      refetch();
      toast.success('تم تعيين العنوان كافتراضي!');
    } catch (error) {
      ErrorHandler.showError(error, toast);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              عناوين التوصيل
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="h-4 w-4 ml-2" />
              {showAddForm ? 'إخفاء النموذج' : 'إضافة عنوان جديد'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Add Address Form */}
          {showAddForm && (
            <Card className="mb-6 border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">إضافة عنوان جديد</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">عنوان العنوان</label>
                    <Input
                      placeholder="مثال: المنزل، العمل"
                      value={newAddress.title}
                      onChange={(e) => setNewAddress({...newAddress, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">رقم الهاتف (اختياري)</label>
                    <Input
                      placeholder="رقم الهاتف"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">العنوان التفصيلي</label>
                  <Input
                    placeholder="العنوان التفصيلي"
                    value={newAddress.address}
                    onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">المحافظة *</label>
                    <Select
                      value={newAddress.governorate_id}
                      onValueChange={(value) => {
                        setNewAddress({...newAddress, governorate_id: value, city_id: ""});
                        if (value) {
                          refetchCities();
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المحافظة" />
                      </SelectTrigger>
                      <SelectContent>
                        {governorates.map((gov) => (
                          <SelectItem key={gov.id} value={gov.id.toString()}>
                            {gov.name_ar}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">المدينة *</label>
                    <Select
                      value={newAddress.city_id}
                      onValueChange={(value) => setNewAddress({...newAddress, city_id: value})}
                      disabled={!newAddress.governorate_id}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={newAddress.governorate_id ? "اختر المدينة" : "اختر المحافظة أولاً"} />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.id} value={city.id.toString()}>
                            {city.name_ar}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={add} className="flex-1">
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة العنوان
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowAddForm(false);
                      setNewAddress({ title: "", address: "", city_id: "", governorate_id: "", phone: "" });
                    }}
                  >
                    إلغاء
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-8 bg-gray-200 rounded w-20"></div>
                        <div className="h-8 bg-gray-200 rounded w-12"></div>
                      </div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : addresses.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد عناوين محفوظة</h3>
              <p className="text-gray-600 mb-6">أضف عنوانك الأول لتسهيل عملية التوصيل</p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 ml-2" />
                إضافة عنوان جديد
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {addresses.map((address: any) => (
                  <div key={address.id} className={`border rounded-lg p-6 hover:shadow-md transition-shadow ${address.is_default ? 'border-primary bg-primary/5' : ''}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${address.is_default ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{address.title}</h3>
                          {address.is_default && (
                            <Badge className="bg-primary text-white mt-1">الافتراضي</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!address.is_default && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setDefault(address.id)}
                            className="text-xs"
                          >
                            تعيين افتراضي
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:bg-red-50" 
                          onClick={() => del(address.id)}
                        >
                          حذف
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-gray-700 font-medium">{address.address}</p>
                      <p className="text-gray-600">{address.city} - {address.governorate}</p>
                      {address.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Phone className="h-4 w-4" />
                          {address.phone}
                        </div>
                      )}
                    </div>
                    
                    {address.is_default && (
                      <div className="mt-4 pt-4 border-t border-primary/20">
                        <div className="flex items-center gap-2 text-primary text-sm">
                          <CheckCircle className="h-4 w-4" />
                          <span>هذا العنوان سيتم استخدامه افتراضياً للطلبات</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const OrderHistoryCard = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({ 
    queryKey: ["orders", "recent"], 
    queryFn: api.orders.recent,
    onError: (error) => {
      ErrorHandler.showError(error, toast);
    }
  });
  const orders = data?.orders ?? [];

  const getStatusBadge = (status: string, label: string) => {
    const statusConfig: Record<string, string> = {
      delivered: "bg-green-100 text-green-800 border-green-200",
      shipped: "bg-blue-100 text-blue-800 border-blue-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      confirmed: "bg-blue-100 text-blue-800 border-blue-200",
      preparing: "bg-blue-100 text-blue-800 border-blue-200",
      ready: "bg-blue-100 text-blue-800 border-blue-200",
    };
    const cls = statusConfig[status] ?? "bg-gray-100 text-gray-800 border-gray-200";
    return <Badge className={`${cls} border`}>{label}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "shipped":
      case "ready":
        return <Truck className="h-5 w-5 text-blue-600" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "pending":
      case "confirmed":
      case "preparing":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "border-l-green-500";
      case "shipped":
      case "ready":
        return "border-l-blue-500";
      case "cancelled":
        return "border-l-red-500";
      case "pending":
      case "confirmed":
      case "preparing":
        return "border-l-yellow-500";
      default:
        return "border-l-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              تاريخ الطلبات
            </CardTitle>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{orders.length} طلب</span>
              <Button variant="outline" size="sm">
                عرض الكل
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد طلبات بعد</h3>
              <p className="text-gray-600 mb-6">ابدأ التسوق وستظهر طلباتك هنا</p>
              <Button asChild>
                <Link to="/categories">بدء التسوق</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className={`border rounded-lg p-6 border-l-4 ${getStatusColor(order.status)} hover:shadow-md transition-shadow`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(order.status)}
                      <div>
                        <h3 className="font-semibold text-lg">{order.order_number}</h3>
                        <p className="text-sm text-gray-600">
                          {order.created_at ? new Date(order.created_at).toLocaleDateString('ar-SA') : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(order.status, order.status_label)}
                      <p className="text-lg font-bold text-gray-900 mt-1">{order.total} دينار</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Package className="h-4 w-4" />
                        {order.items_count ?? 0} منتج
                      </span>
                      <span className="flex items-center gap-1">
                        <Truck className="h-4 w-4" />
                        توصيل مجاني
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/order/${order.id}`)}
                      >
                        تفاصيل الطلب
                      </Button>
                      {order.status === 'delivered' && (
                        <Button variant="outline" size="sm">
                          إعادة الطلب
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const WishlistCard = () => {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ 
    queryKey: ["wishlist"], 
    queryFn: api.wishlist.list,
    onError: (error) => {
      ErrorHandler.showError(error, toast);
    }
  });
  const items = data?.items ?? [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              قائمة الأمنيات
            </CardTitle>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{items.length} منتج</span>
              <Button variant="outline" size="sm">
                إدارة القائمة
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center gap-4 border rounded-lg p-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="h-8 bg-gray-200 rounded w-20"></div>
                      <div className="h-8 bg-gray-200 rounded w-8"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">قائمة الأمنيات فارغة</h3>
              <p className="text-gray-600 mb-6">أضف المنتجات التي تعجبك إلى قائمة الأمنيات</p>
              <Button asChild>
                <Link to="/categories">تصفح المنتجات</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="relative">
                    <div
                      className="w-20 h-20 bg-cover bg-center rounded-lg"
                      style={{ backgroundImage: `url(${getImageUrl(item.image)})` }}
                    >
                      {!item.image && (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                          <ShoppingBag className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <Heart className="h-3 w-3 text-white fill-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-1">{item.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">منتج عالي الجودة</p>
                    <p className="text-lg font-bold text-green-600">{item.price} دينار</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button 
                      size="sm" 
                      onClick={async () => { 
                        // Play click sound
                        playClickSound();
                        
                        try {
                          await api.cart.add(item.id, 1); 
                          qc.invalidateQueries({ queryKey: ["cart", "count"] });
                          qc.invalidateQueries({ queryKey: ["cart"] });
                          toast.success('تم إضافة المنتج إلى السلة بنجاح! 🛒', {
                            description: item.name,
                            duration: 5000,
                            className: 'toast-success',
                          });
                        } catch (error) {
                          ErrorHandler.showError(error, toast);
                        }
                      }}
                      className="min-w-[100px]"
                    >
                      <ShoppingCart className="h-4 w-4 ml-1" />
                      إضافة للسلة
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600 hover:bg-red-50" 
                      onClick={async () => { 
                        try {
                          await api.wishlist.remove(item.id); 
                          qc.invalidateQueries({ queryKey: ["wishlist"] });
                          toast.success('تم إزالة المنتج من قائمة الأمنيات');
                        } catch (error) {
                          ErrorHandler.showError(error, toast);
                        }
                      }}
                    >
                      <Heart className="h-4 w-4 ml-1" />
                      إزالة
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const PasswordChangeCard = () => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    password: '',
    password_confirmation: ''
  });
  const [isChanging, setIsChanging] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.password !== passwordData.password_confirmation) {
      toast.error('كلمة المرور الجديدة وتأكيدها غير متطابقين');
      return;
    }

    if (passwordData.password.length < 8) {
      toast.error('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      return;
    }

    setIsChanging(true);
    try {
      await api.auth.changePassword(passwordData);
      toast.success('تم تغيير كلمة المرور بنجاح!');
      setPasswordData({ current_password: '', password: '', password_confirmation: '' });
      setShowPasswordForm(false);
    } catch (error: any) {
      ErrorHandler.showError(error, toast);
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          تغيير كلمة المرور
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!showPasswordForm ? (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="font-medium text-blue-900">حماية حسابك</h4>
                  <p className="text-sm text-blue-700">تأكد من استخدام كلمة مرور قوية لحماية حسابك</p>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => setShowPasswordForm(true)}
              className="w-full"
            >
              <Shield className="h-4 w-4 ml-2" />
              تغيير كلمة المرور
            </Button>
          </div>
        ) : (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">كلمة المرور الحالية</label>
              <Input
                type="password"
                value={passwordData.current_password}
                onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                placeholder="أدخل كلمة المرور الحالية"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">كلمة المرور الجديدة</label>
              <Input
                type="password"
                value={passwordData.password}
                onChange={(e) => setPasswordData({...passwordData, password: e.target.value})}
                placeholder="أدخل كلمة المرور الجديدة"
                required
                minLength={8}
              />
              <p className="text-xs text-gray-500">يجب أن تكون 8 أحرف على الأقل</p>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">تأكيد كلمة المرور الجديدة</label>
              <Input
                type="password"
                value={passwordData.password_confirmation}
                onChange={(e) => setPasswordData({...passwordData, password_confirmation: e.target.value})}
                placeholder="أعد إدخال كلمة المرور الجديدة"
                required
                minLength={8}
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                type="submit" 
                disabled={isChanging}
                className="flex-1"
              >
                {isChanging ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
              </Button>
              <Button 
                type="button"
                variant="outline"
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswordData({ current_password: '', password: '', password_confirmation: '' });
                }}
              >
                إلغاء
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

const AccountSettingsCard = () => {
  const { data, refetch } = useQuery({ 
    queryKey: ["notification-settings"], 
    queryFn: api.notificationSettings.get,
    onError: (error) => {
      ErrorHandler.showError(error, toast);
    }
  });
  
  const [settings, setSettings] = useState({
    email_notifications: true,
    sms_notifications: false,
    order_updates: true,
    promotions: true,
    newsletter: false
  });

  React.useEffect(() => {
    if (data?.settings) {
      setSettings({
        email_notifications: data.settings.email_notifications ?? true,
        sms_notifications: data.settings.sms_notifications ?? false,
        order_updates: data.settings.order_updates ?? true,
        promotions: data.settings.promotions ?? true,
        newsletter: data.settings.newsletter ?? false
      });
    }
  }, [data]);

  const handleSettingChange = async (key: string, value: boolean) => {
    const oldSettings = {...settings};
    const newSettings = {...settings, [key]: value};
    setSettings(newSettings);
    
    try {
      await api.notificationSettings.update(newSettings);
      toast.success('تم حفظ الإعدادات بنجاح!');
      refetch();
    } catch (error) {
      // Revert on error
      setSettings(oldSettings);
      ErrorHandler.showError(error, toast);
    }
  };

  return (
    <div className="space-y-6">
      {/* Notifications Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            إعدادات الإشعارات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-600" />
                <div>
                  <h4 className="font-medium">إشعارات البريد الإلكتروني</h4>
                  <p className="text-sm text-gray-600">تلقي تحديثات الطلبات والعروض عبر البريد الإلكتروني</p>
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={settings.email_notifications ?? false}
                onChange={(e) => handleSettingChange('email_notifications', e.target.checked)}
                className="w-5 h-5 text-primary rounded focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-600" />
                <div>
                  <h4 className="font-medium">إشعارات الرسائل النصية</h4>
                  <p className="text-sm text-gray-600">تلقي تحديثات مهمة عبر الرسائل النصية</p>
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={settings.sms_notifications ?? false}
                onChange={(e) => handleSettingChange('sms_notifications', e.target.checked)}
                className="w-5 h-5 text-primary rounded focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-gray-600" />
                <div>
                  <h4 className="font-medium">تحديثات الطلبات</h4>
                  <p className="text-sm text-gray-600">تلقي إشعارات حول حالة طلباتك</p>
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={settings.order_updates ?? false}
                onChange={(e) => handleSettingChange('order_updates', e.target.checked)}
                className="w-5 h-5 text-primary rounded focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Percent className="h-5 w-5 text-gray-600" />
                <div>
                  <h4 className="font-medium">العروض والخصومات</h4>
                  <p className="text-sm text-gray-600">تلقي إشعارات حول العروض الخاصة والخصومات</p>
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={settings.promotions ?? false}
                onChange={(e) => handleSettingChange('promotions', e.target.checked)}
                className="w-5 h-5 text-primary rounded focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Bookmark className="h-5 w-5 text-gray-600" />
                <div>
                  <h4 className="font-medium">النشرة الإخبارية</h4>
                  <p className="text-sm text-gray-600">تلقي آخر الأخبار والتحديثات من المتجر</p>
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={settings.newsletter ?? false}
                onChange={(e) => handleSettingChange('newsletter', e.target.checked)}
                className="w-5 h-5 text-primary rounded focus:ring-primary"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password Change */}
      <PasswordChangeCard />
      
      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            إعدادات الأمان الإضافية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button variant="outline" size="lg" className="w-full justify-start h-14">
              <Phone className="h-5 w-5 ml-3" />
              <div className="text-right">
                <div className="font-medium">التحقق الثنائي</div>
                <div className="text-sm text-gray-600">إضافة طبقة حماية إضافية لحسابك</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <LogOut className="h-5 w-5" />
            إجراءات الحساب
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            size="lg"
            className="w-full justify-start h-14 text-red-600 border-red-200 hover:bg-red-50"
            onClick={async () => {
              if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
                try { 
                  await api.auth.logout(); 
                  toast.success('تم تسجيل الخروج بنجاح!');
                } catch (error) {
                  ErrorHandler.showError(error, toast);
                } finally { 
                  window.location.href = "/login"; 
                }
              }
            }}
          >
            <LogOut className="h-5 w-5 ml-3" />
            <div className="text-right">
              <div className="font-medium">تسجيل الخروج</div>
              <div className="text-sm text-gray-600">تسجيل الخروج من حسابك</div>
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default function UserAccount() {
  const nav = useNavigate();
  const { data: meData, isLoading: meLoading, isError: meError } = useQuery({ 
    queryKey: ["auth", "me"], 
    queryFn: api.auth.me, 
    retry: false,
    onError: (error) => {
      ErrorHandler.showError(error, toast);
    }
  });
  React.useEffect(() => {
    if (!meLoading && (meError || !meData?.user)) nav("/login");
  }, [meLoading, meError, meData, nav]);

  if (meLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">حسابي</h1>
          <p className="text-gray-600">إدارة معلوماتك الشخصية وإعدادات الحساب</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8 h-auto p-1 bg-white shadow-sm">
            <TabsTrigger 
              value="profile" 
              className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-200"
            >
              <UserCircle className="h-5 w-5" />
              <span className="text-sm font-medium">الملف الشخصي</span>
            </TabsTrigger>
            <TabsTrigger 
              value="orders" 
              className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-200"
            >
              <History className="h-5 w-5" />
              <span className="text-sm font-medium">الطلبات</span>
            </TabsTrigger>
            <TabsTrigger 
              value="addresses" 
              className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-200"
            >
              <MapPin className="h-5 w-5" />
              <span className="text-sm font-medium">العناوين</span>
            </TabsTrigger>
            <TabsTrigger 
              value="wishlist" 
              className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-200"
            >
              <Heart className="h-5 w-5" />
              <span className="text-sm font-medium">المفضلة</span>
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-200"
            >
              <Settings className="h-5 w-5" />
              <span className="text-sm font-medium">الإعدادات</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <ProfileCard />
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <OrderHistoryCard />
          </TabsContent>

          <TabsContent value="addresses" className="space-y-6">
            <AddressesCard />
          </TabsContent>

          <TabsContent value="wishlist" className="space-y-6">
            <WishlistCard />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <AccountSettingsCard />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
