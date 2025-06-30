import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaHeart } from 'react-icons/fa';

export default function ProductCard({ product, type = 'designed-tshirt' }) {
  const productLink = type === 'designed-tshirt' 
    ? `/designed-tshirts/${product.id}` 
    : `/products/${product.id}`;

  // Add a badge for demonstration
  const badge = product.id % 3 === 0 ? 'New' : (product.id % 5 === 0 ? 'Sale' : null);

  return (
    <div className="group relative bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 animate-fade-in">
      <Link to={productLink} className="block relative">
        <img
          src={product.imageUrl || '/default-tshirt.svg'}
          alt={product.name}
          className="w-full h-64 object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
          onError={e => { e.currentTarget.src = '/default-tshirt.svg'; }}
        />
        {badge && (
          <span className={`absolute top-3 left-3 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${badge === 'New' ? 'bg-pink-500' : 'bg-green-500'}`}>
            {badge}
          </span>
        )}
      </Link>
      
      <div className="p-4">
        <h3 className="font-bold text-gray-500 text-sm mb-1">{product.brand?.name || 'TrendTee'}</h3>
        <p className="text-gray-800 truncate font-semibold">{product.name}</p>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="font-extrabold text-lg text-pink-600">₹{product.price?.toFixed(2)}</span>
          {badge === 'Sale' && (
            <>
              <span className="text-gray-400 line-through text-sm">₹{(product.price * 1.4).toFixed(2)}</span>
              <span className="text-green-500 font-bold text-sm">(30% OFF)</span>
            </>
          )}
        </div>
      </div>

      <div className="absolute top-4 right-[-50px] group-hover:right-4 flex flex-col gap-2 transition-all duration-300">
        <button className="bg-white rounded-full p-3 shadow-lg hover:bg-pink-500 hover:text-white transition-all duration-300 text-pink-500" title="Add to Cart">
          <FaShoppingCart />
        </button>
        <button className="bg-white rounded-full p-3 shadow-lg hover:bg-pink-500 hover:text-white transition-all duration-300 text-pink-500" title="Add to Wishlist">
          <FaHeart />
        </button>
      </div>
    </div>
  );
} 