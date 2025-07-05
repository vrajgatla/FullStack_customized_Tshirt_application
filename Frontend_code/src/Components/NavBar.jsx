import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { FaTshirt, FaUserTie, FaUser, FaChild, FaPalette, FaFire, FaShoppingCart, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';

export default function NavBar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 shadow-lg border-b-4 border-purple-400 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Navigation */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-xl shadow-lg transform group-hover:scale-110 transition-all duration-300">
              <FaTshirt className="text-white text-2xl drop-shadow-lg" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent drop-shadow-lg">
              CustomTee
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Direct Navigation Links */}
            <div className="flex items-center space-x-6">
              <NavLink 
                to="/products" 
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                    isActive 
                      ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm' 
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                <FaTshirt className="w-5 h-5 text-yellow-300" />
                <span>Available T-Shirts</span>
              </NavLink>
                  <NavLink
                to="/designed-tshirts" 
                    className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                    isActive 
                      ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm' 
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                <FaPalette className="w-5 h-5 text-pink-300" />
                <span>Collections</span>
                  </NavLink>
              <NavLink
                to="/custom-design" 
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                    isActive 
                      ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm' 
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                <FaPalette className="w-5 h-5 text-orange-300" />
                <span>Custom Design</span>
              </NavLink>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link to="/cart" className="relative p-3 text-white hover:text-yellow-200 transition-all duration-300 transform hover:scale-110">
              <FaShoppingCart className="w-6 h-6 drop-shadow-lg" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg animate-pulse">
                  {getCartCount() > 99 ? '99+' : getCartCount()}
                </span>
              )}
            </Link>

            {/* User Actions */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {isAdmin() && (
                  <Link 
                    to="/admin/dashboard" 
                    className="hidden md:inline px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Dashboard
                  </Link>
                )}
                <div className="flex items-center space-x-3">
                  <span className="hidden md:inline text-sm font-semibold text-white/90">{user?.name}</span>
                  <button 
                    onClick={handleLogout} 
                    className="text-sm font-semibold text-white/90 hover:text-red-200 transition-all duration-300 transform hover:scale-105"
                  >
                    Logout
                  </button>
                </div>
                <Link to="/account" className="p-3 text-white hover:text-yellow-200 transition-all duration-300 transform hover:scale-110">
                  <FaUserCircle className="w-6 h-6 drop-shadow-lg" />
                </Link>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-3 text-white hover:text-yellow-200 transition-all duration-300 transform hover:scale-110"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <FaTimes className="w-6 h-6 drop-shadow-lg" /> : <FaBars className="w-6 h-6 drop-shadow-lg" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t-2 border-white/20 bg-gradient-to-b from-purple-600/95 to-pink-600/95 backdrop-blur-sm">
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Direct Navigation */}
              <div className="space-y-3">
                <NavLink
                  to="/products"
                  onClick={() => setShowMobileMenu(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-4 px-4 py-4 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                      isActive 
                        ? 'bg-white/25 text-white shadow-lg backdrop-blur-sm' 
                        : 'text-white/90 hover:text-white hover:bg-white/15'
                    }`
                  }
                >
                  <FaTshirt className="w-5 h-5 text-yellow-300" />
                  <span>Available T-Shirts</span>
                </NavLink>
                <NavLink
                  to="/designed-tshirts"
                  onClick={() => setShowMobileMenu(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-4 px-4 py-4 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                      isActive 
                        ? 'bg-white/25 text-white shadow-lg backdrop-blur-sm' 
                        : 'text-white/90 hover:text-white hover:bg-white/15'
                    }`
                  }
                >
                  <FaPalette className="w-5 h-5 text-pink-300" />
                  <span>Collections</span>
                </NavLink>
                <NavLink
                  to="/custom-design"
                  onClick={() => setShowMobileMenu(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-4 px-4 py-4 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                      isActive 
                        ? 'bg-white/25 text-white shadow-lg backdrop-blur-sm' 
                        : 'text-white/90 hover:text-white hover:bg-white/15'
                    }`
                  }
                >
                  <FaPalette className="w-5 h-5 text-orange-300" />
                  <span>Custom Design</span>
                </NavLink>
              </div>

              {/* Mobile User Actions */}
              {isAuthenticated ? (
                <div className="space-y-3 pt-4 border-t-2 border-white/20">
                  {isAdmin() && (
                    <Link 
                      to="/admin/dashboard" 
                      onClick={() => setShowMobileMenu(false)}
                      className="block px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Dashboard
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout} 
                    className="block w-full text-left px-4 py-3 text-sm font-semibold text-white/90 hover:text-red-200 transition-all duration-300"
                  >
                    Logout
                  </button>
                  <Link 
                    to="/account" 
                    onClick={() => setShowMobileMenu(false)}
                    className="block px-4 py-3 text-white/90 hover:text-white transition-all duration-300"
                  >
                    My Account
                  </Link>
                </div>
              ) : (
                <div className="pt-4 border-t-2 border-white/20">
                  <Link 
                    to="/login" 
                    onClick={() => setShowMobileMenu(false)}
                    className="block px-4 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Sign In
                  </Link>
                </div>
            )}
          </div>
        </div>
      )}
      </div>
    </nav>
  );
} 