// wrstudios-frontend/user-app/src/admin_components/AdminUserManagement.jsx (FIXED)
import React, { useState, useEffect } from "react";
import { getAllUsers, toggleUserStatus, toggleAccountType, deleteUser } from "../utils/auth";
import UserDetailModal from "./UserDetailModal";
import AddUserModal from "./AddUserModal";
import ConfirmationModal from "../components/ConfirmationModal";
import { showSuccess, showError } from "../utils/toast";

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null, // 'toggleStatus', 'toggleAccountType', 'delete'
    userId: null,
    userName: null,
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const result = await getAllUsers();
      console.log("Loaded users:", result); // Debug

      if (result?.success) {
        setUsers(result.data || []);
      } else {
        setUsers([]);
        const msg = result?.message || "Không thể tải danh sách người dùng";
        showError(msg);
      }
    } catch (error) {
      console.error("Error loading users:", error);
      setUsers([]);
      showError(error?.message || "Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIX: Thêm null/undefined checks
  const filteredUsers = users.filter((user) => {
    // Check search term - với null/undefined safety
    const matchesSearch = searchTerm
      ? (user.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (user.phone?.toLowerCase() || "").includes(searchTerm.toLowerCase())
      : true;

    // Check status filter
    const matchesStatus =
      filterStatus === "all" || 
      (user.status?.toLowerCase() || "active") === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = (userId) => {
    const user = users.find((u) => u.user_id === userId);
    setConfirmModal({
      isOpen: true,
      type: 'toggleStatus',
      userId,
      userName: user?.name || 'N/A',
    });
  };

  const confirmToggleStatus = async () => {
    const { userId } = confirmModal;
    try {
      const result = await toggleUserStatus(userId);
      if (result.success) {
        showSuccess("Đã cập nhật trạng thái!");
        loadUsers();
      } else {
        showError(result.message || "Không thể cập nhật");
      }
    } catch (error) {
      showError("Lỗi: " + error.message);
    }
    setConfirmModal({ isOpen: false, type: null, userId: null, userName: null });
  };

  const handleToggleAccountType = (userId) => {
    const user = users.find((u) => u.user_id === userId);
    setConfirmModal({
      isOpen: true,
      type: 'toggleAccountType',
      userId,
      userName: user?.name || 'N/A',
    });
  };

  const confirmToggleAccountType = async () => {
    const { userId } = confirmModal;
    try {
      const result = await toggleAccountType(userId);
      if (result.success) {
        showSuccess("Đã cập nhật loại tài khoản!");
        loadUsers();
      } else {
        showError(result.message || "Không thể cập nhật");
      }
    } catch (error) {
      showError("Lỗi: " + error.message);
    }
    setConfirmModal({ isOpen: false, type: null, userId: null, userName: null });
  };

  const handleDeleteUser = (userId) => {
    const user = users.find((u) => u.user_id === userId);
    setConfirmModal({
      isOpen: true,
      type: 'delete',
      userId,
      userName: user?.name || 'N/A',
    });
  };

  const confirmDeleteUser = async () => {
    const { userId } = confirmModal;
    try {
      const result = await deleteUser(userId);
      if (result.success) {
        showSuccess("Đã xóa tài khoản!");
        loadUsers();
      } else {
        showError(result.message || "Không thể xóa");
      }
    } catch (error) {
      showError("Lỗi: " + error.message);
    }
    setConfirmModal({ isOpen: false, type: null, userId: null, userName: null });
  };

  const handleViewDetail = (user) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const handleAddSuccess = () => {
    loadUsers();
    setShowAddModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý thành viên</h1>
          <p className="text-sm text-gray-600 mt-1">
            Tổng số: {users.length} tài khoản
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm người dùng
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Vô hiệu hóa</option>
              <option value="banned">Bị cấm</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        {searchTerm && (
          <div className="mt-3 text-sm text-gray-600">
            Tìm thấy {filteredUsers.length} kết quả
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số điện thoại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    Không tìm thấy người dùng nào
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.user_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={user.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=ec4899&color=fff`}
                            alt={user.name || 'User'}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {user.user_id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.phone || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'admin' ? 'Admin' : 'Member'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        (user.status || 'active') === 'active'
                          ? 'bg-green-100 text-green-800'
                          : (user.status || 'active') === 'inactive'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {(user.status || 'active') === 'active' ? 'Hoạt động' : 
                         (user.status || 'active') === 'inactive' ? 'Vô hiệu hóa' : 'Bị cấm'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewDetail(user)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Xem chi tiết"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user.user_id)}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Đổi trạng thái"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.user_id)}
                          className="text-red-600 hover:text-red-900"
                          title="Xóa"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <UserDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        user={selectedUser}
      />

      <AddUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: null, userId: null, userName: null })}
        onConfirm={() => {
          if (confirmModal.type === 'toggleStatus') {
            confirmToggleStatus();
          } else if (confirmModal.type === 'toggleAccountType') {
            confirmToggleAccountType();
          } else if (confirmModal.type === 'delete') {
            confirmDeleteUser();
          }
        }}
        title={
          confirmModal.type === 'toggleStatus' ? 'Thay đổi trạng thái tài khoản' :
          confirmModal.type === 'toggleAccountType' ? 'Thay đổi loại tài khoản' :
          'Xóa tài khoản'
        }
        message={
          confirmModal.type === 'toggleStatus' ? `Bạn có chắc muốn thay đổi trạng thái tài khoản "${confirmModal.userName}"?` :
          confirmModal.type === 'toggleAccountType' ? `Bạn có chắc muốn thay đổi loại tài khoản "${confirmModal.userName}"?` :
          `⚠️ XÓA VĨNH VIỄN tài khoản "${confirmModal.userName}"? Hành động này không thể khôi phục!`
        }
        confirmText={
          confirmModal.type === 'toggleStatus' ? 'Xác nhận' :
          confirmModal.type === 'toggleAccountType' ? 'Xác nhận' :
          'Xóa'
        }
        type={
          confirmModal.type === 'delete' ? 'danger' : 'warning'
        }
      />
    </div>
  );
};

export default AdminUserManagement;