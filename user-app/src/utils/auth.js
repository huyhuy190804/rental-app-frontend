// utils/auth.js
const USERS_KEY = "wrstudios_users";
const AUTH_TOKEN_KEY = "wrstudios_auth_token";

// ============================================
// CÁC FUNCTION CŨ - CHO USER ĐĂNG KÝ/ĐĂNG NHẬP
// ============================================

// Tạo token giả (JWT-like)
const generateToken = (userId) => {
  const timestamp = Date.now();
  return btoa(`${userId}-${timestamp}-wrstudios-secret`);
};

// Đăng ký user mới
export const registerUser = (userData) => {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");

    // Kiểm tra email đã tồn tại chưa
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
      return { success: false, message: "Email đã được đăng ký!" };
    }

    // Kiểm tra username đã tồn tại chưa
    const existingUsername = users.find(u => u.accountName === userData.accountName);
    if (existingUsername) {
      return { success: false, message: "Tên tài khoản đã tồn tại!" };
    }

    // Tạo user mới
    const newUser = {
      id: Date.now().toString(),
      accountName: userData.accountName,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      password: userData.password, // Trong thực tế nên hash password
      accountType: "Thành viên", // Mặc định là Thành viên
      status: "Đang hoạt động", // Mặc định active
      postsCount: 0,
      createdAt: new Date().toISOString()
    };

    // Lưu vào localStorage
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    return { success: true, message: "Đăng ký thành công!", user: newUser };
  } catch (error) {
    return { success: false, message: "Có lỗi xảy ra khi đăng ký!" };
  }
};

// Đăng nhập
export const loginUser = (emailOrUsername, password) => {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");

    // Tìm user theo email hoặc username
    const user = users.find(
      u => (u.email === emailOrUsername || u.accountName === emailOrUsername)
        && u.password === password
    );

    if (!user) {
      return { success: false, message: "Email/Username hoặc mật khẩu không đúng!" };
    }

    // Tạo token và lưu
    const token = generateToken(user.id);
    const authData = {
      token,
      user: {
        id: user.id,
        accountName: user.accountName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        accountType: user.accountType, // Thêm dòng này
      },
    };

    localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(authData));
    window.dispatchEvent(new Event("authChange"));

    return { success: true, message: "Đăng nhập thành công!", user: authData.user };
  } catch (error) {
    return { success: false, message: "Có lỗi xảy ra khi đăng nhập!" };
  }
};

// Đăng xuất
export const logoutUser = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  window.dispatchEvent(new Event("authChange"));

};

// Kiểm tra đã đăng nhập chưa
export const getCurrentUser = () => {
  try {
    const authData = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!authData) return null;

    const { user } = JSON.parse(authData);
    return user;
  } catch (error) {
    return null;
  }
};

// Kiểm tra token còn hợp lệ không
export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

// ============================================
// CÁC FUNCTION MỚI - CHO ADMIN QUẢN LÝ
// ============================================

// Lấy tất cả users (cho admin)
export const getAllUsers = () => {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    return users.map(user => ({
      id: user.id,
      accountName: user.accountName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      accountType: user.accountType || "Thành viên",
      status: user.status || "Đang hoạt động",
      postsCount: user.postsCount || 0,
      createdAt: user.createdAt
    }));
  } catch (error) {
    return [];
  }
};

// Xóa user (cho admin)
export const deleteUser = (userId) => {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const updatedUsers = users.filter(u => u.id !== userId);
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    return { success: true, message: "Đã xóa thành viên thành công!" };
  } catch (error) {
    return { success: false, message: "Có lỗi xảy ra khi xóa thành viên!" };
  }
};

// Cập nhật thông tin user (cho admin)
export const updateUser = (userId, updateData) => {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return { success: false, message: "Không tìm thấy thành viên!" };
    }

    users[userIndex] = {
      ...users[userIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return { success: true, message: "Cập nhật thành công!", user: users[userIndex] };
  } catch (error) {
    return { success: false, message: "Có lỗi xảy ra khi cập nhật!" };
  }
};

