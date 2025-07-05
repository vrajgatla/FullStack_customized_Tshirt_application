import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa';

export default function LatestDesignedTshirts() {
  const [designedTshirts, setDesignedTshirts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/designed-tshirts?limit=4')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        const sortedData = Array.isArray(data) ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4) : [];
        setDesignedTshirts(sortedData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching latest t-shirts:', error);
        setDesignedTshirts([]);
        setLoading(false);
      });
  }, []);

  const handleImageError = (e) => {
    e.target.src = '/placeholder-design.svg';
  };

  // Get the image URL from the images array - find the main image
  const getImageUrl = (tshirt) => {
    if (tshirt.images && tshirt.images.length > 0) {
      // Find the main image (isMain: true)
      const mainImage = tshirt.images.find(img => img.isMain);
      if (mainImage) {
        return mainImage.imageUrl;
      }
      // Fallback to first image if no main image found
      return tshirt.images[0].imageUrl;
    }
    return '/placeholder-design.svg';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (designedTshirts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No latest designs available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4">
          Latest Designed T-Shirts
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
          Discover our newest custom t-shirt designs created by talented artists
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {designedTshirts.map((tshirt) => (
          <div key={tshirt.id} className="group">
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 overflow-hidden border border-gray-200">
              {/* Image Container */}
              <div className="relative overflow-hidden">
                <img
                  src={getImageUrl(tshirt)}
                  alt={tshirt.name || 'Latest Design'}
                  className="w-full h-64 object-contain bg-gray-50 group-hover:scale-110 transition-transform duration-500"
                  onError={handleImageError}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Quick Actions */}
                <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2">
                  <button className="bg-white/90 backdrop-blur-sm hover:bg-white text-black p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 border border-gray-200">
                    <FaStar className="w-4 h-4" />
                  </button>
                  <Link
                    to={`/designed-tshirts/${tshirt.id}`}
                    className="bg-white/90 backdrop-blur-sm hover:bg-white text-black p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 border border-gray-200"
                  >
                    <FaChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* New Badge */}
                <div className="absolute top-3 left-3">
                  <div className="flex items-center space-x-1 px-2 py-1 bg-black text-white text-xs font-bold rounded-full shadow-lg">
                    <span>NEW</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Title */}
                <h3 className="text-lg font-bold text-black mb-2 line-clamp-2 group-hover:text-gray-600 transition-colors duration-300">
                  {tshirt.name || 'Latest Design'}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {tshirt.description || 'A unique custom t-shirt design that stands out from the crowd.'}
                </p>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-black">
                      ₹{tshirt.price || '29.99'}
                    </span>
                    {tshirt.originalPrice && tshirt.originalPrice > tshirt.price && (
                      <span className="text-base text-gray-400 line-through">
                        ₹{tshirt.originalPrice}
                      </span>
                    )}
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-1">
                    <FaStar className="w-4 h-4 text-black" />
                    <span className="text-sm font-medium text-gray-600">4.8</span>
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  to={`/designed-tshirts/${tshirt.id}`}
                  className="block w-full text-center bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-base"
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
          className="inline-flex items-center space-x-2 px-8 py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
        >
          <span>View All Designs</span>
          <FaChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
} 