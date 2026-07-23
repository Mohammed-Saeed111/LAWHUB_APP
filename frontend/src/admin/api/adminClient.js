// Phase F — Admin Console API client
// Uses the same /api base as the main app but with admin-specific endpoints.

const BASE = import.meta.env.VITE_API_URL || '/api';
let accessToken = null;

export const setAdminToken = (t) => { accessToken = t; };

let refreshing = null;
const doRefresh = async () => {
  const res = await fetch(`${BASE}/auth/refresh`, { method: 'POST', credentials: 'include' });
  if (!res.ok) throw new Error('refresh failed');
  const d = await res.json();
  setAdminToken(d.data.accessToken);
  return d.data.accessToken;
};

const request = async (path, { method = 'GET', body, params, _retry } = {}) => {
  let url = `${BASE}${path}`;
  if (params) {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    ).toString();
    if (qs) url += `?${qs}`;
  }
  const res = await fetch(url, {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && !_retry && !path.includes('/auth/')) {
    try {
      refreshing = refreshing || doRefresh();
      await refreshing;
      refreshing = null;
      return request(path, { method, body, params, _retry: true });
    } catch {
      refreshing = null;
    }
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) throw new Error(data.message || `فشل الطلب (${res.status})`);
  return data.data ?? data;
};

export const adminHttp = {
  get:   (p, params) => request(p, { params }),
  post:  (p, body)   => request(p, { method: 'POST',  body }),
  patch: (p, body)   => request(p, { method: 'PATCH', body }),
  del:   (p)         => request(p, { method: 'DELETE' }),
};
