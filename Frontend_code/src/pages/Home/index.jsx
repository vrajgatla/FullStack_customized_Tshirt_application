import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPalette, FaTruck, FaShieldAlt, FaArrowRight } from 'react-icons/fa';
import FeaturedDesignedTshirts from './components/FeaturedDesignedTshirts';
import HeroBanner from './components/HeroBanner';
import LatestDesignedTshirts from './components/LatestDesignedTshirts';
import Reviews from './components/Reviews';

export default function Home() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 bg-white">
      {/* 1. Featured Designed T-Shirts Carousel */}
      <div className="my-6">
        <FeaturedDesignedTshirts />
      </div>

      {/* 2. Create Your T-Shirt Section */}
      <div className="my-6">
        <HeroBanner />
      </div>

      {/* 3. Latest Designed T-Shirts Section */}
      <div className="my-6">
        <LatestDesignedTshirts />
      </div>

      {/* 4. Ready to Custom Design Section */}
      <div className="my-6">
        <div className="bg-black text-white rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Your Custom T-Shirt?</h2>
          <p className="text-lg mb-6 opacity-90">Design your own unique t-shirt or browse our latest collections</p>
          <div className="flex gap-4 justify-center">
            <Link 
              to="/custom-design" 
              className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Start Designing
            </Link>
            <Link 
              to="/designed-tshirts" 
              className="border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-black transition-colors duration-200"
            >
              Browse Collections
            </Link>
          </div>
        </div>
      </div>

      {/* 5. Small Reviews Section */}
      <div className="my-6">
        <Reviews />
      </div>
    </div>
  );
}
