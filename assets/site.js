/* Gemeinsame Navigation für alle Analysen.
   Eine Zeile pro Seite genügt:  <script defer src="assets/site.js"></script>
   Optional: <body data-section="..."> setzt die Rubrik im Kopf.
   Baut aus assets/site-map.js automatisch:
     - Kopfleiste mit Rubrik und Sprungmenü über alle Analysen
     - "Weiterlesen": thematisch verwandte Seiten (Tag-Überschneidung)
     - Vor/Zurück entlang des roten Fadens                                     */
(function () {
  var MAP = window.SITEMAP || [];

  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
  function here(){ return (location.pathname.split('/').pop() || '00_Start.html'); }

  function buildHeader(file, isIndex, section) {
    var h = document.createElement('header');
    h.className = 'sitehead';
    h.innerHTML =
      '<div class="in">' +
        '<a class="brand" href="00_Start.html">Finanz<em>analysen</em></a>' +
        (section ? '<span class="crumb">' + esc(section) + '</span>' : '') +
        '<span class="sp"></span>' +
        '<button class="navbtn" id="navToggle" aria-expanded="false">Alle Analysen</button>' +
        (isIndex ? '' : '<a class="back" href="00_Start.html">Übersicht</a>') +
      '</div>';
    return h;
  }

  function buildMenu(file) {
    var groups = {}, order = [];
    MAP.forEach(function (p) {
      if (!groups[p.s]) { groups[p.s] = []; order.push(p.s); }
      groups[p.s].push(p);
    });
    var html = '<div class="navpanel-in">';
    order.forEach(function (sec) {
      html += '<div class="navgrp"><div class="navgrp-t">' + esc(sec) + '</div>';
      groups[sec].forEach(function (p) {
        html += '<a href="' + p.f + '"' + (p.f === file ? ' class="cur"' : '') + '>' + esc(p.t) + '</a>';
      });
      html += '</div>';
    });
    html += '</div>';
    var d = document.createElement('div');
    d.className = 'navpanel'; d.id = 'navPanel'; d.innerHTML = html;
    return d;
  }

  /* verwandte Seiten: Tag-Überschneidung, gleiche Rubrik zählt leicht mit.
     intern markierte Seiten (Selbsttest) erscheinen nicht als Empfehlung. */
  function related(file, n) {
    var me = MAP.filter(function (p) { return p.f === file; })[0];
    if (!me) return [];
    return MAP
      .filter(function (p) { return p.f !== file && !p.intern; })
      .map(function (p) {
        var shared = p.tags.filter(function (t) { return me.tags.indexOf(t) > -1; }).length;
        return { p: p, score: shared * 2 + (p.s === me.s ? 1 : 0) };
      })
      .filter(function (x) { return x.score > 1; })
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, n)
      .map(function (x) { return x.p; });
  }

  function buildFooterNav(file) {
    /* Vor/Zurück läuft nur über den Lesefaden — interne Seiten bleiben außen
       vor, damit die Synthese das Finale ist und nicht der Selbsttest. */
    var FADEN = MAP.filter(function (p) { return !p.intern; });
    var idx = -1;
    FADEN.forEach(function (p, i) { if (p.f === file) idx = i; });
    if (idx < 0) return null;
    var rel = related(file, 3);
    var prev = idx > 0 ? FADEN[idx - 1] : null;
    var next = idx < FADEN.length - 1 ? FADEN[idx + 1] : null;

    var el = document.createElement('nav');
    el.className = 'sitenav';
    var html = '';
    if (rel.length) {
      html += '<div class="sn-h">Weiterlesen</div><div class="sn-rel">';
      rel.forEach(function (p) {
        html += '<a href="' + p.f + '"><span class="sn-s">' + esc(p.s) + '</span>' +
                '<span class="sn-t">' + esc(p.t) + '</span>' +
                '<span class="sn-b">' + esc(p.b) + '</span></a>';
      });
      html += '</div>';
    }
    html += '<div class="sn-pn">' +
      (prev ? '<a class="sn-prev" href="' + prev.f + '"><span>Zurück</span><b>' + esc(prev.t) + '</b></a>' : '<span></span>') +
      (next ? '<a class="sn-next" href="' + next.f + '"><span>Weiter</span><b>' + esc(next.t) + '</b></a>' : '<span></span>') +
      '</div>';
    el.innerHTML = html;
    return el;
  }

  function init() {
    if (!document.body || document.querySelector('.sitehead')) return;
    var file = here();
    var isIndex = /^(00_Start\.html)?$/.test(file);
    var section = document.body.getAttribute('data-section') || '';

    document.body.insertBefore(buildHeader(file, isIndex, section), document.body.firstChild);
    var panel = buildMenu(file);
    document.body.insertBefore(panel, document.body.children[1] || null);

    var btn = document.getElementById('navToggle');
    function setOpen(v) {
      panel.classList.toggle('open', v);
      btn.classList.toggle('on', v);
      btn.setAttribute('aria-expanded', v ? 'true' : 'false');
    }
    btn.addEventListener('click', function (e) { e.stopPropagation(); setOpen(!panel.classList.contains('open')); });
    document.addEventListener('click', function (e) { if (!panel.contains(e.target)) setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });

    if (!isIndex) {
      var wrap = document.querySelector('.wrap') || document.body;
      showDatenstand(file, wrap);
      var fn = buildFooterNav(file);
      if (fn) wrap.appendChild(fn);
    }
  }

  /* Datenstand aus dem zentralen Register anzeigen (assets/datenstand.js) */
  function showDatenstand(file, wrap) {
    var reg = window.DATENSTAND;
    if (!reg) return;
    var e = reg[file] || reg._default;
    if (!e) return;
    var heute = new Date().toISOString().slice(0, 10), warn = '';
    if (e.gueltigBis && heute > e.gueltigBis) warn = 'abgelaufen';
    else if (e.pruefen && heute >= e.pruefen) warn = 'zu prüfen';
    var d = document.createElement('div');
    d.className = 'datenstand' + (warn ? ' warn' : '');
    d.innerHTML =
      '<span class="ds-l">Datenstand</span> ' + esc(e.stand) +
      (e.quelle ? ' <span class="ds-q">· ' + esc(e.quelle) + '</span>' : '') +
      (e.gueltigBis ? ' <span class="ds-q">· gültig bis ' + esc(e.gueltigBis.split('-').reverse().join('.')) + '</span>' : '') +
      (warn ? ' <b class="ds-w">' + warn + '</b>' : '') +
      (e.hinweis ? '<br><span class="ds-q">' + esc(e.hinweis) + '</span>' : '');
    var foot = wrap.querySelector('.foot');
    if (foot) foot.parentNode.insertBefore(d, foot);
    else wrap.appendChild(d);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
