import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  MapPin,
  CreditCard,
  Shield,
  ArrowLeft,
  Package,
  CheckCircle,
  Edit,
  Wallet,
  Plus,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "sonner";

const CheckoutProgress = () => {
  const steps = [
    { id: 1, name: "السلة", completed: true },
    { id: 2, name: "الدفع", completed: false, current: true },
    { id: 3, name: "التأكيد", completed: false },
  ];

  return (
    <div className="py-6 border-b bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.completed
                      ? "bg-green-500 text-white"
                      : step.current
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step.completed ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={`mr-3 text-sm font-medium ${
                    step.current || step.completed
                      ? "text-gray-900"
                      : "text-gray-500"
                  }`}
                >
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-0.5 mx-4 ${
                    step.completed ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CustomerInfo = ({
  name,
  setName,
  familyName,
  setFamilyName,
  email,
  setEmail,
  phone,
  setPhone,
  userLoading,
}: {
  name: string;
  setName: (v: string) => void;
  familyName: string;
  setFamilyName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  userLoading: boolean;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          معلومات العميل
          {userLoading ? (
            <div className="flex items-center text-sm text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              جاري تحميل البيانات...
            </div>
          ) : (
            <div className="flex items-center text-sm text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              تم تحميل البيانات تلقائياً
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">الاسم الأول</Label>
            <Input
              id="firstName"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">اسم العائلة</Label>
            <Input
              id="lastName"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">رقم الهاتف</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const AddAddressModal = ({ 
  isOpen, 
  onClose, 
  onSuccess 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSuccess: () => void;
}) => {
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    city: "",
    governorate: "",
    phone: "",
    is_default: false,
  });

  const addAddressMutation = useMutation({
    mutationFn: (data: any) => api.addresses.create({ 
      label: data.title, 
      address: data.address, 
      city: data.city, 
      governorate: data.governorate, 
      phone: data.phone, 
      is_default: data.is_default 
    }),
    onSuccess: () => {
      toast.success("تم إضافة العنوان بنجاح");
      onSuccess();
      onClose();
      setFormData({
        title: "",
        address: "",
        city: "",
        governorate: "",
        phone: "",
        is_default: false,
      });
    },
    onError: (error: any) => {
      toast.error("فشل في إضافة العنوان: " + (error.message || "خطأ غير معروف"));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAddressMutation.mutate(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4">إضافة عنوان جديد</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">عنوان العنوان (مثل: المنزل، العمل)</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="address">العنوان التفصيلي</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">المدينة</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="governorate">المحافظة</Label>
              <Input
                id="governorate"
                value={formData.governorate}
                onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="phone">رقم الهاتف</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox
              id="is_default"
              checked={formData.is_default}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, is_default: checked as boolean })
              }
            />
            <Label htmlFor="is_default">تعيين كعنوان افتراضي</Label>
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={addAddressMutation.isPending} className="flex-1">
              {addAddressMutation.isPending ? "جاري الإضافة..." : "إضافة العنوان"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              إلغاء
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeliveryAddress = ({
  selectedId,
  onSelect,
  notes,
  setNotes,
  addresses,
  addressesLoading,
  onAddAddress,
}: {
  selectedId: string;
  onSelect: (v: {
    id: string;
    address: string;
    city: string;
    governorate: string;
  }) => void;
  notes: string;
  setNotes: (v: string) => void;
  addresses: any[];
  addressesLoading: boolean;
  onAddAddress: () => void;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>عنوان التوصيل</CardTitle>
        <CardDescription>اختر عنوان التوصيل أو أضف عنوان جديد</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {addressesLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="mr-2">جاري تحميل العناوين...</span>
          </div>
        ) : addresses.length > 0 ? (
          addresses.map((address) => (
            <div
              key={address.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedId === address.id.toString()
                  ? "border-primary bg-primary/5"
                  : "border-gray-200"
              }`}
              onClick={() =>
                onSelect({
                  id: address.id.toString(),
                  address: address.address,
                  city: address.city,
                  governorate: address.governorate,
                })
              }
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-4 h-4 rounded-full border-2 mt-1 ${
                      selectedId === address.id.toString()
                        ? "border-primary bg-primary"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedId === address.id.toString() && (
                      <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{address.title}</h4>
                      {address.is_default && (
                        <Badge variant="outline" className="text-xs">
                          افتراضي
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {address.address}
                    </p>
                    <p className="text-sm text-gray-600">
                      {address.city} - {address.governorate}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>لا توجد عناوين محفوظة</p>
            <p className="text-sm">أضف عنوان جديد للمتابعة</p>
          </div>
        )}

        <Button variant="outline" className="w-full" onClick={onAddAddress}>
          <Plus className="h-4 w-4 ml-2" />
          إضافة عنوان جديد
        </Button>

        <div className="border-t pt-4">
          <Label htmlFor="notes">ملاحظات التوصيل (اختياري)</Label>
          <Textarea
            id="notes"
            placeholder="مثال: الطابق الثاني، جانب المصعد"
            className="mt-2"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};


const PaymentMethods = ({
  selected,
  setSelected,
}: {
  selected: string;
  setSelected: (v: string) => void;
}) => {
  const paymentMethods = [
    {
      id: "card",
      name: "بطاقة ائتمان/مدى",
      icon: CreditCard,
      description: "فيزا، ماستركارد، مدى",
    },
    {
      id: "cod",
      name: "الدفع عند الاستلام",
      icon: Package,
      description: "نقداً أو بطاقة عند التوصيل",
    },
    {
      id: "wallet",
      name: "المحفظة الإلكترونية",
      icon: Wallet,
      description: "STC Pay، أبل باي، سامسونج باي",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>طريقة الدفع</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              selected === method.id
                ? "border-primary bg-primary/5"
                : "border-gray-200"
            }`}
            onClick={() => setSelected(method.id)}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full border-2 ${
                  selected === method.id
                    ? "border-primary bg-primary"
                    : "border-gray-300"
                }`}
              >
                {selected === method.id && (
                  <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                )}
              </div>
              <method.icon className="h-5 w-5 text-gray-600" />
              <div>
                <div className="font-medium">{method.name}</div>
                <div className="text-sm text-gray-600">
                  {method.description}
                </div>
              </div>
            </div>
          </div>
        ))}

        {selected === "card" && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="cardNumber">رقم البطاقة</Label>
                <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
              </div>
              <div>
                <Label htmlFor="expiry">تاريخ الانتهاء</Label>
                <Input id="expiry" placeholder="MM/YY" />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" placeholder="123" />
              </div>
              <div className="col-span-2">
                <Label htmlFor="cardName">اسم حامل البطاقة</Label>
                <Input id="cardName" placeholder="كما هو مكتوب على البطاقة" />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const OrderSummary = ({
  onConfirm,
  termsAccepted,
  setTermsAccepted,
}: {
  onConfirm: () => void;
  termsAccepted: boolean;
  setTermsAccepted: (v: boolean) => void;
}) => {
  const { data } = useQuery({ queryKey: ["cart"], queryFn: api.cart.get });
  const cartItems = data?.items ?? [];
  const totals =
    data?.totals ??
    ({ subtotal: 0, savings: 0, delivery_fee: 0, tax: 0, total: 0 } as any);

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>ملخص الطلب</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-gray-600">الكمية: {item.quantity}</div>
              </div>
              <div className="text-right">
                <div>{(item.price * item.quantity).toFixed(1)} دينار</div>
                {item.original_price && item.original_price > item.price && (
                  <div className="text-xs text-gray-500 line-through">
                    {(item.original_price * item.quantity).toFixed(1)} دينار
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span>المجموع الفرعي</span>
            <span>{totals.subtotal?.toFixed(1)} دينار</span>
          </div>

          {totals.savings > 0 && (
            <div className="flex justify-between text-green-600">
              <span>التوفير</span>
              <span>-{totals.savings?.toFixed(1)} دينار</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>رسوم التوصيل</span>
            <span>
              {totals.delivery_fee === 0
                ? "مجاني"
                : `${totals.delivery_fee?.toFixed(1)} دينار`}
            </span>
          </div>

          <div className="flex justify-between">
            <span>ضريبة القيمة المضافة (15%)</span>
            <span>{totals.tax?.toFixed(1)} دينار</span>
          </div>

          <div className="border-t pt-2">
            <div className="flex justify-between text-lg font-bold">
              <span>المجموع الكلي</span>
              <span>{totals.total?.toFixed(1)} دينار</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-4">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) =>
                setTermsAccepted(checked as boolean)
              }
            />
            <Label htmlFor="terms" className="text-sm">
              أوافق على{" "}
              <Link to="/terms" className="text-primary hover:underline">
                الشروط والأحكام
              </Link>
            </Label>
          </div>

          <Button
            size="lg"
            className="w-full"
            onClick={onConfirm}
            disabled={!termsAccepted}
          >
            <Shield className="h-4 w-4 ml-2" />
            تأكيد الطلب والدفع
          </Button>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Shield className="h-4 w-4 text-green-600" />
            <span>دفع آمن ومحمي بتشفير SSL</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Checkout() {
  const navigate = useNavigate();

  // التحقق من تسجيل الدخول
  const {
    data: authData,
    isLoading: authLoading,
    isError: authError,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: api.auth.me,
    retry: false,
  });

  // جلب عناوين المستخدم
  const {
    data: addressesData,
    isLoading: addressesLoading,
    refetch: refetchAddresses,
  } = useQuery({
    queryKey: ["addresses"],
    queryFn: api.addresses.list,
    enabled: !!authData?.user,
  });

  const [name, setName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [addressId, setAddressId] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryCity, setDeliveryCity] = useState("");
  const [deliveryGovernorate, setDeliveryGovernorate] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);

  // ملء بيانات المستخدم تلقائياً
  useEffect(() => {
    if (authData?.user) {
      setName(authData.user.name || "");
      setFamilyName(authData.user.family_name || "");
      setEmail(authData.user.email || "");
      setPhone(authData.user.phone || "");
    }
  }, [authData]);

  // تعيين العنوان الافتراضي
  useEffect(() => {
    if (addressesData?.data && addressesData.data.length > 0) {
      const defaultAddress = addressesData.data.find(addr => addr.is_default) || addressesData.data[0];
      if (defaultAddress) {
        setAddressId(defaultAddress.id.toString());
        setDeliveryAddress(defaultAddress.address);
        setDeliveryCity(defaultAddress.city);
        setDeliveryGovernorate(defaultAddress.governorate);
      }
    }
  }, [addressesData]);

  // توجيه المستخدم لتسجيل الدخول إذا لم يكن مسجلاً
  useEffect(() => {
    if (!authLoading && (authError || !authData?.user)) {
      navigate("/login");
    }
  }, [authLoading, authError, authData, navigate]);

  const onConfirm = async () => {
    // التحقق من معلومات العميل
    if (!name || !familyName || !email || !phone) {
      toast.error("يرجى ملء جميع بيانات العميل", {
        description: "الاسم الأول واسم العائلة والبريد الإلكتروني ورقم الهاتف مطلوبة",
        duration: 5000,
      });
      return;
    }

    // التحقق من العنوان
    if (!deliveryAddress || !deliveryCity || !deliveryGovernorate) {
      toast.error("يرجى اختيار عنوان التوصيل", {
        description: "العنوان والمدينة والمحافظة مطلوبة",
        duration: 5000,
      });
      return;
    }

    // التحقق من الموافقة على الشروط والأحكام
    if (!termsAccepted) {
      toast.error("يجب الموافقة على الشروط والأحكام", {
        description: "يرجى قراءة والموافقة على الشروط والأحكام للمتابعة",
        duration: 5000,
      });
      return;
    }

    const delivery_type = "immediate";
    const payment_method =
      paymentMethod === "cod"
        ? "cash"
        : paymentMethod === "wallet"
        ? "wallet"
        : "card";
    const payload = {
      name: `${name} ${familyName}`.trim(),
      email,
      phone,
      delivery_address: deliveryAddress,
      delivery_city: deliveryCity,
      delivery_governorate: deliveryGovernorate,
      delivery_notes: deliveryNotes || undefined,
      delivery_type,
      requested_delivery_at: undefined,
      payment_method,
      notes: undefined,
    } as const;

    try {
      const res = await api.checkout(payload);
      if (res.success && res.orders) {
        console.log("✅ Checkout successful, orders:", res.orders);
        const orderNumbers = res.orders
          .map((o: any) => o.order_number)
          .join(",");
        console.log(
          "🔗 Redirecting to order confirmation with orders:",
          orderNumbers
        );
        navigate(`/order-confirmation?orders=${orderNumbers}`);
      }
    } catch (error) {
      console.error("❌ Checkout error:", error);
      toast.error("حدث خطأ في إتمام الطلب", {
        description: "يرجى المحاولة مرة أخرى",
        duration: 5000,
      });
    }
  };

  const handleAddressSelect = (address: {
    id: string;
    address: string;
    city: string;
    governorate: string;
  }) => {
    setAddressId(address.id);
    setDeliveryAddress(address.address);
    setDeliveryCity(address.city);
    setDeliveryGovernorate(address.governorate);
  };

  const handleAddAddressSuccess = () => {
    refetchAddresses();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CheckoutProgress />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link to="/cart">
              <ArrowLeft className="h-4 w-4 ml-2" />
              العودة للسلة
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">إتمام الطلب</h1>
          <p className="text-gray-600">
            املأ البيانات المطلوبة لإتمام عملية الشراء
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <CustomerInfo
              name={name}
              setName={setName}
              familyName={familyName}
              setFamilyName={setFamilyName}
              email={email}
              setEmail={setEmail}
              phone={phone}
              setPhone={setPhone}
              userLoading={authLoading}
            />
            <DeliveryAddress
              selectedId={addressId}
              onSelect={handleAddressSelect}
              notes={deliveryNotes}
              setNotes={setDeliveryNotes}
              addresses={addressesData?.data || []}
              addressesLoading={addressesLoading}
              onAddAddress={() => setShowAddAddressModal(true)}
            />
            <PaymentMethods
              selected={paymentMethod}
              setSelected={setPaymentMethod}
            />
          </div>

          <div>
            <OrderSummary
              onConfirm={onConfirm}
              termsAccepted={termsAccepted}
              setTermsAccepted={setTermsAccepted}
            />
          </div>
        </div>
      </main>

      <AddAddressModal
        isOpen={showAddAddressModal}
        onClose={() => setShowAddAddressModal(false)}
        onSuccess={handleAddAddressSuccess}
      />
    </div>
  );
}