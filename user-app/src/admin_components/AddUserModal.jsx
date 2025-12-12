  //wrstudios-frontend/user-app/src/admin_components/AddUserModal.jsx
  import React, { useState } from "react";
import { authAPI } from "../utils/api";
import { addNotification } from "../utils/notifications";
import { showSuccess, showError } from "../utils/toast";

  const AddUserModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
      accountName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      setError("");
    };

    // Validation functions (giống RegisterModal)
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
      setLoading(true);

      // Validate
      if (
        !formData.accountName ||
        !formData.email ||
        !formData.phoneNumber ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        setError("Vui lòng điền đầy đủ thông tin!");
        setLoading(false);
        return;
      }

      // Validate tên đăng nhập
      const accountNameError = validateAccountName(formData.accountName);
      if (accountNameError) {
        setError(accountNameError);
        setLoading(false);
        return;
      }

      // Validate email
      const emailError = validateEmail(formData.email);
      if (emailError) {
        setError(emailError);
        setLoading(false);
        return;
      }

      // Validate số điện thoại
      const phoneError = validatePhoneNumber(formData.phoneNumber);
      if (phoneError) {
        setError(phoneError);
        setLoading(false);
        return;
      }

      // Validate mật khẩu
      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        setError(passwordError);
        setLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Mật khẩu xác nhận không khớp!");
        setLoading(false);
        return;
      }

      try {
        // Call register API directly to avoid overwriting admin token in localStorage
        const result = await authAPI.register(
          {
            name: formData.accountName.trim(),
            email: formData.email.trim(),
            phone: formData.phoneNumber.trim(),
            password: formData.password,
          },
          { skipAuthStore: true } // hint: ignored by backend but signals intention
        );

        if (result?.success) {
          addNotification(
            "user_added",
            `Đã thêm thành viên mới "${formData.accountName.trim()}"`,
            { userId: result.user?.id || result.user?.user_id }
          );
          showSuccess("Thêm thành viên thành công!");
          setFormData({
            accountName: "",
            email: "",
            phoneNumber: "",
            password: "",
            confirmPassword: "",
          });
          if (onSuccess) {
            onSuccess();
          }
          onClose();
        } else {
          const msg = result?.message || "Thêm thành viên thất bại";
          setError(msg);
          showError(msg);
        }
      } catch (err) {
        const msg = err?.message || "Thêm thành viên thất bại";
        setError(msg);
        showError(msg);
      } finally {
        setLoading(false);
      }
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
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
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Thêm thành viên mới
            </h2>
            <p className="text-sm text-gray-600">Tạo tài khoản thành viên mới</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Account Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên tài khoản <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="accountName"
                value={formData.accountName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Nhập tên tài khoản"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="example@email.com"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="0123456789"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Nhập mật khẩu"
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
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Xác nhận mật khẩu"
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

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Đang tạo..." : "Thêm thành viên"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  export default AddUserModal;
