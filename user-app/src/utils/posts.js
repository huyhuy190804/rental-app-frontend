const POSTS_KEY = "wrstudios_posts";

// Lấy tất cả bài viết
export const getAllPosts = () => {
  try {
    const posts = JSON.parse(localStorage.getItem(POSTS_KEY) || "[]");
    return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    return [];
  }
};

// Lấy bài viết theo type
export const getPostsByType = (type) => {
  const allPosts = getAllPosts();
  return allPosts.filter(post => post.type === type);
};

// Lấy bài viết theo ID
export const getPostById = (postId) => {
  const posts = getAllPosts();
  return posts.find(post => post.id === postId);
};

// Tạo bài viết mới
export const createPost = (postData) => {
  try {
    const posts = getAllPosts();
    const newPost = {
      ...postData,
      id: `post_${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString(),
      views: 0,
      likes: [],
      ratings: [],
      averageRating: 0,
      comments: []
    };
    
    posts.unshift(newPost);
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    return { success: true, post: newPost };
  } catch (error) {
    return { success: false, message: "Lỗi khi tạo bài viết" };
  }
};

// Duyệt bài viết
export const approvePost = (postId) => {
  try {
    const posts = getAllPosts();
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex !== -1) {
      posts[postIndex].status = "approved";
      localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
      return { success: true };
    }
    return { success: false };
  } catch (error) {
    return { success: false };
  }
};

// Từ chối bài viết
export const rejectPost = (postId) => {
  try {
    const posts = getAllPosts();
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex !== -1) {
      posts[postIndex].status = "rejected";
      localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
      return { success: true };
    }
    return { success: false };
  } catch (error) {
    return { success: false };
  }
};

// Xóa bài viết
export const deletePost = (postId) => {
  try {
    const posts = getAllPosts();
    const filteredPosts = posts.filter(p => p.id !== postId);
    localStorage.setItem(POSTS_KEY, JSON.stringify(filteredPosts));
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};

// ============================================
// CÁC FUNCTION MỚI: LIKE, RATING, COMMENT
// ============================================

// Like/Unlike bài viết
export const toggleLikePost = (postId, userId) => {
  try {
    const posts = getAllPosts();
    const postIndex = posts.findIndex(p => p.id === postId);
    
    if (postIndex === -1) return { success: false };

    if (!posts[postIndex].likes) {
      posts[postIndex].likes = [];
    }

    const likeIndex = posts[postIndex].likes.indexOf(userId);
    
    if (likeIndex > -1) {
      // Unlike
      posts[postIndex].likes.splice(likeIndex, 1);
    } else {
      // Like
      posts[postIndex].likes.push(userId);
    }

    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    return { 
      success: true, 
      liked: likeIndex === -1, 
      likeCount: posts[postIndex].likes.length 
    };
  } catch (error) {
    return { success: false };
  }
};

// Rating bài viết
export const ratePost = (postId, userId, rating) => {
  try {
    const posts = getAllPosts();
    const postIndex = posts.findIndex(p => p.id === postId);
    
    if (postIndex === -1) return { success: false };

    if (!posts[postIndex].ratings) {
      posts[postIndex].ratings = [];
    }

    // Tìm rating cũ của user
    const existingRatingIndex = posts[postIndex].ratings.findIndex(r => r.userId === userId);
    
    if (existingRatingIndex > -1) {
      // Update rating
      posts[postIndex].ratings[existingRatingIndex].rating = rating;
    } else {
      // Add new rating
      posts[postIndex].ratings.push({ 
        userId, 
        rating, 
        createdAt: new Date().toISOString() 
      });
    }

    // Tính average rating
    const avgRating = posts[postIndex].ratings.reduce((sum, r) => sum + r.rating, 0) / posts[postIndex].ratings.length;
    posts[postIndex].averageRating = avgRating;

    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    return { 
      success: true, 
      averageRating: avgRating, 
      totalRatings: posts[postIndex].ratings.length 
    };
  } catch (error) {
    return { success: false };
  }
};

// Lấy rating của user cho bài viết
export const getUserRating = (postId, userId) => {
  try {
    const post = getPostById(postId);
    if (!post || !post.ratings) return null;
    
    const userRating = post.ratings.find(r => r.userId === userId);
    return userRating ? userRating.rating : null;
  } catch (error) {
    return null;
  }
};

// Thêm comment
export const addComment = (postId, userId, userName, content, images = []) => {
  try {
    const posts = getAllPosts();
    const postIndex = posts.findIndex(p => p.id === postId);
    
    if (postIndex === -1) return { success: false };

    if (!posts[postIndex].comments) {
      posts[postIndex].comments = [];
    }

    const newComment = {
      id: `comment_${Date.now()}`,
      userId,
      userName,
      content,
      images,
      createdAt: new Date().toISOString()
    };

    posts[postIndex].comments.unshift(newComment);
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    
    return { success: true, comment: newComment };
  } catch (error) {
    return { success: false };
  }
};

// Lấy comments của bài viết
export const getComments = (postId) => {
  const post = getPostById(postId);
  return post && post.comments ? post.comments : [];
};