import React from 'react';

const testimonials = [
  {
    name: 'Ava Smith',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
    quote: 'Absolutely love my custom t-shirt! The quality is amazing and the design process was so easy.'
  },
  {
    name: 'Liam Johnson',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
    quote: 'Fast delivery and the print looks exactly as I imagined. Will order again!'
  },
  {
    name: 'Sophia Lee',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    rating: 4,
    quote: 'Great experience! The customizer is fun and the shirt fits perfectly.'
  },
  {
    name: 'Noah Brown',
    avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
    rating: 5,
    quote: 'Best online t-shirt store! Highly recommend to anyone looking for unique designs.'
  }
];

export default function Testimonials() {
  return (
    <section className="my-20 max-w-7xl mx-auto px-4">
      <h2 className="text-lg md:text-xl font-extrabold text-center text-gray-800 mb-10">What Our Customers Say</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
        {testimonials.map((t, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-all duration-300">
            <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-full mb-4 border-2 border-blue-100 object-cover" />
            <div className="flex gap-1 mb-1">
              {[...Array(t.rating)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-lg">★</span>
              ))}
              {[...Array(5 - t.rating)].map((_, i) => (
                <span key={i} className="text-gray-300 text-lg">★</span>
              ))}
            </div>
            <p className="text-sm text-gray-700 mb-2 italic">"{t.quote}"</p>
            <span className="font-semibold text-blue-700 text-sm">{t.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
} 