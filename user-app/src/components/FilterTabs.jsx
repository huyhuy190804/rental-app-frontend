// wrstudios-frontend/user-app/src/components/FilterTabs.jsx
import React from "react";

const FilterTabs = ({ activeFilter, onFilterChange }) => {
  const filters = [
    {
      id: "all",
      label: "Studio",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 9.75L12 4l9 5.75M19.5 10.5V19a1 1 0 01-1 1H5.5a1 1 0 01-1-1v-8.5"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 22V12h6v10"
          />
        </svg>
      ),
    },
    {
      id: "1room",
      label: "1 Phòng ngủ",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16V8a2 2 0 012-2h12a2 2 0 012 2v8M4 16h16M4 16l-1 4m17-4l1 4"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h8"
          />
        </svg>
      ),
    },
    {
      id: "2room",
      label: "2 Phòng ngủ",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7a2 2 0 012-2h14a2 2 0 012 2v6H3V7z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 13h18v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4zM12 7v12"
          />
        </svg>
      ),
    },
    {
      id: "hotel",
      label: "Phòng khách sạn",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 20h16M6 20V8m12 12V8M6 8h12l-2-4H8l-2 4z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 12h4M10 16h4"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-white py-6 px-6 border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => onFilterChange(filter.id)}
                className={`flex-1 min-w-[200px] flex items-center gap-3 rounded-2xl px-5 py-4 border transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white shadow-[0_15px_30px_rgba(244,63,94,0.35)] border-transparent scale-[1.01]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-rose-200 hover:text-rose-500 hover:shadow-[0_10px_25px_rgba(244,63,94,0.1)]"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    isActive
                      ? "bg-white bg-opacity-20 text-white"
                      : "bg-rose-50 text-rose-500"
                  }`}
                >
                  {filter.icon}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold">{filter.label}</p>
                  <p
                    className={`text-xs ${
                      isActive ? "text-white/80" : "text-gray-400"
                    }`}
                  >
                    {isActive ? "Đang khám phá" : "Xem tất cả lựa chọn"}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FilterTabs;
