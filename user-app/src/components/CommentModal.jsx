// wrstudios-frontend/user-app/src/components/CommentModal.jsx - USE CACHE
import React, { useState, useEffect } from "react";
import { getComments, addComment } from "../utils/posts";
import { getCurrentUser } from "../utils/auth";
import { showSuccess, showError, showWarning } from "../utils/toast";

const CommentModal = ({ isOpen, onClose, postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false); // ← Bắt đầu false thay vì true
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (isOpen && postId) {
      console.log("🔍 CommentModal opened with postId:", postId); // ← ADD
      console.log("🔍 postId type:", typeof postId); // ← ADD
      loadComments();
    }
  }, [isOpen, postId]);

  const loadComments = async () => {
    try {
      setLoading(true);

      // ✅ FIX: Sử dụng cache, load ngay lập tức
      const result = await getComments(postId);

      const commentsData = result.data || [];

      // Build comment tree (parent-child)
      const commentMap = {};
      const rootComments = [];

      commentsData.forEach((comment) => {
        commentMap[comment.comment_id] = {
          ...comment,
          replies: [],
        };
      });

      commentsData.forEach((comment) => {
        if (comment.parent_comment_id) {
          const parent = commentMap[comment.parent_comment_id];
          if (parent) {
            parent.replies.push(commentMap[comment.comment_id]);
          }
        } else {
          rootComments.push(commentMap[comment.comment_id]);
        }
      });

      setComments(rootComments);
    } catch (error) {
      console.error("Error loading comments:", error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      showWarning("Vui lòng đăng nhập để bình luận!");
      return;
    }

    if (!newComment.trim()) {
      showWarning("Vui lòng nhập nội dung bình luận!");
      return;
    }
    console.log("📝 Submitting comment..."); // ← ADD
    console.log("📝 postId:", postId); // ← ADD
    console.log("📝 content:", newComment.trim()); // ← ADD
    console.log("📝 currentUser:", currentUser); // ← ADD
    setSubmitting(true);

    try {
      const result = await addComment(postId, {
        content: newComment.trim(),
        parent_comment_id: replyTo?.comment_id || null,
      });
      console.log("✅ Add comment result:", result); // ← ADD
      if (result.success) {
        showSuccess(replyTo ? "Đã phản hồi bình luận!" : "Đã thêm bình luận!");
        setNewComment("");
        setReplyTo(null);

        // ✅ Reload để lấy comments mới nhất
        await loadComments();
      } else {
        showError(result.message || "Lỗi khi thêm bình luận!");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      showError("Lỗi khi thêm bình luận!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = (comment) => {
    setReplyTo(comment);
    setNewComment("");
  };

  const cancelReply = () => {
    setReplyTo(null);
    setNewComment("");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;

    return date.toLocaleDateString("vi-VN");
  };

  const getInitial = (name) => {
    if (!name || typeof name !== "string" || name.trim() === "") {
      return "?";
    }
    return name.trim().charAt(0).toUpperCase();
  };

  const renderComment = (comment, depth = 0) => {
    const authorName =
      comment.authorName || comment.user_name || comment.name || "Unknown User";
    const isOwner =
      currentUser &&
      (currentUser.user_id === comment.user_id ||
        currentUser.id === comment.user_id);

    return (
      <div
        key={comment.comment_id}
        className={`${depth > 0 ? "ml-12 mt-4" : ""}`}
      >
        <div className="flex gap-3">
          <div
            className={`w-10 h-10 rounded-full bg-gradient-to-br ${
              isOwner
                ? "from-pink-500 to-purple-500"
                : "from-blue-500 to-cyan-500"
            } flex items-center justify-center text-white font-bold flex-shrink-0`}
          >
            {getInitial(authorName)}
          </div>

          <div className="flex-1">
            <div className="bg-gray-100 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-gray-900 text-sm">
                  {authorName}
                </p>
                {isOwner && (
                  <span className="px-2 py-0.5 bg-pink-100 text-pink-600 text-xs font-semibold rounded-full">
                    Bạn
                  </span>
                )}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {comment.content}
              </p>
            </div>

            <div className="flex items-center gap-4 mt-2 px-2">
              <span className="text-xs text-gray-500">
                {formatDate(comment.created_at)}
              </span>
              <button
                onClick={() => handleReply(comment)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
              >
                Phản hồi
              </button>
            </div>

            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-3 space-y-3">
                {comment.replies.map((reply) =>
                  renderComment(reply, depth + 1)
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-2 rounded-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Bình luận</h2>
              <p className="text-sm text-gray-500">
                {loading ? "Đang tải..." : `${comments.length} bình luận`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <svg
              className="w-6 h-6"
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

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className="text-gray-500 text-sm">
                Chưa có bình luận nào. Hãy là người đầu tiên!
              </p>
            </div>
          ) : (
            comments.map((comment) => renderComment(comment, 0))
          )}
        </div>

        {/* Comment Input */}
        {currentUser ? (
          <form
            onSubmit={handleSubmit}
            className="border-t border-gray-200 p-4"
          >
            {replyTo && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                    />
                  </svg>
                  <span className="text-sm text-blue-700">
                    Đang phản hồi{" "}
                    <span className="font-semibold">
                      {replyTo.authorName ||
                        replyTo.user_name ||
                        "Unknown User"}
                    </span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={cancelReply}
                  className="text-blue-600 hover:text-blue-700"
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
            )}

            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                {getInitial(currentUser.name || currentUser.email)}
              </div>

              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={
                    replyTo ? "Viết phản hồi..." : "Viết bình luận..."
                  }
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  disabled={submitting}
                />
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {submitting ? "Đang gửi..." : "Gửi"}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="border-t border-gray-200 p-6 text-center">
            <p className="text-gray-600 mb-4">
              Vui lòng đăng nhập để bình luận
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full hover:from-pink-600 hover:to-purple-600 transition font-semibold"
            >
              Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentModal;
