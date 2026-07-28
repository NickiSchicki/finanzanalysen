// ============================================================
// RECHNER 1 – GESETZLICHE RENTE & RENTENLUECKE
// Stand 25.07.2026. Alle Verifikationskorrekturen eingearbeitet.
// ============================================================
const RV = {
  aktuellerRentenwert: 42.52,                       // EUR/EP/Monat ab 01.07.2026 (RWBestV 2026)
  rentenwertAbJuli: { 2023: 37.60, 2024: 39.32, 2025: 40.79, 2026: 42.52 },
  durchschnittsentgelt: { 2020:39167, 2021:40463, 2022:42053, 2023:44732,
                          2024:47085, 2025:50493, 2026:51944 },   // 2025/26 vorlaeufig
  bbgJahr: { 2024:90600, 2025:96600, 2026:101400 },  // allg. RV, ab 2025 bundeseinheitlich
  beitragssatz: 0.186,
  kvAllgemein: 0.146,
  zusatzbeitragDurchschnitt: { 2024:0.017, 2025:0.025, 2026:0.029 },  // § 242a SGB V
  pvBasis: 0.036, pvKinderlos: 0.042,
  grundfreibetrag: { 2025:12096, 2026:12348 },
  wkPauschbetragRente: 102, saPauschbetrag: 36
};

const RENTENARTFAKTOR = { altersrente:1.0, erziehungsrente:1.0, emVoll:1.0,
  emTeilweise:0.5, witwenGross:0.55, witwenKlein:0.25, halbwaise:0.1, vollwaise:0.2 };

// --- Rentenwert datumsabhaengig (Anpassung immer zum 1. Juli) ---
function rentenwertZumDatum(datum) {
  const d = (datum instanceof Date) ? datum : new Date(datum);
  const j = d.getFullYear(), stichjahr = (d.getMonth() >= 6) ? j : j - 1;
  const jahre = Object.keys(RV.rentenwertAbJuli).map(Number).sort((a,b)=>a-b);
  let rw = RV.rentenwertAbJuli[jahre[0]];
  for (const y of jahre) if (y <= stichjahr) rw = RV.rentenwertAbJuli[y];
  return rw;
}

// --- (1) ENTGELTPUNKTE – § 70 Abs. 1 SGB VI ---
// EP = min(Bruttojahresentgelt, BBG) / Durchschnittsentgelt desselben Kalenderjahres
function entgeltpunkte(brutto, jahr) {
  const de = RV.durchschnittsentgelt[jahr], bbg = RV.bbgJahr[jahr];
  if (de == null || bbg == null) throw new Error('Kein amtlicher Rechenwert fuer ' + jahr);
  return Math.min(Math.max(0, brutto), bbg) / de;
}
function maxEntgeltpunkteJahr(jahr) { return RV.bbgJahr[jahr] / RV.durchschnittsentgelt[jahr]; }
function summeEntgeltpunkte(verlauf) {           // [{jahr, brutto}, ...]
  return verlauf.reduce((s, r) => s + entgeltpunkte(r.brutto, r.jahr), 0);
}
// Zukunftsprojektion: bei konstantem RELATIVEM Gehalt bleiben die EP/Jahr konstant
function epProJahrRelativ(gehaltAlsVielfachesDesDurchschnitts, jahr) {
  return Math.min(gehaltAlsVielfachesDesDurchschnitts, maxEntgeltpunkteJahr(jahr));
}

// --- (2) ALTERSGRENZEN ---
// Regelaltersgrenze in Monaten (§§ 35, 235 SGB VI)
function regelaltersgrenzeMonate(geburtsjahr) {
  if (geburtsjahr <= 1946) return 780;                               // 65 J.
  if (geburtsjahr <= 1958) return 780 + (geburtsjahr - 1946);        // +1 M./Jg. -> 1958 = 792
  if (geburtsjahr <= 1963) return 792 + 2 * (geburtsjahr - 1958);    // +2 M./Jg. -> 1963 = 802
  return 804;                                                        // ab Jg. 1964 = 67 J.
}
// Abschlagsfreie Altersgrenze bei 45 Beitragsjahren
// Jg. < 1964: § 236b SGB VI | Jg. >= 1964: § 38 SGB VI (KORRIGIERTES Normzitat)
function altersgrenze45JahreMonate(geburtsjahr) {
  if (geburtsjahr <= 1952) return 756;                               // 63 J.
  if (geburtsjahr <= 1958) return 756 + 2 * (geburtsjahr - 1952);    // 1958 = 768 (64 J.)
  if (geburtsjahr <= 1963) return 768 + 2 * (geburtsjahr - 1958);    // 1963 = 778 (64 J. 10 M.)
  return 780;                                                        // ab Jg. 1964 = 65 J.
}
// Frueheste Inanspruchnahme langjaehrig Versicherte (35 J. Wartezeit, mit Abschlag)
// Jg. < 1964: § 236 SGB VI | Jg. >= 1964: § 36 SGB VI (KORRIGIERTES Normzitat)
const FRUEHESTER_RENTENBEGINN_MONATE = 756;                          // 63 J.

