// ============================================================
// RECHNER 2 – KAPITALERTRAGSBESTEUERUNG & VORABPAUSCHALE
// Stand 25.07.2026. Alle Verifikationskorrekturen eingearbeitet.
// ============================================================
const KAP = {
  abgeltungsteuer: 0.25,
  soli: 0.055,
  kiSt: { keine: 0, bw_by: 0.08, uebrige: 0.09 },
  sparerPauschbetrag: { ledig: 1000, zusammen: 2000 },     // 2025 und 2026 unveraendert
  teilfreistellung: { aktienfonds: 0.30, mischfonds: 0.15,
                      immobilienInland: 0.60, immobilienAusland: 0.80,
                      einzelaktien: 0, zinsen: 0 },
  basiszins: { 2018:0.0087, 2019:0.0052, 2020:0.0007, 2021:-0.0045, 2022:-0.0005,
               2023:0.0255, 2024:0.0229, 2025:0.0253, 2026:0.0320 }   // 2027: noch nicht veroeffentlicht
};

// --- Effektiver Gesamtsatz (nur gueltig fuer q = 0) ---
function gesamtsatz(kiStSatz = 0) {
  return kiStSatz > 0 ? (1 / (4 + kiStSatz)) * (1 + KAP.soli + kiStSatz)
                      : KAP.abgeltungsteuer * (1 + KAP.soli);
}
// gesamtsatz(0) = 0.26375 | gesamtsatz(0.08) = 0.2781863 | gesamtsatz(0.09) = 0.2799511

// --- (1) KAPITALERTRAGSTEUER inkl. Soli und KiSt ---
// KORRIGIERTE Gesetzesformel: § 32d Abs. 1 SATZ 4 EStG -> KapESt = (e - 4q) / (4 + k)
// (Die haeufig zitierte Fassung e/(4+k) - q ist FALSCH, sobald q > 0.)
function kapESt(gewinn, kiStSatz = 0, teilfreistellung = 0, freibetragRest = 1000,
                auslQuellensteuer = 0) {
  const brutto = Math.max(0, gewinn);
  const nachTF = brutto * (1 - teilfreistellung);              // § 20 InvStG
  const genutzterFreibetrag = Math.min(Math.max(0, freibetragRest), nachTF);
  const e = Math.max(0, nachTF - genutzterFreibetrag);         // Bemessungsgrundlage
  const q = Math.max(0, auslQuellensteuer);
  const k = kiStSatz;

  // § 32d Abs. 1 Satz 1 u. 2 EStG (ohne KiSt) bzw. Satz 4 EStG (mit KiSt)
  const kapest = k > 0 ? Math.max(0, (e - 4 * q) / (4 + k))
                       : Math.max(0, KAP.abgeltungsteuer * e - q);
  const soli = kapest * KAP.soli;
  const kirchensteuer = kapest * k;
  const gesamt = kapest + soli + kirchensteuer;

  return {
    bruttoertrag: brutto,
    teilfreistellungsbetrag: brutto * teilfreistellung,
    ertragNachTeilfreistellung: nachTF,
    genutzterFreibetrag,
    freibetragRestNeu: Math.max(0, freibetragRest - genutzterFreibetrag),
    bemessungsgrundlage: e,
    kapitalertragsteuer: kapest,
    solidaritaetszuschlag: soli,
    kirchensteuer,
    steuerGesamt: gesamt,
    nettoertrag: brutto - gesamt,
    effektivsatz: brutto > 0 ? gesamt / brutto : 0
  };
}

