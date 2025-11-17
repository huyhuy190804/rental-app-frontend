  import React, { useState, useEffect } from "react";
  import { getAllPosts, approvePost, rejectPost, deletePost } from "../utils/posts";
  import PostDetailModal from "../components/PostDetailModal";
  const AdminPostManagement = () => {
    const [activeTab, setActiveTab] = useState("all");
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showActionMenu, setShowActionMenu] = useState(null);
    const postsPerPage = 5;
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    useEffect(() => {
      loadPosts();
    }, [activeTab]);

    const loadPosts = () => {
      const allPosts = getAllPosts();
      let filtered = allPosts;

      if (activeTab === "approved") {
        filtered = allPosts.filter(p => p.status === "approved");
      } else if (activeTab === "pending") {
        filtered = allPosts.filter(p => p.status === "pending");
      } else if (activeTab === "draft") {
        filtered = allPosts.filter(p => p.status === "draft" || p.status === "rejected");
      }

      setPosts(filtered);
      setCurrentPage(1);
    };

    const handleApprove = (postId) => {
      if (window.confirm("Duyệt bài viết này?")) {
        const result = approvePost(postId);
        if (result.success) {
          alert("✅ Đã duyệt bài viết!");
          loadPosts();
        }
      }
    };

    const handleReject = (postId) => {
      if (window.confirm("Từ chối bài viết này?")) {
        const result = rejectPost(postId);
        if (result.success) {
          alert("❌ Đã từ chối bài viết!");
          loadPosts();
        }
      }
    };

    const handleDelete = (postId, postTitle) => {
      if (window.confirm(`Xóa bài viết "${postTitle}"?`)) {
        const result = deletePost(postId);
        if (result.success) {
          alert("🗑️ Đã xóa bài viết!");
          loadPosts();
        }
      }
    };

    // Pagination
    const totalPages = Math.ceil(posts.length / postsPerPage);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const getStatusBadge = (status) => {
      switch (status) {
        case "approved":
          return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Đã đăng</span>;
        case "pending":
          return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Chờ duyệt</span>;
        case "rejected":
          return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Từ chối</span>;
        default:
          return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Nháp</span>;
      }
    };

    const getTypeBadge = (type) => {
      return type === "sale" ? "Studio" : "Bài viết";
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
    };

    const formatViews = (views) => {
      return views || 0;
    };

    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý bài viết thành viên</h1>
          <p className="text-sm text-gray-600 mt-1">Kiểm duyệt và quản lý bài viết từ thành viên</p>
        </div>
      <PostDetailModal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedPost(null);
        }}
        post={selectedPost}
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
              Tất cả ({getAllPosts().length})
            </button>
            <button
              onClick={() => setActiveTab("approved")}
              className={`px-6 py-4 font-medium text-sm border-b-2 transition ${
                activeTab === "approved"
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              Đã đăng ({getAllPosts().filter(p => p.status === "approved").length})
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-6 py-4 font-medium text-sm border-b-2 transition ${
                activeTab === "pending"
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              Chờ duyệt ({getAllPosts().filter(p => p.status === "pending").length})
            </button>
            <button
              onClick={() => setActiveTab("draft")}
              className={`px-6 py-4 font-medium text-sm border-b-2 transition ${
                activeTab === "draft"
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              Nháp ({getAllPosts().filter(p => p.status === "draft" || p.status === "rejected").length})
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tiêu đề</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tác giả</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại hình</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vị trí</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lượt xem</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày đăng</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentPosts.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                      Không có bài viết nào
                    </td>
                  </tr>
                ) : (
                  currentPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={post.images[0] || "https://via.placeholder.com/60"}
                            alt={post.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="max-w-xs">
                            <p className="text-sm font-medium text-gray-900 line-clamp-2">{post.title}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{post.authorName}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{getTypeBadge(post.type)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {post.type === "sale" ? (
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            {post.location}
                          </span>
                        ) : "-"}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-red-600">
                        {post.type === "sale" ? `${post.price} tỷ` : "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {formatViews(post.views)}
                        </span>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(post.status)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDate(post.createdAt)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="relative inline-block">
                          <button
                            onClick={() => setShowActionMenu(showActionMenu === post.id ? null : post.id)}
                            className="text-gray-400 hover:text-gray-600 p-2"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>

                          {showActionMenu === post.id && (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[100]">
      <button 
        onClick={() => {
          setShowActionMenu(null);
          setShowDetailModal(true);
          setSelectedPost(post);
        }}
        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
      >
        👁️ Xem chi tiết
      </button>
      {post.status === "pending" && (
        <>
          <button
            onClick={() => {
              setShowActionMenu(null);
              handleApprove(post.id);
            }}
            className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50"
          >
            ✅ Duyệt bài
          </button>
          <button
            onClick={() => {
              setShowActionMenu(null);
              handleReject(post.id);
            }}
            className="w-full text-left px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-50"
          >
            ❌ Từ chối
          </button>
        </>
      )}
      {post.status === "approved" && (
        <button
          onClick={() => {
            setShowActionMenu(null);
            handleReject(post.id);
          }}
          className="w-full text-left px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-50"
        >
          📥 Gỡ bài (chuyển vào nháp)
        </button>
      )}
      {(post.status === "rejected" || post.status === "draft") && (
        <button
          onClick={() => {
            setShowActionMenu(null);
            handleApprove(post.id);
          }}
          className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
        >
          ♻️ Phục hồi bài viết
        </button>
      )}
      <div className="border-t border-gray-200 my-2"></div>
      <button
        onClick={() => {
          setShowActionMenu(null);
          handleDelete(post.id, post.title);
        }}
        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
      >
        🗑️ Xóa vĩnh viễn
      </button>
    </div>
  )}
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
                Hiển thị {indexOfFirstPost + 1}-{Math.min(indexOfLastPost, posts.length)} của {posts.length} bài viết
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
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
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
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