import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Construction,
  Home,
  MessageCircle,
  ShoppingBag
} from "lucide-react";

interface PlaceholderPageProps {
  title: string;
}

// Header and Footer are provided globally by the Layout wrapper.
// Removed local Header/Footer to avoid duplicate rendering when the page
// is wrapped by the shared `Layout` component.

export default function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <main className="flex-1 flex items-center justify-center py-20">
      <div className="container mx-auto px-4 text-center">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="pb-8">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Construction className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-3xl">{title}</CardTitle>
            <CardDescription className="text-lg">
              هذه الصفحة قيد التطوير حالياً. نعمل على إنشاء محتوى رائع لك!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              نحن نعمل بجد لإنشاء تجربة مميزة لك في هذا القسم. 
              في غضون ذلك، يمكنك استكشاف باقي أقسام الموقع أو التواصل معنا إذا كنت بحاجة لمساعدة.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button size="lg" className="w-full sm:w-auto">
                  <Home className="h-5 w-5 ml-2" />
                  العودة للرئيسية
                </Button>
              </Link>
              <Link to="/categories">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <ShoppingBag className="h-5 w-5 ml-2" />
                  تصفح الأقسام
                </Button>
              </Link>
            </div>

            <div className="pt-6 border-t">
              <p className="text-sm text-gray-500 mb-4">
                هل تحتاج مساعدة أو لديك اقتراح?
              </p>
              <Link to="/contact">
                <Button variant="ghost">
                  <MessageCircle className="h-4 w-4 ml-2" />
                  تواصل معنا
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
