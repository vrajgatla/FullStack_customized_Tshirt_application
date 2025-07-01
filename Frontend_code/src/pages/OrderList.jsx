import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function OrderList() {
  const { user, token, isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders/my-orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="bg-gray-300 h-8 rounded mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-300 h-32 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Orders</h1>
        <p className="text-gray-600">
          Track your order history and current orders
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Orders Yet</h2>
          <p className="text-gray-600 mb-6">
            You haven't placed any orders yet. Start shopping to see your orders here!
          </p>
          <a
            href="/products"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
          >
            Browse Products
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Order #{order.id}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-2 md:mt-0">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <span className="text-lg font-bold text-blue-600">
                    ₹{order.total?.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-800 mb-3">Order Items:</h4>
                <div className="space-y-3">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 bg-gray-50 rounded-lg p-3">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <img
                          src={
                            (item.images && item.images.length > 0 &&
                              (item.images.find(img => img.isMain) ? item.images.find(img => img.isMain).imageUrl : item.images[0].imageUrl)
                            ) || item.imageUrl || '/default-tshirt.svg'
                          }
                          alt={item.name}
                          className="w-16 h-16 object-contain rounded border"
                          onError={e => { e.currentTarget.src = '/default-tshirt.svg'; }}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.tshirtName || 'Custom T-Shirt'}</p>
                        <p className="text-sm text-gray-600">
                          Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                        </p>
                        {item.designName && (
                          <p className="text-sm text-gray-600">Design: {item.designName}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Information */}
              {order.shippingAddress && (
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Shipping Address:</h4>
                  <p className="text-gray-600 text-sm">
                    {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 