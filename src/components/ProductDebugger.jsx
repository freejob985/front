import React, { useState } from 'react';
import apiService from '../services/api';

const ProductDebugger = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      console.log('🔍 Fetching products...');
      const response = await apiService.get('/products/featured');
      console.log('📦 Products response:', response);
      setProducts(response.data || response || []);
    } catch (error) {
      console.error('❌ Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTestProductToCart = async (productId) => {
    try {
      console.log('➕ Adding product to cart:', productId);
      const response = await apiService.addToCart(productId, 1);
      console.log('📦 Add to cart response:', response);
      setTestResult({
        success: true,
        message: `Product ${productId} added to cart successfully`,
        response: response
      });
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      setTestResult({
        success: false,
        message: `Failed to add product ${productId} to cart: ${error.message}`,
        error: error
      });
    }
  };

  const testCartFlow = async () => {
    setLoading(true);
    setTestResult(null);
    
    try {
      // Step 1: Clear cart
      console.log('🗑️ Clearing cart...');
      await apiService.clearCart();
      
      // Step 2: Get products
      console.log('🔍 Getting products...');
      const productsResponse = await apiService.get('/products/featured');
      const products = productsResponse.data || productsResponse || [];
      
      if (products.length === 0) {
        throw new Error('No products available');
      }
      
      // Step 3: Add first product to cart
      const firstProduct = products[0];
      console.log('➕ Adding first product to cart:', firstProduct);
      await apiService.addToCart(firstProduct.id, 1);
      
      // Step 4: Check cart
      console.log('📦 Checking cart...');
      const cart = await apiService.getCart();
      console.log('🛒 Cart contents:', cart);
      
      if (!cart.items || cart.items.length === 0) {
        throw new Error('Cart is empty after adding product');
      }
      
      setTestResult({
        success: true,
        message: 'Cart flow test completed successfully',
        products: products,
        cart: cart,
        addedProduct: firstProduct
      });
      
    } catch (error) {
      console.error('❌ Cart flow test error:', error);
      setTestResult({
        success: false,
        message: 'Cart flow test failed: ' + error.message,
        error: error
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Product & Cart Debugger</h2>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={fetchProducts}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Fetch Products'}
          </button>
          <button
            onClick={testCartFlow}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Cart Flow'}
          </button>
        </div>

        {products.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Available Products:</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {products.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                  <div>
                    <span className="font-medium">{product.name}</span>
                    <span className="text-sm text-gray-600 ml-2">
                      (ID: {product.id}, Stock: {product.stock}, Price: {product.price} د.ك)
                    </span>
                  </div>
                  <button
                    onClick={() => addTestProductToCart(product.id)}
                    className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {testResult && (
          <div className={`p-4 rounded ${testResult.success ? 'bg-green-100' : 'bg-red-100'}`}>
            <h3 className={`font-bold ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
              {testResult.message}
            </h3>
            
            {testResult.success ? (
              <div className="mt-2 space-y-2">
                {testResult.addedProduct && (
                  <div>
                    <h4 className="font-medium text-green-700">Added Product:</h4>
                    <p className="text-sm">
                      {testResult.addedProduct.name} (ID: {testResult.addedProduct.id})
                    </p>
                  </div>
                )}
                
                {testResult.cart && (
                  <div>
                    <h4 className="font-medium text-green-700">Cart Contents:</h4>
                    <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-32">
                      {JSON.stringify(testResult.cart, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-red-700 mt-2">
                Error: {testResult.error?.message || 'Unknown error'}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDebugger;
