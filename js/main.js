// Zeriky BJJ Team — interações do site
(function () {
  'use strict';

  var WHATSAPP = '5548996625027';

  function wa(msg) {
    return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg);
  }

  function setPressed(group, value) {
    group.querySelectorAll('button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.value === value));
    });
  }

  // Links de WhatsApp com mensagem pronta
  document.querySelectorAll('.js-wa').forEach(function (a) {
    a.href = wa(a.dataset.msg || 'Olá! Vi o site e quero agendar uma aula experimental.');
  });

  // Menu mobile
  var toggle = document.querySelector('.nav__toggle');
  var menu = document.getElementById('menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menu');
      });
    });
  }

  // Turmas — grade ilustrativa, ajustar quando o professor passar os horários
  var TURMAS = [
    { polo: 'sj', poloNome: 'São José', publico: 'kids', nome: 'Kids I', desc: 'Crianças menores · [faixa etária]', horario: '[Dias e horário]' },
    { polo: 'sj', poloNome: 'São José', publico: 'kids', nome: 'Kids II', desc: 'Crianças maiores · [faixa etária]', horario: '[Dias e horário]' },
    { polo: 'sj', poloNome: 'São José', publico: 'adulto', nome: 'Adulto Iniciantes', desc: 'Para quem está começando ou voltando a treinar', horario: '[Dias e horário]' },
    { polo: 'sj', poloNome: 'São José', publico: 'adulto', nome: 'Adulto Todos os níveis', desc: 'Técnica, drills e rola', horario: '[Dias e horário]' },
    { polo: 'sj', poloNome: 'São José', publico: 'comp', nome: 'Competição', desc: 'Preparação para campeonatos', horario: '[Dias e horário]' },
    { polo: 'ph', poloNome: 'Palhoça', publico: 'kids', nome: 'Kids', desc: 'Crianças · [faixa etária]', horario: '[Dias e horário]' },
    { polo: 'ph', poloNome: 'Palhoça', publico: 'adulto', nome: 'Adulto Iniciantes', desc: 'Para quem está começando ou voltando a treinar', horario: '[Dias e horário]' },
    { polo: 'ph', poloNome: 'Palhoça', publico: 'adulto', nome: 'Adulto Todos os níveis', desc: 'Técnica, drills e rola', horario: '[Dias e horário]' }
  ];

  var filtro = { polo: 'todos', publico: 'todos' };
  var grid = document.getElementById('turmas-grid');
  var vazio = document.getElementById('turmas-empty');

  var ICON_PIN = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>';
  var ICON_CLOCK = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';

  function renderTurmas() {
    var lista = TURMAS.filter(function (t) {
      return (filtro.polo === 'todos' || t.polo === filtro.polo) &&
             (filtro.publico === 'todos' || t.publico === filtro.publico);
    });
    grid.innerHTML = lista.map(function (t) {
      var link = wa('Olá! Quero reservar uma aula experimental na turma ' + t.nome + ' do polo ' + t.poloNome + '.');
      return '<article class="turma">' +
        '<p class="turma__polo">' + ICON_PIN + t.poloNome + '</p>' +
        '<h3 class="turma__nome">' + t.nome + '</h3>' +
        '<p class="turma__desc">' + t.desc + '</p>' +
        '<p class="turma__hora">' + ICON_CLOCK + t.horario + '</p>' +
        '<a class="btn btn--accent" href="' + link + '" target="_blank" rel="noopener">Reservar aula experimental</a>' +
        '</article>';
    }).join('');
    vazio.hidden = lista.length > 0;
  }

  document.querySelectorAll('[data-filter]').forEach(function (group) {
    group.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      filtro[group.dataset.filter] = btn.dataset.value;
      setPressed(group, btn.dataset.value);
      renderTurmas();
    });
  });
  if (grid) renderTurmas();

  // Quiz "Qual turma é a minha?"
  var quiz = { para: null, exp: null };
  var qEmpty = document.getElementById('quiz-empty');
  var qResult = document.getElementById('quiz-result');

  function indicacao() {
    if (quiz.para === 'filho') {
      return {
        titulo: 'Turma Kids',
        texto: quiz.exp === 'nunca'
          ? 'Aulas com brincadeiras, regras claras e foco nos fundamentos. A primeira aula é para a criança conhecer o professor e a turma.'
          : 'Na aula experimental o professor avalia o nível da criança e indica a turma Kids certa para a idade e a experiência.'
      };
    }
    if (quiz.exp === 'nunca') return { titulo: 'Adulto Iniciantes', texto: 'Fundamentos, quedas seguras e posições básicas, no seu ritmo. É aqui que todo mundo começa.' };
    if (quiz.exp === 'parei') return { titulo: 'Adulto Iniciantes', texto: 'Para retomar com segurança e recuperar o ritmo. Na aula experimental o professor indica se você já pode ir para Todos os níveis.' };
    return { titulo: 'Todos os níveis + Competição', texto: 'Treino técnico e rola. Se o objetivo é campeonato, pergunte sobre a turma de competição.' };
  }

  function renderQuiz() {
    var pronto = quiz.para && quiz.exp;
    qEmpty.hidden = !!pronto;
    qResult.hidden = !pronto;
    if (!pronto) return;
    var r = indicacao();
    document.getElementById('quiz-title').textContent = r.titulo;
    document.getElementById('quiz-text').textContent = r.texto;
    document.getElementById('quiz-link').href = wa('Olá! Fiz o teste do site e a indicação foi: ' + r.titulo + '. Quero agendar uma aula experimental.');
  }

  document.querySelectorAll('[data-quiz]').forEach(function (group) {
    group.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      quiz[group.dataset.quiz] = btn.dataset.value;
      setPressed(group, btn.dataset.value);
      renderQuiz();
    });
  });

  var reset = document.getElementById('quiz-reset');
  if (reset) {
    reset.addEventListener('click', function () {
      quiz.para = null;
      quiz.exp = null;
      document.querySelectorAll('[data-quiz]').forEach(function (g) { setPressed(g, null); });
      renderQuiz();
    });
  }

  // Caminho das faixas — Sistema Geral de Graduação IBJJF/CBJJ (jun/2026)
  var COR = {
    branca: '#EDEDED', cinza: '#8C8C8C', amarela: '#F2C318', laranja: '#F07C1A', verde: '#2E8B3E',
    azul: '#1F4FBF', roxa: '#6B2FA3', marrom: '#6B3E1F', preta: '#111111', vermelha: '#C8102E'
  };

  function lisa(cor, extra) {
    return Object.assign({ bg: cor, tip: '#111111', edge: 'transparent', border: cor }, extra || {});
  }
  function listrada(cor, listra) {
    return lisa(cor, { bg: 'linear-gradient(to bottom, ' + cor + ' 0 36%, ' + listra + ' 36% 64%, ' + cor + ' 64%)' });
  }
  function gomos(a, b) {
    return 'repeating-linear-gradient(90deg, ' + a + ' 0 22px, ' + b + ' 22px 44px)';
  }

  var SISTEMAS = {
    adulto: {
      nota: 'Os tempos são de permanência mínima em cada faixa. O momento de graduar é decisão do professor, e o sistema de graus até a marrom fica a critério dele. *Faixa preta aos 18 anos apenas para campeões mundiais adultos na faixa marrom.',
      faixas: [
        { id: 'branca', nome: 'Branca', bar: lisa(COR.branca), foco: 'Fundamentos',
          fatos: [['Idade mínima', 'Qualquer idade'], ['Permanência mínima', 'Não há'], ['Graus', 'Lisa + 4 graus']],
          texto: 'Postura, quedas seguras, fugas e como se proteger por baixo. A fase de aprender a aprender.' },
        { id: 'azul', nome: 'Azul', bar: lisa(COR.azul), foco: 'Base técnica',
          fatos: [['Idade mínima', '16 anos'], ['Permanência mínima', '2 anos'], ['Graus', 'Lisa + 4 graus']],
          texto: 'Guardas, passagens, raspagens e as primeiras finalizações. O repertório começa a crescer.' },
        { id: 'roxa', nome: 'Roxa', bar: lisa(COR.roxa), foco: 'Conexão',
          fatos: [['Idade mínima', '16 anos'], ['Permanência mínima', '1 ano e meio'], ['Graus', 'Lisa + 4 graus']],
          texto: 'Ligar uma posição na outra e construir um jogo próprio. Muitos começam a ajudar os mais novos.' },
        { id: 'marrom', nome: 'Marrom', bar: lisa(COR.marrom), foco: 'Refinamento',
          fatos: [['Idade mínima', '18 anos'], ['Permanência mínima', '1 ano'], ['Graus', 'Lisa + 4 graus']],
          texto: 'Detalhe, tempo e estratégia. Menos força, mais precisão.' },
        { id: 'preta', nome: 'Preta', bar: lisa(COR.preta, { tip: COR.vermelha, edge: '#FFFFFF', border: '#4A4A4A' }), foco: 'Responsabilidade',
          fatos: [['Idade mínima', '18 anos*'], ['Permanência', '31 anos até a vermelha e preta'], ['Graus', 'Lisa + 6 graus']],
          texto: 'Domínio técnico e o compromisso de ensinar. Os graus vêm com anos de atividade comprovada: o 1º grau, por exemplo, depois de 3 anos na faixa preta.' },
        { id: 'vermelha-preta', nome: 'Vermelha e preta', bar: lisa(COR.vermelha, { bg: gomos(COR.vermelha, COR.preta), tip: '#FFFFFF', edge: '#C0C0C0' }), foco: 'Mestre · 7º grau',
          fatos: [['Idade mínima', '49 anos'], ['Permanência', '7 anos'], ['Grau', '7º grau da faixa preta']],
          texto: 'A faixa de Mestre. Reconhece uma vida inteira dedicada ao jiu-jitsu.' },
        { id: 'vermelha-branca', nome: 'Vermelha e branca', bar: lisa(COR.vermelha, { bg: gomos(COR.vermelha, '#F5F5F5'), tip: '#FFFFFF', edge: '#C0C0C0' }), foco: 'Mestre · 8º grau',
          fatos: [['Idade mínima', '56 anos'], ['Permanência', '10 anos'], ['Grau', '8º grau da faixa preta']],
          texto: 'Faixa de Mestre, segundo nível. Poucos chegam até aqui.' },
        { id: 'vermelha', nome: 'Vermelha', bar: lisa(COR.vermelha, { tip: '#FFFFFF', edge: '#D4AF37' }), foco: 'Grande Mestre · 9º e 10º graus',
          fatos: [['Idade mínima', '66 anos'], ['Permanência', 'Indefinida'], ['Graus', '9º e 10º graus da faixa preta']],
          texto: 'A faixa de Grande Mestre. O 10º grau foi concedido apenas aos irmãos Gracie, pioneiros do jiu-jitsu brasileiro.' }
      ]
    },
    kids: {
      nota: 'Até os 15 anos não há tempo mínimo em cada faixa, e o sistema de graus fica a critério do professor. No ano em que completa 16 anos, o aluno passa para o sistema adulto: a branca continua branca; cinza, amarela e laranja viram azul; a verde vira azul ou roxa, a critério do professor.',
      faixas: [
        { id: 'k-branca', nome: 'Branca', bar: lisa(COR.branca), foco: 'Primeiros passos',
          variantes: [['Branca', lisa(COR.branca)]],
          fatos: [['Idade', 'Qualquer idade'], ['Permanência mínima', 'Não há']],
          texto: 'O começo de tudo: regras do tatame, rolamentos, quedas seguras e brincadeiras que ensinam os movimentos básicos.' },
        { id: 'cinza', nome: 'Grupo Cinza', bar: lisa(COR.cinza), foco: 'Coordenação e confiança',
          variantes: [['Cinza e branca', listrada(COR.cinza, '#F5F5F5')], ['Cinza', lisa(COR.cinza)], ['Cinza e preta', listrada(COR.cinza, '#111111')]],
          fatos: [['Idade', '4 a 15 anos'], ['Permanência mínima', 'Não há']],
          texto: 'Postura, base e as primeiras posições, sempre com brincadeira. A criança aprende a respeitar o colega e a seguir regras.' },
        { id: 'amarela', nome: 'Grupo Amarelo', bar: lisa(COR.amarela), foco: 'Repertório',
          variantes: [['Amarela e branca', listrada(COR.amarela, '#F5F5F5')], ['Amarela', lisa(COR.amarela)], ['Amarela e preta', listrada(COR.amarela, '#111111')]],
          fatos: [['Idade', '7 a 15 anos'], ['Permanência mínima', 'Não há']],
          texto: 'Mais quedas, guardas e imobilizações. Começa a entender como uma posição leva à outra.' },
        { id: 'laranja', nome: 'Grupo Laranja', bar: lisa(COR.laranja), foco: 'Estratégia',
          variantes: [['Laranja e branca', listrada(COR.laranja, '#F5F5F5')], ['Laranja', lisa(COR.laranja)], ['Laranja e preta', listrada(COR.laranja, '#111111')]],
          fatos: [['Idade', '10 a 15 anos'], ['Permanência mínima', 'Não há']],
          texto: 'Raspagens, passagens e finalizações básicas, com mais autonomia e disciplina nos treinos.' },
        { id: 'verde', nome: 'Grupo Verde', bar: lisa(COR.verde), foco: 'Rumo ao adulto',
          variantes: [['Verde e branca', listrada(COR.verde, '#F5F5F5')], ['Verde', lisa(COR.verde)], ['Verde e preta', listrada(COR.verde, '#111111')]],
          fatos: [['Idade', '13 a 15 anos'], ['Permanência mínima', 'Não há']],
          texto: 'Jogo mais completo e maduro. É a última etapa antes do sistema adulto.' }
      ]
    }
  };

  function barStyle(b) {
    return '--belt-bg:' + b.bg + ';--belt-border:' + b.border + ';--tip:' + b.tip + ';--tip-edge:' + b.edge;
  }
  function barHtml(b) {
    return '<span class="belt__bar" aria-hidden="true" style="' + barStyle(b) + '"></span>';
  }

  var belts = document.getElementById('belts');
  var sistemaAtual = 'kids';

  function selecionaFaixa(id) {
    var lista = SISTEMAS[sistemaAtual].faixas;
    var f = lista.find(function (x) { return x.id === id; }) || lista[0];
    setPressed(belts, f.id);
    document.getElementById('belt-name').textContent = (sistemaAtual === 'kids' && f.id !== 'k-branca') ? f.nome : 'Faixa ' + f.nome;
    document.getElementById('belt-focus').textContent = f.foco;
    document.getElementById('belt-text').textContent = f.texto;
    document.getElementById('belt-facts').innerHTML = f.fatos.map(function (x) {
      return '<div><dt>' + x[0] + '</dt><dd>' + x[1] + '</dd></div>';
    }).join('');
    var variantes = document.getElementById('belt-variants');
    if (f.variantes && f.variantes.length > 1) {
      variantes.innerHTML = f.variantes.map(function (v) {
        return '<div class="belt-variant">' + barHtml(v[1]) + '<span>' + v[0] + '</span></div>';
      }).join('');
      variantes.hidden = false;
    } else {
      variantes.innerHTML = '';
      variantes.hidden = true;
    }
  }

  function renderSistema(sistema) {
    sistemaAtual = sistema;
    var cfg = SISTEMAS[sistema];
    belts.className = 'belts belts--' + sistema;
    belts.innerHTML = cfg.faixas.map(function (f) {
      return '<button type="button" class="belt" data-value="' + f.id + '" aria-pressed="false">' +
        barHtml(f.bar) + '<span class="belt__name">' + f.nome + '</span></button>';
    }).join('');
    document.getElementById('belt-note').textContent = cfg.nota;
    document.querySelectorAll('[data-sistema]').forEach(function (t) {
      var ativo = t.dataset.sistema === sistema;
      t.setAttribute('aria-selected', String(ativo));
      t.tabIndex = ativo ? 0 : -1;
      if (ativo) document.getElementById('painel-faixas').setAttribute('aria-labelledby', t.id);
    });
    selecionaFaixa(cfg.faixas[0].id);
  }

  if (belts) {
    belts.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (btn) selecionaFaixa(btn.dataset.value);
    });
    var tabs = Array.prototype.slice.call(document.querySelectorAll('[data-sistema]'));
    tabs.forEach(function (t, idx) {
      t.addEventListener('click', function () { renderSistema(t.dataset.sistema); });
      t.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        var prox = tabs[(idx + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
        prox.focus();
        renderSistema(prox.dataset.sistema);
      });
    });
    renderSistema('kids');
  }

  // FAQ: deixa só uma pergunta aberta por vez
  var faqs = document.querySelectorAll('.faq details');
  faqs.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (!d.open) return;
      faqs.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  // Formulário → WhatsApp
  var form = document.getElementById('form-aula');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var msg = 'Olá! Quero agendar uma aula experimental.\n' +
        'Nome: ' + ((d.get('nome') || '').trim() || '-') + '\n' +
        'Polo: ' + d.get('polo') + '\n' +
        'Para: ' + d.get('para') + '\n' +
        'Experiência: ' + d.get('exp') + '\n' +
        'Objetivo: ' + d.get('obj');
      window.open(wa(msg), '_blank', 'noopener');
    });
  }
})();
