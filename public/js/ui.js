// public/js/ui.js — utilitários de interface

// ── Toast ─────────────────────────────────────────────────────
function toast(msg, type = 'info') {
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span>${icons[type]}</span><span>${msg}</span>`;
  document.getElementById('toast-container').appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

// ── Modal genérico ────────────────────────────────────────────
function openModal(id)  { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

function createConfirmModal(msg, onConfirm) {
  const existing = document.getElementById('confirm-modal');
  if (existing) existing.remove();

  const div = document.createElement('div');
  div.id = 'confirm-modal';
  div.className = 'modal-overlay';
  div.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3>⚠️ Confirmar exclusão</h3>
        <button class="modal-close" onclick="document.getElementById('confirm-modal').remove()">×</button>
      </div>
      <div class="modal-body">
        <p class="confirm-text">${msg}</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="document.getElementById('confirm-modal').remove()">Cancelar</button>
        <button class="btn btn-danger" id="confirm-ok">Excluir</button>
      </div>
    </div>`;
  document.body.appendChild(div);
  document.getElementById('confirm-ok').onclick = async () => {
    div.remove();
    await onConfirm();
  };
}

// ── Badge de status ───────────────────────────────────────────
function badge(status) {
  const map = {
    ativo:       '<span class="badge badge-ativo">ativo</span>',
    inativo:     '<span class="badge badge-inativo">inativo</span>',
    manutencao:  '<span class="badge badge-manutencao">manutenção</span>',
    ativa:       '<span class="badge badge-ativa">ativa</span>',
  };
  return map[status] || `<span class="badge">${status}</span>`;
}

// ── Formatar data ISO → dd/mm/aaaa ────────────────────────────
function fmtData(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR');
}

// ── Formatar km ───────────────────────────────────────────────
function fmtKm(n) {
  return Number(n).toLocaleString('pt-BR') + ' km';
}

// ── Preencher select com options ──────────────────────────────
function fillSelect(id, opts, selected = '') {
  const sel = document.getElementById(id);
  if (!sel) return;
  sel.innerHTML = opts.map(o =>
    `<option value="${o.v}" ${o.v == selected ? 'selected' : ''}>${o.l}</option>`
  ).join('');
}

// ── Ler todos os campos de um form por nome ───────────────────
function formData(ids) {
  return Object.fromEntries(ids.map(id => [id, (document.getElementById(id)?.value || '').trim()]));
}
