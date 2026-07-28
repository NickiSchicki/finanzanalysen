/* Zentrales Register der Datenstände.
   Eine Datei pflegen — jede Seite zeigt ihren Stand automatisch im Fuß an,
   und Selbsttest.html warnt, wenn etwas abgelaufen ist.

   stand      : worauf die Zahlen der Seite beruhen (Text)
   gueltigBis : ISO-Datum, ab dem der Wert überholt ist (optional)
   pruefen    : ISO-Datum, ab dem eine Aktualisierung ansteht (optional)
   quelle     : Kurzangabe der Herkunft                                    */
window.DATENSTAND = {
  _default: { stand: 'Marktdaten bis 2025/2026', quelle: 'Shiller, FRED, Yahoo Finance' },

  'Mein_Vermoegensbild.html': {
    stand: 'Rechengrößen 2026 und Vermögenserhebung 2023',
    pruefen: '2027-04-01',
    quelle: 'SGB VI, Bundesbank PHF Welle 5',
    hinweis: 'Angaben werden nur lokal im Browser gespeichert.' },

  // --- Rechner mit Rechtsstand (jährlich zu prüfen) ---
  'Rentenluecke_Rechner.html': {
    stand: 'Rentenwert 42,52 € je Entgeltpunkt, Rechengrößen 2026',
    gueltigBis: '2027-06-30', pruefen: '2027-04-01',
    quelle: 'Rentenwertbestimmungsverordnung 2026, SGB VI, Deutsche Rentenversicherung',
    hinweis: 'Der Rentenwert wird jeweils zum 1. Juli angepasst.' },
  'Depot_Steuern_Kosten.html': {
    stand: 'Steuerrecht 2025/2026, Basiszins der Vorabpauschale je Jahr',
    pruefen: '2027-02-01',
    quelle: '§ 32d EStG, § 18 InvStG, Basiszins des Bundesfinanzministeriums',
    hinweis: 'Der Basiszins wird jährlich im Januar veröffentlicht.' },
  'Tilgen_oder_Investieren.html': {
    stand: 'Steuerrecht 2025/2026',
    pruefen: '2027-02-01', quelle: '§ 32d EStG, § 20 InvStG' },
  'Immobilien_Investitionsrechner.html': {
    stand: 'Einkommensteuertarif 2025/2026, Grunderwerbsteuer der Länder, AfA-Sätze',
    pruefen: '2027-01-15',
    quelle: '§§ 7, 7b, 23, 32a EStG, GrEStG der Länder',
    hinweis: 'Grunderwerbsteuersätze unterliegen der Länderhoheit und können unterjährig wechseln.' },
  'Vermoegen_Einordnung.html': {
    stand: 'Erhebung 2023 (Feldzeit Mai 2023 bis Februar 2024)',
    pruefen: '2027-01-01',
    quelle: 'Deutsche Bundesbank, PHF Welle 5 / EZB HFCS Wave 2023',
    hinweis: 'Die nächste Welle (PHF 2026) wird voraussichtlich später veröffentlicht.' },

  // --- Werkzeuge auf historischen Renditereihen ---
  'Lebenszyklus_Simulator.html': {
    stand: 'Reale Renditen USA 1871–2025, Deutschland 1871–2020 (Immobilien ab 1963)',
    quelle: 'Shiller; Jordà-Schularick-Taylor Macrohistory Database R6' },
  'Sparplan_Perzentile.html': {
    stand: 'Reale Renditen 1871–2025', quelle: 'Shiller' },
  'Geschichts_Stresstest.html': {
    stand: 'Reale Renditen 1871–2025', quelle: 'Shiller' },
  'Altersvorsorge_Rechner.html': {
    stand: 'Annahmenbasiert, keine historische Datenreihe', quelle: 'Eigene Berechnung' },
  'Selbsttest.html': {
    stand: 'Prüft die Bibliotheken gegen ihre jeweiligen Sollwerte', quelle: 'Eigene Berechnung' },

  // --- Bewertungsanalysen mit aktuellem Marktbezug ---
  'Standortbestimmung_Maerkte_2026.html': {
    stand: 'Marktstand 2026', pruefen: '2027-01-01', quelle: 'Shiller, FRED, Research Affiliates' },
  'USA_CAPE_vs_10Jahresrendite.html': {
    stand: 'CAPE-Reihe 1881–2025', pruefen: '2027-01-01', quelle: 'Shiller' },
  'Regionen_CAPE_10Jahres_Ausblick.html': {
    stand: 'Regionen-CAPE, Stand 2025/2026', pruefen: '2027-01-01', quelle: 'Research Affiliates, Barclays' }
};
