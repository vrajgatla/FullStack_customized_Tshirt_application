import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { FaTshirt, FaUserTie, FaUser, FaChild, FaPalette, FaFire, FaTags, FaShoppingCart, FaUserCircle, FaBars } from 'react-icons/fa';

const categories = [
  { to: '/designed-tshirts?gender=Men', label: 'Men', icon: <FaUserTie className="inline mr-1" /> },
  { to: '/designed-tshirts?gender=Women', label: 'Women', icon: <FaUser className="inline mr-1" /> },
  { to: '/designed-tshirts?gender=Kids', label: 'Kids', icon: <FaChild className="inline mr-1" /> },
  { to: '/designed-tshirts?gender=Unisex', label: 'Unisex', icon: <FaPalette className="inline mr-1" /> },
  { to: '/custom-design', label: 'Custom', icon: <FaPalette className="inline mr-1" /> },
  { to: '/products?sort=trending', label: 'Trending', icon: <FaFire className="inline mr-1" /> },
  { to: '/products?sort=sale', label: 'Sale', icon: <FaTags className="inline mr-1" /> },
];

export default function NavBar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="w-full bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo and Categories */}
        <div className="flex items-center gap-4">
          <Link to="/" className="text-3xl font-extrabold text-pink-600 flex items-center gap-2">
            <FaTshirt className="text-4xl text-purple-500" />
            <span className="hidden sm:inline">TrendTee</span>
          </Link>
          <div className="hidden md:flex relative">
            <button onClick={() => setShowCategories((v) => !v)} className="px-4 py-2 rounded-lg font-semibold text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-all duration-200 flex items-center gap-2">
              <FaBars className="mr-1" /> Categories
            </button>
            {showCategories && (
              <div className="absolute left-0 top-full mt-2 bg-white rounded-xl shadow-xl py-2 w-56 animate-fade-in border border-pink-100">
                {categories.map((cat) => (
                  <NavLink
                    key={cat.to}
                    to={cat.to}
                    className={({ isActive }) =>
                      `block px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${isActive ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow' : 'text-gray-700 hover:bg-pink-50 hover:text-pink-600'}`
                    }
                    onClick={() => setShowCategories(false)}
                  >
                    {cat.icon} {cat.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 mx-4 max-w-lg hidden md:flex">
          <input
            type="text"
            placeholder="Search for T-shirts, brands, designs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 border border-pink-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50"
          />
          <button type="submit" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 rounded-r-lg font-bold shadow hover:scale-105 transition-all duration-200">Search</button>
        </form>
        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative text-2xl text-purple-600 hover:text-pink-600 transition" title="Cart">
            <FaShoppingCart />
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                {getCartCount() > 99 ? '99+' : getCartCount()}
              </span>
            )}
          </Link>
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {isAdmin() && (
                <Link to="/admin/dashboard" className="hidden md:inline text-gray-700 font-semibold hover:text-pink-600">Dashboard</Link>
              )}
              <span className="hidden md:inline text-gray-700 font-semibold">{user?.name}</span>
              <button onClick={handleLogout} className="text-pink-600 font-bold hover:underline transition-colors">Logout</button>
              <Link to="/account" className="text-2xl text-gray-500 hover:text-purple-600 transition"><FaUserCircle /></Link>
            </div>
          ) : (
            <Link to="/login" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-lg font-bold shadow hover:scale-105 transition-all duration-200">Login / Signup</Link>
          )}
        </div>
        {/* Mobile menu button */}
        <button className="md:hidden text-2xl text-pink-600 ml-2" onClick={() => setShowMobileMenu((v) => !v)}>
          <FaBars />
        </button>
      </div>
      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-t border-pink-100 shadow-xl animate-fade-in">
          <div className="flex flex-col gap-2 p-4">
            {categories.map((cat) => (
              <NavLink
                key={cat.to}
                to={cat.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${isActive ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow' : 'text-gray-700 hover:bg-pink-50 hover:text-pink-600'}`
                }
                onClick={() => setShowMobileMenu(false)}
              >
                {cat.icon} {cat.label}
              </NavLink>
            ))}
            <form onSubmit={handleSearch} className="flex mt-2">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 p-2 border border-pink-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50"
              />
              <button type="submit" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 rounded-r-lg font-bold shadow">Go</button>
            </form>
            {isAuthenticated ? (
              <div className="flex flex-col gap-2 mt-2">
                {isAdmin() && (
                  <Link to="/admin/dashboard" onClick={() => setShowMobileMenu(false)} className="text-gray-700 font-semibold hover:text-pink-600">Dashboard</Link>
                )}
                <button onClick={handleLogout} className="text-pink-600 font-bold hover:underline transition-colors text-left">Logout</button>
              </div>
            ) : (
              <Link to="/login" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg font-bold shadow mt-2 text-center">Login / Signup</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 