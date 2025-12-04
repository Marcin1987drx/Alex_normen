---

# 5.  ABSCHIRMUNG - VG 96936

## 5. 1 Übersicht VG 96936

Die Normenreihe **VG 96936** definiert die Anforderungen an Schutzschläuche, Schutzgeflechte und Schutzkanäle für militärische Kabel und Leitungen. Der wichtigste Teil für die EMI/RFI-Abschirmung ist **VG 96936-10**. 

### 5.1. 1 Struktur der Normenreihe

| Teil | Bezeichnung | Beschreibung |
|------|-------------|--------------|
| **VG 96936-1** | Übersicht | Allgemeine Einführung und Klassifizierung |
| **VG 96936-2** | Fachgrundnorm | Allgemeine Anforderungen und Prüfverfahren |
| **VG 96936-10** | Metallische Geflechtschläuche | Abschirmgeflechte aus Metall |
| **VG 96936-20** | Kunststoff-Schutzschläuche | Mechanischer Schutz (nicht EMI) |
| **VG 96936-30** | Wellschläuche | Flexible Schutzrohre |

**Quelle:** DIN Media VG 96936-10, GlobalSpec Standards Database

### 5. 1.2 Anwendungsbereiche

| Anwendung | Anforderung | Empfohlenes Produkt |
|-----------|-------------|---------------------|
| **EMI/RFI-Schutz** | Elektromagnetische Abschirmung | VG 96936-10 Metallgeflecht |
| **Mechanischer Schutz** | Abrieb, Schnitt, Vibration | VG 96936-20 Kunststoff |
| **Hochtemperatur** | > 150°C Umgebung | VG 96936-10 mit Edelstahl |
| **Chemikalienbeständigkeit** | Öle, Kraftstoffe | VG 96936-10 verzinnt |
| **Marine/Korrosion** | Salzwasser, hohe Feuchte | VG 96936-10 vernickelt |

---

## 5. 2 Metallische Geflechtschläuche VG 96936-10

### 5.2.1 Technische Daten

| Parameter | Wert | Bemerkung |
|-----------|------|-----------|
| **Norm** | VG 96936-10:2007-10 | Aktuelle Ausgabe |
| **Material** | Kupfer verzinnt (CuSn) | Standardausführung |
| **Alternative Materialien** | Kupfer vernickelt, Edelstahl | Für Spezialanwendungen |
| **Temperaturbereich** | -65°C bis +150°C | CuSn Standard |
| **Temperaturbereich (Edelstahl)** | -65°C bis +350°C | Hochtemperatur |
| **Optische Abdeckung** | Min. 85% | Standardanforderung |
| **EMI-Dämpfung** | 60-100 dB | Frequenzabhängig |
| **Brandverhalten** | UL 94 V-2 | Selbstverlöschend |
| **RoHS/ELV** | Konform | Bleifrei |

**Quelle:** HellermannTyton HEGEMIP VG06, TE Connectivity Cable Braids

### 5. 2.2 Geflechttypen

| Typ | Optische Abdeckung | EMI-Dämpfung | Flexibilität | Anwendung |
|-----|-------------------|--------------|--------------|-----------|
| **Standard (85%)** | 85-90% | 60-70 dB | Hoch | Allgemein |
| **Dicht (95%)** | 93-97% | 80-90 dB | Mittel | EMV-kritisch |
| **Vollschirm (100%)** | 98-100% | 90-100 dB | Niedrig | Höchste Anforderungen |

### 5.2.3 Größentabelle

