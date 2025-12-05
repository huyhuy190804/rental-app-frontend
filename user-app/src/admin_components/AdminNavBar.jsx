// wrstudios-frontend/user-app/src/admin_components/AdminNavBar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import PremiumIcon from "../components/PremiumIcon";

const AdminNavBar = () => {
  const location = useLocation();

  const menuItems = [
    {
      id: "users",
      path: "/admin/users",
      icon: (
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
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      label: "Quản lý thành viên",
    },
    {
      id: "posts",
      path: "/admin/posts",
      icon: (
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      label: "Quản lý bài viết",
    },
    {
      id: "reviews",
      path: "/admin/reviews",
      icon: (
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
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),
      label: "Đánh giá & Bình luận",
    },
    {
      id: "premium",
      path: "/admin/premium",
      icon: <PremiumIcon className="w-5 h-5" variant="solid" />,
      label: "Quản lý gói",
    },
    {
      id: "statistics",
      path: "/admin/statistics",
      icon: (
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      label: "Báo cáo & Thống kê",
    },
  ];

  const isActive = (item) => {
    return location.pathname.startsWith(item.path);
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-1">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all relative ${
                isActive(item)
                  ? "text-pink-600"
                  : "text-gray-700 hover:text-pink-600"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {isActive(item) && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600"></div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavBar;
