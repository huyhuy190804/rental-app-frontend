import React, { useState } from "react";

const UserDetailModal = ({ isOpen, onClose, user }) => {
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen || !user) return null;

  const getUserPassword = () => {
    try {
      const users = JSON.parse(localStorage.getItem("wrstudios_users") || "[]");
      const foundUser = users.find(u => u.id === user.id);
      return foundUser?.password || "••••••••••";
    } catch {
      return "••••••••••";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-pink-100 via-purple-50 to-blue-50"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-200 rounded-full opacity-30 blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-200 rounded-full opacity-30 blur-2xl"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition z-10 bg-white rounded-full p-2 shadow-md"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header Section */}
        <div className="relative pt-8 pb-6 px-6 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-1">Your Profile</h2>
          <p className="text-sm text-gray-500">View and manage your account details.</p>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-4 relative z-10">
          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <input
                type="email"
                value={user.email}
                readOnly
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 focus:outline-none"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
              Phone Number
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </span>
              <input
                type="tel"
                value={user.phoneNumber}
                readOnly
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 focus:outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={showPassword ? getUserPassword() : "••••••••••"}
                readOnly
                className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Account Type & Status - Side by side */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-3 border border-yellow-200">
              <p className="text-xs font-medium text-gray-600 mb-1">Account Type</p>
              <p className="text-sm font-bold text-yellow-800">
                {user.accountType === "Premium" || user.accountType === "Admin" ? "⭐ " : "👤 "}
                {user.accountType || "Member"}
              </p>
            </div>
            <div className={`rounded-xl p-3 border ${
              user.status === "Đang hoạt động" 
                ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200" 
                : "bg-gradient-to-br from-red-50 to-pink-50 border-red-200"
            }`}>
              <p className="text-xs font-medium text-gray-600 mb-1">Status</p>
              <p className={`text-sm font-bold ${
                user.status === "Đang hoạt động" ? "text-green-800" : "text-red-800"
              }`}>
                {user.status || "Active"}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">Total Posts</p>
                <p className="text-2xl font-bold text-purple-800">{user.postsCount || 0}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">Joined Date</p>
                <p className="text-sm font-semibold text-gray-800">{formatDate(user.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Update Profile Button */}
          <button
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3.5 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition shadow-lg hover:shadow-xl mt-6"
          >
            Update Profile
          </button>

          {/* Logout Link */}
          <button
            onClick={onClose}
            className="w-full text-gray-600 hover:text-gray-800 py-2 text-sm font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;