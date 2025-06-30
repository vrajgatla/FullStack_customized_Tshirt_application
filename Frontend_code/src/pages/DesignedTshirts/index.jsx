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
    <aside className="w-full md:w-64 lg:w-72 flex-shrink-0 bg-white rounded-xl shadow-lg p-6">
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
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} type="designed-tshirt" />
      ))}
    </div>
  );
}

export default function DesignedTshirts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [searchParams] = useSearchParams();

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
      let url = '/api/designed-tshirts/page?page=0&size=12';
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
    fetchProducts();
    // eslint-disable-next-line
  }, [selectedGender, selectedBrand, selectedColor, searchQuery]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Community Designs</h1>
        <p className="text-lg text-gray-600 mt-2">Explore unique T-shirts created by our talented community.</p>
        </div>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Mobile Filter Button */}
        <div className="md:hidden flex justify-between items-center">
              <button
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow font-semibold"
          >
            <FaFilter className="text-pink-500" /> Filters
              </button>
        </div>
        {/* Mobile Filter Overlay */}
        {showFilters && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setShowFilters(false)}></div>
        )}
        <div className={`fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white z-50 transform ${showFilters ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:hidden overflow-y-auto`}>
          <div className="p-4">
            <button onClick={() => setShowFilters(false)} className="absolute top-4 right-4 text-2xl"><FaTimes /></button>
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
          </div>
        </div>
        {/* Desktop Filters */}
        <div className="hidden md:block">
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
                  </div>
        {/* Products Grid */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-4 bg-white p-4 rounded-xl shadow">
            <span className="font-semibold text-gray-700">
              {loading ? 'Loading...' : `Showing ${products.length} products`}
            </span>
            <select className="border border-gray-300 rounded-lg p-2 font-semibold focus:ring-2 focus:ring-pink-400">
              <option>Sort by: Popularity</option>
              <option>Sort by: Price low to high</option>
              <option>Sort by: Price high to low</option>
              <option>Sort by: Newest arrivals</option>
            </select>
          </div>
          <ProductGrid products={products} loading={loading} />
          {/* Pagination would go here */}
        </main>
      </div>
    </div>
  );
} 