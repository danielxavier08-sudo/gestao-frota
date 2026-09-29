// public/js/router.js — roteador SPA (History API)
//
// Rotas:
//   /                  Inicial
//   /veiculos/:id      Detalhes
//   /login             Login
//   /admin/objeto      Admin > Objeto (veículos)
//   /admin/usuarios    Admin > Usuários
//   /autor             Autor
//
// O servidor devolve o index.html para qualquer caminho do front
// (fallback em src/app.js), então o refresh e links diretos funcionam.

const Router = (() => {

  // auth:  exige usuário logado
  // admin: exige perfil "admin"
  const routes = [
    { pattern: '/',                view: 'view-inicial',    nav: '/',               load: () => carregarInicial() },
    { pattern: '/veiculos/:id',    view: 'view-detalhes',   nav: '/',               load: p => carregarDetalhes(p.id) },
    { pattern: '/login',           view: 'login-screen',    login: true },
    { pattern: '/admin',           redirect: '/admin/objeto' },
    { pattern: '/admin/objeto',    view: 'page-veiculos',   nav: '/admin/objeto',   auth: true, load: () => carregarVeiculos() },
    { pattern: '/admin/usuarios',  view: 'page-usuarios',   nav: '/admin/usuarios', auth: true, admin: true, load: () => carregarUsuarios() },
    { pattern: '/admin/motoristas',view: 'page-motoristas', nav: '/admin/motoristas', auth: true, load: () => carregarMotoristas() },
    { pattern: '/admin/oficinas',  view: 'page-oficinas',   nav: '/admin/oficinas', auth: true, load: () => carregarOficinas() },
    { pattern: '/autor',           view: 'view-autor',      nav: '/autor',          load: () => carregarAutor() },
  ];

  const allViews = [...new Set(routes.filter(r => r.view).map(r => r.view)), 'view-404'];

  // "/veiculos/:id" -> regex + nomes dos parâmetros
  function compile(pattern) {
    const names = [];
    const rx = pattern.replace(/:([A-Za-z]+)/g, (_, n) => { names.push(n); return '([^/]+)'; });
    return { rx: new RegExp(`^${rx}/?$`), names };
  }

  function match(path) {
    for (const route of routes) {
      const { rx, names } = compile(route.pattern);
      const m = path.match(rx);
      if (m) {
        const params = {};
        names.forEach((n, i) => params[n] = decodeURIComponent(m[i + 1]));
        return { route, params };
      }
    }
    return null;
  }

  function navigate(path, { replace = false } = {}) {
    if (path === location.pathname + location.search) { render(); return; }
    history[replace ? 'replaceState' : 'pushState']({}, '', path);
    render();
  }

  function render() {
    const found = match(location.pathname);

    // Rota inexistente
    if (!found) return showView('view-404', { shell: true, nav: null });

    const { route, params } = found;

    if (route.redirect) return navigate(route.redirect, { replace: true });

    // Já logado e abrindo /login → manda para o admin
    if (route.login && Auth.isLogged()) return navigate('/admin/objeto', { replace: true });

    // Guarda de autenticação
    if (route.auth && !Auth.isLogged()) {
      const back = encodeURIComponent(location.pathname);
      return navigate(`/login?redirect=${back}`, { replace: true });
    }

    // Guarda de perfil admin
    if (route.admin && Auth.getUser()?.perfil !== 'admin') {
      toast('Acesso restrito a administradores.', 'error');
      return navigate('/admin/objeto', { replace: true });
    }

    showView(route.view, { shell: !route.login, nav: route.nav });
    updateShell();
    route.load?.(params);
    window.scrollTo(0, 0);
  }

  function showView(id, { shell, nav }) {
    document.getElementById('login-screen').classList.toggle('hidden', shell);
    document.getElementById('app').classList.toggle('hidden', !shell);

    allViews.forEach(v => { if (v !== 'login-screen') document.getElementById(v)?.classList.add('hidden'); });
    if (id !== 'login-screen') document.getElementById(id)?.classList.remove('hidden');

    document.querySelectorAll('.nav-item[data-nav]').forEach(el =>
      el.classList.toggle('active', el.dataset.nav === nav));
  }

  // Sidebar: mostra/oculta itens conforme o estado de login e o perfil
  function updateShell() {
    const logged = Auth.isLogged();
    const user   = Auth.getUser();

    document.querySelectorAll('[data-auth="in"]').forEach(el  => el.classList.toggle('hidden', !logged));
    document.querySelectorAll('[data-auth="out"]').forEach(el => el.classList.toggle('hidden', logged));
    document.querySelectorAll('[data-role="admin"]').forEach(el =>
      el.classList.toggle('hidden', !(logged && user?.perfil === 'admin')));

    if (logged && user) {
      document.getElementById('user-name').textContent   = user.nome;
      document.getElementById('user-role').textContent   = user.perfil;
      document.getElementById('user-avatar').textContent = user.nome.charAt(0).toUpperCase();
    }
  }

  // Intercepta cliques em links internos (a[data-link]) — sem recarregar a página
  function init() {
    document.addEventListener('click', e => {
      const a = e.target.closest('a[data-link]');
      if (!a || e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      navigate(a.getAttribute('href'));
    });
    window.addEventListener('popstate', render);
    render();
  }

  return { init, navigate, render };
})();
