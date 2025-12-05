//wrstudios-frontend/user-app/src/components/MyArticleModal.jsx
import React, { useState, useEffect } from "react";
import { getAllPosts } from "../utils/posts";
import { getCurrentUser } from "../utils/auth";
import PostCard from "./PostCard";
import PostDetailModal from "./PostDetailModal";

const MyArticleModal = ({ isOpen, onClose }) => {
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const user = getCurrentUser();
      setCurrentUser(user);
      loadMyPosts(user);
    }
  }, [isOpen]);

  const loadMyPosts = async (user) => {
    if (!user) {
      setMyPosts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 300));
      const allPosts = await getAllPosts();
      const userPosts = (allPosts || [])
        .filter(
          (post) => post.authorId === user.user_id || post.authorId === user.id
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setMyPosts(userPosts);
    } catch (error) {
      console.error("Error loading my posts:", error);
      setMyPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (postId) => {
    setSelectedPostId(postId);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedPostId(null);
    if (currentUser) {
      loadMyPosts(currentUser);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Decorative Circle */}
          <div className="absolute -top-16 -left-16 w-32 h-32 bg-pink-200 rounded-full opacity-50"></div>
          <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-pink-200 rounded-full opacity-50"></div>

          {/* Close Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            type="button"
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition z-10 bg-white rounded-full p-1 hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Header */}
          <div className="text-center mb-6 relative z-10 pt-8 px-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              My Articles
            </h2>
            <p className="text-sm text-gray-600">Danh sách bài viết của bạn</p>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-8 pb-8 relative z-10">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
              </div>
            ) : myPosts.length === 0 ? (
              <div className="text-center py-20">
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
                  Chưa có bài viết nào
                </h3>
                <p className="text-gray-500">
                  Bạn chưa đăng bài viết nào. Hãy tạo bài viết đầu tiên của bạn!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {myPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onClick={() => handleCardClick(post.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <PostDetailModal
        isOpen={showDetailModal}
        onClose={handleCloseDetailModal}
        postId={selectedPostId}
      />
    </>
  );
};

export default MyArticleModal;
