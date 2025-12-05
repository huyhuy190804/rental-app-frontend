// wrstudios-frontend/user-app/src/utils/posts.jsx - sử dụng API backend
import { postsAPI } from "./api";

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
      return result.data.img_url; // Trả về chuỗi base64
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
    // Nếu bài viết không tồn tại (404), vẫn trả về success để frontend có thể xóa khỏi state
    if (error.message && error.message.includes('404')) {
      return { success: true, deleted: true, message: 'Bài viết đã được xóa khỏi database' };
    }
    return { success: false, message: error.message };
  }
};

// ============================================
// COMMENTS
// ============================================

// Thêm comment
export const addComment = async (
  postId,
  userId,
  userName,
  content,
  images = []
) => {
  try {
    const { commentsAPI } = await import("./api");
    const result = await commentsAPI.create({
      post_id: postId,
      content_comment: content,
      rating: null,
    });

    if (result.success) {
      return {
        success: true,
        comment: { id: result.comment_id, content_comment: content },
      };
    }
    return { success: false };
  } catch (error) {
    return { success: false };
  }
};

// Lấy comments của bài viết
export const getComments = async (postId) => {
  try {
    console.log('🔄 Loading comments for post:', postId);
    const { commentsAPI } = await import("./api");
    const result = await commentsAPI.getByPostId(postId);
    console.log('📦 Comments result:', result);
    if (result.success) {
      console.log(`✅ Loaded ${result.data?.length || 0} comments`);
      return result.data || [];
    }
    console.warn('⚠️ Failed to load comments:', result);
    return [];
  } catch (error) {
    console.error('❌ Error loading comments:', error);
    return [];
  }
};

// Tăng lượt xem bài viết
export const incrementPostView = async (postId, userId) => {
  try {
    // Backend tự động tăng views khi GET post
    return { success: true, views: 0 };
  } catch (error) {
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

// Rating bài viết (sử dụng comment với rating)
export const ratePost = async (postId, userId, rating) => {
  try {
    const { commentsAPI } = await import("./api");
    const result = await commentsAPI.create({
      post_id: postId,
      content_comment: `Rating: ${rating}`,
      rating: rating,
    });

    if (result.success) {
      return { success: true, averageRating: rating };
    }
    return { success: false };
  } catch (error) {
    return { success: false };
  }
};

// Duyệt bài viết (cho admin) - Cập nhật status thành 'approved'
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

// Từ chối bài viết (cho admin) - Cập nhật status thành 'rejected'
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
