import API from './api';

export const authService = {
  signup: (data) => API.post('/auth/signup', data),
  signin: (data) => API.post('/auth/signin', data),
  getMe: () => API.get('/auth/me'),
  forgotPassword: (email) => API.post('/auth/forgot-password', { email }),
  verifyOTP: (data) => API.post('/auth/verify-otp', data),
  resetPassword: (data) => API.post('/auth/reset-password', data),
  changePassword: (data) => API.post('/auth/change-password', data),
};

export const transactionService = {
  getAll: (params) => API.get('/transactions', { params }),
  getById: (id) => API.get(`/transactions/${id}`),
  create: (data) => API.post('/transactions', data),
  update: (id, data) => API.put(`/transactions/${id}`, data),
  delete: (id) => API.delete(`/transactions/${id}`),
};

export const profileService = {
  get: () => API.get('/profile'),
  update: (data) => API.put('/profile', data),
};

export const dashboardService = {
  getSummary: () => API.get('/dashboard/summary'),
};