| Bezeichnung | Innen-Ø (mm) | Fläche (mm²) | Max.  Kabel-Ø (mm) | Gewicht (g/m) |
|-------------|--------------|--------------|-------------------|---------------|
| **VG06-02** | 2,0 | 3,1 | 1,5 | 8 |
| **VG06-03** | 3,0 | 7,1 | 2,5 | 12 |
| **VG06-04** | 4,0 | 12,6 | 3,5 | 15 |
| **VG06-05** | 5,0 | 19,6 | 4,5 | 20 |
| **VG06-06** | 6,0 | 28,3 | 5,5 | 25 |
| **VG06-08** | 8,0 | 50,3 | 7,0 | 35 |
| **VG06-10** | 10,0 | 78,5 | 9,0 | 45 |
| **VG06-12** | 12,0 | 113,1 | 11,0 | 55 |
| **VG06-15** | 15,0 | 176,7 | 14,0 | 70 |
| **VG06-20** | 20,0 | 314,2 | 19,0 | 95 |
| **VG06-25** | 25,0 | 490,9 | 24,0 | 120 |
| **VG06-30** | 30,0 | 706,9 | 29,0 | 150 |
| **VG06-40** | 40,0 | 1256,6 | 39,0 | 200 |
| **VG06-50** | 50,0 | 1963,5 | 49,0 | 260 |

**Quelle:** HellermannTyton HEGEMIP VG06 Produktdatenblatt

### 5.2. 4 Auswahlkriterien

```
GEFLECHTAUSWAHL - ENTSCHEIDUNGSBAUM
═══════════════════════════════════

START: Kabeldurchmesser bestimmen
    │
    ├── Kabel-Ø messen (mit Toleranz +10%)
    │
    ├── Geflecht-Innen-Ø = Kabel-Ø + 1 mm (Mindestspiel)
    │
    ├── EMI-Anforderung prüfen:
    │       ├── Standard (60 dB) → 85% Abdeckung
    │       ├── Erhöht (80 dB) → 95% Abdeckung
    │       └── Maximum (100 dB) → 100% Abdeckung
    │
    ├── Temperatur prüfen:
    │       ├── < 150°C → CuSn (verzinnt)
    │       ├── < 200°C → CuNi (vernickelt)
    │       └── < 350°C → Edelstahl
    │
    └── Flexibilität prüfen:
            ├── Bewegte Anwendung → Feingeflecht
            └── Stationär → Standardgeflecht

BEISPIEL:
─────────
Kabel-Ø: 8,5 mm
EMI: 80 dB erforderlich
Temperatur: 120°C

→ Geflecht: VG06-10 (10 mm Innen-Ø)
→ Typ: 95% Abdeckung
→ Material: CuSn (verzinnt)
```

---

## 5.3 Materialspezifikationen

### 5.3.1 Kupfer verzinnt (CuSn) - Standard

| Parameter | Wert | Prüfnorm |
|-----------|------|----------|
| **Grundmaterial** | Elektrolytkupfer (E-Cu) | DIN EN 13601 |
| **Reinheit** | Min. 99,9% Cu | — |
| **Überzug** | Zinn (Sn) | — |
| **Schichtdicke Sn** | 2-5 µm | — |
| **Leitfähigkeit** | 58 MS/m (100% IACS) | IEC 60028 |
| **Temperaturbereich** | -65°C bis +150°C | — |
| **Schmelzpunkt Sn** | +232°C | — |
| **Korrosionsbeständigkeit** | Gut | Salznebeltest 96h |
| **Lötbarkeit** | Sehr gut | — |

### 5.3. 2 Kupfer vernickelt (CuNi) - Erhöhte Beständigkeit

| Parameter | Wert | Prüfnorm |
|-----------|------|----------|
| **Grundmaterial** | Elektrolytkupfer (E-Cu) | DIN EN 13601 |
| **Überzug** | Nickel (Ni) | — |
| **Schichtdicke Ni** | 1-3 µm | — |
| **Temperaturbereich** | -65°C bis +200°C | — |
| **Korrosionsbeständigkeit** | Sehr gut | Salznebeltest 500h |
| **Lötbarkeit** | Mittel (Flussmittel erforderlich) | — |
| **Chemikalienbeständigkeit** | Sehr gut | — |

### 5.3.3 Edelstahl - Hochtemperatur

