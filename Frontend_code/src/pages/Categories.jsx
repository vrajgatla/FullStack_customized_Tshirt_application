import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const pageSize = 8;

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      });
  }, []);

  const totalPages = Math.ceil(categories.length / pageSize);
  const pagedCategories = categories.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="w-full min-h-screen max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 bg-gradient-to-br from-blue-50 via-purple-50 to-white animate-fade-in">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 mb-4 sm:mb-10 tracking-tight">Categories</h1>
      {loading ? (
        <div className="text-gray-500 mt-8">Loading categories...</div>
      ) : (
        <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
          {pagedCategories.map((cat) => {
            const isTshirts = cat.name && cat.name.toLowerCase().includes('t-shirt');
            const isDesigns = cat.name && cat.name.toLowerCase().includes('design');
            if (isTshirts) {
              return (
                <Link to="/products" key={cat.id + '-' + cat.name} className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                  <img src={cat.image} alt={cat.name} className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover rounded-full mb-2 sm:mb-3 shadow-lg max-w-full" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/fallback-category.png'; }} />
                  <span className="text-base sm:text-xl font-semibold text-gray-700 tracking-wide text-center break-words">{cat.name}</span>
                  <span className="text-xs sm:text-sm text-gray-500 mt-1 text-center">{cat.sample}</span>
                </Link>
              );
            } else if (isDesigns) {
              return (
                <Link to="/designs" key={cat.id + '-' + cat.name} className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                  <img src={cat.image} alt={cat.name} className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover rounded-full mb-2 sm:mb-3 shadow-lg max-w-full" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/fallback-category.png'; }} />
                  <span className="text-base sm:text-xl font-semibold text-gray-700 tracking-wide text-center break-words">{cat.name}</span>
                  <span className="text-xs sm:text-sm text-gray-500 mt-1 text-center">{cat.sample}</span>
                </Link>
              );
            } else {
              return (
                <Link to={`/products?category=${cat.name.toLowerCase()}`} key={cat.id + '-' + cat.name} className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                  <img src={cat.image} alt={cat.name} className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover rounded-full mb-2 sm:mb-3 shadow-lg max-w-full" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/fallback-category.png'; }} />
                  <span className="text-base sm:text-xl font-semibold text-gray-700 tracking-wide text-center break-words">{cat.name}</span>
                  <span className="text-xs sm:text-sm text-gray-500 mt-1 text-center">{cat.sample}</span>
                </Link>
              );
            }
          })}
        </div>
        <div className="flex justify-center gap-4 mt-6">
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className={`px-3 py-1 rounded ${page === 0 ? 'bg-gray-200 text-gray-400' : 'bg-purple-100 hover:bg-purple-200 text-purple-700'}`}>Prev</button>
          <span className="px-2 text-sm font-semibold">Page {page + 1} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} className={`px-3 py-1 rounded ${page === totalPages - 1 ? 'bg-gray-200 text-gray-400' : 'bg-purple-100 hover:bg-purple-200 text-purple-700'}`}>Next</button>
        </div>
        </>
      )}
    </div>
  );
} 