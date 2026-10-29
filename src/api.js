import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add CSRF token from meta cookie or localStorage if needed
api.interceptors.request.use((config) => {
  const token = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]+)/);
  if (token && config.method === 'post') {
    config.headers['X-CSRF-Token'] = decodeURIComponent(token[1]);
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  logout: () => api.post('/api/auth/logout'),
  profile: () => api.get('/api/auth/profile'),
  updateProfile: (data) => api.post('/api/auth/profile', data),
  changePassword: (data) => api.post('/api/auth/profile/password', data),
  verifyEmail: (token) => api.get(`/api/auth/verify-email/${token}`),
  resendVerification: (email) => api.post('/api/auth/resend-verification', { email }),
  forgotPassword: (email) => api.post('/api/auth/forgot-password', { email }),
  resetPassword: (token, data) => api.post(`/api/auth/reset-password/${token}`, data),
  switchDevice: (data) => api.post('/api/auth/switch-device', data),
};

export const quizAPI = {
  status: () => api.get('/api/quiz/status'),
  dashboard: () => api.get('/api/quiz/'),
  topics: (params) => api.get('/api/quiz/topics', { params }),
  topicIntro: (topicId) => api.get(`/api/quiz/quiz/${topicId}`),
  startQuiz: (topicId, params) => api.get(`/api/quiz/quiz/${topicId}/start`, { params }),
  submitQuiz: (topicId, answers) => api.post(`/api/quiz/quiz/${topicId}`, answers),
  read: (topicId) => api.get(`/api/quiz/read/${topicId}`),
  completeRead: (topicId) => api.post(`/api/quiz/read/${topicId}/complete`),
  review: () => api.get('/api/quiz/review'),
  submitReview: (answers) => api.post('/api/quiz/review', answers),
  dailyQuest: () => api.get('/api/quiz/daily-quest'),
  submitDailyQuest: (answers) => api.post('/api/quiz/daily-quest', answers),
  lightning: () => api.get('/api/quiz/lightning'),
  submitLightning: (answers) => api.post('/api/quiz/lightning', answers),
  buddy: () => api.get('/api/quiz/api/buddy'),
  buddyChat: (data) => api.post('/api/quiz/api/buddy/chat', data),
  hint: (questionId) => api.get(`/api/quiz/api/hint?questionId=${questionId}`),
  tutor: (data) => api.post('/api/quiz/api/tutor', data),
};

export const scoresAPI = {
  myScores: () => api.get('/api/scores/'),
};

export const leaderboardAPI = {
  leaderboard: () => api.get('/api/leaderboard/'),
};

export const adminAPI = {
  dashboard: () => api.get('/api/admin/'),
  users: (params) => api.get('/api/admin/users', { params }),
  userDetail: (id) => api.get(`/api/admin/users/${id}`),
  courses: () => api.get('/api/admin/courses'),
  createCourse: (data) => api.post('/api/admin/courses', data),
  topics: () => api.get('/api/admin/topics'),
  createTopic: (data) => api.post('/api/admin/topics', data),
  questions: (params) => api.get('/api/admin/questions', { params }),
  createQuestion: (data) => api.post('/api/admin/questions', data),
  materials: () => api.get('/api/admin/materials'),
  announcements: () => api.get('/api/admin/announcements'),
  ai: () => api.get('/api/admin/ai'),
};

export const coursesAPI = {
  courses: () => api.get('/api/courses'),
};

export const notificationsAPI = {
  notifications: () => api.get('/api/notifications'),
  markRead: (ids) => api.post('/api/notifications/mark-read', { ids }),
};

export default api;
