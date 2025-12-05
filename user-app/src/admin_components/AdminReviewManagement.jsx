// wrstudios-frontend/user-app/src/admin_components/AdminReviewManagement.jsx
import React, { useState, useEffect } from "react";
import { getAllReviews, deleteReview, restoreReview } from "../utils/reviews";

const AdminReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = () => {
    setLoading(true);
    const allReviews = getAllReviews();
    // Chỉ hiển thị reviews bị báo cáo >= 5 lần
    const violatedReviews = allReviews.filter(r => r.reports && r.reports.length >= 5);
    setReviews(violatedReviews);
    setLoading(false);
  };

  const handleDelete = (reviewId, postTitle) => {
    if (window.confirm(`Xác nhận xóa vĩnh viễn bình luận của "${postTitle}"?`)) {
      const result = deleteReview(reviewId);
      if (result.success) {
        alert("✅ Đã xóa bình luận!");
        loadReviews();
      }
    }
  };

  const handleRestore = (reviewId) => {
    if (window.confirm("Khôi phục bình luận này?")) {
      const result = restoreReview(reviewId);
      if (result.success) {
        alert("✅ Đã khôi phục bình luận!");
        loadReviews();
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Quản lý đánh giá & bình luận
        </h1>
        <p className="text-gray-600">
          Kiểm duyệt và quản lý đánh giá, bình luận từ người dùng
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Danh sách bình luận vi phạm
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-gray-500">Không có bình luận vi phạm nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Người đánh giá
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Bài viết
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Đánh giá
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Nội dung bình luận
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Ngày
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review) => (
                    <tr key={review.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                            {review.userName.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900">{review.userName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-900 font-medium line-clamp-1">
                          {review.postTitle}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-5 h-5 ${star <= review.rating ? "text-yellow-400" : "text-gray-300"}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {review.content}
                        </p>
                        <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
                          {review.reports.length} báo cáo
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {formatDate(review.createdAt)}
                      </td>
                      <td className="px-4 py-4 text-center relative">
                        <button
                          onClick={() => setShowActionMenu(showActionMenu === review.id ? null : review.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                          <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {showActionMenu === review.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-[100]">
                            <button
                              onClick={() => {
                                setShowActionMenu(null);
                                handleRestore(review.id);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Khôi phục bình luận
                            </button>
                            <div className="border-t border-gray-200 my-1"></div>
                            <button
                              onClick={() => {
                                setShowActionMenu(null);
                                handleDelete(review.id, review.postTitle);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Xóa bình luận
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReviewManagement;