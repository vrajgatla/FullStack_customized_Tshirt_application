import React from 'react';
import NavBar from './Components/NavBar';
import Footer from './Components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Account from './pages/Account';
import CustomDesign from './pages/CustomDesign';
import Categories from './pages/Categories';
import TshirtUpload from './pages/TshirtUpload';
import DesignUpload from './pages/DesignUpload';
import ManageDesigns from './pages/ManageDesigns';
import ManageTshirts from './pages/ManageTshirts';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AllDesigns from './pages/AllDesigns';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useEffect } from 'react';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function LoginWithRedirect() {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);
  return <Login />;
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <NavBar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/account" element={<Account />} />
            <Route path="/custom-design" element={<CustomDesign />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/login" element={<LoginWithRedirect />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/upload-tshirt" element={<PrivateRoute><TshirtUpload /></PrivateRoute>} />
            <Route path="/upload-design" element={<PrivateRoute><DesignUpload /></PrivateRoute>} />
            <Route path="/manage-designs" element={<PrivateRoute><ManageDesigns /></PrivateRoute>} />
            <Route path="/manage-tshirts" element={<PrivateRoute><ManageTshirts /></PrivateRoute>} />
            <Route path="/designs" element={<AllDesigns />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
} 