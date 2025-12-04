---

# 9.   STICHPROBENPLAN AQL - ISO 2859-1

## 9.1 Grundlagen

### 9.1.1 Was ist AQL? 

```
AQL - ACCEPTABLE QUALITY LIMIT
══════════════════════════════

DEFINITION:
AQL (Annehmbare Qualitätsgrenzlage) ist der maximale Prozentsatz 
fehlerhafter Einheiten, der bei der Stichprobenprüfung als 
akzeptabel angesehen wird. 

URSPRUNG:
• Entwickelt vom US-Militär (MIL-STD-105)
• Heute international: ISO 2859-1
• Entspricht: ANSI/ASQ Z1.4 (USA), DIN ISO 2859-1 (Deutschland)

PRINZIP:
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   GESAMTLOS                    STICHPROBE                  │
│   (N Stück)         →         (n Stück)                    │
│                                                             │
│   ████████████████            ████                         │
│   ████████████████     →      ████                         │
│   ████████████████                                         │
│   ████████████████            Prüfung                      │
│                                   │                        │
│                                   ▼                        │
│                          Fehler ≤ Ac → ANNEHMEN            │
│                          Fehler ≥ Re → ZURÜCKWEISEN        │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Ac = Annahmezahl (Accept)
Re = Rückweisezahl (Reject)
```

### 9. 1.2 Fehlerklassifizierung

| Klasse | Bezeichnung | Definition | Typischer AQL |
|--------|-------------|------------|---------------|
| **Kritisch** | Critical | Gefahr für Personen, Totalausfall | 0 (100% Prüfung) |
| **Hauptfehler** | Major | Funktionsbeeinträchtigung | 1,0 - 2,5 |
| **Nebenfehler** | Minor | Optisch, keine Funktionsbeeinträchtigung | 4,0 - 6,5 |

### 9.1.3 AQL-Werte für VG 96927

```
AQL-WERTE FÜR KABELGARNITUREN (EMPFOHLEN)
═════════════════════════════════════════

┌─────────────────────────────────────────────────────────────┐
│ FEHLERART                          │ AQL-WERT              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ KRITISCHE FEHLER:                                          │
│ • Durchschlag bei Hipot-Test       │ 0 (100% Prüfung)      │
│ • Kurzschluss                      │ 0 (100% Prüfung)      │
│ • Unterbrechung                    │ 0 (100% Prüfung)      │
│ • Falsche Pinbelegung              │ 0 (100% Prüfung)      │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ HAUPTFEHLER:                                               │
│ • Isolationswiderstand < Grenzwert │ AQL 1,0               │
│ • Crimpfehler (mechanisch i.O.)    │ AQL 1,0               │
│ • Schirmung nicht 360°             │ AQL 1,0               │
│ • Maßabweichung außer Toleranz     │ AQL 2,5               │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ NEBENFEHLER:                                               │
│ • Optische Mängel                  │ AQL 4,0               │
│ • Beschriftung unleserlich         │ AQL 4,0               │
│ • Leichte Kratzer                  │ AQL 6,5               │
│                                                             │
└─────────────────────────────────────────────────────────────┘

⚠️ WICHTIG FÜR MILITÄRPRODUKTE:
   Kritische Fehler werden IMMER 100% geprüft! 
   AQL-Stichproben nur für Haupt- und Nebenfehler!
```

---

## 9.2 Prüfniveaus

### 9.2.1 Übersicht Prüfniveaus

| Niveau | Bezeichnung | Stichprobengröße | Anwendung |
|--------|-------------|------------------|-----------|
| **S-1** | Reduziert Spezial | Sehr klein | Zerstörende Prüfung |
| **S-2** | Reduziert Spezial | Sehr klein | Zerstörende Prüfung |
| **S-3** | Reduziert Spezial | Klein | Aufwendige Prüfung |
| **S-4** | Reduziert Spezial | Klein | Aufwendige Prüfung |
| **I** | Reduziert | Kleiner | Bewährte Lieferanten |
| **II** | Normal | Standard | **Standardniveau** |
| **III** | Verschärft | Größer | Neue Lieferanten, kritisch |

### 9.2.2 Entscheidung Prüfniveau

