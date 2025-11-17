import React from "react";
import AdminLayout from "../admin_components/AdminLayout";
import AdminDashboard from "../admin_components/AdminDashboard";

const AdminPage = () => {
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
};

export default AdminPage;