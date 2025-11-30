import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const UrlDebugger = () => {
  const [searchParams] = useSearchParams();
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const testOrderUrl = () => {
    const testOrderNumber = 'ORD-2024-1';
    const testUrl = `/order-confirmation?orders=${testOrderNumber}`;
    console.log('🔗 Testing URL:', testUrl);
    window.location.href = testUrl;
  };

  const testMultipleOrdersUrl = () => {
    const testOrderNumbers = ['ORD-2024-1', 'ORD-2024-2'];
    const testUrl = `/order-confirmation?orders=${testOrderNumbers.join(',')}`;
    console.log('🔗 Testing multiple orders URL:', testUrl);
    window.location.href = testUrl;
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">URL Debugger</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Current URL:</h3>
          <p className="text-sm font-mono bg-gray-100 p-2 rounded break-all">
            {currentUrl}
          </p>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">URL Parameters:</h3>
          <div className="bg-gray-100 p-2 rounded">
            {Array.from(searchParams.entries()).length > 0 ? (
              <ul className="text-sm">
                {Array.from(searchParams.entries()).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {value}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No URL parameters found</p>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Orders Parameter:</h3>
          <div className="bg-gray-100 p-2 rounded">
            {searchParams.get('orders') ? (
              <div>
                <p className="text-sm">
                  <strong>Raw value:</strong> {searchParams.get('orders')}
                </p>
                <p className="text-sm">
                  <strong>Split array:</strong> {JSON.stringify(searchParams.get('orders')?.split(','))}
                </p>
                <p className="text-sm">
                  <strong>Filtered array:</strong> {JSON.stringify(searchParams.get('orders')?.split(',').filter(num => num.trim() !== ''))}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No 'orders' parameter found</p>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={testOrderUrl}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Test Single Order URL
          </button>
          <button
            onClick={testMultipleOrdersUrl}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Test Multiple Orders URL
          </button>
        </div>
      </div>
    </div>
  );
};

export default UrlDebugger;
