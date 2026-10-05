# Immobilien-Rechner

Desktop-Programm (Windows und Mac), das eine Eigentumswohnung als Kapitalanlage oder für die Eigennutzung durchrechnet. Gebaut auf Basis des Lernpfads "Immobilien kaufen", Kontext Hamburg.

**Was es rechnet:** Kaufpreisfaktor, Brutto- und Nettomietrendite, Ertragswert, Hebel (Objektrendite gegen Zins), Finanzierung und Anschlussrate, Cashflow vor und nach Steuern mit normaler AfA und mit Restnutzungsdauer-Gutachten, Steuer im ersten Jahr, 15-%-Grenze, Gebäudeanteil aus dem Bodenrichtwert, IRR über die Haltedauer gegen einen ETF, Stresstest, Maximalpreis für eine Ziel-Rendite, Jahrestabelle und Kaufen gegen Mieten.

Lernwerkzeug, keine Steuer- oder Anlageberatung.

## Programm herunterladen

Bei jeder Änderung auf `main` baut GitHub das Programm automatisch neu: unter **Actions → Programm bauen → letzter Lauf → Artifacts**.

Für eine feste Version einen Tag setzen (z. B. `v1.0.0`). Dann erscheint das Programm unter **Releases**:
- **Windows:** `Immobilien-Rechner Setup x.y.z.exe` (Installer) oder `Immobilien-Rechner x.y.z.exe` (ohne Installation). Das Programm ist nicht signiert, Windows warnt beim ersten Start: "Weitere Informationen" → "Trotzdem ausführen".
- **Mac:** `Immobilien-Rechner-x.y.z-universal.dmg`. Beim ersten Start per Rechtsklick → "Öffnen".

## Aufbau

| Datei | Inhalt |
|---|---|
| `src/rechenkern.js` | Alle Formeln (Simulation Jahr für Jahr, IRR, Maximalpreis, Eigennutzung) |
| `src/oberflaeche.js` | Eingabefelder, Ergebnisse, Diagramm, Beispiel-Objekte |
| `src/index.html` | Fenster-Inhalt und Gestaltung |
| `main.js` | Startet das Programmfenster (Electron) |
| `test/` | Prüft den Rechenkern gegen Lektion 6 und Übung 5 |

## Selbst starten

```
npm install
npm start      # Programm starten
npm test       # Rechenkern prüfen
npm run dist   # Installer für das eigene Betriebssystem bauen
```
