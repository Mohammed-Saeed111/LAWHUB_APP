/**
 * Phase E — Community, Education & Communication API
 * Uses the same axios client as the rest of the app (auto-attaches Bearer token,
 * refreshes on 401).
 */
import { api } from './client.js';

const withId = (d) => (d ? { ...d, id: d._id ?? d.id } : d);
const withIds = (a = []) => a.map(withId);

export const eApi = {
  // ---- E1: Video Library ----
  videos: async (params) => {
    const d = await api.get('/videos', params);
    return { videos: withIds(d.videos), featured: withId(d.featured), categories: d.categories };
  },

  // ---- E2: Legal News ----
  news: async () => {
    const d = await api.get('/news');
    return { news: withIds(d.news), featured: withId(d.featured) };
  },

  // ---- E3: Chat ----
  conversations: async () => withIds((await api.get('/conversations')).conversations),
  messages: async (id) => withIds((await api.get(`/conversations/${id}/messages`)).messages),
  sendMessage: async (id, body) => withId((await api.post(`/conversations/${id}/messages`, body)).message),

  // ---- E4: Notifications ----
  notifications: async () => withIds((await api.get('/notifications')).notifications),
  readNotification: (id) => api.patch(`/notifications/${id}/read`),
  readAll: () => api.patch('/notifications/read-all'),

  // ---- E5: Referral & Rewards ----
  referral: () => api.get('/referral'),

  // ---- E6: Financial Reports ----
  finance: () => api.get('/finance'),

  // ---- E7: Help Center ----
  faqs: async () => withIds((await api.get('/faqs')).faqs),
  tickets: async () => withIds((await api.get('/tickets')).tickets),
  createTicket: async (body) => withId((await api.post('/tickets', body)).ticket),
};
