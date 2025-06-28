import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [designedTshirts, setDesignedTshirts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/designed-tshirts')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setDesignedTshirts(data || []);
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
        {/* Show a customized t-shirt image from designed t-shirts */}
        {designedTshirts[0] && <img src={`/api/designed-tshirts/${designedTshirts[0].id}/image`} alt="Customized T-shirt" className="w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 object-cover rounded-2xl shadow-2xl z-10 hover:scale-105 transition-transform duration-300 max-w-full" onError={e => e.currentTarget.style.display = 'none'} />}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 to-purple-200/30 pointer-events-none rounded-2xl" />
      </div>

      {/* Designed T-Shirts Section */}
      <div>
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">Designed T-Shirts</h2>
          <Link to="/designed-tshirts" className="text-blue-600 hover:text-blue-800 font-semibold text-sm sm:text-base flex items-center gap-1 hover:underline transition-colors duration-200">
            See All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        {loading ? (
          <div className="text-gray-500 mt-8">Loading designed t-shirts...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {designedTshirts.slice(0, 4).map((designedTshirt) => (
              <Link to={`/designed-tshirts/${designedTshirt.id}`} key={designedTshirt.id} className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                <img src={`/api/designed-tshirts/${designedTshirt.id}/image`} alt={designedTshirt.name} className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 object-cover rounded-xl mb-2 sm:mb-3 shadow max-w-full" onError={e => e.currentTarget.style.display = 'none'} />
                <span className="text-base sm:text-lg font-semibold text-gray-700 text-center break-words">{designedTshirt.name}</span>
                <span className="text-blue-600 font-bold mt-1 sm:mt-2 text-base sm:text-lg">${designedTshirt.price?.toFixed(2)}</span>
              </Link>
            ))}
          </div>
        )}
        {designedTshirts.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No designed t-shirts available</h3>
            <p className="text-gray-500 mb-4">Be the first to create a custom design!</p>
            <Link to="/custom-design" className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300">
              Create Your First Design
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
