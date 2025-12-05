// wrstudios-frontend/user-app/src/components/PostDetailModal.jsx - SIMPLIFIED & FIXED
import React, { useState, useEffect } from "react";
import { getPostById, getAllPostImages, incrementPostView, getComments } from "../utils/posts";
import { formatCurrency } from "../utils/format";
import { showError } from "../utils/toast";
import CommentModal from "./CommentModal";
import { getCurrentUser } from "../utils/auth";

const PostDetailModal = ({ isOpen, onClose, postId }) => {
  const [post, setPost] = useState(null);
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (!isOpen || !postId) {
      return;
    }

    loadPostData();
  }, [isOpen, postId]);

  const loadPostData = async () => {
    console.log('📝 Loading post data for ID:', postId);
    setLoading(true);
    
    try {
      // ✅ FIX: Load post and all images in parallel
      const [postData, imagesData] = await Promise.all([
        getPostById(postId),
        getAllPostImages(postId)
      ]);

      if (!postData) {
        console.error('❌ Post not found:', postId);
        showError('Bài viết không tồn tại!');
        onClose();
        return;
      }

      console.log('✅ Post loaded:', postData);
      console.log('✅ Images loaded:', imagesData.length);

      setPost(postData);
      setImages(imagesData);
      setCurrentImageIndex(0);

      // Load comments
      const commentsData = await getComments(postId);
      setComments(commentsData || []);

      // Increment view count
      if (postId) {
        incrementPostView(postId);
      }
    } catch (error) {
      console.error('❌ Error loading post:', error);
      showError('Lỗi khi tải bài viết!');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handlePrevImage = () => {
    if (images.length < 2) return;
    setImageLoading(true);
    setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    // Small delay for smooth transition
    setTimeout(() => setImageLoading(false), 100);
  };

  const handleNextImage = () => {
    if (images.length < 2) return;
    setImageLoading(true);
    setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    setTimeout(() => setImageLoading(false), 100);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return "vừa xong";
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    return date.toLocaleDateString("vi-VN");
  };

  if (!isOpen) return null;

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mx-auto"></div>
          <p className="text-center mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const currentImage = images[currentImageIndex];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {post.author_name?.charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {post.author_name || "Unknown"}
              </h3>
              <p className="text-xs text-gray-500">
                {formatDate(post.created_at)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Images */}
          {images.length > 0 && (
            <div className="relative w-full bg-black flex items-center justify-center min-h-[24rem]">
              {/* Loading Spinner */}
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-black bg-opacity-30">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
                </div>
              )}
              
              {/* Current Image */}
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={post.title}
                  className={`w-full h-auto max-h-96 object-contain transition-opacity duration-300 ${
                    imageLoading ? "opacity-50" : "opacity-100"
                  }`}
                  onError={(e) => {
                    // Prevent infinite loop by checking if already set to fallback
                    if (!e.target.src.includes('data:image')) {
                      console.error('❌ Image load error');
                      const fallbackImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%23f3f4f6' width='800' height='600'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='24' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImage Error%3C/text%3E%3C/svg%3E";
                      e.target.src = fallbackImage;
                    }
                  }}
                />
              ) : (
                <div className="w-full h-96 flex items-center justify-center text-white">
                  <p>Không có ảnh</p>
                </div>
              )}

              {/* Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    disabled={imageLoading}
                    className="absolute top-1/2 -translate-y-1/2 left-3 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    disabled={imageLoading}
                    className="absolute top-1/2 -translate-y-1/2 right-3 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  {/* Image Counter */}
                  <div className="absolute top-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Post Content */}
          <div className="p-4 space-y-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{post.title}</h2>
            </div>
            
            {post.description && (
              <div>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                  {post.description}
                </p>
              </div>
            )}

            {/* Listing Details */}
            {post.post_type === "listing" && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                {post.price && (
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">💰 Giá</span>
                    <span className="text-lg font-bold text-red-600">
                      {formatCurrency(post.price)} đ
                    </span>
                  </div>
                )}
                {post.area && (
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">📐 Diện tích</span>
                    <span className="text-lg font-bold text-gray-900">
                      {post.area} m²
                    </span>
                  </div>
                )}
                {post.address && (
                  <div className="flex gap-2 items-start">
                    <span className="text-gray-600 font-medium">📍 Vị trí</span>
                    <span className="text-gray-700">{post.address}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-gray-600 text-sm">👁️ Lượt xem</span>
                  <span className="font-semibold text-gray-700">{post.views || 0}</span>
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Bình luận ({comments.length})
                </h3>
                {currentUser && (
                  <button
                    onClick={() => setShowCommentModal(true)}
                    className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition text-sm font-medium"
                  >
                    Thêm bình luận
                  </button>
                )}
              </div>

              {/* Comments List */}
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-center py-8 text-sm">
                    Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.comment_id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                        {comment.user_name?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-sm text-gray-900">
                            {comment.user_name || "Anonymous"}
                          </p>
                          {comment.rating && (
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < comment.rating
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mb-1">{comment.content_comment}</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(comment.created_at)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comment Modal */}
      {post && (
        <CommentModal
          isOpen={showCommentModal}
          onClose={() => setShowCommentModal(false)}
          post={{ id: post.post_id || postId }}
          comments={comments}
          onCommentSuccess={() => {
            // Reload comments after adding new comment
            getComments(postId).then((newComments) => {
              setComments(newComments || []);
            });
            setShowCommentModal(false);
          }}
        />
      )}
    </div>
  );
};

export default PostDetailModal;