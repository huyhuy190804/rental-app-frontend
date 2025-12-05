// wrstudios-frontend/user-app/src/utils/api.js
const API_BASE_URL = 'http://localhost:4000/api';

// Helper: add Authorization header
const getAuthHeader = () => {
  const token = localStorage.getItem('auth_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// ==================== AUTH API ====================
export const authAPI = {
  register: async (data) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  login: async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  }
};

// ==================== USERS API ====================
export const usersAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE_URL}/users`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  getById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  update: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  getMembership: async (id) => {
    const res = await fetch(`${API_BASE_URL}/users/${id}/membership`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  }
};

// ==================== POSTS API ====================
export const postsAPI = {
  getAll: async (page = 1, limit = 10) => {
    const cacheBuster = new Date().getTime();
    const res = await fetch(`${API_BASE_URL}/posts?page=${page}&limit=${limit}&_=${cacheBuster}`);
    return res.json();
  },

  getById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/posts/${id}`);
    return res.json();
  },

  getAllImages: async (id) => {
    const res = await fetch(`${API_BASE_URL}/posts/${id}/images`);
    return res.json();
  },

  getImageByIndex: async (id, index) => {
    const res = await fetch(`${API_BASE_URL}/posts/${id}/image/${index}`);
    return res.json();
  },

  create: async (data) => {
    const res = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  update: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  approve: async (id) => {
    const res = await fetch(`${API_BASE_URL}/posts/${id}/approve`, {
      method: 'PATCH',
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  reject: async (id) => {
    const res = await fetch(`${API_BASE_URL}/posts/${id}/reject`, {
      method: 'PATCH',
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return res.json();
  }
};

// ==================== COMMENTS API ====================
export const commentsAPI = {
  getByPostId: async (postId) => {
    const res = await fetch(`${API_BASE_URL}/comments/post/${postId}`);
    return res.json();
  },

  create: async (data) => {
    const res = await fetch(`${API_BASE_URL}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  update: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/comments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${API_BASE_URL}/comments/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return res.json();
  }
};

// ==================== MEMBERSHIP API ====================
// Backend exposes membership packages at /api/membership_packages
export const membershipAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE_URL}/membership_packages`);
    return res.json();
  },

  getById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/membership_packages/${id}`);
    return res.json();
  },

  create: async (data) => {
    const res = await fetch(`${API_BASE_URL}/membership_packages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  update: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/membership_packages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${API_BASE_URL}/membership_packages/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return res.json();
  }
};

// ==================== PLANS API (Legacy) ====================
export const plansAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE_URL}/plans`);
    return res.json();
  },

  create: async (data) => {
    const res = await fetch(`${API_BASE_URL}/plans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  update: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/plans/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${API_BASE_URL}/plans/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  }
};

// ==================== TRANSACTIONS API (Legacy) ====================
export const transactionsAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE_URL}/transactions`);
    return res.json();
  },

  create: async (data) => {
    const res = await fetch(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateStatus: async (id, status) => {
    const res = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return res.json();
  }
};
