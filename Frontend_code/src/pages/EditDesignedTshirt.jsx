import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../utils/api';
import { FaArrowLeft, FaSave, FaTrash } from 'react-icons/fa';

export default function EditDesignedTshirt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [designedTshirt, setDesignedTshirt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [form, setForm] = useState({
    name: '',
    brandId: '',
    colorId: '',
    designId: '',
    sizes: [],
    gender: '',
    material: '',
    fit: '',
    sleeveType: '',
    neckType: '',
    price: 0,
    stock: 0,
    featured: false,
    tags: '',
    description: '',
    customDesignName: '',
    designZoom: 1,
    designPositionX: 0,
    designPositionY: 0,
    tshirtZoom: '1'
  });

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/login');
      return;
    }

    loadData();
  }, [id, user, token]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load designed t-shirt data
      const tshirtData = await apiService.getDesignedTshirt(id, token);
      setDesignedTshirt(tshirtData);
      
      // Set form data
      setForm({
        name: tshirtData.name || '',
        brandId: tshirtData.brand?.id || '',
        colorId: tshirtData.color?.id || '',
        designId: tshirtData.design?.id || '',
        sizes: tshirtData.sizes || [],
        gender: tshirtData.gender || '',
        material: tshirtData.material || '',
        fit: tshirtData.fit || '',
        sleeveType: tshirtData.sleeveType || '',
        neckType: tshirtData.neckType || '',
        price: tshirtData.price || 0,
        stock: tshirtData.stock || 0,
        featured: tshirtData.featured || false,
        tags: tshirtData.tags || '',
        description: tshirtData.description || '',
        customDesignName: tshirtData.customDesignName || '',
        designZoom: tshirtData.designZoom || 1,
        designPositionX: tshirtData.designPositionX || 0,
        designPositionY: tshirtData.designPositionY || 0,
        tshirtZoom: tshirtData.tshirtZoom || '1'
      });

      // Load brands, colors, and designs for dropdowns
      const [brandsData, colorsData, designsData] = await Promise.all([
        apiService.getBrands(),
        apiService.getColors(),
        apiService.getDesigns()
      ]);

      setBrands(brandsData);
      setColors(colorsData);
      setDesigns(designsData.content || designsData);
    } catch (err) {
      setError('Failed to load designed t-shirt data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSizesChange = (e) => {
    const sizes = e.target.value.split(',').map(size => size.trim()).filter(size => size);
    setForm(prev => ({ ...prev, sizes }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      // Validate required fields
      if (!form.name || !form.brandId || !form.colorId) {
        setError('Name, Brand, and Color are required');
        return;
      }

      // Prepare the data for update
      const updateData = {
        ...form,
        sizes: Array.isArray(form.sizes) ? form.sizes : form.sizes.split(',').map(s => s.trim()).filter(s => s)
      };

      await apiService.updateDesignedTshirt(id, updateData, newImage, token);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/manage-designed-tshirts');
      }, 2000);
    } catch (err) {
      setError('Failed to update designed t-shirt: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this designed t-shirt? This action cannot be undone.')) {
      return;
    }

    try {
      await apiService.deleteDesignedTshirt(id, token);
      navigate('/manage-designed-tshirts');
    } catch (err) {
      setError('Failed to delete designed t-shirt: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading designed t-shirt...</p>
        </div>
      </div>
    );
  }

  if (!designedTshirt) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Designed T-Shirt Not Found</h1>
          <button
            onClick={() => navigate('/manage-designed-tshirts')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Manage Designed T-Shirts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/manage-designed-tshirts')}
                className="text-gray-600 hover:text-gray-900"
              >
                <FaArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Edit Designed T-Shirt</h1>
            </div>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center gap-2"
            >
              <FaTrash /> Delete
            </button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            Designed t-shirt updated successfully! Redirecting...
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand *
                  </label>
                  <select
                    name="brandId"
                    value={form.brandId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Brand</option>
                    {brands.map(brand => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color *
                  </label>
                  <select
                    name="colorId"
                    value={form.colorId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Color</option>
                    {colors.map(color => (
                      <option key={color.id} value={color.id}>
                        {color.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sizes (comma separated)
                  </label>
                  <input
                    type="text"
                    value={Array.isArray(form.sizes) ? form.sizes.join(', ') : form.sizes}
                    onChange={handleSizesChange}
                    placeholder="S, M, L, XL"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Design Details */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Design Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Design (from gallery)
                  </label>
                  <select
                    name="designId"
                    value={form.designId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">No Design (Custom Upload)</option>
                    {designs.map(design => (
                      <option key={design.id} value={design.id}>
                        {design.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Custom Design Name
                  </label>
                  <input
                    type="text"
                    name="customDesignName"
                    value={form.customDesignName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Design Zoom
                  </label>
                  <input
                    type="number"
                    name="designZoom"
                    value={form.designZoom}
                    onChange={handleChange}
                    step="0.1"
                    min="0.1"
                    max="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    T-Shirt Zoom
                  </label>
                  <input
                    type="text"
                    name="tshirtZoom"
                    value={form.tshirtZoom}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Design Position X
                  </label>
                  <input
                    type="number"
                    name="designPositionX"
                    value={form.designPositionX}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Design Position Y
                  </label>
                  <input
                    type="number"
                    name="designPositionY"
                    value={form.designPositionY}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Product Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Gender</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Unisex">Unisex</option>
                    <option value="Children">Children</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Material
                  </label>
                  <input
                    type="text"
                    name="material"
                    value={form.material}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fit
                  </label>
                  <select
                    name="fit"
                    value={form.fit}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Fit</option>
                    <option value="Regular">Regular</option>
                    <option value="Slim">Slim</option>
                    <option value="Loose">Loose</option>
                    <option value="Oversized">Oversized</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sleeve Type
                  </label>
                  <select
                    name="sleeveType"
                    value={form.sleeveType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Sleeve Type</option>
                    <option value="Short Sleeve">Short Sleeve</option>
                    <option value="Long Sleeve">Long Sleeve</option>
                    <option value="Sleeveless">Sleeveless</option>
                    <option value="3/4 Sleeve">3/4 Sleeve</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Neck Type
                  </label>
                  <select
                    name="neckType"
                    value={form.neckType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Neck Type</option>
                    <option value="Round Neck">Round Neck</option>
                    <option value="V-Neck">V-Neck</option>
                    <option value="Crew Neck">Crew Neck</option>
                    <option value="Hooded">Hooded</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={form.featured}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Featured Product
                  </label>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={form.tags}
                    onChange={handleChange}
                    placeholder="comma separated tags"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Image</h3>
              <div className="space-y-4">
                {designedTshirt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Image
                    </label>
                    <div className="w-48 h-48 border rounded-lg overflow-hidden bg-gray-50">
                      <img
                        src={designedTshirt.imageUrl || '/default-tshirt.svg'}
                        alt={designedTshirt.name}
                        className="w-full h-full object-contain"
                        onError={e => { e.currentTarget.src = '/default-tshirt.svg'; }}
                      />
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload New Image (optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewImage(e.target.files[0])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/manage-designed-tshirts')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                <FaSave />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 