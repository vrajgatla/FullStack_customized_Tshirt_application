import React from 'react';
import { Link } from 'react-router-dom';

export default function HeroBanner() {
  return (
    <div className="relative bg-black rounded-2xl shadow-2xl my-8 overflow-hidden">
      <div className="p-12 flex flex-col lg:flex-row items-center justify-between">
        <div className="lg:w-1/2 text-white text-center lg:text-left z-10">
          <h1 className="text-5xl font-extrabold leading-tight drop-shadow-lg">
            Style That Speaks
          </h1>
          <p className="mt-4 text-xl opacity-90">
            Discover exclusive designs or create your own. Your perfect T-shirt is just a click away.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
            <Link to="/products" className="inline-block bg-white text-black font-bold px-8 py-3 rounded-xl shadow-xl hover:scale-105 transition-transform text-lg">
              Shop Now
            </Link>
            <Link to="/custom-design" className="inline-block bg-transparent border-2 border-white text-white font-bold px-8 py-3 rounded-xl shadow-xl hover:bg-white hover:text-black transition-colors text-lg">
              Create Your Own
            </Link>
          </div>
        </div>
        <div className="hidden lg:block lg:w-1/2 mt-8 lg:mt-0 relative h-72">
          <img src="https://res.cloudinary.com/dbanspk1d/image/upload/v1751634345/designed-tshirts/qrobdjrdlwxqhnjrylxb.png" alt="T-shirt" className="absolute -right-10 top-1/2 -translate-y-1/2 w-80 h-80 transform rotate-[20deg] opacity-40" />
          <img src="https://res.cloudinary.com/dbanspk1d/image/upload/v1751389816/designed-tshirts/uifwjszqlwwlqf4hlsk8.png" alt="T-shirt" className="absolute right-20 top-1/2 -translate-y-1/2 w-96 h-96 transform -rotate-[15deg] shadow-2xl rounded-2xl" />
        </div>
      </div>
    </div>
  );
} 