```
ENTSCHEIDUNGSBAUM PRÜFNIVEAU
════════════════════════════

START: Welches Prüfniveau? 
    │
    ├── Zerstörende Prüfung? 
    │       │
    │       └── JA → S-1 bis S-4 (Spezialniveaus)
    │
    ├── Erstlieferung / Neuer Lieferant? 
    │       │
    │       └── JA → NIVEAU III (Verschärft)
    │
    ├── Probleme in letzten 5 Lieferungen?
    │       │
    │       └── JA → NIVEAU III (Verschärft)
    │
    ├── 10 aufeinanderfolgende Lose angenommen?
    │       │
    │       └── JA → NIVEAU I möglich (Reduziert)
    │
    └── Standardsituation?
            │
            └── JA → NIVEAU II (Normal) ← STANDARD
```

### 9.2.3 Wechselregeln zwischen Prüfniveaus

```
WECHSELREGELN (Switching Rules)
═══════════════════════════════

                    ┌─────────────┐
                    │  VERSCHÄRFT │
                    │  (Niveau III)│
                    └──────┬──────┘
                           │
    5 aufeinanderfolgende  │  2 von 5 Losen
    Lose angenommen        │  zurückgewiesen
                           │
                    ┌──────┴──────┐
                    │             │
                    ▼             │
              ┌───────────┐       │
              │  NORMAL   │◄──────┘
              │(Niveau II)│
              └─────┬─────┘
                    │
    10 aufeinander- │  1 Los zurück-
    folgende Lose   │  gewiesen
    angenommen UND  │
    Produktion      │
    stabil          │
                    │
              ┌─────┴─────┐
              │           │
              ▼           │
        ┌───────────┐     │
        │ REDUZIERT │     │
        │(Niveau I) │─────┘
        └───────────┘
              │
              │  1 Los zurückgewiesen
              │  ODER Produktion instabil
              │
              └──────► Zurück zu NORMAL
```

---

## 9.3 Stichprobentabellen

### 9. 3.1 Tabelle 1: Stichprobenumfang-Code (Kennbuchstabe)

```
TABELLE 1: KENNBUCHSTABE NACH LOSGRÖSSE UND PRÜFNIVEAU
══════════════════════════════════════════════════════

┌─────────────────┬────────────────────────────────────────────┐
│                 │              PRÜFNIVEAU                    │
│   LOSGRÖSSE     ├──────┬──────┬──────┬──────┬──────┬────────┤
│       N         │ S-1  │ S-2  │ S-3  │ S-4  │  I   │   II   │ III  │
├─────────────────┼──────┼──────┼──────┼──────┼──────┼────────┤
│     2 -    8    │  A   │  A   │  A   │  A   │  A   │   A    │  B   │
│     9 -   15    │  A   │  A   │  A   │  A   │  A   │   B    │  C   │
│    16 -   25    │  A   │  A   │  B   │  B   │  B   │   C    │  D   │
│    26 -   50    │  A   │  B   │  B   │  C   │  C   │   D    │  E   │
│    51 -   90    │  B   │  B   │  C   │  C   │  C   │   E    │  F   │
│    91 -  150    │  B   │  B   │  C   │  D   │  D   │   F    │  G   │
│   151 -  280    │  B   │  C   │  D   │  E   │  E   │   G    │  H   │
│   281 -  500    │  B   │  C   │  D   │  E   │  F   │   H    │  J   │
│   501 - 1200    │  C   │  C   │  E   │  F   │  G   │   J    │  K   │
│  1201 - 3200    │  C   │  D   │  E   │  G   │  H   │   K    │  L   │
│  3201 - 10000   │  C   │  D   │  F   │  G   │  J   │   L    │  M   │
│ 10001 - 35000   │  C   │  D   │  F   │  H   │  K   │   M    │  N   │
│ 35001 - 150000  │  D   │  E   │  G   │  J   │  L   │   N    │  P   │
│150001 - 500000  │  D   │  E   │  G   │  J   │  M   │   P    │  Q   │
│500001 und mehr  │  D   │  E   │  H   │  K   │  N   │   Q    │  R   │
└─────────────────┴──────┴──────┴──────┴──────┴──────┴────────┘

ANWENDUNG:
1. Losgröße in linker Spalte finden
2.  Prüfniveau wählen (Standard = II)
3.  Kennbuchstabe ablesen
4. Mit Kennbuchstabe in Tabelle 2 gehen
```

