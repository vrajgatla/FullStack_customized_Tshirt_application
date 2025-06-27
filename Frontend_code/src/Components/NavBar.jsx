import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Collections' },
  { to: '/categories', label: 'Categories' },
  { to: '/custom-design', label: 'Custom Design' },
];

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full bg-white shadow p-4 flex flex-col md:flex-row items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-4 mb-2 md:mb-0">
        <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          <span role="img" aria-label="tshirt">👕</span> CustomTee
        </Link>
        <div className="hidden md:flex gap-2 ml-8">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${isActive ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {user && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${isActive ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow' : 'text-green-700 hover:bg-green-50 hover:text-green-800'}`
              }
            >
              Dashboard
            </NavLink>
          )}
        </div>
      </div>
      <div className="flex-1 flex md:justify-center w-full md:w-auto mb-2 md:mb-0">
        <input
          type="text"
          placeholder="Search for T-shirts, brands, designs..."
          className="w-full md:w-96 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div className="flex items-center gap-6">
        <Link to="/cart" className="text-xl hover:text-blue-600" title="Cart">
          <span role="img" aria-label="cart">🛒</span>
        </Link>
        {user ? (
          <>
            <span className="text-gray-700 font-semibold">{user.name}</span>
            <button onClick={logout} className="text-red-600 font-semibold hover:underline">Logout</button>
          </>
        ) : (
          <Link to="/login" className="text-xl hover:text-blue-600" title="Login">
            <span role="img" aria-label="user">👤</span>
          </Link>
        )}
      </div>
      {/* Mobile nav */}
      <div className="flex md:hidden w-full mt-2 gap-2 justify-center">
        {navLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `px-3 py-1 rounded font-semibold text-sm transition-all duration-200 ${isActive ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'}`
            }
          >
            {link.label}
          </NavLink>
        ))}
        {user && (
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `px-3 py-1 rounded font-semibold text-sm transition-all duration-200 ${isActive ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow' : 'text-green-700 hover:bg-green-50 hover:text-green-800'}`
            }
          >
            Dashboard
          </NavLink>
        )}
      </div>
    </nav>
  );
} 