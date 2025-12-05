// wrstudios-frontend/user-app/src/components/CommentModal.jsx
import React, { useState } from "react";
import { getCurrentUser } from "../utils/auth";
import { addComment } from "../utils/posts";

const CommentModal = ({ isOpen, onClose, post, comments, onCommentSuccess }) => {
  const currentUser = getCurrentUser();
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);

  if (!isOpen) return null;

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 3) {
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
      setImages(prev => [...prev, ...base64Images]);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert("Vui lòng đăng nhập để bình luận!");
      return;
    }

    if (!content.trim()) {
      alert("Vui lòng nhập nội dung bình luận!");
      return;
    }

    const result = addComment(post.id, currentUser.id, currentUser.accountName, content, images);
    
    if (result.success) {
      setContent("");
      setImages([]);
      onCommentSuccess();
      alert("✅ Đã thêm bình luận!");
    } else {
      alert("❌ Có lỗi xảy ra!");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 60) return "vừa xong";
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">💬 Bình luận</h3>
              <p className="text-blue-100 text-sm mt-1">{comments.length} bình luận</p>
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

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-gray-500">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
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
                    
                    {/* Comment Images */}
                    {comment.images && comment.images.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {comment.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`Comment ${idx + 1}`}
                            className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment Form */}
        <form onSubmit={handleSubmit} className="border-t border-gray-200 p-6 bg-gray-50">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Viết bình luận của bạn..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
          />

          {/* Image Preview */}
          {images.length > 0 && (
            <div className="flex gap-2 mt-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={img}
                    alt={`Upload ${idx + 1}`}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                  />
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

          <div className="flex items-center gap-3 mt-3">
            {/* Upload Image Button */}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              id="comment-image-upload"
            />
            <label
              htmlFor="comment-image-upload"
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">Ảnh</span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition shadow-lg"
            >
              Gửi bình luận
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommentModal;