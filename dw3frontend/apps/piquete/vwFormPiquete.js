
document.addEventListener('DOMContentLoaded', async function() {
  if (!dw3IsLogged()) return;

  var form = document.getElementById('frmPiquete');
  if (!form) return;

  var parametros = new URLSearchParams(window.location.search);
  var oper = parametros.get('oper') || parametros.get('Oper');

  var btnInserir = document.getElementById('btnInserirPiquete');
  var btnAtualizar = document.getElementById('btnAtualizarPiquete');
  var btnRemover = document.getElementById('btnRemoverPiquete');

  var servidorDw3 = form.dataset.servidorDw3;

  inicializarSelectPasto();

  // Carrega a lista de pastos
  var pastosCarregados = await carregarPastos(servidorDw3);

  if (!pastosCarregados) return;

  if (oper === 'Cr') {
    btnInserir.classList.remove('d-none');
    btnInserir.addEventListener('click', vwInsertPiquete);
  }

  if (oper === 'Re') {
    if (await vwGetPiqueteByID()) {
      bloquearCamposPiquete();
    }
  }

  if (oper === 'Up') {
    btnAtualizar.classList.remove('d-none');
    btnAtualizar.disabled = !(await vwGetPiqueteByID());
    btnAtualizar.addEventListener('click', vwUpdatePiquete);
  }

  if (oper === 'De') {
    btnRemover.classList.remove('d-none');
    btnRemover.disabled = !(await vwGetPiqueteByID());

    bloquearCamposPiquete();

    btnRemover.addEventListener('click', vwDeletePiquete);
  }
});

function inicializarSelectPasto() {
  $('#pastoid').select2({
    theme: 'bootstrap-5',
    placeholder: 'Selecione um pasto',
    width: '100%'
  });
}

async function carregarPastos(servidorDw3) {
  try {
    if (!servidorDw3) {
      throw new Error('Endereço do servidor backend não configurado.');
    }

    var response = await fetch(servidorDw3 + '/getAllPasto', {
      headers: dw3MontarHeadersAutenticacao()
    });

    if (!response.ok) {
      throw new Error('Não foi possível carregar os pastos. HTTP ' + response.status);
    }

    var data = await response.json();

    if (data.auth === false || data.status !== 'ok') {
      throw new Error(data.message || 'Não foi possível carregar os pastos.');
    }

    preencherSelectPastos(data.registro);
    return true;

  } catch (error) {
    alert(error.message || 'Erro ao carregar pastos.');
    return false;
  }
}

function preencherSelectPastos(pastos) {
  var select = document.getElementById('pastoid');

  select.innerHTML = '<option value="">Selecione um pasto</option>';

  pastos.forEach(function(pasto) {
    var option = document.createElement('option');
    option.value = pasto.pastoid;
    option.textContent = pasto.descricao;
    select.appendChild(option);
  });

  $('#pastoid').trigger('change');
}

async function vwInsertPiquete() {
  var form = document.getElementById('frmPiquete');
  var btn = document.getElementById('btnInserirPiquete');

  try {
    if (!form.reportValidity()) return;

    btn.disabled = true;

    var piquete = montarPiqueteDoFormulario();
    piquete.latitude = Number(piquete.latitude);
    piquete.longitude = Number(piquete.longitude);
    piquete.pastoid = Number(piquete.pastoid);

    var response = await fetch(form.dataset.servidorDw3 + '/insertPiquete', {
      method: 'POST',
      headers: dw3MontarHeadersAutenticacao({
        'content-type': 'application/json'
      }),
      body: JSON.stringify(piquete)
    });

    if (!response.ok) {
      throw new Error('Não foi possível inserir. HTTP ' + response.status);
    }

    var data = await response.json();

    if (data.auth === false || data.status !== 'ok') {
      throw new Error(data.message || 'Não foi possível inserir.');
    }

    window.location.href = '/piquete';

  } catch (error) {
    alert(error.message || 'Erro ao inserir.');
  } finally {
    btn.disabled = false;
  }
}

