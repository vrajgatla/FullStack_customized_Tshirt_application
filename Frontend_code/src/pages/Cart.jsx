import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [previewImg, setPreviewImg] = useState(null);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
  }, []);

  const handleRemove = (id) => {
    const updated = cartItems.filter(item => item.id !== id);
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 min-h-screen">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Your Cart</h1>
      {/* Preview Modal */}
      {previewImg && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-2">
          <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 relative max-w-lg w-full flex flex-col items-center">
            <button onClick={() => setPreviewImg(null)} className="absolute top-2 right-2 text-2xl font-bold text-gray-600 hover:text-red-500">&times;</button>
            <img src={previewImg} alt="Preview" className="w-full h-auto max-h-[70vh] object-contain rounded-xl" />
          </div>
        </div>
      )}
      {cartItems.length === 0 ? (
        <div className="text-gray-500">Your cart is empty.</div>
      ) : (
        <div className="flex flex-col gap-4 mb-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row items-center gap-4 bg-white rounded-xl shadow p-4">
              <img src={item.combinedImage || item.tshirtImg || item.design} alt={item.name} className="w-20 h-20 object-cover rounded cursor-pointer border-2 border-blue-200 hover:border-blue-500 transition" onClick={() => setPreviewImg(item.combinedImage || item.tshirtImg || item.design)} title="Click to preview" />
              <div className="flex-1 w-full">
                <div className="font-semibold text-gray-700 text-base sm:text-lg">{item.name}</div>
                <div className="text-gray-500 text-xs sm:text-sm">Brand: {item.brand} | Color: {item.color} | Size: {item.size}</div>
              </div>
              <div className="text-lg font-bold text-blue-700">${item.price?.toFixed(2) || '24.99'}</div>
              <button onClick={() => handleRemove(item.id)} className="mt-2 sm:mt-0 ml-0 sm:ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition w-full sm:w-auto">Remove</button>
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2 sm:gap-0">
        <div className="text-lg sm:text-xl font-bold">Total: ${total.toFixed(2)}</div>
        {cartItems.length > 0 && (
          <Link to="/checkout" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition w-full sm:w-auto text-center">Checkout</Link>
        )}
      </div>
    </div>
  );
} 