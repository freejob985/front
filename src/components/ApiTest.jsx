import React, { useState } from 'react';
import apiService from '../services/api';
import SettingsService from '../services/settingsService';
import ApiDebugger from './ApiDebugger';
import CartDebugger from './CartDebugger';
import CheckoutDebugger from './CheckoutDebugger';
import FullCheckoutTest from './FullCheckoutTest';
import UrlDebugger from './UrlDebugger';
import ProductDebugger from './ProductDebugger';
import SessionDebugger from './SessionDebugger';
import CompleteDebugger from './CompleteDebugger';
import SessionTester from './SessionTester';
import DirectSessionTest from './DirectSessionTest';
import CheckoutTest from './CheckoutTest';

const ApiTest = () => {
    const [testResults, setTestResults] = useState({});
    const [loading, setLoading] = useState(false);

    const testApiEndpoint = async (endpoint, method = 'GET', data = null) => {
        setLoading(true);
        try {
            console.log(`🧪 Testing ${method} ${endpoint}...`);
            let response;
            
            if (method === 'GET') {
                response = await apiService.get(endpoint);
            } else if (method === 'POST') {
                response = await apiService.post(endpoint, data);
            }
            
            console.log(`✅ ${endpoint} Success:`, response);
            setTestResults(prev => ({
                ...prev,
                [endpoint]: { success: true, data: response, error: null }
            }));
            
            return response;
        } catch (error) {
            console.error(`❌ ${endpoint} Error:`, error);
            setTestResults(prev => ({
                ...prev,
                [endpoint]: { success: false, data: null, error: error.message }
            }));
        } finally {
            setLoading(false);
        }
    };

    const testSettingsService = async () => {
        setLoading(true);
        try {
            console.log('🧪 Testing Settings Service...');
            
            // Initialize settings service
            await SettingsService.getInstance().initialize();
            
            // Get current URLs
            const apiUrl = SettingsService.getInstance().getApiUrl();
            const siteUrl = SettingsService.getInstance().getSiteUrl();
            const settings = SettingsService.getInstance().getSettings();
            
            console.log('✅ Settings Service test successful:');
            console.log('🌐 API URL:', apiUrl);
            console.log('🏠 Site URL:', siteUrl);
            console.log('⚙️ Settings:', settings);
            
            setTestResults(prev => ({
                ...prev,
                'settings-service': { 
                    success: true, 
                    data: { apiUrl, siteUrl, settings }, 
                    error: null 
                }
            }));
        } catch (error) {
            console.error('❌ Settings Service test failed:', error);
            setTestResults(prev => ({
                ...prev,
                'settings-service': { success: false, data: null, error: error.message }
            }));
        } finally {
            setLoading(false);
        }
    };

    const runAllTests = async () => {
        setTestResults({});
        await testSettingsService();
        await testApiEndpoint('/auth/me');
        await testApiEndpoint('/checkout/data');
        await testApiEndpoint('/addresses');
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">API Integration Test</h1>
            
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">API Endpoints Test</h2>
                    <div className="space-y-4">
                        <button
                            onClick={runAllTests}
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Testing...' : 'Test All Endpoints'}
                        </button>
                        
                        <div className="space-y-2">
                            <button
                                onClick={testSettingsService}
                                className="bg-green-600 text-white px-4 py-2 rounded mr-2"
                            >
                                Test Settings Service
                            </button>
                            <button
                                onClick={() => testApiEndpoint('/auth/me')}
                                className="bg-gray-600 text-white px-4 py-2 rounded mr-2"
                            >
                                Test /auth/me
                            </button>
                            <button
                                onClick={() => testApiEndpoint('/checkout/data')}
                                className="bg-gray-600 text-white px-4 py-2 rounded mr-2"
                            >
                                Test /checkout/data
                            </button>
                            <button
                                onClick={() => testApiEndpoint('/addresses')}
                                className="bg-gray-600 text-white px-4 py-2 rounded"
                            >
                                Test /addresses
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Test Results</h2>
                    <div className="space-y-4">
                        {Object.entries(testResults).map(([endpoint, result]) => (
                            <div key={endpoint} className="border rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-medium">{endpoint}</h3>
                                    <span className={`px-2 py-1 rounded text-sm ${
                                        result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {result.success ? 'Success' : 'Failed'}
                                    </span>
                                </div>
                                {result.error && (
                                    <div className="text-red-600 text-sm mb-2">
                                        Error: {result.error}
                                    </div>
                                )}
                                {result.data && (
                                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                                        {JSON.stringify(result.data, null, 2)}
                                    </pre>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <CheckoutTest />
                <CompleteDebugger />
                <DirectSessionTest />
                <SessionTester />
                <ApiDebugger />
                <SessionDebugger />
                <ProductDebugger />
                <CartDebugger />
                <CheckoutDebugger />
                <FullCheckoutTest />
                <UrlDebugger />

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-800 mb-2">Instructions:</h3>
                    <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
                        <li>Make sure Laravel backend is running: <code>php artisan serve</code></li>
                        <li>Backend should be available at: <code>{import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}</code></li>
                        <li>Click "Test All Endpoints" to verify API connectivity</li>
                        <li>Check browser console for detailed logs</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default ApiTest;
