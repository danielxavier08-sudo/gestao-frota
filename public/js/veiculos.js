// public/js/veiculos.js

let _veiculos = [];
let _editandoId = null;

// ── Carrega e renderiza ───────────────────────────────────────
async function carregarVeiculos() {
  const tbody = document.getElementById('tbody-veiculos');
  tbody.innerHTML = '<tr class="loading-row"><td colspan="7"><div class="spinner"></div></td></tr>';
  try {
    _veiculos = await API.veiculos.listar();
    renderVeiculos(_veiculos);
    atualizarStatsVeiculos(_veiculos);
  } catch (err) {
    toast(err.message, 'error');
    tbody.innerHTML = '<tr class="loading-row"><td colspan="7">Erro ao carregar dados.</td></tr>';
  }
}

function renderVeiculos(lista) {
  const tbody = document.getElementById('tbody-veiculos');
  if (!lista.length) {
    tbody.innerHTML = '<tr class="loading-row"><td colspan="7">Nenhum veículo cadastrado.</td></tr>';
    return;
  }
  tbody.innerHTML = lista.map(v => `
    <tr>
      <td class="mono">${v.id}</td>
      <td class="mono">${v.placa}</td>
      <td>${v.modelo}</td>
      <td class="mono">${v.ano}</td>
      <td class="mono">${fmtKm(v.km)}</td>
      <td>${badge(v.status)}</td>
      <td>
        <div class="actions-cell">
          <button class="btn btn-blue btn-sm" onclick="abrirEditarVeiculo(${v.id})">✏️ Editar</button>
          <button class="btn btn-danger btn-sm" onclick="confirmarApagarVeiculo(${v.id}, '${v.placa}')">🗑️</button>
        </div>
      </td>
    </tr>`).join('');
}

function atualizarStatsVeiculos(lista) {
  const ativos     = lista.filter(v => v.status === 'ativo').length;
  const manut      = lista.filter(v => v.status === 'manutencao').length;
  const inativos   = lista.filter(v => v.status === 'inativo').length;
  document.getElementById('stat-veiculos-total')?.setAttribute('data-val', lista.length);
  document.getElementById('stat-veiculos-ativos')?.setAttribute('data-val', ativos);
  document.getElementById('stat-veiculos-manut')?.setAttribute('data-val', manut);
  document.getElementById('stat-veiculos-inativos')?.setAttribute('data-val', inativos);
  // Atualiza valores visíveis
  ['total','ativos','manut','inativos'].forEach(k => {
    const el = document.getElementById(`stat-veiculos-${k}`);
    if (el) el.textContent = el.getAttribute('data-val');
  });
}

// ── Busca local ───────────────────────────────────────────────
function filtrarVeiculos(q) {
  const term = q.toLowerCase();
  const filtrado = _veiculos.filter(v =>
    v.placa.toLowerCase().includes(term) ||
    v.modelo.toLowerCase().includes(term) ||
    v.status.toLowerCase().includes(term)
  );
  renderVeiculos(filtrado);
}

// ── Modal Criar ───────────────────────────────────────────────
function abrirCriarVeiculo() {
  _editandoId = null;
  document.getElementById('modal-veiculo-titulo').textContent = '🚛 Novo Veículo';
  ['v-placa','v-modelo','v-ano','v-km'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('v-status').value = 'ativo';
  openModal('modal-veiculo');
}

// ── Modal Editar ──────────────────────────────────────────────
async function abrirEditarVeiculo(id) {
  try {
    const v = await API.veiculos.buscar(id);
    _editandoId = id;
    document.getElementById('modal-veiculo-titulo').textContent = '✏️ Editar Veículo';
    document.getElementById('v-placa').value  = v.placa;
    document.getElementById('v-modelo').value = v.modelo;
    document.getElementById('v-ano').value    = v.ano;
    document.getElementById('v-km').value     = v.km;
    document.getElementById('v-status').value = v.status;
    openModal('modal-veiculo');
  } catch (err) {
    toast(err.message, 'error');
  }
}

// ── Salvar (criar ou editar) ──────────────────────────────────
async function salvarVeiculo() {
  const body = formData(['v-placa','v-modelo','v-ano','v-km','v-status']);
  const payload = {
    placa:  body['v-placa'],
    modelo: body['v-modelo'],
    ano:    parseInt(body['v-ano']),
    km:     parseInt(body['v-km']) || 0,
    status: body['v-status'],
  };

  try {
    if (_editandoId) {
      await API.veiculos.atualizar(_editandoId, payload);
      toast('Veículo atualizado!', 'success');
    } else {
      await API.veiculos.criar(payload);
      toast('Veículo cadastrado!', 'success');
    }
    closeModal('modal-veiculo');
    carregarVeiculos();
  } catch (err) {
    toast(err.message, 'error');
  }
}

// ── Apagar ────────────────────────────────────────────────────
function confirmarApagarVeiculo(id, placa) {
  createConfirmModal(
    `Deseja remover o veículo <span class="confirm-name">${placa}</span>? Esta ação não pode ser desfeita.`,
    async () => {
      try {
        await API.veiculos.apagar(id);
        toast('Veículo removido.', 'success');
        carregarVeiculos();
      } catch (err) {
        toast(err.message, 'error');
      }
    }
  );
}
