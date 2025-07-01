import React from 'react';
import { FaUserTie, FaUser, FaChild, FaPalette, FaFire, FaTags } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'Men', icon: <FaUserTie className="w-8 h-8 text-blue-600" />, to: '/designed-tshirts?gender=Men', color: 'from-blue-100 to-blue-50' },
  { name: 'Women', icon: <FaUser className="w-8 h-8 text-pink-600" />, to: '/designed-tshirts?gender=Women', color: 'from-pink-100 to-pink-50' },
  { name: 'Kids', icon: <FaChild className="w-8 h-8 text-yellow-500" />, to: '/designed-tshirts?gender=Children', color: 'from-yellow-100 to-yellow-50' },
  { name: 'Custom', icon: <FaPalette className="w-8 h-8 text-purple-600" />, to: '/custom-design', color: 'from-purple-100 to-purple-50' },
  { name: 'Trending', icon: <FaFire className="w-8 h-8 text-red-500" />, to: '/products?sort=trending', color: 'from-red-100 to-red-50' },
  { name: 'Sale', icon: <FaTags className="w-8 h-8 text-green-600" />, to: '/products?sort=sale', color: 'from-green-100 to-green-50' },
];

export default function ShopByCategory() {
  return (
    <section className="my-16 max-w-5xl mx-auto px-4">
      <h2 className="text-2xl md:text-3xl font-extrabold text-center text-gray-800 mb-8">Shop by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {categories.map((cat, idx) => (
          <Link to={cat.to} key={cat.name} className={`flex flex-col items-center justify-center bg-gradient-to-br ${cat.color} rounded-2xl shadow-lg p-4 hover:scale-105 hover:shadow-2xl transition-all duration-300`}>
            {cat.icon}
            <span className="mt-2 font-bold text-gray-700 text-base sm:text-lg text-center">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
} 