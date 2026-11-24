
document.addEventListener('DOMContentLoaded', function() {
  if (!dw3IsLogged()) {
    return;
  }

  var listagem = document.getElementById('alocadoListagem');
  var alertBox = document.getElementById('alocadoAlert');

  if (!listagem) {
    return;
  }

  var servidorDw3 = listagem.dataset.servidorDw3;

  configurarOperacoesAlocado(alertBox);
  carregarAlocado(servidorDw3, alertBox);
});

async function carregarAlocado(servidorDw3, alertBox) {
  try {
    if (!servidorDw3) {
      throw new Error('Endereco do servidor backend nao configurado.');
    }

    var token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Token nao encontrado. Faca login novamente.');
    }

    var response = await fetch(servidorDw3 + '/getAllAlocado', {
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

    inicializarTabelaAlocado(data.registro);

  } catch (error) {
    console.error('Erro ao carregar alocados:', error);
    exibirErro(alertBox, error.message);
  }
}

function formatarData(data) {
  if (!data) {
    return '';
  }

  var partes = String(data).substring(0, 10).split('-');

  if (partes.length !== 3) {
    return data;
  }

  return partes[2] + '/' + partes[1] + '/' + partes[0];
}

function inicializarTabelaAlocado(alocado) {
  if (DataTable.isDataTable('#tblAlocado')) {
    new DataTable('#tblAlocado').destroy();
  }

  new DataTable('#tblAlocado', {
    data: alocado,
    columns: [
      {
        data: 'alocadoid',
        defaultContent: ''
      },
      {
        data: 'datainicio',
        defaultContent: '',
        render: function(data) {
          return formatarData(data);
        }
      },
      {
        data: 'datafinal',
        defaultContent: '',
        render: function(data) {
          return formatarData(data);
        }
      },
      {
        data: 'nomeanimal',
        defaultContent: ''
      },
      {
        data: 'piqueteid',
        defaultContent: ''
      },
      {
        data: null,
        orderable: false,
        searchable: false,
        render: function(data, type, row) {
          if (type !== 'display') {
            return '';
          }

          var alocadoId = escaparHtml(row.alocadoid || '');

          return [
            '<div class="btn-group btn-group-sm" role="group" aria-label="Operacoes">',
            '<button class="btn btn-outline-primary" type="button" data-action="visualizar" data-alocadoid="' + alocadoId + '" title="Visualizar" aria-label="Visualizar"><i class="bi bi-eye"></i></button>',
            '<button class="btn btn-outline-secondary" type="button" data-action="atualizar" data-alocadoid="' + alocadoId + '" title="Atualizar" aria-label="Atualizar"><i class="bi bi-pencil-square"></i></button>',
            '<button class="btn btn-outline-danger" type="button" data-action="remover" data-alocadoid="' + alocadoId + '" title="Remover" aria-label="Remover"><i class="bi bi-trash"></i></button>',
            '</div>'
          ].join('');
        }
      }
    ],
    language: {
      emptyTable: 'Nenhum alocado cadastrado.',
      info: 'Mostrando _START_ ate _END_ de _TOTAL_ registros',
      infoEmpty: 'Mostrando 0 ate 0 registros',
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

function configurarOperacoesAlocado(alertBox) {
  var tabela = document.getElementById('tblAlocado');

  if (!tabela) {
    return;
  }

  tabela.addEventListener('click', function(event) {
    var botao = event.target.closest('button[data-action][data-alocadoid]');

    if (!botao) {
      return;
    }

    var action = botao.dataset.action;
    var alocadoId = botao.dataset.alocadoid;

    if (action === 'visualizar') {
      window.location.href = '/alocado/form?oper=Re&alocadoId=' + encodeURIComponent(alocadoId);
      return;
    }

    if (action === 'atualizar') {
      window.location.href = '/alocado/form?oper=Up&alocadoId=' + encodeURIComponent(alocadoId);
      return;
    }

    if (action === 'remover') {
      window.location.href = '/alocado/form?oper=De&alocadoId=' + encodeURIComponent(alocadoId);
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
