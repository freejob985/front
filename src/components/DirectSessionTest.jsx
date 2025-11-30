import React, { useState } from 'react';

const DirectSessionTest = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const testDirectSession = async () => {
    setLoading(true);
    setResults(null);
    
    const testResults = {
      timestamp: new Date().toISOString(),
      tests: []
    };

    try {
      // Test 1: Direct fetch to add to cart
      console.log('🔍 Test 1: Direct fetch to add to cart...');
      testResults.tests.push({ name: 'Direct Add to Cart', status: 'running' });
      
      try {
        const addResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}/cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            product_id: 1,
            quantity: 1
          })
        });
        
        const addData = await addResponse.json();
        console.log('Add response:', addData);
        
        testResults.tests.push({ 
          name: 'Direct Add to Cart', 
          status: addResponse.ok ? 'success' : 'error',
          data: { status: addResponse.status, data: addData }
        });
      } catch (error) {
        testResults.tests.push({ 
          name: 'Direct Add to Cart', 
          status: 'error',
          error: error.message 
        });
      }

      // Test 2: Direct fetch to get cart
      console.log('🔍 Test 2: Direct fetch to get cart...');
      testResults.tests.push({ name: 'Direct Get Cart', status: 'running' });
      
      try {
        const cartResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}/cart`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          credentials: 'include'
        });
        
        const cartData = await cartResponse.json();
        console.log('Cart response:', cartData);
        
        testResults.tests.push({ 
          name: 'Direct Get Cart', 
          status: cartResponse.ok ? 'success' : 'error',
          data: { status: cartResponse.status, data: cartData }
        });
      } catch (error) {
        testResults.tests.push({ 
          name: 'Direct Get Cart', 
          status: 'error',
          error: error.message 
        });
      }

      // Test 3: Direct fetch to checkout data
      console.log('🔍 Test 3: Direct fetch to checkout data...');
      testResults.tests.push({ name: 'Direct Checkout Data', status: 'running' });
      
      try {
        const checkoutResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}/checkout/data`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          credentials: 'include'
        });
        
        const checkoutData = await checkoutResponse.json();
        console.log('Checkout response:', checkoutData);
        
        testResults.tests.push({ 
          name: 'Direct Checkout Data', 
          status: checkoutResponse.ok ? 'success' : 'error',
          data: { status: checkoutResponse.status, data: checkoutData }
        });
      } catch (error) {
        testResults.tests.push({ 
          name: 'Direct Checkout Data', 
          status: 'error',
          error: error.message 
        });
      }

      // Test 4: Test checkout submission
      console.log('🔍 Test 4: Test checkout submission...');
      testResults.tests.push({ name: 'Direct Checkout Submit', status: 'running' });
      
      try {
        const submitData = {
          name: 'Test User',
          email: 'test@example.com',
          phone: '+96512345678',
          delivery_address: 'Test Address, Kuwait',
          delivery_city: 'Kuwait City',
          delivery_governorate: 'Kuwait',
          delivery_notes: 'Test order',
          delivery_type: 'immediate',
          payment_method: 'cash',
          notes: 'Test checkout from direct test'
        };

        const submitResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}/checkout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(submitData)
        });
        
        const submitResult = await submitResponse.json();
        console.log('Submit response:', submitResult);
        
        testResults.tests.push({ 
          name: 'Direct Checkout Submit', 
          status: submitResponse.ok ? 'success' : 'error',
          data: { status: submitResponse.status, data: submitResult }
        });
      } catch (error) {
        testResults.tests.push({ 
          name: 'Direct Checkout Submit', 
          status: 'error',
          error: error.message 
        });
      }

      testResults.overallStatus = 'completed';

    } catch (error) {
      console.error('❌ Direct session test failed:', error);
      testResults.overallStatus = 'failed';
      testResults.error = error.message;
    } finally {
      setLoading(false);
      setResults(testResults);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Direct Session Test</h2>
      <p className="text-gray-600 mb-4">
        This test bypasses the API service and makes direct fetch requests to test session handling.
      </p>
      
      <div className="space-y-4">
        <button
          onClick={testDirectSession}
          disabled={loading}
          className="bg-purple-500 text-white px-6 py-3 rounded hover:bg-purple-600 disabled:opacity-50 font-medium"
        >
          {loading ? 'Testing...' : 'Run Direct Session Test'}
        </button>

        {results && (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${
              results.overallStatus === 'completed' ? 'bg-green-100' : 
              results.overallStatus === 'failed' ? 'bg-red-100' : 'bg-yellow-100'
            }`}>
              <h3 className={`font-bold text-lg ${
                results.overallStatus === 'completed' ? 'text-green-800' : 
                results.overallStatus === 'failed' ? 'text-red-800' : 'text-yellow-800'
              }`}>
                Direct Session Test Results
              </h3>
              <p className="text-sm text-gray-600">
                Timestamp: {results.timestamp}
              </p>
              {results.error && (
                <p className="text-red-600 text-sm mt-2">
                  Error: {results.error}
                </p>
              )}
            </div>

            <div className="space-y-3">
              {results.tests.map((test, index) => (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${
                  test.status === 'success' ? 'bg-green-50 border-green-500' :
                  test.status === 'error' ? 'bg-red-50 border-red-500' :
                  test.status === 'running' ? 'bg-yellow-50 border-yellow-500' :
                  'bg-gray-50 border-gray-500'
                }`}>
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium ${
                      test.status === 'success' ? 'text-green-800' :
                      test.status === 'error' ? 'text-red-800' :
                      test.status === 'running' ? 'text-yellow-800' :
                      'text-gray-800'
                    }`}>
                      {test.name}
                    </h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      test.status === 'success' ? 'bg-green-200 text-green-800' :
                      test.status === 'error' ? 'bg-red-200 text-red-800' :
                      test.status === 'running' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-gray-200 text-gray-800'
                    }`}>
                      {test.status.toUpperCase()}
                    </span>
                  </div>
                  
                  {test.error && (
                    <p className="text-red-600 text-sm mt-2">
                      Error: {test.error}
                    </p>
                  )}
                  
                  {test.data && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        Status: {test.data.status}
                      </p>
                      <pre className="text-xs bg-white p-2 rounded mt-1 overflow-auto max-h-32">
                        {JSON.stringify(test.data.data, null, 2)}
                      </pre>
                    </div>
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

export default DirectSessionTest;
