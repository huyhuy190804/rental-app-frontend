// wrstudios-frontend/user-app/src/page/PostsPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import PostCard from "../components/PostCard";
import PostDetailModal from "../components/PostDetailModal";
import { getAllPosts, getPostsByType } from "../utils/posts";
import { getCurrentUser, logoutUser } from "../utils/auth";

const priceRanges = [
  { id: "under3", label: "Dưới 3 triệu", min: 0, max: 3000000 },
  { id: "3to5", label: "3 - 5 triệu", min: 3000000, max: 5000000 },
  { id: "5to8", label: "5 - 8 triệu", min: 5000000, max: 8000000 },
  { id: "8to10", label: "8 - 10 triệu", min: 8000000, max: 10000000 },
  { id: "above10", label: "Trên 10 triệu", min: 10000000, max: Infinity },
];

const PostsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [allApprovedPosts, setAllApprovedPosts] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);

  // ✅ Load user khi component mount
  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);

    // Listen auth changes
    const handleAuthChange = () => {
      const user = getCurrentUser();
      setCurrentUser(user);
    };

    window.addEventListener("authChange", handleAuthChange);
    return () => window.removeEventListener("authChange", handleAuthChange);
  }, []);

  useEffect(() => {
    loadPosts();
  }, [activeTab, selectedPriceRange]);

  // ✅ Listen for post creation event to refresh posts
  useEffect(() => {
    const handlePostCreated = () => {
      // Refresh posts after a new post is created
      loadPosts();
    };

    window.addEventListener("postCreated", handlePostCreated);
    return () => window.removeEventListener("postCreated", handlePostCreated);
  }, []);

  const loadPosts = () => {
    setLoading(true);
    setTimeout(() => {
      (async () => {
        try {
          console.log("🔄 Loading posts...");
          const all = await getAllPosts(1, 1000); // Get more posts
          console.log("📦 Received posts:", all?.length || 0);

          // Map backend fields to frontend fields
          const mappedPosts = (all || []).map((p) => ({
            ...p,
            id: p.post_id || p.id, // Ensure id is set
            type: p.post_type || "listing", // Map post_type to type
            createdAt: p.created_at || p.createdAt,
            authorName: p.author_name || p.authorName || "Unknown",
            authorId: p.user_id || p.authorId,
            location: p.address || p.location,
            content: p.description, // For articles, content is in description
            images: p.images || [],
            thumbnail: p.thumbnail || null, // Ensure thumbnail is mapped from backend
          }));

          console.log("✅ Mapped posts:", mappedPosts.length);
          const approved = mappedPosts
            .filter((p) => p.status === "approved")
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

          console.log("✅ Approved posts:", approved.length);

          setAllApprovedPosts(approved);

          let loadedPosts = [];

          if (activeTab === "all") {
            loadedPosts = approved;
          } else if (activeTab === "sale") {
            loadedPosts = approved.filter((p) => p.type === "listing");
          } else if (activeTab === "article") {
            loadedPosts = approved.filter((p) => p.type === "article");
          }

          // Filter theo giá - áp dụng cho tab "sale" và "all"
          if (
            selectedPriceRange &&
            (activeTab === "sale" || activeTab === "all")
          ) {
            const range = priceRanges.find((r) => r.id === selectedPriceRange);
            if (range) {
              loadedPosts = loadedPosts.filter((post) => {
                if (!post.price || post.type !== "listing") return false;
                return post.price >= range.min && post.price < range.max;
              });
            }
          }

          setPosts(loadedPosts);
        } catch (error) {
          console.error("Error loading posts in PostsPage:", error);
          setAllApprovedPosts([]);
          setPosts([]);
        } finally {
          setLoading(false);
        }
      })();
    }, 300);
  };

  const handleCardClick = (postId) => {
    setSelectedPostId(postId);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedPostId(null);
    loadPosts();
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    // ✅ Redirect to home page after logout
    navigate("/");
  };

  const tabs = [
    { id: "all", label: "Tất cả", icon: "🏠" },
    { id: "sale", label: "Bảng tin", icon: "🏷️" },
    { id: "article", label: "Bài viết", icon: "📝" },
  ];

  const categoryCounts = useMemo(() => {
    const articles = allApprovedPosts.filter(
      (p) => p.type === "article" || p.post_type === "article"
    ).length;

    const listings = allApprovedPosts.filter(
      (p) => p.type === "listing" || p.post_type === "listing"
    ).length;

    return {
      all: allApprovedPosts.length,
      article: articles,
      sale: listings, // ← Fix: đếm đúng listings
    };
  }, [allApprovedPosts]);

  const featuredPosts = useMemo(() => {
    return [...allApprovedPosts]
      .filter((p) => p.thumbnail || p.image_count > 0)
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 4);
  }, [allApprovedPosts]);

  const today = new Date().toDateString();
  const newPostsToday = allApprovedPosts.filter(
    (p) => new Date(p.createdAt).toDateString() === today
  ).length;

  const reviewCount = allApprovedPosts.reduce(
    (sum, post) => sum + (post.ratings?.length || 0),
    0
  );

  const uniqueAuthors = useMemo(() => {
    return new Set(allApprovedPosts.map((p) => p.authorId)).size;
  }, [allApprovedPosts]);

  const filteredPriceLabel =
    selectedPriceRange &&
    priceRanges.find((r) => r.id === selectedPriceRange)?.label;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* ✅ TRUYỀN currentUser, onLoginSuccess, onLogout VÀO HEADER */}
      <Header
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col gap-2 mb-8">
          <p className="text-sm font-semibold text-pink-500 uppercase tracking-[0.3em]">
            WRStudios Community
          </p>
          <div className="flex flex-wrap justify-between items-center gap-3">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Tìm kiếm căn hộ dễ dàng hơn
            </h1>
            <div className="flex gap-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    activeTab === tab.id
                      ? "bg-pink-600 text-white shadow-lg"
                      : "bg-white text-gray-600 border border-gray-200 hover:text-pink-600"
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <p className="text-gray-600 max-w-3xl">
            Truy cập nội dung được duyệt mới nhất, lọc theo nhu cầu và khám phá
            những bài viết nổi bật từ cộng đồng.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[240px,1fr] xl:grid-cols-[250px,1fr,280px] gap-6">
          {/* Left Sidebar */}
          <aside className="space-y-6">
            <div className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100">
              <p className="text-sm font-semibold text-pink-500 mb-4 flex items-center gap-2">
                <span role="img" aria-label="filter">
                  🎯
                </span>{" "}
                Danh mục
              </p>
              <div className="space-y-3">
                {[
                  { id: "all", label: "Tất cả", count: categoryCounts.all },
                  {
                    id: "article",
                    label: "Bài viết",
                    count: categoryCounts.article,
                  },
                  { id: "sale", label: "Bảng tin", count: categoryCounts.sale },
                ].map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveTab(category.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold border transition-all ${
                      activeTab === category.id
                        ? "bg-pink-50 border-pink-200 text-pink-600"
                        : "bg-white border-gray-200 text-gray-600 hover:border-pink-200"
                    }`}
                  >
                    <span>{category.label}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {(activeTab === "sale" || activeTab === "all") && (
              <div className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100">
                <p className="text-sm font-semibold text-pink-500 mb-4 flex items-center gap-2">
                  <span>$</span> Khoảng giá
                </p>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range.id}
                      onClick={() =>
                        setSelectedPriceRange((prev) =>
                          prev === range.id ? null : range.id
                        )
                      }
                      className={`w-full text-left px-4 py-3 rounded-2xl border text-sm font-medium transition-all ${
                        selectedPriceRange === range.id
                          ? "border-pink-300 bg-pink-50 text-pink-600"
                          : "border-gray-200 hover:border-pink-200 text-gray-600"
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
                {filteredPriceLabel && (
                  <p className="text-xs text-gray-500 mt-3">
                    Đang lọc:{" "}
                    <span className="font-semibold text-pink-600">
                      {filteredPriceLabel}
                    </span>
                  </p>
                )}
              </div>
            )}

            <div className="bg-gradient-to-br from-pink-100 to-white rounded-3xl p-6 border border-pink-200 text-center shadow-lg">
              <p className="text-sm font-semibold text-pink-500 uppercase tracking-[0.5em] mb-2">
                miễn phí
              </p>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Đăng tin ngay
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Chia sẻ căn hộ của bạn tới hàng nghìn khách tìm kiếm mỗi ngày.
              </p>
              <button
                onClick={() => {
                  const createBtn = document.getElementById(
                    "open-create-post-modal"
                  );
                  createBtn?.click();
                }}
                className="w-full bg-pink-600 text-white font-semibold py-3 rounded-2xl shadow-lg hover:bg-pink-700 transition"
              >
                Đăng tin miễn phí
              </button>
            </div>
          </aside>

          {/* Main content */}
          <main className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 rounded-3xl p-6 text-white shadow-2xl border border-indigo-300">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold opacity-80 mb-1">
                    Quảng cáo
                  </p>
                  <h3 className="text-2xl font-bold mb-2">WRStudios Pro</h3>
                  <p className="text-sm text-white/80 max-w-md">
                    Truy cập không giới hạn, ưu tiên hỗ trợ và nhiều tính năng
                    độc quyền dành riêng cho nhà môi giới chuyên nghiệp.
                  </p>
                </div>
                <button className="px-6 py-3 bg-white text-indigo-600 rounded-2xl text-sm font-semibold shadow-lg hover:translate-y-0.5 transition">
                  Tìm hiểu thêm
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Chưa có bài viết phù hợp
                </h3>
                <p className="text-gray-500">
                  Thử thay đổi bộ lọc hoặc quay lại sau nhé!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onClick={() => handleCardClick(post.id)}
                  />
                ))}
              </div>
            )}
          </main>

          {/* Right Sidebar */}
          <aside className="space-y-6">
            <div className="bg-gradient-to-br from-pink-500 to-purple-500 rounded-3xl p-6 text-white shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <span className="px-3 py-1 rounded-full bg-white/20 text-xs uppercase tracking-wide flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="4" />
                    <path
                      d="M12 7L14 12H19L15 15L16 20L12 17L8 20L9 15L5 12H10L12 7Z"
                      fill="white"
                    />
                  </svg>
                  Premium
                </span>
                <span className="text-sm opacity-80">Nâng cấp ngay</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">WRStudios Premium</h3>
              <p className="text-sm text-white/80 mb-4">
                Trải nghiệm đỉnh cao với tất cả tính năng độc quyền.
              </p>
              <ul className="text-sm space-y-2 mb-5">
                <li>• Truy cập không giới hạn</li>
                <li>• Ưu tiên hỗ trợ 24/7</li>
                <li>• Công cụ phân tích chuyên sâu</li>
              </ul>
              <button className="w-full bg-white text-pink-600 font-semibold py-3 rounded-2xl shadow-lg hover:shadow-xl transition">
                Nâng cấp ngay
              </button>
            </div>

            <div className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-pink-500 flex items-center gap-2">
                  <span role="img" aria-label="star">
                    🌟
                  </span>{" "}
                  Bài viết nổi bật
                </p>
                <span className="text-xs text-gray-400">Xem tất cả</span>
              </div>
              <div className="space-y-4">
                {featuredPosts.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Chưa có dữ liệu nổi bật.
                  </p>
                ) : (
                  featuredPosts.map((post) => (
                    <button
                      key={post.id}
                      onClick={() => handleCardClick(post.id)}
                      className="flex items-center gap-3 w-full text-left"
                    >
                      <img
                        src={
                          post.thumbnail ||
                          "https://via.placeholder.com/160x140"
                        }
                        alt={post.title}
                        className="w-16 h-14 rounded-2xl object-cover"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/160x140";
                        }}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                          {post.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>👁️ {post.views || 0}</span>
                          {post.averageRating && (
                            <span>
                              ⭐ {Number(post.averageRating).toFixed(1)}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100 space-y-4">
              <p className="text-sm font-semibold text-pink-500 flex items-center gap-2">
                📈 Thống kê hệ thống
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Bài viết mới hôm nay</span>
                  <span className="text-pink-600 font-semibold">
                    +{newPostsToday}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Đánh giá mới</span>
                  <span className="text-pink-600 font-semibold">
                    +{reviewCount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Người dùng hoạt động</span>
                  <span className="text-emerald-500 font-semibold">
                    • {uniqueAuthors}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 shadow-lg">
              <p className="text-sm font-semibold text-amber-600 mb-2">
                Cần hỗ trợ?
              </p>
              <p className="text-gray-700 text-sm mb-4">
                Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn 24/7.
              </p>
              <button className="w-full border border-amber-300 text-amber-700 font-semibold py-3 rounded-2xl hover:bg-amber-100 transition">
                Liên hệ hỗ trợ
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Detail Modal */}
      <PostDetailModal
        isOpen={showDetailModal}
        onClose={handleCloseModal}
        postId={selectedPostId}
      />
    </div>
  );
};

export default PostsPage;
