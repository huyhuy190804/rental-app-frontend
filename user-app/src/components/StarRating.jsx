// wrstudios-frontend/user-app/src/components/StarRating.jsx - TẠO FILE MỚI
import React, { useState } from "react";

const StarRating = ({ 
  rating = 0, 
  totalReviews = 0,
  size = "md", 
  editable = false, 
  onRate = null,
  showCount = true 
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };

  const handleClick = (value) => {
    if (editable && onRate) {
      onRate(value);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!editable}
            onClick={() => handleClick(star)}
            onMouseEnter={() => editable && setHoverRating(star)}
            onMouseLeave={() => editable && setHoverRating(0)}
            className={`${editable ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
          >
            <svg
              className={`${sizeClasses[size]} ${
                star <= displayRating 
                  ? "text-yellow-400" 
                  : "text-gray-300"
              } transition-colors`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
      
      {showCount && (
        <div className="flex items-center gap-1 text-sm">
          <span className="font-semibold text-gray-700">
            {Number(rating).toFixed(1)}
          </span>
          {totalReviews > 0 && (
            <span className="text-gray-500">
              ({totalReviews})
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StarRating;