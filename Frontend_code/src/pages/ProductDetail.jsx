import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/tshirts/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="w-full max-w-4xl mx-auto p-4">Loading product...</div>;
  }
  if (!product) {
    return <div className="w-full max-w-4xl mx-auto p-4">Product not found.</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-2 sm:p-4 flex flex-col md:flex-row gap-4 md:gap-8">
      <img src={`/api/tshirts/${product.id}/image`} alt={product.name} className="w-full max-w-xs sm:max-w-sm md:w-80 md:h-80 object-cover rounded-xl shadow mb-4 md:mb-0 mx-auto" onError={e => e.currentTarget.style.display = 'none'} />
      <div className="flex-1 flex flex-col justify-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 break-words">{product.name}</h1>
        <div className="text-base sm:text-lg text-gray-600 mb-2">Brand: {product.brand?.name}</div>
        <div className="text-base sm:text-lg text-gray-600 mb-2">Color: {product.color?.name}</div>
        <div className="text-xl sm:text-2xl text-blue-700 font-bold mb-4">${product.price?.toFixed(2)}</div>
        <p className="mb-6 text-gray-700 text-sm sm:text-base break-words">{product.description}</p>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <button className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition">Add to Cart</button>
          <Link to="/custom-design" className="bg-purple-600 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold shadow hover:bg-purple-700 transition text-center">Customize</Link>
        </div>
      </div>
    </div>
  );
} 