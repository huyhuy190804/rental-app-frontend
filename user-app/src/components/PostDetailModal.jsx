// wrstudios-frontend/user-app/src/components/PostDetailModal.jsx - SIMPLIFIED & FIXED
import React, { useState, useEffect } from "react";
import { getPostById, getAllPostImages, incrementPostView } from "../utils/posts";
import { formatCurrency } from "../utils/format";

const PostDetailModal = ({ isOpen, onClose, postId }) => {
  const [post, setPost] = useState(null);
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);

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
        alert('Bài viết không tồn tại!');
        onClose();
        return;
      }

      console.log('✅ Post loaded:', postData);
      console.log('✅ Images loaded:', imagesData.length);

      setPost(postData);
      setImages(imagesData);
      setCurrentImageIndex(0);

      // Increment view count
      if (postId) {
        incrementPostView(postId);
      }
    } catch (error) {
      console.error('❌ Error loading post:', error);
      alert('Lỗi khi tải bài viết!');
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
                    console.error('❌ Image load error');
                    e.target.src = 'https://via.placeholder.com/800x600/FFB6C1/FFFFFF?text=Image+Error';
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;