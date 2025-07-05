import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { FaShoppingCart, FaHeart, FaEye, FaStar, FaStarHalfAlt } from 'react-icons/fa';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  // Get the correct image URL
  const getImageUrl = (product) => {
    // First check if there are images in the images array
    if (product.images && product.images.length > 0) {
      // Find the main image (isMain: true)
      const mainImage = product.images.find(img => img.isMain);
      if (mainImage) {
        return mainImage.imageUrl;
      }
      // Fallback to first image if no main image found
      return product.images[0].imageUrl;
    }
    // Fallback to direct imageUrl field
    if (product.imageUrl) {
      return product.imageUrl;
    }
    // Final fallback to placeholder
    return '/default-tshirt.svg';
  };

  const handleImageError = (e) => {
    e.target.src = '/default-tshirt.svg';
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: getImageUrl(product),
      type: 'tshirt',
      size: product.size || 'M',
      color: product.color || 'Black'
    });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      alert('Please login to add items to wishlist');
      return;
    }
    
    // Wishlist functionality can be implemented here
    console.log('Added to wishlist:', product.id);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Quick view functionality can be implemented here
    console.log('Quick view:', product.id);
  };

  return (
    <div 
      className="group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <Link to={`/products/${product.id}`}>
          <img
            src={getImageUrl(product)}
            alt={product.name}
            className="w-full h-64 object-contain bg-gray-50 group-hover:scale-110 transition-transform duration-500"
            onError={handleImageError}
          />
        </Link>
        
        {/* Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}></div>
        
        {/* Quick Actions */}
        <div className={`absolute top-3 right-3 flex flex-col space-y-2 transition-all duration-300 transform ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          <button 
            onClick={handleWishlist}
            className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
            title="Add to wishlist"
          >
            <FaHeart className="w-4 h-4" />
          </button>
          <button 
            onClick={handleAddToCart}
            className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
            title="Add to cart"
          >
            <FaShoppingCart className="w-4 h-4" />
          </button>
          <button 
            onClick={handleQuickView}
            className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
            title="Quick view"
          >
            <FaEye className="w-4 h-4" />
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {product.stock <= 0 && (
            <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
              Out of Stock
            </div>
          )}
          {product.stock > 0 && product.stock <= 10 && (
            <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
              Low Stock
            </div>
          )}
          {product.brand && (
            <div className="bg-gray-800/80 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg backdrop-blur-sm">
              {product.brand.name}
            </div>
          )}
        </div>

        {/* Rating */}
        <div className="absolute bottom-3 left-3">
          <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-lg">
            <FaStar className="w-3 h-3 text-yellow-400" />
            <span className="text-xs font-medium text-gray-800">4.8</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <Link to={`/products/${product.id}`}>
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors duration-300">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description || 'High-quality custom t-shirt with unique design and comfortable fit.'}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-black">
              ₹{product.price}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-400 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
          
          {/* Stock Status */}
          <div className="text-right">
            {product.stock > 0 ? (
              <span className="text-sm text-green-600 font-medium">
                In Stock ({product.stock})
              </span>
            ) : (
              <span className="text-sm text-red-600 font-medium">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex space-x-2">
          <Link
            to={`/products/${product.id}`}
            className="flex-1 text-center bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-base"
          >
            View Details
          </Link>
          {product.stock > 0 && (
            <button
              onClick={handleAddToCart}
              className="bg-white/90 backdrop-blur-sm text-gray-800 font-semibold py-3 px-3 rounded-lg hover:bg-white transition-all duration-300 transform hover:scale-105 border-2 border-gray-200 hover:border-gray-300 shadow-lg text-base"
              title="Add to cart"
            >
              <FaShoppingCart className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span>Free Shipping</span>
          <span>30-Day Returns</span>
        </div>
      </div>
    </div>
  );
} 