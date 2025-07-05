import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../Components/ProductCard';
import { FaFilter, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

// Mock data for filters
const mockBrands = [{ id: 1, name: 'TrendTee' }, { id: 2, name: 'CustomStyle' }];
const mockColors = [{ id: 1, name: 'Red' }, { id: 2, name: 'Blue' }, { id: 3, name: 'Black' }];
const mockGenders = ['All Genders', 'Men', 'Women', 'Kids', 'Unisex'];

function FilterSidebar({
  selectedGender,
  onGenderChange,
  selectedBrand,
  onBrandChange,
  selectedColor,
  onColorChange,
  searchQuery,
  onSearchChange,
  brands,
  colors
}) {
  return (
    <aside className="w-64 bg-white rounded-xl shadow-lg p-6">
      <h3 className="font-bold text-xl mb-4 text-gray-800">Filters</h3>
      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search designs..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
      </div>
      {/* Gender Filter */}
      <div className="mb-6">
        <h4 className="font-semibold mb-2">Gender</h4>
        <div className="flex flex-col gap-2">
          {mockGenders.map(g => (
            <label key={g} className="flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                value={g}
                checked={selectedGender === g || (!selectedGender && g === 'All Genders')}
                onChange={() => onGenderChange(g === 'All Genders' ? '' : g)}
                className="text-pink-500"
              />
              {g}
            </label>
          ))}
        </div>
      </div>
      {/* Brand Filter */}
      <div className="mb-6">
        <h4 className="font-semibold mb-2">Brand</h4>
        <select value={selectedBrand} onChange={e => onBrandChange(e.target.value)} className="w-full p-2 border rounded-lg">
          <option value="">All Brands</option>
          {brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
        </select>
      </div>
      {/* Color Filter */}
      <div className="mb-6">
        <h4 className="font-semibold mb-2">Color</h4>
        <select value={selectedColor} onChange={e => onColorChange(e.target.value)} className="w-full p-2 border rounded-lg">
          <option value="">All Colors</option>
          {colors.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
      </div>
    </aside>
  );
}

function ProductGrid({ products, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-6">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-4 animate-pulse">
            <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
            <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
            <div className="bg-gray-200 h-6 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className="text-center py-16 col-span-full">
        <div className="text-6xl mb-4">☹️</div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Products Found</h2>
        <p className="text-gray-600">Try adjusting your filters to find what you're looking for.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} type="designed-tshirt" />
      ))}
    </div>
  );
}

export default function DesignedTshirts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const itemsPerPage = 12;

  useEffect(() => {
    // On mount, set gender from URL if present
    const genderParam = searchParams.get('gender');
    if (genderParam && ['Men', 'Women', 'Kids', 'Unisex'].includes(genderParam)) {
      setSelectedGender(genderParam);
    }
  }, [searchParams]);

  useEffect(() => {
    // Fetch brands and colors for filters
    Promise.all([
      fetch('/api/brands').then(res => res.json()),
      fetch('/api/colors').then(res => res.json())
    ]).then(([brandsData, colorsData]) => {
      setBrands(Array.isArray(brandsData) ? brandsData : []);
      setColors(Array.isArray(colorsData) ? colorsData : []);
    });
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `/api/designed-tshirts/page?page=${currentPage - 1}&size=${itemsPerPage}`;
      if (selectedGender) url += `&gender=${encodeURIComponent(selectedGender)}`;
      if (selectedBrand) url += `&brand=${encodeURIComponent(selectedBrand)}`;
      if (selectedColor) url += `&color=${encodeURIComponent(selectedColor)}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch designed t-shirts');
      }
      const data = await response.json();
      const productsData = data.content || [];
      setProducts(productsData);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error('Error fetching designed t-shirts:', err);
      toast.error('Could not load designed t-shirts');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products whenever a filter changes
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
    fetchProducts();
    // eslint-disable-next-line
  }, [selectedGender, selectedBrand, selectedColor, searchQuery]);

  // Fetch products when page changes
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    const pages = [];

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6 rounded-lg shadow">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, totalElements)}
              </span>{' '}
              of <span className="font-medium">{totalElements}</span> results
            </p>
          </div>
          
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {pages.map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    page === currentPage
                      ? 'z-10 bg-purple-50 border-purple-500 text-purple-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Designed T-Shirts</h1>
        <p className="text-lg text-gray-600 mt-2">Explore unique T-shirts created by our talented community.</p>
      </div>
      <div className="flex gap-8">
        <FilterSidebar
          selectedGender={selectedGender}
          onGenderChange={setSelectedGender}
          selectedBrand={selectedBrand}
          onBrandChange={setSelectedBrand}
          selectedColor={selectedColor}
          onColorChange={setSelectedColor}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          brands={brands}
          colors={colors}
        />
        <div className="flex-1">
          <ProductGrid products={products} loading={loading} />
          {renderPagination()}
        </div>
      </div>
    </div>
  );
} 