// --- (2) VORABPAUSCHALE – § 18 InvStG ---
// wertAnfang = ERSTER im Kalenderjahr festgesetzter Ruecknahmepreis (bzw. Depotwert)
// wertEnde   = LETZTER im Kalenderjahr festgesetzter Ruecknahmepreis
// WICHTIG: erster/letzter Preis, NICHT hoechster/niedrigster (§ 18 Abs. 1 Satz 3 InvStG)
function vorabpauschale(wertAnfang, wertEnde, ausschuettung = 0, basiszins = 0,
                        teilfreistellung = 0, erwerbsmonat = 1) {
  const zins = Math.max(0, basiszins);                        // negativer Basiszins -> 0
  const basisertragRoh = Math.max(0, wertAnfang) * zins * 0.70;   // Satz 2
  const mehrbetrag = Math.max(0, (wertEnde - wertAnfang) + ausschuettung); // Satz 3
  const basisertrag = Math.min(basisertragRoh, mehrbetrag);
  let vap = Math.max(0, basisertrag - ausschuettung);          // Satz 1

  // Zwoelftelung im Erwerbsjahr (§ 18 Abs. 2 InvStG)
  const volleMonateVorErwerb = Math.min(11, Math.max(0, Math.round(erwerbsmonat) - 1));
  const zwoelftelFaktor = (12 - volleMonateVorErwerb) / 12;
  vap = vap * zwoelftelFaktor;

  return {
    basisertragRoh,
    deckelungsbetrag: mehrbetrag,
    basisertragGedeckelt: basisertrag,
    zwoelftelFaktor,
    vorabpauschale: vap,
    steuerpflichtigerBetrag: vap * (1 - teilfreistellung),
    zuflussHinweis: 'gilt am ersten Werktag des Folgejahres als zugeflossen (§ 18 Abs. 3 InvStG)'
  };
}

// --- (3) Steuer auf die Vorabpauschale ---
function steuerAufVorabpauschale(vapObj, kiStSatz = 0, teilfreistellung = 0, freibetragRest = 1000) {
  return kapESt(vapObj.vorabpauschale, kiStSatz, teilfreistellung, freibetragRest, 0);
}

// --- (4) Veraeusserungsgewinn nach Anrechnung – § 19 Abs. 1 SATZ 3 InvStG (KORRIGIERT) ---
function veraeusserungsgewinn(verkaufserloes, anschaffungskosten, summeAngesetzterVAP = 0) {
  return Math.max(0, verkaufserloes - anschaffungskosten - summeAngesetzterVAP);
}

// --- (5) Ausgabeaufschlag bezogen auf das investierte Kapital ---
function ausgabeaufschlagEffektiv(aaNominal) { return aaNominal / (1 - aaNominal); }

// --- (6) Nachsteuer-Rendite eines thesaurierenden Aktien-ETF (Mehrjahressimulation) ---
function etfSimulation({ start, jahre, renditePA, ter, teilfreistellung = 0.30,
                         kiStSatz = 0, sparerPauschbetragPA = 1000, basiszinsPA = 0.032 }) {
  let wert = start, summeVAP = 0, summeSteuerVAP = 0;
  const historie = [];
  for (let j = 1; j <= jahre; j++) {
    const wertAnfang = wert;
    wert = wert * (1 + renditePA - ter);
    const v = vorabpauschale(wertAnfang, wert, 0, basiszinsPA, teilfreistellung, 1);
    const st = kapESt(v.vorabpauschale, kiStSatz, teilfreistellung, sparerPauschbetragPA, 0);
    summeVAP += v.vorabpauschale;
    summeSteuerVAP += st.steuerGesamt;
    wert -= st.steuerGesamt;                 // Liquiditaetsabfluss zu Beginn des Folgejahres
    historie.push({ jahr: j, wertAnfang, wertEnde: wert,
                    vorabpauschale: v.vorabpauschale, steuer: st.steuerGesamt });
  }
  const gewinn = veraeusserungsgewinn(wert, start, summeVAP);
  const stVerkauf = kapESt(gewinn, kiStSatz, teilfreistellung, sparerPauschbetragPA, 0);
  const endwertNachSteuer = wert - stVerkauf.steuerGesamt;
  return {
    historie, endwertVorVerkaufssteuer: wert, summeVAP, summeSteuerVAP,
    steuerBeimVerkauf: stVerkauf.steuerGesamt, endwertNachSteuer,
    renditePANachSteuer: Math.pow(endwertNachSteuer / start, 1 / jahre) - 1
  };
}
