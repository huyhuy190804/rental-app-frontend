// wrstudios-frontend/user-app/src/page/HomePage.jsx - FIXED với real data
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import FilterTabs from "../components/FilterTabs";
import StudioCard from "../components/StudioCard";
import PostDetailModal from "../components/PostDetailModal";
import ConfirmationModal from "../components/ConfirmationModal";
import { getCurrentUser, logoutUser } from "../utils/auth";
import { getAllPosts } from "../utils/posts";

const HomePage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
    loadStudios();
  }, []);

  // ✅ Load real data từ database
  const loadStudios = async () => {
    try {
      setLoading(true);
      const allPosts = await getAllPosts(1, 100); // Load 100 posts đầu tiên
      
      // Map backend data sang format StudioCard
      const mappedStudios = (allPosts || [])
        .filter((p) => p.status === "approved" && p.post_type === "listing")
        .map((p) => ({
          id: p.post_id || p.id,
          name: p.title,
          description: p.description,
          location: p.address || "TP. HCM",
          price: p.price || 0,
          area: p.area || 0,
          type: "Studio", // Hoặc map từ category nếu có
          image: p.thumbnail || "https://images.unsplash.com/photo-1648775933902-f633de370964?w=600",
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setStudios(mappedStudios);
    } catch (error) {
      console.error("Error loading studios:", error);
      setStudios([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    logoutUser();
    setCurrentUser(null);
    window.location.href = "/";
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleCardClick = (studioId) => {
    setSelectedPostId(studioId);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedPostId(null);
  };

  // Filter studios theo activeFilter
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
        onLogout={handleLogoutClick}
      />

      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
        title="Xác nhận đăng xuất"
        message="Bạn có chắc muốn đăng xuất?"
        confirmText="Đăng xuất"
        cancelText="Hủy"
        type="warning"
      />

      <Hero />
      <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredStudios.map((studio) => (
              <div key={studio.id} onClick={() => handleCardClick(studio.id)} className="cursor-pointer">
                <StudioCard studio={studio} />
              </div>
            ))}
          </div>
        )}

        {!loading && filteredStudios.length === 0 && (
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
            <p>© 2025 WRStudios. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>

      {/* Detail Modal */}
      <PostDetailModal
        isOpen={showDetailModal}
        onClose={handleCloseModal}
        postId={selectedPostId}
      />
    </div>
  );
};

export default HomePage;