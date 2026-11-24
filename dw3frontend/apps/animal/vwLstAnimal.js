
document.addEventListener('DOMContentLoaded', function() {
  if (!dw3IsLogged()) {
    return;
  }

  var listagem = document.getElementById('animaisListagem');
  var alertBox = document.getElementById('animaisAlert');

  if (!listagem) {
    return;
  }

  var servidorDw3 = listagem.dataset.servidorDw3;

  configurarOperacoesAnimais();

  carregarAnimais(servidorDw3, alertBox);
});

async function carregarAnimais(servidorDw3, alertBox) {
  try {
    if (!servidorDw3) {
      throw new Error('Endereco do servidor backend nao configurado.');
    }

    var token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Token nao encontrado. Faca login novamente.');
    }

    var response = await fetch(servidorDw3 + '/getAllAnimal', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    if (!response.ok) {
      throw new Error('Erro HTTP: ' + response.status);
    }

    var data = await response.json();

    if (data.status !== 'ok' || !Array.isArray(data.registro)) {
      throw new Error('Resposta invalida do servidor backend.');
    }

    inicializarTabelaAnimais(data.registro);

  } catch (error) {
    console.error('Erro ao carregar animais:', error);
    exibirErro(alertBox, error.message);
  }
}

function inicializarTabelaAnimais(animais) {
  if (DataTable.isDataTable('#tblAnimal')) {
    new DataTable('#tblAnimal').destroy();
  }

  new DataTable('#tblAnimal', {
    data: animais,
    columns: [
      { data: 'animalid', defaultContent: '' },
      { data: 'nome', defaultContent: '' },
      {
        data: 'datanascimento',
        defaultContent: '',
        render: function(data, type) {
          if (!data) {
            return '';
          }

          if (type !== 'display') {
            return data;
          }

          return new Date(data).toLocaleDateString('pt-BR', {
            timeZone: 'UTC'
          });
        }
      },
      {
        data: null,
        orderable: false,
        searchable: false,
        render: function(data, type, row) {
          if (type !== 'display') {
            return '';
          }

          var animalId = escaparHtml(row.animalid || '');

          return [
            '<div class="btn-group btn-group-sm" role="group">',
            '<button class="btn btn-outline-primary" type="button" data-action="visualizar" data-animalid="' + animalId + '" title="Visualizar"><i class="bi bi-eye"></i></button>',
            '<button class="btn btn-outline-secondary" type="button" data-action="atualizar" data-animalid="' + animalId + '" title="Atualizar"><i class="bi bi-pencil-square"></i></button>',
            '<button class="btn btn-outline-danger" type="button" data-action="remover" data-animalid="' + animalId + '" title="Remover"><i class="bi bi-trash"></i></button>',
            '</div>'
          ].join('');
        }
      }
    ],
    language: {
      emptyTable: 'Nenhum animal cadastrado.',
      info: 'Mostrando _START_ ate _END_ de _TOTAL_ registros',
      infoEmpty: 'Mostrando 0 ate 0 de 0 registros',
      infoFiltered: '(filtrado de _MAX_ registros no total)',
      lengthMenu: 'Mostrar _MENU_ registros',
      loadingRecords: 'Carregando...',
      processing: 'Processando...',
      search: 'Pesquisar:',
      zeroRecords: 'Nenhum registro encontrado',
      paginate: {
        first: 'Primeiro',
        last: 'Ultimo',
        next: 'Proximo',
        previous: 'Anterior'
      }
    }
  });
}

function configurarOperacoesAnimais() {
  var tabela = document.getElementById('tblAnimal');

  if (!tabela) {
    return;
  }

  tabela.addEventListener('click', function(event) {
    var botao = event.target.closest('button[data-action][data-animalid]');

    if (!botao) {
      return;
    }

    var action = botao.dataset.action;
    var animalId = botao.dataset.animalid;

    if (action === 'visualizar') {
      window.location.href = '/animal/form?oper=Re&animalId=' + encodeURIComponent(animalId);
    } else if (action === 'atualizar') {
      window.location.href = '/animal/form?oper=Up&animalId=' + encodeURIComponent(animalId);
    } else if (action === 'remover') {
      window.location.href = '/animal/form?oper=De&animalId=' + encodeURIComponent(animalId);
    }
  });
}

function escaparHtml(valor) {
  return String(valor)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function exibirErro(alertBox, mensagem) {
  if (!alertBox) {
    return;
  }

  alertBox.textContent = mensagem;
  alertBox.classList.remove('alert-info');
  alertBox.classList.add('alert-danger');
  alertBox.classList.remove('d-none');
}
