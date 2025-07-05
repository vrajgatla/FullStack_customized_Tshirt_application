import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { FaTrash, FaArrowLeft, FaShoppingBag, FaHeart, FaEye, FaMinus, FaPlus, FaTruck, FaShieldAlt, FaUndo, FaCreditCard } from 'react-icons/fa';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setIsUpdating(true);
    // Find the item to get its size and color
    const item = cartItems.find(item => item.id === itemId);
    if (item) {
      updateQuantity(itemId, item.size, item.color, newQuantity);
    }
    setTimeout(() => setIsUpdating(false), 300);
  };

  const handleRemoveItem = (itemId) => {
    if (window.confirm('Are you sure you want to remove this item from your cart?')) {
      const item = cartItems.find(item => item.id === itemId);
      if (item) {
        removeFromCart(itemId, item.size, item.color);
      }
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      alert('Please login to proceed with checkout');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center space-y-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <FaShoppingBag className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Please Login to View Cart
            </h1>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              You need to be logged in to access your shopping cart and manage your items.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/login"
                className="inline-flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span>Login</span>
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center space-x-3 px-6 py-4 bg-white/90 backdrop-blur-sm text-gray-800 font-bold rounded-xl hover:bg-white transition-all duration-300 transform hover:scale-105 border-2 border-gray-200 hover:border-gray-300 shadow-lg"
              >
                <FaArrowLeft className="w-5 h-5" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center space-y-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <FaShoppingBag className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Your Cart is Empty
            </h1>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/products"
                className="inline-flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span>Start Shopping</span>
              </Link>
              <Link
                to="/designed-tshirts"
                className="inline-flex items-center justify-center space-x-3 px-6 py-4 bg-white/90 backdrop-blur-sm text-gray-800 font-bold rounded-xl hover:bg-white transition-all duration-300 transform hover:scale-105 border-2 border-gray-200 hover:border-gray-300 shadow-lg"
              >
                <span>Browse Collections</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-300"
            >
              <FaArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              Shopping Cart ({getCartCount()})
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors duration-300"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.size}-${item.color}`} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="p-6">
                  <div className="flex gap-6">
                    {/* Image */}
                    <div className="relative w-32 h-32 flex-shrink-0">
                      <img
                        src={item.imageUrl || item.image}
                        alt={item.name}
                        className="w-full h-full object-contain bg-gray-50 rounded-lg"
                      />
                      {item.type === 'designed-tshirt' && (
                        <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          Custom
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {item.name}
                        </h3>
                        <p className="text-gray-600">
                          {item.type === 'designed-tshirt' ? 'Custom Designed T-Shirt' : 'Premium T-Shirt'}
                        </p>
                        {item.size && (
                          <p className="text-sm text-gray-500">Size: {item.size}</p>
                        )}
                        {item.color && (
                          <p className="text-sm text-gray-500">Color: {item.color}</p>
                        )}
                      </div>

                      {/* Price and Quantity */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                            ₹{item.price}
                          </span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                              disabled={item.quantity <= 1}
                              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <FaMinus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-semibold text-gray-900">
                              {item.quantity || 1}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-300"
                            >
                              <FaPlus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <span className="text-xl font-bold text-gray-900">
                            ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                          </span>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300"
                            title="Remove item"
                          >
                            <FaTrash className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-8 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Order Summary
              </h2>

              {/* Price Breakdown */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    ₹{getCartTotal().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold text-gray-900">
                    ₹{(getCartTotal() * 0.1).toFixed(2)}
                  </span>
                </div>
                <div className="border-t pt-4 flex justify-between">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                    ₹{(getCartTotal() * 1.1).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3 text-gray-600">
                  <FaTruck className="w-5 h-5 text-green-500" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <FaShieldAlt className="w-5 h-5 text-blue-500" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <FaUndo className="w-5 h-5 text-purple-500" />
                  <span>Easy Returns</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg flex items-center justify-center space-x-3"
              >
                <span>Proceed to Checkout</span>
                <FaCreditCard className="w-6 h-6" />
              </button>

              {/* Continue Shopping */}
              <div className="mt-8 text-center">
                <Link
                  to="/products"
                  className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-300"
                >
                  <FaArrowLeft className="w-4 h-4" />
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 