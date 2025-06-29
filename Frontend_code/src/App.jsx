import React from 'react';
import NavBar from './Components/NavBar';
import Footer from './Components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import DesignedTshirtDetail from './pages/DesignedTshirtDetail';
import DesignedTshirts from './pages/DesignedTshirts';
import ProductCustomizer from './pages/ProductCustomizer';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Account from './pages/Account';
import CustomDesign from './pages/CustomDesign';
import TshirtUpload from './pages/TshirtUpload';
import DesignUpload from './pages/DesignUpload';
import ManageDesigns from './pages/ManageDesigns';
import ManageTshirts from './pages/ManageTshirts';
import ManageDesignedTshirts from './pages/ManageDesignedTshirts';
import EditDesignedTshirt from './pages/EditDesignedTshirt';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AllDesigns from './pages/AllDesigns';
import OrderList from './pages/OrderList';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import ErrorBoundary from './components/ErrorBoundary';
import AdminRoute from './components/AdminRoute';
import UserRoute from './components/UserRoute';
import { useEffect } from 'react';

function LoginWithRedirect() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);
  return <Login />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <NavBar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/designed-tshirts" element={<DesignedTshirts />} />
                <Route path="/designed-tshirts/:id" element={<DesignedTshirtDetail />} />
                <Route path="/customize/:productId" element={<ProductCustomizer />} />
                <Route path="/designs" element={<AllDesigns />} />
                <Route path="/login" element={<LoginWithRedirect />} />
                <Route path="/signup" element={<Signup />} />

                {/* User Routes (require login) */}
                <Route path="/cart" element={<UserRoute><Cart /></UserRoute>} />
                <Route path="/checkout" element={<UserRoute><Checkout /></UserRoute>} />
                <Route path="/account" element={<UserRoute><Account /></UserRoute>} />
                <Route path="/orders" element={<UserRoute><OrderList /></UserRoute>} />
                <Route path="/custom-design" element={<UserRoute><CustomDesign /></UserRoute>} />

                {/* Admin Routes (require admin role) */}
                <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
                <Route path="/upload-tshirt" element={<AdminRoute><TshirtUpload /></AdminRoute>} />
                <Route path="/upload-design" element={<AdminRoute><DesignUpload /></AdminRoute>} />
                <Route path="/manage-designs" element={<AdminRoute><ManageDesigns /></AdminRoute>} />
                <Route path="/manage-tshirts" element={<AdminRoute><ManageTshirts /></AdminRoute>} />
                <Route path="/manage-designed-tshirts" element={<AdminRoute><ManageDesignedTshirts /></AdminRoute>} />
                <Route path="/edit-designed-tshirt/:id" element={<AdminRoute><EditDesignedTshirt /></AdminRoute>} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
} 