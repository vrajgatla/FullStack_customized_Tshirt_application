import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Toaster } from 'react-hot-toast';
import React from 'react';
import NavBar from './Components/NavBar';
import Footer from './Components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import DesignedTshirts from './pages/DesignedTshirts';
import DesignedTshirtDetail from './pages/DesignedTshirtDetail';
import CustomDesign from './pages/CustomDesign';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Account from './pages/Account';
import TshirtUpload from './pages/TshirtUpload';
import DesignUpload from './pages/DesignUpload';
import ManageTshirts from './pages/ManageTshirts';
import ManageDesigns from './pages/ManageDesigns';
import ManageDesignedTshirts from './pages/ManageDesignedTshirts';
import EditDesignedTshirt from './pages/EditDesignedTshirt';
import AdminRoute from './Components/AdminRoute';
import OrderList from './pages/OrderList';
import OrderSuccess from './pages/OrderSuccess';
import UserRoute from './Components/UserRoute';
import Dashboard from './pages/Dashboard';

function App() {
  return (
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
            <Toaster position="top-center" reverseOrder={false} />
            <NavBar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/designed-tshirts" element={<DesignedTshirts />} />
                <Route path="/designed-tshirts/:id" element={<DesignedTshirtDetail />} />
                <Route path="/custom-design" element={<CustomDesign />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                
                <Route path="/account" element={<UserRoute><Account /></UserRoute>} />
                <Route path="/orders" element={<UserRoute><OrderList /></UserRoute>} />

                <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
                <Route path="/admin/tshirt-upload" element={<AdminRoute><TshirtUpload /></AdminRoute>} />
                <Route path="/admin/design-upload" element={<AdminRoute><DesignUpload /></AdminRoute>} />
                <Route path="/admin/manage-tshirts" element={<AdminRoute><ManageTshirts /></AdminRoute>} />
                <Route path="/admin/manage-designs" element={<AdminRoute><ManageDesigns /></AdminRoute>} />
                <Route path="/admin/manage-designed-tshirts" element={<AdminRoute><ManageDesignedTshirts /></AdminRoute>} />
                <Route path="/admin/edit-designed-tshirt/:id" element={<AdminRoute><EditDesignedTshirt /></AdminRoute>} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
  );
}

export default App; 