import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./page/HomePage";
import PostsPage from "./page/PostsPage";
import AdminPage from "./page/AdminPage";
import AdminUserPage from "./page/AdminUserPage";
import AdminPostPage from "./page/AdminPostPage";
import AdminReviewPage from "./page/AdminReviewPage"; // ✅ THÊM

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/users" element={<AdminUserPage />} />
        <Route path="/admin/posts" element={<AdminPostPage />} />
        <Route path="/admin/reviews" element={<AdminReviewPage />} /> {/* ✅ THÊM */}
      </Routes>
    </Router>
  );
}

export default App;