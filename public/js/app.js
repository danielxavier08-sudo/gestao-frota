// public/js/app.js — roteador de páginas e autenticação

// ── Roteador simples ──────────────────────────────────────────
const pages = ['dashboard', 'veiculos', 'motoristas', 'oficinas'];

function showPage(name) {
  pages.forEach(p => {
    document.getElementById(`page-${p}`)?.classList.add('hidden');
    document.querySelector(`.nav-item[data-page="${p}"]`)?.classList.remove('active');
  });
  document.getElementById(`page-${name}`)?.classList.remove('hidden');
  document.querySelector(`.nav-item[data-page="${name}"]`)?.classList.add('active');

  // Carrega dados da página ativa
  const loaders = {
    veiculos:    carregarVeiculos,
    motoristas:  carregarMotoristas,
    oficinas:    carregarOficinas,
    dashboard:   carregarDashboard,
  };
  loaders[name]?.();
}

// ── Dashboard ─────────────────────────────────────────────────
async function carregarDashboard() {
  try {
    const [veiculos, motoristas, oficinas] = await Promise.all([
      API.veiculos.listar(),
      API.motoristas.listar(),
      API.oficinas.listar(),
    ]);
    document.getElementById('dash-veiculos').textContent   = veiculos.length;
    document.getElementById('dash-ativos').textContent     = veiculos.filter(v => v.status === 'ativo').length;
    document.getElementById('dash-motoristas').textContent = motoristas.length;
    document.getElementById('dash-oficinas').textContent   = oficinas.filter(o => o.status === 'ativa').length;

    // Mini tabela últimos veículos
    const tbody = document.getElementById('tbody-dash-veiculos');
    const recentes = veiculos.slice(0, 5);
    tbody.innerHTML = recentes.map(v => `
      <tr>
        <td class="mono">${v.placa}</td>
        <td>${v.modelo}</td>
        <td class="mono">${v.ano}</td>
        <td>${badge(v.status)}</td>
      </tr>`).join('');
  } catch (err) {
    toast(err.message, 'error');
  }
}

// ── Login ─────────────────────────────────────────────────────
function showLogin() {
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('app').classList.add('hidden');
}

function showApp() {
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');

  const user = Auth.getUser();
  if (user) {
    document.getElementById('user-name').textContent  = user.nome;
    document.getElementById('user-role').textContent  = user.perfil;
    document.getElementById('user-avatar').textContent = user.nome.charAt(0).toUpperCase();
  }
  showPage('dashboard');
}

async function handleLogin() {
  const email = document.getElementById('login-email').value.trim();
  const senha = document.getElementById('login-senha').value;
  const btn   = document.getElementById('btn-login');
  const erroEl = document.getElementById('login-erro');

  if (!email || !senha) {
    erroEl.textContent = 'Preencha e-mail e senha.';
    erroEl.classList.remove('hidden');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Entrando...';
  erroEl.classList.add('hidden');

  try {
    const data = await API.login(email, senha);
    Auth.setToken(data.token);
    Auth.setUser(data.usuario);
    showApp();
  } catch (err) {
    erroEl.textContent = err.message;
    erroEl.classList.remove('hidden');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Entrar';
  }
}

function handleLogout() {
  Auth.removeToken();
  showLogin();
  toast('Sessão encerrada.', 'info');
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Enter no login
  document.getElementById('login-senha')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleLogin();
  });

  // Verifica se já está logado
  if (Auth.isLogged()) {
    showApp();
  } else {
    showLogin();
  }
});
