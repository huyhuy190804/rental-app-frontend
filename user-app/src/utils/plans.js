// wrstudios-frontend/user-app/src/utils/plans.js
// Quản lý plans lưu trên localStorage và phát event 'plansChange' khi thay đổi

const STORAGE_KEY = "wr_plans";

// Giá trị mẫu mặc định (chỉ dùng nếu localStorage rỗng)
const DEFAULT_PLANS = [
  {
    id: "basic",
    name: "Basic",
    description: "Phù hợp cho chủ nhà cá nhân",
    price: 299000, // giá lưu là số (VNĐ) — hiển thị / nhập sẽ xử lý
    features: [
      "Đăng tối đa 3 tin cho thuê/tháng",
      "Tối đa 5 hình ảnh/tin đăng",
      "Hiển thị tin trong 30 ngày"
    ],
    iconBg: "bg-blue-500",
    popular: false
  },
  {
    id: "premium",
    name: "Premium",
    description: "Lựa chọn tốt nhất cho môi giới",
    price: 799000,
    features: [
      "Đăng không giới hạn tin cho thuê",
      "Tối đa 20 hình ảnh + 1 video/tin",
      "Hiển thị ưu tiên trang chủ"
    ],
    iconBg: "bg-pink-500",
    popular: true
  },
  {
    id: "vip",
    name: "VIP",
    description: "Dành cho công ty bất động sản",
    price: 1499000,
    features: [
      "Tất cả tính năng Premium",
      "Tin luôn ở vị trí TOP 3 trang chủ",
      "Không giới hạn hình ảnh & video"
    ],
    iconBg: "bg-purple-500",
    popular: false
  }
];

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // khởi tạo mặc định
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PLANS));
      return DEFAULT_PLANS.slice();
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("Invalid plans");
    return parsed;
  } catch (err) {
    console.error("Lỗi đọc plans từ localStorage:", err);
    // fallback
    return DEFAULT_PLANS.slice();
  }
}

function writeStorage(plans) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
    // Phát event để những trang khác lắng nghe cập nhật
    window.dispatchEvent(new CustomEvent("plansChange", { detail: { time: Date.now() } }));
    return true;
  } catch (err) {
    console.error("Lỗi lưu plans vào localStorage:", err);
    return false;
  }
}

export const getPlans = () => {
  return readStorage();
};

export const savePlans = (plans) => {
  return writeStorage(plans);
};

export const addPlan = (plan) => {
  const plans = readStorage();
  // tạo id đơn giản nếu chưa có
  const id = plan.id || `${plan.name.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`;
  const newPlan = { ...plan, id };
  plans.push(newPlan);
  const ok = writeStorage(plans);
  return { success: ok, plan: newPlan };
};

export const updatePlan = (id, updates) => {
  const plans = readStorage();
  const idx = plans.findIndex(p => p.id === id);
  if (idx === -1) return { success: false, message: "Không tìm thấy gói" };
  plans[idx] = { ...plans[idx], ...updates };
  const ok = writeStorage(plans);
  return { success: ok, plan: plans[idx] };
};

export const deletePlan = (id) => {
  let plans = readStorage();
  const exists = plans.some(p => p.id === id);
  if (!exists) return { success: false, message: "Không tìm thấy gói" };
  plans = plans.filter(p => p.id !== id);
  const ok = writeStorage(plans);
  return { success: ok };
};

// reset (chỉ dev) — không dùng mặc định, nhưng tiện debug
export const resetPlansToDefault = () => {
  const ok = writeStorage(DEFAULT_PLANS.slice());
  return { success: ok };
};
