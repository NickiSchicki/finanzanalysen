/* Gemeinsame Sitemap: Reihenfolge = roter Faden der Studie, identisch mit den
   Kapiteln der Startseite: erst die eigene Lage, dann Marktrisiko, dann Geld
   und Inflation, dann Bewertung, dann Strategien, dann die Synthese.
   tags steuern die automatischen Querverweise ("Weiterlesen").
   intern:true nimmt eine Seite aus dem Vor/Zurück-Lesefluss (bleibt im Menü).
   Eine Datei pflegen — alle Seiten erben Navigation und Verweise. */
window.SITEMAP = [
  // — Dein Geld: die eigene Lage, deutsch und persönlich —
  { f:"Mein_Vermoegensbild.html", s:"Dein Geld", t:"Mein Vermögensbild",
    b:"Einmal eintragen, überall verwenden: Rente, Vermögen, Einordnung und Lücke auf einen Blick.",
    tags:["werkzeug","bestand","rente","deutschland","verteilung","entnahme","sparen"] },
  { f:"Rentenluecke_Rechner.html", s:"Dein Geld", t:"Gesetzliche Rente und die Lücke",
    b:"Entgeltpunkte, Zahlbetrag nach KV und Pflege, Abschläge — und wie viel privat noch fehlt.",
    tags:["werkzeug","rente","deutschland","steuer","bestand"] },
  { f:"Vermoegen_Einordnung.html", s:"Dein Geld", t:"Wo dieses Vermögen in Deutschland steht",
    b:"Das eigene Nettovermögen im Perzentil der Verteilung — gesamt und in der eigenen Altersgruppe.",
    tags:["werkzeug","bestand","deutschland","verteilung"] },
  { f:"Altersvorsorge_Rechner.html", s:"Dein Geld", t:"Altersvorsorge-Rechner",
    b:"Betrag und Annahmen per Regler — reale Monatsrente und ewige Rente, live.",
    tags:["werkzeug","rente","entnahme"] },
  { f:"Depot_Steuern_Kosten.html", s:"Dein Geld", t:"Was Steuern und Kosten vom Depot nehmen",
    b:"Abgeltungsteuer, Teilfreistellung, Vorabpauschale und die Wirkung der laufenden Kosten.",
    tags:["werkzeug","steuer","kosten","sparen","deutschland"] },

  // — Immobilien: die größte Einzelanlage —
  { f:"Immobilien_Investitionsrechner.html", s:"Immobilien", t:"Die vermietete Wohnung, durchgerechnet",
    b:"Kaufnebenkosten, AfA, Finanzierung, Cashflow — und der Steuervorteil je nach Einkommen.",
    tags:["werkzeug","immobilien","sachwerte","deutschland","steuer"] },
  { f:"Tilgen_oder_Investieren.html", s:"Immobilien", t:"Tilgen oder investieren",
    b:"Sondertilgung gegen Anlage gerechnet — inklusive der Steuer, die nur eine Seite trifft.",
    tags:["werkzeug","immobilien","steuer","kosten","deutschland"] },

  // — Durch die Geschichte: derselbe Plan gegen jede echte Renditefolge —
  { f:"Sparplan_Perzentile.html", s:"Durch die Geschichte", t:"Sparplan-Simulator",
    b:"Monatlich sparen über historische 10-Jahres-Blöcke — die reale Ergebnisspanne.",
    tags:["werkzeug","sparen","verteilung","sequenz"] },
  { f:"Lebenszyklus_Simulator.html", s:"Durch die Geschichte", t:"Ein ganzes Finanzleben, durchgerechnet",
    b:"Ansparen und Entnehmen gekoppelt, durch echte Renditesequenzen — USA oder Deutschland.",
    tags:["werkzeug","rente","entnahme","sparen","deutschland","sequenz"] },
  { f:"Geschichts_Stresstest.html", s:"Durch die Geschichte", t:"Der Geschichts-Stresstest",
    b:"Hätte der Entnahmeplan in jedem Startjahr seit 1871 gehalten?",
    tags:["werkzeug","entnahme","sequenz","risiko"] },

  // — Risiko: warum die Sequenzen scheitern können —
  { f:"SP500_Taleb_Analyse.html", s:"Risiko", t:"Die Diktatur der seltenen Tage",
    b:"Fat Tails: Black Monday als 20,7-Sigma-Ereignis; wenige Tage tragen die Rendite.",
    tags:["risiko","fattails","statistik"] },
  { f:"SP500_Drawdown_Pfadrisiko.html", s:"Risiko", t:"Drawdown und Pfadrisiko",
    b:"92 % der Zeit unter Wasser; jedes Jahrzehnt erlitt mindestens −19 %.",
    tags:["risiko","drawdown","sequenz"] },
  { f:"SP500_10Jahres_Renditeverteilung.html", s:"Risiko", t:"Wie sicher sind zehn Jahre Aktienmarkt?",
    b:"Nominal und real — ein reales Verlust-Jahrzehnt ist gar nicht selten.",
    tags:["risiko","verteilung","prognose","inflation"] },
  { f:"SP500_Statistik_Appendix.html", s:"Risiko", t:"Wie belastbar sind die Schätzungen?",
    b:"Hill-Tail-Index, nur wenige unabhängige Dekaden, breite Konfidenzintervalle.",
    tags:["risiko","fattails","statistik"] },

  // — Geld & Inflation: warum nominale Zahlen täuschen —
  { f:"Deutschland_Geld_Inflation_Sachwerte.html", s:"Geld & Inflation", t:"Deutschland: Geld, Inflation, Sachwerte",
    b:"Inflationsgeschichte, Cantillon in Euro, Löhne, DAX inklusive Dividenden.",
    tags:["geld","inflation","sachwerte","deutschland"] },
  { f:"USA_Geld_Inflation_Sachwerte.html", s:"Geld & Inflation", t:"USA: Geld, Inflation, Sachwerte",
    b:"Das US-Pendant: Reallohn-Stillstand und real flache Immobilien.",
    tags:["geld","inflation","sachwerte","usa","immobilien"] },
  { f:"Inflation_Cantillon_Vermoegenspreise.html", s:"Geld & Inflation", t:"Ist die echte Inflation unterschätzt?",
    b:"Warum sich besonders Vermögenspreise so hochinflationiert anfühlen.",
    tags:["geld","inflation","cantillon","sachwerte","usa"] },
  { f:"USA_Ungleichheit_Velocity_Cantillon.html", s:"Geld & Inflation", t:"Ungleichheit, Geldumlauf, Cantillon",
    b:"Konzentration hoch, Umlaufgeschwindigkeit runter, Verbraucherpreise zahm.",
    tags:["geld","cantillon","inflation","usa"] },
  { f:"SP500_vs_Geldmenge_M2.html", s:"Geld & Inflation", t:"Hängt der Markt an der Geldmenge?",
    b:"S&P 500 gegen M2 — wie viel erklärt die Geldmengen-Entwicklung wirklich?",
    tags:["geld","liquiditaet","usa"] },
  { f:"SP500_vs_NettoLiquiditaet.html", s:"Geld & Inflation", t:"Netto-Liquidität — und ihr Bruch",
    b:"Fed-Bilanz minus TGA minus RRP: das schärfere Liquiditätsmaß.",
    tags:["geld","liquiditaet","usa"] },

  // — Gold: erst die populäre 2000er-Linse, dann die Antwort darauf —
  { f:"Alles_in_Gold_gerechnet.html", s:"Gold", t:"Alles in Gold gerechnet",
    b:"Verschiedene Anlageklassen und Löhne in Gold statt in Währung gerechnet.",
    tags:["gold","sachwerte","usa"] },
  { f:"Alles_in_Gold_seit_1971.html", s:"Gold", t:"Alles in Gold, seit 1971",
    b:"Der ganze Fiat-Zeitraum: keine Einbahnstraße, sondern ein Pendel.",
    tags:["gold","sachwerte","inflation"] },
  { f:"Deutschland_alles_in_Gold.html", s:"Gold", t:"Deutschland in Gold",
    b:"Aktien, Häuser und Löhne der Bundesrepublik in Gold gemessen.",
    tags:["gold","sachwerte","deutschland","immobilien"] },

  // — Bewertung: was der Preis über die nächste Dekade sagt —
  { f:"USA_Ueberblick_Geld_Aktien_Gewinne_Bewertung.html", s:"Bewertung", t:"Geld, Preise, Aktien, Gewinne, Bewertung",
    b:"Der Master-Chart: wie teuer ist der Markt im langen Bild?",
    tags:["bewertung","cape","geld","ueberblick","gold"] },
  { f:"USA_CAPE_vs_10Jahresrendite.html", s:"Bewertung", t:"CAPE und die nächsten zehn Jahre",
    b:"145 Jahre zeigen: hohe Bewertung bedeutet magere reale Dekade.",
    tags:["bewertung","cape","prognose"] },
  { f:"USA_KGV_vs_10Jahresrendite.html", s:"Bewertung", t:"Das nackte KGV misst schlechter",
    b:"Warum das einfache Kurs-Gewinn-Verhältnis in die Irre führt.",
    tags:["bewertung","kgv","prognose"] },
  { f:"Regionen_CAPE_10Jahres_Ausblick.html", s:"Bewertung", t:"Wo die besseren Karten liegen",
    b:"USA teuer, der Rest der Welt fair bis günstig — Regionen im Vergleich.",
    tags:["bewertung","cape","prognose"] },

  // — Strategien: und was, wenn man es besser machen will? —
  { f:"SP500_Anomalien_aktuell.html", s:"Strategien", t:"Was statistisch neu ist",
    b:"Die Autokorrelation kippte: Momentum wurde zu Mean-Reversion.",
    tags:["strategie","momentum","statistik","risiko"] },
  { f:"SP500_Momentum_MeanReversion.html", s:"Strategien", t:"Vom Momentum zur Mean-Reversion",
    b:"Zwei unabhängige Maße kippen gemeinsam — und wann genau es geschah.",
    tags:["strategie","momentum","statistik"] },
  { f:"Regimewechsel_Anlageklassen.html", s:"Strategien", t:"Marktweit oder S&P-spezifisch?",
    b:"US-Aktien am stärksten, Gold erst spät — kein universelles Gesetz.",
    tags:["strategie","momentum","gold"] },
  { f:"SP500_MeanReversion_Strategie.html", s:"Strategien", t:"Lässt sich Mean-Reversion zu Geld machen?",
    b:"Scheitert: regimeabhängig, von Kosten gefressen, zuletzt verschwunden.",
    tags:["strategie","momentum","kosten"] },
  { f:"SP500_Call_im_Dip.html", s:"Strategien", t:"Call im Dip, am Hoch verkaufen",
    b:"Konvexität monetarisiert die V-Form — aber Theta tötet im Schleichbär.",
    tags:["strategie","optionen","drawdown"] },
  { f:"SP500_Call_Strategie_verbessern.html", s:"Strategien", t:"Was die Strategie wirklich verbessert",
    b:"Put-Credit-Spread und Co. — am Ende schlägt Index-im-Dip alle.",
    tags:["strategie","optionen","drawdown"] },

  // — Synthese: erst der Rückblick auf die Alt-Studie, dann das Gesamturteil —
  { f:"00_Studie_Uebersicht.html", s:"Synthese", t:"Die Studie im Überblick",
    b:"Die ursprüngliche elfteilige S&P-500-Studie mit allen Kernbotschaften.",
    tags:["ueberblick","risiko","bewertung","statistik","strategie"] },
  { f:"Standortbestimmung_Maerkte_2026.html", s:"Synthese", t:"Standortbestimmung 2026",
    b:"Das Gesamturteil: eine Scorecard über alle Dimensionen.",
    tags:["ueberblick","bewertung","prognose","geld"] },

  // — Intern: nicht Teil des Lesefadens —
  { f:"Selbsttest.html", s:"Selbsttest", t:"Selbsttest der Rechenkerne",
    b:"Prüft die Rechenbibliotheken gegen bekannte Sollwerte und alle Seiten auf Erreichbarkeit.",
    tags:["qualitaet"], intern:true }
];