| Parameter | Wert | Prüfnorm |
|-----------|------|----------|
| **Material** | AISI 304 / 1.4301 | DIN EN 10088 |
| **Temperaturbereich** | -65°C bis +350°C | — |
| **Korrosionsbeständigkeit** | Ausgezeichnet | Salznebeltest 1000h |
| **Leitfähigkeit** | 1,4 MS/m (2,4% IACS) | — |
| **EMI-Dämpfung** | Reduziert (ca. 40-60 dB) | Wegen geringerer Leitfähigkeit |
| **Lötbarkeit** | Nicht lötbar | Mechanische Verbindung |
| **Anwendung** | Motorraum, Abgasbereich | — |

### 5.3. 4 Materialvergleich

```
MATERIALVERGLEICH - ÜBERSICHT
═════════════════════════════

                    CuSn        CuNi        Edelstahl
                    ────        ────        ─────────
Temperatur max.     150°C       200°C       350°C
EMI-Dämpfung        ●●●●●       ●●●●●       ●●●○○
Korrosion           ●●●○○       ●●●●○       ●●●●●
Flexibilität        ●●●●●       ●●●●○       ●●●○○
Gewicht             ●●●●○       ●●●●○       ●●●○○
Kosten              €           €€          €€€
Lötbarkeit          ●●●●●       ●●●○○       ○○○○○

●●●●● = Ausgezeichnet
●●●○○ = Gut
○○○○○ = Nicht geeignet
```

---

## 5.4 EMI/RFI-Abschirmung

### 5.4.1 Grundlagen der Schirmwirkung

```
SCHIRMWIRKUNG - PRINZIP
═══════════════════════

Elektromagnetisches Feld (Störquelle)
            │
            ▼
    ╔═══════════════════╗
    ║   ABSCHIRMUNG     ║ ← Reflexion (Haupteffekt)
    ║   (Metallgeflecht)║ ← Absorption (Zusatzeffekt)
    ╚═══════════════════╝
            │
            ▼
    Reduziertes Feld (geschützter Bereich)


SCHIRMDÄMPFUNG (SE) = 20 × log₁₀(E₀/E₁) [dB]

E₀ = Feldstärke ohne Schirm
E₁ = Feldstärke mit Schirm

BEISPIEL:
SE = 60 dB → Feldstärke auf 1/1000 reduziert
SE = 80 dB → Feldstärke auf 1/10. 000 reduziert
SE = 100 dB → Feldstärke auf 1/100. 000 reduziert
```

### 5.4.2 Schirmdämpfung nach Frequenz

| Frequenz | 85% Abdeckung | 95% Abdeckung | 100% Abdeckung |
|----------|---------------|---------------|----------------|
| 1 MHz | 65 dB | 85 dB | 95 dB |
| 10 MHz | 60 dB | 80 dB | 90 dB |
| 100 MHz | 55 dB | 75 dB | 85 dB |
| 1 GHz | 50 dB | 70 dB | 80 dB |
| 10 GHz | 40 dB | 60 dB | 70 dB |

**Quelle:** TE Connectivity EMI Shielding Technical Guide

### 5.4.3 Anforderungen nach Anwendung

| Anwendung | Min. Schirmdämpfung | Min. Abdeckung | Bemerkung |
|-----------|---------------------|----------------|-----------|
| Fahrzeugelektronik | 40 dB | 85% | Standardanforderung |
| Kommunikation | 60 dB | 90% | Erhöhte Anforderung |
| Radar/Navigation | 80 dB | 95% | Hohe Anforderung |
| EMP-Schutz | 100 dB | 100% | Höchste Anforderung |
| Medizintechnik | 60 dB | 90% | Patientensicherheit |
| Avionik | 80 dB | 95% | Sicherheitskritisch |

### 5.4. 4 Transferimpedanz

Die **Transferimpedanz (Zt)** ist ein Maß für die Qualität der Abschirmung:

