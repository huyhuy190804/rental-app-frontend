  // wrstudios-frontend/user-app/src/admin_components/AdminStatisticsPage.jsx
  import React, { useState, useEffect } from "react";
  import {
    exportToWord,
    exportToPDF,
    exportToExcel,
  } from "../utils/exportReports";
  import {
    getStatistics,
    getMonthlyBreakdown,
    getRevenueByPlan,
    getUserGrowth,
  } from "../utils/statistics";

  const AdminStatisticsPage = () => {
    const [feedback, setFeedback] = useState({});
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [currentFeedback, setCurrentFeedback] = useState("");
    const [selectedRow, setSelectedRow] = useState(null);

    const [showExportModal, setShowExportModal] = useState(false);
    const [exportFormat, setExportFormat] = useState("word");

    // Detail modal state
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [detailMetric, setDetailMetric] = useState(null);
    const [detailView, setDetailView] = useState("monthly");

    useEffect(() => {
      const saved = localStorage.getItem("adminStatisticsFeedback");
      if (saved) setFeedback(JSON.parse(saved));
    }, []);

    const saveFeedback = (key, value) => {
      const updated = { ...feedback, [key]: value };
      setFeedback(updated);
      localStorage.setItem("adminStatisticsFeedback", JSON.stringify(updated));
    };

    const [stats, setStats] = useState({
      allTime: { totalUsers: 0, totalPremium: 0, totalRevenue: 0, totalPosts: 0 },
      yearly: [],
    });
    const [monthlyBreakdown, setMonthlyBreakdown] = useState([]);
    const [revenueByPlan, setRevenueByPlan] = useState([]);
    const [userGrowth, setUserGrowth] = useState([]);

    useEffect(() => {
      let mounted = true;
      const loadAllStats = async () => {
        try {
          const baseStats = await getStatistics();
          const mb = await getMonthlyBreakdown();
          const rbp = await getRevenueByPlan();
          const ug = await getUserGrowth();

          if (!mounted) return;

          setStats({
            allTime: {
              totalUsers: baseStats?.all?.totalUsers || 0,
              totalPremium: baseStats?.all?.totalPremiumUsers || 0,
              totalRevenue: baseStats?.all?.totalRevenue || 0,
              totalPosts: baseStats?.all?.totalPosts || 0,
            },
            yearly: Array.isArray(baseStats.year)
              ? baseStats.year
              : baseStats.year
              ? [baseStats.year]
              : [
                  {
                    year: new Date().getFullYear(),
                    totalNewUsers: 0,
                    premiumCount: 0,
                    totalRevenue: 0,
                    totalPosts: 0,
                  },
                ],
          });

          setMonthlyBreakdown(mb || []);
          setRevenueByPlan(rbp || []);
          setUserGrowth(ug || []);
        } catch (err) {
          console.error("Error loading statistics:", err);
        }
      };

      loadAllStats();
      return () => {
        mounted = false;
      };
    }, []);

    const handleExport = async (format) => {
      try {
        const reportData = {
          monthly: monthlyBreakdown,
          yearly: stats,
          revenue: revenueByPlan,
          growth: userGrowth,
          feedback,
        };
        if (format === "word") await exportToWord(reportData);
        if (format === "pdf") await exportToPDF(reportData);
        if (format === "excel") await exportToExcel(reportData);
        setShowExportModal(false);
      } catch (err) {
        console.error(err);
        alert("Lỗi khi xuất file");
      }
    };

    const openFeedbackModal = (rowKey) => {
      setSelectedRow(rowKey);
      setCurrentFeedback(feedback[rowKey] || "");
      setShowFeedbackModal(true);
    };

    const handleFeedbackSave = () => {
      if (selectedRow) {
        saveFeedback(selectedRow, currentFeedback);
        setShowFeedbackModal(false);
        setCurrentFeedback("");
        setSelectedRow(null);
      }
    };

    const openDetailModal = (metric) => {
      setDetailMetric(metric);
      setDetailView("monthly");
      setShowDetailModal(true);
    };

    const closeDetailModal = () => {
      setShowDetailModal(false);
      setDetailMetric(null);
    };

    const metricLabel = (m) => {
      switch (m) {
        case "totalUsers":
          return "Thống kê người dùng";
        case "totalPremium":
          return "Thống kê người dùng đăng ký gói premium";
        case "totalRevenue":
          return "Thống kê doanh thu";
        case "totalPosts":
          return "Thống kê bài viết";
        default:
          return "";
      }
    };

    const getMonthlyValueForMetric = (monthObj, metric) => {
      if (!monthObj) return 0;
      switch (metric) {
        case "totalUsers":
          return monthObj.newUsers || 0;
        case "totalPremium":
          return monthObj.premiumSignups || 0;
        case "totalRevenue":
          return monthObj.revenue || 0;
        case "totalPosts":
          return monthObj.posts || 0;
        default:
          return 0;
      }
    };

    const renderAllTimeTable = () => (
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4">
          <h2 className="text-lg font-bold">Bảng thống kê</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Thống kê
                </th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">
                  Giá trị
                </th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">
                  Feedback
                </th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">
                  Chi tiết
                </th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">
                  Xuất
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">
                  Thống kê người dùng
                </td>
                <td className="px-4 py-3 text-center text-blue-600 font-semibold">
                  {stats.allTime.totalUsers}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => openFeedbackModal("alltime_users")}
                    className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full transition"
                  >
                    💬
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => openDetailModal("totalUsers")}
                    className="inline-flex items-center justify-center w-8 h-8 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded-full transition"
                  >
                    🔎
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => setShowExportModal(true)}
                    className="inline-flex items-center justify-center w-8 h-8 bg-green-100 hover:bg-green-200 text-green-600 rounded-full transition"
                  >
                    📥
                  </button>
                </td>
              </tr>

              <tr className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">
                  Thống kê người dùng đăng ký gói premium
                </td>
                <td className="px-4 py-3 text-center text-green-600 font-semibold">
                  {stats.allTime.totalPremium}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => openFeedbackModal("alltime_premium")}
                    className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full transition"
                  >
                    💬
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => openDetailModal("totalPremium")}
                    className="inline-flex items-center justify-center w-8 h-8 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded-full transition"
                  >
                    🔎
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => setShowExportModal(true)}
                    className="inline-flex items-center justify-center w-8 h-8 bg-green-100 hover:bg-green-200 text-green-600 rounded-full transition"
                  >
                    📥
                  </button>
                </td>
              </tr>

              <tr className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">
                  Thống kê doanh thu
                </td>
                <td className="px-4 py-3 text-center text-purple-600 font-semibold">
                  {(stats.allTime.totalRevenue || 0).toLocaleString("vi-VN")}₫
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => openFeedbackModal("alltime_revenue")}
                    className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full transition"
                  >
                    💬
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => openDetailModal("totalRevenue")}
                    className="inline-flex items-center justify-center w-8 h-8 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded-full transition"
                  >
                    🔎
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => setShowExportModal(true)}
                    className="inline-flex items-center justify-center w-8 h-8 bg-green-100 hover:bg-green-200 text-green-600 rounded-full transition"
                  >
                    📥
                  </button>
                </td>
              </tr>

              <tr className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">
                  Thống kê bài viết
                </td>
                <td className="px-4 py-3 text-center text-orange-600 font-semibold">
                  {stats.allTime.totalPosts}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => openFeedbackModal("alltime_posts")}
                    className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full transition"
                  >
                    💬
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => openDetailModal("totalPosts")}
                    className="inline-flex items-center justify-center w-8 h-8 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded-full transition"
                  >
                    🔎
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => setShowExportModal(true)}
                    className="inline-flex items-center justify-center w-8 h-8 bg-green-100 hover:bg-green-200 text-green-600 rounded-full transition"
                  >
                    📥
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );

    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              📊 Báo cáo & Thống kê
            </h1>
            <p className="text-gray-600">Quản lý và phân tích dữ liệu hệ thống</p>
          </div>

          {renderAllTimeTable()}
        </div>

        {/* Feedback Modal */}
        {showFeedbackModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold mb-4 text-gray-800">Feedback</h3>
              <textarea
                value={currentFeedback}
                onChange={(e) => setCurrentFeedback(e.target.value)}
                placeholder="Nhập feedback..."
                className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleFeedbackSave}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  💾 Lưu
                </button>
                <button
                  onClick={() => {
                    setShowFeedbackModal(false);
                    setCurrentFeedback("");
                    setSelectedRow(null);
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
                >
                  ❌ Hủy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold mb-4 text-gray-800">
                Chọn định dạng xuất file
              </h3>
              <div className="space-y-3">
                <label className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    value="word"
                    checked={exportFormat === "word"}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="mr-3"
                  />{" "}
                  <span className="font-semibold text-gray-800">
                    📄 Word (.docx)
                  </span>
                </label>
                <label className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    value="pdf"
                    checked={exportFormat === "pdf"}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="mr-3"
                  />{" "}
                  <span className="font-semibold text-gray-800">📕 PDF</span>
                </label>
                <label className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    value="excel"
                    checked={exportFormat === "excel"}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="mr-3"
                  />{" "}
                  <span className="font-semibold text-gray-800">
                    📊 Excel (.xlsx)
                  </span>
                </label>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => handleExport(exportFormat)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  ✓ Xuất
                </button>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
                >
                  ❌ Hủy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && detailMetric && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                  Chi tiết: {metricLabel(detailMetric)}
                </h3>
                <button onClick={closeDetailModal} className="text-gray-600">
                  ❌
                </button>
              </div>

              <div className="mb-4">
                <label className="inline-flex items-center mr-4">
                  <input
                    type="radio"
                    checked={detailView === "monthly"}
                    onChange={() => setDetailView("monthly")}
                    className="mr-2"
                  />{" "}
                  Theo tháng
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    checked={detailView === "yearly"}
                    onChange={() => setDetailView("yearly")}
                    className="mr-2"
                  />{" "}
                  Theo năm
                </label>
              </div>

              {detailView === "monthly" ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 border-b">
                      <tr>
                        <th className="px-4 py-2 text-left">Tháng</th>
                        <th className="px-4 py-2 text-center">Giá trị</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyBreakdown.map((m, i) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-2">Tháng {i + 1}</td>
                          <td className="px-4 py-2 text-center">
                            {detailMetric === "totalRevenue"
                              ? (
                                  getMonthlyValueForMetric(m, detailMetric) || 0
                                ).toLocaleString("vi-VN") + "₫"
                              : getMonthlyValueForMetric(m, detailMetric)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 border-b">
                      <tr>
                        <th className="px-4 py-2 text-left">Năm</th>
                        <th className="px-4 py-2 text-center">Giá trị</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.yearly.map((y, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-2">{y.year}</td>
                          <td className="px-4 py-2 text-center">
                            {detailMetric === "totalUsers" &&
                              (y.totalNewUsers || 0)}
                            {detailMetric === "totalPremium" &&
                              (y.premiumCount || 0)}
                            {detailMetric === "totalRevenue" &&
                              (y.totalRevenue || 0).toLocaleString("vi-VN") + "₫"}
                            {detailMetric === "totalPosts" && (y.totalPosts || 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  export default AdminStatisticsPage;
