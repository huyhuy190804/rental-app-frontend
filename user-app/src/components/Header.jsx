// wrstudios-frontend/user-app/src/components/Header.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PremiumIcon from "./PremiumIcon";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import UserProfileModal from "./UserProfileModal";
import CreatePostModal from "./CreatePostModal";
import MyArticleModal from "./MyArticleModal";

const Header = ({ currentUser, onLoginSuccess, onLogout }) => {
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isMyArticleModalOpen, setIsMyArticleModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

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

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    if (!isDropdownOpen) return;

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    // Delay để tránh click ngay lập tức đóng dropdown
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    if (e) {
      e.preventDefault();
    }
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(e);
    }
  };

  // Xử lý logout
  const handleLogout = () => {
    setIsDropdownOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50 relative">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
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
              📢 Chào mừng bạn đến với WRStudios — Nền tảng căn hộ uy tín và
              nhanh chóng! 🏡✨
            </div>
          </div>

          {/* Search + Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 min-w-[200px]">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyPress}
                className="bg-transparent outline-none text-sm text-gray-700 placeholder-gray-500 w-full min-w-[150px]"
              />
            </div>

            <button
              onClick={handleSearch}
              type="button"
              className="bg-red-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-700 transition whitespace-nowrap"
            >
              Tìm kiếm
            </button>

            {/* Nút Bài viết */}
            <Link to="/posts">
              <button className="text-gray-800 text-sm px-3 py-2 font-medium hover:text-red-600 transition">
                Bài viết
              </button>
            </Link>

            {/* Nút Premium - ICON MỚI - Chỉ hiện khi đã login */}
            {currentUser && (
              <Link to="/premium">
                <button className="flex items-center gap-2 text-white bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 px-4 py-2 rounded-lg text-sm font-medium hover:from-amber-600 hover:via-orange-600 hover:to-red-600 transition shadow-md hover:shadow-lg">
                  <PremiumIcon className="w-5 h-5" />
                  <span>Membership</span>
                </button>
              </Link>
            )}

            {/* Nếu đã login */}
            {currentUser ? (
              <>
                {/* Avatar với Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDropdownOpen((prev) => !prev);
                    }}
                    type="button"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer bg-transparent border-none outline-none"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                      {currentUser.accountName?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <span className="text-sm font-medium text-gray-800 hidden md:block whitespace-nowrap">
                      {currentUser.accountName || "User"}
                    </span>
                    <svg
                      className={`w-4 h-4 text-gray-600 transition-transform duration-200 flex-shrink-0 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div
                      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[9999]"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        boxShadow:
                          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                      }}
                    >
                      {/* User Info Section */}
                      <div className="px-4 py-3 bg-gradient-to-r from-pink-50 to-red-50 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center text-white font-semibold text-base shadow-md">
                            {currentUser.accountName
                              ?.charAt(0)
                              ?.toUpperCase() || "U"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {currentUser.accountName || "User"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {currentUser.email || ""}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <button
                          onClick={() => {
                            setIsProfileModalOpen(true);
                            setIsDropdownOpen(false);
                          }}
                          type="button"
                          className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-red-50 flex items-center gap-3 cursor-pointer transition-all duration-200 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-pink-100 flex items-center justify-center transition-colors">
                            <svg
                              className="w-4 h-4 text-gray-600 group-hover:text-pink-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                          <span className="flex-1">My Profile</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsMyArticleModalOpen(true);
                            setIsDropdownOpen(false);
                          }}
                          type="button"
                          className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-red-50 flex items-center gap-3 cursor-pointer transition-all duration-200 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                            <svg
                              className="w-4 h-4 text-gray-600 group-hover:text-blue-600"
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
                          </div>
                          <span className="flex-1">My Article</span>
                        </button>

                        {/* Premium Link - ICON MỚI */}
                        <Link
                          to="/premium"
                          onClick={() => setIsDropdownOpen(false)}
                          className="block w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 flex items-center gap-3 cursor-pointer transition-all duration-200 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-amber-100 flex items-center justify-center transition-colors">
                            <PremiumIcon className="w-5 h-5" />
                          </div>
                          <span className="flex-1">
                            Membership ---{" "}
                            <span className="font-bold text-orange-600">
                              {currentUser?.membershipTier || "Free"}
                            </span>
                          </span>
                        </Link>

                        {/* Dashboard - Chỉ hiện cho admin trong dropdown */}
                        {currentUser.accountType === "Admin" && (
                          <Link
                            to="/admin"
                            onClick={() => setIsDropdownOpen(false)}
                            className="block w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 flex items-center gap-3 cursor-pointer transition-all duration-200 group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                              <svg
                                className="w-4 h-4 text-gray-600 group-hover:text-blue-600"
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
                            </div>
                            <span className="flex-1">Dashboard</span>
                          </Link>
                        )}
                      </div>

                      {/* Divider */}
                      <div className="border-t border-gray-100 my-1"></div>

                      {/* Logout */}
                      <div className="py-2">
                        <button
                          onClick={() => {
                            handleLogout();
                          }}
                          type="button"
                          className="w-full px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 flex items-center gap-3 cursor-pointer transition-all duration-200 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
                            <svg
                              className="w-4 h-4 text-red-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                          </div>
                          <span className="flex-1">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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
                className="bg-white text-rose-500 border border-rose-100 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:text-white hover:bg-gradient-to-r hover:from-pink-500 hover:to-rose-500 hover:border-transparent transition-all duration-200"
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

      <MyArticleModal
        isOpen={isMyArticleModalOpen}
        onClose={() => setIsMyArticleModalOpen(false)}
      />
    </>
  );
};

export default Header;
