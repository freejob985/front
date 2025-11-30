import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock,
  Package,
  Leaf,
  ShoppingBag,
  Filter,
  SortAsc,
  Grid3X3,
  List,
  Truck,
  Shield,
  Crown,
  CheckCircle2,
  Star as StarIcon,
  ShoppingCart as ShoppingCartIcon,
  Thermometer,
  Sun
} from "lucide-react";

const Hero = () => (
  <section className="bg-gradient-to-r from-green-50 to-blue-50 py-16">
    <div className="container mx-auto px-4">
      <div className="text-center max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Leaf className="h-8 w-8 text-green-500" />
          <h1 className="text-4xl md:text-5xl font-bold">
            المنتجات الطازجة
          </h1>
          <Leaf className="h-8 w-8 text-green-500" />
        </div>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          منتجات طازجة يومياً من المزرعة مباشرة إلى منزلك. خضروات وفواكه طازجة مع ضمان الجودة والطزاجة.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="text-lg px-8 py-4 h-auto bg-green-600 hover:bg-green-700">
            <ShoppingBag className="h-5 w-5 ml-2" />
            تسوق المنتجات الطازجة
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto">
            <Clock className="h-5 w-5 ml-2" />
            جدول التوصيل
          </Button>
        </div>
      </div>
    </div>
  </section>
);

