
document.addEventListener('DOMContentLoaded', async function() {
  if (!dw3IsLogged()) {
    return;
  }

  var form = document.getElementById('frmAlocado');

  if (!form) {
    return;
  }

  var parametros = new URLSearchParams(window.location.search);
  var oper = parametros.get('oper') || parametros.get('Oper');
  var servidorDw3 = form.dataset.servidorDw3;

  var btnInserir = document.getElementById('btnInserirAlocado');
  var btnAtualizar = document.getElementById('btnAtualizarAlocado');
  var btnRemover = document.getElementById('btnRemoverAlocado');

  inicializarSelectAlocado();

  try {
    // Carrega as listas de animais e piquetes.
    await carregarListasRelacionadas(servidorDw3);

    if (oper === 'Cr') {
      btnInserir.classList.remove('d-none');
    }

    if (oper === 'Re') {
      await vwGetAlocadoByID();
    }

    if (oper === 'Up') {
      btnAtualizar.classList.remove('d-none');
      btnAtualizar.disabled = !(await vwGetAlocadoByID());

      btnAtualizar.addEventListener('click', function() {
        vwUpdateAlocado();
      });
    }

    if (oper === 'De') {
      btnRemover.classList.remove('d-none');
      btnRemover.disabled = !(await vwGetAlocadoByID());

      btnRemover.addEventListener('click', function() {
        vwDeleteAlocado();
      });
    }

    if (btnInserir) {
      btnInserir.addEventListener('click', function() {
        vwInsertAlocado();
      });
    }

  } catch (error) {
    console.error('Erro ao inicializar formulário:', error);
    alert(error.message || 'Erro ao carregar o formulário.');
  }
});


// Inicializa os campos Select2.
function inicializarSelectAlocado() {
  $('#animalid').select2({
    theme: 'bootstrap-5',
    placeholder: 'Selecione um animal',
    width: '100%'
  });

  $('#piqueteid').select2({
    theme: 'bootstrap-5',
    placeholder: 'Selecione um piquete',
    width: '100%'
  });
}


// Carrega animais e piquetes.
async function carregarListasRelacionadas(servidorDw3) {
  if (!servidorDw3) {
    throw new Error('Endereco do servidor backend nao configurado.');
  }

  var headers = dw3MontarHeadersAutenticacao();

  var [responseAnimal, responsePiquete] = await Promise.all([
    fetch(servidorDw3 + '/getAllAnimal', {
      headers: headers
    }),

    fetch(servidorDw3 + '/getAllPiquete', {
      headers: headers
    })
  ]);

  if (!responseAnimal.ok) {
    throw new Error('Nao foi possivel carregar os animais. HTTP ' + responseAnimal.status);
  }

  if (!responsePiquete.ok) {
    throw new Error('Nao foi possivel carregar os piquetes. HTTP ' + responsePiquete.status);
  }

  var dataAnimal = await responseAnimal.json();
  var dataPiquete = await responsePiquete.json();

  if (dataAnimal.status !== 'ok' || !Array.isArray(dataAnimal.registro)) {
    throw new Error('Resposta invalida ao carregar animais.');
  }

  if (dataPiquete.status !== 'ok' || !Array.isArray(dataPiquete.registro)) {
    throw new Error('Resposta invalida ao carregar piquetes.');
  }

  preencherSelectAnimal(dataAnimal.registro);
  preencherSelectPiquete(dataPiquete.registro);
}


// Preenche a lista de animais.
function preencherSelectAnimal(animais) {
  var select = document.getElementById('animalid');

  select.innerHTML = '<option value="">Selecione um animal</option>';

  animais.forEach(function(animal) {
    var option = document.createElement('option');

    option.value = animal.animalid;
    option.textContent = animal.nome;

    select.appendChild(option);
  });

  $('#animalid').trigger('change');
}


// Preenche a lista de piquetes.
function preencherSelectPiquete(piquetes) {
  var select = document.getElementById('piqueteid');

  select.innerHTML = '<option value="">Selecione um piquete</option>';

  piquetes.forEach(function(piquete) {
    var option = document.createElement('option');

    option.value = piquete.piqueteid;
    option.textContent = piquete.descricao;

    select.appendChild(option);
  });

  $('#piqueteid').trigger('change');
}


// Insere um alocado.
async function vwInsertAlocado() {
  var form = document.getElementById('frmAlocado');
  var btnInserir = document.getElementById('btnInserirAlocado');

  try {
    if (!form.reportValidity()) {
      return;
    }

    var servidorDw3 = form.dataset.servidorDw3;

    if (!servidorDw3) {
      throw new Error('Endereco do servidor backend nao configurado.');
    }

    btnInserir.disabled = true;

    var response = await fetch(servidorDw3 + '/insertAlocado', {
      method: 'POST',
      headers: dw3MontarHeadersAutenticacao({
        'content-type': 'application/json'
      }),
      body: JSON.stringify(montarAlocadoDoFormulario())
    });

    if (!response.ok) {
      throw new Error('Nao foi possivel inserir. HTTP ' + response.status);
    }

    var data = await response.json();

    if (data.status !== 'ok') {
      throw new Error(data.status || 'Nao foi possivel inserir.');
    }

    if (data.linhasAfetadas !== 1) {
      throw new Error('Nenhum alocado foi inserido.');
    }

    window.location.href = '/alocado';

  } catch (error) {
    alert(error.message || 'Erro ao inserir.');
  } finally {
    btnInserir.disabled = false;
  }
}


