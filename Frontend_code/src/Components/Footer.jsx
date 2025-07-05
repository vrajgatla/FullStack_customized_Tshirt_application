import React from 'react';
import { Link } from 'react-router-dom';
import { FaTshirt, FaPalette, FaShoppingCart, FaUser, FaArrowUp } from 'react-icons/fa';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black text-white relative">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-white rounded-xl">
                <FaTshirt className="text-black text-xl" />
              </div>
              <span className="text-2xl font-bold text-white">
                CustomTee
              </span>
            </div>
            <p className="text-base text-gray-300 leading-relaxed">
              Create unique, personalized t-shirts with our easy-to-use design tool.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Quick Links</h3>
            <div className="space-y-3">
              <Link to="/products" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-300 group">
                <FaTshirt className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-base">Available T-Shirts</span>
              </Link>
              <Link to="/designed-tshirts" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-300 group">
                <FaPalette className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-base">Collections</span>
              </Link>
              <Link to="/custom-design" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-300 group">
                <FaPalette className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-base">Custom Design</span>
              </Link>
              <Link to="/cart" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-300 group">
                <FaShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-base">Shopping Cart</span>
              </Link>
              <Link to="/account" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-300 group">
                <FaUser className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-base">My Account</span>
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Contact</h3>
            <div className="space-y-3">
              <div className="text-gray-300">
                <span className="text-base">support@customtee.com</span>
              </div>
              <div className="text-gray-300">
                <span className="text-base">+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 mt-8 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-base text-gray-300">
                © 2024 CustomTee. All rights reserved.
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/privacy" className="text-base text-gray-300 hover:text-white transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-base text-gray-300 hover:text-white transition-colors duration-300">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 bg-black text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 border border-white"
        aria-label="Scroll to top"
      >
        <FaArrowUp className="w-5 h-5" />
      </button>
    </footer>
  );
} 