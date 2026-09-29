// public/js/api.js — camada de comunicação com o back-end

const API_BASE = '/api/v1';

// ── Token JWT ────────────────────────────────────────────────
const Auth = {
  getToken()        { return localStorage.getItem('frota_token'); },
  setToken(t)       { localStorage.setItem('frota_token', t); },
  removeToken()     { localStorage.removeItem('frota_token'); localStorage.removeItem('frota_user'); },
  getUser()         { return JSON.parse(localStorage.getItem('frota_user') || 'null'); },
  setUser(u)        { localStorage.setItem('frota_user', JSON.stringify(u)); },
  isLogged()        { return !!this.getToken(); },
};

// ── Fetch helper ─────────────────────────────────────────────
async function apiFetch(path, options = {}) {
  const token = Auth.getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(API_BASE + path, { ...options, headers });

  if (res.status === 401) {
    // 401 em rota protegida: limpa a sessão e leva ao /login
    // (o login em si também responde 401 com "credenciais inválidas")
    if (Auth.isLogged()) {
      Auth.removeToken();
      Router.navigate('/login');
      throw new Error('Sessão expirada. Faça login novamente.');
    }
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.erro || `Erro ${res.status}`);
  }
  return data;
}

// ── CRUD helpers ─────────────────────────────────────────────
const API = {
  // Veículos
  veiculos: {
    listar:       ()      => apiFetch('/veiculos'),
    buscar:       (id)    => apiFetch(`/veiculos/${id}`),
    criar:        (body)  => apiFetch('/veiculos', { method: 'POST',   body: JSON.stringify(body) }),
    atualizar:    (id, b) => apiFetch(`/veiculos/${id}`, { method: 'PUT',    body: JSON.stringify(b) }),
    apagar:       (id)    => apiFetch(`/veiculos/${id}`, { method: 'DELETE' }),
  },
  // Motoristas
  motoristas: {
    listar:       ()      => apiFetch('/motoristas'),
    buscar:       (id)    => apiFetch(`/motoristas/${id}`),
    criar:        (body)  => apiFetch('/motoristas', { method: 'POST',   body: JSON.stringify(body) }),
    atualizar:    (id, b) => apiFetch(`/motoristas/${id}`, { method: 'PUT',    body: JSON.stringify(b) }),
    apagar:       (id)    => apiFetch(`/motoristas/${id}`, { method: 'DELETE' }),
  },
  // Oficinas
  oficinas: {
    listar:       ()      => apiFetch('/oficinas'),
    buscar:       (id)    => apiFetch(`/oficinas/${id}`),
    criar:        (body)  => apiFetch('/oficinas', { method: 'POST',   body: JSON.stringify(body) }),
    atualizar:    (id, b) => apiFetch(`/oficinas/${id}`, { method: 'PUT',    body: JSON.stringify(b) }),
    apagar:       (id)    => apiFetch(`/oficinas/${id}`, { method: 'DELETE' }),
  },
  // Usuários (admin)
  usuarios: {
    listar:       ()      => apiFetch('/usuarios'),
    criar:        (body)  => apiFetch('/usuarios', { method: 'POST',   body: JSON.stringify(body) }),
    apagar:       (id)    => apiFetch(`/usuarios/${id}`, { method: 'DELETE' }),
  },
  // Autor (público)
  autor: () => apiFetch('/autor'),
  // Auth
  login: (email, senha) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, senha }) }),
};
