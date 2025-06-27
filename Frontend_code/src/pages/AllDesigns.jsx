import React, { useEffect, useState } from 'react';

export default function AllDesigns() {
  const [designs, setDesigns] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/designs?page=${page}&size=12`)
      .then(res => res.json())
      .then(data => {
        setDesigns(data.content || []);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      });
  }, [page]);

  return (
    <div className="w-full min-h-screen max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 bg-gradient-to-br from-purple-50 via-blue-50 to-white animate-fade-in">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-purple-800 mb-6 md:mb-10 tracking-tight">All Designs</h1>
      {loading ? (
        <div className="text-gray-500 mt-8">Loading designs...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {designs.map(design => (
              <div key={design.id} className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                <img src={`/api/designs/${design.id}/image`} alt={design.name} className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 object-contain rounded-xl mb-2 sm:mb-3 shadow max-w-full" onError={e => e.currentTarget.style.display = 'none'} />
                <span className="text-base sm:text-lg font-semibold text-gray-700 text-center break-words mb-1">{design.name}</span>
                <span className="text-xs text-gray-500 mb-1">Type: {design.type} | Theme: {design.theme}</span>
                <span className="text-xs text-gray-500 mb-1">Tags: {design.tags}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-8">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className={`px-3 py-1 rounded ${page === 0 ? 'bg-gray-200 text-gray-400' : 'bg-purple-100 hover:bg-purple-200 text-purple-700'}`}>Prev</button>
            <span className="px-2 text-sm font-semibold">Page {page + 1} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} className={`px-3 py-1 rounded ${page === totalPages - 1 ? 'bg-gray-200 text-gray-400' : 'bg-purple-100 hover:bg-purple-200 text-purple-700'}`}>Next</button>
          </div>
        </>
      )}
      {designs.length === 0 && !loading && <div className="text-gray-500 mt-8">No designs found.</div>}
    </div>
  );
} 