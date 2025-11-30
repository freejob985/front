import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Truck,
  Clock,
  MapPin,
  Phone,
  CheckCircle,
  Shield,
  Zap,
  Package,
  Users,
  Headphones,
  ArrowRight,
  Calendar,
  Gift
} from "lucide-react";


const Hero = () => (
  <section className="bg-gradient-to-r from-green-50 to-blue-50 py-16">
    <div className="container mx-auto px-4">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          التوصيل السريع
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
          نحن نقدم خدمة توصيل سريعة وموثوقة لجميع أنحاء الكويت. 
          طلباتك تصل إليك طازجة وفي الوقت المحدد.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="text-lg px-8 py-4 h-auto">
            <Truck className="h-6 w-6 ml-2" />
            اطلب الآن
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto">
            <MapPin className="h-6 w-6 ml-2" />
            تحقق من مناطق التوصيل
          </Button>
        </div>
      </div>
    </div>
  </section>
);

const DeliveryOptions = () => {
  const deliveryTypes = [
    {
      id: "immediate",
      name: "توصيل فوري",
      name_en: "Immediate Delivery",
      description: "توصيل خلال 30-60 دقيقة",
      price: "5.000 د.ك",
      icon: Zap,
      color: "bg-red-500",
      features: ["أسرع توصيل", "منتجات طازجة", "تتبع مباشر"],
      popular: true
    },
    {
      id: "fast",
      name: "توصيل سريع",
      name_en: "Fast Delivery",
      description: "توصيل خلال 1-2 ساعة",
      price: "3.000 د.ك",
      icon: Clock,
      color: "bg-orange-500",
      features: ["توصيل سريع", "جودة عالية", "أسعار معقولة"],
      popular: false
    },
    {
      id: "scheduled",
      name: "توصيل مجدول",
      name_en: "Scheduled Delivery",
      description: "توصيل في الوقت المحدد",
      price: "2.000 د.ك",
      icon: Calendar,
      color: "bg-blue-500",
      features: ["توقيت محدد", "تخطيط مسبق", "توفير في التكلفة"],
      popular: false
    },
    {
      id: "free",
      name: "توصيل مجاني",
      name_en: "Free Delivery",
      description: "توصيل مجاني للطلبات الكبيرة",
      price: "مجاني",
      icon: Gift,
      color: "bg-green-500",
      features: ["بدون رسوم", "طلبات 50+ د.ك", "توصيل عادي"],
      popular: false
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">خيارات التوصيل</h2>
          <p className="text-xl text-gray-600">اختر نوع التوصيل المناسب لك</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {deliveryTypes.map((option) => (
            <Card key={option.id} className={`relative hover:shadow-xl transition-all duration-300 cursor-pointer group ${option.popular ? 'ring-2 ring-primary' : ''}`}>
              {option.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-white px-4 py-1">
                    الأكثر شعبية
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 ${option.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <option.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">{option.name}</CardTitle>
                <CardDescription className="text-gray-600">
                  {option.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-primary mb-6">
                  {option.price}
                </div>
                
                <ul className="space-y-3 mb-6">
                  {option.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${option.popular ? 'bg-primary hover:bg-primary/90' : 'bg-gray-600 hover:bg-gray-700'}`}
                  size="lg"
                >
                  اختر هذا النوع
                  <ArrowRight className="h-4 w-4 mr-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const CoverageAreas = () => {
  const areas = [
    {
      governorate: "مدينة الكويت",
      cities: ["الشرق", "الغرب", "دسمان", "الصالحية", "المرقاب"],
      deliveryTime: "30-60 دقيقة",
      status: "متاح"
    },
    {
      governorate: "الأحمدي",
      cities: ["الفنطاس", "الفحيحيل", "الزور", "المنقف", "الوفرة"],
      deliveryTime: "1-2 ساعة",
      status: "متاح"
    },
    {
      governorate: "حولي",
      cities: ["حولي", "الرميثية", "السالمية", "الجابرية", "البدع"],
      deliveryTime: "45-90 دقيقة",
      status: "متاح"
    },
    {
      governorate: "الجهراء",
      cities: ["الجهراء", "السالمي", "القصر", "الواحة", "النسيم"],
      deliveryTime: "1-2 ساعة",
      status: "متاح"
    },
    {
      governorate: "مبارك الكبير",
      cities: ["مبارك الكبير", "العديلية", "القصور", "القرين", "المنقف"],
      deliveryTime: "1-2 ساعة",
      status: "متاح"
    },
    {
      governorate: "الفروانية",
      cities: ["الفروانية", "الرابية", "الرقعي", "الضجيج", "العارضية"],
      deliveryTime: "1-2 ساعة",
      status: "متاح"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">مناطق التوصيل</h2>
          <p className="text-xl text-gray-600">نحن نغطي جميع أنحاء دولة الكويت</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.map((area, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{area.governorate}</CardTitle>
                  <Badge className={`${area.status === 'متاح' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {area.status}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {area.deliveryTime}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-800 mb-2">المدن المشمولة:</h4>
                  <div className="flex flex-wrap gap-1">
                    {area.cities.map((city, cityIndex) => (
                      <Badge key={cityIndex} variant="outline" className="text-xs">
                        {city}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const DeliveryProcess = () => {
  const steps = [
    {
      step: 1,
      title: "اختر منتجاتك",
      description: "تصفح آلاف المنتجات الطازجة واختر ما تحتاجه",
      icon: Package,
      color: "bg-blue-500"
    },
    {
      step: 2,
      title: "حدد نوع التوصيل",
      description: "اختر من خيارات التوصيل المتاحة حسب احتياجاتك",
      icon: Truck,
      color: "bg-orange-500"
    },
    {
      step: 3,
      title: "تأكيد الطلب",
      description: "راجع طلبك وادفع بأمان عبر طرق الدفع المتاحة",
      icon: CheckCircle,
      color: "bg-green-500"
    },
    {
      step: 4,
      title: "تتبع التوصيل",
      description: "تابع طلبك في الوقت الفعلي حتى يصل إليك",
      icon: MapPin,
      color: "bg-purple-500"
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">كيف يعمل التوصيل</h2>
          <p className="text-xl text-gray-600">عملية بسيطة وسريعة في 4 خطوات</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.step} className="text-center relative">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-200 transform translate-x-4">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>
              )}
              
              <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <step.icon className="h-8 w-8 text-white" />
              </div>
              
              <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4">
                <span className="text-lg font-bold text-gray-700">{step.step}</span>
              </div>
              
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const DeliveryFeatures = () => {
  const features = [
    {
      icon: Shield,
      title: "ضمان الجودة",
      description: "جميع منتجاتنا مضمونة الجودة والطزاجة"
    },
    {
      icon: Clock,
      title: "توصيل سريع",
      description: "توصيل خلال 30 دقيقة إلى ساعتين حسب المنطقة"
    },
    {
      icon: MapPin,
      title: "تتبع مباشر",
      description: "تابع طلبك في الوقت الفعلي عبر التطبيق"
    },
    {
      icon: Phone,
      title: "دعم 24/7",
      description: "فريق خدمة عملاء متاح على مدار الساعة"
    },
    {
      icon: Users,
      title: "سائقين محترفين",
      description: "سائقين مدربين ومحترفين لضمان أفضل خدمة"
    },
    {
      icon: Headphones,
      title: "دعم فني",
      description: "مساعدة فنية متخصصة لحل أي مشاكل"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">لماذا تختارنا؟</h2>
          <p className="text-xl text-gray-600">نحن نقدم أفضل خدمة توصيل في الكويت</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow group">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTA = () => (
  <section className="py-16 bg-primary text-white">
    <div className="container mx-auto px-4">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          ابدأ التسوق الآن
        </h2>
        <p className="text-xl mb-8 opacity-90">
          احصل على منتجاتك الطازجة في أسرع وقت ممكن. 
          اطلب الآن واستمتع بخدمة توصيل سريعة وموثوقة.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" className="text-lg px-8 py-4 h-auto">
            <Package className="h-6 w-6 ml-2" />
            تصفح المنتجات
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 py-4 h-auto border-white text-white hover:bg-white hover:text-primary">
            <Phone className="h-6 w-6 ml-2" />
            اتصل بنا
          </Button>
        </div>
      </div>
    </div>
  </section>
);


export default function Delivery() {
  return (
    <>
      <Hero />
      <DeliveryOptions />
      <CoverageAreas />
      <DeliveryProcess />
      <DeliveryFeatures />
      <CTA />
    </>
  );
}