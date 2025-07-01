import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPalette, FaTruck, FaShieldAlt } from 'react-icons/fa';
import Testimonials from './components/Testimonials';
import TrustBadges from './components/TrustBadges';
import FeaturedProductsCarousel from './components/FeaturedProductsCarousel';
import ShopByCategory from './components/ShopByCategory';
import HeroBanner from './components/HeroBanner';
import ProductCard from '../../Components/ProductCard';

export default function Home() {
  const [designedTshirts, setDesignedTshirts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/designed-tshirts')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setDesignedTshirts(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-8 bg-gradient-to-br from-blue-50 via-purple-50 to-white animate-fade-in">
      <div className="w-[90vw] mx-auto my-10">
        <FeaturedProductsCarousel />
      </div>
      <div className="w-[90vw] mx-auto my-10">
        <HeroBanner />
      </div>
      <div className="w-[90vw] mx-auto my-10">
        <ShopByCategory />
      </div>
      {/* Trending Designs Section */}
      <div className="w-[90vw] mx-auto my-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Trending Now</h2>
          <Link to="/designed-tshirts" className="text-pink-600 hover:text-purple-600 font-semibold text-lg flex items-center gap-2 hover:underline transition-colors duration-200">
            See All
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>
        {loading ? (
          <div className="text-gray-500 mt-8 text-center py-12">Loading latest trends...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {designedTshirts.slice(0, 4).map((designedTshirt) => (
              <ProductCard key={designedTshirt.id} product={designedTshirt} type="designed-tshirt" />
            ))}
          </div>
        )}
      </div>
      <div className="w-[90vw] mx-auto my-10">
        <TrustBadges />
      </div>
      <div className="w-[90vw] mx-auto my-10">
        <Testimonials />
      </div>
      {/* Call to Action */}
      
    </div>
  );
}
