import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-blue-100 to-purple-100 border-t p-8 flex flex-col md:flex-row items-center justify-between text-gray-700 mt-8 shadow-inner">
      <div className="flex items-center gap-2 text-2xl font-bold text-blue-700 mb-4 md:mb-0">
        <span role="img" aria-label="tshirt">👕</span> CustomTee
      </div>
      <div className="flex flex-wrap gap-6 mb-4 md:mb-0">
        <Link to="/" className="hover:text-blue-600 font-semibold">Home</Link>
        <Link to="/products" className="hover:text-blue-600 font-semibold">Collections</Link>
        <Link to="/categories" className="hover:text-blue-600 font-semibold">Categories</Link>
        <Link to="/custom-design" className="hover:text-blue-600 font-semibold">Custom Design</Link>
        <Link to="/account" className="hover:text-blue-600 font-semibold">Account</Link>
      </div>
      <div className="flex gap-4 text-xl">
        <a href="#" className="hover:text-blue-600" title="Instagram">📸</a>
        <a href="#" className="hover:text-blue-600" title="Twitter">🐦</a>
        <a href="#" className="hover:text-blue-600" title="Facebook">📘</a>
      </div>
      <div className="text-sm text-gray-500 mt-4 md:mt-0">&copy; {new Date().getFullYear()} CustomTee. All rights reserved.</div>
    </footer>
  );
} 