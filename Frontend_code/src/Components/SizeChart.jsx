import React from "react";

export default function SizeChart({ className = "" }) {
  return (
    <div className={`my-6 flex flex-col items-center ${className}`}>
      <h3 className="text-lg font-bold mb-2">Size Chart</h3>
      <img
        src="https://res.cloudinary.com/dbanspk1d/image/upload/v1751370554/25_yqtxbm.jpg"
        alt="Size Chart"
        className="max-w-full rounded-lg shadow"
        style={{ maxHeight: 400 }}
      />
    </div>
  );
} 