```
TRANSFERIMPEDANZ - GRENZWERTE
═════════════════════════════

         Zt (mΩ/m)
            │
    100 ────┼─────────────────────── Unzureichend
            │
     50 ────┼─────────────────────── Minimum für EMV
            │
     20 ────┼─────────────────────── Standard VG 96936
            │
     10 ────┼─────────────────────── Gut
            │
      5 ────┼─────────────────────── Sehr gut
            │
      1 ────┼─────────────────────── Ausgezeichnet
            │
            └────────────────────────────────────────

GRENZWERT VG 96936-10:
Zt ≤ 20 mΩ/m @ 1 MHz (Standard)
Zt ≤ 10 mΩ/m @ 1 MHz (Erhöht)
Zt ≤ 5 mΩ/m @ 1 MHz (Maximum)
```

---

## 5. 5 Mechanische Eigenschaften

### 5.5.1 Biegeradius

| Geflecht-Ø (mm) | Min. Biegeradius statisch | Min.  Biegeradius dynamisch |
|-----------------|---------------------------|----------------------------|
| 2-5 | 3 × Ø | 6 × Ø |
| 6-10 | 4 × Ø | 8 × Ø |
| 12-20 | 5 × Ø | 10 × Ø |
| 25-50 | 6 × Ø | 12 × Ø |

**Beispiel:** VG06-10 (Ø 10 mm)
- Statisch: Min. 40 mm Radius
- Dynamisch: Min. 80 mm Radius

### 5.5.2 Zugfestigkeit

| Material | Zugfestigkeit (N) | Bemerkung |
|----------|-------------------|-----------|
| CuSn Ø 5 mm | > 200 N | Bei Raumtemperatur |
| CuSn Ø 10 mm | > 400 N | Bei Raumtemperatur |
| CuSn Ø 20 mm | > 800 N | Bei Raumtemperatur |
| Edelstahl Ø 10 mm | > 600 N | Höhere Festigkeit |

### 5.5.3 Biegewechselfestigkeit

| Parameter | Wert | Prüfbedingungen |
|-----------|------|-----------------|
| Biegewinkel | ±90° | Um min.  Biegeradius |
| Frequenz | 30 Zyklen/min | — |
| Min. Zyklen | 10. 000 | Ohne Bruch |
| Prüftemperatur | +23°C ±5°C | Raumtemperatur |

---

## 5. 6 Montage und Terminierung

### 5.6.1 Montageverfahren Übersicht

| Verfahren | Beschreibung | Vorteil | Nachteil |
|-----------|--------------|---------|----------|
| **Spannband** | Geflecht unter Metallband | Schnell, demontierbar | Mittlere EMI-Dämpfung |
| **Schrumpfschlauch** | Mit leitfähigem Schlauch | Gute Abdichtung | Nicht demontierbar |
| **Crimpring** | Metallring verpresst | Hohe EMI-Dämpfung | Spezialwerkzeug |
| **Löten** | Geflecht verlötet | Beste Verbindung | Wärmeempfindlich |
| **Backshell** | Im Steckverbinder-Backshell | Professionell | Höhere Kosten |

### 5. 6.2 Spannband-Montage

```
SPANNBAND-MONTAGE - VERFAHREN
═════════════════════════════

MATERIAL:
☐ Geflecht VG 96936-10
☐ Spannband (Edelstahl oder verzinnt)
☐ Spannbandwerkzeug

SCHRITT 1: VORBEREITUNG
───────────────────────
1. Geflecht auf Kabel aufschieben
2.   Länge bestimmen (Kabel + 30 mm Überlänge je Seite)
3. Geflecht abschneiden (mit Seitenschneider)
4.   Enden mit Klebeband sichern (gegen Aufdröseln)

SCHRITT 2: POSITIONIERUNG
─────────────────────────
1.  Geflecht gleichmäßig über Kabel ziehen
2.  Enden auf Backshell/Stecker positionieren
3.  Geflecht straff ziehen (ohne Dehnung!)

SCHRITT 3: TERMINIERUNG
───────────────────────
           ┌──────────────────────────┐
           │        Spannband         │
           │   ══════════════════     │
           │   ╔════════════════╗     │
           │   ║   Geflecht     ║     │
           │   ║   (360° um     ║     │
           │   ║   Backshell)   ║     │
           │   ╚════════════════╝     │
           └──────────────────────────┘

1. Geflecht 360° um Backshell-Körper legen
2.  Spannband anlegen
3. Mit Werkzeug festziehen
4.   Überschuss abschneiden

SCHRITT 4: KONTROLLE
────────────────────
☐ 360° Kontakt (keine Lücken)
☐ Spannband fest (kein Spiel)
☐ Geflecht nicht beschädigt
☐ Widerstand Geflecht-Backshell < 2,5 mΩ
```

