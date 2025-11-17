import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import UserProfileModal from "./UserProfileModal";
import CreatePostModal from "./CreatePostModal";

const Header = ({ currentUser, onLoginSuccess, onLogout }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);

  const handleLogoClick = () => {
    window.location.href = "/";
  };

  const switchToRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const switchToLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleCreatePostSuccess = () => {
    alert("Bài viết của bạn đang chờ duyệt!");
  };

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4 overflow-hidden">
          {/* Logo */}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2 cursor-pointer border-none bg-none"
          >
            <div className="bg-red-600 text-white w-9 h-9 rounded flex items-center justify-center text-lg">
              🏠
            </div>
            <p className="font-semibold text-red-600 text-base">WRStudios</p>
          </button>

          {/* Marquee */}
          <div className="flex-1 flex justify-center overflow-hidden relative">
            <div className="whitespace-nowrap animate-marquee text-gray-700 font-medium text-sm">
              📢 Chào mừng bạn đến với WRStudios — Nền tảng căn hộ uy tín và nhanh chóng! 🏡✨
            </div>
          </div>

          {/* Search + Buttons */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center bg-gray-100 rounded-lg px-3 py-2">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="bg-transparent outline-none text-sm text-gray-700 placeholder-gray-500 w-48"
              />
            </div>

            <button className="bg-red-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-700 transition">
              Tìm kiếm
            </button>

            {/* Nút Bài viết */}
            <Link to="/posts">
              <button className="text-gray-800 text-sm px-3 py-2 font-medium hover:text-red-600 transition">
                Bài viết
              </button>
            </Link>

            {/* Nếu đã login */}
            {currentUser ? (
              <>
                {/* Admin Dashboard */}
                {currentUser.accountType === "Admin" && (
                  <Link to="/admin">
                    <button className="text-white bg-blue-600 px-3 py-2 rounded text-sm font-medium hover:bg-blue-700 transition">
                      &gt;&gt; Dashboard
                    </button>
                  </Link>
                )}

                {/* Avatar */}
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {currentUser.accountName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-800 hidden md:block">
                    {currentUser.accountName}
                  </span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="text-gray-800 text-sm px-3 py-2 font-medium hover:text-red-600 transition"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="text-gray-800 text-sm px-3 py-2 font-medium hover:text-red-600 transition"
                >
                  Đăng ký
                </button>
              </>
            )}

            {/* Nút Đăng tin - Chỉ hiện khi đã login */}
            {currentUser && (
              <button
                onClick={() => setIsCreatePostModalOpen(true)}
                className="bg-red-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-700 transition"
              >
                Đăng tin
              </button>
            )}
          </div>
        </div>
      </header>

      {/* CSS Animation */}
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 22s linear infinite;
        }
      `}</style>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={switchToRegister}
        onLoginSuccess={onLoginSuccess}
      />

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSwitchToLogin={switchToLogin}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        onSuccess={handleCreatePostSuccess}
      />
    </>
  );
};

export default Header;