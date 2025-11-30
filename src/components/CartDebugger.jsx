import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

const CartDebugger = () => {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkCart = async () => {
    setLoading(true);
    try {
      console.log('🛒 Checking cart...');
      const cart = await apiService.getCart();
      console.log('📦 Cart data:', cart);
      setCartData(cart);
    } catch (error) {
      console.error('❌ Cart error:', error);
      setCartData({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const addTestItem = async () => {
    try {
      console.log('➕ Adding test item...');
      await apiService.addToCart(1, 1); // Add product ID 1 with quantity 1
      await checkCart(); // Refresh cart
    } catch (error) {
      console.error('❌ Add to cart error:', error);
    }
  };

  const clearCart = async () => {
    try {
      console.log('🗑️ Clearing cart...');
      await apiService.clearCart();
      await checkCart(); // Refresh cart
    } catch (error) {
      console.error('❌ Clear cart error:', error);
    }
  };

  useEffect(() => {
    checkCart();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Cart Debugger</h2>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={checkCart}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Check Cart'}
          </button>
          <button
            onClick={addTestItem}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Test Item
          </button>
          <button
            onClick={clearCart}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Clear Cart
          </button>
        </div>

        {cartData && (
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-bold mb-2">Cart Status:</h3>
            {cartData.error ? (
              <p className="text-red-600">Error: {cartData.error}</p>
            ) : (
              <div>
                <p><strong>Items Count:</strong> {cartData.items?.length || 0}</p>
                <p><strong>Total:</strong> {cartData.totals?.total || 0} د.ك</p>
                {cartData.items && cartData.items.length > 0 && (
                  <div className="mt-2">
                    <h4 className="font-medium">Items:</h4>
                    <ul className="list-disc list-inside text-sm">
                      {cartData.items.map((item, index) => (
                        <li key={index}>
                          {item.name} - Qty: {item.quantity} - Price: {item.price} د.ك
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDebugger;
