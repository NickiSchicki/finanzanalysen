/* Gemeinsames Profil: einmal eingeben, überall verwenden.
   Speicherung ausschließlich lokal im Browser (localStorage), nichts wird übertragen.

   Verwendung in einem Rechner — zwei Zeilen genügen:
     <script defer src="assets/profil.js"></script>
     Profil.vorbelegen({ alter:'age', bruttoJahr:'gehalt', zvE:'zve' });   // Feld-IDs zuordnen
   Danach werden die Felder beim Laden aus dem Profil gefüllt (nur wenn dort etwas hinterlegt ist)
   und Änderungen des Nutzers zurückgeschrieben.                                              */
window.Profil = (function () {
  var KEY = 'finanzanalysen.profil.v1';

  var FELDER = {
    geburtsjahr:      { label: 'Geburtsjahr',                       einheit: '' },
    bruttoJahr:       { label: 'Bruttojahresgehalt',                einheit: '€' },
    zvE:              { label: 'Zu versteuerndes Einkommen',        einheit: '€' },
    entgeltpunkte:    { label: 'Bisherige Entgeltpunkte',           einheit: '' },
    sparrateMonat:    { label: 'Sparrate pro Monat',                einheit: '€' },
    depotWert:        { label: 'Depot heute',                       einheit: '€' },
    immoWert:         { label: 'Immobilienwert',                    einheit: '€' },
    immoSchuld:       { label: 'Restschuld darauf',                 einheit: '€' },
    bankGuthaben:     { label: 'Bank- und Sparguthaben',            einheit: '€' },
    sonstVermoegen:   { label: 'Sonstiges Vermögen',                einheit: '€' },
    sonstSchulden:    { label: 'Sonstige Schulden',                 einheit: '€' },
    kiSt:             { label: 'Kirchensteuer',                     einheit: '' },
    veranlagung:      { label: 'Veranlagung',                       einheit: '' }
  };

  function lade() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; }
    catch (e) { return {}; }
  }
  function speichere(o) {
    try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {}
    hoeren.forEach(function (f) { try { f(o); } catch (e) {} });
  }

  var hoeren = [];
  var api = {
    felder: FELDER,

    get: function (k) { var o = lade(); return k ? o[k] : o; },

    set: function (k, v) {
      var o = lade();
      if (v === '' || v === null || v === undefined) delete o[k]; else o[k] = v;
      speichere(o); return o;
    },

    merge: function (patch) {
      var o = lade();
      Object.keys(patch || {}).forEach(function (k) {
        var v = patch[k];
        if (v === '' || v === null || v === undefined) delete o[k]; else o[k] = v;
      });
      speichere(o); return o;
    },

    leeren: function () { try { localStorage.removeItem(KEY); } catch (e) {} speichere({}); },

    gefuellt: function () { return Object.keys(lade()).length > 0; },

    onChange: function (f) { hoeren.push(f); },

    /* abgeleitete Grössen */
    alter: function () {
      var g = +this.get('geburtsjahr');
      return g > 1900 ? (new Date().getFullYear() - g) : null;
    },
    nettovermoegen: function () {
      var o = lade(), n = 0, hat = false;
      ['depotWert', 'immoWert', 'bankGuthaben', 'sonstVermoegen'].forEach(function (k) {
        if (o[k] != null) { n += +o[k]; hat = true; }
      });
      ['immoSchuld', 'sonstSchulden'].forEach(function (k) {
        if (o[k] != null) { n -= +o[k]; hat = true; }
      });
      return hat ? n : null;
    },

    /* Zahl aus einem Feld lesen, das Tausenderpunkte enthalten kann.
       WICHTIG: <input type=number> und type=range liefern laut HTML-Standard
       immer einen Punkt als DEZIMALtrenner ("20.5"). Die deutsche Lesart, die
       Punkte als Tausendertrenner entfernt, machte daraus 205 — aus 20,5
       Entgeltpunkten wurden so 205. Deshalb erst der Feldtyp, dann die Sprache. */
    zahl: function (el) {
      if (!el) return null;
      var s = String(el.value == null ? '' : el.value).trim();
      if (s === '') return null;
      var typ = (el.type || '').toLowerCase();
      if (typ === 'number' || typ === 'range') {
        var n = parseFloat(s.replace(',', '.'));
        return isFinite(n) ? n : null;
      }
      s = s.replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, '');
      var v = parseFloat(s);
      return isFinite(v) ? v : null;
    },

    /* Feld-IDs einem Profilschlüssel zuordnen: füllt beim Laden und schreibt bei Änderung zurück */
    vorbelegen: function (map) {
      var self = this;
      function anwenden() {
        var o = lade();
        Object.keys(map).forEach(function (key) {
          var el = document.getElementById(map[key]);
          if (!el) return;
          var v = key === 'alter' ? self.alter() : o[key];
          if (v !== null && v !== undefined && v !== '') {
            // Zahlfelder mit Tausenderpunkten beibehalten
            if (el.classList && el.classList.contains('eurin')) el.value = Math.round(v).toLocaleString('de-DE');
            else el.value = v;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          }
          el.addEventListener('change', function () {
            var z = self.zahl(el);
            if (key === 'alter') { if (z) self.set('geburtsjahr', new Date().getFullYear() - z); }
            else self.set(key, z !== null ? z : el.value);
          });
        });
      }
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', anwenden);
      else anwenden();
    }
  };
  return api;
})();