// Consulta um alocado pelo ID.
async function vwGetAlocadoByID() {
  var form = document.getElementById('frmAlocado');

  try {
    var parametros = new URLSearchParams(window.location.search);
    var alocadoId = parametros.get('alocadoId');
    var servidorDw3 = form.dataset.servidorDw3;

    if (!alocadoId || !/^\d+$/.test(alocadoId) || Number(alocadoId) <= 0) {
      throw new Error('ID invalido.');
    }

    var response = await fetch(
      servidorDw3 + '/getAlocadoByID/' + encodeURIComponent(alocadoId),
      {
        headers: dw3MontarHeadersAutenticacao()
      }
    );

    if (!response.ok) {
      throw new Error('Nao foi possivel carregar. HTTP ' + response.status);
    }

    var data = await response.json();

    if (data.status !== 'ok' || !Array.isArray(data.registro)) {
      throw new Error('Resposta invalida do servidor backend.');
    }

    var alocado = data.registro[0];

    if (!alocado) {
      throw new Error('Alocado nao encontrado.');
    }

    document.getElementById('alocadoid').value = alocado.alocadoid;

    document.getElementById('datainicio').value =
      alocado.datainicio ? String(alocado.datainicio).substring(0, 10) : '';

    document.getElementById('datafinal').value =
      alocado.datafinal ? String(alocado.datafinal).substring(0, 10) : '';

    $('#animalid').val(String(alocado.animalid)).trigger('change');
    $('#piqueteid').val(String(alocado.piqueteid)).trigger('change');

    document.getElementById('deleted').value =
      String(alocado.deleted === true);

    return true;

  } catch (error) {
    console.error('Erro ao consultar alocado:', error);
    alert(error.message || 'Erro ao carregar.');
    return false;
  }
}


// Atualiza um alocado.
async function vwUpdateAlocado() {
  var form = document.getElementById('frmAlocado');
  var btnAtualizar = document.getElementById('btnAtualizarAlocado');

  if (btnAtualizar.disabled || !form.reportValidity()) {
    return;
  }

  try {
    var alocadoId = new URLSearchParams(window.location.search).get('alocadoId');
    var servidorDw3 = form.dataset.servidorDw3;

    if (!alocadoId || !/^\d+$/.test(alocadoId)) {
      throw new Error('ID invalido.');
    }

    btnAtualizar.disabled = true;

    var response = await fetch(
      servidorDw3 + '/updateAlocado/' + encodeURIComponent(alocadoId),
      {
        method: 'PUT',
        headers: dw3MontarHeadersAutenticacao({
          'content-type': 'application/json'
        }),
        body: JSON.stringify(montarAlocadoDoFormulario())
      }
    );

    if (!response.ok) {
      throw new Error('Nao foi possivel atualizar. HTTP ' + response.status);
    }

    var data = await response.json();

    if (data.status !== 'ok') {
      throw new Error(data.status || 'Nao foi possivel atualizar.');
    }

    if (data.linhasAfetadas !== 1) {
      throw new Error('Nenhum alocado foi atualizado.');
    }

    alert('Atualizado com sucesso.');

    window.location.href = '/alocado';

  } catch (error) {
    alert(error.message || 'Erro ao atualizar.');
  } finally {
    btnAtualizar.disabled = false;
  }
}


// Remove um alocado.
async function vwDeleteAlocado() {
  var form = document.getElementById('frmAlocado');
  var btnRemover = document.getElementById('btnRemoverAlocado');

  if (btnRemover.disabled) {
    return;
  }

  if (!window.confirm('Confirma a remocao?')) {
    return;
  }

  try {
    var alocadoId = document.getElementById('alocadoid').value;
    var servidorDw3 = form.dataset.servidorDw3;

    if (!alocadoId || !/^\d+$/.test(alocadoId)) {
      throw new Error('ID invalido.');
    }

    btnRemover.disabled = true;

    var response = await fetch(
      servidorDw3 + '/deleteAlocado/' + encodeURIComponent(alocadoId),
      {
        method: 'DELETE',
        headers: dw3MontarHeadersAutenticacao()
      }
    );

    if (!response.ok) {
      throw new Error('Nao foi possivel remover. HTTP ' + response.status);
    }

    var data = await response.json();

    if (data.status !== 'ok') {
      throw new Error(data.status || 'Nao foi possivel remover.');
    }

    if (data.linhasAfetadas !== 1) {
      throw new Error('Nenhum alocado foi removido.');
    }

    window.location.href = '/alocado';

  } catch (error) {
    alert(error.message || 'Erro ao remover.');
  } finally {
    btnRemover.disabled = false;
  }
}


// Monta os dados do formulário.
function montarAlocadoDoFormulario() {
  return {
    datainicio: document.getElementById('datainicio').value,
    datafinal: document.getElementById('datafinal').value,
    animalid: Number(document.getElementById('animalid').value),
    piqueteid: Number(document.getElementById('piqueteid').value),
    deleted: document.getElementById('deleted').value === 'true'
  };
}
