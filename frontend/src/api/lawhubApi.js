import { api } from './client.js';
import { withId, withIds, normalizeReview } from './normalize.js';

const lawhubApi = {
  // Screen 1
  getCategories: async () => (await api.get('/categories')).categories,
  getCities: async () => (await api.get('/cities')).cities,
  getArticles: async () => withIds((await api.get('/articles')).articles),

  // Screens 1/2/3 — list + filter + search
  getLawyers: async (params) => {
    const d = await api.get('/lawyers', params);
    return { ...d, lawyers: withIds(d.lawyers) };
  },

  // Screen 4
  getLawyer: async (id) => withId((await api.get(`/lawyers/${id}`)).lawyer),
  getLawyerReviews: async (id) =>
    (await api.get(`/lawyers/${id}/reviews`)).reviews.map(normalizeReview),

  // Screen 5 — favorites
  getFavorites: async () => {
    const d = await api.get('/favorites');
    return { lawyers: withIds(d.lawyers), ids: (d.ids || []).map(String) };
  },
  toggleFavorite: async (lawyerId) =>
    (await api.post(`/favorites/${lawyerId}/toggle`)).favorited,

  // Screens 6/7 — booking + escrow payment
  createConsultation: async (payload) =>
    withId((await api.post('/consultations', payload)).consultation),
  payConsultation: async (id, method) =>
    withId((await api.post(`/consultations/${id}/pay`, { method })).consultation),
  getConsultations: async () => withIds((await api.get('/consultations')).consultations),

  // Screen 8
  getCases: async (params) => withIds((await api.get('/cases', params)).cases),
};

export default lawhubApi;