### 9. 3.2 Tabelle 2: Einfach-Stichprobenplan (Normal)

```
TABELLE 2-A: EINFACH-STICHPROBENPLAN - NORMALE PRÜFUNG
══════════════════════════════════════════════════════

┌──────┬───────┬─────────────────────────────────────────────────────────┐
│      │       │                     AQL-WERT                            │
│ Kenn-│Stich- ├───────┬───────┬───────┬───────┬───────┬───────┬───────┤
│ buch-│proben-│ 0,65  │ 1,0   │ 1,5   │ 2,5   │ 4,0   │ 6,5   │ 10    │
│ stabe│umfang ├───┬───┼───┬───┼───┬───┼───┬───┼───┬───┼───┬───┼───┬───┤
│      │   n   │Ac │Re │Ac │Re │Ac │Re │Ac │Re │Ac │Re │Ac │Re │Ac │Re │
├──────┼───────┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
│  A   │   2   │ ↓ │   │ ↓ │   │ ↓ │   │ ↓ │   │ ↓ │   │ 0 │ 1 │ 0 │ 1 │
│  B   │   3   │ ↓ │   │ ↓ │   │ ↓ │   │ ↓ │   │ 0 │ 1 │ 0 │ 1 │ 1 │ 2 │
│  C   │   5   │ ↓ │   │ ↓ │   │ ↓ │   │ 0 │ 1 │ 0 │ 1 │ 1 │ 2 │ 1 │ 2 │
│  D   │   8   │ ↓ │   │ ↓ │   │ 0 │ 1 │ 0 │ 1 │ 1 │ 2 │ 1 │ 2 │ 2 │ 3 │
│  E   │  13   │ ↓ │   │ 0 │ 1 │ 0 │ 1 │ 1 │ 2 │ 1 │ 2 │ 2 │ 3 │ 3 │ 4 │
│  F   │  20   │ 0 │ 1 │ 0 │ 1 │ 1 │ 2 │ 1 │ 2 │ 2 │ 3 │ 3 │ 4 │ 5 │ 6 │
│  G   │  32   │ 0 │ 1 │ 1 │ 2 │ 1 │ 2 │ 2 │ 3 │ 3 │ 4 │ 5 │ 6 │ 7 │ 8 │
│  H   │  50   │ 1 │ 2 │ 1 │ 2 │ 2 │ 3 │ 3 │ 4 │ 5 │ 6 │ 7 │ 8 │10 │11 │
│  J   │  80   │ 1 │ 2 │ 2 │ 3 │ 3 │ 4 │ 5 │ 6 │ 7 │ 8 │10 │11 │14 │15 │
│  K   │ 125   │ 2 │ 3 │ 3 │ 4 │ 5 │ 6 │ 7 │ 8 │10 │11 │14 │15 │21 │22 │
│  L   │ 200   │ 3 │ 4 │ 5 │ 6 │ 7 │ 8 │10 │11 │14 │15 │21 │22 │21 │22 │
│  M   │ 315   │ 5 │ 6 │ 7 │ 8 │10 │11 │14 │15 │21 │22 │21 │22 │21 │22 │
│  N   │ 500   │ 7 │ 8 │10 │11 │14 │15 │21 │22 │21 │22 │21 │22 │21 │22 │
│  P   │ 800   │10 │11 │14 │15 │21 │22 │21 │22 │21 │22 │21 │22 │21 │22 │
│  Q   │1250   │14 │15 │21 │22 │21 │22 │21 │22 │21 │22 │21 │22 │21 │22 │
│  R   │2000   │21 │22 │21 │22 │21 │22 │21 │22 │21 │22 │21 │22 │21 │22 │
└──────┴───────┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┘

↓ = Pfeil nach unten: Ersten Stichprobenplan unterhalb des Pfeils benutzen
    (Stichprobenumfang bleibt gleich wie angegeben)

Ac = Annahmezahl (höchstens so viele Fehler → Los annehmen)
Re = Rückweisezahl (mindestens so viele Fehler → Los zurückweisen)
```

