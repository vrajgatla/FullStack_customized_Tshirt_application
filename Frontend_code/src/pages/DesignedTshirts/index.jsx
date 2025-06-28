import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { FaShoppingCart, FaEye } from 'react-icons/fa';

export default function DesignedTshirts() {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [designedTshirts, setDesignedTshirts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    fetchBrands();
    fetchColors();
  }, []);

  useEffect(() => {
    fetchDesignedTshirts();
  }, [currentPage, searchTerm, selectedBrand, selectedColor]);

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/brands');
      if (response.ok) {
        const data = await response.json();
        setBrands(data);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const fetchColors = async () => {
    try {
      const response = await fetch('/api/colors');
      if (response.ok) {
        const data = await response.json();
        setColors(data);
      }
    } catch (error) {
      console.error('Error fetching colors:', error);
    }
  };

  const fetchDesignedTshirts = async () => {
    setLoading(true);
    try {
      let url = `/api/designed-tshirts/page?page=${currentPage}&size=12`;
      
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      if (selectedBrand) {
        url += `&brand=${encodeURIComponent(selectedBrand)}`;
      }
      if (selectedColor) {
        url += `&color=${encodeURIComponent(selectedColor)}`;
      }

      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        setDesignedTshirts(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      } else {
        console.error('Failed to fetch designed t-shirts:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching designed t-shirts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedBrand('');
    setSelectedColor('');
    setCurrentPage(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Designed T-Shirts</h1>
          <p className="text-lg text-gray-600">Discover our collection of custom designed t-shirts</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <input
                  type="text"
                  placeholder="Search designed t-shirts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Brand Filter */}
              <div>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Brands</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.name}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Color Filter */}
              <div>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Colors</option>
                  {colors.map((color) => (
                    <option key={color.id} value={color.name}>
                      {color.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-6 rounded-lg font-semibold hover:scale-105 transition-all duration-300"
              >
                Search
              </button>
              <button
                type="button"
                onClick={clearFilters}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300"
              >
                Clear Filters
              </button>
            </div>
          </form>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {designedTshirts.length} of {totalElements} designed t-shirts
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">Loading designed t-shirts...</div>
          </div>
        )}

        {/* No Results */}
        {!loading && designedTshirts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600 mb-4">No designed t-shirts found</div>
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Designed T-Shirts Grid */}
        {!loading && designedTshirts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {designedTshirts.map((designedTshirt) => (
              <div key={designedTshirt.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:scale-105 transition-all duration-300">
                {/* Image */}
                <div className="relative">
                  <img
                    src={`/api/designed-tshirts/${designedTshirt.id}/image`}
                    alt={designedTshirt.name}
                    className="w-full h-64 object-cover"
                    onError={e => {
                      e.currentTarget.src = '/placeholder-design.svg';
                    }}
                  />
                  {designedTshirt.featured && (
                    <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Featured
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                    {designedTshirt.name}
                  </h3>
                  
                  <div className="text-2xl font-bold text-blue-600 mb-3">
                    ${designedTshirt.price?.toFixed(2)}
                  </div>

                  <div className="space-y-2 mb-4">
                    {designedTshirt.brand && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Brand:</span> {designedTshirt.brand.name}
                      </p>
                    )}
                    {designedTshirt.color && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Color:</span> {designedTshirt.color.name}
                      </p>
                    )}
                    {designedTshirt.material && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Material:</span> {designedTshirt.material}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    <Link
                      to={`/designed-tshirts/${designedTshirt.id}`}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-semibold text-center hover:scale-105 transition-all duration-300"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            
            <span className="px-4 py-2 text-gray-600">
              Page {currentPage + 1} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 