import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { FaTshirt, FaPalette, FaShoppingCart, FaEye, FaStar, FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import apiService from '../utils/api';
import ProductCard from '../Components/ProductCard';

const genderOptions = [
  { value: 'Men', label: 'Men' },
  { value: 'Women', label: 'Women' },
  { value: 'Unisex', label: 'Unisex' },
  { value: 'Kids', label: 'Kids' },
];

function FilterSidebar({ brands, colors, selectedBrands, setSelectedBrands, selectedColors, setSelectedColors, selectedGenders, setSelectedGenders }) {
  const handleCheckboxChange = (value, selected, setSelected) => {
    if (selected.includes(value)) {
      setSelected(selected.filter(v => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  };
  return (
    <aside className="w-full md:w-64 lg:w-72 flex-shrink-0 bg-white rounded-xl shadow-lg p-6">
      <h3 className="font-bold text-xl mb-4 text-gray-800">Filters</h3>
      {/* Gender Filter */}
      <div className="mb-6">
        <h4 className="font-semibold mb-2">Gender</h4>
        <div className="flex flex-col gap-2">
          {genderOptions.map(opt => (
            <label key={opt.value} className="flex items-center gap-2">
              <input type="checkbox" name="gender" value={opt.value} checked={selectedGenders.includes(opt.value)} onChange={() => handleCheckboxChange(opt.value, selectedGenders, setSelectedGenders)} className="text-pink-500" /> {opt.label}
            </label>
          ))}
        </div>
      </div>
      {/* Brand Filter */}
      <div className="mb-6">
        <h4 className="font-semibold mb-2">Brand</h4>
        <div className="flex flex-col gap-2">
          {brands.map(b => (
            <label key={b.id} className="flex items-center gap-2">
              <input type="checkbox" name="brand" value={b.name} checked={selectedBrands.includes(b.name)} onChange={() => handleCheckboxChange(b.name, selectedBrands, setSelectedBrands)} className="text-pink-500" /> {b.name}
            </label>
          ))}
        </div>
      </div>
      {/* Color Filter */}
      <div className="mb-6">
        <h4 className="font-semibold mb-2">Color</h4>
        <div className="flex flex-col gap-2">
          {colors.map(c => (
            <label key={c.id} className="flex items-center gap-2">
              <input type="checkbox" name="color" value={c.name} checked={selectedColors.includes(c.name)} onChange={() => handleCheckboxChange(c.name, selectedColors, setSelectedColors)} className="text-pink-500" /> {c.name}
            </label>
          ))}
        </div>
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
  if (products.length === 0) {
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
        <ProductCard key={product.id} product={product} type="tshirt" />
      ))}
    </div>
  );
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { isAuthenticated, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tshirts, setTshirts] = useState([]);
  const [tshirtsPage, setTshirtsPage] = useState(1);
  const [tshirtsTotalPages, setTshirtsTotalPages] = useState(1);
  const [tshirtsSearch, setTshirtsSearch] = useState('');
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const itemsPerPage = 12;
  useEffect(() => {
    fetchBrands();
    fetchColors();
  }, []);
  useEffect(() => {
      fetchTshirts();
  }, [tshirtsPage, tshirtsSearch, selectedBrands, selectedColors, selectedGenders]);
  const fetchBrands = async () => {
    try {
      const data = await fetch('/api/brands').then(res => res.json());
      setBrands(data);
    } catch (err) {
      setBrands([]);
    }
  };
  const fetchColors = async () => {
    try {
      const data = await fetch('/api/colors').then(res => res.json());
      setColors(data);
    } catch (err) {
      setColors([]);
    }
  };
  const fetchTshirts = async () => {
    try {
      setLoading(true);
      const params = {
        page: tshirtsPage - 1,
        size: itemsPerPage,
        search: tshirtsSearch,
      };
      // Add multi-select params
      const queryParts = [
        ...Object.entries(params)
          .filter(([k, v]) => v !== undefined && v !== null && v !== '')
          .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`),
        ...selectedBrands.map(b => `brand=${encodeURIComponent(b)}`),
        ...selectedColors.map(c => `color=${encodeURIComponent(c)}`),
        ...selectedGenders.map(g => `gender=${encodeURIComponent(g)}`),
      ];
      const query = queryParts.join('&');
      const data = await fetch(`/api/tshirts/page?${query}`).then(res => res.json());
      setTshirts(data.content || data);
      setTshirtsTotalPages(data.totalPages || 1);
    } catch (err) {
      setError('Failed to load t-shirts');
    } finally {
      setLoading(false);
    }
  };
  const handleTshirtsSearch = (e) => {
    e.preventDefault();
    setTshirtsPage(1);
  };
  const [showFilters, setShowFilters] = useState(false);
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Shop Our Collection</h1>
        <p className="text-lg text-gray-600 mt-2">Find the perfect t-shirt that speaks to you.</p>
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
            <FilterSidebar brands={brands} colors={colors} selectedBrands={selectedBrands} setSelectedBrands={setSelectedBrands} selectedColors={selectedColors} setSelectedColors={setSelectedColors} selectedGenders={selectedGenders} setSelectedGenders={setSelectedGenders} />
          </div>
            </div>
        {/* Desktop Filters */}
        <div className="hidden md:block">
          <FilterSidebar brands={brands} colors={colors} selectedBrands={selectedBrands} setSelectedBrands={setSelectedBrands} selectedColors={selectedColors} setSelectedColors={setSelectedColors} selectedGenders={selectedGenders} setSelectedGenders={setSelectedGenders} />
        </div>
        {/* Products Grid */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-4 bg-white p-4 rounded-xl shadow">
            <span className="font-semibold text-gray-700">Showing {tshirts.length} products</span>
            <select className="border border-gray-300 rounded-lg p-2 font-semibold focus:ring-2 focus:ring-pink-400">
              <option>Sort by: Popularity</option>
              <option>Sort by: Price low to high</option>
              <option>Sort by: Price high to low</option>
              <option>Sort by: Newest arrivals</option>
            </select>
          </div>
          <ProductGrid products={tshirts} loading={loading} />
        </main>
        </div>
    </div>
  );
} 