import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  { label: 'Men', gender: 'Men', bg: 'from-pink-400 to-yellow-300' },
  { label: 'Women', gender: 'Women', bg: 'from-blue-400 to-purple-300' },
  { label: 'Kids', gender: 'Kids', bg: 'from-green-400 to-teal-300' },
  { label: 'Unisex', gender: 'Unisex', bg: 'from-orange-400 to-pink-300' }
];

export default function FeaturedProductsCarousel() {
  const [featured, setFeatured] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    Promise.all(
      CATEGORIES.map(cat =>
        fetch(`/api/designed-tshirts?gender=${encodeURIComponent(cat.gender)}`)
          .then(res => res.ok ? res.json() : [])
          .then(data => {
            let design = Array.isArray(data) ? data.find(d => d.gender === cat.gender) : (data.content ? data.content.find(d => d.gender === cat.gender) : null);
            return design
              ? {
                  id: design.id,
                  name: design.name || cat.label,
                  image: design.imageUrl || '/default-tshirt.svg',
                  price: design.price || '',
                  badge: cat.label,
                  bg: cat.bg,
                  gender: cat.gender
                }
              : {
                  id: null,
                  name: cat.label,
                  image: '/default-tshirt.svg',
                  price: '',
                  badge: cat.label,
                  bg: cat.bg,
                  gender: cat.gender
                };
          })
      )
    ).then(setFeatured);
  }, []);

  const total = featured.length;

  const prev = () => setCurrent((current - 1 + total) % total);
  const next = () => setCurrent((current + 1) % total);

  if (featured.length === 0) return null;

  return (
    <div className="relative w-full max-w-7xl mx-auto my-10">
      <div className={
        `rounded-2xl shadow-2xl bg-gradient-to-r from-black via-gray-700 to-gray-300 flex flex-col md:flex-row items-center p-6 md:p-10 transition-all duration-500 ml-[50px]`
      }>
        <img src={featured[current].image} alt={featured[current].name} className="w-36 h-36 md:w-56 md:h-56 object-contain rounded-xl shadow-xl bg-white" />
        <div className="flex-1 flex flex-col items-center md:items-start mt-2 md:mt-0 md:ml-6">
          <span className="inline-block bg-white text-black font-bold px-4 py-1 rounded-full mb-3 shadow text-xs uppercase tracking-wider">{featured[current].badge}</span>
          <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-4 drop-shadow-lg">{featured[current].name}</h3>
          {featured[current].price && <div className="text-lg md:text-xl font-bold text-yellow-200 mb-6">₹{featured[current].price}</div>}
          <Link to={`/designed-tshirts?gender=${encodeURIComponent(featured[current].gender)}`} className="bg-white text-black font-bold px-8 py-4 rounded-xl shadow hover:scale-105 hover:shadow-2xl transition-all duration-300 text-base md:text-lg mx-auto">Shop Now</Link>
        </div>
      </div>
      {/* Arrows for desktop */}
      <button onClick={prev} className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black rounded-full w-14 h-14 items-center justify-center shadow-lg z-10 transition-all text-4xl">&#8592;</button>
      <button onClick={next} className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black rounded-full w-14 h-14 items-center justify-center shadow-lg z-10 transition-all text-4xl">&#8594;</button>
      {/* Dots for mobile */}
      <div className="flex md:hidden justify-center mt-4 gap-2">
        {featured.map((_, idx) => (
          <button key={idx} onClick={() => setCurrent(idx)} className={`w-3 h-3 rounded-full ${current === idx ? 'bg-black' : 'bg-white border border-gray-700'}`}></button>
        ))}
      </div>
    </div>
  );
} 