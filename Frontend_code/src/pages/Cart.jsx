import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { FaTrash, FaLock } from 'react-icons/fa';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-6">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/products" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold px-8 py-3 rounded-lg shadow-lg hover:scale-105 transition-transform">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 space-y-6">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex flex-col sm:flex-row gap-4 border-b pb-6 last:border-b-0">
                  <img src={item.image || '/default-tshirt.svg'} alt={item.name} className="w-full sm:w-28 h-auto sm:h-28 object-cover rounded-lg border" />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p className="text-gray-500 text-sm">Size: {item.size} | Color: {item.color}</p>
                    <p className="text-gray-500 text-sm">Brand: {item.brand || 'TrendTee'}</p>
                  </div>
                  <div className="flex flex-col items-start sm:items-end justify-between">
                    <span className="font-bold text-lg text-pink-600">₹{(item.price * item.quantity).toFixed(2)}</span>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center border rounded-lg">
                        <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)} className="px-3 py-1 font-bold">-</button>
                        <span className="px-4 py-1">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)} className="px-3 py-1 font-bold">+</button>
                      </div>
                      <button onClick={() => removeFromCart(item.id, item.size)} className="text-gray-400 hover:text-red-500 transition">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">FREE</span>
                </div>
                <div className="border-t my-4"></div>
                <div className="flex justify-between font-bold text-lg mb-6">
                  <span>Total</span>
                  <span>₹{getCartTotal().toFixed(2)}</span>
                </div>
                <button onClick={handleCheckout} className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 rounded-lg shadow-lg hover:scale-105 transition-transform">
                  Proceed to Checkout
                </button>
                <div className="flex items-center justify-center gap-2 mt-4 text-sm text-green-600">
                  <FaLock />
                  <span>Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 