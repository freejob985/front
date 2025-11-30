import React, { useState } from 'react';
import apiService from '../services/api';

const ApiDebugger = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    setTestResult(null);
    
    try {
      console.log('🧪 Testing API...');
      console.log('🌐 API Base URL:', apiService.baseURL);
      
      // Test basic API connection
      const pingResponse = await apiService.get('/ping');
      console.log('📡 Ping Response:', pingResponse);
      
      // Test order confirmation with a sample order number
      const testOrderNumber = 'ORD-2024-1';
      console.log('🔍 Testing order confirmation for:', testOrderNumber);
      
      const orderResponse = await apiService.getOrderConfirmation(testOrderNumber);
      console.log('📦 Order Response:', orderResponse);
      
      setTestResult({
        success: true,
        ping: pingResponse,
        order: orderResponse,
        message: 'API tests completed successfully'
      });
    } catch (error) {
      console.error('❌ API Test Error:', error);
      setTestResult({
        success: false,
        error: error.message,
        message: 'API test failed'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">API Debugger</h2>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">API Base URL: {apiService.baseURL}</p>
        <button
          onClick={testApi}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test API'}
        </button>
      </div>
      
      {testResult && (
        <div className={`p-4 rounded ${testResult.success ? 'bg-green-100' : 'bg-red-100'}`}>
          <h3 className={`font-bold ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
            {testResult.message}
          </h3>
          
          {testResult.success ? (
            <div className="mt-2">
              <p className="text-sm text-green-700">Ping: {JSON.stringify(testResult.ping)}</p>
              <p className="text-sm text-green-700">Order: {JSON.stringify(testResult.order)}</p>
            </div>
          ) : (
            <p className="text-sm text-red-700 mt-2">Error: {testResult.error}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ApiDebugger;
