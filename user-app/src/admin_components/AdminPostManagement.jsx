// wrstudios-frontend/user-app/src/admin_components/AdminPostManagement.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  getAllPosts,
  approvePost,
  rejectPost,
  deletePost,
} from "../utils/posts";
import PostDetailModal from "../components/PostDetailModal";
import CreatePostModal from "../components/CreatePostModal";
import ConfirmationModal from "../components/ConfirmationModal";
import { formatCurrency } from "../utils/format";
import { getCurrentUser } from "../utils/auth";
import { addNotification } from "../utils/notifications";
import { showSuccess, showError, showWarning, showInfo } from "../utils/toast";

const AdminPostManagement = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  
  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null, // 'approve', 'reject', 'delete'
    postId: null,
    postTitle: null,
  });

  const loadPosts = useCallback(async () => {
    try {
      const allPosts = await getAllPosts();
      let filtered = allPosts;

      if (activeTab === "approved") {
        filtered = allPosts.filter((p) => p.status === "approved");
      } else if (activeTab === "pending") {
        filtered = allPosts.filter((p) => p.status === "pending");
      } else if (activeTab === "draft") {
        filtered = allPosts.filter(
          (p) => p.status === "draft" || p.status === "rejected"
        );
      }

      setPosts(filtered);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error loading posts:", error);
      showError("Lỗi khi tải bài viết!");
    }
  }, [activeTab]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleApprove = (postId) => {
    const post = posts.find((p) => p.post_id === postId);
    setConfirmModal({
      isOpen: true,
      type: 'approve',
      postId,
      postTitle: post?.title || 'N/A',
    });
  };

  const confirmApprove = async () => {
    const { postId } = confirmModal;
    try {
      const result = await approvePost(postId);
      if (result.success) {
        const post = posts.find((p) => p.post_id === postId);
        addNotification(
          "post_approved",
          `Bài viết "${post?.title || "N/A"}" đã được duyệt`,
          { postId }
        );
        showSuccess("Đã duyệt bài viết!");
        loadPosts();
      } else {
        showError(result.message || "Lỗi duyệt bài viết");
      }
    } catch (error) {
      showError("Lỗi duyệt bài viết: " + error.message);
    }
    setConfirmModal({ isOpen: false, type: null, postId: null, postTitle: null });
  };

  const handleReject = (postId) => {
    const post = posts.find((p) => p.post_id === postId);
    setConfirmModal({
      isOpen: true,
      type: 'reject',
      postId,
      postTitle: post?.title || 'N/A',
    });
  };

  const confirmReject = async () => {
    const { postId } = confirmModal;
    try {
      const result = await rejectPost(postId);
      if (result.success) {
        const post = posts.find((p) => p.post_id === postId);
        addNotification(
          "post_rejected",
          `Bài viết "${post?.title || "N/A"}" đã bị từ chối`,
          { postId }
        );
        showSuccess("Đã từ chối bài viết!");
        loadPosts();
      } else {
        showError(result.message || "Lỗi từ chối bài viết");
      }
    } catch (error) {
      showError("Lỗi từ chối bài viết: " + error.message);
    }
    setConfirmModal({ isOpen: false, type: null, postId: null, postTitle: null });
  };

  const handleDelete = (postId, postTitle) => {
    setConfirmModal({
      isOpen: true,
      type: 'delete',
      postId,
      postTitle,
    });
  };

  const confirmDelete = async () => {
    const { postId, postTitle } = confirmModal;
    try {
      const result = await deletePost(postId);
      if (result.success) {
        showSuccess("Đã xóa bài viết!");
        setPosts((currentPosts) =>
          currentPosts.filter((p) => p.post_id !== postId)
        );
      } else {
        // Nếu bài viết không tồn tại trong database, vẫn xóa khỏi state
        if (result.message && result.message.includes('not found')) {
          showWarning("Bài viết không tồn tại trong database, đang xóa khỏi danh sách hiển thị...");
          setPosts((currentPosts) =>
            currentPosts.filter((p) => p.post_id !== postId)
          );
        } else {
          showError(result.message || "Lỗi xóa bài viết");
        }
      }
    } catch (error) {
      // Nếu có lỗi do bài viết không tồn tại, vẫn xóa khỏi state
      if (error.message && error.message.includes('404')) {
        showWarning("Bài viết không tồn tại trong database, đang xóa khỏi danh sách hiển thị...");
        setPosts((currentPosts) =>
          currentPosts.filter((p) => p.post_id !== postId)
        );
      } else {
        showError("Lỗi xóa bài viết: " + error.message);
      }
    }
    setConfirmModal({ isOpen: false, type: null, postId: null, postTitle: null });
  };

  // Pagination
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium whitespace-nowrap">
            Đã đăng
          </span>
        );
      case "pending":
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium whitespace-nowrap">
            Chờ duyệt
          </span>
        );
      case "rejected":
        return (
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium whitespace-nowrap">
            Từ chối
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium whitespace-nowrap">
            Nháp
          </span>
        );
    }
  };

  const getPostTypeLabel = (type) => {
    return type === "listing" ? "Đăng tin" : "Bài viết";
  };

  const handleCreatePostSuccess = () => {
    addNotification("post_new", "Bài viết mới đã được tạo và đang chờ duyệt");
    showSuccess("Bài viết đã được tạo thành công!");
    loadPosts();
    setShowCreateModal(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const formatViews = (views) => {
    return views || 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý bài viết thành viên
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Kiểm duyệt và quản lý bài viết từ thành viên
          </p>
        </div>
        <button
          onClick={() => {
            const currentUser = getCurrentUser();
            if (!currentUser) {
              showWarning("Vui lòng đăng nhập để thêm bài viết!");
              return;
            }
            setShowCreateModal(true);
          }}
          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition flex items-center gap-2"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Thêm bài viết
        </button>
      </div>
      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreatePostSuccess}
      />

      <PostDetailModal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedPost(null);
          loadPosts();
        }}
        postId={selectedPost?.post_id}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: null, postId: null, postTitle: null })}
        onConfirm={() => {
          if (confirmModal.type === 'approve') {
            confirmApprove();
          } else if (confirmModal.type === 'reject') {
            confirmReject();
          } else if (confirmModal.type === 'delete') {
            confirmDelete();
          }
        }}
        title={
          confirmModal.type === 'approve' ? 'Duyệt bài viết' :
          confirmModal.type === 'reject' ? 'Từ chối bài viết' :
          'Xóa bài viết'
        }
        message={
          confirmModal.type === 'approve' ? `Bạn có chắc muốn duyệt bài viết "${confirmModal.postTitle}"?` :
          confirmModal.type === 'reject' ? `Bạn có chắc muốn từ chối bài viết "${confirmModal.postTitle}"?` :
          `Bạn có chắc muốn xóa bài viết "${confirmModal.postTitle}"? Hành động này không thể hoàn tác!`
        }
        confirmText={
          confirmModal.type === 'approve' ? 'Duyệt' :
          confirmModal.type === 'reject' ? 'Từ chối' :
          'Xóa'
        }
        type={
          confirmModal.type === 'delete' ? 'danger' :
          confirmModal.type === 'reject' ? 'warning' :
          'info'
        }
      />
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 flex">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-6 py-4 font-medium text-sm border-b-2 transition ${
              activeTab === "all"
                ? "border-red-600 text-red-600"
                : "border-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            Tất cả ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab("approved")}
            className={`px-6 py-4 font-medium text-sm border-b-2 transition ${
              activeTab === "approved"
                ? "border-red-600 text-red-600"
                : "border-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            Đã đăng ({posts.filter((p) => p.status === "approved").length})
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-6 py-4 font-medium text-sm border-b-2 transition ${
              activeTab === "pending"
                ? "border-red-600 text-red-600"
                : "border-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            Chờ duyệt ({posts.filter((p) => p.status === "pending").length})
          </button>
          <button
            onClick={() => setActiveTab("draft")}
            className={`px-6 py-4 font-medium text-sm border-b-2 transition ${
              activeTab === "draft"
                ? "border-red-600 text-red-600"
                : "border-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            Nháp (
            {
              posts.filter(
                (p) => p.status === "draft" || p.status === "rejected"
              ).length
            }
            )
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tiêu đề
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tác giả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Loại bài viết
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Loại hình
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Vị trí
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Lượt xem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ngày đăng
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentPosts.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Không có bài viết nào
                  </td>
                </tr>
              ) : (
                currentPosts.map((post) => (
                  <tr key={post.post_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            post.thumbnail || "https://via.placeholder.com/60"
                          }
                          alt={post.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="max-w-xs">
                          <p className="text-sm font-medium text-gray-900 line-clamp-2">
                            {post.title}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {post.authorName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          post.post_type === "listing"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {getPostTypeLabel(post.post_type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {post.post_type === "listing" ? "Studio" : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {post.post_type === "listing" ? (
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4 text-red-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {post.address}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-red-600 whitespace-nowrap">
                      {post.post_type === "listing"
                        ? `${formatCurrency(post.price)} đ`
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4 text-gray-400"
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
                        {formatViews(post.views)}
                      </span>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(post.status)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(post.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Xem chi tiết */}
                        <button
                          onClick={() => {
                            setShowDetailModal(true);
                            setSelectedPost(post);
                          }}
                          className="relative group p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Xem chi tiết"
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
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Xem chi tiết
                          </span>
                        </button>

                        {/* Duyệt bài (chỉ hiện khi pending) */}
                        {post.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(post.post_id)}
                              className="relative group p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                              title="Duyệt bài"
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
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                Duyệt bài
                              </span>
                            </button>
                            <button
                              onClick={() => handleReject(post.post_id)}
                              className="relative group p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                              title="Từ chối"
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
                              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                Từ chối
                              </span>
                            </button>
                          </>
                        )}

                        {/* Gỡ bài (chỉ hiện khi approved) */}
                        {post.status === "approved" && (
                          <button
                            onClick={() => handleReject(post.post_id)}
                            className="relative group p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all"
                            title="Gỡ bài"
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
                                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                              />
                            </svg>
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                              Gỡ bài
                            </span>
                          </button>
                        )}

                        {/* Phục hồi (chỉ hiện khi rejected hoặc draft) */}
                        {(post.status === "rejected" ||
                          post.status === "draft") && (
                          <button
                            onClick={() => handleApprove(post.post_id)}
                            className="relative group p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Phục hồi bài viết"
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
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              />
                            </svg>
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                              Phục hồi
                            </span>
                          </button>
                        )}

                        {/* Xóa */}
                        <button
                          onClick={() => handleDelete(post.post_id, post.title)}
                          className="relative group p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Xóa vĩnh viễn"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Xóa vĩnh viễn
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Hiển thị {indexOfFirstPost + 1}-
              {Math.min(indexOfLastPost, posts.length)} của {posts.length} bài
              viết
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &lt;
              </button>

              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded ${
                      currentPage === pageNum
                        ? "bg-red-600 text-white"
                        : "border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className="px-2 py-1">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &gt;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPostManagement;