### 9.3.3 Schnellreferenz für häufige Losgrößen

```
SCHNELLREFERENZ AQL-STICHPROBEN
═══════════════════════════════

Prüfniveau: II (Normal) - Standardanwendung

┌─────────────┬───────────────────────────────────────────────────┐
│             │                    AQL                            │
│  LOSGRÖSSE  ├─────────────────┬─────────────────┬───────────────┤
│             │ 1,0 (Hauptfehler)│ 2,5 (Standard) │ 4,0 (Nebenfeh.)│
│             ├────┬─────┬──────┼────┬─────┬──────┼────┬─────┬────┤
│             │ n  │ Ac  │ Re   │ n  │ Ac  │ Re   │ n  │ Ac  │ Re │
├─────────────┼────┼─────┼──────┼────┼─────┼──────┼────┼─────┼────┤
│    2 -    8 │  2 │  ↓  │  ↓   │  2 │  ↓  │  ↓   │  2 │  ↓  │  ↓ │
│    9 -   15 │  3 │  ↓  │  ↓   │  3 │  ↓  │  ↓   │  3 │  0  │  1 │
│   16 -   25 │  5 │  ↓  │  ↓   │  5 │  0  │  1   │  5 │  0  │  1 │
│   26 -   50 │  8 │  ↓  │  ↓   │  8 │  0  │  1   │  8 │  1  │  2 │
│   51 -   90 │ 13 │  0  │  1   │ 13 │  1  │  2   │ 13 │  1  │  2 │
│   91 -  150 │ 20 │  0  │  1   │ 20 │  1  │  2   │ 20 │  2  │  3 │
│  151 -  280 │ 32 │  1  │  2   │ 32 │  2  │  3   │ 32 │  3  │  4 │
│  281 -  500 │ 50 │  1  │  2   │ 50 │  3  │  4   │ 50 │  5  │  6 │
│  501 - 1200 │ 80 │  2  │  3   │ 80 │  5  │  6   │ 80 │  7  │  8 │
│ 1201 - 3200 │125 │  3  │  4   │125 │  7  │  8   │125 │ 10  │ 11 │
└─────────────┴────┴─────┴──────┴────┴─────┴──────┴────┴─────┴────┘

LEGENDE:
n  = Stichprobenumfang (Anzahl zu prüfende Teile)
Ac = Annahmezahl (max. Fehler für Annahme)
Re = Rückweisezahl (min.  Fehler für Rückweisung)
↓  = Nächsthöhere Zeile mit Werten verwenden
```

---

## 9. 4 Praktische Anwendung

### 9. 4.1 Schritt-für-Schritt-Anleitung

```
AQL-PRÜFUNG DURCHFÜHREN - ANLEITUNG
═══════════════════════════════════

BEISPIEL:
Los mit 200 Kabelgarnituren
Prüfniveau: II (Normal)
AQL für Hauptfehler: 1,0
AQL für Nebenfehler: 4,0

SCHRITT 1: KENNBUCHSTABE ERMITTELN
──────────────────────────────────
Losgröße: 200 (Bereich 151-280)
Prüfniveau: II
→ Tabelle 1: Kennbuchstabe = G

SCHRITT 2: STICHPROBENUMFANG ABLESEN
────────────────────────────────────
Kennbuchstabe G
→ Tabelle 2: Stichprobenumfang n = 32

SCHRITT 3: ANNAHME-/RÜCKWEISEZAHLEN ABLESEN
───────────────────────────────────────────
Kennbuchstabe G, AQL 1,0 (Hauptfehler):
→ Ac = 1, Re = 2

Kennbuchstabe G, AQL 4,0 (Nebenfehler):
→ Ac = 3, Re = 4

SCHRITT 4: STICHPROBE ZIEHEN
────────────────────────────
32 Garnituren ZUFÄLLIG aus dem Los entnehmen
(z.B. jede 6. Garnitur: 200 ÷ 32 ≈ 6)

SCHRITT 5: PRÜFEN UND BEWERTEN
──────────────────────────────

    PRÜFERGEBNIS:
    ┌─────────────────────────────────────────────────────┐
    │ Geprüft: 32 Stück                                   │
    │                                                     │
    │ HAUPTFEHLER gefunden: _____ Stück                  │
    │ Grenzwert: Ac = 1, Re = 2                          │
    │ Ergebnis: ☐ ANGENOMMEN (≤1)  ☐ ZURÜCKGEWIESEN (≥2) │
    │                                                     │
    │ NEBENFEHLER gefunden: _____ Stück                  │
    │ Grenzwert: Ac = 3, Re = 4                          │
    │ Ergebnis: ☐ ANGENOMMEN (≤3)  ☐ ZURÜCKGEWIESEN (≥4) │
    └─────────────────────────────────────────────────────┘

SCHRITT 6: ENTSCHEIDUNG
───────────────────────
☐ Beide Prüfungen ANGENOMMEN → Los freigeben
☐ Eine oder beide ZURÜCKGEWIESEN → Los sperren
```

