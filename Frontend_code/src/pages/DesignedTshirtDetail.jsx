import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import ProductCard from '../Components/ProductCard';
import { FaShoppingCart, FaHeart, FaShieldAlt, FaStar, FaTags } from 'react-icons/fa';
import SizeChart from '../Components/SizeChart';
import FeaturedProductsCarousel from '../pages/Home/components/FeaturedProductsCarousel';

export default function DesignedTshirtDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [designedTshirt, setDesignedTshirt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  const [designedTshirts, setDesignedTshirts] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/designed-tshirts/${id}`)
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => {
        if (!data) {
          setError('Product not found.');
          setLoading(false);
          return;
        }
        setDesignedTshirt(data);
        // Use main image from images array if present
        let mainImg = data.imageUrl || '/default-tshirt.svg';
        if (data.images && data.images.length > 0) {
          mainImg = data.images.find(img => img.isMain)?.imageUrl || data.images[0].imageUrl;
        }
        setMainImage(mainImg);
        setSelectedSize((data.sizes && data.sizes[0]) || '');
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load product. It may no longer exist.');
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    fetch('/api/designed-tshirts')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setDesignedTshirts(data || []);
        setTrendingLoading(false);
      });
  }, []);

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log('Added to cart:', { id, selectedSize, quantity });
  };

  const availableSizes = designedTshirt?.tshirt?.sizes || ['S', 'M', 'L', 'XL', 'XXL'];

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (error || !designedTshirt) {
    return <div className="text-center py-20 text-red-500">{error || "Product not found."}</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <img 
                src={mainImage || '/default-tshirt.svg'} 
                alt={designedTshirt.name}
                className="w-full h-[400px] lg:h-[500px] object-contain rounded-lg"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {/* Show all images from images array if present */}
              {designedTshirt.images && designedTshirt.images.length > 0
                ? designedTshirt.images.map((img, idx) => (
                    <img key={idx} src={img.imageUrl} alt={`thumbnail-${idx}`} className="w-full h-24 object-contain rounded-lg cursor-pointer border-2 hover:border-pink-500" onClick={() => setMainImage(img.imageUrl)} />
                  ))
                : [
                    designedTshirt.imageUrl,
                    designedTshirt.design?.imageUrl,
                    designedTshirt.tshirt?.imageUrl
                  ].map((img, idx) => (
                    img && <img key={idx} src={img} alt={`thumbnail-${idx}`} className="w-full h-24 object-contain rounded-lg cursor-pointer border-2 hover:border-pink-500" onClick={() => setMainImage(img)} />
                  ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-2xl lg:text-4xl font-extrabold text-gray-900 mb-2">{designedTshirt.name}</h1>
            <p className="text-sm text-gray-500 mb-4">{designedTshirt.description}</p>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-400"><FaStar /><FaStar /><FaStar /><FaStar /><FaStar /></div>
              <span className="text-sm text-gray-600">(125 Reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-2xl font-extrabold text-pink-600">
                {typeof designedTshirt.price === 'number' && designedTshirt.price !== null
                  ? `₹${designedTshirt.price.toFixed(2)}`
                  : 'N/A'}
              </span>
              <span className="text-base text-gray-400 line-through">
                {typeof designedTshirt.price === 'number' && designedTshirt.price !== null
                  ? `₹${(designedTshirt.price * 1.4).toFixed(2)}`
                  : ''}
              </span>
              <span className="text-sm text-green-500 font-bold">(30% OFF)</span>
            </div>

            {/* Size Selector */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-2 text-gray-800">Select Size</h3>
              <div className="flex flex-wrap gap-3">
                {availableSizes.map(size => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-2 border-2 rounded-lg font-bold transition-all duration-200 ${selectedSize === size ? 'bg-pink-500 text-white border-pink-500' : 'border-gray-300 hover:border-pink-400'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions: Desktop */}
            <div className="hidden md:flex items-center gap-4">
              <button onClick={handleAddToCart} className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 rounded-lg shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2">
                <FaShoppingCart /> Add to Cart
              </button>
              <button className="bg-white text-pink-500 border-2 border-pink-500 font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-pink-50 transition-all flex items-center justify-center gap-2">
                <FaHeart /> Wishlist
              </button>
            </div>

            {/* Trust Badges */}
            <div className="bg-white p-4 rounded-xl shadow-sm mt-8 border">
              <div className="flex items-center gap-4 text-sm">
                <FaTags className="text-green-500 w-6 h-6" />
                <div>
                  <h4 className="font-bold">Best Price Guaranteed</h4>
                  <p className="text-gray-600">Find a lower price and we'll match it.</p>
                </div>
              </div>
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

        {/* SizeChart: Desktop only, before You Might Also Like */}
        <div className="hidden md:block mt-8">
          <SizeChart />
        </div>
        {/* SizeChart: Mobile only, before You Might Also Like */}
        <div className="block md:hidden mt-4 mb-8 px-4">
          <SizeChart />
        </div>
        {/* You Might Also Like (Trending Now) */}
        <div className="mt-20">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">Trending Now</h2>
            <Link to="/designed-tshirts" className="text-pink-600 hover:text-purple-600 font-semibold text-lg flex items-center gap-2 hover:underline transition-colors duration-200">
              See All
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
          {trendingLoading ? (
            <div className="text-gray-500 mt-8 text-center py-12">Loading latest trends...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {designedTshirts.slice(0, 4).map((designedTshirt) => (
                <ProductCard key={designedTshirt.id} product={designedTshirt} type="designed-tshirt" />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Add to Cart Bar (Mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white p-4 border-t-2 shadow-up z-40 flex gap-4">
        <button className="flex-1 bg-white text-pink-500 border-2 border-pink-500 font-bold py-3 rounded-lg flex items-center justify-center gap-2">
          <FaHeart /> Wishlist
        </button>
        <button onClick={handleAddToCart} className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2">
          <FaShoppingCart /> Add to Cart
        </button>
      </div>
    </div> 
  );
} 