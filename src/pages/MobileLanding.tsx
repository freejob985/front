import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Download, QrCode, Apple, Store as StoreIcon, Github } from "lucide-react";

export default function MobileLanding() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="https://cdn.builder.io/api/v1/image/assets%2Ffed240d3cc2b421da3511c77b247579c%2F117059de60a149a98d347c3289677bd1?format=webp&width=800" alt="Elite1 Logo" className="h-10 w-auto" />
          </Link>
          <Link to="/">
            <Button variant="outline">العودة للموقع</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <Badge className="bg-primary/10 text-primary">تطبيق الجوال</Badge>
            <h1 className="text-3xl md:text-5xl font-bold mt-3 mb-4">تجربة تسوق سلسة على الجوال</h1>
            <p className="text-gray-600 mb-6">يتوفر تطبيق إيليت ون بنسخة Flutter (يدعم العربية وRTL) مع صفحات: الرئيسية، الأقسام، صفحة قسم، تفاصيل منتج، السلة، والدفع.</p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="bg-black text-white" disabled>
                <Apple className="h-5 w-5 ml-2" /> قريباً على App Store
              </Button>
              <Button size="lg" className="bg-green-600 hover:bg-green-700" disabled>
                <StoreIcon className="h-5 w-5 ml-2" /> قريباً على Google Play
              </Button>
              <a href="#dev-setup">
                <Button variant="outline" size="lg">
                  <Github className="h-5 w-5 ml-2" /> إعداد للمطورين
                </Button>
              </a>
            </div>
          </div>

          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="grid sm:grid-cols-2 gap-6 items-center">
                <div className="text-center">
                  <div className="w-40 h-40 rounded-xl bg-gray-100 mx-auto flex items-center justify-center">
                    <QrCode className="h-24 w-24 text-gray-400" />
                  </div>
                  <div className="mt-3 text-sm text-gray-600">امسح QR عند توفر الروابط</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Smartphone className="h-5 w-5" />
                    <span className="font-medium">مزايا التطبيق</span>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-2 list-disc pr-5">
                    <li>واجهة عربية كاملة وRTL</li>
                    <li>نفس أقسام ومنتجات الموقع</li>
                    <li>إضافة للسلة وحساب الإجمالي</li>
                    <li>تنقل سريع عبر GoRouter</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div id="dev-setup" className="mt-10 grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Download className="h-5 w-5" /> إعداد المطورين</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-700 space-y-2">
              <p>الكود موجود في المسار mobile/ (Flutter). شغّل على جهاز المطور:</p>
              <ol className="list-decimal pr-5 space-y-1">
                <li>flutter pub get</li>
                <li>flutter run</li>
              </ol>
              <p>يمكن استبدال MockService لاحقاً بواجهة API حقيقية.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
