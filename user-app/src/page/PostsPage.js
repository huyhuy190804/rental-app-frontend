import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import PostCard from "../components/PostCard";
import PostDetailModal from "../components/PostDetailModal";
import { getAllPosts, getPostsByType } from "../utils/posts";
import { getCurrentUser, logoutUser } from "../utils/auth";

const PostsPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

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
  }, [activeTab]);

  const loadPosts = () => {
    setLoading(true);
    setTimeout(() => {
      let loadedPosts = [];
      
      if (activeTab === "all") {
        loadedPosts = getAllPosts().filter(p => p.status === "approved");
      } else if (activeTab === "sale") {
        loadedPosts = getPostsByType("sale").filter(p => p.status === "approved");
      } else if (activeTab === "article") {
        loadedPosts = getPostsByType("article").filter(p => p.status === "approved");
      }
      
      setPosts(loadedPosts);
      setLoading(false);
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
  };

  const tabs = [
    { id: "all", label: "Tất cả", icon: "🏠" },
    { id: "sale", label: "Tin bán Studio", icon: "🏠" },
    { id: "article", label: "Bài viết", icon: "📝" }
  ];

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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Khám phá tin tức
          </h1>
          <p className="text-gray-600">
            Tìm kiếm và khám phá tất cả các tin bán studio và bài viết mới nhất
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Posts List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Chưa có bài viết nào
            </h3>
            <p className="text-gray-500">
              Hãy quay lại sau hoặc thử tab khác!
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