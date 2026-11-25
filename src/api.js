const API_URL = import.meta.env.VITE_API_URL || 'https://gadget-heaven-ecommerce-backend.vercel.app/api';

// ব্যাকএন্ডে আপলোড করা ছবির (/uploads/...) জন্য সার্ভারের origin
export const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');

// আপলোড করা ছবির relative path-কে পুরো URL বানায়; বাইরের লিংক যেমন আছে তেমনই থাকে
export const imgUrl = (src) => {
  if (!src) return '';
  return src.startsWith('/uploads') ? `${API_ORIGIN}${src}` : src;
};

const getToken = () => localStorage.getItem('token');

// খালি/undefined প্যারামিটার বাদ দিয়ে query string বানায়
const qs = (params = {}) => {
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
  );
  const s = new URLSearchParams(clean).toString();
  return s ? `?${s}` : '';
};

const request = async (endpoint, options = {}) => {
  const headers = { ...options.headers };
  if (!(options.body instanceof FormData)) headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // টোকেন নষ্ট/মেয়াদোত্তীর্ণ বা অ্যাকাউন্ট ব্লক হলে ইউজারকে লগআউট করে দেওয়া হয়
    if (token && (res.status === 401 || (res.status === 403 && /blocked/i.test(data.message || '')))) {
      window.dispatchEvent(new Event('auth:logout'));
    }
    throw new Error(data.message || `Request failed: ${res.status}`);
  }
  return data;
};

const json = (method, body) => ({ method, body: JSON.stringify(body) });

export const api = {
  // Products
  getProducts: (params) => request(`/products${qs(params)}`),
  getProduct: (id) => request(`/products/${id}`),
  createProduct: (body) => request('/products', json('POST', body)),
  updateProduct: (id, body) => request(`/products/${id}`, json('PUT', body)),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),

  // Categories
  getCategories: (params) => request(`/categories${qs(params)}`),
  getCategoriesFromProducts: () => request('/categories/from-products'),
  createCategory: (body) => request('/categories', json('POST', body)),
  updateCategory: (id, body) => request(`/categories/${id}`, json('PUT', body)),
  deleteCategory: (id) => request(`/categories/${id}`, { method: 'DELETE' }),

  // Upload (admin)
  uploadImage: (file) => {
    const fd = new FormData();
    fd.append('image', file);
    return request('/upload', { method: 'POST', body: fd });
  },

  // Auth
  register: (body) => request('/auth/register', json('POST', body)),
  login: (body) => request('/auth/login', json('POST', body)),
  getProfile: () => request('/auth/profile'),
  updateProfile: (body) => request('/auth/profile', json('PUT', body)),

  // Orders (customer)
  createOrder: (body) => request('/orders', json('POST', body)),
  getMyOrders: () => request('/orders/myorders'),
  getOrder: (id) => request(`/orders/${id}`),
  cancelOrder: (id) => request(`/orders/${id}/cancel`, { method: 'PUT' }),

  // Orders (admin)
  getAllOrders: (params) => request(`/orders${qs(params)}`),
  updateOrderStatus: (id, status, note) => request(`/orders/${id}/status`, json('PUT', { status, note })),
  updateOrderPayment: (id, isPaid) => request(`/orders/${id}/pay`, json('PUT', { isPaid })),
  deleteOrder: (id) => request(`/orders/${id}`, { method: 'DELETE' }),

  // Users (admin)
  getUsers: (params) => request(`/users${qs(params)}`),
  getUser: (id) => request(`/users/${id}`),
  createUser: (body) => request('/users', json('POST', body)),
  updateUser: (id, body) => request(`/users/${id}`, json('PUT', body)),
  deleteUser: (id) => request(`/users/${id}`, { method: 'DELETE' }),

  // Reviews
  getReviews: (productId) => request(`/reviews/product/${productId}`),
  addReview: (productId, body) => request(`/reviews/product/${productId}`, json('POST', body)),
  deleteReview: (id) => request(`/reviews/${id}`, { method: 'DELETE' }),

  // Admin dashboard
  getAdminStats: (days = 14) => request(`/admin/stats${qs({ days })}`),
};

export default api;
