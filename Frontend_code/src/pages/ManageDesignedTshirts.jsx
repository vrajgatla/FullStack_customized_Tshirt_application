import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../utils/api';
import { FaEdit, FaTrash, FaEye, FaDownload, FaPlus, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ManageDesignedTshirts = () => {
  const { user, token } = useAuth();
  const [designedTshirts, setDesignedTshirts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);
  const [selectedTshirt, setSelectedTshirt] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [imageLoadingStates, setImageLoadingStates] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      loadDesignedTshirts();
    }
  }, [user, currentPage, searchQuery]);

  const loadDesignedTshirts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      
      if (searchQuery.trim()) {
        response = await apiService.searchDesignedTshirts(searchQuery, currentPage, pageSize, token);
      } else {
        response = await apiService.getDesignedTshirts({ page: currentPage, size: pageSize }, token);
      }
      
      if (response.content) {
        setDesignedTshirts(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      } else {
        setDesignedTshirts(response);
        setTotalPages(1);
        setTotalElements(response.length || 0);
      }
    } catch (err) {
      setError('Failed to load designed t-shirts: ' + (err.message || 'Unknown error'));
      console.error('Error loading designed t-shirts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this designed t-shirt?')) {
      try {
        await apiService.deleteDesignedTshirt(id, token);
        // Reload the current page to refresh the data
        await loadDesignedTshirts();
      } catch (err) {
        setError('Failed to delete designed t-shirt: ' + (err.message || 'Unknown error'));
        console.error('Error deleting designed t-shirt:', err);
      }
    }
  };

  const handleDownload = (id) => {
    const downloadUrl = apiService.downloadDesignedTshirt(id);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `designed-tshirt-${id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewDetails = (tshirt) => {
    setSelectedTshirt(tshirt);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleImageLoad = (tshirtId) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [tshirtId]: { loading: false, error: false }
    }));
  };

  const handleImageError = (tshirtId, fallbackUrl) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [tshirtId]: { loading: false, error: true, fallbackUrl }
    }));
  };

  const getImageUrl = (tshirtId) => {
    const state = imageLoadingStates[tshirtId];
    if (state?.error && state.fallbackUrl) {
      return state.fallbackUrl;
    }
    return apiService.getDesignedTshirtThumbnail(tshirtId);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Reset image loading states for new page
    setImageLoadingStates({});
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0); // Reset to first page when searching
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const startPage = Math.max(0, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);
    const pages = [];

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6 rounded-lg shadow">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <button
            onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage === totalPages - 1}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <FaChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{currentPage * pageSize + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min((currentPage + 1) * pageSize, totalElements)}
              </span>{' '}
              of <span className="font-medium">{totalElements}</span> results
            </p>
          </div>
          
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaChevronLeft className="h-4 w-4" />
              </button>
              
              {pages.map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    page === currentPage
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {page + 1}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage === totalPages - 1}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaChevronRight className="h-4 w-4" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Designed T-Shirts</h1>
          <p className="text-gray-600">Manage all custom designed t-shirts in your store</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search designed t-shirts..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => navigate('/design-upload')}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <FaPlus /> Create New Design
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Designed T-shirts Grid */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Brand
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Color
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {designedTshirts.map((tshirt) => (
                      <tr key={tshirt.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="relative h-12 w-12">
                            {/* Loading state */}
                            {(!imageLoadingStates[tshirt.id] || imageLoadingStates[tshirt.id].loading) && (
                              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                              </div>
                            )}
                            
                            {/* Image */}
                            <img
                              src={getImageUrl(tshirt.id)}
                              alt={tshirt.name}
                              className="h-12 w-12 rounded-lg object-cover"
                              onLoad={() => handleImageLoad(tshirt.id)}
                              onError={() => {
                                const fallbackUrl = apiService.getDesignedTshirtImage(tshirt.id);
                                handleImageError(tshirt.id, fallbackUrl);
                              }}
                              style={{
                                display: (!imageLoadingStates[tshirt.id] || imageLoadingStates[tshirt.id].loading) ? 'none' : 'block'
                              }}
                            />
                            
                            {/* Fallback placeholder */}
                            {imageLoadingStates[tshirt.id]?.error && (
                              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{tshirt.name}</div>
                          <div className="text-sm text-gray-500">{tshirt.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {tshirt.brand?.name || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {tshirt.color?.name || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${tshirt.price?.toFixed(2) || '0.00'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            tshirt.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {tshirt.stock || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(tshirt.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewDetails(tshirt)}
                              className="text-blue-600 hover:text-blue-900"
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                            <button
                              onClick={() => handleDownload(tshirt.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Download"
                            >
                              <FaDownload />
                            </button>
                            <button
                              onClick={() => navigate(`/edit-designed-tshirt/${tshirt.id}`)}
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(tshirt.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Empty State */}
              {designedTshirts.length === 0 && !loading && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <FaPlus className="mx-auto h-12 w-12" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No designed t-shirts found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchQuery ? 'Try adjusting your search terms.' : 'Start by creating your first designed t-shirt.'}
                  </p>
                  {!searchQuery && (
                    <button
                      onClick={() => navigate('/design-upload')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Create First Design
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Pagination */}
            {renderPagination()}
          </>
        )}

        {/* Details Modal */}
        {showModal && selectedTshirt && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Designed T-Shirt Details</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <div className="relative w-full aspect-square max-h-80 mb-4">
                      <img
                        src={apiService.getDesignedTshirtImage(selectedTshirt.id)}
                        alt={selectedTshirt.name}
                        className="w-full h-full object-contain rounded-lg border border-gray-200"
                        onError={(e) => {
                          console.warn(`Failed to load full image for designed t-shirt ${selectedTshirt.id}:`, e.target.src);
                          e.target.src = '/default-tshirt.svg';
                          e.target.onerror = null;
                        }}
                        onLoad={() => {
                          console.log(`Successfully loaded full image for designed t-shirt ${selectedTshirt.id}`);
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{selectedTshirt.name}</h4>
                      <p className="text-gray-600">{selectedTshirt.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Brand:</span>
                        <p className="text-gray-900">{selectedTshirt.brand?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Color:</span>
                        <p className="text-gray-900">{selectedTshirt.color?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Price:</span>
                        <p className="text-gray-900">${selectedTshirt.price?.toFixed(2) || '0.00'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Stock:</span>
                        <p className="text-gray-900">{selectedTshirt.stock || 0}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Material:</span>
                        <p className="text-gray-900">{selectedTshirt.material || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Fit:</span>
                        <p className="text-gray-900">{selectedTshirt.fit || 'N/A'}</p>
                      </div>
                    </div>
                    
                    {selectedTshirt.compressionRatio && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h5 className="font-medium text-gray-700 mb-2">Image Compression Info</h5>
                        <div className="text-sm text-gray-600">
                          <p>Original: {formatFileSize(selectedTshirt.originalFileSize || 0)}</p>
                          <p>Compressed: {formatFileSize(selectedTshirt.compressedFileSize || 0)}</p>
                          <p>Compression: {selectedTshirt.compressionRatio}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDownload(selectedTshirt.id)}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => {
                          setShowModal(false);
                          navigate(`/edit-designed-tshirt/${selectedTshirt.id}`);
                        }}
                        className="flex-1 bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageDesignedTshirts; 