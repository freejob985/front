import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Store,
  BarChart3,
  ShoppingBag,
  Users,
  Settings,
  Package,
  DollarSign,
  CheckCircle
} from "lucide-react";

const Header = () => (
  <header className="bg-white shadow-sm border-b">
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img 
            src="https://cdn.builder.io/api/v1/image/assets%2Ffed240d3cc2b421da3511c77b247579c%2F117059de60a149a98d347c3289677bd1?format=webp&width=800" 
            alt="Elite1 Logo" 
            className="h-10 w-auto"
          />
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/vendor/login">
            <Button variant="outline">دخول المتاجر</Button>
          </Link>
          <Link to="/vendor/signup">
            <Button>
              <Store className="h-4 w-4 ml-2" />
              انضم كمتجر
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </header>
);

const Stats = () => {
  const stats = [
    { title: "إجمالي المبيعات (30 يوماً)", value: "15,690 دينار", icon: DollarSign, color: "text-green-600" },
    { title: "الطلبات النشطة", value: "24", icon: Package, color: "text-blue-600" },
    { title: "المنتجات المنشورة", value: "152", icon: ShoppingBag, color: "text-purple-600" },
    { title: "العملاء", value: "1,247", icon: Users, color: "text-orange-600" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">{s.title}</div>
                <div className="text-2xl font-bold mt-1">{s.value}</div>
              </div>
              <s.icon className={`h-8 w-8 ${s.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const RecentOrders = () => {
  const rows = [
    { id: "ORD-2024-1201", customer: "أحمد محمد", items: 5, total: 42.5, status: "تم التسليم" },
    { id: "ORD-2024-1200", customer: "سارة أحمد", items: 3, total: 28.0, status: "قيد التوصيل" },
    { id: "ORD-2024-1199", customer: "محمد علي", items: 2, total: 16.8, status: "تم التأكيد" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          آخر الطلبات
          <Badge variant="outline">3 طلبات</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>رقم الطلب</TableHead>
              <TableHead>العميل</TableHead>
              <TableHead>عدد المنتجات</TableHead>
              <TableHead>الإجمالي</TableHead>
              <TableHead>الحالة</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.id}</TableCell>
                <TableCell>{r.customer}</TableCell>
                <TableCell>{r.items}</TableCell>
                <TableCell>{r.total.toFixed(2)} دينار</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    {r.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const FeatureCards = () => {
  const features = [
    { icon: BarChart3, title: "تقارير ومؤشرات", desc: "إحصائيات فورية لأداء المبيعات" },
    { icon: ShoppingBag, title: "إدارة المنتجات", desc: "أضف وحدّث منتجاتك بسهولة" },
    { icon: Settings, title: "إعدادات الدفع والشحن", desc: "تحكم كامل في طرق الدفع ورسوم التوصيل" },
  ];
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {features.map((f, i) => (
        <Card key={i}>
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <f.icon className="h-6 w-6 text-primary" />
              <div>
                <div className="font-semibold mb-1">{f.title}</div>
                <div className="text-sm text-gray-600">{f.desc}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default function VendorDemo() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Badge className="bg-primary/10 text-primary">جولة تجريبية</Badge>
          <h1 className="text-3xl font-bold mt-2 mb-2">لوحة تحكم المتاجر - عرض تجريبي</h1>
          <p className="text-gray-600">تعرف على مزايا لوحة التحكم قبل التسجيل.
          </p>
        </div>

        <div className="space-y-8">
          <Stats />
          <FeatureCards />
          <RecentOrders />
          <Card>
            <CardContent className="p-6 flex flex-col sm:flex-row gap-3 justify-between items-center">
              <div className="text-center sm:text-right">
                <div className="text-lg font-semibold mb-1">جاهز للبدء؟</div>
                <div className="text-gray-600">أنشئ حساب متجرك الآن وابدأ البيع خلال دقائق</div>
              </div>
              <div className="flex gap-3">
                <Link to="/vendor/signup">
                  <Button>
                    <Store className="h-4 w-4 ml-2" />
                    إنشاء حساب متجر
                  </Button>
                </Link>
                <Link to="/vendor/login">
                  <Button variant="outline">تسجيل دخول</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
