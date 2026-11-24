
document.addEventListener('DOMContentLoaded', async function() {
  if (!dw3IsLogged()) {
    return;
  }

  var form = document.getElementById('frmPasto');

  if (!form) {
    return;
  }

  var parametros = new URLSearchParams(window.location.search);
  var oper = parametros.get('oper') || parametros.get('Oper');

  var btnInserir = document.getElementById('btnInserirPasto');
  var btnAtualizar = document.getElementById('btnAtualizarPasto');
  var btnRemover = document.getElementById('btnRemoverPasto');

  if (oper === 'Cr') {
    btnInserir.classList.remove('d-none');
    btnInserir.addEventListener('click', vwInsertPasto);
  }

  if (oper === 'Re') {
    if (await vwGetPastoByID()) {
      bloquearCamposPasto();
    }
  }

  if (oper === 'Up') {
    btnAtualizar.classList.remove('d-none');
    btnAtualizar.disabled = !(await vwGetPastoByID());

    btnAtualizar.addEventListener('click', vwUpdatePasto);
  }

  if (oper === 'De') {
    btnRemover.classList.remove('d-none');
    btnRemover.disabled = !(await vwGetPastoByID());

    bloquearCamposPasto();

    btnRemover.addEventListener('click', vwDeletePasto);
  }
});

async function vwInsertPasto() {
  var form = document.getElementById('frmPasto');
  var btnInserir = document.getElementById('btnInserirPasto');

  try {
    if (!form.reportValidity()) return;

    var servidorDw3 = form.dataset.servidorDw3;

    if (!servidorDw3) {
      throw new Error('Endereço do servidor backend não configurado.');
    }

    btnInserir.disabled = true;

    var pasto = montarPastoDoFormulario();
    pasto.areatotal = Number(pasto.areatotal);

    var response = await fetch(servidorDw3 + '/insertPasto', {
      method: 'POST',
      headers: dw3MontarHeadersAutenticacao({
        'content-type': 'application/json'
      }),
      body: JSON.stringify(pasto)
    });

    if (!response.ok) {
      throw new Error('Não foi possível inserir. HTTP ' + response.status);
    }

    var data = await response.json();

    if (data.auth === false || data.status !== 'ok') {
      throw new Error(data.message || 'Não foi possível inserir.');
    }

    window.location.href = '/pasto';

  } catch (error) {
    alert(error.message || 'Erro ao inserir.');
  } finally {
    btnInserir.disabled = false;
  }
}

async function vwGetPastoByID() {
  var form = document.getElementById('frmPasto');

  try {
    var parametros = new URLSearchParams(window.location.search);
    var pastoId = parametros.get('pastoId');
    var servidorDw3 = form.dataset.servidorDw3;

    if (!pastoId || !/^\d+$/.test(pastoId) || Number(pastoId) <= 0) {
      throw new Error('ID do pasto inválido.');
    }

    if (!servidorDw3) {
      throw new Error('Endereço do servidor backend não configurado.');
    }

    var response = await fetch(
      servidorDw3 + '/getPastoByID/' + encodeURIComponent(pastoId),
      {
        headers: dw3MontarHeadersAutenticacao()
      }
    );

    if (!response.ok) {
      throw new Error('Não foi possível carregar o pasto. HTTP ' + response.status);
    }

    var data = await response.json();

    if (data.auth === false || data.status !== 'ok') {
      throw new Error(data.message || 'Não foi possível carregar o pasto.');
    }

    var pasto = Array.isArray(data.registro)
      ? data.registro[0]
      : data.registro;

    if (!pasto) {
      throw new Error('Pasto não encontrado.');
    }

    document.getElementById('pastoid').value = pasto.pastoid;
    document.getElementById('descricao').value = pasto.descricao ?? '';
    document.getElementById('areatotal').value = pasto.areatotal ?? '';
    document.getElementById('deleted').value = String(pasto.deleted === true);

    return true;

  } catch (error) {
    alert(error.message || 'Erro ao carregar o pasto.');
    return false;
  }
}

async function vwUpdatePasto() {
  var form = document.getElementById('frmPasto');
  var btnAtualizar = document.getElementById('btnAtualizarPasto');

  if (btnAtualizar.disabled || !form.reportValidity()) {
    return;
  }

  try {
    var pastoId = document.getElementById('pastoid').value;
    var servidorDw3 = form.dataset.servidorDw3;

    if (!servidorDw3) {
      throw new Error('Endereço do servidor backend não configurado.');
    }

    btnAtualizar.disabled = true;

    var pasto = montarPastoDoFormulario();
    pasto.areatotal = Number(pasto.areatotal);

    var response = await fetch(
      servidorDw3 + '/updatePasto/' + encodeURIComponent(pastoId),
      {
        method: 'PUT',
        headers: dw3MontarHeadersAutenticacao({
          'content-type': 'application/json'
        }),
        body: JSON.stringify(pasto)
      }
    );

    if (!response.ok) {
      throw new Error('Não foi possível atualizar. HTTP ' + response.status);
    }

    var data = await response.json();

    if (data.auth === false || data.status !== 'ok') {
      throw new Error(data.message || 'Não foi possível atualizar.');
    }

    if (data.linhasAfetadas !== 1) {
      throw new Error('Nenhum pasto foi atualizado.');
    }

    alert('Pasto atualizado com sucesso.');
    window.location.href = '/pasto';

  } catch (error) {
    alert(error.message || 'Erro ao atualizar.');
  } finally {
    btnAtualizar.disabled = false;
  }
}

async function vwDeletePasto() {
  var form = document.getElementById('frmPasto');
  var btnRemover = document.getElementById('btnRemoverPasto');

  if (btnRemover.disabled) return;

  if (!window.confirm('Confirma a remoção deste pasto?')) {
    return;
  }

  try {
    var pastoId = document.getElementById('pastoid').value;
    var servidorDw3 = form.dataset.servidorDw3;

    if (!servidorDw3) {
      throw new Error('Endereço do servidor backend não configurado.');
    }

    btnRemover.disabled = true;

    var response = await fetch(
      servidorDw3 + '/deletePasto/' + encodeURIComponent(pastoId),
      {
        method: 'DELETE',
        headers: dw3MontarHeadersAutenticacao()
      }
    );

    if (!response.ok) {
      throw new Error('Não foi possível remover. HTTP ' + response.status);
    }

    var data = await response.json();

    if (data.auth === false || data.status !== 'ok') {
      throw new Error(data.message || 'Não foi possível remover.');
    }

    if (data.linhasAfetadas !== 1) {
      throw new Error('Nenhum pasto foi removido.');
    }

    window.location.href = '/pasto';

  } catch (error) {
    alert(error.message || 'Erro ao remover.');
  } finally {
    btnRemover.disabled = false;
  }
}

function montarPastoDoFormulario() {
  return {
    descricao: document.getElementById('descricao').value,
    areatotal: document.getElementById('areatotal').value,
    deleted: document.getElementById('deleted').value === 'true'
  };
}

function bloquearCamposPasto() {
  document.getElementById('descricao').readOnly = true;
  document.getElementById('areatotal').readOnly = true;
}
