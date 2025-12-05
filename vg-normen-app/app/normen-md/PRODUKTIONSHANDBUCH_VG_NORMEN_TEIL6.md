# PRODUKTIONSHANDBUCH VG NORMEN
## TEIL 6: VG 95343 – SCHRUMPFSCHLÄUCHE UND FORMTEILE

---

**Version:** 1.0  
**Datum:** Dezember 2025  
**Geltende Norm:** VG 95343 T05  
**Geltungsbereich:** Schrumpfschläuche für Verteidigungsanwendungen

---

## 6.1 NORMÜBERSICHT

### 6.1.1 Aufbau der Normenreihe VG 95343

| Teil | Bezeichnung | Beschreibung |
|------|-------------|--------------|
| **VG 95343 T05** | Schrumpfschläuche | Standard-Schrumpfschläuche verschiedener Typen |
| **VG 95343 T06** | Molded Boots | Geformte Endkappen (System 100) |
| **VG 95343 T07** | Molded Parts | Sonstige Formteile |
| **VG 95343 T29** | Heat Shrink Molded | Schrumpfbare Formteile (halogenfrei) |
| **VG 95343 T30** | Zerohal Übergang | Übergangsformteile |

### 6.1.2 Anwendungsbereiche

- **Isolierung von Crimp- und Lötstellen**
- **Knickschutz an Steckverbindern**
- **Abdichtung gegen Feuchtigkeit**
- **Mechanischer Schutz**
- **Kennzeichnung und Farbcodierung**

---

## 6.2 TYPENÜBERSICHT VG 95343 T05

### 6.2.1 Sieben Haupttypen (VERIFIZIERT)

```
VG 95343 TYPENÜBERSICHT (VERIFIZIERT)
═════════════════════════════════════

Quellen: idetrading.com, HellermannTyton, Raytronics, MIL-KABEL-SYSTEMS

┌───────┬────────────────────┬────────────┬─────────────────────┬───────────────────┐
│ Typ   │ Material           │ Schrumpf-  │ Betriebstemperatur  │ Schrumpftemp.     │
│       │                    │ verhältnis │                     │                   │
├───────┼────────────────────┼────────────┼─────────────────────┼───────────────────┤
│ A     │ Polyolefin FR      │ 2:1        │ -55°C bis +135°C    │ Min: 95°C         │
│       │ (dünnwandig)       │            │                     │ Voll: 120°C       │
├───────┼────────────────────┼────────────┼─────────────────────┼───────────────────┤
│ B     │ Polyolefin         │ 2:1        │ -55°C bis +135°C    │ Min: 95°C         │
│       │ (transparent)      │            │                     │ Voll: 120°C       │
├───────┼────────────────────┼────────────┼─────────────────────┼───────────────────┤
│ C     │ Elastomer          │ 2:1        │ -55°C bis +200°C    │ Min: 150°C        │
│       │ (Viton/Fluoro)     │            │                     │ Voll: 175°C       │
├───────┼────────────────────┼────────────┼─────────────────────┼───────────────────┤
│ D     │ Polyolefin FR      │ 2:1        │ -75°C bis +150°C    │ Min: 150°C        │
│       │ (Kraftstoff-       │            │                     │ Voll: 175°C       │
│       │ beständig)         │            │                     │                   │
├───────┼────────────────────┼────────────┼─────────────────────┼───────────────────┤
│ E     │ PVDF (Kynar)       │ 2:1        │ -55°C bis +175°C    │ Voll: 175°C       │
├───────┼────────────────────┼────────────┼─────────────────────┼───────────────────┤
│ G     │ PTFE (Teflon)      │ 2:1        │ -55°C bis +260°C    │ Voll: 340-380°C   │
├───────┼────────────────────┼────────────┼─────────────────────┼───────────────────┤
│ H     │ Polyolefin         │ 3:1        │ -55°C bis +135°C    │ Kleber: 80°C      │
│       │ mit Schmelzkleber  │            │                     │ Schlauch: 120°C   │
└───────┴────────────────────┴────────────┴─────────────────────┴───────────────────┘

ANMERKUNG:
• Min = Minimale Schrumpftemperatur (Beginn der Schrumpfung)
• Voll = Vollständige Rückstellung (Full Recovery)
```

**✓ VERIFIZIERT** mit:
- idetrading.com Type A: https://idetrading.com/defense-military-mobility/vg95343-t05-type-a-heat-shrink-tubing/
- Raytronics VG95343T05D: https://raytronics.ch/phocadownloadpap/VG_and_MIL/
- HellermannTyton SE28: https://www.hellermanntyton.com/products/heat-shrink-tubing/
- MIL-KABEL-SYSTEMS: https://www.milkabelsystems.com/en/schrumpfschlaeuche/vg95343-schrumpfschlaeuche/

### 6.2.2 Entscheidungsmatrix Typauswahl

```
TYPAUSWAHL – ENTSCHEIDUNGSBAUM
══════════════════════════════

START: Welche Anforderungen?
    │
    ├── Standard-Isolierung (bis +135°C)?
    │       │
    │       └── JA → TYP A (günstigster)
    │
    ├── Sichtkontrolle erforderlich?
    │       │
    │       └── JA → TYP B (transparent)
    │
    ├── Hochtemperatur > 135°C?
    │       │
    │       ├── Bis +175°C → TYP E (PVDF)
    │       ├── Bis +200°C → TYP C (Viton)
    │       └── Bis +260°C → TYP G (PTFE)
    │
    ├── Kraftstoff-/Ölbeständigkeit?
    │       │
    │       └── JA → TYP D (kraftstoffbeständig)
    │
    └── Wasserdichte Abdichtung erforderlich?
            │
            └── JA → TYP H (mit Schmelzkleber)
```

---

## 6.3 TYP A – STANDARD POLYOLEFIN (DETAILSPEZIFIKATION)

### 6.3.1 Technische Daten

| Parameter | Wert |
|-----------|------|
| **Normbezeichnung** | VG 95343 T05 Type A |
| **Material** | Strahlenvernetztes Polyolefin |
| **Schrumpfverhältnis** | 2:1 |
| **Betriebstemperatur** | -55°C bis +135°C |
| **Minimale Schrumpftemperatur** | +95°C |
| **Vollständige Rückstellung** | +120°C |
| **Längsschrumpfung** | max. 5% |
| **Brandverhalten** | Selbstverlöschend (UL 94 V-0) |
| **Wandstärke (geschrumpft)** | 0,4-0,6 mm (größenabhängig) |
| **Dielektrische Festigkeit** | ≥ 15 kV/mm |

### 6.3.2 Dimensionstabelle TYP A

| Lieferdurchmesser (mm) | Rückstelldurchmesser (mm) | Wandstärke (mm) | Farben |
|-----------------------|--------------------------|-----------------|--------|
| 1,2 | 0,6 | 0,4 | Alle |
| 1,6 | 0,8 | 0,4 | Alle |
| 2,4 | 1,2 | 0,4 | Alle |
| 3,2 | 1,6 | 0,5 | Alle |
| 4,8 | 2,4 | 0,5 | Alle |
| 6,4 | 3,2 | 0,6 | Alle |
| 9,5 | 4,8 | 0,6 | Alle |
| 12,7 | 6,4 | 0,7 | Alle |
| 19,1 | 9,5 | 0,8 | Alle |
| 25,4 | 12,7 | 0,9 | Alle |
| 38,1 | 19,0 | 1,0 | Alle |
| 50,8 | 25,4 | 1,2 | Alle |

### 6.3.3 Verfügbare Farben

- **Schwarz** (Standard)
- **Braun**
- **Rot**
- **Orange**
- **Gelb**
- **Grün**
- **Blau**
- **Violett**
- **Grau**
- **Weiß**

---

## 6.4 TYP C – ELASTOMER HOCHTEMPERATUR (DETAILSPEZIFIKATION)

### 6.4.1 Technische Daten

| Parameter | Wert |
|-----------|------|
| **Normbezeichnung** | VG 95343 T05 Type C |
| **Material** | Viton/Fluorelastomer |
| **Schrumpfverhältnis** | 2:1 |
| **Betriebstemperatur** | -55°C bis +200°C |
| **Minimale Schrumpftemperatur** | +150°C |
| **Vollständige Rückstellung** | +175°C |
| **Chemikalienbeständigkeit** | Ausgezeichnet |
| **Kraftstoffbeständigkeit** | Ja |
| **Brandverhalten** | Selbstverlöschend |

