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

  // Caminho das faixas
  var FAIXAS = [
    { id: 'branca', nome: 'Branca', cor: '#EDEDED', borda: '#EDEDED', ponteira: '#111111', foco: 'Fundamentos', texto: 'Postura, quedas seguras, fugas e como se proteger por baixo. A fase de aprender a aprender.' },
    { id: 'azul', nome: 'Azul', cor: '#1F4FBF', borda: '#1F4FBF', ponteira: '#111111', foco: 'Base técnica', texto: 'Guardas, passagens, raspagens e as primeiras finalizações. O repertório começa a crescer.' },
    { id: 'roxa', nome: 'Roxa', cor: '#6B2FA3', borda: '#6B2FA3', ponteira: '#111111', foco: 'Conexão', texto: 'Ligar uma posição na outra e construir um jogo próprio. Muitos começam a ajudar os mais novos.' },
    { id: 'marrom', nome: 'Marrom', cor: '#6B3E1F', borda: '#6B3E1F', ponteira: '#111111', foco: 'Refinamento', texto: 'Detalhe, tempo e estratégia. Menos força, mais precisão.' },
    { id: 'preta', nome: 'Preta', cor: '#111111', borda: '#4A4A4A', ponteira: 'var(--accent)', foco: 'Responsabilidade', texto: 'Domínio técnico e o compromisso de ensinar. E a certeza de que o aprendizado nunca termina.' }
  ];

  var belts = document.getElementById('belts');

  function selecionaFaixa(id) {
    var f = FAIXAS.find(function (x) { return x.id === id; }) || FAIXAS[0];
    setPressed(belts, f.id);
    document.getElementById('belt-name').textContent = 'Faixa ' + f.nome;
    document.getElementById('belt-focus').textContent = 'Foco: ' + f.foco;
    document.getElementById('belt-text').textContent = f.texto;
  }

  if (belts) {
    belts.innerHTML = FAIXAS.map(function (f) {
      return '<button type="button" class="belt" data-value="' + f.id + '" aria-pressed="false">' +
        '<span class="belt__bar" aria-hidden="true" style="--belt:' + f.cor + ';--belt-border:' + f.borda + ';--tip:' + f.ponteira + '"></span>' +
        '<span class="belt__name">' + f.nome + '</span></button>';
    }).join('');
    belts.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (btn) selecionaFaixa(btn.dataset.value);
    });
    selecionaFaixa('branca');
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
