
document.addEventListener('DOMContentLoaded', function() {
  if (!dw3IsLogged()) {
    return;
  }

  var form = document.getElementById('frmAnimal');

  if (!form) {
    return;
  }

  var parametros = new URLSearchParams(window.location.search);
  var oper = parametros.get('oper') || parametros.get('Oper');

  var btnInserir = document.getElementById('btnInserirAnimal');
  var btnAtualizar = document.getElementById('btnAtualizarAnimal');
  var btnRemover = document.getElementById('btnRemoverAnimal');

  if (oper === 'Cr') {
    btnInserir.classList.remove('d-none');
  }

  if (oper === 'Re') {
    carregarAnimal();
    bloquearCampos();
  }

  if (oper === 'Up') {
    btnAtualizar.classList.remove('d-none');

    carregarAnimal().then(function(sucesso) {
      btnAtualizar.disabled = !sucesso;
    });

    btnAtualizar.addEventListener('click', function() {
      vwUpdateAnimal();
    });
  }

  if (oper === 'De') {
    btnRemover.classList.remove('d-none');

    carregarAnimal().then(function(sucesso) {
      btnRemover.disabled = !sucesso;
    });

    btnRemover.addEventListener('click', function() {
      vwDeleteAnimal();
    });

    bloquearCampos();
  }

  btnInserir.addEventListener('click', function() {
    vwInsertAnimal();
  });
});


// Carrega os dados do animal selecionado.
async function carregarAnimal() {
  var form = document.getElementById('frmAnimal');

  try {
    var animalId = new URLSearchParams(window.location.search).get('animalId');
    var servidorDw3 = form.dataset.servidorDw3;

    if (!animalId || !/^\d+$/.test(animalId) || Number(animalId) <= 0) {
      throw new Error('ID invalido.');
    }

    var response = await fetch(
      servidorDw3 + '/getAnimalByID/' + encodeURIComponent(animalId),
      {
        headers: dw3MontarHeadersAutenticacao()
      }
    );

    if (!response.ok) {
      throw new Error('Nao foi possivel carregar o animal. HTTP ' + response.status);
    }

    var data = await response.json();

    if (data.status !== 'ok' || !Array.isArray(data.registro)) {
      throw new Error('Resposta invalida do servidor backend.');
    }

    var animal = data.registro[0];

    if (!animal) {
      throw new Error('Animal nao encontrado.');
    }

    document.getElementById('animalid').value = animal.animalid;
    document.getElementById('nome').value = animal.nome || '';

    document.getElementById('datanascimento').value =
      animal.datanascimento
        ? String(animal.datanascimento).substring(0, 10)
        : '';

    document.getElementById('deleted').value = String(animal.deleted === true);

    return true;

  } catch (error) {
    console.error('Erro ao carregar animal:', error);
    alert(error.message || 'Erro ao carregar animal.');
    return false;
  }
}


// Bloqueia os campos para consulta ou exclusão.
function bloquearCampos() {
  document.getElementById('nome').readOnly = true;
  document.getElementById('datanascimento').disabled = true;
}


// Insere um animal.
async function vwInsertAnimal() {
  var form = document.getElementById('frmAnimal');
  var btn = document.getElementById('btnInserirAnimal');

  try {
    if (!form.reportValidity()) {
      return;
    }

    btn.disabled = true;

    var response = await fetch(form.dataset.servidorDw3 + '/insertAnimal', {
      method: 'POST',
      headers: dw3MontarHeadersAutenticacao({
        'content-type': 'application/json'
      }),
      body: JSON.stringify(montarAnimalDoFormulario())
    });

    if (!response.ok) {
      throw new Error('Nao foi possivel inserir. HTTP ' + response.status);
    }

    var data = await response.json();

    if (data.status !== 'ok' || data.linhasAfetadas !== 1) {
      throw new Error(data.msg || 'Nao foi possivel inserir o animal.');
    }

    window.location.href = '/animal';

  } catch (error) {
    alert(error.message || 'Erro ao inserir.');
  } finally {
    btn.disabled = false;
  }
}


// Atualiza um animal.
async function vwUpdateAnimal() {
  var form = document.getElementById('frmAnimal');
  var btn = document.getElementById('btnAtualizarAnimal');

  if (btn.disabled || !form.reportValidity()) {
    return;
  }

  try {
    var animalId = new URLSearchParams(window.location.search).get('animalId');

    btn.disabled = true;

    var response = await fetch(
      form.dataset.servidorDw3 + '/updateAnimal/' + encodeURIComponent(animalId),
      {
        method: 'PUT',
        headers: dw3MontarHeadersAutenticacao({
          'content-type': 'application/json'
        }),
        body: JSON.stringify(montarAnimalDoFormulario())
      }
    );

    if (!response.ok) {
      throw new Error('Nao foi possivel atualizar. HTTP ' + response.status);
    }

    var data = await response.json();

    if (data.status !== 'ok' || data.linhasAfetadas !== 1) {
      throw new Error(data.msg || 'Nenhum animal foi atualizado.');
    }

    alert('Animal atualizado com sucesso!');
    window.location.href = '/animal';

  } catch (error) {
    alert(error.message || 'Erro ao atualizar.');
  } finally {
    btn.disabled = false;
  }
}


// Remove um animal.
async function vwDeleteAnimal() {
  var form = document.getElementById('frmAnimal');
  var btn = document.getElementById('btnRemoverAnimal');

  if (btn.disabled) {
    return;
  }

  if (!window.confirm('Confirma a remocao deste animal?')) {
    return;
  }

  try {
    var animalId = document.getElementById('animalid').value;

    btn.disabled = true;

    var response = await fetch(
      form.dataset.servidorDw3 + '/deleteAnimal/' + encodeURIComponent(animalId),
      {
        method: 'DELETE',
        headers: dw3MontarHeadersAutenticacao()
      }
    );

    if (!response.ok) {
      throw new Error('Nao foi possivel remover. HTTP ' + response.status);
    }

    var data = await response.json();

    if (data.status !== 'ok' || data.linhasAfetadas !== 1) {
      throw new Error(data.msg || 'Nenhum animal foi removido.');
    }

    alert('Animal removido com sucesso!');
    window.location.href = '/animal';

  } catch (error) {
    alert(error.message || 'Erro ao remover.');
  } finally {
    btn.disabled = false;
  }
}


// Monta os dados do formulário.
function montarAnimalDoFormulario() {
  return {
    nome: document.getElementById('nome').value,
    datanascimento: document.getElementById('datanascimento').value,
    deleted: document.getElementById('deleted').value === 'true'
  };
}