### 9.4. 2 Beispielrechnung

```
BEISPIEL: EINGANGSPRÜFUNG KONTAKTE
══════════════════════════════════

SITUATION:
Lieferung von 500 Kontakten VG 95319-1009
Neuer Lieferant → Prüfniveau III (Verschärft)
AQL für Hauptfehler: 1,0

SCHRITT 1: KENNBUCHSTABE
Losgröße: 500 (Bereich 281-500)
Prüfniveau: III
→ Tabelle 1: Kennbuchstabe = J

SCHRITT 2: STICHPROBENUMFANG
Kennbuchstabe J
→ Tabelle 2: n = 80 Stück

SCHRITT 3: GRENZWERTE
AQL 1,0, Kennbuchstabe J
→ Ac = 2, Re = 3

SCHRITT 4: ERGEBNIS
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Geprüft: 80 Kontakte                                  │
│  Gefundene Hauptfehler: 2 Stück                        │
│                                                         │
│  Grenzwert: Ac = 2                                     │
│  Gefunden:  2                                          │
│                                                         │
│  2 ≤ 2 → ANGENOMMEN ✓                                  │
│                                                         │
│  (Wären 3 Fehler gefunden worden → ZURÜCKGEWIESEN)     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 9.4.3 Zufällige Stichprobenziehung

```
ZUFÄLLIGE STICHPROBENZIEHUNG
════════════════════════════

METHODE 1: SYSTEMATISCHE AUSWAHL
────────────────────────────────
Intervall = Losgröße ÷ Stichprobenumfang

Beispiel: 200 Stück Los, 32 Stück Stichprobe
Intervall = 200 ÷ 32 = 6,25 → jedes 6. Stück

Startpunkt zufällig wählen (z.B.  Würfel: 4)
Prüfen: 4, 10, 16, 22, 28, 34, 40, ...  usw. 


METHODE 2: ZUFALLSZAHLEN
────────────────────────
Zufallszahlentabelle oder Generator verwenden
Zahlen im Bereich 1 bis Losgröße generieren

Beispiel für 32 aus 200:
17, 42, 3, 156, 89, 201→skip, 44, 127, ... 


METHODE 3: GESCHICHTETE STICHPROBE
──────────────────────────────────
Bei mehreren Kartons/Gebinden:
Aus jedem Gebinde proportional entnehmen

Beispiel: 200 Stück in 4 Kartons à 50 Stück
Stichprobe: 32 Stück
→ Aus jedem Karton: 32 ÷ 4 = 8 Stück


⚠️ VERBOTEN:
• Nur "gute" Teile auswählen
• Nur obere Schicht prüfen
• Beschädigte Teile auslassen
• Immer dieselben Positionen prüfen
```

---

## 9. 5 Dokumentation

### 9.5.1 AQL-Prüfprotokoll

```
═══════════════════════════════════════════════════════════════
                 AQL-PRÜFPROTOKOLL
                  ISO 2859-1
═══════════════════════════════════════════════════════════════

ALLGEMEINE ANGABEN:
───────────────────────────────────────────────────────────────
Protokoll-Nr.:    ________________  Datum: ____________________
Lieferant:        ________________  Lieferschein-Nr.: _________
Artikelnummer:    ________________  Bezeichnung: ______________
Losgröße (N):     ________________  Charge: ___________________

