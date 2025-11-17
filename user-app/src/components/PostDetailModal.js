import React, { useState, useEffect } from "react";
import { getCurrentUser } from "../utils/auth";
import { toggleLikePost, ratePost, getUserRating, addComment, getComments, getPostById } from "../utils/posts";

const PostDetailModal = ({ isOpen, onClose, postId }) => {
  const currentUser = getCurrentUser();
  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [commentImages, setCommentImages] = useState([]);

  useEffect(() => {
    if (isOpen && postId) {
      loadPostData();
    }
  }, [isOpen, postId]);

  const loadPostData = () => {
    const postData = getPostById(postId);
    if (!postData) return;

    setPost(postData);

    // Load likes
    if (postData.likes && currentUser) {
      setLiked(postData.likes.includes(currentUser.id));
      setLikeCount(postData.likes.length);
    } else {
      setLikeCount(postData.likes ? postData.likes.length : 0);
    }

    // Load ratings
    if (currentUser) {
      const rating = getUserRating(postId, currentUser.id);
      setUserRating(rating || 0);
    }
    setAverageRating(postData.averageRating || 0);
    setTotalRatings(postData.ratings ? postData.ratings.length : 0);

    // Load comments
    setComments(getComments(postId));
  };

  const handleLike = () => {
    if (!currentUser) {
      alert("Vui lòng đăng nhập để thích bài viết!");
      return;
    }

    const result = toggleLikePost(postId, currentUser.id);
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

    const result = ratePost(postId, currentUser.id, rating);
    if (result.success) {
      setUserRating(rating);
      setAverageRating(result.averageRating);
      setTotalRatings(result.totalRatings);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + commentImages.length > 3) {
      alert("Tối đa 3 ảnh!");
      return;
    }

    Promise.all(
      files.map(file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      })
    ).then(base64Images => {
      setCommentImages(prev => [...prev, ...base64Images]);
    });
  };

  const removeImage = (index) => {
    setCommentImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert("Vui lòng đăng nhập để bình luận!");
      return;
    }

    if (!commentContent.trim() && commentImages.length === 0) {
      alert("Vui lòng nhập nội dung hoặc thêm ảnh!");
      return;
    }

    const result = addComment(postId, currentUser.id, currentUser.accountName, commentContent, commentImages);
    
    if (result.success) {
      setCommentContent("");
      setCommentImages([]);
      loadPostData();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return "vừa xong";
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    return date.toLocaleDateString('vi-VN');
  };

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Chi tiết bài viết</h2>
              <p className="text-pink-100 text-sm">Xem thông tin và để lại đánh giá</p>
            </div>
            <button 
              onClick={onClose} 
              className="text-white hover:bg-white/20 p-2 rounded-full transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Post Info */}
          <div className="mb-6">
            <div className="flex gap-4 mb-4">
              {/* Main Image */}
              <img
                src={post.images && post.images[0] ? post.images[0] : "https://via.placeholder.com/600x400"}
                alt={post.title}
                className="w-80 h-60 object-cover rounded-2xl border-2 border-gray-200"
              />

              {/* Info */}
              <div className="flex-1">
                <span className={`inline-block px-4 py-2 rounded-full text-xs font-bold mb-3 ${
                  post.type === "sale" ? "bg-blue-600 text-white" : "bg-blue-600 text-white"
                }`}>
                  {post.type === "sale" ? "TIN BÁN STUDIO" : "BÀI VIẾT"}
                </span>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">{post.title}</h3>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {post.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{post.authorName}</p>
                    <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
                  </div>
                </div>

                <p className="text-gray-700 text-sm leading-relaxed mb-4">{post.description || post.content}</p>

                {/* Sale Info */}
                {post.type === "sale" && (
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border border-red-200">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Giá</p>
                        <p className="text-xl font-bold text-red-600">{post.price} tỷ</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Diện tích</p>
                        <p className="text-xl font-bold text-gray-900">{post.area} m²</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Interaction Bar */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
            {/* Like Button */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                liked ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-700"
              }`}
            >
              <svg className="w-5 h-5" fill={liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{likeCount} Thích</span>
            </button>

            {/* Comment Count */}
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{comments.length} Bình luận</span>
            </div>

            {/* Rating Display */}
            <div className="flex items-center gap-2 ml-auto">
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
              <span className="text-sm font-semibold text-gray-700">
                {averageRating.toFixed(1)} ({totalRatings})
              </span>
            </div>
          </div>

          {/* Comment Form */}
          <div className="mb-6">
            <h4 className="text-lg font-bold text-gray-900 mb-4">💬 Để lại đánh giá & bình luận</h4>
            
            {/* Rating Stars */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-600 mb-2">Đánh giá của bạn:</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRate(star)}
                    className="hover:scale-125 transition-transform"
                  >
                    <svg
                      className={`w-8 h-8 ${star <= userRating ? "text-yellow-400" : "text-gray-300"} hover:text-yellow-400`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmitComment} className="bg-gray-50 rounded-xl p-4">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Viết bình luận của bạn..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm resize-none mb-3"
              />

              {commentImages.length > 0 && (
                <div className="flex gap-2 mb-3">
                  {commentImages.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img src={img} alt={`Upload ${idx + 1}`} className="w-20 h-20 object-cover rounded-lg border border-gray-300" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3">
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" id="comment-img" />
                <label htmlFor="comment-img" className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition cursor-pointer">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium">Ảnh</span>
                </label>

                <button type="submit" className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 px-6 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition shadow-lg">
                  Gửi bình luận
                </button>
              </div>
            </form>
          </div>

          {/* Comments List */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-4">Tất cả bình luận</h4>
            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Chưa có bình luận nào</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        {comment.userName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">{comment.userName}</span>
                          <span className="text-xs text-gray-500">• {formatDate(comment.createdAt)}</span>
                        </div>
                        <p className="text-gray-700 text-sm mb-2 whitespace-pre-wrap">{comment.content}</p>
                        
                        {comment.images && comment.images.length > 0 && (
                          <div className="flex gap-2 mt-3">
                            {comment.images.map((img, idx) => (
                              <img key={idx} src={img} alt={`Comment ${idx + 1}`} className="w-20 h-20 object-cover rounded-lg border border-gray-300" />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;