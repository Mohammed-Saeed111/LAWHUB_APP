import axiosClient from './axiosClient.js';

/**
 * Thin request helper used by lawhubApi. It delegates to the shared axios
 * instance (api/axiosClient.js) so client-journey requests automatically:
 *  - attach the Bearer access token, and
 *  - refresh it on a 401 and retry.
 * Returns the unwrapped payload (res.data.data ?? res.data).
 */
const request = async (path, { method = 'GET', body, params } = {}) => {
  const res = await axiosClient.request({
    url: path,
    method,
    data: body,
    params,
  });
  const d = res.data;
  return d?.data ?? d;
};

export const api = {
  get: (p, params) => request(p, { params }),
  post: (p, body) => request(p, { method: 'POST', body }),
  patch: (p, body) => request(p, { method: 'PATCH', body }),
  del: (p) => request(p, { method: 'DELETE' }),
};