// --- (3) ZUGANGSFAKTOR – § 77 Abs. 2 SGB VI ---
function zugangsfaktor(rentenbeginnAlterMonate, geburtsjahr) {
  const rag = regelaltersgrenzeMonate(geburtsjahr);
  const diff = rentenbeginnAlterMonate - rag;   // <0 vorzeitig, >0 Aufschub
  return diff < 0 ? 1 - 0.003 * (-diff) : 1 + 0.005 * diff;
}

// --- (4) BRUTTORENTE – §§ 64, 66, 67 SGB VI ---
function bruttoRente(punkte, zugangsfaktor, rentenwert = RV.aktuellerRentenwert,
                     rentenartfaktor = RENTENARTFAKTOR.altersrente) {
  return punkte * zugangsfaktor * rentenartfaktor * rentenwert;
}
// Eckrente 2026: bruttoRente(45, 1.0, 42.52) = 1913.40 EUR/Monat

// --- (5) NETTORENTE (Zahlbetrag nach KV/PV) – § 249a SGB V, § 59 SGB XI ---
function nettoRenteDetail(brutto, jahr = 2026, kinderlos = false, opts = {}) {
  const zb = (opts.zusatzbeitrag != null) ? opts.zusatzbeitrag : RV.zusatzbeitragDurchschnitt[jahr];
  if (zb == null) throw new Error('Kein Zusatzbeitragssatz fuer ' + jahr + ' – bitte opts.zusatzbeitrag setzen');
  const kvSatz = RV.kvAllgemein / 2 + zb / 2;                        // Rentner: 7,3 % + halber Zusatzbeitrag
  const kinder = (opts.kinderUnter25 != null) ? opts.kinderUnter25 : 1;
  const pvSatz = kinderlos ? RV.pvKinderlos
                           : RV.pvBasis - 0.0025 * Math.min(Math.max(kinder - 1, 0), 4);
  const kvBeitrag = brutto * kvSatz, pvBeitrag = brutto * pvSatz;
  return { brutto, kvSatz, pvSatz, kvBeitrag, pvBeitrag,
           abzugsquote: kvSatz + pvSatz, netto: brutto - kvBeitrag - pvBeitrag };
}
// Hauptfunktion mit der geforderten Signatur – liefert den Zahlbetrag als Zahl
function nettoRente(brutto, jahr = 2026, kinderlos = false, opts = {}) {
  return nettoRenteDetail(brutto, jahr, kinderlos, opts).netto;
}
// Eckrente 2026: nettoRente(1913.40, 2026, false) = 1677.10 EUR/Monat (KORRIGIERT)

// --- (6) BESTEUERUNG ---
function besteuerungsanteil(rentenbeginnJahr) {
  const j = rentenbeginnJahr;
  if (j <= 2005) return 0.50;
  if (j <= 2020) return 0.50 + 0.02 * (j - 2005);    // 2020 = 80 %
  if (j <= 2022) return 0.80 + 0.01 * (j - 2020);    // 2021 = 81 %, 2022 = 82 %
  if (j <= 2058) return 0.825 + 0.005 * (j - 2023);  // 2026 = 84 %, 2040 = 91,0 %
  return 1.00;
}
// Freibetrag aus dem ersten VOLLEN Rentenjahr, danach als EURO-Betrag eingefroren
function rentenfreibetrag(jahresbruttoRenteErstesVollesJahr, rentenbeginnJahr) {
  return jahresbruttoRenteErstesVollesJahr * (1 - besteuerungsanteil(rentenbeginnJahr));
}
function steuerpflichtigeRente(jahresbruttoRenteImJahr, freibetragFix) {
  return Math.max(0, jahresbruttoRenteImJahr - freibetragFix);
}
function zvERente(jahresbruttoRente, freibetragFix, kvPvBeitraegeJahr) {
  return Math.max(0, steuerpflichtigeRente(jahresbruttoRente, freibetragFix)
         - RV.wkPauschbetragRente - kvPvBeitraegeJahr - RV.saPauschbetrag);
}

