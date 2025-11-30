import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft,
  Save,
  Store,
  Truck,
  CreditCard,
  Bell,
  FileText,
  Share2,
  Clock,
  ShoppingCart,
  Building2,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Linkedin
} from "lucide-react";
import { useState, useEffect } from "react";
import VendorHeader from "@/components/VendorHeader";
import vendorAuthService from "@/services/vendorAuth";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface ValidationErrors {
  [key: string]: string[];
}

interface VendorSettingsData {
  store: {
    store_name: string;
    store_description: string;
    store_logo: string;
    store_cover_image: string;
    store_phone: string;
    store_email: string;
    store_address: string;
    store_city: string;
    store_governorate: string;
  };
  business: {
    business_license: string;
    tax_number: string;
    commercial_record: string;
    business_category: string;
  };
  delivery: {
    delivery_enabled: boolean;
    delivery_fee: number;
    free_delivery_threshold: number;
    delivery_time_min: number;
    delivery_time_max: number;
    delivery_areas: any[];
  };
  payment: {
    cash_on_delivery: boolean;
    card_payment: boolean;
    knet_payment: boolean;
    wallet_payment: boolean;
  };
  notifications: {
    email_notifications: boolean;
    sms_notifications: boolean;
    order_notifications: boolean;
    stock_notifications: boolean;
    promotion_notifications: boolean;
  };
  policies: {
    return_policy: string;
    shipping_policy: string;
    privacy_policy: string;
    return_period_days: number;
  };
  social: {
    facebook_url: string;
    instagram_url: string;
    twitter_url: string;
    linkedin_url: string;
    website_url: string;
  };
  working_hours: {
    working_hours: any;
    is_24_hours: boolean;
  };
  orders: {
    auto_accept_orders: boolean;
    require_order_confirmation: boolean;
    max_order_amount: number;
    min_order_amount: number;
  };
  status: {
    is_active: boolean;
  };
}

const ErrorMessage = ({ errors }: { errors: string[] }) => {
  if (!errors || errors.length === 0) return null;
  
  return (
    <div className="text-red-500 text-sm mt-1">
      {errors.map((error, index) => (
        <div key={index}>{error}</div>
      ))}
    </div>
  );
};

const StoreSettings = ({ settings, setSettings, validationErrors }: { 
  settings: VendorSettingsData; 
  setSettings: (settings: VendorSettingsData) => void;
  validationErrors: ValidationErrors;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="h-5 w-5" />
          إعدادات المتجر
        </CardTitle>
        <CardDescription>
          معلومات المتجر الأساسية والعرض العام
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="store_name">اسم المتجر *</Label>
            <Input 
              id="store_name" 
              placeholder="اسم المتجر"
              value={settings.store.store_name || ''}
              onChange={(e) => setSettings({
                ...settings,
                store: { ...settings.store, store_name: e.target.value }
              })}
            />
            <ErrorMessage errors={validationErrors['store.store_name'] || []} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="store_phone">رقم الهاتف *</Label>
            <Input 
              id="store_phone" 
              placeholder="رقم الهاتف"
              value={settings.store.store_phone || ''}
              onChange={(e) => setSettings({
                ...settings,
                store: { ...settings.store, store_phone: e.target.value }
              })}
            />
            <ErrorMessage errors={validationErrors['store.store_phone'] || []} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="store_description">وصف المتجر</Label>
          <Textarea 
            id="store_description" 
            placeholder="وصف مختصر عن المتجر وخدماته"
            rows={3}
            value={settings.store.store_description || ''}
            onChange={(e) => setSettings({
              ...settings,
              store: { ...settings.store, store_description: e.target.value }
            })}
          />
          <ErrorMessage errors={validationErrors['store.store_description'] || []} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="store_email">البريد الإلكتروني</Label>
            <Input 
              id="store_email" 
              type="email"
              placeholder="البريد الإلكتروني"
              value={settings.store.store_email || ''}
              onChange={(e) => setSettings({
                ...settings,
                store: { ...settings.store, store_email: e.target.value }
              })}
            />
            <ErrorMessage errors={validationErrors['store.store_email'] || []} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="store_city">المدينة</Label>
            <Input 
              id="store_city" 
              placeholder="المدينة"
              value={settings.store.store_city || ''}
              onChange={(e) => setSettings({
                ...settings,
                store: { ...settings.store, store_city: e.target.value }
              })}
            />
            <ErrorMessage errors={validationErrors['store.store_city'] || []} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="store_address">العنوان</Label>
          <Textarea 
            id="store_address" 
            placeholder="العنوان التفصيلي"
            rows={2}
            value={settings.store.store_address || ''}
            onChange={(e) => setSettings({
              ...settings,
              store: { ...settings.store, store_address: e.target.value }
            })}
          />
          <ErrorMessage errors={validationErrors['store.store_address'] || []} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="store_governorate">المحافظة</Label>
          <Input 
            id="store_governorate" 
            placeholder="المحافظة"
            value={settings.store.store_governorate || ''}
            onChange={(e) => setSettings({
              ...settings,
              store: { ...settings.store, store_governorate: e.target.value }
            })}
          />
          <ErrorMessage errors={validationErrors['store.store_governorate'] || []} />
        </div>
      </CardContent>
    </Card>
  );
};

