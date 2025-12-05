// wrstudios-frontend/user-app/src/utils/notifications.jsx
const NOTIFICATIONS_KEY = "wrstudios_notifications";

// Lấy tất cả thông báo
export const getAllNotifications = () => {
  try {
    const notifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || "[]");
    return notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    return [];
  }
};

// Thêm thông báo mới
export const addNotification = (type, message, data = {}) => {
  try {
    const notifications = getAllNotifications();
    const newNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      message,
      data,
      read: false,
      createdAt: new Date().toISOString()
    };

    notifications.unshift(newNotification);
    
    // Giữ tối đa 100 thông báo
    if (notifications.length > 100) {
      notifications.splice(100);
    }

    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    
    // Dispatch event để cập nhật UI
    window.dispatchEvent(new Event("notificationsUpdated"));
    
    return { success: true, notification: newNotification };
  } catch (error) {
    return { success: false, message: "Lỗi khi thêm thông báo!" };
  }
};

// Đánh dấu thông báo đã đọc
export const markNotificationAsRead = (notificationId) => {
  try {
    const notifications = getAllNotifications();
    const index = notifications.findIndex(n => n.id === notificationId);
    
    if (index !== -1) {
      notifications[index].read = true;
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
      window.dispatchEvent(new Event("notificationsUpdated"));
      return { success: true };
    }
    
    return { success: false };
  } catch (error) {
    return { success: false };
  }
};

// Đánh dấu tất cả thông báo đã đọc
export const markAllAsRead = () => {
  try {
    const notifications = getAllNotifications();
    notifications.forEach(n => n.read = true);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    window.dispatchEvent(new Event("notificationsUpdated"));
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};

// Xóa thông báo
export const deleteNotification = (notificationId) => {
  try {
    const notifications = getAllNotifications();
    const filtered = notifications.filter(n => n.id !== notificationId);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event("notificationsUpdated"));
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};

// Đếm số thông báo chưa đọc
export const getUnreadCount = () => {
  const notifications = getAllNotifications();
  return notifications.filter(n => !n.read).length;
};

// Format thời gian
export const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return "Vừa xong";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} phút trước`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} giờ trước`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ngày trước`;
  }
};

