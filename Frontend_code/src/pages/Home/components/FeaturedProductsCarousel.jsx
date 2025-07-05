import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaHeart, FaShoppingCart, FaEye } from 'react-icons/fa';

export default function FeaturedProductsCarousel() {
  const [designedTshirts, setDesignedTshirts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/designed-tshirts?limit=4')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        // Ensure data is an array and handle the response properly
        const sortedData = Array.isArray(data) ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];
        setDesignedTshirts(sortedData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching designed t-shirts:', error);
        setDesignedTshirts([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (designedTshirts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No designs available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {designedTshirts.map((tshirt) => (
          <div key={tshirt.id} className="group">
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 overflow-hidden">
              {/* Image Container */}
              <div className="relative overflow-hidden">
                <img
                  src={tshirt.imageUrl}
                  alt={tshirt.name}
                  className="w-full h-64 object-contain bg-gray-50 group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Quick Actions */}
                <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2">
                  <button className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110">
                    <FaHeart className="w-4 h-4" />
                  </button>
                  <button className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110">
                    <FaShoppingCart className="w-4 h-4" />
                  </button>
                  <Link
                    to={`/designed-tshirts/${tshirt.id}`}
                    className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                  >
                    <FaEye className="w-4 h-4" />
                  </Link>
                </div>

                {/* Featured Badge */}
                {tshirt.featured && (
                  <div className="absolute top-3 left-3">
                    <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                      <FaStar className="w-3 h-3" />
                      <span>Featured</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors duration-300">
                  {tshirt.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {tshirt.description || 'A unique custom t-shirt design that stands out from the crowd.'}
                </p>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-black">
                      ₹{tshirt.price}
                    </span>
                    {tshirt.originalPrice && tshirt.originalPrice > tshirt.price && (
                      <span className="text-base text-gray-400 line-through">
                        ₹{tshirt.originalPrice}
                      </span>
                    )}
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-1">
                    <FaStar className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-600">4.8</span>
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  to={`/designed-tshirts/${tshirt.id}`}
                  className="block w-full text-center bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-base"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center pt-8">
        <Link
          to="/designed-tshirts"
          className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
        >
          <span>View All Collections</span>
          <FaStar className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
} 