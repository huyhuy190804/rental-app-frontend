// Mock Payment Gateway - Simple test payment form
// Can be easily replaced with Stripe/PayPal in production
import React, { useState } from "react";
import { showError, showSuccess } from "../utils/toast";

const TEST_CARDS = [
  { number: "4242 4242 4242 4242", name: "Visa Test Card", cvc: "123", expiry: "12/25" },
  { number: "5555 5555 5555 4444", name: "Mastercard Test Card", cvc: "123", expiry: "12/25" },
  { number: "3782 822463 10005", name: "Amex Test Card", cvc: "1234", expiry: "12/25" },
];

const MockPaymentGateway = ({ amount, planName, onSuccess, onCancel }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTestCard, setSelectedTestCard] = useState(null);

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  // Format expiry date MM/YY
  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  // Fill test card data
  const fillTestCard = (card) => {
    setCardNumber(card.number);
    setCardName("Test User");
    setExpiry(card.expiry);
    setCvc(card.cvc);
    setSelectedTestCard(card.name);
  };

  // Validate card
  const validateCard = () => {
    const cardNum = cardNumber.replace(/\s/g, "");
    if (cardNum.length < 13 || cardNum.length > 19) {
      showError("Số thẻ không hợp lệ");
      return false;
    }
    if (!cardName.trim()) {
      showError("Vui lòng nhập tên chủ thẻ");
      return false;
    }
    if (!expiry.match(/^\d{2}\/\d{2}$/)) {
      showError("Ngày hết hạn không hợp lệ (MM/YY)");
      return false;
    }
    if (cvc.length < 3 || cvc.length > 4) {
      showError("CVV không hợp lệ");
      return false;
    }
    return true;
  };

  // Process payment (mock)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateCard()) return;

    setIsProcessing(true);

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock payment validation
    const cardNum = cardNumber.replace(/\s/g, "");
    const isTestCard = TEST_CARDS.some(
      (card) => card.number.replace(/\s/g, "") === cardNum
    );

    if (!isTestCard && !cardNum.startsWith("4242") && !cardNum.startsWith("5555")) {
      setIsProcessing(false);
      showError("Vui lòng sử dụng thẻ test để thanh toán");
      return;
    }

    // Mock successful payment
    setIsProcessing(false);
    showSuccess("Thanh toán thành công!");
    
    // Call success callback
    if (onSuccess) {
      onSuccess({
        paymentMethod: "card",
        cardLast4: cardNum.slice(-4),
        transactionId: `TXN${Date.now()}`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Test Cards Quick Fill */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm font-semibold text-blue-900 mb-3">
          💳 Thẻ Test (Click để điền tự động):
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {TEST_CARDS.map((card, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => fillTestCard(card)}
              className={`p-3 text-left rounded-lg border-2 transition-all ${
                selectedTestCard === card.name
                  ? "border-blue-500 bg-blue-100"
                  : "border-blue-200 bg-white hover:border-blue-300"
              }`}
            >
              <div className="text-xs font-semibold text-blue-900">{card.name}</div>
              <div className="text-xs text-blue-600 mt-1">{card.number}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số thẻ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            placeholder="4242 4242 4242 4242"
            maxLength={19}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
            required
          />
        </div>

        {/* Card Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tên chủ thẻ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={cardName}
            onChange={(e) => setCardName(e.target.value.toUpperCase())}
            placeholder="NGUYEN VAN A"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Expiry and CVC */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày hết hạn <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              placeholder="12/25"
              maxLength={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CVV <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="123"
              maxLength={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Tổng thanh toán:</span>
            <span className="text-2xl font-bold text-gray-900">{amount}</span>
          </div>
          <p className="text-xs text-gray-500">Gói: {planName}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isProcessing}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition shadow-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </span>
            ) : (
              "Thanh toán"
            )}
          </button>
        </div>

        {/* Security Notice */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <p className="text-xs text-green-700">
              <strong>Chế độ Test:</strong> Đây là môi trường test. Không có thông tin thẻ thật được gửi đi. 
              Khi đưa vào production, component này sẽ được thay thế bằng Stripe hoặc payment gateway thật.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MockPaymentGateway;

