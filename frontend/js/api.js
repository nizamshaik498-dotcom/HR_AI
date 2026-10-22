const $ = (id) => document.getElementById(id);

const API = {
  token: () => localStorage.getItem('token'),
  async req(path, opts = {}) {
    const headers = { 'Content-Type': 'application/json' };
    if (API.token()) headers.Authorization = 'Bearer ' + API.token();
    const res = await fetch('/api' + path, {
      method: opts.method || 'GET',
      headers,
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401 && API.token()) {
      localStorage.removeItem('token');
      location.href = '/login.html';
    }
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  },
  logout() { localStorage.clear(); location.href = '/login.html'; },
};