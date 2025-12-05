
// wrstudios-frontend/user-app/src/utils/format.js
export const normalizeCurrencyValue = (value) => {
  if (value === null || value === undefined || value === "") return null;

  const numericValue =
    typeof value === "number"
      ? value
      : Number(String(value).replace(/[^\d.-]/g, ""));

  if (!Number.isFinite(numericValue)) return null;

  // Các mock dữ liệu cũ dùng đơn vị "tỷ" (giá trị nhỏ hơn 1000).
  // Khi gặp trường hợp này, chuyển đổi sang VND để hiển thị thống nhất.
  const normalizedValue =
    Math.abs(numericValue) < 1000 ? numericValue * 1_000_000_000 : numericValue;

  return normalizedValue;
};

export const formatCurrency = (value) => {
  const normalized = normalizeCurrencyValue(value);
  if (normalized === null) return "-";

  return normalized.toLocaleString("vi-VN");
};

