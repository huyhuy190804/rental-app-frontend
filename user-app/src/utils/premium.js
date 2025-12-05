// wrstudios-frontend/user-app/src/utils/premium.js
// Helper quản lý dữ liệu gói Premium (localStorage mock)

const STORAGE_KEY = "wrstudios_premium_plans";
const PURCHASE_KEY = "wrstudios_premium_purchases";

const defaultPlans = [
  {
    id: "p-basic",
    name: "Premium Basic",
    price: 50000,
    durationDays: 30,
    benefits: ["Đăng tin nổi bật 3 lần", "Hỗ trợ chat cơ bản"],
    maxPostsPerMonth: 5,
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "p-pro",
    name: "Premium Pro",
    price: 120000,
    durationDays: 90,
    benefits: ["Tin nổi bật không giới hạn", "Hỗ trợ ưu tiên", "Lên đầu danh sách tìm kiếm"],
    maxPostsPerMonth: 20,
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "p-elite",
    name: "Premium Elite",
    price: 300000,
    durationDays: 365,
    benefits: ["Tư vấn riêng", "Quảng bá bài viết", "Quà tặng khởi tạo"],
    maxPostsPerMonth: 100,
    active: false,
    createdAt: new Date().toISOString()
  }
];

export function loadPlans() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPlans));
      return defaultPlans;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("loadPlans error", e);
    return defaultPlans;
  }
}

export function savePlans(plans) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  return true;
}

export function addPlan(plan) {
  const plans = loadPlans();
  plans.unshift(plan);
  savePlans(plans);
  return { success: true, plan };
}

export function updatePlan(planId, patch) {
  const plans = loadPlans();
  const idx = plans.findIndex(p => p.id === planId);
  if (idx === -1) return { success: false, message: "Không tìm thấy gói" };
  plans[idx] = { ...plans[idx], ...patch, updatedAt: new Date().toISOString() };
  savePlans(plans);
  return { success: true, plan: plans[idx] };
}

export function deletePlan(planId) {
  let plans = loadPlans();
  plans = plans.filter(p => p.id !== planId);
  savePlans(plans);
  return { success: true };
}

export function togglePlanActive(planId) {
  const plans = loadPlans();
  const idx = plans.findIndex(p => p.id === planId);
  if (idx === -1) return { success: false };
  plans[idx].active = !plans[idx].active;
  savePlans(plans);
  return { success: true, plan: plans[idx] };
}

// PURCHASES (mock) - lưu lịch sử mua gói
export function loadPurchases() {
  try {
    const raw = localStorage.getItem(PURCHASE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addPurchase(purchase) {
  const list = loadPurchases();
  list.unshift(purchase);
  localStorage.setItem(PURCHASE_KEY, JSON.stringify(list));
  return { success: true, purchase };
}

export function exportAllData() {
  return {
    plans: loadPlans(),
    purchases: loadPurchases()
  };
}

export function importAllData(obj) {
  if (obj?.plans) localStorage.setItem(STORAGE_KEY, JSON.stringify(obj.plans));
  if (obj?.purchases) localStorage.setItem(PURCHASE_KEY, JSON.stringify(obj.purchases));
  return { success: true };
}
