// public/js/motoristas.js

let _motoristas = [];
let _editandoMotoristaId = null;

async function carregarMotoristas() {
  const tbody = document.getElementById('tbody-motoristas');
  tbody.innerHTML = '<tr class="loading-row"><td colspan="7"><div class="spinner"></div></td></tr>';
  try {
    _motoristas = await API.motoristas.listar();
    renderMotoristas(_motoristas);
  } catch (err) {
    toast(err.message, 'error');
    tbody.innerHTML = '<tr class="loading-row"><td colspan="7">Erro ao carregar dados.</td></tr>';
  }
}

function renderMotoristas(lista) {
  const tbody = document.getElementById('tbody-motoristas');
  if (!lista.length) {
    tbody.innerHTML = '<tr class="loading-row"><td colspan="7">Nenhum motorista cadastrado.</td></tr>';
    return;
  }
  tbody.innerHTML = lista.map(m => `
    <tr>
      <td class="mono">${m.id}</td>
      <td>${m.nome}</td>
      <td class="mono">${m.cnh}</td>
      <td class="mono">${m.categoria}</td>
      <td class="mono">${fmtData(m.validade_cnh)}</td>
      <td>${badge(m.status)}</td>
      <td>
        <div class="actions-cell">
          <button class="btn btn-blue btn-sm" onclick="abrirEditarMotorista(${m.id})">✏️ Editar</button>
          <button class="btn btn-danger btn-sm" onclick="confirmarApagarMotorista(${m.id}, '${m.nome.replace(/'/g,"\\'")}')">🗑️</button>
        </div>
      </td>
    </tr>`).join('');
}

function filtrarMotoristas(q) {
  const term = q.toLowerCase();
  renderMotoristas(_motoristas.filter(m =>
    m.nome.toLowerCase().includes(term) ||
    m.cnh.toLowerCase().includes(term) ||
    m.categoria.toLowerCase().includes(term)
  ));
}

function abrirCriarMotorista() {
  _editandoMotoristaId = null;
  document.getElementById('modal-motorista-titulo').textContent = '👤 Novo Motorista';
  ['m-nome','m-cnh','m-validade','m-telefone'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('m-categoria').value = 'B';
  document.getElementById('m-status').value = 'ativo';
  openModal('modal-motorista');
}

async function abrirEditarMotorista(id) {
  try {
    const m = await API.motoristas.buscar(id);
    _editandoMotoristaId = id;
    document.getElementById('modal-motorista-titulo').textContent = '✏️ Editar Motorista';
    document.getElementById('m-nome').value      = m.nome;
    document.getElementById('m-cnh').value       = m.cnh;
    document.getElementById('m-categoria').value = m.categoria;
    document.getElementById('m-validade').value  = m.validade_cnh?.split('T')[0] || '';
    document.getElementById('m-telefone').value  = m.telefone || '';
    document.getElementById('m-status').value    = m.status;
    openModal('modal-motorista');
  } catch (err) {
    toast(err.message, 'error');
  }
}

async function salvarMotorista() {
  const body = formData(['m-nome','m-cnh','m-categoria','m-validade','m-telefone','m-status']);
  const payload = {
    nome:        body['m-nome'],
    cnh:         body['m-cnh'],
    categoria:   body['m-categoria'],
    validade_cnh:body['m-validade'],
    telefone:    body['m-telefone'],
    status:      body['m-status'],
  };

  try {
    if (_editandoMotoristaId) {
      await API.motoristas.atualizar(_editandoMotoristaId, payload);
      toast('Motorista atualizado!', 'success');
    } else {
      await API.motoristas.criar(payload);
      toast('Motorista cadastrado!', 'success');
    }
    closeModal('modal-motorista');
    carregarMotoristas();
  } catch (err) {
    toast(err.message, 'error');
  }
}

function confirmarApagarMotorista(id, nome) {
  createConfirmModal(
    `Deseja remover o motorista <span class="confirm-name">${nome}</span>?`,
    async () => {
      try {
        await API.motoristas.apagar(id);
        toast('Motorista removido.', 'success');
        carregarMotoristas();
      } catch (err) {
        toast(err.message, 'error');
      }
    }
  );
}
