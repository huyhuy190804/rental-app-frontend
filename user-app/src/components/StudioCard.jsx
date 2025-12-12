// wrstudios-frontend/user-app/src/components/StudioCard.jsx
import React from "react";
import { formatCurrency } from "../utils/format";
import defaultPostImage from "../assets/default-post-image.jpg";

const StudioCard = ({ studio }) => {
  // ✅ Chỉ dùng default nếu studio.image không tồn tại hoặc rỗng
  const imageSource = studio.image && studio.image.trim() !== "" 
    ? studio.image 
    : defaultPostImage;

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-200 flex flex-col h-full">
      <div className="w-full h-48 overflow-hidden bg-gray-300">
        <img
          src={imageSource}
          alt={studio.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = defaultPostImage;
          }}
        />
      </div>

      <div className="p-4 flex flex-col justify-between flex-1">
        <div className="mb-3">
          <h3 className="font-bold text-base text-gray-800 mb-1 line-clamp-2">
            {studio.name}
          </h3>
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{studio.description}</p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            📍 {studio.location}
          </p>
        </div>

        <div className="border-t border-gray-200 my-2"></div>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500">Diện tích</p>
            <p className="text-sm font-semibold text-gray-800">{studio.area}m²</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Giá</p>
            <p className="text-lg font-bold text-red-600">
              {formatCurrency(studio.price)} đ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioCard;