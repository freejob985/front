import React, { useState } from 'react';
import apiService from '../services/api';

const CompleteDebugger = () => {
  const [debugResults, setDebugResults] = useState({});
  const [loading, setLoading] = useState(false);

  const runCompleteDebug = async () => {
    setLoading(true);
    setDebugResults({});
    
    const results = {
      timestamp: new Date().toISOString(),
      steps: []
    };

    try {
      // Step 1: Test API connectivity
      console.log('🔍 Step 1: Testing API connectivity...');
      results.steps.push({ step: 1, name: 'API Connectivity', status: 'running' });
      
      try {
        const pingResponse = await apiService.get('/ping');
        results.steps.push({ 
          step: 1, 
          name: 'API Connectivity', 
          status: 'success', 
          data: pingResponse 
        });
      } catch (error) {
        results.steps.push({ 
          step: 1, 
          name: 'API Connectivity', 
          status: 'error', 
          error: error.message 
        });
        throw error;
      }

      // Step 2: Test products availability
      console.log('🔍 Step 2: Testing products availability...');
      results.steps.push({ step: 2, name: 'Products Availability', status: 'running' });
      
      try {
        const productsResponse = await apiService.get('/products/featured');
        const products = productsResponse.data || productsResponse || [];
        results.steps.push({ 
          step: 2, 
          name: 'Products Availability', 
          status: 'success', 
          data: { count: products.length, products: products.slice(0, 3) }
        });
      } catch (error) {
        results.steps.push({ 
          step: 2, 
          name: 'Products Availability', 
          status: 'error', 
          error: error.message 
        });
        throw error;
      }

      // Step 3: Clear cart first
      console.log('🔍 Step 3: Clearing cart...');
      results.steps.push({ step: 3, name: 'Clear Cart', status: 'running' });
      
      try {
        await apiService.clearCart();
        results.steps.push({ 
          step: 3, 
          name: 'Clear Cart', 
          status: 'success' 
        });
      } catch (error) {
        results.steps.push({ 
          step: 3, 
          name: 'Clear Cart', 
          status: 'error', 
          error: error.message 
        });
      }

      // Step 4: Add product to cart
      console.log('🔍 Step 4: Adding product to cart...');
      results.steps.push({ step: 4, name: 'Add Product to Cart', status: 'running' });
      
      try {
        const productsResponse = await apiService.get('/products/featured');
        const products = productsResponse.data || productsResponse || [];
        
        if (products.length === 0) {
          throw new Error('No products available');
        }

        const firstProduct = products[0];
        console.log('➕ Adding product:', firstProduct);
        
        const addResponse = await apiService.addToCart(firstProduct.id, 1);
        results.steps.push({ 
          step: 4, 
          name: 'Add Product to Cart', 
          status: 'success', 
          data: { product: firstProduct, response: addResponse }
        });
      } catch (error) {
        results.steps.push({ 
          step: 4, 
          name: 'Add Product to Cart', 
          status: 'error', 
          error: error.message 
        });
        throw error;
      }

      // Step 5: Verify cart contents
      console.log('🔍 Step 5: Verifying cart contents...');
      results.steps.push({ step: 5, name: 'Verify Cart Contents', status: 'running' });
      
      try {
        const cartResponse = await apiService.getCart();
        console.log('🛒 Cart response:', cartResponse);
        
        if (!cartResponse.items || cartResponse.items.length === 0) {
          throw new Error('Cart is empty after adding product');
        }

        results.steps.push({ 
          step: 5, 
          name: 'Verify Cart Contents', 
          status: 'success', 
          data: cartResponse 
        });
      } catch (error) {
        results.steps.push({ 
          step: 5, 
          name: 'Verify Cart Contents', 
          status: 'error', 
          error: error.message 
        });
        throw error;
      }

      // Step 6: Test checkout data
      console.log('🔍 Step 6: Testing checkout data...');
      results.steps.push({ step: 6, name: 'Test Checkout Data', status: 'running' });
      
      try {
        const checkoutResponse = await apiService.getCheckoutData();
        console.log('🛒 Checkout data:', checkoutResponse);
        
        results.steps.push({ 
          step: 6, 
          name: 'Test Checkout Data', 
          status: 'success', 
          data: checkoutResponse 
        });
      } catch (error) {
        results.steps.push({ 
          step: 6, 
          name: 'Test Checkout Data', 
          status: 'error', 
          error: error.message 
        });
      }

      // Step 7: Test checkout submission
      console.log('🔍 Step 7: Testing checkout submission...');
      results.steps.push({ step: 7, name: 'Test Checkout Submission', status: 'running' });
      
      try {
        const checkoutData = {
          name: 'Test User',
          email: 'test@example.com',
          phone: '+96512345678',
          delivery_address: 'Test Address, Kuwait',
          delivery_city: 'Kuwait City',
          delivery_governorate: 'Kuwait',
          delivery_notes: 'Test order',
          delivery_type: 'immediate',
          payment_method: 'cash',
          notes: 'Test checkout from debugger'
        };

        console.log('🛒 Submitting checkout with data:', checkoutData);
        const submitResponse = await apiService.submitCheckout(checkoutData);
        console.log('📦 Checkout submit response:', submitResponse);
        
        results.steps.push({ 
          step: 7, 
          name: 'Test Checkout Submission', 
          status: 'success', 
          data: submitResponse 
        });
      } catch (error) {
        results.steps.push({ 
          step: 7, 
          name: 'Test Checkout Submission', 
          status: 'error', 
          error: error.message 
        });
      }

      results.overallStatus = 'completed';
      results.message = 'Debug completed successfully';

    } catch (error) {
      console.error('❌ Debug failed:', error);
      results.overallStatus = 'failed';
      results.message = 'Debug failed: ' + error.message;
    } finally {
      setLoading(false);
      setDebugResults(results);
    }
  };

  const clearAllData = async () => {
    setLoading(true);
    try {
      console.log('🗑️ Clearing all data...');
      await apiService.clearCart();
      console.log('✅ All data cleared');
    } catch (error) {
      console.error('❌ Error clearing data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Complete System Debugger</h2>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={runCompleteDebug}
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 disabled:opacity-50 font-medium"
          >
            {loading ? 'Running Debug...' : 'Run Complete Debug'}
          </button>
          <button
            onClick={clearAllData}
            disabled={loading}
            className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600 disabled:opacity-50 font-medium"
          >
            Clear All Data
          </button>
        </div>

        {debugResults.steps && debugResults.steps.length > 0 && (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${
              debugResults.overallStatus === 'completed' ? 'bg-green-100' : 
              debugResults.overallStatus === 'failed' ? 'bg-red-100' : 'bg-yellow-100'
            }`}>
              <h3 className={`font-bold text-lg ${
                debugResults.overallStatus === 'completed' ? 'text-green-800' : 
                debugResults.overallStatus === 'failed' ? 'text-red-800' : 'text-yellow-800'
              }`}>
                Debug Results: {debugResults.message}
              </h3>
              <p className="text-sm text-gray-600">
                Timestamp: {debugResults.timestamp}
              </p>
            </div>

            <div className="space-y-3">
              {debugResults.steps.map((step) => (
                <div key={step.step} className={`p-4 rounded-lg border-l-4 ${
                  step.status === 'success' ? 'bg-green-50 border-green-500' :
                  step.status === 'error' ? 'bg-red-50 border-red-500' :
                  step.status === 'running' ? 'bg-yellow-50 border-yellow-500' :
                  'bg-gray-50 border-gray-500'
                }`}>
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium ${
                      step.status === 'success' ? 'text-green-800' :
                      step.status === 'error' ? 'text-red-800' :
                      step.status === 'running' ? 'text-yellow-800' :
                      'text-gray-800'
                    }`}>
                      Step {step.step}: {step.name}
                    </h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      step.status === 'success' ? 'bg-green-200 text-green-800' :
                      step.status === 'error' ? 'bg-red-200 text-red-800' :
                      step.status === 'running' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-gray-200 text-gray-800'
                    }`}>
                      {step.status.toUpperCase()}
                    </span>
                  </div>
                  
                  {step.error && (
                    <p className="text-red-600 text-sm mt-2">
                      Error: {step.error}
                    </p>
                  )}
                  
                  {step.data && (
                    <pre className="text-xs bg-white p-2 rounded mt-2 overflow-auto max-h-32">
                      {JSON.stringify(step.data, null, 2)}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompleteDebugger;
