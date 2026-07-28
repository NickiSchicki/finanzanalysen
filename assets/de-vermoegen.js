// ============================================================
// RECHNER 3 – VERMOEGENSEINORDNUNG DEUTSCHLAND
// Datenbasis: Bundesbank PHF Welle 5 / EZB HFCS Wave 2023 (Tabellen J3, A3, A4)
// Erhebungsjahr 2023, Statistiktabellen Juni 2026. Werte je HAUSHALT.
// status: 'belegt'        = direkt publizierter Wert
//         'belegt_abgeleitet' = konstruktionsbedingt exakt (Gruppenmedian = Perzentil)
//         'interpoliert'  = lineare Interpolation, NICHT publiziert
//         'nicht_belegt'  = existiert in keiner Primaerquelle -> null, nicht schaetzen
// ============================================================
const VERMOEGEN_ERHEBUNGSJAHR = 2023;
const VERMOEGEN_QUELLE = 'Deutsche Bundesbank PHF Welle 5 / EZB HFCS Wave 2023 (wave 5), Tabellen J3, A3, A4';

// --- (A) PERZENTILTABELLE NETTOVERMOEGEN GESAMT (je Haushalt, 2023, EUR) ---
const NETTOVERMOEGEN_PERZENTILE_GESAMT = [
  { p: 10, wert:     800, status: 'belegt',           quelle: 'HFCS J3' },
  { p: 20, wert:    7100, status: 'belegt',           quelle: 'HFCS J3' },
  { p: 25, wert:   13100, status: 'interpoliert',     quelle: 'linear zwischen p20 und p30' },
  { p: 30, wert:   19100, status: 'belegt',           quelle: 'HFCS J3' },
  { p: 40, wert:   49300, status: 'belegt',           quelle: 'HFCS J3' },
  { p: 50, wert:  103300, status: 'belegt',           quelle: 'HFCS J3 (Bundesbank: 103.200)' },
  { p: 60, wert:  194500, status: 'belegt',           quelle: 'HFCS J3' },
  { p: 70, wert:  325200, status: 'belegt',           quelle: 'HFCS J3' },
  { p: 75, wert:  398300, status: 'interpoliert',     quelle: 'linear zwischen p70 und p80' },
  { p: 80, wert:  471400, status: 'belegt',           quelle: 'HFCS J3' },
  { p: 85, wert:  586000, status: 'belegt_abgeleitet',quelle: 'HFCS A3, Median der Gruppe 80-90 %' },
  { p: 90, wert:  775200, status: 'belegt',           quelle: 'HFCS J3 (SE 38.900; IW: 777.200; Bundesbank-Verhaeltnis 7,6 x Median ~ 784.000)' },
  { p: 95, wert: 1231100, status: 'belegt_abgeleitet',quelle: 'HFCS A3, Median der Gruppe 90-100 %' },
  { p: 99, wert:    null, status: 'nicht_belegt',     quelle: 'weder Bundesbank noch EZB weisen p99 je Haushalt aus – NICHT schaetzen' }
];

