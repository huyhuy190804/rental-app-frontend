// wrstudios-frontend/user-app/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./page/HomePage";
import PostsPage from "./page/PostsPage";
import SearchPage from "./page/SearchPage";
import PremiumPage from "./page/PremiumPage";
import PaymentPage from "./page/PaymentPage";
import AdminUserPage from "./page/AdminUserPage";
import AdminPostPage from "./page/AdminPostPage";
import AdminReviewPage from "./page/AdminReviewPage";
import AdminPremiumPage from "./admin_components/AdminPremiumPage";
import AdminStatisticsPage from "./page/AdminStatisticsPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/admin" element={<Navigate to="/admin/statistics" replace />} />
        <Route path="/admin/users" element={<AdminUserPage />} />
        <Route path="/admin/posts" element={<AdminPostPage />} />
        <Route path="/admin/reviews" element={<AdminReviewPage />} />
        <Route path="/admin/premium" element={<AdminPremiumPage />} />
        <Route path="/admin/statistics" element={<AdminStatisticsPage />} />
      </Routes>
    </Router>
  );
}

export default App;