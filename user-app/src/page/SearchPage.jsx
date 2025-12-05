// wrstudios-frontend/user-app/src/page/SearchPage.jsx  
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import PostCard from "../components/PostCard";
import PostDetailModal from "../components/PostDetailModal";
import { getAllPosts } from "../utils/posts";
import { getCurrentUser, logoutUser } from "../utils/auth";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);

    const handleAuthChange = () => {
      const user = getCurrentUser();
      setCurrentUser(user);
    };

    window.addEventListener("authChange", handleAuthChange);
    return () => window.removeEventListener("authChange", handleAuthChange);
  }, []);

  useEffect(() => {
    if (query) {
      performSearch(query);
    } else {
      setPosts([]);
      setLoading(false);
    }
  }, [query]);

  const performSearch = async (searchTerm) => {
    setLoading(true);
    try {
      // Debounce-like delay to avoid janky UI
      await new Promise((r) => setTimeout(r, 300));
      const allPosts = await getAllPosts();
      const approved = (allPosts || [])
        .filter((p) => p.status === "approved")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const searchLower = searchTerm.toLowerCase();
      const filtered = approved.filter((post) => {
        const titleMatch = post.title?.toLowerCase().includes(searchLower);
        const descriptionMatch = post.description
          ?.toLowerCase()
          .includes(searchLower);
        const contentMatch = post.content?.toLowerCase().includes(searchLower);
        const locationMatch = post.location
          ?.toLowerCase()
          .includes(searchLower);
        const categoryMatch = post.category
          ?.toLowerCase()
          .includes(searchLower);

        return (
          titleMatch ||
          descriptionMatch ||
          contentMatch ||
          locationMatch ||
          categoryMatch
        );
      });

      setPosts(filtered);
    } catch (error) {
      console.error("Search error:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (postId) => {
    setSelectedPostId(postId);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedPostId(null);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <Header
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Kết quả tìm kiếm
          </h1>
          {query && (
            <p className="text-gray-600">
              Tìm thấy{" "}
              <span className="font-semibold text-pink-600">
                {posts.length}
              </span>{" "}
              kết quả cho từ khóa:{" "}
              <span className="font-semibold">"{query}"</span>
            </p>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
          </div>
        ) : !query ? (
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nhập từ khóa để tìm kiếm
            </h3>
            <p className="text-gray-500">
              Sử dụng thanh tìm kiếm ở trên để tìm kiếm bài viết
            </p>
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
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Không tìm thấy kết quả
            </h3>
            <p className="text-gray-500">Thử tìm kiếm với từ khóa khác</p>
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

export default SearchPage;
