// wrstudios-frontend/user-app/src/admin_components/AdminLayout.jsx
import React from "react";
import AdminNavBar from "./AdminNavBar";
import AdminHeader from "./AdminHeader";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <AdminHeader />

      {/* Navigation Bar */}
      <AdminNavBar />

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;