/**
 * Phase D — Legal Commerce & AI Intelligence API
 * Uses the same axios client as the rest of the app (auto-attaches Bearer token,
 * refreshes on 401).
 */
import { api } from './client.js';

const withId = (d) => (d ? { ...d, id: d._id ?? d.id } : d);
const withIds = (a = []) => a.map(withId);

export const dApi = {
  // ---- Marketplace ----
  templates: async (params) => {
    const d = await api.get('/templates', params);
    return { templates: withIds(d.templates), categories: d.categories };
  },
  template: async (id) => withId((await api.get(`/templates/${id}`)).template),

  // ---- Purchase & Transactions ----
  purchase: async (body) => withId((await api.post('/purchase', body)).transaction),
  sign: async (id, body) => withId((await api.patch(`/transactions/${id}/sign`, body)).transaction),
  transaction: async (id) => withId((await api.get(`/transactions/${id}`)).transaction),
  myTransactions: async () => withIds((await api.get('/transactions')).transactions),

  // ---- AI ----
  analyze: async (body) => withId((await api.post('/ai/analyze', body)).report),
  advise: async (body) => withId((await api.post('/ai/advise', body)).advice),
};
