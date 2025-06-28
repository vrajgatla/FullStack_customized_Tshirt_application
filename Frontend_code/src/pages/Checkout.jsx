import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export default function Checkout() {
  const { cartItems, getCartTotal, createOrder, loading } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [previewImg, setPreviewImg] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });
  const [errors, setErrors] = useState({});
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }

    // Pre-fill form with user data
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || ''
      }));
    }
  }, [isAuthenticated, cartItems.length, user, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
    if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
    if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';
    if (!formData.cardName.trim()) newErrors.cardName = 'Cardholder name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const orderData = {
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        paymentInfo: {
          cardNumber: formData.cardNumber.slice(-4), // Only store last 4 digits
          cardName: formData.cardName
        },
        status: 'PENDING'
      };

      const order = await createOrder(orderData);
      setOrderSuccess(true);
      
      // Redirect to success page or dashboard after 3 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
      
    } catch (error) {
      console.error('Order creation failed:', error);
      alert('Failed to create order. Please try again.');
    }
  };

  if (orderSuccess) {
    return (
      <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 text-center">
        <div className="bg-green-50 border border-green-200 rounded-xl p-8">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-green-800 mb-4">Order Placed Successfully!</h1>
          <p className="text-green-700 mb-6">Thank you for your order. You will receive a confirmation email shortly.</p>
          <p className="text-sm text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Checkout</h1>
      
      {/* Preview Modal */}
      {previewImg && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-2">
          <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 relative max-w-lg w-full flex flex-col items-center">
            <button 
              onClick={() => setPreviewImg(null)} 
              className="absolute top-2 right-2 text-2xl font-bold text-gray-600 hover:text-red-500 transition-colors"
            >
              &times;
            </button>
            <img src={previewImg} alt="Preview" className="w-full h-auto max-h-[70vh] object-contain rounded-xl" />
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shipping Information */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Shipping Information</h2>
          
          <div>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div>
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>
            <div>
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
            </div>
          </div>

          <div>
            <input
              type="text"
              name="zipCode"
              placeholder="ZIP Code"
              value={formData.zipCode}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.zipCode ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
          </div>
        </div>

        {/* Payment Information */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Payment Information</h2>
          
          <div>
            <input
              type="text"
              name="cardName"
              placeholder="Cardholder Name"
              value={formData.cardName}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.cardName ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>}
          </div>

          <div>
            <input
              type="text"
              name="cardNumber"
              placeholder="Card Number"
              value={formData.cardNumber}
              onChange={handleInputChange}
              maxLength="16"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="expiryDate"
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
            </div>
            <div>
              <input
                type="text"
                name="cvv"
                placeholder="CVV"
                value={formData.cvv}
                onChange={handleInputChange}
                maxLength="4"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.cvv ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
            </div>
          </div>
        </div>
      </form>

      {/* Order Summary */}
      <div className="bg-white rounded-xl shadow p-6 mt-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Order Summary</h2>
        
        <div className="space-y-4 mb-6">
          {cartItems.map((item, index) => (
            <div key={`${item.id}-${item.size}-${item.color}-${index}`} className="flex items-center gap-4 bg-gray-50 rounded-xl p-4">
              <img
                src={item.combinedImage || item.design}
                alt={item.name}
                className="w-16 h-16 object-cover rounded cursor-pointer border-2 border-blue-200 hover:border-blue-500 transition"
                onClick={() => setPreviewImg(item.combinedImage || item.design)}
                title="Click to preview"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-700">{item.name}</div>
                <div className="text-gray-500 text-sm">
                  Brand: {item.brand} | Color: {item.color} | Size: {item.size} | Qty: {item.quantity || 1}
                </div>
                {item.designName && (
                  <div className="text-gray-500 text-sm">Design: {item.designName}</div>
                )}
              </div>
              <div className="text-lg font-bold text-blue-700">
                ${(item.price * (item.quantity || 1)).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>$4.99</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total:</span>
            <span>${(getCartTotal() + 4.99).toFixed(2)}</span>
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
        >
          {loading ? 'Processing Order...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
} 