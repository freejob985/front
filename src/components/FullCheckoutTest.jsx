import React, { useState } from 'react';
import apiService from '../services/api';

const FullCheckoutTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('');

  const runFullTest = async () => {
    setLoading(true);
    setTestResult(null);
    setStep('Starting test...');
    
    try {
      // Step 1: Clear cart
      setStep('Step 1: Clearing cart...');
      await apiService.clearCart();
      
      // Step 2: Add test item
      setStep('Step 2: Adding test item to cart...');
      await apiService.addToCart(1, 2); // Add product ID 1 with quantity 2
      
      // Step 3: Check cart
      setStep('Step 3: Checking cart contents...');
      const cart = await apiService.getCart();
      console.log('📦 Cart after adding item:', cart);
      
      if (!cart.items || cart.items.length === 0) {
        throw new Error('Cart is empty after adding item');
      }
      
      // Step 4: Get checkout data
      setStep('Step 4: Getting checkout data...');
      const checkoutData = await apiService.getCheckoutData();
      console.log('🛒 Checkout data:', checkoutData);
      
      // Step 5: Submit checkout
      setStep('Step 5: Submitting checkout...');
      const checkoutPayload = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '+96512345678',
        delivery_address: 'شارع الخليج العربي، قطعة 1، مبنى 15',
        delivery_city: 'مدينة الكويت',
        delivery_governorate: 'الكويت',
        delivery_notes: 'Test delivery notes',
        delivery_type: 'free',
        payment_method: 'cash',
        notes: 'Test order from debugger'
      };
      
      console.log('🛒 Submitting checkout with payload:', checkoutPayload);
      const checkoutResponse = await apiService.submitCheckout(checkoutPayload);
      console.log('📦 Checkout response:', checkoutResponse);
      
      if (!checkoutResponse.success) {
        throw new Error('Checkout failed: ' + checkoutResponse.message);
      }
      
      if (!checkoutResponse.orders || checkoutResponse.orders.length === 0) {
        throw new Error('No orders returned from checkout');
      }
      
      // Step 6: Test order confirmation
      setStep('Step 6: Testing order confirmation...');
      const firstOrder = checkoutResponse.orders[0];
      console.log('🔍 Testing order confirmation for:', firstOrder.order_number);
      
      const orderConfirmation = await apiService.getOrderConfirmation(firstOrder.order_number);
      console.log('📋 Order confirmation:', orderConfirmation);
      
      setTestResult({
        success: true,
        steps: [
          'Cart cleared',
          'Test item added',
          'Cart verified',
          'Checkout data retrieved',
          'Checkout submitted successfully',
          'Order confirmation tested'
        ],
        cart: cart,
        checkoutData: checkoutData,
        checkoutResponse: checkoutResponse,
        orderConfirmation: orderConfirmation,
        orderNumbers: checkoutResponse.orders.map(o => o.order_number),
        message: 'Full checkout test completed successfully!'
      });
      
    } catch (error) {
      console.error('❌ Full test error:', error);
      setTestResult({
        success: false,
        error: error.message,
        step: step,
        message: 'Full checkout test failed'
      });
    } finally {
      setLoading(false);
      setStep('');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Full Checkout Test</h2>
      
      <div className="mb-4">
        <button
          onClick={runFullTest}
          disabled={loading}
          className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? `Running... ${step}` : 'Run Full Checkout Test'}
        </button>
      </div>
      
      {testResult && (
        <div className={`p-4 rounded ${testResult.success ? 'bg-green-100' : 'bg-red-100'}`}>
          <h3 className={`font-bold text-lg ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
            {testResult.message}
          </h3>
          
          {testResult.success ? (
            <div className="mt-4 space-y-4">
              <div>
                <h4 className="font-medium text-green-700">Test Steps Completed:</h4>
                <ul className="list-disc list-inside text-sm text-green-700">
                  {testResult.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-green-700">Order Numbers Generated:</h4>
                <p className="text-sm font-mono bg-white p-2 rounded">
                  {testResult.orderNumbers.join(', ')}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-green-700">Cart Data:</h4>
                  <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-32">
                    {JSON.stringify(testResult.cart, null, 2)}
                  </pre>
                </div>
                
                <div>
                  <h4 className="font-medium text-green-700">Checkout Response:</h4>
                  <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-32">
                    {JSON.stringify(testResult.checkoutResponse, null, 2)}
                  </pre>
                </div>
              </div>
              
              {testResult.orderConfirmation && (
                <div>
                  <h4 className="font-medium text-green-700">Order Confirmation:</h4>
                  <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-32">
                    {JSON.stringify(testResult.orderConfirmation, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-2">
              <p className="text-sm text-red-700">
                <strong>Error:</strong> {testResult.error}
              </p>
              {testResult.step && (
                <p className="text-sm text-red-700">
                  <strong>Failed at step:</strong> {testResult.step}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FullCheckoutTest;
