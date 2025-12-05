// wrstudios-frontend/user-app/src/admin_components/AdminPremiumPage.jsx
import React, { useEffect, useState } from "react";
import AdminHeader from "./AdminHeader";
import AdminNavBar from "./AdminNavBar";
import PremiumIcon from "../components/PremiumIcon";
import { getPlans, addPlan, updatePlan, deletePlan } from "../utils/plans";
import { membershipAPI } from "../utils/api";
import { formatCurrency } from "../utils/format";
// --- THÊM IMPORT NÀY ---
import { getTransactions, updateTransactionStatus } from "../utils/transactions";

const emptyPlanTemplate = {
  name: "",
  description: "",
  price: "",
  duration: 30,
  post_limit: 10,
  iconBg: "bg-pink-500",
  popular: false,
};

const AdminPremiumPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [plans, setPlans] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [form, setForm] = useState(emptyPlanTemplate);
  const [error, setError] = useState("");

  // --- STATE MỚI CHO BẢNG GIAO DỊCH ---
  const [transactions, setTransactions] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    loadData();
    // Lắng nghe sự kiện storage để auto-update khi có đơn mới
    const handleStorageChange = () => loadData();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("plansChange", loadData);
    
    return () => {
        window.removeEventListener("storage", handleStorageChange);
        window.removeEventListener("plansChange", loadData);
    };
  }, []);

  // Load from backend membership packages; fallback to local plans if API fails
  const loadData = async () => {
    // load plans from backend
    try {
      const res = await membershipAPI.getAll();
      if (res && res.success && Array.isArray(res.data)) {
        // Map backend package shape to UI-friendly plan objects
        const mapped = res.data.map((p) => ({
          id: p.ms_id,
          name: p.name,
          description: p.description,
          price: p.price,
          duration: p.duration,
          post_limit: p.post_limit,
          iconBg: "bg-pink-500",
          popular: false,
        }));
        setPlans(mapped);
      } else {
        // Fallback to local storage plans
        setPlans(getPlans());
      }
    } catch (err) {
      // fallback
      setPlans(getPlans());
    }

    // transactions (legacy)
    setTransactions(getTransactions());
  };

  const loadPlans = () => { // kept for compatibility
    loadData();
  };

  // --- LOGIC XỬ LÝ DUYỆT ĐƠN ---
  const handleTransactionAction = (id, status) => {
    const actionName = status === "approved" ? "Duyệt" : "Từ chối";
    if (!window.confirm(`Xác nhận ${actionName} yêu cầu này?`)) return;

    const res = updateTransactionStatus(id, status);
    if (res.success) {
      alert(`✅ Đã ${actionName} thành công!`);
      loadData();
    }
  };

  // --- LOGIC CŨ CỦA BẠN (GIỮ NGUYÊN) ---
  const openAddModal = () => {
    setEditingPlan(null); setForm(emptyPlanTemplate); setError(""); setIsModalOpen(true);
  };

  const openEditModal = (plan) => {
    setEditingPlan(plan);
    setForm({
      name: plan.name || "",
      description: plan.description || "",
      price: plan.price != null ? String(plan.price) : "",
      duration: plan.duration || 30,
      post_limit: plan.post_limit || 10,
      iconBg: plan.iconBg || "bg-pink-500",
      popular: !!plan.popular,
    });
    setError(""); setIsModalOpen(true);
  };

  const handleRemovePlan = async (plan) => {
    if (!window.confirm(`Xóa gói "${plan.name}"?`)) return;
    try {
      // If plan came from backend it has id = ms_id
      const res = await membershipAPI.delete(plan.id);
      if (res && res.success) {
        alert("✅ Đã xóa gói."); loadData();
      } else {
        // fallback to local delete
        const r2 = deletePlan(plan.id);
        if (r2.success) { alert("✅ Đã xóa gói (local)."); loadData(); } else { alert("❌ Xóa thất bại: " + (res.message || r2.message || "Lỗi")); }
      }
    } catch (err) {
      alert("❌ Xóa thất bại: " + err.message);
    }
  };

  const handleFeatureChange = (idx, value) => {
    setForm((prev) => { const next = { ...prev }; next.features = prev.features.slice(); next.features[idx] = value; return next; });
  };
  const addFeatureInput = () => setForm((prev) => ({ ...prev, features: [...prev.features, ""] }));
  const removeFeatureInput = (idx) => setForm((prev) => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }));
  
  const parsePrice = (raw) => {
    if (raw === "" || raw === null || raw === undefined) return null;
    const numeric = String(raw).replace(/[.,\s]/g, "");
    const n = parseInt(numeric, 10);
    return Number.isFinite(n) ? n : null;
  };

  const handleSubmit = (e) => {
    e.preventDefault(); setError("");
    if (!form.name.trim()) { setError("Vui lòng nhập tên gói."); return; }
    const priceNumber = parsePrice(form.price);
    if (priceNumber === null || priceNumber <= 0) { setError("Vui lòng nhập giá hợp lệ (số dương)."); return; }

    // Build payload for backend membership_packages
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: priceNumber,
      duration: parseInt(form.duration || 30, 10) || 30,
      post_limit: parseInt(form.post_limit || 10, 10) || 10,
    };

    (async () => {
      try {
        if (editingPlan) {
          const res = await membershipAPI.update(editingPlan.id, payload);
          if (res && res.success) { alert("✅ Cập nhật gói thành công."); setIsModalOpen(false); loadData(); } else { setError((res && res.message) || "Cập nhật thất bại."); }
        } else {
          const res = await membershipAPI.create(payload);
          if (res && res.success) { alert("✅ Thêm gói thành công."); setIsModalOpen(false); loadData(); } else { setError((res && res.message) || "Thêm thất bại."); }
        }
      } catch (err) {
        setError(err.message || "Lỗi mạng");
      }
    })();
  };

  // Filter cho bảng giao dịch
  const filteredTransactions = transactions.filter(t => filterStatus === "all" ? true : t.status === filterStatus);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <AdminNavBar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-2 mb-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all text-orange-600 font-semibold border border-orange-200">
              <PremiumIcon className="w-6 h-6" variant="premium" />
              <span>Quản lý gói thành viên</span>
            </button>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Quản lý gói Premium</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Thêm / sửa / xóa gói — thay đổi sẽ được áp dụng cho trang Premium.</p>
        </div>

        <div className="flex justify-end mb-8">
          <button onClick={openAddModal} className="px-6 py-3 bg-gradient-to-r from-orange-500 via-orange-500 to-red-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all font-semibold">
            + Thêm gói mới
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.length === 0 ? (
            <div className="col-span-3 text-center text-gray-500">Chưa có gói nào được cấu hình.</div>
          ) : (
            plans.map((plan) => {
              const getIconVariant = (planName) => {
                const name = planName?.toLowerCase() || "";
                if (name.includes("gold")) return "gold";
                if (name.includes("basic")) return "basic";
                if (name.includes("vip")) return "vip";
                return "premium";
              };
              const variant = getIconVariant(plan.name);
              const colors = {
                basic: { border: "border-blue-500", bg: "bg-gradient-to-br from-blue-500 to-blue-600", badge: "from-blue-500 to-blue-600", button: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700", check: "text-blue-500", price: "from-blue-600 to-blue-700" },
                premium: { border: "border-orange-500", bg: "bg-gradient-to-br from-amber-500 to-red-500", badge: "from-amber-500 via-orange-500 to-red-500", button: "from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600", check: "text-orange-500", price: "from-orange-600 to-red-600" },
                vip: { border: "border-purple-500", bg: "bg-gradient-to-br from-purple-500 to-purple-600", badge: "from-purple-500 to-purple-600", button: "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700", check: "text-purple-500", price: "from-purple-600 to-purple-700" },
                gold: { border: "border-yellow-500", bg: "bg-gradient-to-br from-yellow-400 to-amber-500", badge: "from-yellow-400 to-amber-500", button: "from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600", check: "text-yellow-500", price: "from-yellow-600 to-amber-600" },
              };
              const color = colors[variant];

              return (
                <div key={plan.id} className={`relative bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-2xl ${plan.popular ? `border-2 ${color.border} transform scale-105` : "border border-gray-200"}`}>
                  {plan.popular && <div className={`absolute -top-4 right-4 bg-gradient-to-r ${color.badge} text-white px-4 py-1 rounded-full text-xs font-semibold shadow-lg`}>Phổ biến nhất</div>}
                  <div className={`${color.bg} w-20 h-20 rounded-2xl flex items-center justify-center text-white mb-6 mx-auto shadow-lg`}><PremiumIcon className="w-12 h-12" variant={variant} /></div>
                  <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-center mb-6 text-sm">{plan.description}</p>
                  <div className="text-center mb-6"><span className={`text-4xl font-bold bg-gradient-to-r ${color.price} bg-clip-text text-transparent`}>{formatCurrency(plan.price)}</span><span className="text-gray-600 ml-2">₫/tháng</span></div>
                  <div className="space-y-4 mb-8">
                    {plan.features && plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3"><svg className={`w-5 h-5 ${color.check} flex-shrink-0 mt-0.5`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg><div className="text-sm text-gray-700">{feature}</div></div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(plan)} className={`flex-1 py-2 rounded-lg font-semibold transition-all duration-200 bg-gradient-to-r ${color.button} text-white shadow-lg hover:shadow-2xl hover:scale-105 hover:-translate-y-1`}>Chỉnh sửa</button>
                    <button onClick={() => handleRemovePlan(plan)} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition">Xóa</button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="text-center text-gray-600 text-sm mb-12">
          <p>Tất cả các gói đều có thể sửa hoặc xóa bất cứ lúc nào</p>
        </div>

        {/* --- PHẦN MỚI THÊM: BẢNG DUYỆT YÊU CẦU --- */}
        <hr className="border-t-2 border-gray-200 mb-12" />
        
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Duyệt yêu cầu nâng cấp</h2>
              <p className="text-gray-600">Danh sách các giao dịch cần xác nhận từ người dùng.</p>
            </div>
            <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
              {["all", "pending", "approved", "rejected"].map(st => (
                  <button key={st} onClick={() => setFilterStatus(st)} className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-all ${filterStatus === st ? "bg-gray-800 text-white shadow" : "text-gray-600 hover:bg-gray-100"}`}>
                      {st === 'all' ? 'Tất cả' : st === 'pending' ? 'Chờ duyệt' : st === 'approved' ? 'Đã duyệt' : 'Đã hủy'}
                  </button>
              ))}
            </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                            <th className="px-6 py-4">Mã GD / Ngày</th>
                            <th className="px-6 py-4">Tài khoản</th>
                            <th className="px-6 py-4">Gói & Số tiền</th>
                            <th className="px-6 py-4">Nội dung CK</th>
                            <th className="px-6 py-4 text-center">Trạng thái</th>
                            <th className="px-6 py-4 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredTransactions.length === 0 ? (
                            <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">Chưa có giao dịch nào.</td></tr>
                        ) : filteredTransactions.map((trx) => (
                            <tr key={trx.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-gray-900 text-xs">{trx.id}</div>
                                    <div className="text-xs text-gray-500 mt-1">{new Date(trx.date).toLocaleString()}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-bold text-gray-800">{trx.userAccount}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-orange-600 font-bold">{trx.planName}</div>
                                    <div className="text-sm font-mono text-gray-600">{trx.currency === 'USD' ? `$${trx.amount}` : formatCurrency(trx.amount) + ' ₫'}</div>
                                    <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 border rounded text-gray-500 mt-1 inline-block">{trx.method}</span>
                                </td>
                                <td className="px-6 py-4 max-w-xs">
                                    <div className="p-2 bg-gray-50 rounded border border-gray-200 text-xs font-mono text-gray-600 break-all">{trx.content}</div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {trx.status === 'pending' && <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">Chờ duyệt</span>}
                                    {trx.status === 'approved' && <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">Đã duyệt</span>}
                                    {trx.status === 'rejected' && <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-bold">Đã hủy</span>}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {trx.status === 'pending' ? (
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => handleTransactionAction(trx.id, 'approved')} className="bg-green-500 text-white px-3 py-1.5 rounded shadow hover:bg-green-600 text-xs font-bold">Duyệt</button>
                                            <button onClick={() => handleTransactionAction(trx.id, 'rejected')} className="bg-red-50 text-red-600 px-3 py-1.5 rounded hover:bg-red-100 text-xs font-bold">Hủy</button>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 text-xs italic">Đã xử lý</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>

      {/* Modal Add / Edit (Giữ nguyên) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{editingPlan ? "Chỉnh sửa gói" : "Thêm gói mới"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-800">Đóng</button>
            </div>
            {error && <div className="mb-3 p-3 bg-red-50 text-red-700 rounded">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700">Tên gói</label><input className="w-full mt-1 px-4 py-2 border rounded-lg" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}/></div>
              <div><label className="block text-sm font-medium text-gray-700">Mô tả ngắn</label><input className="w-full mt-1 px-4 py-2 border rounded-lg" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}/></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700">Giá (VNĐ)</label><input className="w-full mt-1 px-4 py-2 border rounded-lg" value={form.price} onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))} placeholder="VD: 799000" inputMode="numeric"/></div>
                <div><label className="block text-sm font-medium text-gray-700">Màu icon (class)</label><input className="w-full mt-1 px-4 py-2 border rounded-lg" value={form.iconBg} onChange={(e) => setForm((prev) => ({ ...prev, iconBg: e.target.value }))} placeholder="VD: bg-pink-500"/></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tính năng</label>
                <div className="space-y-2">{form.features.map((f, idx) => (<div key={idx} className="flex gap-2"><input className="flex-1 px-3 py-2 border rounded-lg" value={f} onChange={(e) => handleFeatureChange(idx, e.target.value)} /><button type="button" onClick={() => removeFeatureInput(idx)} className="px-3 py-2 bg-red-50 text-red-600 rounded">X</button></div>))}</div>
                <div className="mt-2"><button type="button" onClick={addFeatureInput} className="px-3 py-2 bg-gray-100 rounded">+ Thêm tính năng</button></div>
              </div>
              <div className="flex items-center gap-4"><label className="flex items-center gap-2"><input type="checkbox" checked={!!form.popular} onChange={(e) => setForm((prev) => ({ ...prev, popular: e.target.checked }))}/><span className="text-sm">Đánh dấu là "Phổ biến"</span></label></div>
              <div className="flex gap-3"><button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border rounded">Hủy</button><button type="submit" className="flex-1 px-4 py-2 bg-pink-500 text-white rounded">Lưu</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPremiumPage;