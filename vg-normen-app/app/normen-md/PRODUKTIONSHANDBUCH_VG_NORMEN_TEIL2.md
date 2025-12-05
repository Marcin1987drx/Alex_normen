# PRODUKTIONSHANDBUCH VG NORMEN
## TEIL 2: VG 95218 – DRÄHTE UND LEITUNGEN

---

**Version:** 1.0  
**Datum:** Dezember 2025  
**Geltende Norm:** VG 95218-20:2024-12  
**Geltungsbereich:** Einadrige isolierte Leitungen für Verteidigungsanwendungen

---

## 2.1 NORMÜBERSICHT

### 2.1.1 Aufbau der Normenreihe VG 95218

| Teil | Bezeichnung | Beschreibung |
|------|-------------|--------------|
| **VG 95218-2** | Fachgrundnorm | Allgemeine Anforderungen für alle Kabel und Leitungen |
| **VG 95218-20** | Einadrige Leitungen | Detailstandard für Type A, E, G, H |
| **VG 95218-21** | Einadrige Leitungen (Spezial) | Zusätzliche Typen |
| **VG 95218-22** | Mehradrige Leitungen | Mehrere Adern in einem Mantel |
| **VG 95218-23** | Symmetrische Paare | Verdrillte Paare |
| **VG 95218-24** | Koaxialleitungen | HF-Anwendungen |
| **VG 95218-28** | Datenleitungen | Digitale Übertragung |

### 2.1.2 Anwendungsbereiche

- **Bundeswehr** (Siły Zbrojne Niemiec)
- **NATO-Streitkräfte**
- **Marine- und U-Boot-Systeme**
- **Luft- und Raumfahrt**
- **Fahrzeugtechnik**
- **Extreme Umgebungsbedingungen**

---

## 2.2 TYPENÜBERSICHT

### 2.2.1 Vier Haupttypen

| Typ | Bezeichnung | Temperaturbereich | Beschichtung | Hauptanwendung |
|-----|-------------|-------------------|--------------|----------------|
| **A** | Standard Universal | -40°C bis +105°C | Zinn (Sn) | Fahrzeuge, Steuerungen |
| **E** | Leichtbau (Lightweight) | -55°C bis +125°C | Zinn (Sn) | Luftfahrt, Drohnen |
| **G** | Hochtemperatur | -40°C bis +150°C | Silber (Ag) | Motoren, HF-Anwendungen |
| **H** | Extrem-Hochtemperatur | -40°C bis +180°C | Silber (Ag) 2µm | Aerospace, Triebwerke |

### 2.2.2 Entscheidungsmatrix Typauswahl

```
TYPAUSWAHL – ENTSCHEIDUNGSBAUM
══════════════════════════════

START: Maximale Betriebstemperatur?
    │
    ├── < 105°C → TYP A (Standard, günstigster)
    │
    ├── 105°C - 125°C → TYP E (Leichtbau)
    │       │
    │       └── + Gewichtskritisch? → TYP E ✓
    │
    ├── 125°C - 150°C → TYP G (Silberbeschichtet)
    │       │
    │       └── + HF-Anwendung? → TYP G ✓
    │
    └── > 150°C → TYP H (Extrem)
            │
            └── + Aerospace? → TYP H ✓
```

### 2.2.3 Vergleichstabelle

| Parameter | TYP A | TYP E | TYP G | TYP H |
|-----------|-------|-------|-------|-------|
| **Max. Dauertemperatur** | +105°C | +125°C | +150°C | +180°C |
| **Min. Temperatur** | -40°C | -55°C | -40°C | -40°C |
| **Kurzzeit-Maximum** | +250°C | +250°C | +250°C | +250°C |
| **Leiterbeschichtung** | Zinn (Sn) | Zinn (Sn) | Silber (Ag) 1µm | Silber (Ag) 2µm |
| **Isolationsmaterial** | EPR/EPDM | EPR/EPDM | Fluoropolymer | Fluoropolymer |
| **Wandstärke** | Standard | Dünn (-30%) | Standard | Dick (+10%) |
| **Gewicht** | 100% | 70% | 90% | 95% |
| **Relativer Preis** | €€ | €€€ | €€€€ | €€€€€ |
| **Flexibilität** | Mittel | Hoch | Mittel | Mittel |

---

## 2.3 TYP A – STANDARD (DETAILSPEZIFIKATION)

### 2.3.1 Technische Daten

| Parameter | Wert |
|-----------|------|
| **Normbezeichnung** | VG 95218-T020 Type A |
| **Temperaturbereich** | -40°C bis +105°C |
| **Kurzzeit (30s)** | +250°C |
| **Nennspannung** | 600V AC / 900V DC |
| **Prüfspannung** | 2500V AC (1 Minute) |
| **Isolationsmaterial** | EPR (Ethylen-Propylen-Kautschuk) |
| **Leiterbeschichtung** | Zinn (Sn), 5-10 µm |
| **Leiteraufbau** | Kupfer, weich, verseilt |

### 2.3.2 Dimensionstabelle TYP A

| Kode | Querschnitt (mm²) | Leiteraufbau (n×d) | Leiter-Ø (mm) | Isolationsdicke (mm) | Außen-Ø MAX (mm) | Widerstand Ω/km @20°C | Gewicht (kg/km) |
|------|-------------------|-------------------|---------------|---------------------|------------------|----------------------|-----------------|
| A016 | 0,25 | 19×0,16 | 0,58 | 0,40 | 1,30 | 86,0 | 2,99 |
| A001 | 0,40 | 19×0,16 | 0,74 | 0,40 | 1,45 | 53,1 | 4,40 |
| A002 | 0,50 | 19×0,16 | 0,83 | 0,40 | 1,60 | 42,3 | 5,47 |
| A003 | 0,60 | 19×0,20 | 0,93 | 0,45 | 1,75 | 33,5 | 6,60 |
| A004 | 0,75 | 19×0,20 | 1,03 | 0,45 | 1,90 | 26,6 | 8,25 |
| A005 | 1,00 | 37×0,16 | 1,18 | 0,45 | 2,10 | 21,0 | 10,29 |
| A006 | 1,20 | 37×0,18 | 1,34 | 0,50 | 2,35 | 16,4 | 12,84 |
| A007 | 1,50 | 37×0,20 | 1,49 | 0,50 | 2,60 | 13,5 | 15,85 |
| A008 | 2,50 | 37×0,23 | 1,85 | 0,50 | 3,20 | 8,2 | 24,08 |
| A017 | 3,00 | 37×0,29 | 2,13 | 0,60 | 3,50 | 6,63 | 30,09 |
| A009 | 4,00 | 37×0,32 | 2,65 | 0,60 | 4,00 | 5,09 | 58,00 |
| A010 | 6,00 | 7×33×0,16 | 3,35 | 0,60 | 5,00 | 3,39 | 79,00 |
| A011 | 10,00 | 7×27×0,21 | 4,30 | 0,60 | 6,00 | 1,95 | 124,00 |
| A012 | 16,00 | 19×17×0,21 | 5,20 | 0,60 | 7,00 | 1,24 | 188,00 |

### 2.3.3 Grenzwerte für Durchgangsmessung (TYP A)

| Länge | 0,25 mm² | 0,40 mm² | 1,00 mm² | 2,50 mm² | 4,00 mm² |
|-------|----------|----------|----------|----------|----------|
| 1 m | 0,086 Ω | 0,053 Ω | 0,021 Ω | 0,008 Ω | 0,005 Ω |
| 5 m | 0,43 Ω | 0,27 Ω | 0,11 Ω | 0,04 Ω | 0,03 Ω |
| 10 m | 0,86 Ω | 0,53 Ω | 0,21 Ω | 0,08 Ω | 0,05 Ω |
| 20 m | 1,72 Ω | 1,06 Ω | 0,42 Ω | 0,16 Ω | 0,10 Ω |

---

## 2.4 TYP E – LEICHTBAU (DETAILSPEZIFIKATION)

### 2.4.1 Technische Daten

| Parameter | Wert |
|-----------|------|
| **Normbezeichnung** | VG 95218-T020 Type E |
| **Temperaturbereich** | -55°C bis +125°C |
| **Nennspannung** | 600V AC / 900V DC |
| **Isolationsmaterial** | EPR (dünnwandig) |
| **Leiterbeschichtung** | Zinn (Sn) |
| **Gewichtsvorteil** | ca. 30% leichter als Typ A |
| **Durchmesservorteil** | ca. 40% kleiner als Typ A |

### 2.4.2 Dimensionstabelle TYP E

| Kode | Querschnitt (mm²) | Leiter-Ø (mm) | Isolationsdicke (mm) | Außen-Ø MAX (mm) | Widerstand Ω/km | Gewicht (kg/km) |
|------|-------------------|---------------|---------------------|------------------|-----------------|-----------------|
| E12 | 0,15 | 0,45 | 0,20 | 0,90 | 135,0 | 2,59 |
| E01 | 0,25 | 0,56 | 0,25 | 1,10 | 84,4 | 3,59 |
| E02 | 0,40 | 0,74 | 0,25 | 1,20 | 50,5 | 5,18 |
| E03 | 0,50 | 0,83 | 0,30 | 1,45 | 40,1 | 6,60 |
| E04 | 0,60 | 0,95 | 0,30 | 1,55 | 31,1 | 7,40 |
| E05 | 0,75 | 1,04 | 0,30 | 1,65 | 26,7 | 8,90 |
| E06 | 1,00 | 1,17 | 0,30 | 1,85 | 20,0 | 10,70 |
| E07 | 1,20 | 1,32 | 0,35 | 2,10 | 15,3 | 13,60 |
| E08 | 1,50 | 1,46 | 0,35 | 2,30 | 13,7 | 16,00 |
| E09 | 2,00 | 1,68 | 0,35 | 2,80 | 10,5 | 20,30 |
| E10 | 2,50 | 1,85 | 0,35 | 2,80 | 8,21 | 25,70 |
| E11 | 3,00 | 2,12 | 0,40 | 3,40 | 6,58 | 31,00 |

---

## 2.5 TYP G – HOCHTEMPERATUR (DETAILSPEZIFIKATION)

### 2.5.1 Technische Daten

| Parameter | Wert |
|-----------|------|
| **Normbezeichnung** | VG 95218-T020 Type G |
| **Temperaturbereich** | -40°C bis +150°C |
| **Nennspannung** | 600V AC / 900V DC |
| **Isolationsmaterial** | Fluoropolymer (PTFE/PVDF) |
| **Leiterbeschichtung** | Silber (Ag), min. 1,0 µm |
| **Chemikalienbeständigkeit** | Sehr hoch |
| **Besonderheit** | Oxidationsbeständig bis 200°C |

### 2.5.2 Dimensionstabelle TYP G

| Kode | Querschnitt (mm²) | Leiter-Ø (mm) | Isolationsdicke (mm) | Außen-Ø MAX (mm) | Widerstand Ω/km | Ag-Schicht (µm) |
|------|-------------------|---------------|---------------------|------------------|-----------------|-----------------|
| G01 | 0,25 | 0,56 | 0,30 | 1,20 | 74,0 | 1,0 |
| G02 | 0,34 | 0,65 | 0,30 | 1,35 | 54,0 | 1,0 |
| G03 | 0,50 | 0,80 | 0,35 | 1,60 | 37,0 | 1,0 |
| G04 | 0,75 | 0,98 | 0,35 | 1,85 | 24,7 | 1,0 |
| G05 | 1,00 | 1,13 | 0,40 | 2,10 | 18,5 | 1,0 |
| G06 | 1,50 | 1,38 | 0,40 | 2,45 | 12,4 | 1,0 |
| G07 | 2,50 | 1,78 | 0,45 | 3,00 | 7,41 | 1,0 |
| G08 | 4,00 | 2,26 | 0,50 | 3,70 | 4,62 | 1,0 |

---

## 2.6 TYP H – EXTREM-HOCHTEMPERATUR (DETAILSPEZIFIKATION)

### 2.6.1 Technische Daten

| Parameter | Wert |
|-----------|------|
| **Normbezeichnung** | VG 95218-T020 Type H |
| **Temperaturbereich** | -40°C bis +180°C |
| **Kurzzeittemperatur** | +220°C (kurzzeitig) |
| **Nennspannung** | 600V AC / 900V DC |
| **Isolationsmaterial** | Spezial-Fluoropolymer |
| **Leiterbeschichtung** | Silber (Ag), min. 2,0 µm |
| **Anwendung** | Aerospace, Triebwerknähe |

### 2.6.2 Dimensionstabelle TYP H

| Kode | Querschnitt (mm²) | Leiter-Ø (mm) | Isolationsdicke (mm) | Außen-Ø MAX (mm) | Widerstand Ω/km | Ag-Schicht (µm) |
|------|-------------------|---------------|---------------------|------------------|-----------------|-----------------|
| H01 | 0,34 | 0,65 | 0,35 | 1,50 | 54,0 | 2,0 |
| H02 | 0,50 | 0,80 | 0,40 | 1,75 | 37,0 | 2,0 |
| H03 | 1,00 | 1,13 | 0,45 | 2,35 | 18,5 | 2,0 |
| H04 | 1,50 | 1,38 | 0,50 | 2,75 | 12,4 | 2,0 |
| H05 | 2,50 | 1,78 | 0,50 | 3,35 | 7,41 | 2,0 |

---

## 2.7 MATERIALSPEZIFIKATIONEN

### 2.7.1 Leitermaterial

| Parameter | TYP A/E (Zinn) | TYP G/H (Silber) |
|-----------|----------------|------------------|
| **Grundmaterial** | Elektrolytkupfer (E-Cu) | Elektrolytkupfer (E-Cu) |
| **Reinheit** | min. 99,95% | min. 99,95% |
| **Norm** | IEC 60228 | IEC 60228 |
| **Beschichtung** | Zinn (Sn) | Silber (Ag) |
| **Schichtdicke** | 5-10 µm | 1-2 µm |
| **Schmelzpunkt** | +232°C (Sn) | +960°C (Ag) |
| **Lötbarkeit** | Sehr gut | Sehr gut |
| **Max. Einsatztemperatur** | +125°C | +200°C |

### 2.7.2 Isolationsmaterial

| Parameter | EPR (Typ A/E) | Fluoropolymer (Typ G/H) |
|-----------|---------------|------------------------|
| **Chemische Bezeichnung** | Ethylen-Propylen-Kautschuk | PTFE/PVDF |
| **Max. Temperatur** | +125°C | +180°C |
| **Ölbeständigkeit** | Hoch | Sehr hoch |
| **Wasserbeständigkeit** | Sehr gut | Ausgezeichnet |
| **Elastizität bei Kälte** | Gut (-55°C) | Mittel (-40°C) |
| **Dielektrische Festigkeit** | ≥ 30 kV/mm | ≥ 40 kV/mm |
| **Referenznorm** | EN 60811-404 | DIN VDE 0472 |

---

## 2.8 ELEKTRISCHE PRÜFUNGEN

### 2.8.1 Übersicht Prüfungen

| Prüfung | Prüfwert | Grenzwert | Prüfmittel |
|---------|----------|-----------|------------|
| **Gleichstromwiderstand** | @20°C | gem. Tabelle | Milliohmmeter |
| **Isolationswiderstand** | 500V DC, 60s | ≥ 10¹¹ Ω·km | Megaohmmeter |
| **Spannungsfestigkeit** | 2500-3000V AC | 60s ohne Durchschlag | AC-Prüfgerät |
| **Kapazität** | — | ≤ 100 pF/m | LCR-Meter |

### 2.8.2 Durchführung Widerstandsmessung

```
VERFAHREN WIDERSTANDSMESSUNG
════════════════════════════

VORBEREITUNG:
☐ Temperatur: 20°C ±5°C
☐ Wartezeit: 24h unter Normalbedingungen
☐ Messmethode: 4-Leiter (Kelvin) empfohlen

DURCHFÜHRUNG:
1. Leiterlänge dokumentieren (z.B. 100 m)
2. Enden reinigen (keine Oxidation)
3. Prüfspitzen anschließen
4. Drei Messungen durchführen
5. Mittelwert bilden

UMRECHNUNG AUF 20°C:
   Falls Temperatur ≠ 20°C:
   
   R₂₀ = Rₜ / (1 + α × (t - 20))
   
   α = 0,00393 K⁻¹ (für Kupfer)

GRENZWERTBERECHNUNG:
   R_max = (Ω/km aus Tabelle) × (Länge in km) + 5%
```

### 2.8.3 Durchführung Isolationsprüfung

```
VERFAHREN ISOLATIONSWIDERSTAND
══════════════════════════════

PRÜFGERÄT:
☐ Megaohmmeter (Fluke 1507, Kyoritsu 3022)
☐ Prüfspannung: 500V DC

VORBEREITUNG:
☐ Leitung völlig trocken
☐ Temperatur: 20-25°C
☐ Luftfeuchtigkeit: 45-75% RH

MESSPUNKTE:
☐ Leiter ↔ Wasser (bei Wasserbadmethode)
☐ Leiter ↔ Metallfolie (bei Folienmethode)

DURCHFÜHRUNG:
1. Spannung anlegen
2. 60 Sekunden warten (Stabilisierung)
3. Wert ablesen

UMRECHNUNG AUF 1 km:
   R_norm = R_gemessen × L(km)

GRENZWERT:
   ≥ 1 × 10¹¹ Ω·km (alle Typen)
```

---

## 2.9 MECHANISCHE PRÜFUNGEN

### 2.9.1 Zugfestigkeitsprüfung

| Parameter | Grenzwert |
|-----------|-----------|
| **Zugfestigkeit (vor Alterung)** | ≥ 5,0 N/mm² |
| **Zugfestigkeit (nach Alterung)** | ≥ 5,0 N/mm² |
| **Bruchdehnung (vor Alterung)** | ≥ 200% |
| **Bruchdehnung (nach Alterung)** | ≥ 200% |

```
VERFAHREN ZUGPRÜFUNG
════════════════════

PROBENHERSTELLUNG:
1. 5 Proben à 250 mm entnehmen
2. Leiter vorsichtig entfernen
3. Nur Isolation prüfen

PRÜFGERÄT:
☐ Zugprüfmaschine
☐ Prüfgeschwindigkeit: 50 mm/min
☐ Ausgangslänge: 100 mm

BERECHNUNG:

   Zugfestigkeit σ = F_max / A  [N/mm²]
   
   Bruchdehnung ε = (L_f - L_0) / L_0 × 100%
```

### 2.9.2 Kaltbiegeprüfung

| Parameter | Wert |
|-----------|------|
| **Prüftemperatur** | -30°C (Typ A/G) / -55°C (Typ E) |
| **Konditionierung** | 30 Minuten bei Prüftemperatur |
| **Biegedorn** | 5× Außendurchmesser |
| **Biegezyklen** | 5× um 180° |
| **Kriterium** | Keine sichtbaren Risse |

---

## 2.10 FARBKODIERUNG

### 2.10.1 System 25 (Typ A, G)

| Farbe | Kode | Ader-Nr. |
|-------|------|----------|
| Weiß | 0 | — |
| Rot | A | 1 |
| Blau | B | 2 |
| Gelb | C | 3 |
| Grün | D | 4 |
| Schwarz | F | 5 |
| Braun | G | 6 |
| Orange | H | 7 |
| Violett | J | 8 |
| Grau | K | 9 |

### 2.10.2 System 100 (Typ E)

| Nummer | Farbe |
|--------|-------|
| 0 | Schwarz |
| 1 | Braun |
| 2 | Rot |
| 3 | Orange |
| 4 | Gelb |
| 5 | Grün |
| 6 | Blau |
| 7 | Violett |
| 8 | Grau |
| 9 | Weiß |
| G | Grün/Gelb (PE) |

---

## 2.11 TOLERANZEN UND PRÜFKRITERIEN

### 2.11.1 Dimensionstoleranzen

| Parameter | Toleranz |
|-----------|----------|
| **Leiterdurchmesser** | ±0,05 mm |
| **Isolationsdicke** | ±0,05 mm |
| **Außendurchmesser** | ±0,1 mm |
| **Längenmessung** | ±5% |
| **Masse pro km** | ±10% |
| **Widerstand** | ±5% vom Tabellenwert |

### 2.11.2 Automatische Ablehnkriterien

Eine Charge wird **AUTOMATISCH ABGELEHNT**, wenn:

| Kriterium | Grund |
|-----------|-------|
| **Außendurchmesser außer Toleranz** | Passt nicht in Steckverbinder |
| **Isolationswiderstand < 10¹¹ Ω·km** | Isolationsdefekt |
| **Zugfestigkeit < 5,0 N/mm²** | Mechanisch zu schwach |
| **Kaltbiegeprüfung: Risse** | Bruchgefahr bei Kälte |
| **Spannungsfestigkeit: Durchschlag** | Isolationsversagen |

---

## 2.12 LAGERUNG UND HANDHABUNG

### 2.12.1 Lagerbedingungen

| Parameter | Wert |
|-----------|------|
| **Temperatur** | +5°C bis +25°C |
| **Luftfeuchtigkeit** | 45-75% RH |
| **Lichtschutz** | Vor UV schützen |
| **Ozonschutz** | Von Ozonerzeugern fernhalten |
| **Lagerdauer (versiegelt)** | Max. 5 Jahre |
| **Lagerdauer (geöffnet)** | Max. 6 Monate |

### 2.12.2 Handhabungshinweise

```
HANDHABUNG VON VG 95218 LEITUNGEN
═════════════════════════════════

☐ Verpackung vor Öffnung auf Beschädigung prüfen
☐ Nur mit sauberen Handschuhen handhaben
☐ Knicke und scharfe Biegungen vermeiden
☐ Mindestbiegeradius: 5× Außendurchmesser
☐ Nach Gebrauch wieder verpacken
☐ Chargennummer dokumentieren

⚠️ ACHTUNG:
   Beschädigte Isolation führt zu AUSSCHUSS!
```

---

## 2.13 ZUGEHÖRIGE NORMEN

| Norm | Beschreibung |
|------|--------------|
| **VG 95218-2** | Fachgrundnorm (allgemeine Anforderungen) |
| **IEC 60228** | Leiterquerschnitte und Widerstände |
| **DIN VDE 0472-602** | Zugfestigkeit der Isolation |
| **DIN VDE 0472-509** | Spannungsfestigkeit |
| **EN 60811-404** | Mechanische Prüfungen Elastomere |
| **EN 60811-1-1** | Allgemeine Prüfverfahren |

---

## 2.14 SCHNELLREFERENZ – HÄUFIGSTE QUERSCHNITTE

### Für 5 Meter Garnitur (Durchgangsgrenzwerte)

```
TYP A (System 25) – GRENZWERTE @ 20°C
═════════════════════════════════════
0,25 mm² (A016)  →  < 0,43 Ω  [Signale]
0,40 mm² (A001)  →  < 0,27 Ω  [Strom]
1,00 mm² (A005)  →  < 0,11 Ω  [Strom] ← HÄUFIGSTER
4,00 mm² (A009)  →  < 0,03 Ω  [Hochstrom]

TYP E (System 100) – GRENZWERTE @ 20°C
══════════════════════════════════════
0,25 mm² (E01)   →  < 0,42 Ω  [Signale]
0,75 mm² (E05)   →  < 0,13 Ω  [Marine]
1,00 mm² (E06)   →  < 0,10 Ω  [Marine]
2,00 mm² (E09)   →  < 0,05 Ω  [Strom]
```

---

**ENDE TEIL 2 – VG 95218 DRÄHTE UND LEITUNGEN**

*Weiter mit TEIL 3: VG 96927 – Kabelgarnituren*
