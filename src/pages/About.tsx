import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "@/config/api";
import { 
  ShoppingBag,
  Store,
  Heart,
  Target,
  Zap,
  Package,
  Leaf,
  Shield,
  Truck,
  Users,
  Star
} from "lucide-react";

// Helper function to safely parse extra_data
const parseExtraData = (extraData: any) => {
  if (!extraData) return {};
  
  // If it's already an object, return it
  if (typeof extraData === 'object') {
    return extraData;
  }
  
  // If it's a string, try to parse it
  if (typeof extraData === 'string') {
    try {
      return JSON.parse(extraData);
    } catch (e) {
      console.warn('Failed to parse extra_data:', extraData);
      return {};
    }
  }
  
  return {};
};

const Hero = ({ heroData }: { heroData: any }) => (
  <section className="bg-gradient-to-r from-primary/10 to-blue-50 py-16">
    <div className="container mx-auto px-4">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {heroData?.title || 'من نحن'}
        </h1>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          {heroData?.content || 'إنجب - منصة التسوق الإلكتروني الرائدة في الكويت، نقدم لك أفضل المنتجات الغذائية والاستهلاكية من موردين موثوقين مع ضمان الجودة والطزاجة.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="text-lg px-8 py-4 h-auto">
            <ShoppingBag className="h-5 w-5 ml-2" />
            ابدأ التسوق الآن
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto">
            <Store className="h-5 w-5 ml-2" />
            انضم كموّرد
          </Button>
        </div>
      </div>
    </div>
  </section>
);

const OurStory = ({ storyData }: { storyData: any }) => (
  <section className="py-16">
    <div className="container mx-auto px-4">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-6">{storyData?.title || 'قصتنا'}</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            {storyData?.content ? (
              <div dangerouslySetInnerHTML={{ __html: storyData.content.replace(/\n/g, '<br>') }} />
            ) : (
              <>
                <p>
                  بدأت رحلة إنجب في عام 2024 بهدف واحد: جعل التسوق الغذائي أسهل وأكثر موثوقية للعائلات الكويتية. 
                  نحن نؤمن بأن كل عائلة تستحق الحصول على منتجات طازجة وعالية الجودة بأسعار مناسبة.
                </p>
                <p>
                  من خلال شبكة واسعة من الموردين الموثوقين، نضمن وصول المنتجات الطازجة إلى منازلكم في أسرع وقت ممكن. 
                  نحن نعمل على ربط المزارعين والموردين المحليين بالعملاء مباشرة، مما يضمن جودة المنتجات وأسعاراً عادلة للجميع.
                </p>
                <p>
                  اليوم، إنجب هو الوجهة الأولى للتسوق الغذائي في الكويت، حيث نخدم آلاف العائلات يومياً ونواصل النمو والتطوير لخدمتكم بشكل أفضل.
                </p>
              </>
            )}
          </div>
        </div>
        <div className="relative">
          <div className="aspect-video bg-gradient-to-br from-primary/20 to-blue-100 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <Store className="h-24 w-24 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-primary">إنجب</h3>
              <p className="text-gray-600">منصة التسوق الذكي</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const OurValues = ({ valuesData }: { valuesData: any[] }) => {
  const iconMap: { [key: string]: any } = {
    shield: Shield,
    truck: Truck,
    heart: Heart,
    target: Target,
    leaf: Leaf,
    zap: Zap
  };

  const colorMap: { [key: string]: string } = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
    orange: "bg-orange-100 text-orange-600",
    purple: "bg-purple-100 text-purple-600",
    yellow: "bg-yellow-100 text-yellow-600"
  };

  const defaultValues = [
    {
      icon: Shield,
      title: "الجودة والموثوقية",
      description: "نضمن جودة جميع المنتجات من خلال شراكاتنا مع الموردين المعتمدين",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Truck,
      title: "التوصيل السريع",
      description: "نوصل طلباتكم خلال 24-48 ساعة مع ضمان الطزاجة",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Heart,
      title: "خدمة العملاء",
      description: "فريق خدمة عملاء متخصص ومتاح 24/7 لمساعدتكم",
      color: "bg-red-100 text-red-600"
    },
    {
      icon: Target,
      title: "الأسعار العادلة",
      description: "نقدم أفضل الأسعار من خلال التعامل المباشر مع الموردين",
      color: "bg-orange-100 text-orange-600"
    },
    {
      icon: Leaf,
      title: "الاستدامة",
      description: "نؤمن بالاستدامة ونشجع المنتجات المحلية والطبيعية",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Zap,
      title: "الابتكار",
      description: "نستخدم أحدث التقنيات لتحسين تجربة التسوق",
      color: "bg-purple-100 text-purple-600"
    }
  ];

  const values = valuesData && valuesData.length > 0 ? valuesData.map(item => {
    const extraData = parseExtraData(item.extra_data);
    const IconComponent = iconMap[extraData.icon] || Shield;
    const colorClass = colorMap[extraData.color] || "bg-blue-100 text-blue-600";
    
    return {
      icon: IconComponent,
      title: item.title,
      description: item.content,
      color: colorClass
    };
  }) : defaultValues;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">قيمنا</h2>
          <p className="text-xl text-gray-600">المبادئ التي نؤمن بها ونعمل بها</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${value.color}`}>
                  <value.icon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const Statistics = ({ statisticsData }: { statisticsData: any[] }) => {
  const iconMap: { [key: string]: any } = {
    users: Users,
    store: Store,
    package: Package,
    star: Star
  };

  const colorMap: { [key: string]: string } = {
    blue: "text-blue-600",
    green: "text-green-600",
    purple: "text-purple-600",
    yellow: "text-yellow-600"
  };

  const defaultStats = [
    {
      number: "50,000+",
      label: "عميل راضٍ",
      icon: Users,
      color: "text-blue-600"
    },
    {
      number: "1,200+",
      label: "مورد موثوق",
      icon: Store,
      color: "text-green-600"
    },
    {
      number: "15,000+",
      label: "منتج متاح",
      icon: Package,
      color: "text-purple-600"
    },
    {
      number: "99.5%",
      label: "معدل الرضا",
      icon: Star,
      color: "text-yellow-600"
    }
  ];

  const stats = statisticsData && statisticsData.length > 0 ? statisticsData.map(item => {
    const extraData = parseExtraData(item.extra_data);
    const IconComponent = iconMap[extraData.icon] || Users;
    const colorClass = colorMap[extraData.color] || "text-blue-600";
    
    return {
      number: extraData.number || item.content,
      label: item.title,
      icon: IconComponent,
      color: colorClass
    };
  }) : defaultStats;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">أرقامنا تتحدث</h2>
          <p className="text-xl text-gray-600">إنجازاتنا في خدمة المجتمع الكويتي</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${stat.color} bg-opacity-10`}>
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function About() {
  const [aboutData, setAboutData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        console.log('Fetching from:', API_ENDPOINTS.ABOUT?.ALL || '/api/about');
        const response = await fetch(API_ENDPOINTS.ABOUT?.ALL || '/api/about');
        if (!response.ok) {
          throw new Error(`Failed to fetch about data: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('About data received:', data);
        console.log('Values data:', data.data?.values);
        console.log('Statistics data:', data.data?.statistics);
        setAboutData(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching about data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل المحتوى...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">خطأ في تحميل المحتوى</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  const heroData = aboutData?.hero?.[0];
  const storyData = aboutData?.story?.[0];
  const valuesData = aboutData?.values || [];
  const statisticsData = aboutData?.statistics || [];

  return (
    <div className="min-h-screen">
      <Hero heroData={heroData} />
      <OurStory storyData={storyData} />
      <OurValues valuesData={valuesData} />
      <Statistics statisticsData={statisticsData} />
      {/* <Team teamData={teamData} /> */}
      {/* <Mission missionData={missionData} /> */}
    </div>
  );
}