STICHPROBENPARAMETER:
───────────────────────────────────────────────────────────────
Prüfniveau:       ☐ I (Reduziert)  ☐ II (Normal)  ☐ III (Verschärft)
Kennbuchstabe:    ________________  (aus Tabelle 1)
Stichprobenumfang (n): ____________  Stück

AQL-WERTE UND GRENZWERTE:
───────────────────────────────────────────────────────────────
┌────────────────┬─────────┬─────────┬─────────┬──────────────┐
│ Fehlerart      │  AQL    │   Ac    │   Re    │ Gefunden     │
├────────────────┼─────────┼─────────┼─────────┼──────────────┤
│ Kritisch       │   0     │   0     │   1     │              │
│ Hauptfehler    │ _______ │ _______ │ _______ │              │
│ Nebenfehler    │ _______ │ _______ │ _______ │              │
└────────────────┴─────────┴─────────┴─────────┴──────────────┘

STICHPROBENZIEHUNG:
───────────────────────────────────────────────────────────────
Methode: ☐ Systematisch (Intervall: _____)
         ☐ Zufallszahlen
         ☐ Geschichtet

PRÜFERGEBNIS:
───────────────────────────────────────────────────────────────
┌────────────────┬────────────────────────────────────────────┐
│ Fehlerart      │ Ergebnis                                   │
├────────────────┼────────────────────────────────────────────┤
│ Kritisch       │ ☐ Angenommen (0 Fehler)                    │
│                │ ☐ Zurückgewiesen (≥1 Fehler)               │
├────────────────┼────────────────────────────────────────────┤
│ Hauptfehler    │ ☐ Angenommen (Gefunden ≤ Ac)               │
│                │ ☐ Zurückgewiesen (Gefunden ≥ Re)           │
├────────────────┼────────────────────────────────────────────┤
│ Nebenfehler    │ ☐ Angenommen (Gefunden ≤ Ac)               │
│                │ ☐ Zurückgewiesen (Gefunden ≥ Re)           │
└────────────────┴────────────────────────────────────────────┘

GESAMTENTSCHEIDUNG:
───────────────────────────────────────────────────────────────
☐ LOS ANGENOMMEN - Freigabe für Produktion/Lager

☐ LOS ZURÜCKGEWIESEN - Grund:
  ☐ Kritische Fehler gefunden
  ☐ Hauptfehler > Ac
  ☐ Nebenfehler > Ac

MASSNAHMEN BEI ZURÜCKWEISUNG:
_______________________________________________________________
_______________________________________________________________

FEHLERDETAILS (falls zutreffend):
───────────────────────────────────────────────────────────────
┌─────┬────────────────────────┬──────────────────────────────┐
│ Nr. │ Fehlerart              │ Beschreibung                 │
├─────┼────────────────────────┼──────────────────────────────┤
│  1  │                        │                              │
│  2  │                        │                              │
│  3  │                        │                              │
│  4  │                        │                              │
│  5  │                        │                              │
└─────┴────────────────────────┴──────────────────────────────┘

───────────────────────────────────────────────────────────────
Prüfer:         _________________ Unterschrift: _______________
QS-Freigabe:    _________________ Unterschrift: _______________
Datum:          _________________

═══════════════════════════════════════════════════════════════
```

### 9.5. 2 Lieferantenüberwachung mit AQL

```
LIEFERANTENÜBERWACHUNG - AQL-HISTORIE
═════════════════════════════════════

Lieferant: ______________________ Artikel: _____________________

