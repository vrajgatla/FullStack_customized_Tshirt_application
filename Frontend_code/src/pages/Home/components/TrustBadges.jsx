import React from 'react';
import { FaLock, FaUndo, FaShippingFast, FaMedal } from 'react-icons/fa';

const badges = [
  { icon: <FaLock className="text-green-600 w-7 h-7" />, label: 'Secure Payment' },
  { icon: <FaUndo className="text-blue-600 w-7 h-7" />, label: 'Money-back Guarantee' },
  { icon: <FaShippingFast className="text-purple-600 w-7 h-7" />, label: 'Fast Shipping' },
  { icon: <FaMedal className="text-yellow-500 w-7 h-7" />, label: 'Premium Quality' },
];

export default function TrustBadges() {
  return (
    <div className="flex flex-wrap justify-center gap-8 my-12">
      {badges.map((b, idx) => (
        <div key={idx} className="flex flex-col items-center bg-white rounded-xl shadow p-4 min-w-[120px] hover:scale-105 transition-transform duration-300">
          {b.icon}
          <span className="mt-2 font-semibold text-gray-700 text-sm text-center">{b.label}</span>
        </div>
      ))}
    </div>
  );
} 