async function vwGetPiqueteByID() {
  var form = document.getElementById('frmPiquete');

  try {
    var piqueteId = new URLSearchParams(window.location.search).get('piqueteId');

    if (!piqueteId || !/^\d+$/.test(piqueteId) || Number(piqueteId) <= 0) {
      throw new Error('ID do piquete inválido.');
    }

    var response = await fetch(
      form.dataset.servidorDw3 + '/getPiqueteByID/' + encodeURIComponent(piqueteId),
      {
        headers: dw3MontarHeadersAutenticacao()
      }
    );

    if (!response.ok) {
      throw new Error('Não foi possível carregar o piquete. HTTP ' + response.status);
    }

    var data = await response.json();

    if (data.auth === false || data.status !== 'ok') {
      throw new Error(data.message || 'Não foi possível carregar o piquete.');
    }

    var piquete = Array.isArray(data.registro)
      ? data.registro[0]
      : data.registro;

    if (!piquete) {
      throw new Error('Piquete não encontrado.');
    }

    document.getElementById('piqueteid').value = piquete.piqueteid;
    document.getElementById('descricao').value = piquete.descricao ?? '';
    document.getElementById('latitude').value = piquete.latitude ?? '';
    document.getElementById('longitude').value = piquete.longitude ?? '';
    document.getElementById('deleted').value = String(piquete.deleted === true);

    $('#pastoid').val(String(piquete.pastoid)).trigger('change');

    return true;

  } catch (error) {
    alert(error.message || 'Erro ao carregar piquete.');
    return false;
  }
}

async function vwUpdatePiquete() {
  var form = document.getElementById('frmPiquete');
  var btn = document.getElementById('btnAtualizarPiquete');

  if (btn.disabled || !form.reportValidity()) return;

  try {
    var piqueteId = document.getElementById('piqueteid').value;

    btn.disabled = true;

    var piquete = montarPiqueteDoFormulario();
    piquete.latitude = Number(piquete.latitude);
    piquete.longitude = Number(piquete.longitude);
    piquete.pastoid = Number(piquete.pastoid);

    var response = await fetch(
      form.dataset.servidorDw3 + '/updatePiquete/' + encodeURIComponent(piqueteId),
      {
        method: 'PUT',
        headers: dw3MontarHeadersAutenticacao({
          'content-type': 'application/json'
        }),
        body: JSON.stringify(piquete)
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
      throw new Error('Nenhum piquete foi atualizado.');
    }

    alert('Piquete atualizado com sucesso.');
    window.location.href = '/piquete';

  } catch (error) {
    alert(error.message || 'Erro ao atualizar.');
  } finally {
    btn.disabled = false;
  }
}

async function vwDeletePiquete() {
  var form = document.getElementById('frmPiquete');
  var btn = document.getElementById('btnRemoverPiquete');

  if (btn.disabled) return;

  if (!confirm('Confirma a remoção deste piquete?')) return;

  try {
    var piqueteId = document.getElementById('piqueteid').value;

    btn.disabled = true;

    var response = await fetch(
      form.dataset.servidorDw3 + '/deletePiquete/' + encodeURIComponent(piqueteId),
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
      throw new Error('Nenhum piquete foi removido.');
    }

    window.location.href = '/piquete';

  } catch (error) {
    alert(error.message || 'Erro ao remover.');
  } finally {
    btn.disabled = false;
  }
}

function montarPiqueteDoFormulario() {
  return {
    descricao: document.getElementById('descricao').value,
    latitude: document.getElementById('latitude').value,
    longitude: document.getElementById('longitude').value,
    pastoid: document.getElementById('pastoid').value,
    deleted: document.getElementById('deleted').value === 'true'
  };
}

function bloquearCamposPiquete() {
  document.getElementById('descricao').readOnly = true;
  document.getElementById('latitude').readOnly = true;
  document.getElementById('longitude').readOnly = true;
  $('#pastoid').prop('disabled', true).trigger('change');
}
