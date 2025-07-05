import React from 'react';
import { FaStar, FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';

export default function Reviews() {
  const reviews = [
    {
      id: 1,
      name: 'Sarah M.',
      rating: 5,
      comment: 'Amazing quality and fast delivery! The custom design turned out exactly as I wanted. Highly recommend!',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      location: 'New York, NY'
    },
    {
      id: 2,
      name: 'John D.',
      rating: 5,
      comment: 'Love my custom t-shirt design! The fabric is super comfortable and the print quality is outstanding.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      location: 'Los Angeles, CA'
    },
    {
      id: 3,
      name: 'Lisa K.',
      rating: 5,
      comment: 'Great service and unique designs! The ordering process was smooth and the final product exceeded my expectations.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      location: 'Chicago, IL'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2">
          What Our Customers Say
        </h2>
        <p className="text-gray-600">
          Join thousands of satisfied customers
        </p>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {reviews.map((review) => (
          <div key={review.id} className="group">
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 p-4 sm:p-6 relative overflow-hidden border border-gray-200">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Quote Icon */}
              <div className="absolute top-2 right-2 text-gray-300 group-hover:text-gray-400 transition-colors duration-300">
                <FaQuoteRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>

              {/* Content */}
              <div className="relative space-y-4">
                {/* Rating */}
                <div className="flex items-center space-x-1">
                  {[...Array(review.rating)].map((_, index) => (
                    <FaStar key={index} className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
                  ))}
                </div>

                {/* Comment */}
                <div className="relative">
                  <FaQuoteLeft className="absolute -top-1 -left-1 text-gray-300 w-3 h-3 sm:w-4 sm:h-4" />
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed pl-4 sm:pl-6">
                    {review.comment}
                  </p>
                </div>

                {/* Author */}
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-white shadow-lg"
                    />
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-black rounded-full border border-white"></div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-black text-xs sm:text-sm">
                      {review.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {review.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 