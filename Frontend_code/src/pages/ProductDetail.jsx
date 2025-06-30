import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import ProductCard from '../Components/ProductCard';
import { FaShoppingCart, FaPalette, FaShieldAlt, FaStar, FaTags } from 'react-icons/fa';

// Mock related products
const mockRelatedProducts = [
  { id: 101, name: 'Urban Explorer Tee', price: 24.99, imageUrl: '/default-tshirt.svg' },
  { id: 102, name: 'Vintage Vibe Tee', price: 22.99, imageUrl: '/default-tshirt.svg' },
  { id: 103, name: 'Artisan Sketch Tee', price: 29.99, imageUrl: '/default-tshirt.svg' },
  { id: 104, name: 'Graffiti Pop Tee', price: 27.99, imageUrl: '/default-tshirt.svg' },
];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  const [relatedProducts, setRelatedProducts] = useState(mockRelatedProducts);

  useEffect(() => {
    fetch(`/api/tshirts/id/${id}`)
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => {
        setProduct(data);
        setMainImage(data.imageUrl);
        setSelectedSize(data.sizes?.[0] || '');
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load product. It may no longer exist.');
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log('Added to cart:', { id, selectedSize, quantity });
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error || !product) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <img src={mainImage || '/default-tshirt.svg'} alt={product.name} className="w-full h-[400px] lg:h-[500px] object-contain rounded-lg" />
          </div>

          {/* Product Info */}
          <div>
            <p className="text-gray-500 font-semibold">{product.brand?.name}</p>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-800 mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-400"><FaStar /><FaStar /><FaStar /><FaStar /><FaStar /></div>
              <span className="text-gray-600">(98 Reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-pink-600">₹{product.price.toFixed(2)}</span>
              <span className="text-gray-400 line-through">₹{(product.price * 1.4).toFixed(2)}</span>
              <span className="text-green-500 font-bold">(30% OFF)</span>
            </div>

            {/* Size Selector */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">Select Size</h3>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map(size => (
                  <button key={size} onClick={() => setSelectedSize(size)} className={`px-6 py-2 border-2 rounded-lg font-bold transition-all duration-200 ${selectedSize === size ? 'bg-pink-500 text-white border-pink-500' : 'border-gray-300 hover:border-pink-400'}`}>{size}</button>
                ))}
              </div>
            </div>

            {/* Actions: Desktop */}
            <div className="hidden md:flex items-center gap-4">
              <button onClick={handleAddToCart} className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 rounded-lg shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2">
                <FaShoppingCart /> Add to Cart
              </button>
              {product.isCustomizable && (
                <Link to={`/customize/${product.id}`} className="flex-1 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-bold py-3 rounded-lg shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2">
                  <FaPalette /> Customize
                </Link>
              )}
            </div>

            {/* Trust Badges */}
            <div className="bg-white p-4 rounded-xl shadow-sm mt-8 border">
              <div className="flex items-center gap-4 text-sm mt-3">
                <FaShieldAlt className="text-blue-500 w-6 h-6" />
                <div>
                  <h4 className="font-bold">100% Original Guarantee</h4>
                  <p className="text-gray-600">Authentic products sourced directly.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* You Might Also Like */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </div>

      {/* Sticky Action Bar (Mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white p-4 border-t-2 shadow-up z-40 flex gap-4">
        {product.isCustomizable && (
          <Link to={`/customize/${product.id}`} className="flex-1 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2">
            <FaPalette /> Customize
          </Link>
        )}
        <button onClick={handleAddToCart} className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2">
          <FaShoppingCart /> Add to Cart
        </button>
      </div>
    </div>
  );
} 