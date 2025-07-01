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
          src={
            (product.images && product.images.length > 0 &&
              (product.images.find(img => img.isMain) ? product.images.find(img => img.isMain).imageUrl : product.images[0].imageUrl)
            ) || product.imageUrl || '/default-tshirt.svg'
          }
          alt={product.name}
          className="w-full h-48 object-contain rounded-t transition-transform duration-300 group-hover:scale-105"
          onError={e => { e.currentTarget.src = '/default-tshirt.svg'; }}
        />
        {badge && (
          <span className={`absolute top-3 left-3 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${badge === 'New' ? 'bg-pink-500' : 'bg-green-500'}`}>
            {badge}
          </span>
        )}
      </Link>
      
      <div className="p-4">
        <h3 className="text-xs font-medium text-gray-500 mb-1">{product.brand?.name || 'TrendTee'}</h3>
        <p className="text-base font-semibold text-gray-900 mb-1">{product.name}</p>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="font-extrabold text-xl text-pink-600">₹{product.price?.toFixed(2)}</span>
          {badge === 'Sale' && (
            <>
              <span className="text-xs text-gray-400 line-through">₹{(product.price * 1.4).toFixed(2)}</span>
              <span className="text-xs text-green-500 font-bold">(30% OFF)</span>
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