### 5. 6.3 Schrumpfschlauch-Montage

```
SCHRUMPFSCHLAUCH-MONTAGE - VERFAHREN
════════════════════════════════════

MATERIAL:
☐ Geflecht VG 96936-10
☐ Schrumpfschlauch VG 95343 (mit Kleber)
☐ Heißluftpistole (200-300°C)

SCHRITT 1: VORBEREITUNG
───────────────────────
1.  Schrumpfschlauch ablängen (Überlappung 15-20 mm)
2. Schrumpfschlauch auf Kabel schieben (vor Geflecht!)
3.   Geflecht montieren

SCHRITT 2: GEFLECHT AUFWEITEN
─────────────────────────────
1. Geflechtende ca. 20 mm aufweiten
2.   Über Backshell stülpen
3.  Geflecht andrücken (360° Kontakt)

SCHRITT 3: SCHRUMPFEN
─────────────────────
       VOR SCHRUMPFEN:              NACH SCHRUMPFEN:
       
    ┌─────────────────┐          ┌─────────────────┐
    │ Schrumpfschlauch│          │████████████████│
    │     (lose)      │    →     │████████████████│
    │  ┌───────────┐  │          │  ┌───────────┐ │
    │  │ Geflecht  │  │          │  │ Geflecht  │ │
    │  └───────────┘  │          │  └───────────┘ │
    └─────────────────┘          └─────────────────┘

1. Heißluftpistole auf 200-250°C einstellen
2.   Von Mitte nach außen erwärmen
3.  Gleichmäßig rotieren
4.  Bis Schlauch eng anliegt und Kleber austritt

SCHRITT 4: KONTROLLE
────────────────────
☐ Schrumpfschlauch vollständig geschrumpft
☐ Keine Luftblasen
☐ Kleber sichtbar an Enden
☐ Keine Beschädigung des Geflechts
```

### 5.6.4 Crimpring-Montage

```
CRIMPRING-MONTAGE - VERFAHREN
═════════════════════════════

MATERIAL:
☐ Geflecht VG 96936-10
☐ Crimpring (passend zur Größe)
☐ Crimpzange (kalibriert)

SCHRITT 1: RING AUFSCHIEBEN
───────────────────────────
1. Crimpring auf Geflecht schieben
2.  Geflecht über Backshell stülpen
3. Ring in Position bringen

SCHRITT 2: CRIMPEN
──────────────────

       VOR CRIMP:                 NACH CRIMP:

    ┌─────────────┐            ┌─────────────┐
    │   Ring      │            │   Ring      │
    │   ○    ○    │      →     │   ◘────◘    │
    │   Geflecht  │            │   Geflecht  │
    └─────────────┘            └─────────────┘

1. Crimpzange ansetzen
2.  Gleichmäßig vercrimpen
3.   Ring muss fest sitzen

SCHRITT 3: KONTROLLE
────────────────────
☐ Ring sitzt fest (Zugprüfung > 50 N)
☐ Geflecht nicht durchtrennt
☐ 360° Kontakt
☐ Widerstand < 2,5 mΩ
```

### 5.6.5 Terminierung an Backshell

