import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { 
  Store,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Headphones,
  Users,
  FileText,
  Send,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";


const Hero = () => (
  <section className="bg-gradient-to-r from-primary/10 to-blue-50 py-16">
    <div className="container mx-auto px-4">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          تواصل معنا
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          نحن هنا لمساعدتك في أي وقت. اتصل بنا أو أرسل رسالة وسنرد عليك قريباً
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="text-lg px-8 py-4 h-auto">
            <Phone className="h-5 w-5 ml-2" />
            اتصل بنا الآن
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto">
            <MessageCircle className="h-5 w-5 ml-2" />
            دردشة مباشرة
          </Button>
        </div>
      </div>
    </div>
  </section>
);

const ContactInfo = () => {
  // استدعاء API لجلب طرق التواصل
  const { data, isLoading, isError } = useQuery({
    queryKey: ["contact-methods"],
    queryFn: async () => {
      const response = await api.get('/contact-methods');
      return response;
    }
  });

  // تعيين الأيقونات المناسبة بناءً على اسم الأيقونة من API
  const getIconComponent = (iconName: string) => {
    const icons = {
      'phone': Phone,
      'mail': Mail,
      'map-pin': MapPin,
      'message-circle': MessageCircle,
      'headphones': Headphones,
      'users': Users,
      'file-text': FileText,
      'store': Store,
      'help-circle': HelpCircle
    };
    
    return icons[iconName as keyof typeof icons] || HelpCircle;
  };

  // تعيين اللون المناسب بناءً على نوع طريقة التواصل
  const getColorClass = (name: string) => {
    const colors = {
      'هاتف': 'bg-blue-100 text-blue-600',
      'بريد إلكتروني': 'bg-green-100 text-green-600',
      'عنوان': 'bg-purple-100 text-purple-600',
      'واتساب': 'bg-emerald-100 text-emerald-600',
      'دردشة': 'bg-orange-100 text-orange-600'
    };
    
    return colors[name as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">طرق التواصل</h2>
          <p className="text-xl text-gray-600">اختر الطريقة الأنسب لك للتواصل معنا</p>
        </div>
        
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}
        
        {isError && (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <p className="text-lg text-red-600">حدث خطأ أثناء تحميل طرق التواصل</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              إعادة المحاولة
            </Button>
          </div>
        )}
        
        {!isLoading && !isError && (data as any)?.data?.length === 0 && (
          <div className="text-center py-8">
            <p className="text-lg text-gray-600">لا توجد طرق تواصل متاحة حالياً</p>
          </div>
        )}
        
        {!isLoading && !isError && (data as any)?.data?.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(data as any).data.map((method: any) => (
              <Card 
                key={method.id} 
                className="text-center hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => method.link && window.open(method.link, '_blank')}
              >
                <CardContent className="p-6">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${getColorClass(method.name)}`}>
                    {React.createElement(getIconComponent(method.icon), { className: "h-8 w-8" })}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{method.name}</h3>
                  <div className="space-y-1 mb-3">
                    <p className="text-gray-700 font-medium">{method.value}</p>
                  </div>
                  {method.link && (
                    <p className="text-sm text-primary hover:underline">
                      {method.link.includes('http') ? 'انقر للانتقال' : method.link}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await api.post('/contact', formData) as any;

      if (response.success) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
        setErrorMessage(response.message || 'حدث خطأ أثناء إرسال الرسالة');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">أرسل لنا رسالة</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              املأ النموذج التالي وسنتواصل معك في أقرب وقت ممكن. 
              نحن نهتم بكل استفساراتكم ومقترحاتكم.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">رد سريع</h4>
                  <p className="text-sm text-gray-600">نرد على جميع الرسائل خلال 24 ساعة</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Users className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">فريق متخصص</h4>
                  <p className="text-sm text-gray-600">فريق خدمة عملاء مدرب ومتخصص</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Headphones className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">دعم شامل</h4>
                  <p className="text-sm text-gray-600">مساعدة في جميع الاستفسارات والمشاكل</p>
                </div>
              </div>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>نموذج التواصل</CardTitle>
              <CardDescription>
                املأ البيانات التالية وسنتواصل معك قريباً
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitStatus === 'success' && (
                <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 ml-2" />
                    تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 ml-2" />
                    {errorMessage}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم الكامل *</Label>
                  <Input 
                    id="name" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="أدخل اسمك الكامل" 
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني *</Label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@email.com" 
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input 
                    id="phone" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+966 50 123 4567" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">الموضوع *</Label>
                  <select 
                    id="subject" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">اختر الموضوع</option>
                    <option value="استفسار عام">استفسار عام</option>
                    <option value="مشكلة في الطلب">مشكلة في الطلب</option>
                    <option value="مشكلة في التوصيل">مشكلة في التوصيل</option>
                    <option value="مشكلة في الدفع">مشكلة في الدفع</option>
                    <option value="استفسارات الموردين">استفسارات الموردين</option>
                    <option value="شكوى">شكوى</option>
                    <option value="اقتراح">اقتراح</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">الرسالة *</Label>
                  <Textarea 
                    id="message" 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="اكتب رسالتك هنا..."
                    rows={5}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 ml-2" />
                      إرسال الرسالة
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  // Fetch FAQ categories
  const { data: categoriesData } = useQuery({
    queryKey: ["faq-categories"],
    queryFn: api.faqs.categories,
  });

  // Fetch FAQs
  const { data: faqsData, isLoading } = useQuery({
    queryKey: ["faqs", selectedCategory],
    queryFn: () => api.faqs.list(selectedCategory || undefined),
  });

  const categories = categoriesData?.data || [];
  const faqs = faqsData?.data || [];

  const toggleExpanded = (id: number) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">الأسئلة الشائعة</h2>
          <p className="text-xl text-gray-600">إجابات على الأسئلة الأكثر شيوعاً</p>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Button
              variant={selectedCategory === '' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('')}
              className="mb-2"
            >
              جميع الأسئلة
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className="mb-2"
              >
                {category === 'orders' && 'الطلبات'}
                {category === 'payment' && 'الدفع'}
                {category === 'delivery' && 'التوصيل'}
                {category === 'products' && 'المنتجات'}
                {category === 'support' && 'الدعم'}
                {category === 'general' && 'عام'}
              </Button>
            ))}
          </div>
        )}
        
        <div className="max-w-4xl mx-auto space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : faqs.length > 0 ? (
            faqs.map((faq) => (
              <Card key={faq.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div 
                    className="flex items-start gap-4 cursor-pointer"
                    onClick={() => toggleExpanded(faq.id)}
                  >
                    <HelpCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{faq.question_ar}</h3>
                      {expandedItems.includes(faq.id) && (
                        <p className="text-gray-600 leading-relaxed">{faq.answer_ar}</p>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      {expandedItems.includes(faq.id) ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">لا توجد أسئلة شائعة</h3>
                <p className="text-gray-600">لم يتم العثور على أسئلة شائعة في هذا القسم</p>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">لم تجد إجابة لسؤالك؟</p>
          <Button variant="outline">
            <MessageCircle className="h-4 w-4 ml-2" />
            تواصل مع خدمة العملاء
          </Button>
        </div>
      </div>
    </section>
  );
};

const MapSection = () => {
  const { data: settingsData, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: () => api.settings.general(),
  });

  const settings = (settingsData?.data || {}) as any;

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </section>
    );
  }

  // Don't show map if disabled
  if (settings.map_enabled === false || settings.map_enabled === '0') {
    return null;
  }

  // Generate map embed URL with settings
  const generateMapEmbed = () => {
    if (settings.google_map_embed) {
      return settings.google_map_embed;
    }

    const lat = settings.map_latitude || '29.3759';
    const lng = settings.map_longitude || '47.9784';
    const height = settings.map_height || '500';
    
    return `
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3477.5!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3fcf9c83cf8d5361%3A0x1b8b8b8b8b8b8b8b!2sKuwait%20City%2C%20Kuwait!5e0!3m2!1sen!2skw!4v1234567890123!5m2!1sen!2skw"
        width="100%" 
        height="${height}" 
        style="border:0;" 
        allowfullscreen="" 
        loading="lazy" 
        referrerpolicy="no-referrer-when-downgrade"
        className="w-full h-[${height}px] rounded-lg shadow-lg"
      ></iframe>
    `;
  };

  const mapEmbed = generateMapEmbed();

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">موقعنا على الخريطة</h2>
          <p className="text-xl text-gray-600">اكتشف موقعنا وزيارتنا</p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div 
              className="w-full"
              dangerouslySetInnerHTML={{ __html: mapEmbed }}
            />
          </div>
          
          {/* Additional map information */}
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <MapPin className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">العنوان</h3>
              <p className="text-gray-600">{settings.contact_address || 'مدينة الكويت، دولة الكويت'}</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">ساعات العمل</h3>
              <p className="text-gray-600">24/7</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <Phone className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">اتصل بنا</h3>
              <p className="text-gray-600">{settings.contact_phone || '+965 50 123 4567'}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const SupportChannels = () => {
  // Fetch support channels from API
  const { data: channelsData, isLoading } = useQuery({
    queryKey: ["support-channels"],
    queryFn: () => api.supportChannels.list(),
  });

  const channels = channelsData?.data || [];

  // Icon mapping for Font Awesome classes
  const getIconComponent = (iconClass: string) => {
    const iconMap: { [key: string]: any } = {
      'fas fa-headset': Headphones,
      'fas fa-exclamation-triangle': AlertCircle,
      'fas fa-store': Store,
      'fas fa-file-alt': FileText,
      'fas fa-phone': Phone,
      'fas fa-envelope': Mail,
      'fas fa-comments': MessageCircle,
      'fas fa-question-circle': HelpCircle,
    };
    return iconMap[iconClass] || HelpCircle;
  };

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">قنوات الدعم المتخصصة</h2>
            <p className="text-xl text-gray-600">تواصل مع القسم المناسب للحصول على المساعدة المتخصصة</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="text-center animate-pulse">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">قنوات الدعم المتخصصة</h2>
          <p className="text-xl text-gray-600">تواصل مع القسم المناسب للحصول على المساعدة المتخصصة</p>
        </div>
        
        {channels.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {channels.map((channel: any) => {
              const IconComponent = getIconComponent(channel.icon || 'fas fa-question-circle');
              return (
                <Card key={channel.id} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ backgroundColor: channel.color || '#3B82F6' }}
                    >
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{channel.title_ar}</h3>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">{channel.description_ar}</p>
                    <div className="space-y-2">
                      <p className="font-medium text-primary">{channel.contact_info}</p>
                      <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        {channel.availability}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Headphones className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">لا توجد قنوات دعم متاحة</h3>
            <p className="text-gray-600">يرجى المحاولة مرة أخرى لاحقاً</p>
          </div>
        )}
      </div>
    </section>
  );
};


export default function Contact() {
  return (
    <>
      <Hero />
      <ContactInfo />
      <MapSection />
      <ContactForm />
      <FAQ />
      <SupportChannels />
    </>
  );
}