### 6.4.2 Anwendungsgebiete TYP C

- Motorraum und Triebwerksnähe
- Treibstoffleitungen
- Hydraulikanschlüsse
- Chemisch aggressive Umgebungen
- Aerospace-Anwendungen

---

## 6.5 TYP D – KRAFTSTOFFBESTÄNDIG (DETAILSPEZIFIKATION)

### 6.5.1 Technische Daten

| Parameter | Wert |
|-----------|------|
| **Normbezeichnung** | VG 95343 T05 Type D |
| **Material** | Polyolefin FR (speziell) |
| **Schrumpfverhältnis** | 2:1 |
| **Betriebstemperatur** | -75°C bis +150°C |
| **Minimale Schrumpftemperatur** | +150°C |
| **Vollständige Rückstellung** | +175°C |
| **Kraftstoffbeständigkeit** | JP-4, JP-5, JP-8, NATO F-34 |
| **Hydrauliköl-Beständigkeit** | MIL-H-5606, MIL-H-83282 |
| **MIL-SPEC Äquivalent** | MIL-DTL-23053/16 |

---

## 6.6 TYP G – PTFE EXTREM-HOCHTEMPERATUR (DETAILSPEZIFIKATION)

### 6.6.1 Technische Daten

| Parameter | Wert |
|-----------|------|
| **Normbezeichnung** | VG 95343 T05 Type G |
| **Material** | PTFE (Teflon) |
| **Schrumpfverhältnis** | 2:1 |
| **Betriebstemperatur** | -55°C bis +260°C |
| **Schrumpftemperatur** | +340°C bis +380°C |
| **Chemikalienbeständigkeit** | Universell |
| **Ölbeständigkeit** | Ausgezeichnet |
| **Brandverhalten** | Nicht brennbar |
| **MIL-SPEC Äquivalent** | MIL-DTL-23053/12 |

### 6.6.2 Wichtige Hinweise TYP G

```
⚠️ WARNUNG – TYP G (PTFE)
═══════════════════════════

SCHRUMPFTEMPERATUR: +340°C bis +380°C!

☐ NUR mit Heißluftgebläse (nicht mit Flamme!)
☐ Abzugsanlage erforderlich (PTFE-Dämpfe!)
☐ Schutzhandschuhe verwenden
☐ Nicht überhitzen (max. 400°C)
☐ Ausreichend Belüftung sicherstellen
```

---

## 6.7 TYP H – MIT SCHMELZKLEBER (DETAILSPEZIFIKATION)

### 6.7.1 Technische Daten

| Parameter | Wert |
|-----------|------|
| **Normbezeichnung** | VG 95343 T05 Type H |
| **Material** | Polyolefin mit Innenkleber |
| **Schrumpfverhältnis** | 3:1 |
| **Betriebstemperatur** | -55°C bis +135°C |
| **Kleber-Fließtemperatur** | +80°C |
| **Schlauch-Schrumpftemperatur** | +120°C |
| **Kleberschichtdicke** | 0,2-0,5 mm |
| **Dichtheit** | IP67 (nach Schrumpfung) |
| **MIL-SPEC Äquivalent** | MIL-DTL-23053/4 |

### 6.7.2 Verarbeitungshinweise TYP H

```
VERARBEITUNG TYP H (MIT KLEBER)
═══════════════════════════════

KRITISCH: Kleber muss an beiden Enden austreten!

ABLAUF:
1. Schlauch auf korrekte Länge schneiden
   (Überlappung: min. 15 mm pro Seite)
   
2. Position mittig über Verbindungsstelle

3. Schrumpfen VON DER MITTE AUS nach außen
   (verhindert Lufteinschlüsse)
   
4. Bei 80°C: Kleber beginnt zu fließen
   
5. Bei 120°C: Schlauch ist vollständig geschrumpft
   
6. KONTROLLE: Kleberaustritt an beiden Enden sichtbar?
   ☐ JA → OK
   ☐ NEIN → DEFEKT (Undichtigkeit möglich)
```

---

## 6.8 SCHRUMPFTEMPERATUREN – ZUSAMMENFASSUNG

### 6.8.1 Temperaturübersicht alle Typen

