import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export default function DesignedTshirtDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [designedTshirt, setDesignedTshirt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);
  const [addToCartMessage, setAddToCartMessage] = useState('');

  useEffect(() => {
    fetch(`/api/designed-tshirts/${id}`)
      .then(res => {
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Designed t-shirt not found. It may have been removed or is no longer available.');
          }
          throw new Error('Failed to load designed t-shirt. Please try again later.');
        }
        return res.json();
      })
      .then(data => {
        setDesignedTshirt(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setAddToCartMessage('Please select a size');
      return;
    }
    if (!selectedColor) {
      setAddToCartMessage('Please select a color');
      return;
    }

    setAddingToCart(true);
    setAddToCartMessage('');

    // Add to cart
    const cartItem = {
      id: designedTshirt.id,
      name: designedTshirt.name,
      price: designedTshirt.price,
      image: `/api/designed-tshirts/${designedTshirt.id}/image`,
      size: selectedSize,
      color: selectedColor,
      type: 'designed-tshirt',
      designId: designedTshirt.design?.id
    };

    addToCart(cartItem);
    setAddToCartMessage('Added to cart successfully!');
    
    setTimeout(() => {
      setAddingToCart(false);
      setAddToCartMessage('');
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading designed t-shirt...</div>
      </div>
    );
  }

  if (error || !designedTshirt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">😕</div>
          <div className="text-xl text-red-600 mb-4 font-semibold">Oops! Something went wrong</div>
          <div className="text-gray-600 mb-6">{error || 'Designed t-shirt not found'}</div>
          <div className="space-y-3">
            <Link 
              to="/designed-tshirts" 
              className="block bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Browse All Designed T-Shirts
            </Link>
            <Link 
              to="/" 
              className="block text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
            <li>/</li>
            <li><Link to="/designed-tshirts" className="hover:text-blue-600">Designed T-Shirts</Link></li>
            <li>/</li>
            <li className="text-gray-900">{designedTshirt.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <img 
                src={`/api/designed-tshirts/${designedTshirt.id}/image`} 
                alt={designedTshirt.name}
                className="w-full h-96 object-cover rounded-xl shadow-lg"
                onError={e => {
                  e.currentTarget.src = '/placeholder-design.svg';
                }}
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || !selectedSize || !selectedColor}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg ${
                  addingToCart || !selectedSize || !selectedColor
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:scale-105 hover:shadow-xl'
                }`}
              >
                {addingToCart ? 'Adding to Cart...' : 'Add to Cart'}
              </button>
              {user?.role === 'ADMIN' && (
                <Link
                  to={`/manage-designed-tshirts/edit/${designedTshirt.id}`}
                  className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 px-6 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg text-center"
                >
                  Edit Design
                </Link>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{designedTshirt.name}</h1>
              
              <div className="text-3xl font-bold text-blue-600 mb-6">
                ${designedTshirt.price?.toFixed(2)}
              </div>

              {designedTshirt.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{designedTshirt.description}</p>
                </div>
              )}

              {/* Specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {designedTshirt.brand && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Brand</span>
                    <p className="text-gray-900">{designedTshirt.brand.name}</p>
                  </div>
                )}
                
                {designedTshirt.color && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Color</span>
                    <p className="text-gray-900">{designedTshirt.color.name}</p>
                  </div>
                )}

                {designedTshirt.material && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Material</span>
                    <p className="text-gray-900">{designedTshirt.material}</p>
                  </div>
                )}

                {designedTshirt.fit && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Fit</span>
                    <p className="text-gray-900">{designedTshirt.fit}</p>
                  </div>
                )}

                {designedTshirt.sleeveType && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Sleeve Type</span>
                    <p className="text-gray-900">{designedTshirt.sleeveType}</p>
                  </div>
                )}

                {designedTshirt.neckType && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Neck Type</span>
                    <p className="text-gray-900">{designedTshirt.neckType}</p>
                  </div>
                )}

                {designedTshirt.gender && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Gender</span>
                    <p className="text-gray-900">{designedTshirt.gender}</p>
                  </div>
                )}

                {designedTshirt.stock !== null && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Stock</span>
                    <p className="text-gray-900">{designedTshirt.stock} units</p>
                  </div>
                )}
              </div>

              {/* Sizes */}
              {designedTshirt.sizes && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Select Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(designedTshirt.sizes) ? (
                      designedTshirt.sizes.map((size, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 ${
                            selectedSize === size
                              ? 'border-blue-600 bg-blue-600 text-white'
                              : 'border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-blue-50'
                          }`}
                        >
                          {size}
                        </button>
                      ))
                    ) : (
                      designedTshirt.sizes.split(',').map((size, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedSize(size.trim())}
                          className={`px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 ${
                            selectedSize === size.trim()
                              ? 'border-blue-600 bg-blue-600 text-white'
                              : 'border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-blue-50'
                          }`}
                        >
                          {size.trim()}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {designedTshirt.color && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Select Color</h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setSelectedColor(designedTshirt.color.name)}
                      className={`px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 ${
                        selectedColor === designedTshirt.color.name
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                    >
                      {designedTshirt.color.name}
                    </button>
                  </div>
                </div>
              )}

              {/* Tags */}
              {designedTshirt.tags && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(designedTshirt.tags) ? (
                      designedTshirt.tags.map((tag, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {tag}
                      </span>
                      ))
                    ) : (
                      designedTshirt.tags.split(',').map((tag, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {tag.trim()}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Design Details */}
              {designedTshirt.design && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Design Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">
                      <span className="font-medium">Design:</span> {designedTshirt.design.name}
                    </p>
                    {designedTshirt.customDesignName && (
                      <p className="text-gray-700">
                        <span className="font-medium">Custom Name:</span> {designedTshirt.customDesignName}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Compression Info */}
              {designedTshirt.compressionRatio && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Image Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">
                      <span className="font-medium">Compression Ratio:</span> {designedTshirt.compressionRatio}%
                    </p>
                    {designedTshirt.originalSize && (
                      <p className="text-gray-700">
                        <span className="font-medium">Original Size:</span> {designedTshirt.originalSize} KB
                      </p>
                    )}
                    {designedTshirt.compressedSize && (
                      <p className="text-gray-700">
                        <span className="font-medium">Compressed Size:</span> {designedTshirt.compressedSize} KB
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Admin Info */}
              {user?.role === 'ADMIN' && designedTshirt.createdBy && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Admin Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">
                      <span className="font-medium">Created by:</span> {designedTshirt.createdBy}
                    </p>
                    {designedTshirt.createdAt && (
                      <p className="text-gray-700">
                        <span className="font-medium">Created:</span> {new Date(designedTshirt.createdAt).toLocaleDateString()}
                      </p>
                    )}
                    {designedTshirt.updatedAt && (
                      <p className="text-gray-700">
                        <span className="font-medium">Last updated:</span> {new Date(designedTshirt.updatedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 