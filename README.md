# Finanzanalysen

Sechsunddreißig eigenständige Analysen und Rechner zu Altersvorsorge, Marktrisiko,
Geldmenge und Bewertung — auf Deutsch, gerechnet auf rund 150 Jahren Marktdaten.

**Alles läuft im Browser.** Kein Server, keine Konten, kein Tracking. Eingaben liegen
ausschließlich im `localStorage` des jeweiligen Browsers und werden nirgendwohin übertragen.

## Aufbau

Jede Analyse ist eine einzelne, für sich lauffähige HTML-Datei ohne Build-Schritt.
Die historischen Reihen stecken als JavaScript-Arrays direkt in den Seiten; Diagramme
sind handgeschriebenes Inline-SVG.

| Verzeichnis | Inhalt |
|---|---|
| `00_Start.html` | Einstieg — die Befunde selbst, nicht nur ein Verzeichnis |
| `assets/site.css`, `site.js`, `site-map.js` | gemeinsames Design-System und Navigation |
| `assets/de-rente.js`, `de-kapitalertrag.js`, `de-vermoegen.js` | geprüfte Rechenkerne zum deutschen Recht |
| `assets/profil.js`, `datenstand.js` | seitenübergreifendes Profil, Register der Datenstände |
| `Selbsttest.html` | prüft Rechenkerne, Erreichbarkeit aller Seiten und Datenstände |

Eine neue Seite braucht genau einen Eintrag in `assets/site-map.js` — Navigation,
Querverweise und Vor/Zurück entstehen daraus automatisch.

## Selbsttest

`Selbsttest.html` rechnet die Bibliotheken gegen bekannte Sollwerte nach (Eckrente,
Abgeltungsteuer, Vorabpauschale, Perzentile), prüft jede Seite der Sitemap auf
Erreichbarkeit und Einbindung und markiert abgelaufene Datenstände. Nach jeder
Änderung aufrufen — was dort rot wird, ist eine Regression.

## Datenquellen

Robert Shiller (US-Aktien, CAPE, Inflation) · FRED (Geldmengen, Fed-Bilanz, Löhne) ·
Yahoo Finance · Research Affiliates (Regionen-CAPE) · Jordà-Schularick-Taylor
Macrohistory Database R6 (deutsche Anlageklassen 1871–2020) · Bundesbank PHF Welle 5
(Vermögensverteilung, Erhebung 2023) · Rechengrößen 2026 nach SGB VI, EStG und InvStG.

## Hinweis

Keine Anlage-, Steuer- oder Rechtsberatung und keine Prognose. Historische Verteilungen
sagen, was war — nicht, was kommt.
