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

// ─────────────────────────────────────────────────────────────────
// Phase C — Lawyer Workspace API  (/api/workspace/*)
// ─────────────────────────────────────────────────────────────────
const ws = (path, params) => api.get(`/workspace${path}`, params);
const wsp = (path, body)  => api.patch(`/workspace${path}`, body);

export const workspaceApi = {
  // C1 — Dashboard
  dashboard: () => ws('/dashboard'),

  // C2 — Calendar
  calendar: async () => withIds((await ws('/calendar')).events),

  // C3 — Cases list
  cases: async (params) => withIds((await ws('/cases', params)).cases),

  // C4 — Case details
  case: async (id) => withId((await ws(`/cases/${id}`)).case),

  // C6 — Assign case
  assignCase: (id, assignedTo) => wsp(`/cases/${id}/assign`, { assignedTo }),

  // C5 — Team
  team: async () => withIds((await ws('/team')).team),
  setPermission: (id, permission) => wsp(`/team/${id}/permission`, { permission }),

  // C7/C8 — Profile (services + membership)
  profile: async () => (await ws('/profile')).profile,
  updateProfile: (body) => wsp('/profile', body),

  // C9 — Plans
  plans: async () => withIds((await ws('/plans')).plans),

  // C10 — Reviews
  reviews: async () => {
    const d = await ws('/reviews');
    return { reviews: withIds(d.reviews), stats: d.stats };
  },
  disputeReview: (id) => wsp(`/reviews/${id}/dispute`),
};

