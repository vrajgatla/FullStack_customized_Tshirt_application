import React, { useState, useEffect } from 'react';
import { FaUserTie, FaUser, FaChild, FaPalette, FaFire, FaTags, FaStar, FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function ShopByCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch categories based on available data
    Promise.all([
      fetch('/api/designed-tshirts?gender=Men&page=0&size=1').then(res => res.ok ? res.json() : { content: [] }),
      fetch('/api/designed-tshirts?gender=Women&page=0&size=1').then(res => res.ok ? res.json() : { content: [] }),
      fetch('/api/designed-tshirts?gender=Children&page=0&size=1').then(res => res.ok ? res.json() : { content: [] }),
      fetch('/api/designed-tshirts/featured').then(res => res.ok ? res.json() : []),
      fetch('/api/designed-tshirts?page=0&size=1&sort=createdAt,desc').then(res => res.ok ? res.json() : { content: [] })
    ]).then(([menData, womenData, childrenData, featuredData, latestData]) => {
      const dynamicCategories = [];
      
      // Add categories based on available data
      if (menData.content && menData.content.length > 0) {
        dynamicCategories.push({
          name: 'Men',
          icon: <FaUserTie className="w-8 h-8 text-blue-600" />,
          to: '/designed-tshirts?gender=Men',
          color: 'from-blue-100 to-blue-50',
          count: menData.totalElements || 0
        });
      }
      
      if (womenData.content && womenData.content.length > 0) {
        dynamicCategories.push({
          name: 'Women',
          icon: <FaUser className="w-8 h-8 text-pink-600" />,
          to: '/designed-tshirts?gender=Women',
          color: 'from-pink-100 to-pink-50',
          count: womenData.totalElements || 0
        });
      }
      
      if (childrenData.content && childrenData.content.length > 0) {
        dynamicCategories.push({
          name: 'Kids',
          icon: <FaChild className="w-8 h-8 text-yellow-500" />,
          to: '/designed-tshirts?gender=Children',
          color: 'from-yellow-100 to-yellow-50',
          count: childrenData.totalElements || 0
        });
      }
      
      // Always show Custom Design
      dynamicCategories.push({
        name: 'Custom Design',
        icon: <FaPalette className="w-8 h-8 text-purple-600" />,
        to: '/custom-design',
        color: 'from-purple-100 to-purple-50'
      });
      
      // Add Featured if available
      if (Array.isArray(featuredData) && featuredData.length > 0) {
        dynamicCategories.push({
          name: 'Featured',
          icon: <FaStar className="w-8 h-8 text-yellow-500" />,
          to: '/designed-tshirts?featured=true',
          color: 'from-yellow-100 to-yellow-50',
          count: featuredData.length
        });
      }
      
      // Add Latest if available
      if (latestData.content && latestData.content.length > 0) {
        dynamicCategories.push({
          name: 'Latest',
          icon: <FaClock className="w-8 h-8 text-green-600" />,
          to: '/designed-tshirts?sort=createdAt,desc',
          color: 'from-green-100 to-green-50'
        });
      }
      
      setCategories(dynamicCategories);
      setLoading(false);
    }).catch(error => {
      console.error('Error fetching categories:', error);
      // Fallback to default categories
      setCategories([
        { name: 'Men', icon: <FaUserTie className="w-8 h-8 text-blue-600" />, to: '/designed-tshirts?gender=Men', color: 'from-blue-100 to-blue-50' },
        { name: 'Women', icon: <FaUser className="w-8 h-8 text-pink-600" />, to: '/designed-tshirts?gender=Women', color: 'from-pink-100 to-pink-50' },
        { name: 'Kids', icon: <FaChild className="w-8 h-8 text-yellow-500" />, to: '/designed-tshirts?gender=Children', color: 'from-yellow-100 to-yellow-50' },
        { name: 'Custom Design', icon: <FaPalette className="w-8 h-8 text-purple-600" />, to: '/custom-design', color: 'from-purple-100 to-purple-50' },
        { name: 'Featured', icon: <FaStar className="w-8 h-8 text-yellow-500" />, to: '/designed-tshirts?featured=true', color: 'from-yellow-100 to-yellow-50' },
        { name: 'Latest', icon: <FaClock className="w-8 h-8 text-green-600" />, to: '/designed-tshirts?sort=createdAt,desc', color: 'from-green-100 to-green-50' }
      ]);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <section className="my-16 max-w-5xl mx-auto px-4">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="my-16 max-w-5xl mx-auto px-4">
      <h2 className="text-2xl md:text-3xl font-extrabold text-center text-gray-800 mb-8">Shop by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {categories.map((cat, idx) => (
          <Link to={cat.to} key={cat.name} className={`flex flex-col items-center justify-center bg-gradient-to-br ${cat.color} rounded-2xl shadow-lg p-4 hover:scale-105 hover:shadow-2xl transition-all duration-300`}>
            {cat.icon}
            <span className="mt-2 font-bold text-gray-700 text-base sm:text-lg text-center">{cat.name}</span>
            {cat.count && (
              <span className="text-xs text-gray-600 mt-1">{cat.count} items</span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
} 