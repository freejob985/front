import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import apiService from '../services/api';

const CheckoutTest = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const testCheckout = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // First, add a product to cart
      console.log('🛒 Adding product to cart...');
      const cartData = {
        "6": { "quantity": 1, "notes": null }
      };
      localStorage.setItem('cart', JSON.stringify(cartData));

      // Then test checkout
      console.log('💳 Testing checkout...');
      const checkoutData = {
        name: "Test User",
        email: "test@example.com",
        phone: "+96512345678",
        delivery_address: "Test Address, Kuwait",
        delivery_city: "مدينة الكويت",
        delivery_governorate: "العاصمة",
        delivery_notes: "Test order",
        delivery_type: "immediate",
        payment_method: "cash"
      };

      const response = await apiService.submitCheckout(checkoutData);
      console.log('📦 Checkout response:', response);

      if (response.success) {
        const orderNumbers = response.orders.map(o => o.order_number).join(',');
        console.log('✅ Checkout successful! Order numbers:', orderNumbers);
        console.log('🔗 Redirect URL would be:', `/order-confirmation?orders=${orderNumbers}`);
        
        setResult({
          success: true,
          orders: response.orders,
          redirectUrl: `/order-confirmation?orders=${orderNumbers}`
        });
      } else {
        setError(response.message || 'Checkout failed');
      }
    } catch (err) {
      console.error('❌ Test error:', err);
      setError(err.message || 'Test failed');
    } finally {
      setLoading(false);
    }
  };

  const testOrderConfirmation = async (orderNumber) => {
    try {
      console.log('🔍 Testing order confirmation for:', orderNumber);
      const response = await apiService.getOrderConfirmation(orderNumber);
      console.log('📡 Order confirmation response:', response);
      return response;
    } catch (err) {
      console.error('❌ Order confirmation error:', err);
      throw err;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>اختبار عملية الدفع</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testCheckout} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'جاري الاختبار...' : 'اختبار عملية الدفع'}
        </Button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-2">خطأ:</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">نجح الاختبار!</h3>
              <div className="text-green-700 space-y-2">
                <p><strong>عدد الطلبات:</strong> {result.orders.length}</p>
                <p><strong>أرقام الطلبات:</strong> {result.orders.map(o => o.order_number).join(', ')}</p>
                <p><strong>رابط إعادة التوجيه:</strong> {result.redirectUrl}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">اختبار تحميل تفاصيل الطلب:</h4>
              {result.orders.map((order, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => testOrderConfirmation(order.order_number)}
                  className="w-full"
                >
                  اختبار تحميل الطلب: {order.order_number}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">تعليمات:</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>1. اضغط على "اختبار عملية الدفع"</li>
            <li>2. تحقق من Console للأخطاء</li>
            <li>3. إذا نجح الاختبار، اضغط على "اختبار تحميل الطلب"</li>
            <li>4. تحقق من أن الطلب يتم تحميله بنجاح</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckoutTest;
