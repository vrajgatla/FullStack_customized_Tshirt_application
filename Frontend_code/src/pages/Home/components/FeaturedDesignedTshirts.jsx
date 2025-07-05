import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa';

export default function FeaturedDesignedTshirts() {
  const [designedTshirts, setDesignedTshirts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/designed-tshirts/featured?limit=4')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        const sortedData = Array.isArray(data) ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4) : [];
        setDesignedTshirts(sortedData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching featured t-shirts:', error);
        setDesignedTshirts([]);
        setLoading(false);
      });
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === designedTshirts.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? designedTshirts.length - 1 : prevIndex - 1
    );
  };

  const handleImageError = (e) => {
    e.target.src = '/placeholder-design.svg';
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
        <p className="text-gray-500 text-lg">No featured designs available at the moment.</p>
      </div>
    );
  }

  const currentTshirt = designedTshirts[currentIndex];

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

  return (
    <div className="relative">
      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white text-black p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 border border-gray-200"
        aria-label="Previous slide"
      >
        <FaChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white text-black p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 border border-gray-200"
        aria-label="Next slide"
      >
        <FaChevronRight className="w-5 h-5" />
      </button>
      
      {/* Carousel Container */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200">
        <div className="relative group">
          {/* Background */}
          <div className="absolute inset-0 bg-gray-50 rounded-2xl"></div>
          
          {/* Content */}
          <div className="relative p-8 md:p-12 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Image Section */}
              <div className="relative">
                <div className="relative overflow-hidden rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-500 bg-white">
                  <img
                    src={getImageUrl(currentTshirt)}
                    alt={currentTshirt.name || 'Featured Design'}
                    className="w-full h-64 sm:h-80 md:h-96 lg:h-112 object-contain bg-white group-hover:scale-105 transition-transform duration-500"
                    onError={handleImageError}
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              
              {/* Content Section */}
              <div className="text-center lg:text-left space-y-6">
                {/* Badge */}
                {currentTshirt.featured && (
                  <div className="inline-flex items-center space-x-2 px-4 py-2 bg-black text-white text-sm font-bold rounded-full shadow-lg">
                    <FaStar className="w-4 h-4" />
                    <span>Featured Design</span>
                  </div>
                )}

                {/* Title */}
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black leading-tight">
                  {currentTshirt.name || 'Featured Design'}
                </h3>

                {/* Description */}
                <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  {currentTshirt.description || 'A stunning custom t-shirt design that showcases unique creativity and style.'}
                </p>

                {/* Price */}
                <div className="flex items-center justify-center lg:justify-start space-x-4">
                  <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black">
                    ₹{currentTshirt.price || '29.99'}
                  </span>
                  {currentTshirt.originalPrice && currentTshirt.originalPrice > currentTshirt.price && (
                    <span className="text-lg sm:text-xl md:text-2xl text-gray-400 line-through">
                      ₹{currentTshirt.originalPrice}
                    </span>
                  )}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    to={`/designed-tshirts/${currentTshirt.id}`}
                    className="group inline-flex items-center justify-center space-x-3 px-6 py-4 sm:px-8 sm:py-5 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <span className="text-base sm:text-lg">View Details</span>
                    <FaChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                  <button className="group inline-flex items-center justify-center space-x-3 px-6 py-4 sm:px-8 sm:py-5 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 border-2 border-black shadow-lg">
                    <span className="text-base sm:text-lg">Add to Cart</span>
                  </button>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8">
                  <div className="flex items-center justify-center lg:justify-start space-x-3 text-gray-600">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <span className="text-sm sm:text-base font-medium">Premium Quality</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start space-x-3 text-gray-600">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <span className="text-sm sm:text-base font-medium">Fast Shipping</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start space-x-3 text-gray-600">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <span className="text-sm sm:text-base font-medium">Easy Returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center space-x-2 mt-6 sm:mt-8">
        {designedTshirts.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-black scale-125' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
} 