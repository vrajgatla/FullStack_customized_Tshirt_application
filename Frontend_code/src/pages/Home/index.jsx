import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaStar, FaTshirt, FaPalette, FaUser, FaUserTie, FaGift, FaTruck, FaShieldAlt, FaChild } from 'react-icons/fa';

export default function Home() {
  const [designedTshirts, setDesignedTshirts] = useState([]);
  const [womensTshirts, setWomensTshirts] = useState([]);
  const [mensTshirts, setMensTshirts] = useState([]);
  const [childrensTshirts, setChildrensTshirts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [womensLoading, setWomensLoading] = useState(true);
  const [mensLoading, setMensLoading] = useState(true);
  const [childrensLoading, setChildrensLoading] = useState(true);

  useEffect(() => {
    fetch('/api/designed-tshirts')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setDesignedTshirts(data || []);
        setLoading(false);
      });
    
    // Fetch women's designed t-shirts
    fetch('/api/designed-tshirts/gender/Women')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setWomensTshirts(data || []);
        setWomensLoading(false);
      });

    // Fetch men's designed t-shirts
    fetch('/api/designed-tshirts/gender/Men')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setMensTshirts(data || []);
        setMensLoading(false);
      });

    // Fetch children's designed t-shirts
    fetch('/api/designed-tshirts/gender/Children')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setChildrensTshirts(data || []);
        setChildrensLoading(false);
      });
  }, []);

  return (
    <div className="w-full min-h-screen max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-8 bg-gradient-to-br from-blue-50 via-purple-50 to-white animate-fade-in">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-300 to-purple-300 rounded-2xl shadow-2xl p-4 sm:p-8 md:p-10 flex flex-col md:flex-row items-center justify-between mb-16 relative overflow-hidden">
        <div className="flex-1 mb-6 md:mb-0 z-10 min-w-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-blue-900 mb-4 md:mb-6 leading-tight drop-shadow-lg break-words">Discover Trending & Custom T-Shirts</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 md:mb-8 font-medium">Shop the latest trends or design your own unique tee!</p>
          <Link to="/custom-design" className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-bold shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-bounce text-base sm:text-lg">Create Your Own</Link>
        </div>
        {/* Show a customized t-shirt image from designed t-shirts */}
        {designedTshirts[0] && <img src={`/api/designed-tshirts/${designedTshirts[0].id}/image`} alt="Customized T-shirt" className="w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 object-cover rounded-2xl shadow-2xl z-10 hover:scale-105 transition-transform duration-300 max-w-full" onError={e => e.currentTarget.style.display = 'none'} />}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 to-purple-200/30 pointer-events-none rounded-2xl" />
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:scale-105 transition-transform duration-300">
          <FaPalette className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Custom Designs</h3>
          <p className="text-gray-600">Create your own unique t-shirt designs with our easy-to-use customizer</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:scale-105 transition-transform duration-300">
          <FaTruck className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Fast Delivery</h3>
          <p className="text-gray-600">Quick shipping and delivery to your doorstep</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:scale-105 transition-transform duration-300">
          <FaShieldAlt className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Quality Guarantee</h3>
          <p className="text-gray-600">Premium materials and craftsmanship guaranteed</p>
        </div>
      </div>

      {/* Designed T-Shirts Section */}
      <div className="mb-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">Designed T-Shirts</h2>
          <Link to="/designed-tshirts" className="text-blue-600 hover:text-blue-800 font-semibold text-lg flex items-center gap-2 hover:underline transition-colors duration-200">
            See All
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        {loading ? (
          <div className="text-gray-500 mt-8 text-center py-12">Loading designed t-shirts...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {designedTshirts.slice(0, 4).map((designedTshirt) => (
              <Link to={`/designed-tshirts/${designedTshirt.id}`} key={designedTshirt.id} className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                <div className="w-32 h-32 md:w-40 md:h-40 mb-4">
                  <img 
                    src={`/api/designed-tshirts/${designedTshirt.id}/image`} 
                    alt={designedTshirt.name} 
                    className="w-full h-full object-contain rounded-xl shadow max-w-full" 
                    onError={e => e.currentTarget.style.display = 'none'} 
                  />
                </div>
                <span className="text-lg font-semibold text-gray-700 text-center break-words mb-2">{designedTshirt.name}</span>
                <span className="text-blue-600 font-bold text-lg">${designedTshirt.price?.toFixed(2)}</span>
              </Link>
            ))}
          </div>
        )}
        {designedTshirts.length === 0 && !loading && (
          <div className="text-center py-16">
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

      {/* Women's Section */}
      <div className="mb-20">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <FaUser className="w-8 h-8 text-pink-600" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">Women's Collection</h2>
          </div>
          <Link to="/designed-tshirts?gender=Women" className="text-pink-600 hover:text-pink-800 font-semibold text-lg flex items-center gap-2 hover:underline transition-colors duration-200">
            Shop Women
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        {womensLoading ? (
          <div className="text-gray-500 mt-8 text-center py-12">Loading women's collection...</div>
        ) : womensTshirts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {womensTshirts.slice(0, 4).map((designedTshirt) => (
              <Link to={`/designed-tshirts/${designedTshirt.id}`} key={designedTshirt.id} className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                <div className="w-32 h-32 md:w-40 md:h-40 mb-4">
                  <img 
                    src={`/api/designed-tshirts/${designedTshirt.id}/image`} 
                    alt={designedTshirt.name} 
                    className="w-full h-full object-contain rounded-xl shadow max-w-full" 
                    onError={e => e.currentTarget.style.display = 'none'} 
                  />
                </div>
                <span className="text-lg font-semibold text-gray-700 text-center break-words mb-2">{designedTshirt.name}</span>
                <span className="text-pink-600 font-bold text-lg">${designedTshirt.price?.toFixed(2)}</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl">
            <div className="text-pink-400 mb-4">
              <FaUser className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No women's designs available yet</h3>
            <p className="text-gray-500 mb-4">Be the first to create a women's design!</p>
            <Link to="/custom-design?gender=Women" className="inline-block bg-pink-600 text-white px-6 py-3 rounded-xl font-bold shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300">
              Create Women's Design
            </Link>
          </div>
        )}
      </div>

      {/* Men's Section */}
      <div className="mb-20">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <FaUserTie className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">Men's Collection</h2>
          </div>
          <Link to="/designed-tshirts?gender=Men" className="text-blue-600 hover:text-blue-800 font-semibold text-lg flex items-center gap-2 hover:underline transition-colors duration-200">
            Shop Men
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        {mensLoading ? (
          <div className="text-gray-500 mt-8 text-center py-12">Loading men's collection...</div>
        ) : mensTshirts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {mensTshirts.slice(0, 4).map((designedTshirt) => (
              <Link to={`/designed-tshirts/${designedTshirt.id}`} key={designedTshirt.id} className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                <div className="w-32 h-32 md:w-40 md:h-40 mb-4">
                  <img 
                    src={`/api/designed-tshirts/${designedTshirt.id}/image`} 
                    alt={designedTshirt.name} 
                    className="w-full h-full object-contain rounded-xl shadow max-w-full" 
                    onError={e => e.currentTarget.style.display = 'none'} 
                  />
                </div>
                <span className="text-lg font-semibold text-gray-700 text-center break-words mb-2">{designedTshirt.name}</span>
                <span className="text-blue-600 font-bold text-lg">${designedTshirt.price?.toFixed(2)}</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
            <div className="text-blue-400 mb-4">
              <FaUserTie className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No men's designs available yet</h3>
            <p className="text-gray-500 mb-4">Be the first to create a men's design!</p>
            <Link to="/custom-design?gender=Men" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300">
              Create Men's Design
            </Link>
          </div>
        )}
      </div>

      {/* Children's Section */}
      <div className="mb-20">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <FaChild className="w-8 h-8 text-yellow-600" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">Children's Collection</h2>
          </div>
          <Link to="/designed-tshirts?gender=Children" className="text-yellow-600 hover:text-yellow-800 font-semibold text-lg flex items-center gap-2 hover:underline transition-colors duration-200">
            Shop Children
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        {childrensLoading ? (
          <div className="text-gray-500 mt-8 text-center py-12">Loading children's collection...</div>
        ) : childrensTshirts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {childrensTshirts.slice(0, 4).map((designedTshirt) => (
              <Link to={`/designed-tshirts/${designedTshirt.id}`} key={designedTshirt.id} className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                <div className="w-32 h-32 md:w-40 md:h-40 mb-4">
                  <img 
                    src={`/api/designed-tshirts/${designedTshirt.id}/image`} 
                    alt={designedTshirt.name} 
                    className="w-full h-full object-contain rounded-xl shadow max-w-full" 
                    onError={e => e.currentTarget.style.display = 'none'} 
                  />
                </div>
                <span className="text-lg font-semibold text-gray-700 text-center break-words mb-2">{designedTshirt.name}</span>
                <span className="text-yellow-600 font-bold text-lg">${designedTshirt.price?.toFixed(2)}</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl">
            <div className="text-yellow-400 mb-4">
              <FaChild className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No children's designs available yet</h3>
            <p className="text-gray-500 mb-4">Be the first to create a children's design!</p>
            <Link to="/custom-design?gender=Children" className="inline-block bg-yellow-600 text-white px-6 py-3 rounded-xl font-bold shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300">
              Create Children's Design
            </Link>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="mt-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-2xl p-12 text-center text-white">
        <h2 className="text-4xl font-bold mb-6">Ready to Create Your Own Design?</h2>
        <p className="text-xl mb-8 opacity-90">Join thousands of customers who have created their perfect t-shirt</p>
        <Link to="/custom-design" className="inline-block bg-white text-purple-600 px-8 py-4 rounded-xl font-bold shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 text-lg">
          Start Designing Now
        </Link>
      </div>
    </div>
  );
}
