// wrstudios-frontend/user-app/src/components/ManagePlanModal.jsx
import React, { useState, useEffect } from "react";

const ManagePlanModal = ({ isOpen, onClose, onSave, plan }) => {
  const [form, setForm] = useState({
    id: "",
    name: "",
    price: "",
    durationDays: 30,
    benefits: "",
    maxPostsPerMonth: 5,
    active: true
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (plan) {
      setForm({
        ...plan,
        price: plan.price?.toString() || "",
        benefits: (plan.benefits || []).join("\n")
      });
    } else {
      setForm({
        id: "",
        name: "",
        price: "",
        durationDays: 30,
        benefits: "",
        maxPostsPerMonth: 5,
        active: true
      });
    }
    setError("");
  }, [plan, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) { setError("Tên gói không được để trống"); return; }
    const price = parseInt(form.price?.toString().replace(/\D/g, "") || "0", 10);
    if (!price || price <= 0) { setError("Giá phải là số dương"); return; }
    const duration = parseInt(form.durationDays, 10);
    if (!duration || duration <= 0) { setError("Thời hạn phải > 0"); return; }
    const maxPosts = parseInt(form.maxPostsPerMonth, 10) || 0;
    const benefits = form.benefits.split("\n").map(s => s.trim()).filter(Boolean);

    const payload = {
      id: form.id || `p-${Date.now()}`,
      name: form.name.trim(),
      price,
      durationDays: duration,
      benefits,
      maxPostsPerMonth: maxPosts,
      active: !!form.active,
      createdAt: form.id ? plan.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 overflow-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">{plan ? "Sửa gói Premium" : "Tạo gói Premium mới"}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        {error && <div className="mb-3 p-2 text-sm bg-red-50 text-red-600 border border-red-100 rounded">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Tên gói</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full px-3 py-2 border rounded mt-1" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Giá (VNĐ)</label>
              <input name="price" value={form.price} onChange={handleChange} className="w-full px-3 py-2 border rounded mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Thời hạn (ngày)</label>
              <input type="number" name="durationDays" value={form.durationDays} onChange={handleChange} className="w-full px-3 py-2 border rounded mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Số bài / tháng</label>
              <input type="number" name="maxPostsPerMonth" value={form.maxPostsPerMonth} onChange={handleChange} className="w-full px-3 py-2 border rounded mt-1" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Lợi ích (mỗi dòng 1 lợi ích)</label>
            <textarea name="benefits" value={form.benefits} onChange={handleChange} rows={4} className="w-full px-3 py-2 border rounded mt-1" />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="active" checked={!!form.active} onChange={handleChange} />
              <span className="text-sm text-gray-700">Kích hoạt</span>
            </label>
            <div className="flex-1"></div>
            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Hủy</button>
              <button type="submit" className="px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded">Lưu</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManagePlanModal;