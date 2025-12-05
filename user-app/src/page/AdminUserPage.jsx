// wrstudios-frontend/user-app/src/page/AdminUserPage.jsx
import React from "react";
import AdminLayout from "../admin_components/AdminLayout";
import AdminUserManagement from "../admin_components/AdminUserManagement";

const AdminUserPage = () => {
  return (
    <AdminLayout>
      <AdminUserManagement />
    </AdminLayout>
  );
};

export default AdminUserPage;