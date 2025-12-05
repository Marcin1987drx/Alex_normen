# VG-Normen Wissenssystem

**Offline-Desktop-Anwendung für Qualitätsexperten in der Kabelkonfektion**

Eine speziell für ältere Benutzer entwickelte Wissensdatenbank zu VG-Normen (Verteidigungsgeräte-Normen) für die Kabelbaum- und Steckverbinderproduktion.

## 🎯 Zielgruppe

- Qualitätsexperten in der Kabelkonfektion
- Fertigungsmitarbeiter in der Verteidigungsindustrie
- Prüfer für militärische Kabel- und Steckverbindersysteme

## ✨ Features

### Wissensbasis
- **VG 96927**: Kabelgarnituren, Temperatursysteme
- **VG 95319**: Steckverbinder (MIL-DTL-38999 äquivalent)
- **VG 95218**: Crimpverbindungen
- **VG 95343**: Prüfverfahren
- **IPC/WHMA-A-620**: Internationale Verarbeitungsrichtlinien

### Benutzerfreundlichkeit
- 🔍 **Schnellsuche** mit Synonymen und Fuzzy-Matching
- 🎤 **Sprachsuche** (wie Siri auf iPhone)
- ⭐ **Favoriten** für schnellen Zugriff
- 📖 **Historie** der angesehenen Themen
- 📁 **Eigene Dokumente** importieren und durchsuchen
- 🖨️ **Druckfunktion** für alle Inhalte

### Barrierefreiheit (für 66+ Jahre)
- Große Schrift (18px Standard, bis 24px wählbar)
- Hoher Kontrast Option
- Große Klickflächen (44px Mindestgröße)
- Klare, intuitive Navigation
- Vollständig offline nutzbar

### Desktop-App
- Windows EXE (Setup + Portable)
- Automatischer Build via GitHub Actions
- Lokale Datenspeicherung (keine Cloud)

## 🚀 Installation

### Für Endbenutzer
1. Laden Sie die neueste Version von [Releases](../../releases) herunter
2. `VG-Normen-Wissenssystem-Setup-x.x.x.exe` ausführen
3. Installation folgen
4. Fertig! Das Programm startet automatisch

### Für Entwickler
```bash
# Repository klonen
git clone <repo-url>
cd vg-normen-app

# Dependencies installieren
npm install

# Entwicklungsserver starten
npm start

# Windows EXE bauen
npm run build:win
```

## 📁 Projektstruktur

```
vg-normen-app/
├── app/
│   ├── index.html          # Haupt-UI
│   ├── style.css           # Design-System
│   ├── js/
│   │   ├── app.js          # Hauptanwendungslogik
│   │   ├── config.js       # Konfiguration
│   │   ├── storage.js      # LocalStorage
│   │   ├── search-engine.js # Suchlogik
│   │   ├── ui.js           # UI-Funktionen
│   │   ├── utils.js        # Hilfsfunktionen
│   │   ├── document-analyzer.js  # Dokumentenanalyse
│   │   ├── pdf-extractor.js      # PDF-Textextraktion
│   │   └── docx-extractor.js     # Word-Textextraktion
│   ├── wissensbasis/
│   │   └── karten.json     # Wissenskarten
│   ├── formulare/          # Druckbare Formulare
│   └── bilder/             # Icons und Bilder
├── main.js                 # Electron Main Process
├── preload.js              # Electron Preload
├── package.json            # Projekt-Konfiguration
└── .github/workflows/
    └── build.yml           # GitHub Actions
```

## 🔧 Entwicklung

### Voraussetzungen
- Node.js 18+ (empfohlen: 20 LTS)
- npm 9+

### Befehle
| Befehl | Beschreibung |
|--------|--------------|
| `npm start` | Startet die Electron-App im Dev-Modus |
| `npm run build:win` | Erstellt Windows EXE |
| `npm run build:linux` | Erstellt Linux AppImage |
| `npm run build:mac` | Erstellt macOS DMG |

### Wissensbasis erweitern
Die Wissenskarten befinden sich in `app/wissensbasis/karten.json`. Jede Karte hat:

```json
{
  "id": "unique-id",
  "category": "crimp|schrumpf|stecker|kabel|loeten|pruefung|normen|formular",
  "type": "overview|detail",
  "title": "Angezeigter Titel",
  "icon": "📄",
  "norm": "VG 95218",
  "description": "Kurzbeschreibung",
  "keywords": ["suchwort1", "suchwort2"],
  "content": "<h2>HTML-Inhalt</h2>",
  "related": ["andere-id"]
}
```

## 📋 Formulare

Verfügbare Formulare in `app/formulare/`:
- **F01**: Crimphöhen-Messprotokoll
- **F02**: Zugtest-Protokoll
- **F03**: Elektrische Prüfung
- **F04**: Sichtprüfungs-Checkliste
- *(weitere in Entwicklung)*

## 🔒 Datenschutz

- **Keine Cloud-Verbindung** - alle Daten bleiben lokal
- **Keine Telemetrie** - keine Nutzungsdaten werden gesendet
- **Backup-Funktion** - Daten können als JSON exportiert werden
- **Portable Version** verfügbar (keine Installation nötig)

## 📝 Lizenz

Dieses Projekt ist für interne Schulungszwecke entwickelt.

## 👤 Autor

Entwickelt für Qualitätsexperten in der Kabelkonfektion, basierend auf 40 Jahren Branchenerfahrung.

---

**Version**: 1.0.0  
**Stand**: 2024
# Build trigger