// --- (7) EINKOMMENSTEUERTARIF § 32a EStG (parametrisiert) ---
// ACHTUNG: Die Tarifzonen 2025 sind belegt. Die 2026er Zonenkonstanten wurden von der
// Verifikation NICHT geprueft – vor Produktivbetrieb gegen § 32a EStG n.F. abgleichen.
// Nur der Grundfreibetrag 2026 (12.348 EUR) ist verifiziert.
const TARIF = {
  2025: { gfb:12096, z2:17443, z3:68480, z4:277825,
          a2:932.30, b2:1400, a3:176.64, b3:2397, c3:1015.13,
          m4:0.42, s4:10911.92, m5:0.45, s5:19246.67 },
  2026: { gfb:12348, z2:17799, z3:69878, z4:277825,
          a2:914.51, b2:1400, a3:173.10, b3:2397, c3:1034.87,
          m4:0.42, s4:11135.63, m5:0.45, s5:19470.38, _unverifiziert:true }
};
function einkommensteuer(zvE, jahr = 2026) {
  const t = TARIF[jahr]; if (!t) throw new Error('Kein Tarif fuer ' + jahr);
  const x = Math.floor(Math.max(0, zvE));
  if (x <= t.gfb) return 0;
  if (x <= t.z2) { const y = (x - t.gfb) / 10000; return Math.floor((t.a2 * y + t.b2) * y); }
  if (x <= t.z3) { const z = (x - t.z2) / 10000; return Math.floor((t.a3 * z + t.b3) * z + t.c3); }
  if (x <= t.z4) return Math.floor(t.m4 * x - t.s4);
  return Math.floor(t.m5 * x - t.s5);
}
// Nettorente NACH Steuer (Jahreswert)
function nettoRenteNachSteuer(jahresbrutto, jahr, kinderlos, rentenbeginnJahr, freibetragFix, opts = {}) {
  const d = nettoRenteDetail(jahresbrutto / 12, jahr, kinderlos, opts);
  const kvPvJahr = (d.kvBeitrag + d.pvBeitrag) * 12;
  const kvPvAbzugsfaehig = kinderlos ? kvPvJahr - jahresbrutto * 0.006 : kvPvJahr; // Kinderlosenzuschlag nicht abziehbar
  const zvE = zvERente(jahresbrutto, freibetragFix, kvPvAbzugsfaehig);
  const est = einkommensteuer(zvE, jahr);
  return { jahresbrutto, kvPvJahr, zvE, einkommensteuer: est,
           nettoJahr: jahresbrutto - kvPvJahr - est, nettoMonat: (jahresbrutto - kvPvJahr - est) / 12 };
}

// --- (8) RENTENLUECKE ---
function rentenluecke(bedarf, nettoRente, opts = {}) {
  const luecke = Math.max(0, bedarf - nettoRente);
  const swr = (opts.entnahmerate != null) ? opts.entnahmerate : 0.035;  // konservative reale SWR
  return {
    bedarfMonat: bedarf,
    nettoRenteMonat: nettoRente,
    lueckeMonat: luecke,
    lueckeJahr: luecke * 12,
    deckungsgrad: bedarf > 0 ? nettoRente / bedarf : 1,
    kapitalbedarfSWR: luecke * 12 / swr,                 // Dauerentnahme, ohne Kapitalverzehr-Ende
    kapitalbedarfBarwert: (jahre, realzins) => kapitalbedarfBarwert(luecke * 12, jahre, realzins)
  };
}
// Barwert einer nachschuessigen realen Jahresentnahme ueber n Jahre
function kapitalbedarfBarwert(jahresluecke, jahre, realzins = 0.02) {
  if (realzins === 0) return jahresluecke * jahre;
  return jahresluecke * (1 - Math.pow(1 + realzins, -jahre)) / realzins;
}

// --- (9) RENTENWERT-PROJEKTION ---
// Bis 2031 Niveauschutzklausel (§ 255e SGB VI) -> Rentenwert folgt naeherungsweise der
// Bruttolohnentwicklung; ab 2032 Nachhaltigkeitsfaktor wieder wirksam (Daempfung 0,3-0,6 PP p.a.)
function rentenwertProjektion(startwert, jahre, lohnwachstumPA, daempfungAb2032 = 0.0) {
  return startwert * Math.pow(1 + lohnwachstumPA - daempfungAb2032, jahre);
}

// ============ KOMPLETTBEISPIEL (nachgerechnet) ============
// Jg. 1975, 40 EP, Rentenbeginn mit 65 J. (RAG 67 -> 24 Monate vorzeitig)
// const zf  = zugangsfaktor(65*12, 1975);          // 1 - 0.003*24 = 0.928
// const bru = bruttoRente(40, zf, 42.52);          // 1578.34 EUR/Monat
// const net = nettoRente(bru, 2026, false);        // 1383.42 EUR/Monat (KORRIGIERT)
// const fb  = rentenfreibetrag(bru*12, 2040);      // Besteuerungsanteil 91,0 % -> 9,0 % frei (KORRIGIERT)
// rentenluecke(2500, net) -> Luecke 1116.58 EUR/Monat, Deckungsgrad 55,3 %
