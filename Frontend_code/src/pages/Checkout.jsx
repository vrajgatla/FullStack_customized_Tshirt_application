import React, { useEffect, useState } from 'react';

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [previewImg, setPreviewImg] = useState(null);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Checkout</h1>
      {/* Preview Modal */}
      {previewImg && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-2">
          <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 relative max-w-lg w-full flex flex-col items-center">
            <button onClick={() => setPreviewImg(null)} className="absolute top-2 right-2 text-2xl font-bold text-gray-600 hover:text-red-500">&times;</button>
            <img src={previewImg} alt="Preview" className="w-full h-auto max-h-[70vh] object-contain rounded-xl" />
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {/* Address */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Shipping Address</h2>
          <input type="text" placeholder="Full Name" className="w-full p-2 border rounded mb-2" />
          <input type="text" placeholder="Address" className="w-full p-2 border rounded mb-2" />
          <input type="text" placeholder="City" className="w-full p-2 border rounded mb-2" />
          <input type="text" placeholder="ZIP Code" className="w-full p-2 border rounded mb-2" />
        </div>
        {/* Payment */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Payment</h2>
          <input type="text" placeholder="Card Number" className="w-full p-2 border rounded mb-2" />
          <input type="text" placeholder="Expiry" className="w-full p-2 border rounded mb-2" />
          <input type="text" placeholder="CVV" className="w-full p-2 border rounded mb-2" />
        </div>
      </div>
      {/* Order Summary */}
      <div className="bg-white rounded-xl shadow p-4 mt-6 md:mt-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-2">Order Summary</h2>
        {cartItems.length === 0 ? (
          <div className="text-gray-500">No items in cart.</div>
        ) : (
          <div className="flex flex-col gap-4 mb-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row items-center gap-4 bg-gray-50 rounded-xl p-4 shadow-sm">
                <img
                  src={item.combinedImage || item.design}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded cursor-pointer border-2 border-blue-200 hover:border-blue-500 transition"
                  onClick={() => setPreviewImg(item.combinedImage || item.design)}
                  title="Click to preview"
                />
                <div className="flex-1 w-full">
                  <div className="font-semibold text-gray-700 text-base sm:text-lg">{item.name}</div>
                  <div className="text-gray-500 text-xs sm:text-sm">Brand: {item.brand} | Color: {item.color} | Size: {item.size}</div>
                  <div className="text-gray-500 text-xs sm:text-sm">Design: {item.designName} (ID: {item.designId})</div>
                </div>
                <div className="text-lg font-bold text-blue-700">${item.price?.toFixed(2) || '24.99'}</div>
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-col sm:flex-row justify-between mb-2">
          <span>Items:</span>
          <span>${cartItems.reduce((sum, item) => sum + (item.price || 0), 0).toFixed(2)}</span>
        </div>
        <div className="flex flex-col sm:flex-row justify-between mb-2">
          <span>Shipping:</span>
          <span>$4.99</span>
        </div>
        <div className="flex flex-col sm:flex-row justify-between font-bold text-lg">
          <span>Total:</span>
          <span>${(cartItems.reduce((sum, item) => sum + (item.price || 0), 0) + 4.99).toFixed(2)}</span>
        </div>
        <button className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition mt-4">Place Order</button>
      </div>
    </div>
  );
} 