┌──────┬────────┬────────┬───────┬───────┬────────┬───────────┐
│ Lfd. │ Datum  │ Los-   │Stich- │Fehler │Ergebnis│Prüfniveau │
│ Nr.   │        │ größe  │probe  │gefund. │        │(nächstes) │
├──────┼────────┼────────┼───────┼───────┼────────┼───────────┤
│  1   │        │        │       │       │ A / Z  │ I/II/III  │
│  2   │        │        │       │       │ A / Z  │ I/II/III  │
│  3   │        │        │       │       │ A / Z  │ I/II/III  │
│  4   │        │        │       │       │ A / Z  │ I/II/III  │
│  5   │        │        │       │       │ A / Z  │ I/II/III  │
│  6   │        │        │       │       │ A / Z  │ I/II/III  │
│  7   │        │        │       │       │ A / Z  │ I/II/III  │
│  8   │        │        │       │       │ A / Z  │ I/II/III  │
│  9   │        │        │       │       │ A / Z  │ I/II/III  │
│ 10   │        │        │       │       │ A / Z  │ I/II/III  │
└──────┴────────┴────────┴───────┴───────┴────────┴───────────┘

A = Angenommen, Z = Zurückgewiesen

AUSWERTUNG:
───────────────────────────────────────────────────────────────
Angenommene Lose in Folge: _______
Zurückgewiesene Lose (letzte 10): _______

NÄCHSTES PRÜFNIVEAU: ☐ I (Reduziert)  ☐ II (Normal)  ☐ III (Verschärft)

Begründung: ___________________________________________________
```

---

## 9. 6 Sonderfälle

### 9.6.1 100%-Prüfung

```
WANN IST 100%-PRÜFUNG ERFORDERLICH?
═══════════════════════════════════

100%-PRÜFUNG OBLIGATORISCH FÜR:
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│ ☐ Kritische Fehler (Sicherheit, Funktion)                  │
│   → Durchgang, Isolation, Hipot IMMER 100%!                  │
│                                                             │
│ ☐ Kleine Losgrößen (N < 10)                                │
│   → Stichprobe nicht sinnvoll                              │
│                                                             │
│ ☐ Kundenanforderung                                        │
│   → Wenn vertraglich vereinbart                            │
│                                                             │
│ ☐ Nach Zurückweisung eines Loses                           │
│   → 100% Sortierprüfung vor erneuter Vorlage               │
│                                                             │
│ ☐ Sicherheitskritische Produkte                            │
│   → Luftfahrt, Medizin, Kernkraft                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 9. 6.2 Skip-Lot-Verfahren

```
SKIP-LOT-VERFAHREN
══════════════════

PRINZIP:
Bei nachgewiesener hoher Qualität können Lose
ohne Prüfung freigegeben werden. 

VORAUSSETZUNGEN:
☐ Mindestens 10 aufeinanderfolgende Lose angenommen
☐ Qualitätsniveau stabil
☐ Keine Prozessänderungen
☐ Genehmigung durch QS-Leitung

VERFAHREN:
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Los 1: Prüfen → Angenommen                                │
│  Los 2: Prüfen → Angenommen                                │
│  Los 3: Prüfen → Angenommen                                │
│  Los 4: SKIP (nicht prüfen)                                │
│  Los 5: SKIP (nicht prüfen)                                │
│  Los 6: Prüfen → Angenommen                                │
│  Los 7: SKIP (nicht prüfen)                                │
│  ...                                                         │
│                                                             │
│  Bei EINEM Fehler → Zurück zu normaler Prüfung!             │
│                                                             │
└─────────────────────────────────────────────────────────────┘

⚠️ FÜR VG-PRODUKTE:
   Skip-Lot nur mit ausdrücklicher Kundengenehmigung! 
   Kritische Merkmale IMMER 100% prüfen!
```

### 9. 6.3 Mehrfach-Stichprobenplan (Doppelstichprobe)

```
DOPPELSTICHPROBENPLAN
═════════════════════

PRINZIP:
Bei grenzwertigen Ergebnissen kann eine zweite
Stichprobe gezogen werden, bevor entschieden wird. 

BEISPIEL (AQL 2,5, Kennbuchstabe J):

ERSTE STICHPROBE: n₁ = 50
─────────────────────────
Ac₁ = 2, Re₁ = 5

Gefunden: 0-2 Fehler → ANNEHMEN (sofort)
Gefunden: 5+ Fehler  → ZURÜCKWEISEN (sofort)
Gefunden: 3-4 Fehler → ZWEITE STICHPROBE

ZWEITE STICHPROBE: n₂ = 50 (zusätzlich)
───────────────────────────────────────
Kombiniert: n₁ + n₂ = 100
Ac₂ = 6, Re₂ = 7

Gefunden (gesamt): 0-6 Fehler → ANNEHMEN
Gefunden (gesamt): 7+ Fehler  → ZURÜCKWEISEN


VORTEIL:
Bei guter Qualität → Weniger Prüfaufwand (nur n₁)
Bei schlechter Qualität → Sichere Entscheidung

NACHTEIL:
Komplexer, mehr Dokumentation erforderlich
```

