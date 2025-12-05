// wrstudios-frontend/user-app/src/utils/reviews.jsx
const REVIEWS_KEY = "wrstudios_reviews";

// Lấy tất cả reviews
export const getAllReviews = () => {
  try {
    const reviews = JSON.parse(localStorage.getItem(REVIEWS_KEY) || "[]");
    return reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    return [];
  }
};

// Lấy reviews theo bài viết
export const getReviewsByPost = (postId) => {
  const reviews = getAllReviews();
  return reviews.filter(r => r.postId === postId && !r.hidden);
};

// Thêm review mới
export const addReview = (postId, postTitle, userId, userName, rating, content, images = []) => {
  try {
    const reviews = getAllReviews();
    const newReview = {
      id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      postId,
      postTitle,
      userId,
      userName,
      rating,
      content,
      images,
      likes: [],
      replies: [],
      reports: [],
      hidden: false,
      createdAt: new Date().toISOString()
    };

    reviews.push(newReview);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));

    // Cập nhật rating trung bình cho post
    updatePostRating(postId);

    return { success: true, review: newReview };
  } catch (error) {
    return { success: false, message: "Lỗi khi thêm đánh giá!" };
  }
};

// Cập nhật review (chỉ user tự sửa)
export const updateReview = (reviewId, userId, content, images) => {
  try {
    const reviews = getAllReviews();
    const index = reviews.findIndex(r => r.id === reviewId);
    
    if (index === -1) {
      return { success: false, message: "Không tìm thấy đánh giá!" };
    }

    if (reviews[index].userId !== userId) {
      return { success: false, message: "Bạn không có quyền sửa đánh giá này!" };
    }

    reviews[index].content = content;
    reviews[index].images = images;
    reviews[index].updatedAt = new Date().toISOString();

    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    return { success: true };
  } catch (error) {
    return { success: false, message: "Lỗi khi cập nhật!" };
  }
};

// Xóa review (chỉ user tự xóa)
export const deleteReviewByUser = (reviewId, userId) => {
  try {
    const reviews = getAllReviews();
    const review = reviews.find(r => r.id === reviewId);

    if (!review) {
      return { success: false, message: "Không tìm thấy đánh giá!" };
    }

    if (review.userId !== userId) {
      return { success: false, message: "Bạn không có quyền xóa đánh giá này!" };
    }

    const filtered = reviews.filter(r => r.id !== reviewId);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(filtered));

    // Cập nhật rating trung bình
    updatePostRating(review.postId);

    return { success: true };
  } catch (error) {
    return { success: false, message: "Lỗi khi xóa!" };
  }
};

// Like/Unlike review
export const toggleLikeReview = (reviewId, userId) => {
  try {
    const reviews = getAllReviews();
    const review = reviews.find(r => r.id === reviewId);

    if (!review) return { success: false };

    if (!review.likes) review.likes = [];

    if (review.likes.includes(userId)) {
      review.likes = review.likes.filter(id => id !== userId);
    } else {
      review.likes.push(userId);
    }

    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    return { success: true, liked: review.likes.includes(userId), likeCount: review.likes.length };
  } catch (error) {
    return { success: false };
  }
};

// Thêm reply
export const addReply = (reviewId, userId, userName, content) => {
  try {
    const reviews = getAllReviews();
    const review = reviews.find(r => r.id === reviewId);

    if (!review) {
      return { success: false, message: "Không tìm thấy đánh giá!" };
    }

    if (!review.replies) review.replies = [];

    const newReply = {
      id: `reply_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      userName,
      content,
      reports: [],
      hidden: false,
      createdAt: new Date().toISOString()
    };

    review.replies.push(newReply);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));

    return { success: true, reply: newReply };
  } catch (error) {
    return { success: false, message: "Lỗi khi thêm phản hồi!" };
  }
};

// Báo cáo review
export const reportReview = (reviewId, userId, reason) => {
  try {
    const reviews = getAllReviews();
    const review = reviews.find(r => r.id === reviewId);

    if (!review) {
      return { success: false, message: "Không tìm thấy đánh giá!" };
    }

    if (!review.reports) review.reports = [];

    // Kiểm tra đã báo cáo chưa
    if (review.reports.some(r => r.userId === userId)) {
      return { success: false, message: "Bạn đã báo cáo đánh giá này rồi!" };
    }

    review.reports.push({
      userId,
      reason,
      createdAt: new Date().toISOString()
    });

    // Nếu >= 5 báo cáo → Ẩn
    if (review.reports.length >= 5) {
      review.hidden = true;
    }

    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    return { success: true, hidden: review.hidden };
  } catch (error) {
    return { success: false, message: "Lỗi khi báo cáo!" };
  }
};

// Báo cáo reply
export const reportReply = (reviewId, replyId, userId, reason) => {
  try {
    const reviews = getAllReviews();
    const review = reviews.find(r => r.id === reviewId);

    if (!review) {
      return { success: false, message: "Không tìm thấy đánh giá!" };
    }

    const reply = review.replies.find(r => r.id === replyId);

    if (!reply) {
      return { success: false, message: "Không tìm thấy phản hồi!" };
    }

    if (!reply.reports) reply.reports = [];

    // Kiểm tra đã báo cáo chưa
    if (reply.reports.some(r => r.userId === userId)) {
      return { success: false, message: "Bạn đã báo cáo phản hồi này rồi!" };
    }

    reply.reports.push({
      userId,
      reason,
      createdAt: new Date().toISOString()
    });

    // Nếu >= 5 báo cáo → Ẩn
    if (reply.reports.length >= 5) {
      reply.hidden = true;
    }

    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    return { success: true, hidden: reply.hidden };
  } catch (error) {
    return { success: false, message: "Lỗi khi báo cáo!" };
  }
};

// ADMIN: Xóa review vĩnh viễn
export const deleteReview = (reviewId) => {
  try {
    const reviews = getAllReviews();
    const review = reviews.find(r => r.id === reviewId);

    if (!review) {
      return { success: false, message: "Không tìm thấy đánh giá!" };
    }

    const filtered = reviews.filter(r => r.id !== reviewId);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(filtered));

    // Cập nhật rating trung bình
    updatePostRating(review.postId);

    return { success: true };
  } catch (error) {
    return { success: false, message: "Lỗi khi xóa!" };
  }
};

// ADMIN: Khôi phục review
export const restoreReview = (reviewId) => {
  try {
    const reviews = getAllReviews();
    const review = reviews.find(r => r.id === reviewId);

    if (!review) {
      return { success: false, message: "Không tìm thấy đánh giá!" };
    }

    review.hidden = false;
    review.reports = []; // Xóa tất cả báo cáo

    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    return { success: true };
  } catch (error) {
    return { success: false, message: "Lỗi khi khôi phục!" };
  }
};

// Helper: Cập nhật rating trung bình cho post
const updatePostRating = (postId) => {
  try {
    const reviews = getReviewsByPost(postId);
    const POSTS_KEY = "wrstudios_posts";
    const posts = JSON.parse(localStorage.getItem(POSTS_KEY) || "[]");
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex === -1) return;

    if (reviews.length === 0) {
      posts[postIndex].averageRating = 0;
      posts[postIndex].totalRatings = 0;
    } else {
      const total = reviews.reduce((sum, r) => sum + r.rating, 0);
      posts[postIndex].averageRating = total / reviews.length;
      posts[postIndex].totalRatings = reviews.length;
    }

    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  } catch (error) {
    console.error("Error updating post rating:", error);
  }
};

// Lấy review theo ID
export const getReviewById = (reviewId) => {
  const reviews = getAllReviews();
  return reviews.find(r => r.id === reviewId);
};