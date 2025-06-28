import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, updateItemProperty, getCartTotal, loading } = useCart();
  const [previewImg, setPreviewImg] = useState(null);
  const [editingSize, setEditingSize] = useState(null);
  const navigate = useNavigate();
  const sizeSelectRef = useRef(null);

  // Standard sizes for selection
  const standardSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  // Handle clicking outside size selector
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sizeSelectRef.current && !sizeSelectRef.current.contains(event.target)) {
        setEditingSize(null);
      }
    };

    if (editingSize) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingSize]);

  const handleRemove = (item) => {
    removeFromCart(item.id, item.size, item.color);
  };

  const handleQuantityChange = (item, newQuantity) => {
    updateQuantity(item.id, item.size, item.color, newQuantity);
  };

  const handleSizeChange = (item, newSize) => {
    updateItemProperty(item.id, item.size, item.color, 'size', newSize);
    setEditingSize(null);
  };

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      navigate('/checkout');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 min-h-screen">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Your Cart</h1>
      
      {/* Preview Modal */}
      {previewImg && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-2">
          <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 relative max-w-lg w-full flex flex-col items-center">
            <button 
              onClick={() => setPreviewImg(null)} 
              className="absolute top-2 right-2 text-2xl font-bold text-gray-600 hover:text-red-500 transition-colors"
            >
              &times;
            </button>
            <img src={previewImg} alt="Preview" className="w-full h-auto max-h-[70vh] object-contain rounded-xl" />
          </div>
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛒</div>
          <div className="text-gray-500 text-lg mb-6">Your cart is empty.</div>
          <Link 
            to="/products" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 mb-6">
            {cartItems.map((item, index) => (
              <div key={`${item.id}-${item.size}-${item.color}-${index}`} className="flex flex-col sm:flex-row items-center gap-4 bg-white rounded-xl shadow p-4">
                <img 
                  src={item.combinedImage || item.tshirtImg || item.design || item.image} 
                  alt={item.name} 
                  className="w-20 h-20 object-cover rounded cursor-pointer border-2 border-blue-200 hover:border-blue-500 transition" 
                  onClick={() => setPreviewImg(item.combinedImage || item.tshirtImg || item.design || item.image)} 
                  title="Click to preview" 
                />
                <div className="flex-1 w-full">
                  <div className="font-semibold text-gray-700 text-base sm:text-lg">{item.name}</div>
                  <div className="text-gray-500 text-xs sm:text-sm">
                    Brand: {item.brand} | Color: {item.color}
                  </div>
                  {/* Size Selection */}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-500 text-xs sm:text-sm">Size:</span>
                    {editingSize === `${item.id}-${item.size}-${item.color}` ? (
                      <div className="flex items-center gap-1" ref={sizeSelectRef}>
                        <select
                          value={item.size}
                          onChange={(e) => handleSizeChange(item, e.target.value)}
                          className="text-xs sm:text-sm border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                          autoFocus
                        >
                          {standardSizes.map(size => (
                            <option key={size} value={size}>{size}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => setEditingSize(null)}
                          className="text-xs text-gray-500 hover:text-red-600 px-1 transition-colors"
                          title="Cancel"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <span className="text-gray-700 text-xs sm:text-sm font-medium bg-gray-100 px-2 py-1 rounded">{item.size}</span>
                        <button
                          onClick={() => setEditingSize(`${item.id}-${item.size}-${item.color}`)}
                          className="text-xs text-blue-600 hover:text-blue-800 underline hover:no-underline transition-all"
                          title="Change size"
                        >
                          Change
                        </button>
                      </div>
                    )}
                  </div>
                  {item.designName && (
                    <div className="text-gray-500 text-xs sm:text-sm">
                      Design: {item.designName}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-lg font-bold text-blue-700">
                    ${(item.price * (item.quantity || 1)).toFixed(2)}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleQuantityChange(item, (item.quantity || 1) - 1)}
                      className="w-8 h-8 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity || 1}</span>
                    <button
                      onClick={() => handleQuantityChange(item, (item.quantity || 1) + 1)}
                      className="w-8 h-8 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                  <button 
                    onClick={() => handleRemove(item)} 
                    className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition w-full sm:w-auto"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <div className="text-lg sm:text-xl font-bold">Total: ${getCartTotal().toFixed(2)}</div>
            <div className="flex gap-2">
              <Link 
                to="/products" 
                className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-gray-700 transition"
              >
                Continue Shopping
              </Link>
              <button 
                onClick={handleCheckout}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Checkout'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 