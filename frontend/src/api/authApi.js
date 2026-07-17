import axiosClient from './axiosClient.js';

/**
 * Auth API — maps 1:1 to backend /api/auth endpoints.
 * All functions return the parsed response payload (res.data).
 */
const authApi = {
  register: (payload) => axiosClient.post('/auth/register', payload).then((r) => r.data),

  verifyOtp: ({ email, code }) =>
    axiosClient.post('/auth/verify-otp', { email, code }).then((r) => r.data),

  resendOtp: (email) => axiosClient.post('/auth/resend-otp', { email }).then((r) => r.data),

  login: (payload) => axiosClient.post('/auth/login', payload).then((r) => r.data),

  forgotPassword: (email) =>
    axiosClient.post('/auth/forgot-password', { email }).then((r) => r.data),

  resetPassword: (payload) =>
    axiosClient.post('/auth/reset-password', payload).then((r) => r.data),

  setupMfa: (method) => axiosClient.post('/auth/mfa/setup', { method }).then((r) => r.data),

  toggleBiometric: (enabled) =>
    axiosClient.post('/auth/biometric/toggle', { enabled }).then((r) => r.data),

  // FormData (multipart) — license document upload for lawyers / firms.
  submitLawyerCredentials: (formData) =>
    axiosClient
      .post('/auth/lawyer/credentials', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data),

  refresh: () => axiosClient.post('/auth/refresh').then((r) => r.data),

  logout: () => axiosClient.post('/auth/logout').then((r) => r.data),

  getMe: () => axiosClient.get('/auth/me').then((r) => r.data),
};

export default authApi;
