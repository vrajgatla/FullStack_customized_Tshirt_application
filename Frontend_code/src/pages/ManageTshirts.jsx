import React, { useEffect, useState } from 'react';
import apiService from '../utils/api';
import { FaSearch, FaFilter, FaSort, FaCalendarAlt, FaPalette } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

export default function ManageTshirts() {
  const { user, token } = useAuth();
  const [tshirts, setTshirts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [success, setSuccess] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [updateStatus, setUpdateStatus] = useState('');
  const [deleting, setDeleting] = useState(null);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [genders, setGenders] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Design preview states
  const [showDesignPreview, setShowDesignPreview] = useState(false);
  const [selectedTshirtForPreview, setSelectedTshirtForPreview] = useState(null);
  const [designs, setDesigns] = useState([]);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [designZoom, setDesignZoom] = useState(1);
  const [designPosition, setDesignPosition] = useState({ x: 144, y: 160 });
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewSuccess, setPreviewSuccess] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [savingAsDesigned, setSavingAsDesigned] = useState(false);

  useEffect(() => {
    loadFilters();
    loadTshirts();
    loadDesigns();
  }, [page, searchQuery, selectedBrand, selectedColor, selectedGender, sortBy, sortOrder]);

  const loadFilters = async () => {
    try {
      const [brandsData, colorsData, gendersData] = await Promise.all([
        fetch('/api/brands').then(res => res.json()),
        fetch('/api/colors').then(res => res.json()),
        fetch('/api/tshirts/genders').then(res => res.json())
      ]);
      setBrands(brandsData);
      setColors(colorsData);
      setGenders(gendersData);
    } catch (err) {
      console.error('Error loading filters:', err);
    }
  };

  const loadTshirts = async () => {
    try {
      setLoading(true);
      let url = `/api/tshirts/page?page=${page}&size=10&sortBy=${sortBy}&sortOrder=${sortOrder}`;
      
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
      if (selectedBrand) {
        url += `&brand=${encodeURIComponent(selectedBrand)}`;
      }
      if (selectedColor) {
        url += `&color=${encodeURIComponent(selectedColor)}`;
      }
      if (selectedGender) {
        url += `&gender=${encodeURIComponent(selectedGender)}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setTshirts(data.content || []);
        setTotalPages(data.totalPages || 1);
      } else {
        console.error('Failed to fetch t-shirts:', response.status);
      }
    } catch (err) {
      console.error('Error fetching t-shirts:', err);
      setError('Failed to load t-shirts');
    } finally {
      setLoading(false);
    }
  };

  const loadDesigns = async () => {
    try {
      const response = await fetch('/api/designs');
      const data = await response.json();
      const designsArray = Array.isArray(data) ? data : (data.content || []);
      setDesigns(designsArray);
    } catch (err) {
      console.error('Error loading designs:', err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedBrand('');
    setSelectedColor('');
    setSelectedGender('');
    setSortBy('createdAt');
    setSortOrder('desc');
    setPage(0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const startEdit = (tshirt) => {
    setEditing(tshirt.id);
    setForm({ ...tshirt, deleteOldImage: false });
    setError('');
    setUpdateStatus('');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (newImage) {
      setUpdateStatus('Preparing form data with image...');
      try {
        const formData = new FormData();
        
        // Create the tshirt data object
        const tshirtData = {
          name: form.name,
          brand: form.brand?.name || form.brand,
          color: form.color?.name || form.color,
          sizes: Array.isArray(form.sizes) ? form.sizes : (form.sizes || form.size || '').split(',').map(s => s.trim()),
          gender: form.gender,
          material: form.material,
          fit: form.fit,
          sleeveType: form.sleeveType,
          neckType: form.neckType,
          price: Number(form.price),
          stock: Number(form.stock),
          featured: !!form.featured,
          tags: form.tags,
          description: form.description
        };
        
        formData.append('tshirt', new Blob([JSON.stringify(tshirtData)], { type: 'application/json' }));
        formData.append('image', newImage);
        
        setUpdateStatus('Sending update request to server...');
        const res = await fetch(`/api/tshirts/${form.id}/update-with-image`, {
          method: 'PUT',
          body: formData,
        });
        
        setUpdateStatus('Processing server response...');
        if (!res.ok) {
          const errorText = await res.text();
          console.error('Server response:', res.status, errorText);
          throw new Error(`Server error (${res.status}): ${errorText}`);
        }
        
        setUpdateStatus('Update successful! Refreshing data...');
        setSuccess(true);
        setEditing(null);
        setNewImage(null);
        loadTshirts();
        setTimeout(() => setSuccess(false), 3000);
      } catch (err) {
        console.error('Update error:', err);
        setError('Update failed: ' + err.message);
        setUpdateStatus('');
      }
    } else {
      setUpdateStatus('Preparing form data without image...');
      try {
        const formData = new FormData();
        
        // Create the tshirt data object
        const tshirtData = {
          name: form.name,
          brand: form.brand?.name || form.brand,
          color: form.color?.name || form.color,
          sizes: Array.isArray(form.sizes) ? form.sizes : (form.sizes || form.size || '').split(',').map(s => s.trim()),
          gender: form.gender,
          material: form.material,
          fit: form.fit,
          sleeveType: form.sleeveType,
          neckType: form.neckType,
          price: Number(form.price),
          stock: Number(form.stock),
          featured: !!form.featured,
          tags: form.tags,
          description: form.description
        };
        
        formData.append('tshirt', new Blob([JSON.stringify(tshirtData)], { type: 'application/json' }));
        
        setUpdateStatus('Sending update request to server...');
        const res = await fetch(`/api/tshirts/${form.id}/update-with-image`, {
          method: 'PUT',
          body: formData,
        });
        
        setUpdateStatus('Processing server response...');
        if (!res.ok) {
          const errorText = await res.text();
          console.error('Server response:', res.status, errorText);
          throw new Error(`Server error (${res.status}): ${errorText}`);
        }
        
        setUpdateStatus('Update successful! Refreshing data...');
        setSuccess(true);
        setEditing(null);
        loadTshirts();
        setTimeout(() => setSuccess(false), 3000);
      } catch (err) {
        console.error('Update error:', err);
        setError('Update failed: ' + err.message);
        setUpdateStatus('');
      }
    }
    setLoading(false);
  };

  const handleDelete = async (tshirtId) => {
    if (!window.confirm('Are you sure you want to delete this t-shirt? This action cannot be undone.')) {
      return;
    }
    
    setDeleting(tshirtId);
    setError('');
    
    try {
      const res = await fetch(`/api/tshirts/${tshirtId}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        throw new Error('Failed to delete t-shirt');
      }
      
      setSuccess(true);
      setUpdateStatus('T-shirt deleted successfully!');
      
      // Refresh the list
      loadTshirts();
      
      setTimeout(() => {
        setSuccess(false);
        setUpdateStatus('');
      }, 3000);
    } catch (err) {
      setError('Delete failed: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 bg-white rounded-xl shadow mt-8">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-blue-700">Manage T-Shirts</h1>
      {success && <div className="text-green-600 font-semibold mb-2 p-2 bg-green-100 rounded">✅ T-shirt updated successfully!</div>}
      {error && <div className="text-red-600 font-semibold mb-2 p-2 bg-red-100 rounded">❌ {error}</div>}
      {updateStatus && <div className="text-blue-600 font-semibold mb-2 p-2 bg-blue-100 rounded">🔄 {updateStatus}</div>}
      
      {/* Search and Filters Section */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FaSearch /> Smart Search & Filters
          </h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaFilter />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search t-shirts by name, tags, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Brand Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Colors</option>
                {colors.map((color) => (
                  <option key={color.id} value={color.name}>
                    {color.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Gender Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Genders</option>
                {genders.map((gender) => (
                  <option key={gender} value={gender}>
                    {gender}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="createdAt-desc">Latest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="price-asc">Price Low to High</option>
                <option value="price-desc">Price High to Low</option>
              </select>
            </div>
          </div>
        )}

        {/* Clear Filters Button */}
        <div className="flex justify-between items-center">
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Clear All Filters
          </button>
          <div className="text-sm text-gray-600">
            Showing {tshirts.length} t-shirts
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading t-shirts...</p>
        </div>
      )}

      {/* T-Shirts Grid */}
      {!loading && (
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          {tshirts.map(tshirt => (
            <div key={tshirt.id} className="border rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center">
              <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded border mb-2 sm:mb-0 overflow-hidden">
                <img 
                  src={apiService.getProductThumbnail(tshirt.id)} 
                  alt={tshirt.name} 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    console.warn(`Failed to load thumbnail for t-shirt ${tshirt.id}, trying full image...`);
                    // Try to load the full image as fallback
                    e.target.src = apiService.getProductImage(tshirt.id);
                    e.target.onerror = (e2) => {
                      console.warn(`Failed to load full image for t-shirt ${tshirt.id}, using default...`);
                      // If full image also fails, use default placeholder
                      e2.target.style.display = 'none';
                      e2.target.nextSibling.style.display = 'flex';
                    };
                  }}
                  onLoad={() => {
                    // Hide the placeholder when image loads successfully
                    const placeholder = e.target.nextSibling;
                    if (placeholder) {
                      placeholder.style.display = 'none';
                    }
                  }}
                />
                <div className="hidden w-full h-full items-center justify-center text-gray-400 text-xs text-center">
                  <div>
                    <svg className="w-8 h-8 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    No Image
                  </div>
                </div>
              </div>
              <div className="flex-1 w-full">
                <div className="font-bold text-base sm:text-lg">{tshirt.name}</div>
                <div className="text-gray-600 text-xs sm:text-sm">Brand: {tshirt.brand?.name || tshirt.brand}</div>
                <div className="text-gray-600 text-xs sm:text-sm">Color: {tshirt.color?.name || tshirt.color}</div>
                <div className="text-gray-600 text-xs sm:text-sm">Size: {tshirt.size}</div>
                <div className="text-gray-600 text-xs sm:text-sm">Gender: {tshirt.gender}</div>
                <div className="text-gray-600 text-xs sm:text-sm">Material: {tshirt.material}</div>
                <div className="text-gray-600 text-xs sm:text-sm">Fit: {tshirt.fit}</div>
                <div className="text-gray-600 text-xs sm:text-sm">Sleeve: {tshirt.sleeveType}</div>
                <div className="text-gray-600 text-xs sm:text-sm">Neck: {tshirt.neckType}</div>
                <div className="text-gray-600 text-xs sm:text-sm">Tags: {tshirt.tags}</div>
                <div className="text-gray-600 text-xs sm:text-sm">Description: {tshirt.description}</div>
                <div className="text-gray-600 text-xs sm:text-sm flex items-center gap-1">
                  <FaCalendarAlt className="text-gray-400" />
                  Uploaded: {formatDate(tshirt.createdAt)}
                </div>
                {tshirt.compressionRatio && (
                  <div className="text-green-600 text-xs sm:text-sm font-medium">
                    Compression: {tshirt.compressionRatio} saved
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <button 
                  className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 w-full sm:w-auto" 
                  onClick={() => startEdit(tshirt)}
                >
                  Edit
                </button>
                <button 
                  className={`px-4 py-2 rounded font-bold w-full sm:w-auto ${
                    deleting === tshirt.id 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                  onClick={() => handleDelete(tshirt.id)}
                  disabled={deleting === tshirt.id}
                >
                  {deleting === tshirt.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && tshirts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No t-shirts found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || selectedBrand || selectedColor || selectedGender 
              ? 'Try adjusting your search criteria.' 
              : 'Start by uploading your first t-shirt.'}
          </p>
          {!searchQuery && !selectedBrand && !selectedColor && !selectedGender && (
            <button
              onClick={() => window.location.href = '/upload-tshirt'}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Upload First T-Shirt
            </button>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-2">
          <form onSubmit={handleUpdate} className="bg-white rounded-xl shadow-xl p-4 sm:p-8 w-full max-w-screen-sm flex flex-col gap-4 space-y-3 relative overflow-y-auto max-h-[90vh] min-w-0">
            <button type="button" onClick={() => setEditing(null)} className="absolute top-2 right-4 text-2xl font-bold text-gray-600 hover:text-red-500 z-10">&times;</button>
            <h2 className="text-lg sm:text-xl font-bold mb-2">Edit T-Shirt</h2>
            <div className="flex flex-col gap-2 min-w-0">
              <input name="name" value={form.name || ''} onChange={handleChange} className="p-2 border rounded w-full" placeholder="T-shirt Name" required />
              <input name="brand" value={form.brand?.name || form.brand || ''} onChange={handleChange} className="p-2 border rounded w-full" placeholder="Brand" />
              <input name="color" value={form.color?.name || form.color || ''} onChange={handleChange} className="p-2 border rounded w-full" placeholder="Color" />
              <input name="sizes" value={Array.isArray(form.sizes) ? form.sizes.join(', ') : (form.sizes || form.size || '')} onChange={handleChange} className="p-2 border rounded w-full" placeholder="Sizes (comma separated)" />
              <input name="gender" value={form.gender || ''} onChange={handleChange} className="p-2 border rounded w-full" placeholder="Gender" />
              <input name="material" value={form.material || ''} onChange={handleChange} className="p-2 border rounded w-full" placeholder="Material" />
              <input name="fit" value={form.fit || ''} onChange={handleChange} className="p-2 border rounded w-full" placeholder="Fit" />
              <input name="sleeveType" value={form.sleeveType || ''} onChange={handleChange} className="p-2 border rounded w-full" placeholder="Sleeve Type" />
              <input name="neckType" value={form.neckType || ''} onChange={handleChange} className="p-2 border rounded w-full" placeholder="Neck Type" />
              <input name="price" type="number" value={form.price || ''} onChange={handleChange} className="p-2 border rounded w-full" placeholder="Price" required />
              <input name="stock" type="number" value={form.stock || ''} onChange={handleChange} className="p-2 border rounded w-full" placeholder="Stock" required />
              <label className="flex items-center gap-2">
                <input name="featured" type="checkbox" checked={form.featured || false} onChange={handleChange} />
                Featured
              </label>
              <input name="tags" value={form.tags || ''} onChange={handleChange} className="p-2 border rounded w-full" placeholder="Tags" />
              <textarea name="description" value={form.description || ''} onChange={handleChange} className="p-2 border rounded w-full" placeholder="Description" />
              <input type="file" accept="image/*" onChange={e => setNewImage(e.target.files[0])} className="p-2 border rounded w-full" />
              <div className="text-sm text-gray-600">
                Note: Uploading a new image will automatically replace the existing image.
              </div>
            </div>
            <button type="submit" disabled={loading} className={`px-6 py-2 rounded font-bold w-full ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white`}>
              {loading ? 'Updating...' : 'Update'}
            </button>
          </form>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-6">
        <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className={`px-3 py-1 rounded ${page === 0 ? 'bg-gray-200 text-gray-400' : 'bg-blue-100 hover:bg-blue-200 text-blue-700'}`}>Prev</button>
        <span className="px-2 text-sm font-semibold">Page {page + 1} of {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} className={`px-3 py-1 rounded ${page === totalPages - 1 ? 'bg-gray-200 text-gray-400' : 'bg-blue-100 hover:bg-blue-200 text-blue-700'}`}>Next</button>
      </div>
    </div>
  );
} 