```
BACKSHELL-TERMINIERUNG - ÜBERSICHT
══════════════════════════════════

TYP A: Spannring-Backshell
──────────────────────────
           ┌─────────────────────────────┐
           │         BACKSHELL           │
           │  ┌─────────────────────┐    │
           │  │     Spannring       │    │
           │  │   ═══════════════   │    │
           │  │ ╔═════════════════╗ │    │
           │  │ ║   Geflecht      ║ │    │
           │  │ ║   (eingeklemmt) ║ │    │
           │  │ ╚═════════════════╝ │    │
           │  └─────────────────────┘    │
           └─────────────────────────────┘

TYP B: Schrumpf-Backshell
─────────────────────────
           ┌─────────────────────────────┐
           │         BACKSHELL           │
           │  ┌─────────────────────┐    │
           │  │   Schrumpfbereich   │    │
           │  │ ████████████████████│    │
           │  │ ╔═════════════════╗ │    │
           │  │ ║   Geflecht      ║ │    │
           │  │ ║   (überschrumpft)║ │    │
           │  │ ╚═════════════════╝ │    │
           │  └─────────────────────┘    │
           └─────────────────────────────┘

TYP C: Schraub-Backshell
────────────────────────
           ┌─────────────────────────────┐
           │         BACKSHELL           │
           │  ┌─────────────────────┐    │
           │  │   Überwurfmutter    │    │
           │  │ ↺↺↺↺↺↺↺↺↺↺↺↺↺↺↺↺↺↺  │    │
           │  │ ╔═════════════════╗ │    │
           │  │ ║   Geflecht      ║ │    │
           │  │ ║   (eingeklemmt) ║ │    │
           │  │ ╚═════════════════╝ │    │
           │  └─────────────────────┘    │
           └─────────────────────────────┘
```

---

## 5. 7 Prüfung und Qualitätskontrolle

### 5.7.1 Eingangsprüfung Geflechtmaterial

```
EINGANGSPRÜFUNG GEFLECHT VG 96936-10
════════════════════════════════════

☐ DOKUMENTATION
  └── Lieferschein mit Chargennummer
  └── Materialzertifikat (CuSn, CuNi, etc.)
  └── Konformitätserklärung VG 96936-10
  └── RoHS-Erklärung

☐ VISUELLE PRÜFUNG
  └── Verpackung unbeschädigt
  └── Geflecht gleichmäßig (keine Löcher)
  └── Keine Oxidation/Verfärbung
  └── Keine mechanischen Beschädigungen
  └── Innenschlauch vorhanden (falls spezifiziert)

☐ MASSLICHE PRÜFUNG
  └── Innendurchmesser messen (3 Stellen)
  └── Toleranz: ±0,5 mm
  └── Geflechtdichte visuell prüfen

☐ FUNKTIONSPRÜFUNG (Stichprobe)
  └── Flexibilität prüfen (Biegen ohne Knicken)
  └── Aufweitbarkeit prüfen
  └── Lötbarkeit prüfen (nur CuSn)
```

### 5. 7.2 Prüfung montiertes Geflecht

| Prüfung | Methode | Grenzwert | Häufigkeit |
|---------|---------|-----------|------------|
| **Optische Abdeckung** | Mikroskop/Lupe | ≥ 85% (oder Spezifikation) | Stichprobe |
| **Übergangswiderstand** | 4-Leiter-Messung | < 2,5 mΩ | 100% |
| **360°-Kontakt** | Visuelle Prüfung | Keine Lücken | 100% |
| **Zugfestigkeit** | Zugprüfung | > 50 N | Stichprobe |
| **Schirmdämpfung** | Netzwerkanalysator | Nach Spezifikation | Typenprüfung |

### 5.7.3 Messung Übergangswiderstand

