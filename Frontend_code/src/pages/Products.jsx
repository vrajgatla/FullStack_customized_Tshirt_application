import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Products() {
  const query = useQuery();
  const category = query.get('category');
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [brand, setBrand] = useState('All Brands');
  const [color, setColor] = useState('All Colors');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const pageSize = 16;

  useEffect(() => {
    // Fetch products
    fetch('/api/tshirts')
      .then(res => res.json())
      .then(data => {
        setProducts(Array.isArray(data) ? data : (data.content || []));
        setLoading(false);
      });
    // Fetch brands
    fetch('/api/brands')
      .then(res => res.json())
      .then(data => setBrands(['All Brands', ...data.map(b => b.name)]));
    // Fetch colors
    fetch('/api/colors')
      .then(res => res.json())
      .then(data => setColors(['All Colors', ...data.map(c => c.name)]));
  }, []);

  let filteredProducts = products;
  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category?.toLowerCase() === category.toLowerCase());
  }
  if (brand !== 'All Brands') {
    filteredProducts = filteredProducts.filter(p => p.brand?.name === brand);
  }
  if (color !== 'All Colors') {
    filteredProducts = filteredProducts.filter(p => p.color?.name === color);
  }

  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const pagedProducts = filteredProducts.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="w-full min-h-screen max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 bg-gradient-to-br from-blue-50 via-purple-50 to-white animate-fade-in">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 mb-4 sm:mb-8 tracking-tight">Shop T-Shirts</h1>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6 sm:mb-8 w-full">
        <select className="w-full sm:w-auto p-3 border-2 border-blue-200 rounded-xl shadow focus:ring-2 focus:ring-blue-400 bg-white font-medium" value={brand} onChange={e => setBrand(e.target.value)}>
          {brands.map(b => <option key={b}>{b}</option>)}
        </select>
        <select className="w-full sm:w-auto p-3 border-2 border-blue-200 rounded-xl shadow focus:ring-2 focus:ring-blue-400 bg-white font-medium" value={color} onChange={e => setColor(e.target.value)}>
          {colors.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      {/* Product Grid */}
      {loading ? (
        <div className="text-gray-500 mt-8">Loading products...</div>
      ) : (
        <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {pagedProducts.map((prod) => (
            <Link to={`/products/${prod.id}`} key={prod.id} className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer">
              <img src={`/api/tshirts/${prod.id}/image`} alt={prod.name} className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 object-cover rounded-xl mb-2 sm:mb-3 shadow max-w-full" onError={e => e.currentTarget.style.display = 'none'} />
              <span className="text-base sm:text-lg font-semibold text-gray-700 text-center break-words">{prod.name}</span>
              <span className="text-blue-600 font-bold mt-1 sm:mt-2 text-base sm:text-lg">${prod.price?.toFixed(2)}</span>
              <span className="text-sm text-gray-500 mt-1">{prod.brand?.name} | {prod.color?.name}</span>
            </Link>
          ))}
        </div>
        <div className="flex justify-center gap-4 mt-6">
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className={`px-3 py-1 rounded ${page === 0 ? 'bg-gray-200 text-gray-400' : 'bg-purple-100 hover:bg-purple-200 text-purple-700'}`}>Prev</button>
          <span className="px-2 text-sm font-semibold">Page {page + 1} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} className={`px-3 py-1 rounded ${page === totalPages - 1 ? 'bg-gray-200 text-gray-400' : 'bg-purple-100 hover:bg-purple-200 text-purple-700'}`}>Next</button>
        </div>
        </>
      )}
      {filteredProducts.length === 0 && !loading && <div className="text-gray-500 mt-8">No products found for this filter.</div>}
    </div>
  );
} 