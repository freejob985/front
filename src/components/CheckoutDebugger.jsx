import React, { useState } from 'react';
import apiService from '../services/api';

const CheckoutDebugger = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testCheckout = async () => {
    setLoading(true);
    setTestResult(null);
    
    try {
      console.log('🧪 Testing checkout...');
      
      // First, add a test item to cart
      console.log('➕ Adding test item to cart...');
      await apiService.addToCart(1, 1); // Add product ID 1 with quantity 1
      
      // Check cart
      const cart = await apiService.getCart();
      console.log('📦 Cart after adding item:', cart);
      
      if (!cart.items || cart.items.length === 0) {
        throw new Error('Cart is empty after adding item');
      }
      
      // Test checkout with sample data
      const checkoutData = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '+96512345678',
        delivery_address: 'Test Address',
        delivery_city: 'Test City',
        delivery_governorate: 'Test Governorate',
        delivery_notes: 'Test notes',
        delivery_type: 'free',
        payment_method: 'cash',
        notes: 'Test order'
      };
      
      console.log('🛒 Submitting checkout with data:', checkoutData);
      const response = await apiService.submitCheckout(checkoutData);
      console.log('📦 Checkout response:', response);
      
      setTestResult({
        success: true,
        cart: cart,
        checkout: response,
        message: 'Checkout test completed successfully'
      });
    } catch (error) {
      console.error('❌ Checkout test error:', error);
      setTestResult({
        success: false,
        error: error.message,
        message: 'Checkout test failed'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Checkout Debugger</h2>
      
      <div className="mb-4">
        <button
          onClick={testCheckout}
          disabled={loading}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Checkout Flow'}
        </button>
      </div>
      
      {testResult && (
        <div className={`p-4 rounded ${testResult.success ? 'bg-green-100' : 'bg-red-100'}`}>
          <h3 className={`font-bold ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
            {testResult.message}
          </h3>
          
          {testResult.success ? (
            <div className="mt-2 space-y-2">
              <div>
                <h4 className="font-medium text-green-700">Cart Data:</h4>
                <pre className="text-xs bg-white p-2 rounded overflow-auto">
                  {JSON.stringify(testResult.cart, null, 2)}
                </pre>
              </div>
              <div>
                <h4 className="font-medium text-green-700">Checkout Response:</h4>
                <pre className="text-xs bg-white p-2 rounded overflow-auto">
                  {JSON.stringify(testResult.checkout, null, 2)}
                </pre>
              </div>
              {testResult.checkout.orders && testResult.checkout.orders.length > 0 && (
                <div>
                  <h4 className="font-medium text-green-700">Order Numbers:</h4>
                  <p className="text-sm">
                    {testResult.checkout.orders.map(o => o.order_number).join(', ')}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-red-700 mt-2">Error: {testResult.error}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckoutDebugger;
