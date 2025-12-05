  // wrstudios-frontend/user-app/src/page/HomePage.jsx
  import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import FilterTabs from "../components/FilterTabs";
import StudioCard from "../components/StudioCard";
import { studios } from "../utils/mockData";
import { getCurrentUser, logoutUser } from "../utils/auth";

const HomePage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc muốn đăng xuất?")) {
      logoutUser();
      setCurrentUser(null);
      window.location.reload();
    }
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const filteredStudios = studios
    .filter((studio) => {
      if (activeFilter === "all") return studio.type === "Studio";
      if (activeFilter === "1room") return studio.type === "1 Phòng ngủ";
      if (activeFilter === "2room") return studio.type === "2 Phòng ngủ";
      if (activeFilter === "hotel") return studio.type === "Phòng khách sạn";
      return true;
    })
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      <Header 
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />
      <Hero />
      <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredStudios.map((studio) => (
            <StudioCard key={studio.id} studio={studio} />
          ))}
        </div>

        {filteredStudios.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              Không có studio nào phù hợp với bộ lọc của bạn
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-gray-900 mb-4 text-sm">Về WRStudios</h4>
              <ul className="text-xs text-gray-600 space-y-2">
                <li><a href="#" className="hover:text-red-600 transition">Giới thiệu</a></li>
                <li><a href="#" className="hover:text-red-600 transition">Liên hệ</a></li>
                <li><a href="#" className="hover:text-red-600 transition">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4 text-sm">Cho Thuê</h4>
              <ul className="text-xs text-gray-600 space-y-2">
                <li><a href="#" className="hover:text-red-600 transition">Đăng tin</a></li>
                <li><a href="#" className="hover:text-red-600 transition">Hướng dẫn</a></li>
                <li><a href="#" className="hover:text-red-600 transition">Gói dịch vụ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4 text-sm">Hỗ Trợ</h4>
              <ul className="text-xs text-gray-600 space-y-2">
                <li><a href="#" className="hover:text-red-600 transition">Trợ giúp</a></li>
                <li><a href="#" className="hover:text-red-600 transition">Điều khoản</a></li>
                <li><a href="#" className="hover:text-red-600 transition">Chính sách</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4 text-sm">Liên Kết</h4>
              <ul className="text-xs text-gray-600 space-y-2">
                <li><a href="#" className="hover:text-red-600 transition">Facebook</a></li>
                <li><a href="#" className="hover:text-red-600 transition">Instagram</a></li>
                <li><a href="#" className="hover:text-red-600 transition">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-300 pt-8 text-center text-xs text-gray-500">
            <p>&copy; 2025 WRStudios. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;