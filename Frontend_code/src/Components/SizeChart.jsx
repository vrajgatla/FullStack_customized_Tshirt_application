import React, { useState } from "react";
import { FaChevronDown, FaChevronUp, FaRuler, FaInfoCircle } from "react-icons/fa";

export default function SizeChart({ className = "", compact = false }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('men');

  const sizeData = {
    men: {
      title: "Men's Sizes",
      sizes: [
        { size: 'XS', chest: '32-34"', waist: '26-28"', length: '26"', fit: 'Slim' },
        { size: 'S', chest: '34-36"', waist: '28-30"', length: '27"', fit: 'Regular' },
        { size: 'M', chest: '36-38"', waist: '30-32"', length: '28"', fit: 'Regular' },
        { size: 'L', chest: '38-40"', waist: '32-34"', length: '29"', fit: 'Regular' },
        { size: 'XL', chest: '40-42"', waist: '34-36"', length: '30"', fit: 'Regular' },
        { size: 'XXL', chest: '42-44"', waist: '36-38"', length: '31"', fit: 'Regular' }
      ]
    },
    women: {
      title: "Women's Sizes",
      sizes: [
        { size: 'XS', chest: '30-32"', waist: '24-26"', length: '24"', fit: 'Slim' },
        { size: 'S', chest: '32-34"', waist: '26-28"', length: '25"', fit: 'Regular' },
        { size: 'M', chest: '34-36"', waist: '28-30"', length: '26"', fit: 'Regular' },
        { size: 'L', chest: '36-38"', waist: '30-32"', length: '27"', fit: 'Regular' },
        { size: 'XL', chest: '38-40"', waist: '32-34"', length: '28"', fit: 'Regular' },
        { size: 'XXL', chest: '40-42"', waist: '34-36"', length: '29"', fit: 'Regular' }
      ]
    },
    kids: {
      title: "Kids' Sizes",
      sizes: [
        { size: '2T', chest: '20-22"', waist: '18-20"', length: '18"', fit: 'Regular' },
        { size: '3T', chest: '22-24"', waist: '20-22"', length: '19"', fit: 'Regular' },
        { size: '4T', chest: '24-26"', waist: '22-24"', length: '20"', fit: 'Regular' },
        { size: '5T', chest: '26-28"', waist: '24-26"', length: '21"', fit: 'Regular' },
        { size: '6T', chest: '28-30"', waist: '26-28"', length: '22"', fit: 'Regular' }
      ]
    }
  };

  // Compact version for mobile or when space is limited
  if (compact) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-4 ${className}`}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left font-semibold text-gray-800"
        >
          <div className="flex items-center gap-2">
            <FaRuler className="text-pink-500" />
            <span>Size Guide</span>
          </div>
          {isExpanded ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
        </button>
        
        {isExpanded && (
          <div className="mt-4 space-y-4">
            {/* Quick Size Guide */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                <div key={size} className="text-center p-2 bg-gray-50 rounded border">
                  <div className="font-bold text-sm">{size}</div>
                  <div className="text-xs text-gray-600">Regular Fit</div>
                </div>
              ))}
            </div>
            
            {/* Measurement Tips */}
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <FaInfoCircle className="text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <strong>How to measure:</strong> Wrap a tape measure around your chest at the fullest point, keeping it level.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full version with tabs
  return (
    <div className={`bg-white rounded-xl shadow-lg border ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FaRuler className="text-pink-500" />
            Size Chart
          </h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-pink-500 hover:text-pink-600 transition-colors"
          >
            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>

        {isExpanded && (
          <div className="space-y-4">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200">
              {Object.keys(sizeData).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-4 py-2 font-medium text-sm transition-colors ${
                    activeTab === key
                      ? 'text-pink-600 border-b-2 border-pink-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {sizeData[key].title}
                </button>
              ))}
            </div>

            {/* Size Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 font-semibold text-gray-700">Size</th>
                    <th className="text-left py-2 font-semibold text-gray-700">Chest</th>
                    <th className="text-left py-2 font-semibold text-gray-700">Waist</th>
                    <th className="text-left py-2 font-semibold text-gray-700">Length</th>
                    <th className="text-left py-2 font-semibold text-gray-700">Fit</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeData[activeTab].sizes.map((item, index) => (
                    <tr key={item.size} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                      <td className="py-2 font-medium">{item.size}</td>
                      <td className="py-2 text-gray-600">{item.chest}</td>
                      <td className="py-2 text-gray-600">{item.waist}</td>
                      <td className="py-2 text-gray-600">{item.length}</td>
                      <td className="py-2 text-gray-600">{item.fit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Measurement Guide */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <FaInfoCircle className="text-blue-500" />
                How to Measure
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <strong>Chest:</strong> Measure around the fullest part of your chest, keeping the tape level.
                </div>
                <div>
                  <strong>Waist:</strong> Measure around your natural waistline, keeping the tape comfortably loose.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 