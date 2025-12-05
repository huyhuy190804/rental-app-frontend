// wrstudios-frontend/user-app/src/admin_components/AdminHeader.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { logoutUser } from "../utils/auth";
import { getAllNotifications, markNotificationAsRead, formatTimeAgo, getUnreadCount } from "../utils/notifications";

const AdminHeader = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef(null);

  useEffect(() => {
    const loadNotifications = () => {
      const allNotifications = getAllNotifications();
      setNotifications(allNotifications);
      setUnreadCount(getUnreadCount());
    };

    loadNotifications();

    // Listen for notification updates
    window.addEventListener("notificationsUpdated", loadNotifications);
    return () => window.removeEventListener("notificationsUpdated", loadNotifications);
  }, []);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc muốn đăng xuất?")) {
      logoutUser();
      window.location.href = "/";
    }
  };

  const handleNotificationClick = (notification) => {
    markNotificationAsRead(notification.id);
    setShowNotifications(false);
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
          W
        </div>
        <div>
          <h2 className="font-bold text-gray-900 text-base leading-tight">WR Studios</h2>
          <p className="text-xs text-gray-500 leading-tight">Admin</p>
        </div>
      </div>

      {/* Right: Homepage + Notifications + User */}
      <div className="flex items-center gap-2">
        {/* Homepage Button */}
        <Link to="/" className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
          Homepage
        </Link>

        {/* Notification Bell */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                <p className="font-semibold text-sm">Thông báo</p>
                {unreadCount > 0 && (
                  <span className="text-xs text-gray-500">{unreadCount} chưa đọc</span>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-500 text-sm">
                    Không có thông báo nào
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-l-2 ${
                        !notification.read ? "border-red-500 bg-red-50/30" : "border-transparent"
                      }`}
                    >
                      <p className={`text-sm ${!notification.read ? "font-semibold text-gray-900" : "font-medium text-gray-800"}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTimeAgo(notification.createdAt)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
          >
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              A
            </div>
            <span className="text-sm font-medium text-gray-800 hidden md:block">Admin</span>
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* User Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Thông tin cá nhân
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Cài đặt
              </button>
              <div className="border-t border-gray-200 my-2"></div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;