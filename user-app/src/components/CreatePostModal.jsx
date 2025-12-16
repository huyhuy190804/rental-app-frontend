// wrstudios-frontend/user-app/src/components/CreatePostModal.jsx
import React, { useState } from "react";
import { getCurrentUser } from "../utils/auth";
import { showSuccess, showWarning, showError } from "../utils/toast";

const CreatePostModal = ({ isOpen, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState("sale"); // "sale" or "article"
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    area: "",
    location: "",
    category: "studio",
    content: "",
    images: [],
  });
  const [error, setError] = useState("");
  const currentUser = getCurrentUser();

  if (!isOpen || !currentUser) return null;

  const formatPriceInput = (value) => {
    if (!value) return "";
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const sanitizeNumber = (value) => value.replace(/\D/g, "");

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.images.length > 20) {
      showWarning("Tối đa 20 ảnh!");
      return;
    }

    Promise.all(
      files.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      })
    ).then((base64Images) => {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...base64Images],
      }));
    });
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.title) {
      setError("Vui lòng nhập tiêu đề!");
      return;
    }

    let normalizedPrice = null;
    let normalizedArea = null;
    const postType = activeTab === "sale" ? "listing" : "article";

    if (activeTab === "sale") {
      normalizedPrice = formData.price ? parseInt(formData.price, 10) : NaN;
      normalizedArea = formData.area ? parseInt(formData.area, 10) : null;

      if (!formData.price || !formData.location) {
        setError("Vui lòng điền đầy đủ thông tin tin bán!");
        return;
      }

      if (!Number.isFinite(normalizedPrice) || normalizedPrice <= 0) {
        setError("Giá phải là số dương hợp lệ!");
        return;
      }

      if (formData.area) {
        if (!Number.isFinite(normalizedArea) || normalizedArea <= 0) {
          setError("Diện tích phải là số dương hợp lệ!");
          return;
        }
      }

      // Listing requires images
      if (formData.images.length === 0) {
        setError("Vui lòng tải lên ít nhất 1 ảnh cho tin bán!");
        return;
      }
    } else {
      // Article - check content and make images optional
      if (!formData.content) {
        setError("Vui lòng nhập nội dung bài viết!");
        return;
      }
    }

    // ✅ GỌI API TRỰC TIẾP - KHÔNG QUA utils/posts.js
    const postData = {
      title: formData.title,
      description: activeTab === "article" ? formData.content : formData.description,
      address: formData.location || null,
      price: normalizedPrice || null,
      area: normalizedArea || null,
      images: formData.images,
      post_type: postType,
      category: postType === "listing" ? formData.category : null,
    };

    console.log("🔍 postData gửi lên backend:", postData);
    console.log("🔍 formData.category hiện tại:", formData.category);
    console.log("🔍 activeTab:", activeTab);
    console.log("🔍 postType:", postType);

    try {
      const token = localStorage.getItem("token");
      
      // ✅ Thay 5000 bằng port backend của bạn (check terminal backend)
      const response = await fetch("http://localhost:4000/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      const result = await response.json();

      if (result.success) {
        showSuccess("Đăng bài thành công!");
        onSuccess();
        window.dispatchEvent(new Event("postCreated"));
        window.dispatchEvent(new Event("membershipChanged"));
        handleClose();
      } else {
        setError(result.message || "Lỗi khi đăng bài");
      }
    } catch (error) {
      console.error("❌ Lỗi khi đăng bài:", error);
      setError("Lỗi: " + error.message);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      area: "",
      location: "",
      category: "studio",
      content: "",
      images: [],
    });
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Tạo bài viết</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
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
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6">
          <button
            onClick={() => setActiveTab("sale")}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition ${
              activeTab === "sale"
                ? "border-red-600 text-red-600"
                : "border-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            Đăng tin
          </button>
          <button
            onClick={() => setActiveTab("article")}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition ${
              activeTab === "article"
                ? "border-red-600 text-red-600"
                : "border-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            Đăng bài viết
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder={
                activeTab === "sale"
                  ? "VD: Studio 25m² giá tốt Q1"
                  : "VD: Kinh nghiệm thuê nhà trọ"
              }
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả ngắn
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Mô tả ngắn gọn về bài đăng..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            />
          </div>

          {/* Sale-specific fields */}
          {activeTab === "sale" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá (VNĐ) *
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formatPriceInput(formData.price)}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: sanitizeNumber(e.target.value),
                      }))
                    }
                    placeholder="VD: 12.000.000"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diện tích (m²)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={formData.area}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        area: sanitizeNumber(e.target.value),
                      })
                    }
                    placeholder="VD: 25"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vị trí *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="VD: Quận 1, TP.HCM"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại hình *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  >
                    <option value="studio">Studio</option>
                    <option value="1bedroom">1 Phòng ngủ</option>
                    <option value="2bedroom">2 Phòng ngủ</option>
                    <option value="hotel">Phòng khách sạn</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Article-specific fields */}
          {activeTab === "article" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nội dung *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Nội dung chi tiết của bài viết..."
                rows={8}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              />
            </div>
          )}

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ảnh {activeTab === "sale" ? "*" : ""} (Tối đa 20 ảnh)
            </label>
            <div className="text-xs text-gray-500 mb-2">
              {activeTab === "sale"
                ? "Bắt buộc tải lên ít nhất 1 ảnh cho tin bán"
                : "Tùy chọn - bài viết có thể không có ảnh"}
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <div className="text-gray-500 mb-2">
                  <svg
                    className="w-12 h-12 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm">Click để tải ảnh lên</p>
                  <p className="text-xs text-gray-400 mt-1">Tối đa 16MB/ảnh</p>
                </div>
              </label>

              {/* Image Preview */}
              {formData.images.length > 0 && (
                <div className="mt-4">
                  <div className="text-sm text-gray-600 mb-3 font-medium">
                    Đã tải {formData.images.length} ảnh
                  </div>
                  <div className="grid grid-cols-4 gap-3 overflow-y-auto max-h-64">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        {idx === 3 && formData.images.length > 4 && (
                          <div className="absolute inset-0 bg-black bg-opacity-60 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                            +{formData.images.length - 4}
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          <svg
                            className="w-3 h-3"
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
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition"
            >
              Đăng bài
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;