const BusinessSettings = ({ settings, setSettings }: { 
  settings: VendorSettingsData; 
  setSettings: (settings: VendorSettingsData) => void;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          المعلومات التجارية
        </CardTitle>
        <CardDescription>
          المعلومات القانونية والتجارية للمتجر
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="business_license">رخصة العمل</Label>
            <Input 
              id="business_license" 
              placeholder="رقم رخصة العمل"
              value={settings.business.business_license || ''}
              onChange={(e) => setSettings({
                ...settings,
                business: { ...settings.business, business_license: e.target.value }
              })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tax_number">الرقم الضريبي</Label>
            <Input 
              id="tax_number" 
              placeholder="الرقم الضريبي"
              value={settings.business.tax_number || ''}
              onChange={(e) => setSettings({
                ...settings,
                business: { ...settings.business, tax_number: e.target.value }
              })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="commercial_record">السجل التجاري</Label>
            <Input 
              id="commercial_record" 
              placeholder="رقم السجل التجاري"
              value={settings.business.commercial_record || ''}
              onChange={(e) => setSettings({
                ...settings,
                business: { ...settings.business, commercial_record: e.target.value }
              })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="business_category">فئة العمل</Label>
            <Input 
              id="business_category" 
              placeholder="فئة العمل"
              value={settings.business.business_category || ''}
              onChange={(e) => setSettings({
                ...settings,
                business: { ...settings.business, business_category: e.target.value }
              })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const DeliverySettings = ({ settings, setSettings, validationErrors }: { 
  settings: VendorSettingsData; 
  setSettings: (settings: VendorSettingsData) => void;
  validationErrors: ValidationErrors;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          إعدادات التوصيل
        </CardTitle>
        <CardDescription>
          إعدادات التوصيل والرسوم
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>تفعيل التوصيل</Label>
            <p className="text-sm text-gray-600">تفعيل خدمة التوصيل للمتجر</p>
          </div>
          <Switch 
            checked={settings.delivery.delivery_enabled}
            onCheckedChange={(checked) => setSettings({
              ...settings,
              delivery: { ...settings.delivery, delivery_enabled: checked }
            })}
          />
        </div>

        {settings.delivery.delivery_enabled && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="delivery_fee">رسوم التوصيل (دينار)</Label>
                <Input 
                  id="delivery_fee" 
                  type="number"
                  placeholder="0.00"
                  value={settings.delivery.delivery_fee || 0}
                  onChange={(e) => setSettings({
                    ...settings,
                    delivery: { ...settings.delivery, delivery_fee: parseFloat(e.target.value) || 0 }
                  })}
                />
                <ErrorMessage errors={validationErrors['delivery.delivery_fee'] || []} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="free_delivery_threshold">حد التوصيل المجاني (دينار)</Label>
                <Input 
                  id="free_delivery_threshold" 
                  type="number"
                  placeholder="0.00"
                  value={settings.delivery.free_delivery_threshold || 0}
                  onChange={(e) => setSettings({
                    ...settings,
                    delivery: { ...settings.delivery, free_delivery_threshold: parseFloat(e.target.value) || 0 }
                  })}
                />
                <ErrorMessage errors={validationErrors['delivery.free_delivery_threshold'] || []} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="delivery_time_min">أقل وقت للتوصيل (دقيقة)</Label>
                <Input 
                  id="delivery_time_min" 
                  type="number"
                  placeholder="30"
                  value={settings.delivery.delivery_time_min || 30}
                  onChange={(e) => setSettings({
                    ...settings,
                    delivery: { ...settings.delivery, delivery_time_min: parseInt(e.target.value) || 30 }
                  })}
                />
                <ErrorMessage errors={validationErrors['delivery.delivery_time_min'] || []} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="delivery_time_max">أقصى وقت للتوصيل (دقيقة)</Label>
                <Input 
                  id="delivery_time_max" 
                  type="number"
                  placeholder="120"
                  value={settings.delivery.delivery_time_max || 120}
                  onChange={(e) => setSettings({
                    ...settings,
                    delivery: { ...settings.delivery, delivery_time_max: parseInt(e.target.value) || 120 }
                  })}
                />
                <ErrorMessage errors={validationErrors['delivery.delivery_time_max'] || []} />
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const PaymentSettings = ({ settings, setSettings }: { 
  settings: VendorSettingsData; 
  setSettings: (settings: VendorSettingsData) => void;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          طرق الدفع
        </CardTitle>
        <CardDescription>
          طرق الدفع المتاحة في المتجر
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>الدفع عند الاستلام</Label>
              <p className="text-sm text-gray-600">الدفع نقداً عند استلام الطلب</p>
            </div>
            <Switch 
              checked={settings.payment.cash_on_delivery}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                payment: { ...settings.payment, cash_on_delivery: checked }
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>الدفع بالبطاقة</Label>
              <p className="text-sm text-gray-600">الدفع بالبطاقة الائتمانية</p>
            </div>
            <Switch 
              checked={settings.payment.card_payment}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                payment: { ...settings.payment, card_payment: checked }
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>الدفع بـ KNET</Label>
              <p className="text-sm text-gray-600">الدفع عبر نظام KNET</p>
            </div>
            <Switch 
              checked={settings.payment.knet_payment}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                payment: { ...settings.payment, knet_payment: checked }
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>الدفع بالمحفظة</Label>
              <p className="text-sm text-gray-600">الدفع من المحفظة الإلكترونية</p>
            </div>
            <Switch 
              checked={settings.payment.wallet_payment}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                payment: { ...settings.payment, wallet_payment: checked }
              })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const NotificationSettings = ({ settings, setSettings }: { 
  settings: VendorSettingsData; 
  setSettings: (settings: VendorSettingsData) => void;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          إعدادات الإشعارات
        </CardTitle>
        <CardDescription>
          تخصيص الإشعارات التي تريد استلامها
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>إشعارات البريد الإلكتروني</Label>
              <p className="text-sm text-gray-600">استلام الإشعارات عبر البريد الإلكتروني</p>
            </div>
            <Switch 
              checked={settings.notifications.email_notifications}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, email_notifications: checked }
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>إشعارات الرسائل النصية</Label>
              <p className="text-sm text-gray-600">استلام الإشعارات عبر الرسائل النصية</p>
            </div>
            <Switch 
              checked={settings.notifications.sms_notifications}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, sms_notifications: checked }
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>إشعارات الطلبات</Label>
              <p className="text-sm text-gray-600">إشعارات عند استلام طلبات جديدة</p>
            </div>
            <Switch 
              checked={settings.notifications.order_notifications}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, order_notifications: checked }
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>إشعارات المخزون</Label>
              <p className="text-sm text-gray-600">إشعارات عند انخفاض المخزون</p>
            </div>
            <Switch 
              checked={settings.notifications.stock_notifications}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, stock_notifications: checked }
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>إشعارات العروض</Label>
              <p className="text-sm text-gray-600">إشعارات العروض والترويج</p>
            </div>
            <Switch 
              checked={settings.notifications.promotion_notifications}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, promotion_notifications: checked }
              })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SocialSettings = ({ settings, setSettings, validationErrors }: { 
  settings: VendorSettingsData; 
  setSettings: (settings: VendorSettingsData) => void;
  validationErrors: ValidationErrors;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          وسائل التواصل الاجتماعي
        </CardTitle>
        <CardDescription>
          روابط وسائل التواصل الاجتماعي والموقع الإلكتروني
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="website_url" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              الموقع الإلكتروني
            </Label>
            <Input 
              id="website_url" 
              type="url"
              placeholder="https://example.com"
              value={settings.social.website_url || ''}
              onChange={(e) => setSettings({
                ...settings,
                social: { ...settings.social, website_url: e.target.value }
              })}
            />
            <ErrorMessage errors={validationErrors['social.website_url'] || []} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="facebook_url" className="flex items-center gap-2">
              <Facebook className="h-4 w-4" />
              فيسبوك
            </Label>
            <Input 
              id="facebook_url" 
              type="url"
              placeholder="https://facebook.com/yourpage"
              value={settings.social.facebook_url || ''}
              onChange={(e) => setSettings({
                ...settings,
                social: { ...settings.social, facebook_url: e.target.value }
              })}
            />
            <ErrorMessage errors={validationErrors['social.facebook_url'] || []} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagram_url" className="flex items-center gap-2">
              <Instagram className="h-4 w-4" />
              إنستغرام
            </Label>
            <Input 
              id="instagram_url" 
              type="url"
              placeholder="https://instagram.com/yourpage"
              value={settings.social.instagram_url || ''}
              onChange={(e) => setSettings({
                ...settings,
                social: { ...settings.social, instagram_url: e.target.value }
              })}
            />
            <ErrorMessage errors={validationErrors['social.instagram_url'] || []} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitter_url" className="flex items-center gap-2">
              <Twitter className="h-4 w-4" />
              تويتر
            </Label>
            <Input 
              id="twitter_url" 
              type="url"
              placeholder="https://twitter.com/yourpage"
              value={settings.social.twitter_url || ''}
              onChange={(e) => setSettings({
                ...settings,
                social: { ...settings.social, twitter_url: e.target.value }
              })}
            />
            <ErrorMessage errors={validationErrors['social.twitter_url'] || []} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin_url" className="flex items-center gap-2">
              <Linkedin className="h-4 w-4" />
              لينكد إن
            </Label>
            <Input 
              id="linkedin_url" 
              type="url"
              placeholder="https://linkedin.com/in/yourpage"
              value={settings.social.linkedin_url || ''}
              onChange={(e) => setSettings({
                ...settings,
                social: { ...settings.social, linkedin_url: e.target.value }
              })}
            />
            <ErrorMessage errors={validationErrors['social.linkedin_url'] || []} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PoliciesSettings = ({ settings, setSettings, validationErrors }: { 
  settings: VendorSettingsData; 
  setSettings: (settings: VendorSettingsData) => void;
  validationErrors: ValidationErrors;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          السياسات والشروط
        </CardTitle>
        <CardDescription>
          سياسات الإرجاع والشحن والخصوصية
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="return_policy">سياسة الإرجاع</Label>
          <Textarea 
            id="return_policy" 
            placeholder="اكتب سياسة الإرجاع هنا..."
            rows={4}
            value={settings.policies.return_policy || ''}
            onChange={(e) => setSettings({
              ...settings,
              policies: { ...settings.policies, return_policy: e.target.value }
            })}
          />
          <ErrorMessage errors={validationErrors['policies.return_policy'] || []} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="shipping_policy">سياسة الشحن</Label>
          <Textarea 
            id="shipping_policy" 
            placeholder="اكتب سياسة الشحن هنا..."
            rows={4}
            value={settings.policies.shipping_policy || ''}
            onChange={(e) => setSettings({
              ...settings,
              policies: { ...settings.policies, shipping_policy: e.target.value }
            })}
          />
          <ErrorMessage errors={validationErrors['policies.shipping_policy'] || []} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="privacy_policy">سياسة الخصوصية</Label>
          <Textarea 
            id="privacy_policy" 
            placeholder="اكتب سياسة الخصوصية هنا..."
            rows={4}
            value={settings.policies.privacy_policy || ''}
            onChange={(e) => setSettings({
              ...settings,
              policies: { ...settings.policies, privacy_policy: e.target.value }
            })}
          />
          <ErrorMessage errors={validationErrors['policies.privacy_policy'] || []} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="return_period_days">فترة الإرجاع (أيام)</Label>
          <Input 
            id="return_period_days" 
            type="number"
            placeholder="7"
            min="1"
            max="30"
            value={settings.policies.return_period_days || 7}
            onChange={(e) => setSettings({
              ...settings,
              policies: { ...settings.policies, return_period_days: parseInt(e.target.value) || 7 }
            })}
          />
          <ErrorMessage errors={validationErrors['policies.return_period_days'] || []} />
        </div>
      </CardContent>
    </Card>
  );
};

const WorkingHoursSettings = ({ settings, setSettings, validationErrors }: { 
  settings: VendorSettingsData; 
  setSettings: (settings: VendorSettingsData) => void;
  validationErrors: ValidationErrors;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          ساعات العمل
        </CardTitle>
        <CardDescription>
          إعدادات ساعات العمل والتوفر
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>متاح 24 ساعة</Label>
            <p className="text-sm text-gray-600">المتجر متاح على مدار الساعة</p>
          </div>
          <Switch 
            checked={settings.working_hours.is_24_hours}
            onCheckedChange={(checked) => setSettings({
              ...settings,
              working_hours: { ...settings.working_hours, is_24_hours: checked }
            })}
          />
        </div>

        {!settings.working_hours.is_24_hours && (
          <div className="space-y-2">
            <Label>ساعات العمل</Label>
            <div className="text-sm text-gray-600">
              <p>يمكنك إضافة ساعات العمل لاحقاً من خلال واجهة إدارة المتجر</p>
            </div>
            <ErrorMessage errors={validationErrors['working_hours.working_hours'] || []} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const OrderSettings = ({ settings, setSettings, validationErrors }: { 
  settings: VendorSettingsData; 
  setSettings: (settings: VendorSettingsData) => void;
  validationErrors: ValidationErrors;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          إعدادات الطلبات
        </CardTitle>
        <CardDescription>
          إعدادات معالجة الطلبات والحدود
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>قبول الطلبات تلقائياً</Label>
              <p className="text-sm text-gray-600">قبول الطلبات الجديدة تلقائياً</p>
            </div>
            <Switch 
              checked={settings.orders.auto_accept_orders}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                orders: { ...settings.orders, auto_accept_orders: checked }
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>طلب تأكيد الطلبات</Label>
              <p className="text-sm text-gray-600">طلب تأكيد من العميل قبل المعالجة</p>
            </div>
            <Switch 
              checked={settings.orders.require_order_confirmation}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                orders: { ...settings.orders, require_order_confirmation: checked }
              })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="min_order_amount">الحد الأدنى للطلب (دينار)</Label>
            <Input 
              id="min_order_amount" 
              type="number"
              placeholder="0"
              value={settings.orders.min_order_amount || 0}
              onChange={(e) => setSettings({
                ...settings,
                orders: { ...settings.orders, min_order_amount: parseInt(e.target.value) || 0 }
              })}
            />
            <ErrorMessage errors={validationErrors['orders.min_order_amount'] || []} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max_order_amount">الحد الأقصى للطلب (دينار)</Label>
            <Input 
              id="max_order_amount" 
              type="number"
              placeholder="لا يوجد حد"
              value={settings.orders.max_order_amount || 0}
              onChange={(e) => setSettings({
                ...settings,
                orders: { ...settings.orders, max_order_amount: parseInt(e.target.value) || 0 }
              })}
            />
            <ErrorMessage errors={validationErrors['orders.max_order_amount'] || []} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function VendorSettings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  // دالة تشغيل صوت النجاح
  const playSuccessSound = () => {
    try {
      // إنشاء صوت نجاح بسيط باستخدام Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // نغمة نجاح: نغمة عالية ثم نغمة منخفضة
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Could not play success sound:', error);
      // في حالة فشل تشغيل الصوت، يمكن استخدام صوت بديل أو تجاهل الخطأ
    }
  };

  // دالة تشغيل صوت الخطأ
  const playErrorSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // نغمة خطأ: نغمة منخفضة
      oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(250, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      console.log('Could not play error sound:', error);
    }
  };
  const [settings, setSettings] = useState<VendorSettingsData>({
    store: {
      store_name: '',
      store_description: '',
      store_logo: '',
      store_cover_image: '',
      store_phone: '',
      store_email: '',
      store_address: '',
      store_city: '',
      store_governorate: '',
    },
    business: {
      business_license: '',
      tax_number: '',
      commercial_record: '',
      business_category: '',
    },
    delivery: {
      delivery_enabled: true,
      delivery_fee: 0,
      free_delivery_threshold: 0,
      delivery_time_min: 30,
      delivery_time_max: 120,
      delivery_areas: [],
    },
    payment: {
      cash_on_delivery: true,
      card_payment: false,
      knet_payment: false,
      wallet_payment: false,
    },
    notifications: {
      email_notifications: true,
      sms_notifications: false,
      order_notifications: true,
      stock_notifications: true,
      promotion_notifications: true,
    },
    policies: {
      return_policy: '',
      shipping_policy: '',
      privacy_policy: '',
      return_period_days: 7,
    },
    social: {
      facebook_url: '',
      instagram_url: '',
      twitter_url: '',
      linkedin_url: '',
      website_url: '',
    },
    working_hours: {
      working_hours: [],
      is_24_hours: false,
    },
    orders: {
      auto_accept_orders: false,
      require_order_confirmation: true,
      max_order_amount: 0,
      min_order_amount: 0,
    },
    status: {
      is_active: true,
    },
  });

  useEffect(() => {
    const loadVendorData = async () => {
      try {
        // التحقق من حالة تسجيل الدخول
        if (!vendorAuthService.isLoggedIn()) {
          navigate('/vendor/login');
          return;
        }

        // تحميل إعدادات البائع
        await loadSettings();
      } catch (error) {
        console.error('Error loading vendor data:', error);
        navigate('/vendor/login');
      }
    };

    loadVendorData();
  }, [navigate]);

  const validateField = (fieldName: string, value: any): string[] => {
    const errors: string[] = [];
    
    switch (fieldName) {
      case 'store_name':
        if (!value || value.trim().length === 0) {
          errors.push('اسم المتجر مطلوب');
        } else if (value.length > 255) {
          errors.push('اسم المتجر يجب أن يكون أقل من 255 حرف');
        }
        break;
      case 'store_phone':
        if (!value || value.trim().length === 0) {
          errors.push('رقم الهاتف مطلوب');
        } else if (value.length > 20) {
          errors.push('رقم الهاتف يجب أن يكون أقل من 20 رقم');
        }
        break;
      case 'store_email':
        if (value && value.length > 0) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errors.push('البريد الإلكتروني غير صحيح');
          } else if (value.length > 255) {
            errors.push('البريد الإلكتروني يجب أن يكون أقل من 255 حرف');
          }
        }
        break;
      case 'store_description':
        if (value && value.length > 1000) {
          errors.push('وصف المتجر يجب أن يكون أقل من 1000 حرف');
        }
        break;
      case 'store_address':
        if (value && value.length > 500) {
          errors.push('العنوان يجب أن يكون أقل من 500 حرف');
        }
        break;
      case 'store_city':
        if (value && value.length > 100) {
          errors.push('المدينة يجب أن تكون أقل من 100 حرف');
        }
        break;
      case 'store_governorate':
        if (value && value.length > 100) {
          errors.push('المحافظة يجب أن تكون أقل من 100 حرف');
        }
        break;
      case 'delivery_fee':
        if (value < 0) {
          errors.push('رسوم التوصيل يجب أن تكون أكبر من أو تساوي 0');
        }
        break;
      case 'free_delivery_threshold':
        if (value < 0) {
          errors.push('حد التوصيل المجاني يجب أن يكون أكبر من أو يساوي 0');
        }
        break;
      case 'delivery_time_min':
        if (value < 1) {
          errors.push('أقل وقت للتوصيل يجب أن يكون أكبر من 0');
        }
        break;
      case 'delivery_time_max':
        if (value < 1) {
          errors.push('أقصى وقت للتوصيل يجب أن يكون أكبر من 0');
        }
        break;
      case 'return_policy':
        if (value && value.length > 2000) {
          errors.push('سياسة الإرجاع يجب أن تكون أقل من 2000 حرف');
        }
        break;
      case 'shipping_policy':
        if (value && value.length > 2000) {
          errors.push('سياسة الشحن يجب أن تكون أقل من 2000 حرف');
        }
        break;
      case 'privacy_policy':
        if (value && value.length > 2000) {
          errors.push('سياسة الخصوصية يجب أن تكون أقل من 2000 حرف');
        }
        break;
      case 'return_period_days':
        if (value < 1 || value > 30) {
          errors.push('فترة الإرجاع يجب أن تكون بين 1 و 30 يوم');
        }
        break;
      case 'facebook_url':
      case 'instagram_url':
      case 'twitter_url':
      case 'linkedin_url':
      case 'website_url':
        if (value && value.length > 0) {
          try {
            new URL(value);
          } catch {
            errors.push('الرابط غير صحيح');
          }
          if (value.length > 255) {
            errors.push('الرابط يجب أن يكون أقل من 255 حرف');
          }
        }
        break;
    }
    
    return errors;
  };

  const validateSettings = (): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;

    // التحقق من حقول المتجر
    const storeFields = ['store_name', 'store_phone', 'store_email', 'store_description', 'store_address', 'store_city', 'store_governorate'];
    storeFields.forEach(field => {
      const fieldErrors = validateField(field, settings.store[field as keyof typeof settings.store]);
      if (fieldErrors.length > 0) {
        errors[`store.${field}`] = fieldErrors;
        isValid = false;
      }
    });

    // التحقق من حقول التوصيل
    const deliveryFields = ['delivery_fee', 'free_delivery_threshold', 'delivery_time_min', 'delivery_time_max'];
    deliveryFields.forEach(field => {
      const fieldErrors = validateField(field, settings.delivery[field as keyof typeof settings.delivery]);
      if (fieldErrors.length > 0) {
        errors[`delivery.${field}`] = fieldErrors;
        isValid = false;
      }
    });

    // التحقق من حقول السياسات
    const policyFields = ['return_policy', 'shipping_policy', 'privacy_policy', 'return_period_days'];
    policyFields.forEach(field => {
      const fieldErrors = validateField(field, settings.policies[field as keyof typeof settings.policies]);
      if (fieldErrors.length > 0) {
        errors[`policies.${field}`] = fieldErrors;
        isValid = false;
      }
    });

    // التحقق من روابط وسائل التواصل
    const socialFields = ['facebook_url', 'instagram_url', 'twitter_url', 'linkedin_url', 'website_url'];
    socialFields.forEach(field => {
      const fieldErrors = validateField(field, settings.social[field as keyof typeof settings.social]);
      if (fieldErrors.length > 0) {
        errors[`social.${field}`] = fieldErrors;
        isValid = false;
      }
    });

    setValidationErrors(errors);
    return isValid;
  };

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await api.vendor.settings.get();
      
      if (response.success && response.data) {
        // دمج البيانات المستلمة مع البيانات الافتراضية مع تجنب القيم null
        const mergeData = (defaultData: any, serverData: any) => {
          const merged: any = {};
          for (const key in defaultData) {
            if (serverData && serverData[key] !== null && serverData[key] !== undefined) {
              merged[key] = serverData[key];
            } else {
              merged[key] = defaultData[key];
            }
          }
          return merged;
        };

        const mergedSettings = {
          store: mergeData(settings.store, response.data.store),
          business: mergeData(settings.business, response.data.business),
          delivery: mergeData(settings.delivery, response.data.delivery),
          payment: mergeData(settings.payment, response.data.payment),
          notifications: mergeData(settings.notifications, response.data.notifications),
          policies: mergeData(settings.policies, response.data.policies),
          social: mergeData(settings.social, response.data.social),
          working_hours: mergeData(settings.working_hours, response.data.working_hours),
          orders: mergeData(settings.orders, response.data.orders),
          status: mergeData(settings.status, response.data.status),
        };
        setSettings(mergedSettings);
      } else {
        console.log('No settings found, using defaults');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "خطأ في تحميل الإعدادات",
        description: "حدث خطأ في تحميل إعدادات المتجر",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // التحقق من صحة البيانات قبل الإرسال
      if (!validateSettings()) {
        // تشغيل صوت الخطأ
        playErrorSound();
        
        toast({
          title: "خطأ في التحقق من صحة البيانات",
          description: "يرجى تصحيح الأخطاء المذكورة أدناه",
          variant: "destructive",
        });
        return;
      }
      
      // تحويل البيانات إلى الشكل المطلوب من الـ API مع التحقق من صحة البيانات
      const settingsData = {
        store: {
          store_name: settings.store.store_name || '',
          store_description: settings.store.store_description || '',
          store_phone: settings.store.store_phone || '',
          store_email: settings.store.store_email || '',
          store_address: settings.store.store_address || '',
          store_city: settings.store.store_city || '',
          store_governorate: settings.store.store_governorate || '',
          // ملفات الصور ستتم معالجتها بشكل منفصل
        },
        business: {
          business_license: settings.business.business_license || '',
          tax_number: settings.business.tax_number || '',
          commercial_record: settings.business.commercial_record || '',
          business_category: settings.business.business_category || '',
        },
        delivery: {
          delivery_enabled: Boolean(settings.delivery.delivery_enabled),
          delivery_fee: Number(settings.delivery.delivery_fee) || 0,
          free_delivery_threshold: Number(settings.delivery.free_delivery_threshold) || 0,
          delivery_time_min: Number(settings.delivery.delivery_time_min) || 30,
          delivery_time_max: Number(settings.delivery.delivery_time_max) || 120,
          delivery_areas: Array.isArray(settings.delivery.delivery_areas) ? settings.delivery.delivery_areas : [],
        },
        payment: {
          cash_on_delivery: Boolean(settings.payment.cash_on_delivery),
          card_payment: Boolean(settings.payment.card_payment),
          knet_payment: Boolean(settings.payment.knet_payment),
          wallet_payment: Boolean(settings.payment.wallet_payment),
        },
        notifications: {
          email_notifications: Boolean(settings.notifications.email_notifications),
          sms_notifications: Boolean(settings.notifications.sms_notifications),
          order_notifications: Boolean(settings.notifications.order_notifications),
          stock_notifications: Boolean(settings.notifications.stock_notifications),
          promotion_notifications: Boolean(settings.notifications.promotion_notifications),
        },
        policies: {
          return_policy: settings.policies.return_policy || '',
          shipping_policy: settings.policies.shipping_policy || '',
          privacy_policy: settings.policies.privacy_policy || '',
          return_period_days: Number(settings.policies.return_period_days) || 7,
        },
        social: {
          facebook_url: settings.social.facebook_url || '',
          instagram_url: settings.social.instagram_url || '',
          twitter_url: settings.social.twitter_url || '',
          linkedin_url: settings.social.linkedin_url || '',
          website_url: settings.social.website_url || '',
        },
        working_hours: {
          working_hours: Array.isArray(settings.working_hours.working_hours) ? settings.working_hours.working_hours : [],
          is_24_hours: Boolean(settings.working_hours.is_24_hours),
        },
        orders: {
          auto_accept_orders: Boolean(settings.orders.auto_accept_orders),
          require_order_confirmation: Boolean(settings.orders.require_order_confirmation),
          max_order_amount: Number(settings.orders.max_order_amount) || 0,
          min_order_amount: Number(settings.orders.min_order_amount) || 0,
        },
        status: {
          is_active: Boolean(settings.status.is_active),
        },
      };
      
      const response = await api.vendor.settings.update(settingsData) as any;
      
      if (response.success) {
        // تشغيل صوت النجاح
        playSuccessSound();
        
        // إظهار التأثير البصري للنجاح
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
        
        toast({
          title: "تم حفظ الإعدادات بنجاح",
          description: "تم تحديث إعدادات المتجر بنجاح",
          variant: "default",
        });
      } else {
        // عرض رسائل الخطأ التفصيلية
        let errorMessage = response.message || "حدث خطأ في حفظ إعدادات المتجر";
        if (response.errors) {
          const errorDetails = Object.values(response.errors).flat().join(', ');
          errorMessage += `: ${errorDetails}`;
        }
        
        // تشغيل صوت الخطأ
        playErrorSound();
        
        toast({
          title: "خطأ في حفظ الإعدادات",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error saving settings:', error);
      
      // تشغيل صوت الخطأ
      playErrorSound();
      
      let errorMessage = "حدث خطأ في حفظ إعدادات المتجر";
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "خطأ في حفظ الإعدادات",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await vendorAuthService.logout();
      navigate('/vendor/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/vendor/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل الإعدادات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <VendorHeader 
        onLogout={handleLogout}
        title="إعدادات المتجر"
        subtitle="إدارة إعدادات المتجر"
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link to="/vendor/dashboard">
              <ArrowLeft className="h-4 w-4 ml-2" />
              العودة للوحة التحكم
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">إعدادات المتجر</h1>
          <p className="text-gray-600">إدارة إعدادات المتجر والمعلومات التجارية</p>
        </div>

        <div className="space-y-6">
          <StoreSettings settings={settings} setSettings={setSettings} validationErrors={validationErrors} />
          <BusinessSettings settings={settings} setSettings={setSettings} />
          <DeliverySettings settings={settings} setSettings={setSettings} validationErrors={validationErrors} />
          <PaymentSettings settings={settings} setSettings={setSettings} />
          <NotificationSettings settings={settings} setSettings={setSettings} />
          <PoliciesSettings settings={settings} setSettings={setSettings} validationErrors={validationErrors} />
          <SocialSettings settings={settings} setSettings={setSettings} validationErrors={validationErrors} />
          <WorkingHoursSettings settings={settings} setSettings={setSettings} validationErrors={validationErrors} />
          <OrderSettings settings={settings} setSettings={setSettings} validationErrors={validationErrors} />
        </div>

        <div className="mt-8 flex justify-end">
          <Button 
            size="lg" 
            onClick={handleSave} 
            disabled={saving}
            className={`transition-all duration-300 ${
              saving 
                ? 'opacity-50 cursor-not-allowed' 
                : saveSuccess 
                  ? 'bg-green-600 hover:bg-green-700 text-white animate-pulse' 
                  : 'hover:scale-105 active:scale-95'
            }`}
          >
            <Save className="h-4 w-4 ml-2" />
            {saving ? 'جاري الحفظ...' : saveSuccess ? 'تم الحفظ بنجاح! ✓' : 'حفظ الإعدادات'}
          </Button>
        </div>
      </main>
    </div>
  );
}