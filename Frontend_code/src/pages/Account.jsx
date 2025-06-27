import React from 'react';

export default function Account() {
  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Account</h1>
      <div className="bg-white rounded-xl shadow p-4 mb-8">
        <h2 className="text-xl font-semibold mb-2">Login / Register</h2>
        <input type="email" placeholder="Email" className="w-full p-2 border rounded mb-2" />
        <input type="password" placeholder="Password" className="w-full p-2 border rounded mb-2" />
        <button className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition">Login</button>
      </div>
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-xl font-semibold mb-2">Order History</h2>
        <div className="text-gray-500">No orders yet.</div>
      </div>
    </div>
  );
} 