---

## 9. 7 Schnellreferenzkarten

### 9.7.1 Taschenreferenz AQL

```
╔═══════════════════════════════════════════════════════════════╗
║              AQL-SCHNELLREFERENZ (PRÜFNIVEAU II)              ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  LOSGRÖSSE    │ n  │ AQL 1,0      │ AQL 2,5      │ AQL 4,0   ║
║  ─────────────┼────┼──────────────┼──────────────┼───────────║
║    26 -   50  │  8 │ Ac=0  Re=1   │ Ac=0  Re=1   │ Ac=1 Re=2 ║
║    51 -   90  │ 13 │ Ac=0  Re=1   │ Ac=1  Re=2   │ Ac=1 Re=2 ║
║    91 -  150  │ 20 │ Ac=0  Re=1   │ Ac=1  Re=2   │ Ac=2 Re=3 ║
║   151 -  280  │ 32 │ Ac=1  Re=2   │ Ac=2  Re=3   │ Ac=3 Re=4 ║
║   281 -  500  │ 50 │ Ac=1  Re=2   │ Ac=3  Re=4   │ Ac=5 Re=6 ║
║   501 - 1200  │ 80 │ Ac=2  Re=3   │ Ac=5  Re=6   │ Ac=7 Re=8 ║
║  1201 - 3200  │125 │ Ac=3  Re=4   │ Ac=7  Re=8   │ Ac=10Re=11║
║                                                               ║
║  n = Stichprobenumfang                                       ║
║  Ac = Annahmezahl (max.  Fehler für Annahme)                  ║
║  Re = Rückweisezahl (min.  Fehler für Zurückweisung)          ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

### 9.7.2 Entscheidungshilfe

```
╔═══════════════════════════════════════════════════════════════╗
║                   AQL-ENTSCHEIDUNGSHILFE                      ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  FRAGE 1: Wie viele Teile im Los?                             ║
║  ─────────────────────────────────                           ║
║  Antwort: ________ Stück                                     ║
║                                                               ║
║  FRAGE 2: Welches Prüfniveau?                                ║
║  ────────────────────────────                                ║
║  ☐ I (Reduziert) - bewährter Lieferant, stabile Qualität    ║
║  ☐ II (Normal) - Standardfall                                ║
║  ☐ III (Verschärft) - neuer Lieferant, Probleme bekannt     ║
║                                                               ║
║  FRAGE 3: Welcher AQL-Wert?                                  ║
║  ──────────────────────────                                  ║
║  ☐ 1,0 - Hauptfehler, funktionskritisch                     ║
║  ☐ 2,5 - Standardanwendung                                  ║
║  ☐ 4,0 - Nebenfehler, optisch                               ║
║                                                               ║
║  → Tabelle 1: Kennbuchstabe = _____                          ║
║  → Tabelle 2: n = _____, Ac = _____, Re = _____             ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

**QUELLENNACHWEIS KAPITEL 9:**
- ISO 2859-1:1999 Sampling procedures for inspection by attributes: https://pppars.com/wp-content/uploads/2021/07/ISO-2859-1-1999. pdf
- AQL Inspection Levels: https://qualityinspection.org/inspection-level/
- AQL Table Calculator: https://aqiservice.com/quality-inspection-standard/aql-table/
- AQL Sampling Guide: https://insight-quality. com/what-is-aql-and-what-do-you-need-to-know-about-it/
- ISO 2859-1 AQL Levels Explained: https://www.inspectionmanaging.com/blogs/testing-and-standards/how-do-the-aql-inspection-levels-in-iso-2859-1-affect-sampling-size
- QIMA AQL Guide: https://www. qima. com/aql-acceptable-quality-limit
- 4EasyReg ISO 2859 Methodology: https://4easyreg.com/iso-2859-aql/