| Typ | Min. Schrumpftemp. | Vollständige Rückstellung | Empfohlene Arbeitstemperatur |
|-----|-------------------|--------------------------|------------------------------|
| **A** | 95°C | 120°C | 120-150°C |
| **B** | 95°C | 120°C | 120-150°C |
| **C** | 150°C | 175°C | 175-200°C |
| **D** | 150°C | 175°C | 175-200°C |
| **E** | 150°C | 175°C | 175-200°C |
| **G** | 340°C | 380°C | 350-400°C |
| **H** | 80°C (Kleber) | 120°C | 120-150°C |

### 6.8.2 Grafische Darstellung

```
SCHRUMPFTEMPERATUREN – ÜBERSICHT
════════════════════════════════

TYP A/B:  ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
          95°C    120°C                           

TYP C/D/E: ░░░░░░░░░░░░░░████████░░░░░░░░░░░░░░░░░
                     150°C    175°C               

TYP G:     ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████████
                                          340°C  380°C

TYP H:     ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░
           80°C      120°C
           (Kleber)  (Schlauch)
           
°C:  0    50   100   150   200   250   300   350   400
```

---

## 6.9 VERARBEITUNGSVERFAHREN

### 6.9.1 Allgemeines Verfahren

```
SCHRUMPFVERFAHREN – SCHRITT FÜR SCHRITT
═══════════════════════════════════════

VORBEREITUNG:
☐ Oberfläche reinigen (Isopropanol)
☐ Korrekte Schlauchlänge berechnen
   - Überlappung: min. 1,5× Durchmesser pro Seite
   - Längsschrumpfung: +5% einplanen
☐ Schlauch gerade abschneiden (90°)

POSITIONIERUNG:
☐ Schlauch mittig positionieren
☐ Schlauch darf nicht verdreht sein
☐ Schlauch darf nicht gedehnt sein

SCHRUMPFEN:
☐ Heißluftgebläse oder Schrumpfofen
☐ Temperatur gem. Typ einstellen
☐ Gleichmäßig von der Mitte nach außen
☐ Schlauch kontinuierlich drehen
☐ Nicht überhitzen (max. +50°C über Voll-Temp.)

KONTROLLE:
☐ Vollständig geschrumpft? (keine Falten)
☐ Anliegend am Substrat? (keine Hohlräume)
☐ Keine Blasen oder Verbrennungen?
☐ Bei Typ H: Kleberaustritt sichtbar?
```

### 6.9.2 Werkzeuge für die Verarbeitung

| Werkzeug | Temperaturbereich | Anwendung |
|----------|-------------------|-----------|
| **Heißluftgebläse (einfach)** | bis 350°C | Typ A, B, H |
| **Heißluftgebläse (Profi)** | bis 600°C | Alle Typen |
| **Schrumpfofen** | bis 250°C | Serienproduktion A-E, H |
| **Infrarot-Strahler** | bis 400°C | Großflächig |
| **Gasflamme** | — | NICHT EMPFOHLEN |

---

## 6.10 PRÜFUNGEN UND QUALITÄTSKONTROLLE

### 6.10.1 Wareneingangsprüfung

| Prüfpunkt | Anforderung | Prüfmittel |
|-----------|-------------|------------|
| **Durchmesser** | ±5% vom Nennwert | Schieblehre |
| **Wandstärke** | ±10% vom Nennwert | Mikrometer |
| **Farbe** | Übereinstimmung | Sichtkontrolle |
| **Beschriftung** | Lesbar, korrekt | Sichtkontrolle |
| **Schrumpftest** | Vollständig bei Nenn-Temp. | Heißluft |

### 6.10.2 Fertigungsprüfung

```
FERTIGUNGSPRÜFUNG SCHRUMPFSCHLÄUCHE
═══════════════════════════════════

SICHTPRÜFUNG (100%):
☐ Vollständig geschrumpft (keine Falten)
☐ Anliegend (keine Hohlräume sichtbar)
☐ Keine Blasen
☐ Keine Verbrennungen/Verfärbungen
☐ Überlappung ausreichend
☐ Bei Typ H: Kleberaustritt vorhanden

MECHANISCHE PRÜFUNG (Stichprobe):
☐ Schlauch haftet am Substrat
☐ Nicht abziehbar ohne Beschädigung
☐ Keine Risse beim Biegen

ELEKTRISCHE PRÜFUNG (falls erforderlich):
☐ Spannungsfestigkeitstest (Hipot)
☐ Isolationswiderstand
```

