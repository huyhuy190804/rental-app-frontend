// wrstudios-frontend/user-app/src/page/PaymentPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PremiumIcon from "../components/PremiumIcon";
import { getCurrentUser } from "../utils/auth";
import { formatCurrency } from "../utils/format";
// --- THÊM IMPORT NÀY ---
import { addTransaction } from "../utils/transactions"; 
import qrMBBank from "../assets/qr-mbbank.jpg";
import qrPayPal from "../assets/qr-paypal.jpg";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState("bank");

  const plan = location.state?.plan;

  // Tạo mã giao dịch unique (chỉ tạo 1 lần)
  const orderId = useMemo(() => `ORD${Date.now()}`, []);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      alert("Vui lòng đăng nhập để tiếp tục!");
      navigate("/");
      return;
    }
    setCurrentUser(user);

    if (!plan) {
      alert("Vui lòng chọn gói Premium!");
      navigate("/premium");
    }
  }, [navigate, plan]);

  if (!plan || !currentUser) return null;

  const price = plan.price || 0;
  const vat = Math.round(price * 0.1);
  const total = price + vat;

  // Tỉ giá USD/VND (có thể cập nhật theo API thực tế)
  const EXCHANGE_RATE = 25000;
  const priceUSD = (price / EXCHANGE_RATE).toFixed(2);
  const vatUSD = (vat / EXCHANGE_RATE).toFixed(2);
  const totalUSD = (total / EXCHANGE_RATE).toFixed(2);

  const getIconVariant = (planName) => {
    const name = planName?.toLowerCase() || "";
    if (name.includes("gold")) return "gold";
    if (name.includes("basic")) return "basic";
    if (name.includes("vip")) return "vip";
    return "premium";
  };

  const variant = getIconVariant(plan.name);

  // Nội dung chuyển khoản
  const transferContentBank = `Tai khoan ${currentUser.accountName} Nang cap goi ${plan.name} on WRStudios`;
  const transferContentPayPal = `${orderId} ${currentUser.accountName} ${plan.name}`;

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    
    // --- BẮT ĐẦU LOGIC GỬI YÊU CẦU ---
    const transactionPayload = {
        userId: currentUser.id || currentUser.username,
        userAccount: currentUser.accountName || currentUser.username,
        method: selectedMethod === "bank" ? "MB Bank" : "PayPal",
        planName: plan.name,
        amount: selectedMethod === "bank" ? total : parseFloat(totalUSD),
        currency: selectedMethod === "bank" ? "VND" : "USD",
        content: selectedMethod === "bank" ? transferContentBank : transferContentPayPal,
    };
    
    addTransaction(transactionPayload);
    // --- KẾT THÚC LOGIC ---

    if (selectedMethod === "bank") {
      alert("✅ Đã gửi yêu cầu thanh toán MB Bank! Vui lòng chờ Admin duyệt.");
    } else {
      alert(`✅ Đã gửi yêu cầu thanh toán PayPal! Vui lòng chờ Admin duyệt.`);
    }
    
    navigate("/premium");
  };

  // ... PHẦN RENDER BÊN DƯỚI GIỮ NGUYÊN KHÔNG ĐỔI ...
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Quay lại</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center text-white font-bold">W</div>
            <span className="font-bold text-xl text-gray-900">WRStudios</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thanh toán gói Premium</h1>
          <p className="text-gray-600">Hoàn tất thanh toán để nâng cấp tài khoản của bạn</p>
        </div>

        {/* ROW 1: QR Code + Payment Form */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Left: QR Code & Method Selection */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Chọn phương thức thanh toán</h2>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => setSelectedMethod("bank")}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  selectedMethod === "bank" ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-300"
                }`}
              >
                {selectedMethod === "bank" && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                      <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">MB Bank</span>
                </div>
              </button>

              <button
                onClick={() => setSelectedMethod("paypal")}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  selectedMethod === "paypal" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"
                }`}
              >
                {selectedMethod === "paypal" && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">PayPal</span>
                </div>
              </button>
            </div>

            {/* QR Code */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="text-center mb-3">
                <h3 className="font-semibold text-gray-900 mb-1">Quét mã QR để chuyển khoản</h3>
                <p className="text-sm text-gray-600">
                  {selectedMethod === "bank" ? "VietQR - MB Bank" : "PayPal QR Code"}
                </p>
              </div>

              <div className="flex justify-center mb-4">
                <img
                  src={selectedMethod === "bank" ? qrMBBank : qrPayPal}
                  alt={selectedMethod === "bank" ? "VietQR MB Bank" : "PayPal QR"}
                  className="w-64 h-64 bg-white p-3 rounded-xl shadow-md border-2 border-gray-200 object-cover"
                />
              </div>

              {/* Transfer Info */}
              <div className="space-y-2 bg-white p-4 rounded-lg">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-sm text-gray-600">Tên:</span>
                  <span className="font-semibold text-gray-900">Huỳnh Văn Huy</span>
                </div>

                {selectedMethod === "bank" ? (
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm text-gray-600">Số tài khoản:</span>
                    <span className="font-semibold text-gray-900">0787530239</span>
                  </div>
                ) : (
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm text-gray-600">Địa chỉ ví:</span>
                    <span className="font-semibold text-gray-900">@LouisHuynh04</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-1">
                  <span className="text-sm text-gray-600">Số tiền:</span>
                  <span className={`font-bold text-lg ${selectedMethod === "bank" ? "text-orange-600" : "text-blue-600"}`}>
                    {selectedMethod === "bank" ? `${formatCurrency(total)} ₫` : `$${totalUSD}`}
                  </span>
                </div>

                {selectedMethod === "paypal" && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-500 text-center">
                      Tỉ giá: 1 USD = {EXCHANGE_RATE.toLocaleString()} VND
                    </p>
                    <p className="text-xs text-gray-500 text-center">
                      ≈ {formatCurrency(total)} ₫
                    </p>
                  </div>
                )}
              </div>

              {/* Content Note */}
              <div className={`mt-3 p-3 rounded-lg ${selectedMethod === "bank" ? "bg-orange-50" : "bg-blue-50"}`}>
                <p className="text-xs text-gray-600 mb-1">
                  * Vui lòng {selectedMethod === "bank" ? "chuyển đúng số tiền và " : ""}ghi rõ nội dung {selectedMethod === "paypal" ? "trong phần Note/Message" : "thanh toán"}
                </p>
                <div className="flex items-start gap-2 mt-2">
                  <span className="text-xs text-gray-600 shrink-0">Nội dung:</span>
                  <span className="text-xs font-medium text-gray-900 break-all">
                    {selectedMethod === "bank" ? transferContentBank : transferContentPayPal}
                  </span>
                </div>
                {selectedMethod === "paypal" && (
                  <div className="mt-2 pt-2 border-t border-blue-200">
                    <p className="text-xs text-gray-600 mt-1">Vui lòng lưu nội dung này để dễ dàng quản lý việc mua hàng</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Payment Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Thông tin thanh toán</h2>

            <form onSubmit={handleSubmitPayment} className="space-y-4">
              {selectedMethod === "bank" ? (
                <>
                  {/* Bank Form */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngân hàng <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" required>
                      <option value="">Chọn ngân hàng</option>
                      <option value="mb">MB Bank</option>
                      <option value="vcb">Vietcombank</option>
                      <option value="tcb">Techcombank</option>
                      <option value="acb">ACB</option>
                      <option value="bidv">BIDV</option>
                      <option value="vietinbank">VietinBank</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số tài khoản <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="1234567890"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên tài khoản <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="NGUYEN VAN A"
                      defaultValue={currentUser.accountName?.toUpperCase()}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">Nội dung chuyển khoản:</h4>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-3 py-2 bg-white border border-orange-200 rounded text-sm font-mono text-orange-600 break-all">
                        {transferContentBank}
                      </code>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(transferContentBank);
                          alert("✅ Đã copy nội dung chuyển khoản!");
                        }}
                        className="px-3 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition text-sm"
                      >
                        Copy
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      ⚠️ Vui lòng ghi chính xác mã này vào phần <strong>Nội dung</strong> khi chuyển khoản
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg hover:from-orange-600 hover:to-red-600 transition shadow-lg text-lg"
                  >
                    Xác nhận đã thanh toán
                  </button>
                </>
              ) : (
                <>
                  {/* PayPal Form */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ ví PayPal <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="Your Address PayPal: @YourAddress"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Nhập email hoặc username PayPal của bạn</p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">Nội dung giao dịch của bạn:</h4>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-3 py-2 bg-white border border-blue-200 rounded text-sm font-mono text-blue-600 break-all">
                        {transferContentPayPal}
                      </code>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(transferContentPayPal);
                          alert("✅ Đã copy nội dung giao dịch!");
                        }}
                        className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                      >
                        Copy
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      ⚠️ Vui lòng ghi mã này vào phần <strong>Note/Message</strong> khi chuyển tiền PayPal
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-blue-700 transition shadow-lg text-lg"
                  >
                    Xác nhận đã thanh toán PayPal
                  </button>
                </>
              )}
            </form>

            <div className={`mt-4 p-4 rounded-lg ${selectedMethod === "bank" ? "bg-orange-50" : "bg-blue-50"}`}>
              <p className="text-sm text-gray-700">
                Sau khi chuyển khoản thành công, vui lòng chờ <strong>5-10 phút</strong> để hệ thống xác nhận. 
                Chúng tôi sẽ gửi email xác nhận đến bạn.
              </p>
            </div>
          </div>
        </div>

        {/* ROW 2: Order Summary (Full Width) */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tóm tắt đơn hàng</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: Plan Details */}
            <div>
              <div className="flex items-center gap-4 p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <PremiumIcon className="w-12 h-12" variant={variant} />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-gray-600">{plan.description}</p>
                  <p className="text-sm text-gray-500 mt-1">Thời hạn: 1 tháng</p>
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 text-lg">Quyền lợi của gói:</h3>
                <div className="space-y-3">
                  {plan.features?.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Pricing */}
            <div>
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4 text-lg">Chi tiết thanh toán</h3>

                <div className="space-y-4">
                  {selectedMethod === "bank" ? (
                    <>
                      <div className="flex justify-between items-center text-lg">
                        <span className="text-gray-600">Giá gói:</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(price)} ₫</span>
                      </div>
                      <div className="flex justify-between items-center text-lg">
                        <span className="text-gray-600">Thuế VAT (10%):</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(vat)} ₫</span>
                      </div>
                      <div className="border-t-2 border-gray-300 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-gray-900">Tổng cộng:</span>
                          <span className="text-3xl font-bold text-orange-600">{formatCurrency(total)} ₫</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center text-lg">
                        <span className="text-gray-600">Giá gói:</span>
                        <span className="font-semibold text-gray-900">${priceUSD}</span>
                      </div>
                      <div className="flex justify-between items-center text-lg">
                        <span className="text-gray-600">Thuế VAT (10%):</span>
                        <span className="font-semibold text-gray-900">${vatUSD}</span>
                      </div>
                      <div className="border-t-2 border-gray-300 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-gray-900">Tổng cộng:</span>
                          <span className="text-3xl font-bold text-blue-600">${totalUSD}</span>
                        </div>
                      </div>
                      <div className="mt-2 p-3 bg-blue-50 rounded text-sm text-gray-600">
                        <p>Tỉ giá: 1 USD = {EXCHANGE_RATE.toLocaleString()} VND</p>
                        <p>Tương đương: {formatCurrency(total)} ₫</p>
                      </div>
                    </>
                  )}
                </div>

                <div className={`mt-6 p-4 rounded-lg ${selectedMethod === "bank" ? "bg-orange-50" : "bg-blue-50"}`}>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" style={{color: selectedMethod === "bank" ? "#ea580c" : "#2563eb"}}>
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm text-gray-700">
                      <p className="font-semibold mb-1">Lưu ý quan trọng:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">  
                        <li>Tất cả các gói đều có thể hủy/nâng cấp bất cứ lúc nào</li>
                        <li>Hỗ trợ khách hàng 24/7</li>
                        <li>Dành cho khách hàng những trải nghiệm tốt nhất</li>
                        <li>Gia hạn tự động khi hết hạn</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;