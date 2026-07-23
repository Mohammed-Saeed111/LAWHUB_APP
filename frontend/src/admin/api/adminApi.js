// Phase F — Admin Console API methods
import { adminHttp, setAdminToken } from './adminClient.js';

export { setAdminToken };

const withId  = (d)    => (d ? { ...d, id: d._id ?? d.id } : d);
const withIds = (a = []) => a.map(withId);

export const adminAuthApi = {
  login:   (p) => adminHttp.post('/auth/login', p),
  refresh: ()  => adminHttp.post('/auth/refresh'),
  logout:  ()  => adminHttp.post('/auth/logout'),
  me:      ()  => adminHttp.get('/auth/me'),
};

export const fApi = {
  // F1 - Overview
  overview:     () => adminHttp.get('/admin/overview'),
  // F2 - Analytics
  analytics:    () => adminHttp.get('/admin/analytics'),
  // F3 - Subscriptions
  subscriptions: async () => withIds((await adminHttp.get('/admin/subscriptions')).subscriptions),
  updateSubscription: (id, body) => adminHttp.patch(`/admin/subscriptions/${id}`, body),
  // F4 - Users
  users: async (params) => withIds((await adminHttp.get('/admin/users', params)).users),
  updateUser: async (id, body) => withId((await adminHttp.patch(`/admin/users/${id}`, body)).user),
  // F5 - Verifications
  verifications: async (params) => withIds((await adminHttp.get('/admin/verifications', params)).verifications),
  reviewVerification: (id, body) => adminHttp.patch(`/admin/verifications/${id}`, body),
  // F6 - Articles CMS
  articles: async () => withIds((await adminHttp.get('/admin/articles')).articles),
  createArticle: async (body) => withId((await adminHttp.post('/admin/articles', body)).article),
  updateArticle: async (id, body) => withId((await adminHttp.patch(`/admin/articles/${id}`, body)).article),
  deleteArticle: (id) => adminHttp.del(`/admin/articles/${id}`),
  // F7 - Videos CMS
  videos: async () => withIds((await adminHttp.get('/admin/videos')).videos),
  updateVideo: async (id, body) => withId((await adminHttp.patch(`/admin/videos/${id}`, body)).video),
  // F8 - Reviews
  reviews: async () => {
    const d = await adminHttp.get('/admin/reviews');
    return { reviews: withIds(d.reviews), sentiment: d.sentiment };
  },
  moderateReview: (id, status) => adminHttp.patch(`/admin/reviews/${id}`, { status }),
  // F9 - System health
  health:  () => adminHttp.get('/admin/health'),
  // F11 - Roadmap
  roadmap: async () => withIds((await adminHttp.get('/admin/roadmap')).modules),
  notify:  (body) => adminHttp.post('/admin/notify', body),
};
