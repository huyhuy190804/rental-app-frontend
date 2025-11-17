import React, { useState, useEffect } from "react";
import { getCurrentUser } from "../utils/auth";
import { toggleLikePost, ratePost, getUserRating, getComments } from "../utils/posts";
import CommentModal from "./CommentModal";

const PostDetailCard = ({ post }) => {
  const currentUser = getCurrentUser();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [comments, setComments] = useState([]);
  const [showCommentModal, setShowCommentModal] = useState(false);

  useEffect(() => {
    loadPostData();
  }, [post.id]);

  const loadPostData = () => {
    // Load likes
    if (post.likes && currentUser) {
      setLiked(post.likes.includes(currentUser.id));
      setLikeCount(post.likes.length);
    } else {
      setLikeCount(post.likes ? post.likes.length : 0);
    }

    // Load ratings
    if (currentUser) {
      const rating = getUserRating(post.id, currentUser.id);
      setUserRating(rating || 0);
    }
    setAverageRating(post.averageRating || 0);
    setTotalRatings(post.ratings ? post.ratings.length : 0);

    // Load comments
    setComments(getComments(post.id));
  };

  const handleLike = () => {
    if (!currentUser) {
      alert("Vui lòng đăng nhập để like bài viết!");
      return;
    }

    const result = toggleLikePost(post.id, currentUser.id);
    if (result.success) {
      setLiked(result.liked);
      setLikeCount(result.likeCount);
    }
  };

  const handleRate = (rating) => {
    if (!currentUser) {
      alert("Vui lòng đăng nhập để đánh giá!");
      return;
    }

    const result = ratePost(post.id, currentUser.id, rating);
    if (result.success) {
      setUserRating(rating);
      setAverageRating(result.averageRating);
      setTotalRatings(result.totalRatings);
    }
  };

  const handleCommentSuccess = () => {
    loadPostData();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200">
        <div className="flex flex-col md:flex-row">
          {/* Left: Image */}
          <div className="md:w-2/5 relative">
            <img
              src={post.images[0] || "https://via.placeholder.com/600x400"}
              alt={post.title}
              className="w-full h-64 md:h-full object-cover"
            />
            {/* Badge */}
            <div className="absolute top-4 left-4">
              <span className={`px-4 py-2 rounded-full text-xs font-bold shadow-lg ${
                post.type === "sale" 
                  ? "bg-red-600 text-white" 
                  : "bg-blue-600 text-white"
              }`}>
                {post.type === "sale" ? "🏠 TIN BÁN" : "📝 BÀI VIẾT"}
              </span>
            </div>
            {/* View count */}
            <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
              👁️ {post.views || 0} views
            </div>
          </div>

          {/* Right: Content */}
          <div className="md:w-3/5 p-6 flex flex-col">
            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-red-600 transition cursor-pointer">
              {post.title}
            </h2>

            {/* Author & Date */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                {post.authorName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{post.authorName}</p>
                <p className="text-xs text-gray-500">📅 {formatDate(post.createdAt)}</p>
              </div>
            </div>

            {/* Sale Info */}
            {post.type === "sale" && (
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 mb-4 border border-red-200">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Giá</p>
                    <p className="text-lg font-bold text-red-600">{post.price} tỷ</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Diện tích</p>
                    <p className="text-lg font-bold text-gray-900">{post.area} m²</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Loại</p>
                    <p className="text-sm font-semibold text-gray-800">{post.category}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-700">
                  <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{post.location}</span>
                </div>
              </div>
            )}

            {/* Description */}
            <p className="text-gray-700 text-sm mb-4 line-clamp-3 leading-relaxed">
              {post.description || post.content}
            </p>

            {/* Rating Display */}
            <div className="flex items-center gap-3 mb-4 py-3 px-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-5 h-5 ${star <= averageRating ? "text-yellow-400" : "text-gray-300"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-800">
                {averageRating.toFixed(1)} ({totalRatings} đánh giá)
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-200">
              {/* Like Button */}
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                  liked
                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <svg className="w-5 h-5" fill={liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{likeCount}</span>
              </button>

              {/* Rating Button */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>{userRating > 0 ? userRating : "Đánh giá"}</span>
                </button>
                
                {/* Rating Dropdown */}
                <div className="absolute bottom-full mb-2 left-0 bg-white rounded-xl shadow-xl border border-gray-200 p-3 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-10">
                  <p className="text-xs font-semibold text-gray-600 mb-2 text-center">Chọn số sao</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRate(star)}
                        className="hover:scale-125 transition-transform"
                      >
                        <svg
                          className={`w-6 h-6 ${star <= userRating ? "text-yellow-400" : "text-gray-300"} hover:text-yellow-400`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Comment Button */}
              <button
                onClick={() => setShowCommentModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>{comments.length}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comment Modal */}
      <CommentModal
        isOpen={showCommentModal}
        onClose={() => setShowCommentModal(false)}
        post={post}
        comments={comments}
        onCommentSuccess={handleCommentSuccess}
      />
    </>
  );
};

export default PostDetailCard;