import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/tshirts/${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Product not found');
        }
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setSelectedSize(data.sizes?.[0] || '');
        setSelectedColor(data.color?.name || '');
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching product:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      setError('Please select both size and color');
      return;
    }

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      brand: product.brand?.name,
      color: selectedColor,
      size: selectedSize,
      tshirtImg: `/api/tshirts/${product.id}/image`,
      quantity: quantity
    };

    addToCart(cartItem);
    setError('');
    // Show success message or redirect to cart
    navigate('/cart');
  };

  const handleCustomize = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/customize/${product.id}`);
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="animate-pulse">
          <div className="bg-gray-300 h-80 rounded-xl mb-4"></div>
          <div className="bg-gray-300 h-8 rounded mb-2"></div>
          <div className="bg-gray-300 h-6 rounded mb-4"></div>
          <div className="bg-gray-300 h-4 rounded mb-2"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 text-center">
        <div className="text-red-600 text-lg mb-4">
          {error || 'Product not found'}
        </div>
        <Link 
          to="/products" 
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-2 sm:p-4 flex flex-col md:flex-row gap-4 md:gap-8">
      <div className="md:w-1/2">
        <img 
          src={`/api/tshirts/${product.id}/image`} 
          alt={product.name} 
          className="w-full max-w-xs sm:max-w-sm md:w-full md:h-80 object-cover rounded-xl shadow mb-4 md:mb-0 mx-auto" 
          onError={(e) => {
            e.target.src = '/default-tshirt.svg';
            e.target.onerror = null; // Prevent infinite loop
          }}
        />
      </div>
      
      <div className="md:w-1/2 flex flex-col justify-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 break-words">{product.name}</h1>
        <div className="text-base sm:text-lg text-gray-600 mb-2">Brand: {product.brand?.name}</div>
        <div className="text-base sm:text-lg text-gray-600 mb-2">Color: {product.color?.name}</div>
        <div className="text-xl sm:text-2xl text-blue-700 font-bold mb-4">${product.price?.toFixed(2)}</div>
        
        {product.description && (
          <p className="mb-6 text-gray-700 text-sm sm:text-base break-words">{product.description}</p>
        )}

        {/* Product Type Badge */}
        {product.isCustomizable && (
          <div className="mb-4">
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
              ✨ Customizable
            </span>
          </div>
        )}

        {/* Size Selection */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Size:</label>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded-lg font-medium transition ${
                    selectedSize === size
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color Selection */}
        {product.color && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Color:</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedColor(product.color.name)}
                className={`px-4 py-2 border rounded-lg font-medium transition ${
                  selectedColor === product.color.name
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {product.color.name}
              </button>
            </div>
          </div>
        )}

        {/* Quantity Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Quantity:</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition flex items-center justify-center"
            >
              -
            </button>
            <span className="w-12 text-center font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-600 text-sm mb-4">{error}</div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <button 
            onClick={handleAddToCart}
            className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition flex-1"
          >
            Add to Cart
          </button>
          {product.isCustomizable && (
            <button 
              onClick={handleCustomize}
              className="bg-green-600 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold shadow hover:bg-green-700 transition flex-1"
            >
              Customize Design
            </button>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Product Features</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              High-quality cotton material
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Durable printing technology
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Machine washable
            </li>
            {product.isCustomizable && (
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Fully customizable design
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
} 