// Thay đổi trạng thái user
export const toggleUserStatus = (userId) => {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return { success: false, message: "Không tìm thấy thành viên!" };
    }

    const currentStatus = users[userIndex].status || "Đang hoạt động";
    users[userIndex].status = currentStatus === "Đang hoạt động" ? "Không hoạt động" : "Đang hoạt động";

    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return { success: true, user: users[userIndex] };
  } catch (error) {
    return { success: false, message: "Có lỗi xảy ra!" };
  }
};

// Nâng cấp/hạ cấp loại tài khoản
export const toggleAccountType = (userId) => {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return { success: false, message: "Không tìm thấy thành viên!" };
    }

    const currentType = users[userIndex].accountType || "Thành viên";
    users[userIndex].accountType = currentType === "Thành viên" ? "Premium" : "Thành viên";

    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return { success: true, user: users[userIndex] };
  } catch (error) {
    return { success: false, message: "Có lỗi xảy ra!" };
  }
};

// ============================================
// FUNCTION CHO USER TỰ CẬP NHẬT PROFILE
// ============================================

// Cập nhật thông tin user (cho chính user đó)
export const updateUserProfile = (userId, updateData) => {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return { success: false, message: "Không tìm thấy tài khoản!" };
    }

    const currentUser = users[userIndex];

    // Nếu muốn đổi password, kiểm tra password hiện tại
    if (updateData.newPassword) {
      if (currentUser.password !== updateData.currentPassword) {
        return { success: false, message: "Mật khẩu hiện tại không đúng!" };
      }
      // Cập nhật password mới
      currentUser.password = updateData.newPassword;
    }

    // Kiểm tra email mới có bị trùng với user khác không
    if (updateData.email !== currentUser.email) {
      const emailExists = users.find((u, idx) => idx !== userIndex && u.email === updateData.email);
      if (emailExists) {
        return { success: false, message: "Email này đã được sử dụng!" };
      }
    }

    // Kiểm tra accountName mới có bị trùng với user khác không
    if (updateData.accountName !== currentUser.accountName) {
      const nameExists = users.find((u, idx) => idx !== userIndex && u.accountName === updateData.accountName);
      if (nameExists) {
        return { success: false, message: "Tên tài khoản này đã được sử dụng!" };
      }
    }

    // Cập nhật thông tin
    users[userIndex] = {
      ...currentUser,
      accountName: updateData.accountName,
      email: updateData.email,
      phoneNumber: updateData.phoneNumber,
      updatedAt: new Date().toISOString()
    };

    // Lưu vào localStorage
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    // Cập nhật token (auth data) với thông tin mới
    const authData = JSON.parse(localStorage.getItem(AUTH_TOKEN_KEY) || "{}");
    if (authData.user && authData.user.id === userId) {
      authData.user = {
        id: users[userIndex].id,
        accountName: users[userIndex].accountName,
        email: users[userIndex].email,
        phoneNumber: users[userIndex].phoneNumber,
        accountType: users[userIndex].accountType // <-- THÊM DÒNG NÀY
      };
      localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(authData));
    }

    return { success: true, message: "Cập nhật thông tin thành công!", user: users[userIndex] };
  } catch (error) {
    return { success: false, message: "Có lỗi xảy ra khi cập nhật!" };
  }
};
export const loginAdmin = (username, password) => {
  // Hardcode admin credentials
  if (username === "admin" && password === "admin123") {
    const adminData = {
      token: generateToken("admin"),
      user: {
        id: "admin",
        accountName: "Admin",
        email: "admin@wrstudios.com",
        phoneNumber: "0000000000",
        role: "admin", // ✅ Đã có
        accountType: "Admin" // ✅ THÊM DÒNG NÀY - Để hiển thị badge
      }
    };

    localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(adminData));
    window.dispatchEvent(new Event("authChange"));
    return { success: true, message: "Đăng nhập admin thành công!", user: adminData.user, isAdmin: true };
  }

  return { success: false, message: "Sai thông tin admin!" };
};