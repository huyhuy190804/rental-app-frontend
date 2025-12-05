//wrstudios-frontend/user-app/src/components/PostCard.jsx
import React from "react";
import { formatCurrency } from "../utils/format";

const PostCard = ({ post, onClick }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const isSalePost = post.type === "sale";
  const priceLabel =
    isSalePost && post.price ? `${formatCurrency(post.price)} đ` : null;
  const ratingValue = Number(post.averageRating || 0);
  const ratingCount = post.ratings ? post.ratings.length : 0;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-3xl border border-gray-100 hover:border-pink-200 shadow-[0_20px_60px_rgba(15,23,42,0.05)] hover:shadow-[0_25px_65px_rgba(236,72,153,0.15)] transition-all duration-300 cursor-pointer flex flex-col lg:flex-row overflow-hidden"
    >
      <div className="relative w-full lg:w-72 h-60 flex-shrink-0">
        <img
          src={
            post.thumbnail || "https://via.placeholder.com/600x400"
          }
          alt={post.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/600x400';
          }}
        />

        {/* Hiển thị số lượng ảnh */}
        {post.image_count > 0 && (
          <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
            📷 {post.image_count} ảnh
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-white/90 text-pink-600 shadow">
            {post.type === "sale" ? "Bảng tin" : "Bài viết"}
          </span>
        </div>
        {priceLabel && (
          <div className="absolute bottom-4 left-4">
            <span className="bg-emerald-500 text-white text-sm font-semibold px-4 py-1 rounded-full shadow-md">
              {priceLabel}
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 p-6 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase font-semibold text-gray-400 tracking-[0.2em] mb-1">
              {isSalePost ? "Tìm phòng" : "Chia sẻ trải nghiệm"}
            </p>
            <h3 className="text-xl font-bold text-gray-900 leading-snug hover:text-pink-600 transition line-clamp-2">
              {post.title}
            </h3>
          </div>
          {isSalePost && post.area && (
            <div className="bg-pink-50 text-pink-600 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
              {post.area} m²
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-500">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {post.authorName?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-800">{post.authorName}</p>
            <p>{formatDate(post.createdAt)}</p>
          </div>
          {post.location && (
            <div className="flex items-center gap-1 text-gray-500 ml-auto">
              <svg
                className="w-4 h-4 text-pink-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs font-medium">{post.location}</span>
            </div>
          )}
        </div>

        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
          {post.description || post.content}
        </p>

        {isSalePost && (
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 bg-gray-50 rounded-2xl p-3">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Dịch vụ
              </p>
              <p className="font-semibold text-gray-800">
                {post.utilities || "Điện, nước, wifi đầy đủ"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Tình trạng
              </p>
              <p className="font-semibold text-emerald-600">
                {post.statusText || "Sẵn sàng"}
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4 mt-auto">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(ratingValue)
                    ? "text-yellow-400"
                    : "text-gray-200"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-sm font-semibold text-gray-800 ml-1">
              {ratingValue.toFixed(1)}
            </span>
            <span className="text-xs text-gray-500">
              ({ratingCount} đánh giá)
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span>{post.views || 0} lượt xem</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;