import api from "./axiosConfig";

// Auth API
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  getCurrentUser: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/profile", data),
  changePassword: (data) => api.put("/auth/change-password", data),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (data) => api.post("/auth/reset-password", data),
  verifyEmail: (token) => api.post("/auth/verify-email", { token }),
};

// Products API
export const productsAPI = {
  getAllProducts: (params) => api.get("/products", { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  getFeaturedProducts: () => api.get("/products/featured"),
  searchProducts: (query, params) =>
    api.get("/products/search", { params: { query, ...params } }),
  getProductsByCategory: (category, params) =>
    api.get(`/products/category/${category}`, { params }),
  rateProduct: (id, rating) => api.put(`/products/${id}/rating`, { rating }),
  createProduct: (data) => api.post("/products", data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

// Cart API
export const cartAPI = {
  getCart: () => api.get("/cart"),
  addToCart: (data) => api.post("/cart/add", data),
  updateCartItem: (itemId, data) => api.put(`/cart/${itemId}`, data),
  removeFromCart: (itemId) => api.delete(`/cart/${itemId}`),
  clearCart: () => api.delete("/cart"),
  applyCoupon: (couponCode) => api.post("/cart/coupon", { couponCode }),
};

// Orders API
export const ordersAPI = {
  getOrders: (params) => api.get("/orders", { params }),
  getOrder: (id) => api.get(`/orders/${id}`),
  createOrder: (data) => api.post("/orders", data),
  cancelOrder: (id, reason) =>
    api.put(`/orders/${id}/cancel`, { cancellationReason: reason }),
  getAllOrders: (params) => api.get("/orders/admin/all", { params }),
  updateOrderStatus: (id, status) =>
    api.put(`/orders/${id}/status`, { orderStatus: status }),
  updatePaymentStatus: (id, status, transactionId) =>
    api.put(`/orders/${id}/payment`, { paymentStatus: status, transactionId }),
};

// Rentals API
export const rentalsAPI = {
  getRentals: (params) => api.get("/rentals", { params }),
  getRental: (id) => api.get(`/rentals/${id}`),
  getOverdueRentals: () => api.get("/rentals/overdue"),
  startRental: (orderId, deliveryDetails) =>
    api.post(`/rentals/start/${orderId}`, { deliveryDetails }),
  requestReturn: (id, data) => api.put(`/rentals/${id}/request-return`, data),
  completeReturn: (id, data) => api.put(`/rentals/${id}/complete-return`, data),
  extendRental: (id, days, cost) =>
    api.put(`/rentals/${id}/extend`, { days, cost }),
  submitReview: (id, rating, review) =>
    api.put(`/rentals/${id}/review`, { rating, review }),
  getAllRentals: (params) => api.get("/rentals/admin/all", { params }),
};

// Maintenance API
export const maintenanceAPI = {
  getRequests: (params) => api.get("/maintenance", { params }),
  getRequest: (id) => api.get(`/maintenance/${id}`),
  createRequest: (data) => api.post("/maintenance", data),
  updateRequest: (id, data) => api.put(`/maintenance/${id}`, data),
  closeRequest: (id) => api.put(`/maintenance/${id}/close`),
  submitFeedback: (id, rating, feedback) =>
    api.put(`/maintenance/${id}/feedback`, {
      satisfactionRating: rating,
      feedback,
    }),
  getAllRequests: (params) => api.get("/maintenance/admin/all", { params }),
  assignTechnician: (id, technicianId) =>
    api.put(`/maintenance/${id}/assign`, { technicianId }),
  resolveRequest: (id, notes, cost) =>
    api.put(`/maintenance/${id}/resolve`, {
      resolutionNotes: notes,
      actualCost: cost,
    }),
  rejectRequest: (id, reason) =>
    api.put(`/maintenance/${id}/reject`, { rejectionReason: reason }),
};

export default {
  auth: authAPI,
  products: productsAPI,
  cart: cartAPI,
  orders: ordersAPI,
  rentals: rentalsAPI,
  maintenance: maintenanceAPI,
};
