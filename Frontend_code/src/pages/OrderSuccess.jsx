import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

export default function OrderSuccess() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center bg-white p-10 rounded-2xl shadow-lg">
        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-6 animate-bounce" />
        <h1 className="text-2xl md:text-4xl font-extrabold text-green-600 mb-6">Order Successful!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your order is being processed and you will receive a confirmation email shortly.
        </p>
        <div className="space-y-4">
          <Link
            to="/orders"
            className="w-full block bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 rounded-lg shadow-lg hover:scale-105 transition-transform"
          >
            View Your Orders
          </Link>
          <Link
            to="/products"
            className="w-full block bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
} 