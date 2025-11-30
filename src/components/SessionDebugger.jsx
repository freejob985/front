import React, { useState } from 'react';
import apiService from '../services/api';

const SessionDebugger = () => {
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkSession = async () => {
    setLoading(true);
    try {
      console.log('🔍 Checking session...');
      
      // Test multiple endpoints to check session
      const [cartResponse, checkoutResponse, userResponse] = await Promise.allSettled([
        apiService.getCart(),
        apiService.getCheckoutData(),
        apiService.getCurrentUser()
      ]);
      
      console.log('📦 Cart response:', cartResponse);
      console.log('🛒 Checkout response:', checkoutResponse);
      console.log('👤 User response:', userResponse);
      
      setSessionData({
        cart: cartResponse.status === 'fulfilled' ? cartResponse.value : cartResponse.reason,
        checkout: checkoutResponse.status === 'fulfilled' ? checkoutResponse.value : checkoutResponse.reason,
        user: userResponse.status === 'fulfilled' ? userResponse.value : userResponse.reason,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('❌ Session check error:', error);
      setSessionData({
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const testSessionPersistence = async () => {
    setLoading(true);
    try {
      console.log('🧪 Testing session persistence...');
      
      // Add item to cart
      console.log('➕ Adding test item to cart...');
      await apiService.addToCart(1, 1);
      
      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check cart again
      console.log('📦 Checking cart after adding item...');
      const cart = await apiService.getCart();
      
      if (cart.items && cart.items.length > 0) {
        console.log('✅ Session persistence working');
        setSessionData(prev => ({
          ...prev,
          persistenceTest: {
            success: true,
            message: 'Session persistence is working correctly',
            cartAfterAdd: cart
          }
        }));
      } else {
        console.log('❌ Session persistence failed');
        setSessionData(prev => ({
          ...prev,
          persistenceTest: {
            success: false,
            message: 'Session persistence failed - cart is empty after adding item',
            cartAfterAdd: cart
          }
        }));
      }
      
    } catch (error) {
      console.error('❌ Session persistence test error:', error);
      setSessionData(prev => ({
        ...prev,
        persistenceTest: {
          success: false,
          message: 'Session persistence test failed: ' + error.message,
          error: error
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Session Debugger</h2>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={checkSession}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Check Session'}
          </button>
          <button
            onClick={testSessionPersistence}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Session Persistence'}
          </button>
        </div>

        {sessionData && (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Session Status:</h3>
              <div className="bg-gray-100 p-4 rounded">
                <p className="text-sm">
                  <strong>Timestamp:</strong> {sessionData.timestamp}
                </p>
                
                {sessionData.error ? (
                  <p className="text-red-600 text-sm">
                    <strong>Error:</strong> {sessionData.error}
                  </p>
                ) : (
                  <div className="space-y-2">
                    <div>
                      <strong>Cart Status:</strong> 
                      {sessionData.cart?.items ? 
                        ` ${sessionData.cart.items.length} items` : 
                        ' Error loading cart'
                      }
                    </div>
                    <div>
                      <strong>Checkout Status:</strong> 
                      {sessionData.checkout ? ' Available' : ' Error loading checkout data'}
                    </div>
                    <div>
                      <strong>User Status:</strong> 
                      {sessionData.user?.user ? ' Logged in' : ' Not logged in'}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {sessionData.cart && (
              <div>
                <h3 className="font-medium mb-2">Cart Details:</h3>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                  {JSON.stringify(sessionData.cart, null, 2)}
                </pre>
              </div>
            )}

            {sessionData.persistenceTest && (
              <div className={`p-4 rounded ${sessionData.persistenceTest.success ? 'bg-green-100' : 'bg-red-100'}`}>
                <h3 className={`font-bold ${sessionData.persistenceTest.success ? 'text-green-800' : 'text-red-800'}`}>
                  Session Persistence Test
                </h3>
                <p className="text-sm mt-2">
                  {sessionData.persistenceTest.message}
                </p>
                {sessionData.persistenceTest.cartAfterAdd && (
                  <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-32 mt-2">
                    {JSON.stringify(sessionData.persistenceTest.cartAfterAdd, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionDebugger;
