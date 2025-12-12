// wrstudios-frontend/user-app/src/components/PostDetailModal.jsx - SIMPLIFIED & FIXED
import React, { useState, useEffect } from "react";
import {
  getPostById,
  getAllPostImages,
  incrementPostView,
  getComments,
  addComment,
} from "../utils/posts";
import { formatCurrency } from "../utils/format";
import { showError } from "../utils/toast";
import CommentModal from "./CommentModal";
import { getCurrentUser } from "../utils/auth";
import defaultPostImage from "../assets/default-post-image.jpg";
const PostDetailModal = ({ isOpen, onClose, postId }) => {
  const [post, setPost] = useState(null);
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);
  const [comments, setComments] = useState([]); // tree structure
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [totalComments, setTotalComments] = useState(0);
  const [visibleCount, setVisibleCount] = useState(5);
  const [replyTo, setReplyTo] = useState(null);
  const currentUser = getCurrentUser();

useEffect(() => {
    const loadPostDetails = async () => {
      if (!postId) return;

      setLoading(true);
      try {
        const postData = await getPostById(postId);
        if (postData) {
          setPost(postData);
          await incrementPostView(postId);
        }

        const images = await getAllPostImages(postId);
        setImages(images);

        // ✅ FIX: Handle comments response correctly
        const commentsResponse = await getComments(postId);
        console.log("📖 Comments response:", commentsResponse);

        if (commentsResponse?.success && Array.isArray(commentsResponse.data)) {
          const tree = buildCommentTree(commentsResponse.data);
          setComments(tree.rootComments);
          setTotalComments(tree.total);
          setVisibleCount(Math.min(5, tree.rootComments.length || 5));
        } else if (Array.isArray(commentsResponse)) {
          const tree = buildCommentTree(commentsResponse);
          setComments(tree.rootComments);
          setTotalComments(tree.total);
          setVisibleCount(Math.min(5, tree.rootComments.length || 5));
        } else {
          setComments([]);
          setTotalComments(0);
          setVisibleCount(5);
        }
      } catch (error) {
        console.error("Error loading post details:", error);
        setComments([]);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadPostDetails();
    }
  }, [isOpen, postId]);

  const loadPostData = async () => {
    console.log("📝 Loading post data for ID:", postId);
    setLoading(true);

    try {
      // ✅ FIX: Load post and all images in parallel
      const [postData, imagesData] = await Promise.all([
        getPostById(postId),
        getAllPostImages(postId),
      ]);

      if (!postData) {
        console.error("❌ Post not found:", postId);
        showError("Bài viết không tồn tại!");
        onClose();
        return;
      }

      console.log("✅ Post loaded:", postData);
      console.log("✅ Images loaded:", imagesData.length);

      setPost(postData);
      setImages(imagesData);
      setCurrentImageIndex(0);

      // Load comments
      const commentsResponse = await getComments(postId);
      if (commentsResponse?.success && Array.isArray(commentsResponse.data)) {
        const tree = buildCommentTree(commentsResponse.data);
        setComments(tree.rootComments);
        setTotalComments(tree.total);
        setVisibleCount(Math.min(5, tree.rootComments.length || 5));
      } else if (Array.isArray(commentsResponse)) {
        const tree = buildCommentTree(commentsResponse);
        setComments(tree.rootComments);
        setTotalComments(tree.total);
        setVisibleCount(Math.min(5, tree.rootComments.length || 5));
      } else {
        setComments([]);
        setTotalComments(0);
        setVisibleCount(5);
      }

      // Increment view count
      if (postId) {
        incrementPostView(postId);
      }
    } catch (error) {
      console.error("❌ Error loading post:", error);
      showError("Lỗi khi tải bài viết!");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handlePrevImage = () => {
    if (images.length < 2) return;
    setImageLoading(true);
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    // Small delay for smooth transition
    setTimeout(() => setImageLoading(false), 100);
  };

  const handleNextImage = () => {
    if (images.length < 2) return;
    setImageLoading(true);
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
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

  const renderComment = (comment, depth = 0) => {
    const authorName =
      comment.user_name || comment.name || comment.user_email || "Ẩn danh";
    const isOwner =
      currentUser &&
      (currentUser.user_id === comment.user_id ||
        currentUser.id === comment.user_id);
    const isReply = depth > 0;
    const indentDepth = Math.min(depth, 1); // hạn chế thụt lề sâu để dễ đọc

    return (
      <div
        key={comment.comment_id}
        className={`${indentDepth > 0 ? "ml-6" : ""} ${isReply ? "pt-2" : ""}`}
      >
        <div
          className={`flex gap-3 p-2.5 bg-white border ${
            isReply ? "border-pink-100" : "border-gray-100"
          } rounded-2xl shadow-sm relative`}
        >
          {isReply && (
            <span className="absolute left-[-12px] top-4 h-full w-px bg-pink-200" aria-hidden />
          )}
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 uppercase">
            {(authorName || "?").charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <p className="font-semibold text-sm text-gray-900 truncate leading-tight">
                {authorName}
              </p>
              {isOwner && (
                <span className="px-2 py-0.5 bg-pink-100 text-pink-600 text-[11px] font-semibold rounded-full">
                  Bạn
                </span>
              )}
              <span className="text-[11px] text-gray-500">
                {formatDate(comment.created_at)}
              </span>
            </div>
            <div className="bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
              <p className="text-sm text-gray-800 leading-relaxed break-words">
                {comment.content || comment.content_comment}
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-600 mt-2">
              <button
                onClick={() => handleReply(comment)}
                className="font-semibold text-pink-600 hover:text-pink-700"
              >
                Phản hồi
              </button>
            </div>

            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-3 space-y-3">
                {comment.replies.map((child) => renderComment(child, indentDepth + 1))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const buildCommentTree = (flatComments) => {
    const map = {};
    const roots = [];
    (flatComments || []).forEach((c) => {
      map[c.comment_id] = { ...c, replies: [] };
    });
    (flatComments || []).forEach((c) => {
      if (c.parent_comment_id && map[c.parent_comment_id]) {
        map[c.parent_comment_id].replies.push(map[c.comment_id]);
      } else {
        roots.push(map[c.comment_id]);
      }
    });
    return { rootComments: roots, total: flatComments?.length || 0 };
  };

  const handleReply = (comment) => {
    setReplyTo(comment);
  };

  const cancelReply = () => {
    setReplyTo(null);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      showError("Vui lòng đăng nhập để bình luận");
      return;
    }
    if (!newComment.trim()) {
      return;
    }
    setSubmitting(true);
    try {
      const result = await addComment(post.post_id || postId, {
        content: newComment.trim(),
        parent_comment_id: replyTo?.comment_id || null,
      });
      if (result?.success) {
        setNewComment("");
        setReplyTo(null);
        const refreshed = await getComments(post.post_id || postId);
        if (refreshed?.success && Array.isArray(refreshed.data)) {
          const tree = buildCommentTree(refreshed.data);
          setComments(tree.rootComments);
          setTotalComments(tree.total);
          setVisibleCount(Math.min(5, tree.rootComments.length || 5));
        } else {
          setComments([]);
          setTotalComments(0);
          setVisibleCount(5);
        }
      } else {
        showError(result?.message || "Không thể thêm bình luận");
      }
    } catch (error) {
      console.error("Add comment error:", error);
      showError("Không thể thêm bình luận");
    } finally {
      setSubmitting(false);
    }
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
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
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Images */}
          {images.length > 0 ? (
            <div className="relative w-full bg-black flex items-center justify-center min-h-[24rem]">
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
                    if (!e.target.src.includes("default-post-image")) {
                      e.target.src = defaultPostImage;
                    }
                  }}
                />
              ) : (
                <img
                  src={defaultPostImage}
                  alt="No image"
                  className="w-full h-auto max-h-96 object-contain"
                />
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
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    disabled={imageLoading}
                    className="absolute top-1/2 -translate-y-1/2 right-3 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition disabled:opacity-50"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>

                  {/* Image Counter */}
                  <div className="absolute top-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>
          ) : (
            /* ✅ Nếu KHÔNG có ảnh upload → hiển thị default image */
            <div className="relative w-full bg-gray-100 flex items-center justify-center min-h-[24rem]">
              <img
                src={defaultPostImage}
                alt="Default post image"
                className="w-full h-auto max-h-96 object-contain"
              />
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
                    <span className="text-gray-600 font-medium">
                      📐 Diện tích
                    </span>
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
                  <span className="font-semibold text-gray-700">
                    {post.views || 0}
                  </span>
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Bình luận
                  </h3>
                  <p className="text-sm text-gray-500">{totalComments} bình luận</p>
                </div>
              </div>

              {/* Comment form */}
              {currentUser ? (
                <form
                  onSubmit={handleSubmitComment}
                  className="flex items-center gap-3 mb-4 bg-gray-50 border border-gray-200 rounded-2xl p-3"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 uppercase">
                    {currentUser.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div className="flex-1">
                    {replyTo && (
                      <div className="flex items-center justify-between mb-2 text-xs text-gray-600 bg-pink-50 border border-pink-100 rounded-lg px-3 py-1.5">
                        <span>
                          Đang phản hồi{" "}
                          <strong>{replyTo.user_name || replyTo.name || "Ẩn danh"}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={cancelReply}
                          className="text-pink-600 hover:text-pink-700 font-semibold"
                        >
                          Hủy
                        </button>
                      </div>
                    )}
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder={replyTo ? "Viết phản hồi..." : "Viết bình luận..."}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                      disabled={submitting}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting || !newComment.trim()}
                    className="px-5 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl shadow hover:shadow-md hover:from-pink-600 hover:to-purple-700 transition text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Đang gửi..." : "Gửi"}
                  </button>
                </form>
              ) : (
                <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                  Vui lòng đăng nhập để bình luận.
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-center py-8 text-sm">
                    Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                  </p>
                ) : (
                  <>
                    {comments.slice(0, visibleCount).map((comment) => renderComment(comment, 0))}
                    {visibleCount < comments.length && (
                      <div className="flex justify-center">
                        <button
                          onClick={() =>
                            setVisibleCount((prev) =>
                              Math.min(prev + 5, comments.length)
                            )
                          }
                          className="text-sm font-semibold text-pink-600 hover:text-pink-700"
                        >
                          Xem thêm
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;
