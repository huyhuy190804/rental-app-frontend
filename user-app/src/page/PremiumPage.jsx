
  // wrstudios-frontend/user-app/src/page/PremiumPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import PremiumIcon from "../components/PremiumIcon";
import { getCurrentUser, logoutUser } from "../utils/auth";
import { membershipAPI, usersAPI } from "../utils/api";
import { formatCurrency } from "../utils/format";
import { showError, showWarning, showInfo } from "../utils/toast";

const PremiumPage = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [userMembership, setUserMembership] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    loadPlans();
    if (user) {
      loadUserMembership(user.user_id || user.id);
    }

    const handleAuthChange = () => {
      const updatedUser = getCurrentUser();
      setCurrentUser(updatedUser);
      if (updatedUser) {
        loadUserMembership(updatedUser.user_id || updatedUser.id);
      } else {
        setUserMembership(null);
      }
    };

    // ✅ Listen for post created event to refresh membership
    const handlePostCreated = () => {
      const currentUser = getCurrentUser();
      if (currentUser) {
        loadUserMembership(currentUser.user_id || currentUser.id);
      }
    };

    // ✅ Listen for membership changed event
    const handleMembershipChanged = () => {
      const currentUser = getCurrentUser();
      if (currentUser) {
        loadUserMembership(currentUser.user_id || currentUser.id);
      }
    };

    window.addEventListener("authChange", handleAuthChange);
    window.addEventListener("postCreated", handlePostCreated);
    window.addEventListener("membershipChanged", handleMembershipChanged);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
      window.removeEventListener("postCreated", handlePostCreated);
      window.removeEventListener("membershipChanged", handleMembershipChanged);
    };
  }, []);

  const loadUserMembership = async (userId) => {
    try {
      const result = await usersAPI.getMembership(userId);
      if (result.success && result.data.hasActiveMembership) {
        setUserMembership(result.data);
        
        // Check if membership is expiring soon (within 7 days)
        if (result.data.membership.daysRemaining <= 7 && result.data.membership.daysRemaining > 0) {
          showInfo(`Gói Premium của bạn sẽ hết hạn sau ${result.data.membership.daysRemaining} ngày. Vui lòng gia hạn!`);
        } else if (result.data.membership.daysRemaining <= 0) {
          showWarning("Gói Premium của bạn đã hết hạn. Vui lòng gia hạn để tiếp tục sử dụng!");
        }
      } else {
        setUserMembership(null);
      }
    } catch (error) {
      console.error("Error loading user membership:", error);
      setUserMembership(null);
    }
  };

  const loadPlans = async () => {
    try {
      setLoading(true);
      const result = await membershipAPI.getAll();
      if (result.success) {
        const plans = result.data || [];
        setPlans(plans);
        const premium =
          plans.find((pl) => pl.ms_id === "ms_premium") || plans[0];
        setSelectedPlan(premium ? premium.ms_id : null);
      }
    } catch (error) {
      console.error("Error loading plans:", error);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setUserMembership(null);
    // ✅ Redirect to home page after logout
    navigate("/");
  };

  const handleUpgrade = (planId) => {
    const plan = plans.find((p) => p.ms_id === planId);
    if (!plan) {
      showError("Gói không tồn tại.");
      return;
    }

    if (!currentUser) {
      showWarning("Vui lòng đăng nhập để nâng cấp gói!");
      return;
    }

    navigate("/payment", { state: { plan } });
  };

  // Map plan name to icon variant
  const getIconVariant = (planName) => {
    const name = planName?.toLowerCase() || "";
    if (name.includes("basic")) return "basic";
    if (name.includes("vip")) return "vip";
    if (name.includes("business")) return "vip";
    return "premium";
  };

  // Extract membership tier from plan name
  const getMembershipTier = (planName) => {
    const name = planName?.toLowerCase() || "";
    if (name.includes("basic")) return "Basic";
    if (name.includes("vip")) return "VIP";
    if (name.includes("business")) return "Business";
    if (name.includes("premium")) return "Premium";
    return "Free";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-2 mb-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all text-orange-600 font-semibold border border-orange-200">
              <PremiumIcon className="w-6 h-6" variant="premium" />
              <span>
                {currentUser?.membershipTier &&
                currentUser.membershipTier !== "Free"
                  ? `Tài khoản ${currentUser.membershipTier}`
                  : "Nâng cấp tài khoản"}
              </span>
            </button>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Chọn gói phù hợp với bạn
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tăng hiệu quả đăng tin và tiếp cận nhiều khách hàng hơn
          </p>
          {currentUser?.membershipTier &&
            currentUser.membershipTier !== "Free" && (
              <p className="text-sm text-orange-600 font-semibold mt-3">
                Hiện tại: Membership ---{" "}
                <span className="font-bold">{currentUser.membershipTier}</span>
              </p>
            )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {loading ? (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-500">Đang tải gói...</p>
            </div>
          ) : plans.length === 0 ? (
            <div className="col-span-3 text-center text-gray-500">
              Chưa có gói nào được cấu hình.
            </div>
          ) : (
            plans.map((plan) => {
              const variant = getIconVariant(plan.name);
              // Định nghĩa màu cho từng gói
              const colors = {
                basic: {
                  border: "border-blue-500",
                  bg: "bg-gradient-to-br from-blue-500 to-blue-600",
                  badge: "from-blue-500 to-blue-600",
                  button:
                    "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
                  check: "text-blue-500",
                  price: "from-blue-600 to-blue-700",
                },
                premium: {
                  border: "border-orange-500",
                  bg: "bg-gradient-to-br from-amber-500 to-red-500",
                  badge: "from-amber-500 via-orange-500 to-red-500",
                  button:
                    "from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600",
                  check: "text-orange-500",
                  price: "from-orange-600 to-red-600",
                },
                vip: {
                  border: "border-purple-500",
                  bg: "bg-gradient-to-br from-purple-500 to-purple-600",
                  badge: "from-purple-500 to-purple-600",
                  button:
                    "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
                  check: "text-purple-500",
                  price: "from-purple-600 to-purple-700",
                },
              };
              const color = colors[variant];

              return (
                <div
                  key={plan.ms_id}
                  className={`relative bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-2xl ${
                    plan.popular
                      ? `border-2 ${color.border} transform scale-105`
                      : "border border-gray-200"
                  }`}
                >
                  {plan.popular && (
                    <div
                      className={`absolute -top-4 right-4 bg-gradient-to-r ${color.badge} text-white px-4 py-1 rounded-full text-xs font-semibold shadow-lg`}
                    >
                      Phổ biến nhất
                    </div>
                  )}

                  <div
                    className={`${color.bg} w-20 h-20 rounded-2xl flex items-center justify-center text-white mb-6 mx-auto shadow-lg`}
                  >
                    <PremiumIcon className="w-12 h-12" variant={variant} />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 text-center mb-6 text-sm">
                    {plan.description}
                  </p>

                  <div className="text-center mb-6">
                    <span
                      className={`text-4xl font-bold bg-gradient-to-r ${color.price} bg-clip-text text-transparent`}
                    >
                      {formatCurrency(plan.price)}
                    </span>
                    <span className="text-gray-600 ml-2">₫/tháng</span>
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.description && (
                      <div className="flex items-start gap-3">
                        <svg
                          className={`w-5 h-5 ${color.check} flex-shrink-0 mt-0.5`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div className="text-sm text-gray-700">
                          {plan.post_limit} bài viết/tháng
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleUpgrade(plan.ms_id)}
                    disabled={
                      userMembership?.hasActiveMembership && 
                      userMembership.membership.package_name === plan.name && 
                      !userMembership.canRenew
                    }
                    className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                      userMembership?.hasActiveMembership && 
                      userMembership.membership.package_name === plan.name && 
                      !userMembership.canRenew
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : plan.popular
                        ? `bg-gradient-to-r ${color.button} text-white shadow-lg hover:shadow-xl`
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    title={
                      userMembership?.hasActiveMembership && 
                      userMembership.membership.package_name === plan.name && 
                      !userMembership.canRenew
                        ? "Bạn đã gia hạn trong tháng này. Vui lòng đợi đến tháng mới để gia hạn tiếp."
                        : ""
                    }
                  >
                    {userMembership?.hasActiveMembership && userMembership.membership.package_name === plan.name
                      ? userMembership.canRenew
                        ? `Gia hạn ${plan.name}`
                        : `Đã gia hạn (tháng này)`
                      : userMembership?.hasActiveMembership
                      ? `${getMembershipTier(userMembership.membership.package_name)} → ${getMembershipTier(plan.name)}`
                      : `Nâng cấp ${plan.name}`}
                  </button>
                  
                  {/* Show current post usage */}
                  {userMembership?.hasActiveMembership && userMembership.membership.package_name === plan.name && (
                    <div className="mt-2 text-xs text-gray-500 text-center">
                      Đã dùng: {userMembership.currentPostCount}/{userMembership.membership.post_limit} bài viết/tháng
                      {userMembership.membership.daysRemaining > 0 && (
                        <span className="block mt-1">
                          Còn lại: {userMembership.membership.daysRemaining} ngày
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="text-center text-gray-600 text-sm">
          <p>Tất cả các gói đều có thể hủy bất cứ lúc nào</p>
        </div>
      </div>
    </div>
  );
};

export default PremiumPage;
