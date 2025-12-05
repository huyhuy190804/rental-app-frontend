// wrstudios-frontend/user-app/src/utils/auth.js
import { authAPI } from "./api";

const AUTH_TOKEN_KEY = "auth_token";
const CURRENT_USER_KEY = "current_user";

// Đăng ký user mới (gọi backend)
export const registerUser = async (userData) => {
  try {
    const result = await authAPI.register({
      name: userData.accountName || userData.name,
      email: userData.email,
      phone: userData.phoneNumber || userData.phone,
      password: userData.password,
    });

    if (result.success) {
      // Lưu token
      localStorage.setItem(AUTH_TOKEN_KEY, result.token);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(result.user));
      window.dispatchEvent(new Event("authChange"));
      return {
        success: true,
        message: "Registration successful!",
        user: result.user,
      };
    }
    return { success: false, message: result.message || "Registration failed" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Đăng nhập (gọi backend)
export const loginUser = async (emailOrUsername, password) => {
  try {
    const result = await authAPI.login(emailOrUsername, password);

    if (result.success) {
      localStorage.setItem(AUTH_TOKEN_KEY, result.token);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(result.user));
      window.dispatchEvent(new Event("authChange"));
      return { success: true, message: "Login successful!", user: result.user };
    }
    return { success: false, message: result.message || "Login failed" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Đăng xuất
export const logoutUser = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
  window.dispatchEvent(new Event("authChange"));
};

// Lấy current user từ localStorage
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

// Kiểm tra đã đăng nhập chưa
export const isAuthenticated = () => {
  return !!localStorage.getItem(AUTH_TOKEN_KEY);
};

// ============================================
// CÁC FUNCTION CHO ADMIN
// ============================================

// Lấy tất cả users (cho admin)
export const getAllUsers = async () => {
  try {
    const result = await (await import("./api")).usersAPI.getAll();
    return result.success ? result.data : [];
  } catch {
    return [];
  }
};

// Xóa user (cho admin)
export const deleteUser = async (userId) => {
  try {
    const result = await (await import("./api")).usersAPI.delete(userId);
    return result.success
      ? { success: true, message: "User deleted" }
      : { success: false };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Cập nhật thông tin user
export const updateUser = async (userId, updateData) => {
  try {
    const result = await (
      await import("./api")
    ).usersAPI.update(userId, updateData);
    if (result.success) {
      // Update localStorage user if it's current user
      const currentUser = getCurrentUser();
      if (currentUser && currentUser.user_id === userId) {
        const updated = { ...currentUser, ...updateData };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event("authChange"));
      }
      return { success: true, message: "User updated" };
    }
    return { success: false };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Cập nhật profile user
export const updateUserProfile = async (userId, updateData) => {
  return updateUser(userId, updateData);
};

// Đăng nhập admin (call backend to get proper JWT)
export const loginAdmin = async (username, password) => {
  try {
    // Call backend login endpoint with admin credentials
    const result = await authAPI.login(username, password);
    
    if (result.success) {
      localStorage.setItem(AUTH_TOKEN_KEY, result.token);
      // Ensure admin user has necessary fields for frontend
      const adminUser = {
        ...result.user,
        accountName: result.user.name,
        accountType: 'Admin',
        membershipTier: 'Business'
      };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(adminUser));
      window.dispatchEvent(new Event('authChange'));
      return { success: true, message: 'Admin login successful', user: adminUser, isAdmin: true };
    }
    return { success: false, message: result.message || 'Invalid admin credentials' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Toggle user status (kích hoạt/vô hiệu hóa tài khoản)
export const toggleUserStatus = async (userId) => {
  try {
    const { usersAPI } = await import("./api");
    const userResult = await usersAPI.getById(userId);

    if (!userResult.success) {
      return { success: false, message: "User not found" };
    }

    const currentStatus = userResult.data.status || "Đang hoạt động";
    const newStatus =
      currentStatus === "Đang hoạt động" ? "Vô hiệu hóa" : "Đang hoạt động";

    const updateResult = await usersAPI.update(userId, { status: newStatus });
    if (updateResult.success) {
      return {
        success: true,
        user: { ...updateResult.data, status: newStatus },
      };
    }
    return { success: false, message: "Failed to toggle user status" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Toggle account type (thay đổi loại tài khoản)
export const toggleAccountType = async (userId) => {
  try {
    const { usersAPI } = await import("./api");
    const userResult = await usersAPI.getById(userId);

    if (!userResult.success) {
      return { success: false, message: "User not found" };
    }

    const currentType = userResult.data.accountType || "user";
    const newType = currentType === "user" ? "premium" : "user";

    const updateResult = await usersAPI.update(userId, {
      accountType: newType,
    });
    if (updateResult.success) {
      return {
        success: true,
        user: { ...updateResult.data, accountType: newType },
      };
    }
    return { success: false, message: "Failed to toggle account type" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
