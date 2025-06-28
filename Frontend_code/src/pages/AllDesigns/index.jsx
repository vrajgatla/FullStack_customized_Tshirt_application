import React, { useEffect, useState } from 'react';
import { formatFileSize } from '../../utils/imageCompression';

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

  const handleDownload = async (designId, designName) => {
    try {
      const response = await fetch(`/api/designs/${designId}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${designName}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        alert('Download failed. Please try again.');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please try again.');
    }
  };

  return (
    <div className="w-full min-h-screen max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 bg-gradient-to-br from-purple-50 via-blue-50 to-white animate-fade-in">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-purple-800 mb-6 md:mb-10 tracking-tight">All Designs</h1>
      {loading ? (
        <div className="text-gray-500 mt-8">Loading designs...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {designs.map(design => (
              <div key={design.id} className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300">
                <img 
                  src={`/api/designs/${design.id}/image`} 
                  alt={design.name} 
                  className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 object-contain rounded-xl mb-2 sm:mb-3 shadow max-w-full cursor-pointer" 
                  onError={e => e.currentTarget.style.display = 'none'} 
                />
                <span className="text-base sm:text-lg font-semibold text-gray-700 text-center break-words mb-1">{design.name}</span>
                <span className="text-xs text-gray-500 mb-1">Type: {design.type} | Theme: {design.theme}</span>
                <span className="text-xs text-gray-500 mb-1">Tags: {design.tags}</span>
                
                {/* Compression Information */}
                {design.compressionRatio && (
                  <div className="mt-2 p-2 bg-green-50 rounded-lg text-xs w-full">
                    <div className="text-green-700 font-medium mb-1">Compression Info:</div>
                    <div className="grid grid-cols-2 gap-1 text-gray-600">
                      <div>
                        <div>Original: {design.originalWidth}×{design.originalHeight}</div>
                        <div>{design.originalFileSize && formatFileSize(design.originalFileSize)}</div>
                      </div>
                      <div>
                        <div>Compressed: {design.compressedWidth}×{design.compressedHeight}</div>
                        <div>{design.compressedFileSize && formatFileSize(design.compressedFileSize)}</div>
                      </div>
                    </div>
                    <div className="text-green-600 font-semibold mt-1">
                      Saved: {design.compressionRatio}
                    </div>
                  </div>
                )}
                
                {/* Download Button */}
                <button
                  onClick={() => handleDownload(design.id, design.name)}
                  className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download
                </button>
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