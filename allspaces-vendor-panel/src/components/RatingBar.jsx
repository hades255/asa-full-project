// src/components/RatingBar.jsx
import React from "react";

const RatingBar = ({ star, count, total }) => {
  const percent = total ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center mb-2">
      <span className="w-6 text-sm font-medium text-black-500">{star}</span>
      <svg
        className="w-4 h-4 text-yellow-400 mx-1"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.175 0l-3.388 2.46c-.784.57-1.838-.197-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z" />
      </svg>
      <div className="flex-1 h-3 bg-gray-200 rounded mx-2">
        <div
          className="h-3 bg-yellow-400 rounded"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
      <span className="w-8 text-sm text-black-500">{count}</span>
    </div>
  );
};

export default RatingBar;
