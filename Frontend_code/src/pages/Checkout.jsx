import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaTruck, FaCreditCard, FaLock, FaSignInAlt } from 'react-icons/fa';

export default function Checkout() {
  const { cartItems, getCartTotal, createOrder, isAuthenticated } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', address: '', city: '', state: '', zipCode: '', country: 'India',
    cardNumber: '', expiryDate: '', cvv: '', cardName: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }
    if (user) setFormData(prev => ({ ...prev, fullName: user.name, email: user.email }));
  }, [isAuthenticated, cartItems.length, user, navigate]);

  // Show loading or redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Show loading or redirect if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Cart is Empty</h2>
          <p className="text-gray-600">Redirecting to cart...</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    // Add validation logic here
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add validation logic here
    const orderData = { customerName: formData.fullName, shippingAddress: { address: formData.address } };
    try {
      await createOrder(orderData);
      navigate('/order-success'); // Redirect to a dedicated success page
    } catch (error) {
      console.error('Order creation failed:', error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900">Checkout</h1>
          <div className="text-sm text-gray-600">
            Welcome, <span className="font-semibold text-pink-600">{user?.name}</span>!
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center text-pink-500">
              <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center"><FaUser /></div>
              <span className="font-bold ml-2">Shipping</span>
            </div>
            <div className={`flex-1 h-1 mx-4 rounded ${step === 2 ? 'bg-pink-500' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${step === 2 ? 'text-pink-500' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 2 ? 'bg-pink-500 text-white' : 'bg-gray-300'}`}><FaCreditCard /></div>
              <span className="font-bold ml-2">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <section>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Shipping Address</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Full Name" className="p-3 border rounded-lg w-full" />
                    <input name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="p-3 border rounded-lg w-full" />
                    <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number" className="p-3 border rounded-lg w-full" />
                    <input name="address" value={formData.address} onChange={handleInputChange} placeholder="Address" className="p-3 border rounded-lg w-full" />
                    <input name="city" value={formData.city} onChange={handleInputChange} placeholder="City" className="p-3 border rounded-lg w-full" />
                    <input name="state" value={formData.state} onChange={handleInputChange} placeholder="State" className="p-3 border rounded-lg w-full" />
                    <input name="zipCode" value={formData.zipCode} onChange={handleInputChange} placeholder="ZIP Code" className="p-3 border rounded-lg w-full" />
                    <input name="country" value={formData.country} onChange={handleInputChange} placeholder="Country" className="p-3 border rounded-lg w-full" />
          </div>
                  <button onClick={handleNextStep} type="button" className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 rounded-lg shadow-lg hover:scale-105 transition-transform">
                    Continue to Payment
                  </button>
                </section>
              )}
              {step === 2 && (
                <section>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Payment Details</h2>
                  <div className="grid grid-cols-1 gap-4">
                    <input name="cardName" onChange={handleInputChange} placeholder="Name on Card" className="p-3 border rounded-lg" />
                    <input name="cardNumber" onChange={handleInputChange} placeholder="Card Number" className="p-3 border rounded-lg" />
          <div className="grid grid-cols-2 gap-4">
                      <input name="expiryDate" onChange={handleInputChange} placeholder="MM/YY" className="p-3 border rounded-lg" />
                      <input name="cvv" onChange={handleInputChange} placeholder="CVV" className="p-3 border rounded-lg" />
            </div>
            </div>
                  <button type="submit" className="w-full mt-6 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold py-3 rounded-lg shadow-lg hover:scale-105 transition-transform">
                    Place Order
                  </button>
                  <button onClick={() => setStep(1)} type="button" className="w-full mt-3 text-gray-600 font-semibold">Back to Shipping</button>
                </section>
              )}
            </form>
          </div>

      {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="font-bold text-xl mb-4">Your Order</h2>
              <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                {cartItems.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold ml-auto">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                </div>
              <div className="border-t my-4"></div>
              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Total</span>
                <span>₹{getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                <FaLock /> <span>Secure SSL Encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 