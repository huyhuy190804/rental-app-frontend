// wrstudios-frontend/user-app/src/admin_components/AdminPostManagement.jsx - REMOVE APPROVE BUTTON
import React, { useState, useEffect, useCallback } from "react";
import {
  getAllPosts,
  rejectPost, // ← Giữ reject
  deletePost, // ← Giữ delete
} from "../utils/posts";
import PostDetailModal from "../components/PostDetailModal";
import { showSuccess, showError, showWarning } from "../utils/toast";

const AdminPostManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      const allPosts = await getAllPosts(1, 1000);

      const mappedPosts = (allPosts || [])
        .map((p) => ({
          ...p,
          id: p.post_id || p.id,
          type: p.post_type || "listing",
          createdAt: p.created_at || p.createdAt,
          authorName: p.author_name || p.authorName || "Unknown",
          authorId: p.user_id || p.authorId,
          location: p.address || p.location,
          content: p.description,
          images: p.images || [],
          thumbnail: p.thumbnail || null,
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setPosts(mappedPosts);
    } catch (error) {
      console.error("Error loading posts:", error);
      showError("Lỗi khi tải danh sách bài viết!");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // ❌ XÓA hàm handleApprove - không cần nữa

  const handleReject = async (postId, postTitle) => {
    if (window.confirm(`Xác nhận từ chối bài viết: "${postTitle}"?`)) {
      try {
        const result = await rejectPost(postId);
        if (result.success) {
          showSuccess("Đã từ chối bài viết!");
          loadPosts();
        } else {
          showError(result.message || "Lỗi khi từ chối bài viết!");
        }
      } catch (error) {
        showError("Lỗi khi từ chối bài viết!");
      }
    }
  };

  const handleDelete = async (postId, postTitle) => {
    if (window.confirm(`Xác nhận XÓA VĨNH VIỄN bài viết: "${postTitle}"?`)) {
      try {
        const result = await deletePost(postId);
        if (result.success) {
          showSuccess("Đã xóa bài viết!");
          loadPosts();
        } else {
          showError(result.message || "Lỗi khi xóa bài viết!");
        }
      } catch (error) {
        showError("Lỗi khi xóa bài viết!");
      }
    }
  };

  const handleViewDetail = (postId) => {
    setSelectedPostId(postId);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedPostId(null);
    loadPosts();
  };

  const filteredPosts =
    filterStatus === "all"
      ? posts
      : posts.filter((p) => p.status === filterStatus);

  const statusCounts = {
    all: posts.length,
    approved: posts.filter((p) => p.status === "approved").length,
    pending: posts.filter((p) => p.status === "pending").length,
    rejected: posts.filter((p) => p.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý bài viết</h1>
          <p className="text-gray-600 mt-1">
            Quản lý và kiểm duyệt bài viết từ người dùng
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 p-1 inline-flex gap-1">
        {[
          { id: "all", label: "Tất cả", count: statusCounts.all },
          { id: "approved", label: "Đã duyệt", count: statusCounts.approved },
          { id: "pending", label: "Chờ duyệt", count: statusCounts.pending },
          { id: "rejected", label: "Đã từ chối", count: statusCounts.rejected },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filterStatus === tab.id
                ? "bg-pink-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Không có bài viết nào
            </h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Bài viết
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Tác giả
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Loại
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            post.thumbnail ||
                            "https://via.placeholder.com/100x80"
                          }
                          alt={post.title}
                          className="w-20 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 line-clamp-1">
                            {post.title}
                          </p>
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {post.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">
                        {post.authorName}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          post.type === "listing"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {post.type === "listing" ? "Listing" : "Article"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          post.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : post.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {post.status === "approved"
                          ? "Đã duyệt"
                          : post.status === "pending"
                          ? "Chờ duyệt"
                          : "Đã từ chối"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">
                        {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Xem chi tiết */}
                        <button
                          onClick={() => handleViewDetail(post.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
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
                        </button>

                        {/* ❌ XÓA nút Duyệt */}

                        {/* Từ chối - chỉ hiện nếu status = approved */}
                        {post.status === "approved" && (
                          <button
                            onClick={() => handleReject(post.id, post.title)}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition"
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
                          </button>
                        )}

                        {/* Xóa */}
                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Xóa"
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
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <PostDetailModal
        isOpen={showDetailModal}
        onClose={handleCloseModal}
        postId={selectedPostId}
      />
    </div>
  );
};

export default AdminPostManagement;