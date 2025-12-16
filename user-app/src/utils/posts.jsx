// wrstudios-frontend/user-app/src/utils/posts.jsx - FIXED
import { postsAPI } from "./api";

// ✅ Use same base URL as api.js (backend runs on 4000 by default)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

// ✅ Align token storage with auth.js/api.js
const getAuthHeader = () => {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ✅ THÊM: Comments cache
let commentsCache = {};

// Lấy tất cả bài viết từ backend
export const getAllPosts = async (page = 1, limit = 1000) => {
  try {
    const result = await postsAPI.getAll(page, limit);
    if (result.success) {
      return result.data || [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

// Lấy bài viết theo type (không hỗ trợ trong backend hiện tại, filter on frontend)
export const getPostsByType = (type) => {
  // Note: filter based on type field in frontend or add to backend query
  return [];
};

// Lấy bài viết theo ID
export const getPostById = async (postId) => {
  try {
    const result = await postsAPI.getById(postId);
    if (result.success) {
      return result.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
};

// Lấy ảnh của bài viết theo index
export const getPostImageByIndex = async (postId, index) => {
  try {
    const result = await postsAPI.getImageByIndex(postId, index);
    if (result.success) {
      return result.data.img_url;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching post image ${index}:`, error);
    return null;
  }
};

export const getAllPostImages = async (postId) => {
  try {
    const result = await postsAPI.getAllImages(postId);
    if (result.success) {
      return result.data || [];
    }
    return [];
  } catch (error) {
    console.error(`Error fetching all post images:`, error);
    return [];
  }
};

// Tạo bài viết mới
export const createPost = async (postData) => {
  try {
    const result = await postsAPI.create({
      title: postData.title,
      description: postData.description,
      address: postData.address,
      price: postData.price,
      area: postData.area,
      images: postData.images || [],
      post_type: postData.post_type || "listing",
    });

    if (result.success) {
      return { success: true, post: { id: result.post_id } };
    }
    return {
      success: false,
      message: result.message || "Failed to create post",
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Cập nhật bài viết
export const updatePost = async (postId, postData) => {
  try {
    const result = await postsAPI.update(postId, postData);
    if (result.success) {
      return { success: true };
    }
    return { success: false };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Xóa bài viết
export const deletePost = async (postId) => {
  try {
    const result = await postsAPI.delete(postId);
    if (result.success) {
      return { success: true };
    }
    return { success: false, message: result.message };
  } catch (error) {
    if (error.message && error.message.includes('404')) {
      return { success: true, deleted: true, message: 'Bài viết đã được xóa khỏi database' };
    }
    return { success: false, message: error.message };
  }
};

// ============================================
// COMMENTS
// ============================================

// ✅ FIX: Thêm comment với API đúng
export const addComment = async (postId, commentData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(commentData)
    });
    
    const data = await res.json();
    
    if (data.success) {
      // Invalidate cache
      delete commentsCache[postId];
    }
    
    return data;
  } catch (error) {
    console.error('❌ Error adding comment:', error);
    return { success: false, error: error.message };
  }
};

// Lấy comments của bài viết
export const getComments = async (postId) => {
  try {
    console.log('📖 Fetching comments for postId:', postId);

    // Check cache first
    if (commentsCache[postId]) {
      console.log(`📦 Comments loaded from cache for ${postId}`);
      return { success: true, data: commentsCache[postId] };
    }

    const res = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
      headers: getAuthHeader()
    });
    const data = await res.json();
    
    console.log('✅ Comments response:', data);
    
    if (data.success) {
      commentsCache[postId] = data.data || [];
    }
    
    return data;
  } catch (error) {
    console.error('❌ Error fetching comments:', error);
    return { success: false, data: [] };
  }
};

// Tăng lượt xem bài viết
export const incrementPostView = async (postId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/posts/${postId}/increment-view`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('❌ Error incrementing view:', error);
    return { success: false };
  }
};

// Like/Unlike bài viết (có thể thêm vào backend sau)
export const toggleLikePost = async (postId, userId) => {
  try {
    // Để implement sau khi thêm table likes vào DB
    return { success: false };
  } catch (error) {
    return { success: false };
  }
};

// Rating bài viết
export const ratePost = async (postId, userId, rating) => {
  try {
    // TODO: Implement rating API
    return { success: false };
  } catch (error) {
    return { success: false };
  }
};

// Duyệt bài viết (cho admin)
export const approvePost = async (postId) => {
  try {
    const result = await postsAPI.approve(postId);
    if (result.success) {
      return { success: true, message: "Post approved" };
    }
    return {
      success: false,
      message: result.message || "Failed to approve post",
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Từ chối bài viết (cho admin)
export const rejectPost = async (postId) => {
  try {
    const result = await postsAPI.reject(postId);
    if (result.success) {
      return { success: true, message: "Post rejected" };
    }
    return {
      success: false,
      message: result.message || "Failed to reject post",
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Khôi phục bài viết (cho admin)
export const restorePost = async (postId) => {
  try {
    const result = await postsAPI.restore(postId);
    if (result.success) {
      return { success: true, message: "Post restored" };
    }
    return {
      success: false,
      message: result.message || "Failed to restore post",
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Clear comments cache
export const clearCommentsCache = () => {
  commentsCache = {};
};  