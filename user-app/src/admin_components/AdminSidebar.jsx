// wrstudios-frontend/user-app/src/admin_components/AdminSidebar.jsx
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const AdminSidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("users");

  const menuItems = [
    {
      id: "users",
      path: "/admin/users",
      icon: "👥",
      label: "Quản lý thành viên"
    },
    {
      id: "posts",
      path: "/admin/posts",
      icon: "📝",
      label: "Quản lý bài viết"
    },
    {
      id: "reviews",
      path: "/admin/reviews",
      icon: "⭐",
      label: "Đánh giá & Bình luận"
    }
    ,
    {
      id: "premium",
      path: "/admin/premium",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#ec4899">
          <rect x="2" y="2" width="20" height="20" rx="4" />
          <path d="M12 7L14 12H19L15 15L16 20L12 17L8 20L9 15L5 12H10L12 7Z" fill="white" />
        </svg>
      ),
      label: "Quản lý gói"
    }
    ,
    {
      id: "statistics",
      path: "/admin/statistics",
      icon: "📈",
      label: "Báo cáo & Thống kê"
    }
  ];

  const isActive = (item) => {
    return location.pathname.startsWith(item.path);
  };

  return (
    <aside
      className={`bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      } flex flex-col`}
    >
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            W
          </div>
          {isOpen && (
            <div>
              <h2 className="font-bold text-lg">WR Studios</h2>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          )}
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-6">
        <ul className="space-y-2 px-3">
          {menuItems.map((item) => (
            <li key={item.id}>
              <Link
                to={item.path}
                onClick={() => setActiveMenu(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive(item)
                    ? "bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                {isOpen && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-gray-700">
        {isOpen ? (
          <div className="text-xs text-gray-400 text-center">
            © 2025 WR Studios
          </div>
        ) : (
          <div className="text-xs text-gray-400 text-center">©</div>
        )}
      </div>
    </aside>
  );
};

export default AdminSidebar;