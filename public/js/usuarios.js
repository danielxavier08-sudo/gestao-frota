// public/js/usuarios.js — Admin > Usuários

async function carregarUsuarios() {
  const tbody = document.getElementById('tbody-usuarios');
  tbody.innerHTML = '<tr class="loading-row"><td colspan="6"><div class="spinner"></div></td></tr>';
  try {
    const lista = await API.usuarios.listar();
    if (!lista.length) {
      tbody.innerHTML = '<tr class="loading-row"><td colspan="6">Nenhum usuário cadastrado.</td></tr>';
      return;
    }
    const eu = Auth.getUser()?.id;
    tbody.innerHTML = lista.map(u => `
      <tr>
        <td class="mono">${esc(u.id)}</td>
        <td>${esc(u.nome)}</td>
        <td class="mono">${esc(u.email)}</td>
        <td><span class="badge ${u.perfil === 'admin' ? 'badge-ativo' : 'badge-manutencao'}">${esc(u.perfil)}</span></td>
        <td class="mono">${fmtData(u.criado_em)}</td>
        <td>
          <div class="actions-cell">
            ${u.id === eu
              ? '<span class="mono" style="color:var(--text-muted)">você</span>'
              : `<button class="btn btn-danger btn-sm" onclick="confirmarApagarUsuario(${Number(u.id)}, '${esc(u.email)}')">🗑️</button>`}
          </div>
        </td>
      </tr>`).join('');
  } catch (err) {
    toast(err.message, 'error');
    tbody.innerHTML = '<tr class="loading-row"><td colspan="6">Erro ao carregar dados.</td></tr>';
  }
}

function abrirCriarUsuario() {
  ['u-nome', 'u-email', 'u-senha'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('u-perfil').value = 'operador';
  openModal('modal-usuario');
}

async function salvarUsuario() {
  const d = formData(['u-nome', 'u-email', 'u-senha', 'u-perfil']);
  try {
    await API.usuarios.criar({
      nome: d['u-nome'], email: d['u-email'], senha: document.getElementById('u-senha').value, perfil: d['u-perfil'],
    });
    toast('Usuário cadastrado!', 'success');
    closeModal('modal-usuario');
    carregarUsuarios();
  } catch (err) {
    toast(err.message, 'error');
  }
}

function confirmarApagarUsuario(id, email) {
  createConfirmModal(
    `Deseja remover o usuário <span class="confirm-name">${email}</span>? Esta ação não pode ser desfeita.`,
    async () => {
      try {
        await API.usuarios.apagar(id);
        toast('Usuário removido.', 'success');
        carregarUsuarios();
      } catch (err) {
        toast(err.message, 'error');
      }
    }
  );
}
