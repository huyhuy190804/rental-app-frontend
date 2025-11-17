import React from "react";

const FilterTabs = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: "all", label: "Studio", icon: "🏠" },
    { id: "1room", label: "1 Phòng ngủ", icon: "🛏️" },
    { id: "2room", label: "2 Phòng ngủ", icon: "🛏️" },
    { id: "hotel", label: "Phòng khách sạn", icon: "🏨" }
  ];

  return (
    <div className="bg-white border-b border-gray-200 py-6 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-4 justify-center">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm flex-1 max-w-xs ${
                activeFilter === filter.id
                  ? "bg-red-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="text-lg">{filter.icon}</span>
              <span>{filter.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterTabs;