const FreshnessGuarantee = () => {
  const guarantees = [
    {
      icon: Clock,
      title: "حصاد يومي",
      description: "نحصد المنتجات يومياً في الصباح الباكر",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Truck,
      title: "توصيل سريع",
      description: "نوصل المنتجات خلال 2-4 ساعات من الحصاد",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Thermometer,
      title: "تبريد مثالي",
      description: "نحافظ على درجة الحرارة المناسبة أثناء النقل",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: Shield,
      title: "ضمان الجودة",
      description: "نضمن جودة المنتجات أو نعيد المال",
      color: "bg-red-100 text-red-600"
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">ضمان الطزاجة</h2>
          <p className="text-xl text-gray-600">نضمن وصول المنتجات طازجة إلى منزلك</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {guarantees.map((guarantee, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${guarantee.color}`}>
                  <guarantee.icon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{guarantee.title}</h3>
                <p className="text-gray-600 leading-relaxed">{guarantee.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const FreshProducts = () => {
  const products = [
    {
      id: 1,
      name: "طماطم طازجة",
      description: "طماطم حمراء طازجة من المزرعة مباشرة",
      price: "2.5 د.ك",
      originalPrice: "3.5 د.ك",
      image: "https://images.pexels.com/photos/8805175/pexels-photo-8805175.jpeg",
      category: "خضروات",
      freshness: "حصاد اليوم",
      rating: 4.8,
      reviews: 125,
      color: "bg-red-100 text-red-600",
      popular: true
    },
    {
      id: 2,
      name: "خس أخضر طازج",
      description: "خس أخضر مقرمش وطازج",
      price: "1.8 د.ك",
      originalPrice: "2.5 د.ك",
      image: "https://images.pexels.com/photos/8805175/pexels-photo-8805175.jpeg",
      category: "خضروات",
      freshness: "حصاد اليوم",
      rating: 4.9,
      reviews: 98,
      color: "bg-green-100 text-green-600",
      popular: false
    },
    {
      id: 3,
      name: "تفاح أحمر",
      description: "تفاح أحمر حلو ومقرمش",
      price: "3.2 د.ك",
      originalPrice: "4.0 د.ك",
      image: "https://images.pexels.com/photos/8805175/pexels-photo-8805175.jpeg",
      category: "فواكه",
      freshness: "حصاد اليوم",
      rating: 4.7,
      reviews: 156,
      color: "bg-red-100 text-red-600",
      popular: true
    },
    {
      id: 4,
      name: "موز أصفر",
      description: "موز أصفر ناضج وطازج",
      price: "2.0 د.ك",
      originalPrice: "2.8 د.ك",
      image: "https://images.pexels.com/photos/8805175/pexels-photo-8805175.jpeg",
      category: "فواكه",
      freshness: "حصاد اليوم",
      rating: 4.6,
      reviews: 89,
      color: "bg-yellow-100 text-yellow-600",
      popular: false
    },
    {
      id: 5,
      name: "جزر برتقالي",
      description: "جزر برتقالي حلو ومقرمش",
      price: "1.5 د.ك",
      originalPrice: "2.0 د.ك",
      image: "https://images.pexels.com/photos/8805175/pexels-photo-8805175.jpeg",
      category: "خضروات",
      freshness: "حصاد اليوم",
      rating: 4.8,
      reviews: 112,
      color: "bg-orange-100 text-orange-600",
      popular: true
    },
    {
      id: 6,
      name: "برتقال حلو",
      description: "برتقال حلو وعصيري",
      price: "2.8 د.ك",
      originalPrice: "3.5 د.ك",
      image: "https://images.pexels.com/photos/8805175/pexels-photo-8805175.jpeg",
      category: "فواكه",
      freshness: "حصاد اليوم",
      rating: 4.9,
      reviews: 134,
      color: "bg-orange-100 text-orange-600",
      popular: false
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">المنتجات الطازجة</h2>
            <p className="text-gray-600">منتجات طازجة يومياً من المزرعة مباشرة</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <SortAsc className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className={`group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden ${product.popular ? 'ring-2 ring-green-500' : ''}`}>
              {product.popular && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-green-500 text-white">
                    <Crown className="h-3 w-3 ml-1" />
                    طازج
                  </Badge>
                </div>
              )}
              
              <div className="relative">
                <div 
                  className="h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url(${product.image})` }}
                >
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute top-4 left-4">
                    <Badge className={`${product.color} text-sm font-bold`}>
                      {product.freshness}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Clock className="h-4 w-4" />
                        <span>{product.freshness}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="mb-3">
                  <Badge variant="outline" className="text-xs mb-2">
                    {product.category}
                  </Badge>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{Number(product.rating ?? 0).toFixed(1)}</span>
                  </div>
                  <span className="text-sm text-gray-500">({product.reviews} تقييم)</span>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">{product.price}</span>
                    <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                  </div>
                  <div className="text-sm text-green-600 font-medium">
                    وفرت {((parseFloat(product.originalPrice) - parseFloat(product.price)).toFixed(1))} د.ك
                  </div>
                </div>
                
                <Button className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                  <ShoppingCartIcon className="h-4 w-4 ml-2" />
                  أضف للسلة
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const DeliverySchedule = () => {
  const schedule = [
    {
      time: "6:00 صباحاً",
      activity: "حصاد المنتجات",
      description: "نحصد المنتجات الطازجة من المزرعة",
      icon: Sun,
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      time: "8:00 صباحاً",
      activity: "فرز وتنظيف",
      description: "نفرز المنتجات وننظفها بعناية",
      icon: CheckCircle2,
      color: "bg-green-100 text-green-600"
    },
    {
      time: "10:00 صباحاً",
      activity: "تعبئة وتبريد",
      description: "نعبئ المنتجات ونحفظها في الثلاجة",
      icon: Package,
      color: "bg-blue-100 text-blue-600"
    },
    {
      time: "12:00 ظهراً",
      activity: "بدء التوصيل",
      description: "نبدأ توصيل المنتجات للعملاء",
      icon: Truck,
      color: "bg-purple-100 text-purple-600"
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">جدول التوصيل</h2>
          <p className="text-xl text-gray-600">كيف نحافظ على طزاجة المنتجات</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {schedule.map((item, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${item.color}`}>
                  <item.icon className="h-8 w-8" />
                </div>
                <div className="text-lg font-bold text-primary mb-2">{item.time}</div>
                <h3 className="text-lg font-semibold mb-2">{item.activity}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const QualityStandards = () => {
  const standards = [
    {
      icon: Shield,
      title: "معايير الجودة",
      description: "نتبع أعلى معايير الجودة في الحصاد والتعبئة",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Thermometer,
      title: "درجة الحرارة",
      description: "نحافظ على درجة الحرارة المناسبة للحفاظ على الطزاجة",
      color: "bg-red-100 text-red-600"
    },
    {
      icon: Clock,
      title: "الوقت المناسب",
      description: "نحصد المنتجات في الوقت المناسب لضمان النضج",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: CheckCircle2,
      title: "فحص دقيق",
      description: "نفحص كل منتج بعناية قبل التوصيل",
      color: "bg-purple-100 text-purple-600"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">معايير الجودة</h2>
          <p className="text-xl text-gray-600">نضمن جودة المنتجات الطازجة</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {standards.map((standard, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${standard.color}`}>
                  <standard.icon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{standard.title}</h3>
                <p className="text-gray-600 leading-relaxed">{standard.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function Fresh() {
  return (
    <div className="min-h-screen">
      <Hero />
      <FreshnessGuarantee />
      <FreshProducts />
      <DeliverySchedule />
      <QualityStandards />
    </div>
  );
}