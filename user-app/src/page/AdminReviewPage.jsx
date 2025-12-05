
// wrstudios-frontend/user-app/src/page/AdminReviewPage.jsx
import React, { useState, useEffect } from "react";
import AdminLayout from "../admin_components/AdminLayout";
import { getAllReviews, deleteReview, restoreReview } from "../utils/reviews";

const AdminReviewPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = () => {
    setLoading(true);
    const allReviews = getAllReviews();
    // Hiển thị tất cả reviews có ít nhất 1 báo cáo (để admin có thể kiểm duyệt sớm)
    const violatedReviews = allReviews.filter(r => 
      r.reports && r.reports.length > 0
    );
    // Sắp xếp theo số lượng báo cáo giảm dần (nhiều báo cáo nhất lên đầu)
    violatedReviews.sort((a, b) => (b.reports?.length || 0) - (a.reports?.length || 0));
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
    <AdminLayout>
      <div>
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
              Danh sách bình luận vi phạm ({reviews.length})
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
                          <span className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded ${
                            review.reports.length >= 5 
                              ? "bg-red-100 text-red-700" 
                              : review.reports.length >= 3
                              ? "bg-orange-100 text-orange-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {review.reports.length} báo cáo
                            {review.hidden && " (Đã ẩn)"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {formatDate(review.createdAt)}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {/* Khôi phục */}
                            <button
                              onClick={() => handleRestore(review.id)}
                              className="relative group p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="Khôi phục bình luận"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                Khôi phục bình luận
                              </span>
                            </button>

                            {/* Xóa */}
                            <button
                              onClick={() => handleDelete(review.id, review.postTitle)}
                              className="relative group p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Xóa bình luận"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                Xóa bình luận
                              </span>
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
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReviewPage;