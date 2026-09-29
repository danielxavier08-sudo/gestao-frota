// public/js/app.js — páginas públicas (Inicial, Detalhes, Autor) e autenticação
// O roteamento fica em router.js

// Escapa texto vindo da API antes de usar em innerHTML
function esc(v) {
  return String(v ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ── Inicial (/) ───────────────────────────────────────────────
async function carregarInicial() {
  const tbody = document.getElementById('tbody-inicial');
  tbody.innerHTML = '<tr class="loading-row"><td colspan="5"><div class="spinner"></div></td></tr>';
  try {
    const veiculos = await API.veiculos.listar();
    const cont = st => veiculos.filter(v => v.status === st).length;

    document.getElementById('dash-veiculos').textContent = veiculos.length;
    document.getElementById('dash-ativos').textContent   = cont('ativo');
    document.getElementById('dash-manut').textContent    = cont('manutencao');
    document.getElementById('dash-inativos').textContent = cont('inativo');

    tbody.innerHTML = veiculos.length ? veiculos.map(v => `
      <tr>
        <td class="mono">${esc(v.placa)}</td>
        <td>${esc(v.modelo)}</td>
        <td class="mono">${esc(v.ano)}</td>
        <td>${badge(v.status)}</td>
        <td><a class="btn btn-blue btn-sm" href="/veiculos/${encodeURIComponent(v.id)}" data-link>Detalhes →</a></td>
      </tr>`).join('')
      : '<tr class="loading-row"><td colspan="5">Nenhum veículo cadastrado.</td></tr>';
  } catch (err) {
    toast(err.message, 'error');
    tbody.innerHTML = '<tr class="loading-row"><td colspan="5">Erro ao carregar dados.</td></tr>';
  }
}

// ── Detalhes (/veiculos/:id) ──────────────────────────────────
async function carregarDetalhes(id) {
  const box = document.getElementById('det-conteudo');
  document.getElementById('det-editar').classList.toggle('hidden', !Auth.isLogged());
  box.innerHTML = '<div class="spinner" style="margin:2rem auto"></div>';
  try {
    const v = await API.veiculos.buscar(id);
    document.getElementById('det-titulo').textContent = `${v.modelo} · ${v.placa}`;
    box.innerHTML = `
      <table>
        <tbody>
          <tr><th>ID</th><td class="mono">${esc(v.id)}</td></tr>
          <tr><th>Placa</th><td class="mono">${esc(v.placa)}</td></tr>
          <tr><th>Modelo</th><td>${esc(v.modelo)}</td></tr>
          <tr><th>Ano</th><td class="mono">${esc(v.ano)}</td></tr>
          <tr><th>Quilometragem</th><td class="mono">${fmtKm(v.km)}</td></tr>
          <tr><th>Status</th><td>${badge(v.status)}</td></tr>
          <tr><th>Cadastrado em</th><td>${fmtData(v.criado_em)}</td></tr>
          <tr><th>Atualizado em</th><td>${fmtData(v.atualizado_em)}</td></tr>
        </tbody>
      </table>`;
  } catch (err) {
    document.getElementById('det-titulo').textContent = 'Veículo não encontrado';
    box.innerHTML = `<p style="padding:1.5rem">${esc(err.message)}</p>`;
  }
}

// ── Autor (/autor) ────────────────────────────────────────────
async function carregarAutor() {
  const box = document.getElementById('autor-conteudo');
  box.innerHTML = '<div class="spinner" style="margin:2rem auto"></div>';
  try {
    const a = await API.autor();
    box.innerHTML = `
      <table>
        <tbody>
          <tr><th>Nome</th><td>${esc(a.nome)}</td></tr>
          <tr><th>Matrícula</th><td class="mono">${esc(a.matricula)}</td></tr>
          <tr><th>Curso</th><td>${esc(a.curso)}</td></tr>
          <tr><th>Instituição</th><td>${esc(a.instituicao)}</td></tr>
          <tr><th>Disciplina</th><td>${esc(a.disciplina)}</td></tr>
          <tr><th>GitHub</th><td><a href="${esc(a.github)}" target="_blank" rel="noopener" style="color:var(--accent)">${esc(a.github)}</a></td></tr>
        </tbody>
      </table>`;
  } catch (err) {
    box.innerHTML = `<p style="padding:1.5rem">${esc(err.message)}</p>`;
  }
}

// ── Login (/login) ────────────────────────────────────────────
async function handleLogin() {
  const email  = document.getElementById('login-email').value.trim();
  const senha  = document.getElementById('login-senha').value;
  const btn    = document.getElementById('btn-login');
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

    // Volta para a página que o usuário tentou abrir (só caminhos internos)
    const redirect = new URLSearchParams(location.search).get('redirect');
    Router.navigate(redirect && redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/admin/objeto');
  } catch (err) {
    erroEl.textContent = err.message;
    erroEl.classList.remove('hidden');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Entrar →';
  }
}

function handleLogout() {
  Auth.removeToken();
  toast('Sessão encerrada.', 'info');
  Router.navigate('/');
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('login-senha')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleLogin();
  });
  Router.init();
});
