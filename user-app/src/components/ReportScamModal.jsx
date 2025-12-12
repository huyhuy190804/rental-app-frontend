// wrstudios-frontend/user-app/src/components/ReportScamModal.jsx - NEW FILE
import React, { useState } from "react";
import { getCurrentUser } from "../utils/auth";
import { showSuccess, showError, showWarning } from "../utils/toast";

const ReportScamModal = ({ isOpen, onClose, post }) => {
  const [reason, setReason] = useState("");
  const [evidence, setEvidence] = useState([]);
  const [uploading, setUploading] = useState(false);
  const currentUser = getCurrentUser();

  if (!isOpen) return null;

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (evidence.length + files.length > 5) {
      showWarning("Tối đa 5 ảnh bằng chứng!");
      return;
    }

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        showWarning(`File ${file.name} quá lớn! Tối đa 5MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setEvidence((prev) => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    setEvidence((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason.trim()) {
      showWarning("Vui lòng mô tả lý do báo cáo!");
      return;
    }

    if (evidence.length === 0) {
      showWarning("Vui lòng cung cấp ít nhất 1 ảnh bằng chứng!");
      return;
    }

    setUploading(true);

    try {
      // TODO: Call API to submit report
      // const result = await submitScamReport(post.id, reason, evidence);
      
      // Mock success
      await new Promise((r) => setTimeout(r, 1000));
      
      showSuccess("Đã gửi báo cáo! Chúng tôi sẽ xem xét trong 24h.");
      onClose();
    } catch (error) {
      showError("Lỗi khi gửi báo cáo!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[80] p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Báo cáo lừa đảo</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Post Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Bài viết:</p>
            <p className="font-semibold text-gray-900">{post.title}</p>
            <p className="text-xs text-gray-500 mt-1">Tác giả: {post.authorName}</p>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lý do báo cáo <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Mô tả chi tiết lý do bạn nghi ngờ đây là lừa đảo..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              rows={4}
              required
            />
          </div>

          {/* Evidence Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bằng chứng (ảnh) <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-500 transition">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="evidence-upload"
              />
              <label htmlFor="evidence-upload" className="cursor-pointer">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm text-gray-600">
                  Click để tải ảnh bằng chứng
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Tối đa 5 ảnh, mỗi ảnh &lt; 5MB
                </p>
              </label>
            </div>

            {/* Evidence Preview */}
            {evidence.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {evidence.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={img}
                      alt={`Evidence ${idx + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Warning */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-orange-800">
                <p className="font-semibold mb-1">Lưu ý:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Báo cáo sai có thể bị xử lý</li>
                  <li>Cung cấp bằng chứng rõ ràng</li>
                  <li>Chúng tôi sẽ xem xét trong 24h</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={uploading || !reason.trim() || evidence.length === 0}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? "Đang gửi..." : "Gửi báo cáo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportScamModal;