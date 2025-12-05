// wrstudios-frontend/user-app/src/admin_components/AdminDashboard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const AdminDashboard = () => {
  // Mock data cho biểu đồ Line
  const revenueData = [
    { month: "T1", revenue: 140, members: 60 },
    { month: "T2", revenue: 160, members: 75 },
    { month: "T3", revenue: 145, members: 65 },
    { month: "T4", revenue: 180, members: 85 },
    { month: "T5", revenue: 195, members: 95 },
    { month: "T6", revenue: 210, members: 100 },
    { month: "T7", revenue: 205, members: 98 },
    { month: "T8", revenue: 195, members: 95 },
    { month: "T9", revenue: 220, members: 105 },
    { month: "T10", revenue: 240, members: 115 },
    { month: "T11", revenue: 275, members: 125 },
    { month: "T12", revenue: 340, members: 140 }
  ];

  // Mock data cho biểu đồ Bar
  const categoryData = [
    { name: "Studio", count: 500 },
    { name: "1 Phòng ngủ", count: 400 },
    { name: "2 Phòng ngủ", count: 280 },
    { name: "Phòng khách sạn", count: 120 }
  ];

  const stats = [
    {
      title: "Tổng thành viên",
      value: "2,847",
      change: "+12.5% từ tháng trước",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      bgColor: "bg-blue-500",
      changePositive: true
    },
    {
      title: "Bài viết",
      value: "1,234",
      change: "+8.2% từ tháng trước",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      bgColor: "bg-green-500",
      changePositive: true
    },
    {
      title: "Đánh giá",
      value: "856",
      change: "+15.3% từ tháng trước",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      bgColor: "bg-purple-500",
      changePositive: true
    },
    {
      title: "Doanh thu",
      value: "₫128.5M",
      change: "+23.1% từ tháng trước",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      bgColor: "bg-red-500",
      changePositive: true
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Link to="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Go to Homepage
        </Link>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{stat.value}</h3>
                <p className={`text-xs ${stat.changePositive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </p>
              </div>
              <div className={`${stat.bgColor} w-12 h-12 rounded-lg flex items-center justify-center text-white`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Doanh thu & Thành viên mới</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#999" />
              <YAxis yAxisId="left" stroke="#999" />
              <YAxis yAxisId="right" orientation="right" stroke="#999" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke="#ef4444"
                strokeWidth={2}
                name="Doanh thu (triệu)"
                dot={{ fill: "#ef4444" }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="members"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Thành viên mới"
                dot={{ fill: "#3b82f6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Bài viết theo loại hình</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#999" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={70} />
              <YAxis stroke="#999" />
              <Tooltip />
              <Bar dataKey="count" fill="#ef4444" name="Số lượng bài viết" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;