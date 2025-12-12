// wrstudios-frontend/user-app/src/components/PostCard.jsx - ADD ACTIONS
import React, { useState, useEffect } from "react";
import { formatCurrency } from "../utils/format";
import defaultPostImage from "../assets/default-post-image.jpg";
import { getCurrentUser } from "../utils/auth";
import { deletePost } from "../utils/posts";
import { showSuccess, showError, showWarning } from "../utils/toast";
import ReportScamModal from "./ReportScamModal";
const PostCard = ({ post, onClick, onPostDeleted }) => {
  const [imageError, setImageError] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const currentUser = getCurrentUser();
  
  const [imageSrc, setImageSrc] = useState(
    post.thumbnail && post.thumbnail.trim() !== "" 
      ? post.thumbnail 
      : defaultPostImage
  );

  useEffect(() => {
    if (post.thumbnail && post.thumbnail.trim() !== "" && !imageError) {
      setImageSrc(post.thumbnail);
    } else if (!post.thumbnail || post.thumbnail.trim() === "") {
      setImageSrc(defaultPostImage);
    }
  }, [post.thumbnail, imageError]);

  const handleImageError = (e) => {
    if (!imageError) {
      setImageError(true);
      setImageSrc(defaultPostImage);
      e.target.src = defaultPostImage;
    }
  };

  const isOwner = currentUser && (
    currentUser.user_id === post.authorId || 
    currentUser.id === post.authorId ||
    currentUser.user_id === post.user_id
  );

  const handleEdit = (e) => {
    e.stopPropagation();
    // TODO: Open EditPostModal
    showWarning("Chức năng chỉnh sửa đang phát triển!");
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm(`Xác nhận xóa bài viết: "${post.title}"?`)) {
      try {
        const result = await deletePost(post.id);
        if (result.success) {
          showSuccess("Đã xóa bài viết!");
          if (onPostDeleted) onPostDeleted(post.id);
        } else {
          showError(result.message || "Lỗi khi xóa bài viết!");
        }
      } catch (error) {
        showError("Lỗi khi xóa bài viết!");
      }
    }
  };

  const handleReport = (e) => {
    e.stopPropagation();
    if (!currentUser) {
      showWarning("Vui lòng đăng nhập để báo cáo!");
      return;
    }
    setShowReportModal(true);
  };

  const isSalePost = post.type === "listing" || post.post_type === "listing";
  const priceLabel = isSalePost && post.price ? `${formatCurrency(post.price)}` : null;
  const ratingValue = Number(post.averageRating || 0);

  return (
    <>
      <div
        onClick={onClick}
        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-pink-300 group relative"
      >
        {/* Actions Menu - Top Right */}
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowActions(!showActions);
            }}
            className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition"
          >
            <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          {/* Actions Dropdown */}
          {showActions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-20">
              {isOwner ? (
                <>
                  {/* Edit */}
                  <button
                    onClick={handleEdit}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Chỉnh sửa
                  </button>
                  {/* Delete */}
                  <button
                    onClick={handleDelete}
                    className="w-full px-4 py-2 text-left hover:bg-red-50 flex items-center gap-3 text-sm text-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Xóa
                  </button>
                </>
              ) : (
                <>
                  {/* Report Scam */}
                  <button
                    onClick={handleReport}
                    className="w-full px-4 py-2 text-left hover:bg-orange-50 flex items-center gap-3 text-sm text-orange-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Báo cáo lừa đảo
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Image Section */}
        <div className="relative w-full h-64 bg-gray-200 overflow-hidden">
          <img
            src={imageSrc}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={handleImageError}
          />

          {/* Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg">
              {isSalePost ? "Bảng tin" : "Bài viết"}
            </span>
          </div>

          {/* Image Count */}
          {post.image_count > 0 && (
            <div className="absolute top-4 right-14 bg-black/70 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-semibold">
              📷 {post.image_count}
            </div>
          )}

          {/* Price Tag */}
          {priceLabel && (
            <div className="absolute bottom-4 left-4">
              <span className="bg-gradient-to-r from-emerald-500 to-green-500 text-white text-base font-bold px-4 py-2 rounded-full shadow-lg">
                {priceLabel} đ
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5">
          <p className="text-xs uppercase font-semibold text-pink-500 tracking-wider mb-2">
            {isSalePost ? "TÌM PHÒNG" : "CHIA SẺ"}
          </p>

          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-pink-600 transition">
            {post.title}
          </h3>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
            {post.description || post.content}
          </p>

          {post.location && (
            <div className="flex items-center gap-1.5 text-gray-500 mb-3">
              <svg className="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-medium">{post.location}</span>
            </div>
          )}

          <div className="border-t border-gray-200 my-3"></div>

          <div className="flex justify-between items-center">
            {isSalePost && post.area && (
              <div>
                <p className="text-xs text-gray-500">Diện tích</p>
                <p className="text-sm font-bold text-gray-900">{post.area} m²</p>
              </div>
            )}

            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-4 h-4 ${star <= Math.round(ratingValue) ? "text-yellow-400" : "text-gray-300"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-xs font-semibold text-gray-700 ml-1">
                {ratingValue.toFixed(1)}
              </span>
            </div>

            <div className="flex items-center gap-1 text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="text-xs font-medium">{post.views || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <ReportScamModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          post={post}
        />
      )}
    </>
  );
};

export default PostCard;