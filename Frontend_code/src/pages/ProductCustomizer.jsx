import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export default function ProductCustomizer() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [brands, setBrands] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes] = useState(['XS', 'S', 'M', 'L', 'XL', 'XXL']);

  useEffect(() => {
    fetchProductData();
  }, []);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      
      // Fetch product details
      const productRes = await fetch(`/api/tshirts/id/${productId}`);
      const productData = await productRes.json();
      setProduct(productData);
      
      // Fetch brands
      const brandsRes = await fetch('/api/brands');
      const brandsData = await brandsRes.json();
      setBrands(brandsData);
      
      // Fetch designs
      const designsRes = await fetch('/api/designs');
      const designsData = await designsRes.json();
      setDesigns(designsData);
      
      // Fetch colors
      const colorsRes = await fetch('/api/colors');
      const colorsData = await colorsRes.json();
      setColors(colorsData);
      
      // Set defaults
      if (brandsData.length > 0) setSelectedBrand(brandsData[0].id);
      if (colorsData.length > 0) setSelectedColor(colorsData[0].id);
      setSelectedSize('M');
      
    } catch (err) {
      console.error('Error fetching product data:', err);
      setError('Failed to load product data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!selectedBrand || !selectedColor || !selectedSize) {
      setError('Please select brand, color, and size');
      return;
    }

    const cartItem = {
      id: `${productId}-${selectedBrand}-${selectedDesign?.id || 'none'}-${selectedColor}-${selectedSize}`,
      productId: parseInt(productId),
      name: `${product?.name} - Custom`,
      price: product?.price || 0,
      brand: brands.find(b => b.id === selectedBrand)?.name,
      brandId: selectedBrand,
      design: selectedDesign?.name || 'No Design',
      designId: selectedDesign?.id || null,
      color: colors.find(c => c.id === selectedColor)?.name,
      colorId: selectedColor,
      size: selectedSize,
      quantity: quantity,
      image: product?.image || '/default-tshirt.jpg',
      isCustom: true
    };

    addToCart(cartItem);
    navigate('/cart');
  };

  const getPreviewImage = () => {
    if (!product) return '/default-tshirt.svg';
    
    // Use the backend image endpoint
    return `/api/tshirts/${product.id}/image`;
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="bg-gray-300 h-8 rounded mb-6"></div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-300 h-96 rounded"></div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-300 h-12 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Customize Your T-Shirt</h1>
        <p className="text-gray-600">
          Choose your brand, design, color, and size to create your perfect t-shirt
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Preview Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Preview</h2>
            <div className="relative">
              <img
                src={selectedTshirt?.imageUrl || '/default-tshirt.svg'}
                alt={selectedTshirt?.name}
                className="w-full h-96 object-contain rounded-lg border"
                onError={e => { e.currentTarget.src = '/default-tshirt.svg'; }}
              />
              {selectedDesign && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white bg-opacity-90 rounded-lg p-4 max-w-xs">
                    <p className="text-sm font-medium text-gray-800">
                      Design: {selectedDesign.name}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Product:</span>
                <span className="font-medium">{product?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Base Price:</span>
                <span className="font-medium">₹{product?.price?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Brand:</span>
                <span className="font-medium">
                  {brands.find(b => b.id === selectedBrand)?.name || 'Select Brand'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Color:</span>
                <span className="text-gray-800">
                  {colors.find(c => c.id === selectedColor)?.name || 'Select Color'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Size:</span>
                <span className="font-medium">{selectedSize || 'Select Size'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Design:</span>
                <span className="font-medium">
                  {selectedDesign?.name || 'No Design Selected'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Customization Options */}
        <div className="space-y-6">
          {/* Brand Selection */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose Brand</h3>
            <div className="grid grid-cols-2 gap-3">
              {brands.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => setSelectedBrand(brand.id)}
                  className={`p-4 border rounded-lg text-left transition-all ${
                    selectedBrand === brand.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-800">{brand.name}</div>
                  <div className="text-sm text-gray-600">{brand.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Design Selection */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose Design (Optional)</h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setSelectedDesign(null)}
                className={`p-4 border rounded-lg text-center transition-all ${
                  !selectedDesign
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">👕</div>
                <div className="text-sm font-medium">No Design</div>
              </button>
              {designs.map((design) => (
                <button
                  key={design.id}
                  onClick={() => setSelectedDesign(design)}
                  className={`p-4 border rounded-lg text-center transition-all ${
                    selectedDesign?.id === design.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-12 h-12 mx-auto mb-2 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-lg">🎨</span>
                  </div>
                  <div className="text-sm font-medium">{design.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose Color</h3>
            <div className="grid grid-cols-4 gap-3">
              {colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color.id)}
                  className={`p-4 border rounded-lg text-center transition-all ${
                    selectedColor === color.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div 
                    className="w-8 h-8 mx-auto mb-2 rounded-full border"
                    style={{ backgroundColor: color.hexCode }}
                  ></div>
                  <div className="text-sm font-medium">{color.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose Size</h3>
            <div className="grid grid-cols-3 gap-3">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`p-4 border rounded-lg text-center transition-all ${
                    selectedSize === size
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{size}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quantity</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
              >
                -
              </button>
              <span className="text-lg font-medium w-16 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <button
              onClick={handleAddToCart}
              disabled={!selectedBrand || !selectedColor || !selectedSize}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold shadow hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Add to Cart - ₹{((product?.price || 0) * quantity).toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 