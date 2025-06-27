import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 mt-8 sm:mt-10 p-4 sm:p-8 bg-white rounded shadow">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-blue-700">Welcome, {user.name}!</h2>
      <p className="mb-6 sm:mb-8 text-gray-600 text-base sm:text-lg">Manage your t-shirts and designs or add new ones below.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
        <Link to="/upload-tshirt" className="flex flex-col items-center justify-center bg-blue-100 hover:bg-blue-200 rounded-xl p-6 sm:p-8 shadow transition">
          <span className="text-4xl sm:text-5xl mb-2 sm:mb-4">👕</span>
          <span className="text-base sm:text-xl font-semibold text-blue-800">Add T-shirt</span>
        </Link>
        <Link to="/upload-design" className="flex flex-col items-center justify-center bg-purple-100 hover:bg-purple-200 rounded-xl p-6 sm:p-8 shadow transition">
          <span className="text-4xl sm:text-5xl mb-2 sm:mb-4">🎨</span>
          <span className="text-base sm:text-xl font-semibold text-purple-800">Add Design</span>
        </Link>
        <Link to="/manage-tshirts" className="flex flex-col items-center justify-center bg-green-100 hover:bg-green-200 rounded-xl p-6 sm:p-8 shadow transition">
          <span className="text-4xl sm:text-5xl mb-2 sm:mb-4">🗂️</span>
          <span className="text-base sm:text-xl font-semibold text-green-800">Manage T-shirts</span>
        </Link>
        <Link to="/manage-designs" className="flex flex-col items-center justify-center bg-yellow-100 hover:bg-yellow-200 rounded-xl p-6 sm:p-8 shadow transition">
          <span className="text-4xl sm:text-5xl mb-2 sm:mb-4">🖼️</span>
          <span className="text-base sm:text-xl font-semibold text-yellow-800">Manage Designs</span>
        </Link>
      </div>
    </div>
  );
} 