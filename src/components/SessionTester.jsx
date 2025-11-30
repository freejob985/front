import React, { useState } from 'react';
import apiService from '../services/api';

const SessionTester = () => {
  const [sessionInfo, setSessionInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const testSession = async () => {
    setLoading(true);
    try {
      console.log('🔍 Testing session...');
      
      // Test 1: Add item to cart
      console.log('➕ Adding item to cart...');
      const addResponse = await apiService.addToCart(1, 1);
      console.log('Add response:', addResponse);
      
      // Test 2: Check cart immediately
      console.log('🛒 Checking cart immediately...');
      const cartResponse = await apiService.getCart();
      console.log('Cart response:', cartResponse);
      
      // Test 3: Wait a bit and check again
      console.log('⏳ Waiting 2 seconds...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('🛒 Checking cart after delay...');
      const cartResponse2 = await apiService.getCart();
      console.log('Cart response 2:', cartResponse2);
      
      // Test 4: Check session ID consistency
      console.log('🆔 Checking session consistency...');
      const checkoutData = await apiService.getCheckoutData();
      console.log('Checkout data:', checkoutData);
      
      setSessionInfo({
        addResponse,
        cartResponse,
        cartResponse2,
        checkoutData,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('❌ Session test error:', error);
      setSessionInfo({
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const clearSession = async () => {
    setLoading(true);
    try {
      console.log('🗑️ Clearing session...');
      await apiService.clearCart();
      setSessionInfo(null);
      console.log('✅ Session cleared');
    } catch (error) {
      console.error('❌ Error clearing session:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Session Tester</h2>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={testSession}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Session'}
          </button>
          <button
            onClick={clearSession}
            disabled={loading}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
          >
            Clear Session
          </button>
        </div>

        {sessionInfo && (
          <div className="space-y-4">
            <div className={`p-4 rounded ${sessionInfo.error ? 'bg-red-100' : 'bg-green-100'}`}>
              <h3 className={`font-bold ${sessionInfo.error ? 'text-red-800' : 'text-green-800'}`}>
                Session Test Results
              </h3>
              <p className="text-sm text-gray-600">
                Timestamp: {sessionInfo.timestamp}
              </p>
            </div>

            {sessionInfo.error ? (
              <div className="p-4 bg-red-50 rounded">
                <p className="text-red-600">Error: {sessionInfo.error}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Add to Cart Response:</h4>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                    {JSON.stringify(sessionInfo.addResponse, null, 2)}
                  </pre>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Cart Response (Immediate):</h4>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                    {JSON.stringify(sessionInfo.cartResponse, null, 2)}
                  </pre>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Cart Response (After Delay):</h4>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                    {JSON.stringify(sessionInfo.cartResponse2, null, 2)}
                  </pre>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Checkout Data:</h4>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                    {JSON.stringify(sessionInfo.checkoutData, null, 2)}
                  </pre>
                </div>

                <div className="p-4 bg-blue-50 rounded">
                  <h4 className="font-medium text-blue-800 mb-2">Analysis:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>
                      Cart items count (immediate): {sessionInfo.cartResponse?.items?.length || 0}
                    </li>
                    <li>
                      Cart items count (delayed): {sessionInfo.cartResponse2?.items?.length || 0}
                    </li>
                    <li>
                      Session persistent: {
                        (sessionInfo.cartResponse?.items?.length || 0) === (sessionInfo.cartResponse2?.items?.length || 0) 
                          ? '✅ Yes' : '❌ No'
                      }
                    </li>
                    <li>
                      Checkout data available: {sessionInfo.checkoutData ? '✅ Yes' : '❌ No'}
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionTester;