// --- (B) PERZENTILE NACH ALTERSGRUPPEN (je Haushalt, 2023, EUR) ---
// median/mittelwert/standardfehler: HFCS A3/A4, Gruppierung nach der REFERENZPERSON
// p80_iw/p90_iw/gini_iw: IW-Kurzbericht 59/2025 aus dem PHF-2023-SUF,
//   Gruppierung nach der AELTESTEN Person im Haushalt -> nicht direkt vergleichbar
const NETTOVERMOEGEN_NACH_ALTER = [
  { gruppe: '16-34', median: 17600, mittelwert: 106900, standardfehler_median: 3100,
    median_iw: 17300, p80_iw: 100000, p90_iw: 200400, gini_iw: 0.83,
    median_single_iw: 9800, median_paar_iw: 42300, status: 'belegt' },
  { gruppe: '35-44', median: 75900, mittelwert: 237500, standardfehler_median: 13400,
    median_iw: null, p80_iw: null, p90_iw: null, gini_iw: 0.80,
    median_single_iw: null, median_paar_iw: null, status: 'belegt' },
  { gruppe: '45-54', median: 157100, mittelwert: 409600, standardfehler_median: 22100,
    median_iw: null, p80_iw: null, p90_iw: null, gini_iw: 0.73,
    median_single_iw: null, median_paar_iw: null, status: 'belegt' },
  { gruppe: '55-64', median: 256900, mittelwert: 440100, standardfehler_median: 32600,
    median_iw: 241100, p80_iw: null, p90_iw: 1061200, gini_iw: 0.63,
    median_single_iw: 79800, median_paar_iw: 361800, status: 'belegt' },
  { gruppe: '65-74', median: 211600, mittelwert: 411400, standardfehler_median: 26500,
    median_iw: null, p80_iw: null, p90_iw: 1019800, gini_iw: 0.67,
    median_single_iw: null, median_paar_iw: null, status: 'belegt' },
  { gruppe: '75+',   median: 139800, mittelwert: 343700, standardfehler_median: 31400,
    median_iw: null, p80_iw: null, p90_iw: 767700, gini_iw: 0.67,
    median_single_iw: 122700, median_paar_iw: 283700, status: 'belegt' }
];
// Hinweis: gini_iw fuer 65+ ist im IW-Bericht als Spanne 0,66-0,68 angegeben; 0,67 = Mittelwert der Spanne.
// Werte mit null sind in den Primaerquellen NICHT ausgewiesen und duerfen nicht interpoliert werden.

// --- (C) WEITERE BELEGTE AUFRISSE 2023 ---
const NETTOVERMOEGEN_KONTEXT = {
  ostWest:      { west:  { median: 143200, mittelwert: 364900 },
                  ost:   { median:  35900, mittelwert: 170100 },
                  sued:  { median: 188800, mittelwert: 442800 } },   // BY, BW, HE
  wohnstatus:   { eigentuemerOhneHypothek: { median: 450200 },
                  eigentuemerMitHypothek:  { median: 379900 },
                  mieter:                  { median:  18300 },
                  wohneigentumsquote2023: 0.42, wohneigentumsquote2021: 0.45 },
  haushaltstyp: { alleinlebend:      { median:  37700, mittelwert: 221800 },
                  alleinerziehend:   { median:   null, mittelwert:  96900 },
                  paarOhneKinder:    { median:   null, mittelwert: 409700 },
                  paarMitKindern:    { median:   null, mittelwert: 453500 } },
  haushaltsgroesse: { 1: 37800, 2: 172200, 3: 240800, 4: 232300, '5plus': 58700 },
  ungleichheit: { gini: 0.724, giniHFCS: 0.725, top10Anteil: 0.537, top5Anteil: 0.385,
                  anteil50bis90: 0.434, p90durchMedian: 7.6, mittelwertDurchMedian: 3.15,
                  interquartilsabstandNominal: 390000, interquartilsabstandReal2010: 287000,
                  top10AnteilMitDWAHinzuschaetzung: 0.605 },
  negativesNettovermoegen: { anteilGesamt_IW: 0.057, anteilGesamt_HFCS_F3: 0.056,
                             unter35: 0.11, ab75: 0.01, mittelwertUnterstesFuenftel: -10700 },
  portfolio2023: { girokonto: { quote: 1.00, bedingterMittelwert: 12200 },
                   sparkonto: { quote: 0.67, bedingterMittelwert: 35500 },
                   privateAltersvorsorgeLV: { quote: 0.39, bedingterMittelwert: 44500 },
                   fonds:  { quote: 0.24, bedingterMittelwert: 58000 },
                   aktien: { quote: 0.18, bedingterMittelwert: 62400 },
                   verschuldeteHaushalte: 0.39, schuldendienstAnteilNettoeinkommen: 0.18 },
  international_median: { DE: 103300, Euroraum: 140100, FR: 149000, IT: 162800, ES: 151600,
                          NL: 143500, AT: 124700, BE: 254200, IE: 258100 }
};

