import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Account() {
  const { user, logout, isAdmin } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Account</h1>
        <p className="text-gray-600">
          Manage your profile and view your order history
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Profile Information */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4 mb-6">
            {user && (
              <img
                src={user.imageUrl || '/default-tshirt.svg'}
                alt={user.name}
                className="w-24 h-24 object-contain rounded-full border"
                onError={e => { e.currentTarget.src = '/default-tshirt.svg'; }}
              />
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
              {isAdmin() && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                  Admin User
                </span>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your.email@example.com"
              />
            </div>
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition">
              Update Profile
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          {/* Order History */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Order History</h3>
            <p className="text-gray-600 mb-4">
              View and track all your past and current orders
            </p>
            <Link
              to="/orders"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
            >
              <span>📦</span>
              View My Orders
            </Link>
          </div>

          {/* Admin Dashboard (if admin) */}
          {isAdmin() && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Admin Dashboard</h3>
              <p className="text-gray-600 mb-4">
                Manage products, designs, and view all orders
              </p>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-green-700 transition"
              >
                <span>⚙️</span>
                Go to Dashboard
              </Link>
            </div>
          )}

          {/* Account Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
                <span className="text-gray-600">🔒</span>
                <span className="ml-2 text-gray-700">Change Password</span>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
                <span className="text-gray-600">📍</span>
                <span className="ml-2 text-gray-700">Manage Addresses</span>
              </button>
              <button 
                onClick={handleLogout}
                className="w-full text-left p-3 rounded-lg border border-red-200 hover:bg-red-50 transition text-red-600"
              >
                <span>🚪</span>
                <span className="ml-2">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 