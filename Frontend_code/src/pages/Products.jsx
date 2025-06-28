import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { FaTshirt, FaPalette, FaShoppingCart, FaEye, FaStar, FaSearch } from 'react-icons/fa';
import apiService from '../utils/api';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { isAuthenticated, token } = useAuth();
  
  // Main state
  const [activeTab, setActiveTab] = useState('tshirts'); // 'tshirts' or 'designs'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // T-Shirts state
  const [tshirts, setTshirts] = useState([]);
  const [tshirtsPage, setTshirtsPage] = useState(1);
  const [tshirtsTotalPages, setTshirtsTotalPages] = useState(1);
  const [tshirtsSearch, setTshirtsSearch] = useState('');
  
  // Designs state
  const [designs, setDesigns] = useState([]);
  const [designsPage, setDesignsPage] = useState(1);
  const [designsTotalPages, setDesignsTotalPages] = useState(1);
  const [designsSearch, setDesignsSearch] = useState('');

  const itemsPerPage = 12;

  useEffect(() => {
    if (activeTab === 'tshirts') {
      fetchTshirts();
    } else {
      fetchDesigns();
    }
  }, [activeTab, tshirtsPage, tshirtsSearch, designsPage, designsSearch]);

  const fetchTshirts = async () => {
    try {
      setLoading(true);
      const params = {
        page: tshirtsPage - 1,
        size: itemsPerPage,
        search: tshirtsSearch
      };
      
      const data = await apiService.getProducts(params);
      setTshirts(data.content || data);
      setTshirtsTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Error fetching t-shirts:', err);
      setError('Failed to load t-shirts');
    } finally {
      setLoading(false);
    }
  };

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      const params = {
        page: designsPage - 1,
        size: itemsPerPage,
        search: designsSearch
      };
      
      const data = await apiService.getDesigns(params);
      setDesigns(data.content || data);
      setDesignsTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Error fetching designs:', err);
      setError('Failed to load designs');
    } finally {
      setLoading(false);
    }
  };

  const handleTshirtsSearch = (e) => {
    e.preventDefault();
    setTshirtsPage(1);
  };

  const handleDesignsSearch = (e) => {
    e.preventDefault();
    setDesignsPage(1);
  };

  const handleAddToCart = (item, type) => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }
    
    const cartItem = {
      id: type === 'tshirt' ? `tshirt-${item.id}` : `design-${item.id}`,
      productId: item.id,
      name: item.name,
      price: item.price || 0,
      image: type === 'tshirt' ? `/api/tshirts/${item.id}/image` : `/api/designs/${item.id}/image`,
      quantity: 1,
      isCustom: false,
      isDesign: type === 'design'
    };
    
    addToCart(cartItem);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="bg-gray-300 h-8 rounded mb-6"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={`skeleton-${i}`} className="bg-gray-300 h-80 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Shop Now</h1>
        <p className="text-lg text-gray-600">Choose what you want to explore</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 rounded-xl p-2 flex gap-2">
          <button
            onClick={() => handleTabChange('tshirts')}
            className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'tshirts'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <FaTshirt className="text-lg" />
            T-Shirts
          </button>
          <button
            onClick={() => handleTabChange('designs')}
            className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'designs'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <FaPalette className="text-lg" />
            Designs
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* T-Shirts Section */}
      {activeTab === 'tshirts' && (
        <div>
          {/* Search */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <form onSubmit={handleTshirtsSearch} className="flex gap-4">
              <input
                type="text"
                placeholder="Search for t-shirts..."
                value={tshirtsSearch}
                onChange={(e) => setTshirtsSearch(e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition flex items-center gap-2"
              >
                <FaSearch />
                Search
              </button>
            </form>
          </div>

          {/* T-Shirts Grid */}
          {tshirts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👕</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">No T-Shirts Found</h2>
              <p className="text-gray-600">Try adjusting your search terms</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {tshirts.map((tshirt) => (
                  <div key={tshirt.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                    <div className="relative">
                      <img
                        src={`/api/tshirts/${tshirt.id}/image`}
                        alt={tshirt.name}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = '/default-tshirt.svg';
                          e.target.onerror = null;
                        }}
                      />
                      {tshirt.isCustomizable && (
                        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                          CUSTOMIZABLE
                        </div>
                      )}
                      {tshirt.stock < 10 && tshirt.stock > 0 && (
                        <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                          Low Stock
                        </div>
                      )}
                      {tshirt.stock === 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          Out of Stock
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{tshirt.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{tshirt.brand?.name}</p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-blue-600">${tshirt.price?.toFixed(2)}</span>
                        <div className="flex items-center gap-1">
                          <FaStar className="text-yellow-400 text-sm" />
                          <span className="text-sm text-gray-600">4.8</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {tshirt.isCustomizable ? (
                          <Link
                            to={`/customize/${tshirt.id}`}
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-center font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
                          >
                            <FaPalette />
                            Customize
                          </Link>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(tshirt, 'tshirt')}
                            disabled={tshirt.stock === 0}
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            <FaShoppingCart />
                            Add to Cart
                          </button>
                        )}
                        <Link
                          to={`/products/${tshirt.id}`}
                          className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition flex items-center justify-center"
                        >
                          <FaEye />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* T-Shirts Pagination */}
              {tshirtsTotalPages > 1 && (
                <div className="flex justify-center">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTshirtsPage(Math.max(1, tshirtsPage - 1))}
                      disabled={tshirtsPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    
                    {[...Array(tshirtsTotalPages)].map((_, i) => (
                      <button
                        key={`tshirt-page-${i + 1}`}
                        onClick={() => setTshirtsPage(i + 1)}
                        className={`px-4 py-2 border rounded-lg ${
                          tshirtsPage === i + 1
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setTshirtsPage(Math.min(tshirtsTotalPages, tshirtsPage + 1))}
                      disabled={tshirtsPage === tshirtsTotalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Designs Section */}
      {activeTab === 'designs' && (
        <div>
          {/* Search */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <form onSubmit={handleDesignsSearch} className="flex gap-4">
              <input
                type="text"
                placeholder="Search for designs..."
                value={designsSearch}
                onChange={(e) => setDesignsSearch(e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-purple-700 transition flex items-center gap-2"
              >
                <FaSearch />
                Search
              </button>
            </form>
          </div>

          {/* Designs Grid */}
          {designs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎨</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Designs Found</h2>
              <p className="text-gray-600">Try adjusting your search terms</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {designs.map((design) => (
                  <div key={design.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                    <div className="relative">
                      <img
                        src={`/api/designs/${design.id}/image`}
                        alt={design.name}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = '/placeholder-design.svg';
                          e.target.onerror = null;
                        }}
                      />
                      <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                        DESIGN
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{design.name}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{design.description}</p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-purple-600">${design.price?.toFixed(2) || 'Free'}</span>
                        <div className="flex items-center gap-1">
                          <FaStar className="text-yellow-400 text-sm" />
                          <span className="text-sm text-gray-600">4.9</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Link
                          to={`/custom-design?design=${design.id}`}
                          className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg text-center font-medium hover:bg-purple-700 transition flex items-center justify-center gap-2"
                        >
                          <FaPalette />
                          Use Design
                        </Link>
                        <button
                          onClick={() => handleAddToCart(design, 'design')}
                          className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition flex items-center justify-center"
                        >
                          <FaShoppingCart />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Designs Pagination */}
              {designsTotalPages > 1 && (
                <div className="flex justify-center">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDesignsPage(Math.max(1, designsPage - 1))}
                      disabled={designsPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    
                    {[...Array(designsTotalPages)].map((_, i) => (
                      <button
                        key={`design-page-${i + 1}`}
                        onClick={() => setDesignsPage(i + 1)}
                        className={`px-4 py-2 border rounded-lg ${
                          designsPage === i + 1
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setDesignsPage(Math.min(designsTotalPages, designsPage + 1))}
                      disabled={designsPage === designsTotalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
} 