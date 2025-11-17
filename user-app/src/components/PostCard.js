import React from "react";

const PostCard = ({ post, onClick }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 cursor-pointer"
    >
      <div className="flex flex-row">
        {/* Left: Image */}
        <div className="w-72 h-56 relative flex-shrink-0">
          <img
            src={post.images && post.images[0] ? post.images[0] : "https://via.placeholder.com/400x300"}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          {/* Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1 rounded-md text-xs font-bold shadow-md uppercase ${
              post.type === "sale" 
                ? "bg-blue-600 text-white" 
                : "bg-blue-600 text-white"
            }`}>
              {post.type === "sale" ? "Tin bán Studio" : "Bài viết"}
            </span>
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex-1 p-5 flex flex-col">
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-1 hover:text-pink-600 transition">
            {post.title}
          </h3>

          {/* Author */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {post.authorName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">{post.authorName}</p>
              <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed flex-1">
            {post.description || post.content}
          </p>

          {/* Rating & Stats */}
          <div className="flex items-center gap-1 mt-auto">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-5 h-5 ${star <= (post.averageRating || 0) ? "text-yellow-400" : "text-gray-300"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-sm font-semibold text-gray-700 ml-2">
              {(post.averageRating || 0).toFixed(1)} ({post.ratings ? post.ratings.length : 0} đánh giá)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;