```
MESSUNG ÜBERGANGSWIDERSTAND
═══════════════════════════

MESSAUFBAU:
                    Milliohmmeter
                    ┌─────────────┐
                    │   Display   │
                    │   2,1 mΩ    │
                    └──────┬──────┘
                           │
              ┌────────────┴────────────┐
              │                         │
         Messspitze 1              Messspitze 2
              │                         │
              ▼                         ▼
    ┌─────────────────────────────────────────┐
    │              BACKSHELL                  │
    │  ╔═══════════════════════════════════╗  │
    │  ║            GEFLECHT               ║  │
    │  ╚═══════════════════════════════════╝  │
    └─────────────────────────────────────────┘

MESSMETHODE:
1. 4-Leiter-Messung (Kelvin-Methode)
2.   Messstrom: 100 mA DC
3.  Messspitze 1: Auf Geflecht (ca. 50 mm vom Backshell)
4.  Messspitze 2: Auf Backshell-Körper
5.  Min. 3 Messungen an verschiedenen Positionen
6.  Mittelwert bilden

GRENZWERT:
☐ R ≤ 2,5 mΩ → BESTANDEN
☐ R > 2,5 mΩ → NICHT BESTANDEN → Nacharbeiten
```

### 5.7. 4 Fehleranalyse

| Fehler | Mögliche Ursache | Abhilfe |
|--------|------------------|---------|
| Hoher Übergangswiderstand | Oxidation, schlechter Kontakt | Reinigen, neu terminieren |
| Geflecht aufgedröselt | Falsche Schneidtechnik | Mit Klebeband sichern vor Schnitt |
| Geflecht zu kurz | Falsche Längenmessung | Überlänge einplanen (+30 mm) |
| Kein 360°-Kontakt | Ungleichmäßige Aufweitung | Gleichmäßig aufweiten |
| Spannband locker | Falsches Werkzeug | Korrekte Spannkraft einstellen |
| Schrumpfschlauch nicht dicht | Zu wenig Wärme | Länger/heißer schrumpfen |

---

## 5. 8 Lagerung und Handhabung

### 5.8.1 Lagerungsbedingungen

| Parameter | Wert | Bemerkung |
|-----------|------|-----------|
| Temperatur | +15°C bis +25°C | Raumtemperatur |
| Luftfeuchtigkeit | 40-60% RH | Keine Kondensation |
| Lichteinwirkung | Vermeiden | UV kann Material altern |
| Max. Lagerdauer | 5 Jahre (CuSn) | Bei korrekter Lagerung |
| Max. Lagerdauer | 10 Jahre (Edelstahl) | Bei korrekter Lagerung |

### 5. 8.2 Handhabungshinweise

```
HANDHABUNG GEFLECHTMATERIAL
═══════════════════════════

✓ RICHTIG:
  └── Mit sauberen Handschuhen anfassen
  └── Innenschlauch bis zur Montage belassen
  └── Auf Spulen lagern (nicht knicken)
  └── Enden mit Klebeband sichern

✗ FALSCH:
  └── Mit bloßen Händen anfassen (Schweiß → Korrosion)
  └── Knicken oder quetschen
  └── Auf dem Boden ablegen
  └── Offen lagern (Staub/Feuchtigkeit)
```

---

**QUELLENNACHWEIS KAPITEL 5:**
- VG 96936-10 DIN Media: https://www.dinmedia.de/en/standard/vg-96936-10/101666294
- VG 96936-10 GlobalSpec: https://standards.globalspec.com/std/14258855/vg-96936-10
- VG 96936-10 AFNOR: https://www.boutique.afnor.org/en-gb/standard/vg-9693610/protective-conduits-protective-sleeves-protective-channels-part-10-metallic/eu048044/288771
- HellermannTyton HEGEMIP VG06: https://www.hellermanntyton.com/products/open-woven-sleeves/hegemip-vg06/173-00202
- TE Connectivity Cable Braids: https://www. te.com/en/plp/cable-braids/Y314yVw9ywz. html
- Normadoc VG 96936-10:2007-10: https://www. normadoc.com/english/vg-96936-10-2007-10. html