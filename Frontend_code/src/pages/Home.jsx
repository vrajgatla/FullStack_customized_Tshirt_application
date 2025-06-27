import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.ok ? res.json() : [])
      .then(data => setCategories(data || []));
    fetch('/api/tshirts/trending')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setTrending(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full min-h-screen max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 bg-gradient-to-br from-blue-50 via-purple-50 to-white animate-fade-in">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-300 to-purple-300 rounded-2xl shadow-2xl p-4 sm:p-8 md:p-10 flex flex-col md:flex-row items-center justify-between mb-8 md:mb-12 relative overflow-hidden">
        <div className="flex-1 mb-6 md:mb-0 z-10 min-w-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-blue-900 mb-4 md:mb-6 leading-tight drop-shadow-lg break-words">Discover Trending & Custom T-Shirts</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 md:mb-8 font-medium">Shop the latest trends or design your own unique tee!</p>
          <Link to="/custom-design" className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-bold shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-bounce text-base sm:text-lg">Create Your Own</Link>
        </div>
        {/* Optionally show a hero image from trending or categories */}
        {trending[0] && <img src={`/api/tshirts/${trending[0].id}/image`} alt="Hero T-shirt" className="w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 object-cover rounded-2xl shadow-2xl z-10 hover:scale-105 transition-transform duration-300 max-w-full" onError={e => e.currentTarget.style.display = 'none'} />}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 to-purple-200/30 pointer-events-none rounded-2xl" />
      </div>
      {/* Featured Categories */}
      <div className="mb-8 md:mb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-4 sm:mb-6 tracking-tight">Featured Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {categories.map((cat) => {
            const isTshirts = cat.name && cat.name.toLowerCase().includes('t-shirt');
            const isDesigns = cat.name && cat.name.toLowerCase().includes('design');
            if (isTshirts) {
              return (
                <Link to="/products" key={cat.id + '-' + cat.name} className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                  <img src={cat.image} alt={cat.name} className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 object-cover rounded-full mb-2 sm:mb-3 shadow-lg max-w-full" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/fallback-category.png'; }} />
                  <span className="text-lg sm:text-xl font-semibold text-gray-700 tracking-wide text-center break-words">{cat.name || cat}</span>
                </Link>
              );
            } else if (isDesigns) {
              return (
                <Link to="/designs" key={cat.id + '-' + cat.name} className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                  <img src={cat.image} alt={cat.name} className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 object-cover rounded-full mb-2 sm:mb-3 shadow-lg max-w-full" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/fallback-category.png'; }} />
                  <span className="text-lg sm:text-xl font-semibold text-gray-700 tracking-wide text-center break-words">{cat.name || cat}</span>
                </Link>
              );
            } else {
              return (
                <div key={cat.id + '-' + cat.name} className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                  <img src={cat.image} alt={cat.name} className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 object-cover rounded-full mb-2 sm:mb-3 shadow-lg max-w-full" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/fallback-category.png'; }} />
                  <span className="text-lg sm:text-xl font-semibold text-gray-700 tracking-wide text-center break-words">{cat.name || cat}</span>
                </div>
              );
            }
          })}
        </div>
      </div>
      {/* Trending Products */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-4 sm:mb-6 tracking-tight">Trending Now</h2>
        {loading ? (
          <div className="text-gray-500 mt-8">Loading trending products...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {trending.slice(0, 4).map((prod) => (
              <Link to={`/products/${prod.id}`} key={prod.id} className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                <img src={`/api/tshirts/${prod.id}/image`} alt={prod.name} className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 object-cover rounded-xl mb-2 sm:mb-3 shadow max-w-full" onError={e => e.currentTarget.style.display = 'none'} />
                <span className="text-base sm:text-lg font-semibold text-gray-700 text-center break-words">{prod.name}</span>
                <span className="text-blue-600 font-bold mt-1 sm:mt-2 text-base sm:text-lg">${prod.price?.toFixed(2)}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 