// --- (D) PRO ERWACHSENEM – ANDERES KONZEPT UND ANDERES JAHR (DIW/SOEP 2017) ---
// NICHT mit den Haushaltszahlen von 2023 in einer Tabelle mischen.
const NETTOVERMOEGEN_PRO_ERWACHSENEM_SOEP2017 = {
  erhebungsjahr: 2017,
  alterDerDaten: '9 Jahre (Stand Juli 2026); 6 Jahre aelter als PHF 2023',
  quelle: 'DIW Wochenbericht 40/2019, Tabelle 1 (SOEPv34, 0,1 % Top-Coding), Personen ab 17 Jahren, inkl. Kfz-Wert, nach Abzug von Studienkrediten',
  mittelwert: 108449, median: 26260,
  ohneKfzUndStudienkredite: { mittelwert: 102868, median: 20010 },
  perzentile: [
    { p:  1, wert: -20360, status: 'belegt' },
    { p:  5, wert:  -2044, status: 'belegt' },
    { p: 10, wert:      0, status: 'belegt' },
    { p: 25, wert:   1590, status: 'belegt' },
    { p: 50, wert:  26260, status: 'belegt' },
    { p: 75, wert: 130040, status: 'belegt' },
    { p: 90, wert: 275770, status: 'belegt' },
    { p: 95, wert: 419766, status: 'belegt' },
    { p: 99, wert: 1045680, status: 'belegt' }
  ],
  anteilUnterNull: 0.064, anteilGenauNull: 0.145,
  p90durchP50: 10.5, p75durchP50: 5.0, gini: 0.759
};

// --- (E) EINORDNUNGSFUNKTIONEN ---
// Perzentilrang durch lineare Interpolation zwischen den belegten Stuetzstellen
function perzentilrang(nettovermoegen, tabelle = NETTOVERMOEGEN_PERZENTILE_GESAMT) {
  const pts = tabelle.filter(r => r.wert != null).sort((a, b) => a.wert - b.wert);
  if (nettovermoegen <= pts[0].wert) return pts[0].p;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    if (nettovermoegen <= b.wert) {
      const t = (nettovermoegen - a.wert) / (b.wert - a.wert);
      return a.p + t * (b.p - a.p);
    }
  }
  return pts[pts.length - 1].p;   // oberhalb p95: nicht weiter aufloesbar
}

function altersgruppeFuer(alter) {
  if (alter < 35) return '16-34';
  if (alter < 45) return '35-44';
  if (alter < 55) return '45-54';
  if (alter < 65) return '55-64';
  if (alter < 75) return '65-74';
  return '75+';
}

// Relative Position gegenueber der EIGENEN Altersgruppe (aussagekraeftiger als der Gesamtmedian)
function einordnungNachAlter(nettovermoegen, alter) {
  const g = NETTOVERMOEGEN_NACH_ALTER.find(r => r.gruppe === altersgruppeFuer(alter));
  return {
    altersgruppe: g.gruppe,
    medianGruppe: g.median,
    mittelwertGruppe: g.mittelwert,
    standardfehlerMedian: g.standardfehler_median,
    faktorZumGruppenmedian: g.median > 0 ? nettovermoegen / g.median : null,
    p90Gruppe: g.p90_iw,                       // null, wenn nicht publiziert
    ueberP90Gruppe: g.p90_iw != null ? nettovermoegen >= g.p90_iw : null,
    perzentilrangGesamt: perzentilrang(nettovermoegen),
    faktorZumGesamtmedian: nettovermoegen / 103300,
    hinweis: 'Erhebungsjahr 2023; gesetzliche Rente, Pension und bAV sind NICHT enthalten.'
  };
}

// Vergleichbarkeit herstellen: eigenes Vermoegen OHNE Rentenanwartschaften ansetzen
function vergleichbaresNettovermoegen({ immobilien = 0, finanzanlagen = 0, bankguthaben = 0,
                                        privateRentenLV = 0, fahrzeuge = 0, betriebsvermoegen = 0,
                                        wertgegenstaende = 0, schulden = 0 }) {
  return immobilien + finanzanlagen + bankguthaben + privateRentenLV
       + fahrzeuge + betriebsvermoegen + wertgegenstaende - schulden;
  // NICHT addieren: gesetzliche Rentenanwartschaft, Beamtenpension, betriebliche Altersversorgung
}
