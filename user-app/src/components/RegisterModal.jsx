//wrstudios-frontend/user-app/src/components/RegisterModal.jsx
import React, { useState } from "react";
import { registerUser } from "../utils/auth";
import { showSuccess } from "../utils/toast";

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    accountName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  if (!isOpen) return null;

  // Validation functions
  const validateAccountName = (accountName) => {
    // Chỉ cho phép chữ và số
    const accountNameRegex = /^[a-zA-Z0-9]+$/;
    if (!accountNameRegex.test(accountName)) {
      return "Tên đăng nhập chỉ được phép chứa chữ và số, không có ký tự đặc biệt!";
    }
    return null;
  };

  const validateEmail = (email) => {
    // Cho phép chữ, số và dấu @, domain không chứa ký tự đặc biệt
    const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+$/;
    if (!emailRegex.test(email)) {
      return "Email chỉ được phép chứa chữ, số và đúng định dạng với dấu @!";
    }
    return null;
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\d{10,11}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return "Số điện thoại phải có 10 hoặc 11 chữ số!";
    }
    return null;
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Mật khẩu phải có ít nhất 8 ký tự!";
    }

    if (!/[A-Z]/.test(password)) {
      return "Mật khẩu phải có ít nhất 1 chữ in hoa!";
    }

    if (!/[0-9]/.test(password)) {
      return "Mật khẩu phải có ít nhất 1 số!";
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return "Mật khẩu phải có ít nhất 1 ký tự đặc biệt!";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate
    if (
      !formData.accountName ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    // Validate tên đăng nhập
    const accountNameError = validateAccountName(formData.accountName);
    if (accountNameError) {
      setError(accountNameError);
      return;
    }

    // Validate email
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setError(emailError);
      return;
    }

    // Validate số điện thoại
    const phoneError = validatePhoneNumber(formData.phoneNumber);
    if (phoneError) {
      setError(phoneError);
      return;
    }

    // Validate mật khẩu
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      // Đăng ký - gọi backend API
      const result = await registerUser({
        accountName: formData.accountName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
      });

      if (result.success) {
        showSuccess(result.message);
        // Reset form
        setFormData({
          accountName: "",
          email: "",
          phoneNumber: "",
          password: "",
          confirmPassword: "",
        });
        // Chuyển sang modal đăng nhập
        onSwitchToLogin();
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("Lỗi: " + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Decorative Circles */}
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-pink-200 rounded-full opacity-50"></div>
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-pink-200 rounded-full opacity-50"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition z-10"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-6 relative z-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Create Your Account
          </h2>
          <p className="text-sm text-gray-600">
            Get access to exclusive listings
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm relative z-10">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="relative z-10">
          {/* Account Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Name
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Enter your account name"
                value={formData.accountName}
                onChange={(e) =>
                  setFormData({ ...formData, accountName: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Chỉ cho phép chữ cái và số, không có ký tự đặc biệt
            </p>
          </div>

          {/* Email Address */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </span>
              <input
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Email chỉ được chứa chữ, số và dấu @ với định dạng hợp lệ (ví dụ:
              ten@gmail.com)
            </p>
          </div>

          {/* Phone Number */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
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
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </span>
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Chỉ nhập ký tự số (0-9)
            </p>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
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
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
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
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                )}
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              <p>Mật khẩu phải có:</p>
              <ul className="list-disc list-inside ml-2 space-y-0.5">
                <li
                  className={
                    formData.password.length >= 8 ? "text-green-600" : ""
                  }
                >
                  Ít nhất 8 ký tự
                </li>
                <li
                  className={
                    /[A-Z]/.test(formData.password) ? "text-green-600" : ""
                  }
                >
                  Ít nhất 1 chữ in hoa
                </li>
                <li
                  className={
                    /[0-9]/.test(formData.password) ? "text-green-600" : ""
                  }
                >
                  Ít nhất 1 số
                </li>
                <li
                  className={
                    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
                      formData.password
                    )
                      ? "text-green-600"
                      : ""
                  }
                >
                  Ít nhất 1 ký tự đặc biệt
                </li>
              </ul>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
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
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
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
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-lg font-medium hover:from-pink-600 hover:to-red-600 transition shadow-lg"
          >
            Register
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600 mt-6 relative z-10">
          Already have an account?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-pink-500 hover:text-pink-600 font-medium"
          >
            Log In
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterModal;
