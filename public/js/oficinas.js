// public/js/oficinas.js

let _oficinas = [];
let _editandoOficinaId = null;

async function carregarOficinas() {
  const tbody = document.getElementById('tbody-oficinas');
  tbody.innerHTML = '<tr class="loading-row"><td colspan="7"><div class="spinner"></div></td></tr>';
  try {
    _oficinas = await API.oficinas.listar();
    renderOficinas(_oficinas);
  } catch (err) {
    toast(err.message, 'error');
    tbody.innerHTML = '<tr class="loading-row"><td colspan="7">Erro ao carregar dados.</td></tr>';
  }
}

function renderOficinas(lista) {
  const tbody = document.getElementById('tbody-oficinas');
  if (!lista.length) {
    tbody.innerHTML = '<tr class="loading-row"><td colspan="7">Nenhuma oficina cadastrada.</td></tr>';
    return;
  }
  tbody.innerHTML = lista.map(o => `
    <tr>
      <td class="mono">${o.id}</td>
      <td>${o.nome}</td>
      <td>${o.cidade}</td>
      <td class="mono">${o.telefone || '—'}</td>
      <td>${o.especialidade || '—'}</td>
      <td>${badge(o.status)}</td>
      <td>
        <div class="actions-cell">
          <button class="btn btn-blue btn-sm" onclick="abrirEditarOficina(${o.id})">✏️ Editar</button>
          <button class="btn btn-danger btn-sm" onclick="confirmarApagarOficina(${o.id}, '${o.nome.replace(/'/g,"\\'")}')">🗑️</button>
        </div>
      </td>
    </tr>`).join('');
}

function filtrarOficinas(q) {
  const term = q.toLowerCase();
  renderOficinas(_oficinas.filter(o =>
    o.nome.toLowerCase().includes(term) ||
    o.cidade.toLowerCase().includes(term) ||
    (o.especialidade || '').toLowerCase().includes(term)
  ));
}

function abrirCriarOficina() {
  _editandoOficinaId = null;
  document.getElementById('modal-oficina-titulo').textContent = '🔧 Nova Oficina';
  ['o-nome','o-cidade','o-telefone','o-especialidade'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('o-status').value = 'ativa';
  openModal('modal-oficina');
}

async function abrirEditarOficina(id) {
  try {
    const o = await API.oficinas.buscar(id);
    _editandoOficinaId = id;
    document.getElementById('modal-oficina-titulo').textContent = '✏️ Editar Oficina';
    document.getElementById('o-nome').value          = o.nome;
    document.getElementById('o-cidade').value        = o.cidade;
    document.getElementById('o-telefone').value      = o.telefone || '';
    document.getElementById('o-especialidade').value = o.especialidade || '';
    document.getElementById('o-status').value        = o.status;
    openModal('modal-oficina');
  } catch (err) {
    toast(err.message, 'error');
  }
}

async function salvarOficina() {
  const body = formData(['o-nome','o-cidade','o-telefone','o-especialidade','o-status']);
  const payload = {
    nome:         body['o-nome'],
    cidade:       body['o-cidade'],
    telefone:     body['o-telefone'],
    especialidade:body['o-especialidade'],
    status:       body['o-status'],
  };

  try {
    if (_editandoOficinaId) {
      await API.oficinas.atualizar(_editandoOficinaId, payload);
      toast('Oficina atualizada!', 'success');
    } else {
      await API.oficinas.criar(payload);
      toast('Oficina cadastrada!', 'success');
    }
    closeModal('modal-oficina');
    carregarOficinas();
  } catch (err) {
    toast(err.message, 'error');
  }
}

function confirmarApagarOficina(id, nome) {
  createConfirmModal(
    `Deseja remover a oficina <span class="confirm-name">${nome}</span>?`,
    async () => {
      try {
        await API.oficinas.apagar(id);
        toast('Oficina removida.', 'success');
        carregarOficinas();
      } catch (err) {
        toast(err.message, 'error');
      }
    }
  );
}