---

## 6.11 MIL-SPEC ÄQUIVALENTE

### 6.11.1 Kreuzreferenz VG – MIL

| VG 95343 Typ | MIL-DTL-23053 | Beschreibung |
|--------------|---------------|--------------|
| **Type A** | /5 | Polyolefin, thin-wall |
| **Type B** | /5 Class 3 | Transparent |
| **Type C** | /8 | Elastomer (Viton) |
| **Type D** | /16 | Fuel resistant |
| **Type E** | — | PVDF (Kynar) |
| **Type G** | /12 | PTFE |
| **Type H** | /4 | Adhesive lined |

---

## 6.12 LAGERUNG

### 6.12.1 Lagerbedingungen

| Parameter | Wert |
|-----------|------|
| **Temperatur** | +5°C bis +25°C |
| **Luftfeuchtigkeit** | 30-70% RH |
| **Lichtschutz** | Vor UV und direktem Sonnenlicht schützen |
| **Lagerdauer (versiegelt)** | 5 Jahre ab Herstellung |
| **Lagerdauer (geöffnet)** | 12 Monate |

### 6.12.2 Hinweise

```
⚠️ LAGERUNGSHINWEISE
════════════════════

☐ Original-Verpackung verwenden
☐ Nicht knicken oder quetschen
☐ Von Chemikalien und Lösungsmitteln fernhalten
☐ Von Wärmequellen fernhalten
☐ Charge/Losnummer dokumentieren
☐ FIFO-Prinzip anwenden (First In, First Out)
```

---

## 6.13 SCHNELLREFERENZ – HÄUFIGSTE ANWENDUNGEN

### 6.13.1 Typauswahl nach Anwendung

| Anwendung | Empfohlener Typ | Begründung |
|-----------|-----------------|------------|
| **Standard-Crimpstelle** | Typ A | Günstig, ausreichend |
| **Sichtkontrolle erforderlich** | Typ B | Transparent |
| **Motornähe** | Typ C oder D | Temperatur + Öl |
| **Treibstoffleitung** | Typ D | Kraftstoffbeständig |
| **Triebwerknähe** | Typ G | Extreme Temperatur |
| **Feuchtigkeitsschutz** | Typ H | Schmelzkleber dichtet |
| **Chemische Umgebung** | Typ E oder G | Chemikalienbeständig |

### 6.13.2 MIL-SPEC Äquivalente (VERIFIZIERT)

| VG 95343 | MIL-DTL-23053 | Beschreibung |
|----------|---------------|--------------|
| Type A | /5 | Thin-wall polyolefin |
| Type B | /5 Class 3 | Transparent |
| Type C | /8 | Elastomer (Viton) |
| Type D | /16 | Fuel resistant |
| Type G | /12 | PTFE |
| Type H | /4 | Adhesive lined |

**✓ VERIFIZIERT** mit Raytronics Datasheet

### 6.13.3 Schnellübersicht Temperaturen

```
WELCHEN TYP BEI WELCHER TEMPERATUR?
═══════════════════════════════════

≤ +135°C  →  TYP A, B, H (Standard)
≤ +150°C  →  TYP D (+ kraftstoffbeständig)
≤ +175°C  →  TYP E (PVDF)
≤ +200°C  →  TYP C (Viton)
≤ +260°C  →  TYP G (PTFE)
```

---

## 6.14 ZUGEHÖRIGE HERSTELLER

### 6.14.1 Zugelassene Lieferanten

| Hersteller | Produktbereich | Zertifizierung |
|------------|----------------|----------------|
| **TE Connectivity / Raychem** | Vollsortiment | BAAINBw |
| **HellermannTyton** | Vollsortiment | BAAINBw |
| **DSG-Canusa** | Schrumpfschläuche | ISO 9001 |
| **Panduit** | Industriequalität | UL |
| **BIT Bierther** | VG-Produkte | BAAINBw |

---

**ENDE TEIL 6 – VG 95343 SCHRUMPFSCHLÄUCHE**

*Weiter mit TEIL 7: IPC/WHMA-A-620 – Produktionsverfahren*
