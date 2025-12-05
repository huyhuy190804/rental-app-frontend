// wrstudios-frontend/user-app/src/components/PremiumPlanCard.jsx
import React from "react";
import { formatPrice } from "../utils/format"; // bạn có utils/format.js dự án rồi

const PremiumPlanCard = ({ plan, onEdit, onDelete, onToggleActive, onPurchase }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-5 flex flex-col">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{plan.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{plan.benefits?.slice(0,3).join(" • ")}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-extrabold text-red-600">{formatPrice(plan.price)} đ</div>
          <div className="text-xs text-gray-500">/{plan.durationDays} ngày</div>
        </div>
      </div>

      <div className="mt-4 flex-1">
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Số bài tối đa / tháng: <span className="font-medium">{plan.maxPostsPerMonth}</span></li>
          <li>• Lợi ích:</li>
          <li className="ml-4 text-gray-600">{plan.benefits?.map((b, i) => <div key={i}>- {b}</div>)}</li>
        </ul>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button onClick={() => onEdit(plan)} className="px-3 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50">
            Sửa
          </button>
          <button onClick={() => onDelete(plan.id)} className="px-3 py-2 rounded-lg border border-red-200 text-sm text-red-600 hover:bg-red-50">
            Xóa
          </button>
          <button onClick={() => onToggleActive(plan.id)} className={`px-3 py-2 rounded-lg text-sm ${plan.active ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-700"}`}>
            {plan.active ? "Kích hoạt" : "Tạm dừng"}
          </button>
        </div>

        <div>
          <button onClick={() => onPurchase(plan)} className="px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg font-semibold shadow">
            Mua gói
          </button>
        </div>
      </div>
    </div>
  );
};

export default PremiumPlanCard;
