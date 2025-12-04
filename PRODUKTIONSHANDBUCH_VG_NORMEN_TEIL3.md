---

# 3.  KABELGARNITUREN - VG 96927

## 3. 1 Übersicht VG 96927

Die Normenreihe **VG 96927** definiert die Anforderungen an konfektionierte Kabelgarnituren für Verteidigungsanwendungen. 

### 3. 1.1 Struktur der Normenreihe

| Teil | Bezeichnung | Beschreibung |
|------|-------------|--------------|
| **VG 96927-1** | Übersicht | Übersicht aller Teile der Serie |
| **VG 96927-2** | Generischer Standard | Allgemeine Anforderungen, Prüfverfahren |
| **VG 96927-3** | Darstellung | Grafische Schemas, Zeichnungen |
| **VG 96927-4** | Verarbeitungsrichtlinien | Montage, Schweißen, Kleben |
| **VG 96927-5** | Beiblatt | Isolierungslängen, Komponentenzuordnung |
| **VG 96927-6** | Reparaturverfahren | Reparatur und Regeneration |
| **VG 96927-12** | 2-Ader Detail | 2-Ader Garnitur (häufigster Typ) |
| **VG 96927-15** | 5-Ader Detail | 5-Ader Garnitur |
| **VG 96927-17** | 7-Ader Detail | 7-Ader Garnitur |
| **VG 96927-22** | 12-Ader Detail | 12-Ader Garnitur |

### 3.1.2 Zulassungsverfahren

```
ZULASSUNGSPROZESS VG 96927
══════════════════════════

1.  ERSTPRÜFUNG
   │
   ├── Laborprüfung der Muster
   ├── Vor-Ort-Audit durch VDE
   └── Typenprüfung (Grundtypen A-D)

2.  TEMPORÄRE ZULASSUNG
   │
   ├── Gültig für 2 Jahre
   └── Produktionsüberwachung

3. DAUERHAFTE ZULASSUNG
   │
   ├── Eintragung in VG 95212 Register
   └── Regelmäßige Requalifizierung

ZERTIFIZIERUNGSSTELLE: VDE Prüf- und Zertifizierungsinstitut
```

**Quelle:** Cablescan VG 96927-2:2020-06 Approval, Lacon GmbH VG 96927 Standards

---

## 3.2 Temperatursysteme

### 3.2.1 Übersicht der drei Systeme

| System | Betriebstemperatur | Kurzzeitgrenze | Material | Anwendung |
|--------|-------------------|----------------|----------|-----------|
| **System 25** | -75°C bis +150°C | +200°C (5 min) | FR – Flammhemmend | Fahrzeuge, Flugzeuge, allgemein |
| **System 100** | -40°C bis +105°C | +125°C (1h) | LFH – Halogenfrei | Schiffe, Bahn, geschlossene Räume |
| **System 200** | -55°C bis +200°C | +250°C (5 min) | HFR – Hochflammhemmend | Extreme Bedingungen |

### 3.2. 2 Entscheidungsmatrix Systemauswahl

```
SYSTEMAUSWAHL
═════════════

START: Einsatzumgebung bestimmen
    │
    ├── Geschlossener Raum (Schiff, U-Boot, Bahn)? 
    │       │
    │       └── JA → SYSTEM 100 (halogenfrei, geringer Rauch)
    │
    ├── Extreme Temperatur > 150°C?
    │       │
    │       └── JA → SYSTEM 200 (bis +200°C)
    │
    └── Standardanwendung (Fahrzeug, Flugzeug)? 
            │
            └── JA → SYSTEM 25 (universell)


⚠️ WICHTIG: Systeme NICHT mischen!
   Jedes System hat eigene Materialien, Farben, Temperaturen. 
```

### 3.2. 3 Detailvergleich der Systeme

**SYSTEM 25 (FR – Flame Retardant):**

| Parameter | Wert |
|-----------|------|
| Temperaturbereich | -75°C bis +150°C |
| Kurzzeitbelastung | +200°C für max. 5 Minuten |
| Isolationsmaterial | Strahlenvernetztes Polyalken |
| Mantelmaterial | Modifizierter Fluorpolymer |
| Brennbarkeit | Selbstverlöschend < 60 Sekunden |
| Rauchdichte | SMOG DENSITY < 100 |
| Hauptanwendung | Landfahrzeuge, Luftfahrt |

**SYSTEM 100 (LFH – Low Fire Hazard):**

| Parameter | Wert |
|-----------|------|
| Temperaturbereich | -40°C bis +105°C |
| Kurzzeitbelastung | +125°C für max. 1 Stunde |
| Isolationsmaterial | Halogenfreies Polyalken |
| Mantelmaterial | LSZH (Low Smoke Zero Halogen) |
| Brennbarkeit | Selbstverlöschend < 30 Sekunden |
| Rauchdichte | SMOG DENSITY < 50 |
| HCl-Emission | < 100 mg/g |
| Hauptanwendung | Marine, U-Boote, Bahnsysteme |

**SYSTEM 200 (HFR – High Flame Retardant):**

| Parameter | Wert |
|-----------|------|
| Temperaturbereich | -55°C bis +200°C |
| Kurzzeitbelastung | +250°C für max. 5 Minuten |
| Isolationsmaterial | Hochtemperatur-Fluorpolymer |
| Mantelmaterial | Spezial-Elastomer |
| Brennbarkeit | Selbstverlöschend < 20 Sekunden |
| Rauchdichte | SMOG DENSITY < 50 |
| Hauptanwendung | Triebwerke, Aerospace |

---

## 3. 3 Elektrische Anforderungen

### 3. 3.1 Übersichtstabelle Elektrische Prüfungen

| Prüfung | System 25 | System 100 | System 200 | Prüfmittel |
|---------|-----------|------------|------------|------------|
| **Nennspannung** | 600V AC / 900V DC | 600V AC / 900V DC | 600V AC / 900V DC | Dokumentation |
| **Isolationswiderstand @500V DC** | > 100 MΩ | > 100 MΩ | > 100 MΩ | Megaohmmeter |
| **Durchschlagfestigkeit (Hipot)** | 1050V AC, 60 sec | 1050V AC, 60 sec | 1500V AC, 60 sec | AC-Prüfgerät |
| **Max. Prüfstrom** | < 2 mA | < 2 mA | < 1 mA | AC-Prüfgerät |
| **Durchgang** | Gem. Ω/km Tabelle | Gem.  Ω/km Tabelle | Gem. Ω/km Tabelle | Multimeter |
| **Kontaktwiderstand** | < 10 mΩ | < 10 mΩ | < 10 mΩ | Milliohmmeter |

**Quelle:** VG 96927-2:2024-10, Intertek Inform Standards Database

### 3. 3.2 Durchgangsprüfung (Leiterwiderstand)

**Verfahren nach VG 96927-2 Abschnitt 5.3.1:**

```
DURCHGANGSPRÜFUNG - VERFAHREN
═════════════════════════════

VORBEREITUNG:
☐ Temperatur: 20°C ±5°C
☐ Wartezeit: 24h unter Normalbedingungen
☐ Messmethode: 4-Leiter (Kelvin) empfohlen

DURCHFÜHRUNG:
1.  Garniturenlänge dokumentieren (z.B. 5m)
2. Kontaktstellen reinigen
3.  Drei Messungen durchführen, Mittelwert bilden
4. Bei Temperatur ≠ 20°C umrechnen:

   R₂₀ = Rₜ / (1 + α × (t - 20))
   
   α = 0,00393 K⁻¹ (für Kupfer)

GRENZWERT:
   R_gemessen ≤ R_Grenzwert
   
   R_Grenzwert = (Ω/km aus Tabelle) × (Länge in m) / 1000
                 + 10 mΩ (Kontaktwiderstand)

ERGEBNIS:
☐ BESTANDEN: R_gemessen < R_Grenzwert
☐ NICHT BESTANDEN: R_gemessen > R_Grenzwert
```

### 3.3.3 Isolationswiderstandsprüfung

**Verfahren nach VG 96927-2 Abschnitt 5.3.2:**

```
ISOLATIONSWIDERSTANDSPRÜFUNG - VERFAHREN
════════════════════════════════════════

VORBEREITUNG:
☐ Kabel völlig trocken (nicht nach Feuchtetest)
☐ Temperatur: 20-25°C
☐ Luftfeuchtigkeit: 45-75% RH
☐ Lagerzeit: 24h unter Normalbedingungen

PRÜFGERÄT:
☐ Megaohmmeter (z.B.  Fluke 1507, Kyoritsu 3022)
☐ Prüfspannung: 500V DC

MESSPUNKTE:

Punkt A: Adern vs. Abschirmung
┌─────────────────────────────────────┐
│  Schwarze Prüfspitze → Alle Adern  │
│  Rote Prüfspitze → Geflecht/Masse  │
│  Wartezeit: 60 Sekunden            │
│  GRENZWERT: > 100 MΩ               │
└─────────────────────────────────────┘

Punkt B: Ader vs. Ader
┌─────────────────────────────────────┐
│  Schwarze Prüfspitze → Ader 1      │
│  Rote Prüfspitze → Ader 2          │
│  Wartezeit: 60 Sekunden            │
│  GRENZWERT: > 100 MΩ               │
└─────────────────────────────────────┘

GRENZWERTE:
┌──────────────────────────┬─────────────┐
│ Zustand                  │ Grenzwert   │
├──────────────────────────┼─────────────┤
│ Normalklima (trocken)    │ > 100 MΩ    │
│ Nach Feuchteprüfung      │ > 50 MΩ     │
│ Nach Wärmealterung       │ > 50 MΩ     │
└──────────────────────────┴─────────────┘

ERGEBNIS:
☐ BESTANDEN: Beide Punkte > Grenzwert
☐ NICHT BESTANDEN: Ein Punkt < Grenzwert
```

### 3. 3.4 Hochspannungsprüfung (Hipot)

**Verfahren nach VG 96927-2 Abschnitt 5. 3.3:**

```
HOCHSPANNUNGSPRÜFUNG (HIPOT) - VERFAHREN
════════════════════════════════════════

⚠️ SICHERHEITSHINWEISE:
☐ Hochspannungsbereich absperren
☐ Warnhinweise anbringen
☐ Isolierhandschuhe tragen
☐ Not-Aus bereithalten
☐ Niemals allein arbeiten! 

PRÜFGERÄT:
☐ AC-Hipot-Tester (z.B. Vitrek, Kikusui)
☐ Bereich: 0-5 kV AC

PRÜFSPANNUNG:
┌──────────────┬─────────────┬──────────┬───────────────┐
│ System       │ Spannung    │ Dauer    │ Max. Strom    │
├──────────────┼─────────────┼──────────┼───────────────┤
│ System 25    │ 1050V AC    │ 60 sek   │ < 2 mA        │
│ System 100   │ 1050V AC    │ 60 sek   │ < 2 mA        │
│ System 200   │ 1500V AC    │ 60 sek   │ < 1 mA        │
└──────────────┴─────────────┴──────────┴───────────────┘

DURCHFÜHRUNG:
1. Adern zusammen → Positive Prüfspitze
2.  Geflecht/Masse → Negative Prüfspitze
3.  Spannung schrittweise erhöhen (nicht sprunghaft!)
4. Zielspannung 60 Sekunden halten
5. Beobachten: KEIN Funke, KEIN Rauch, KEIN Geräusch
6. Spannung kontrolliert absenken
7. 5 Sekunden warten vor Berührung

ERGEBNIS:
☐ BESTANDEN: Kein Durchschlag, Strom < Grenzwert
☐ NICHT BESTANDEN: Durchschlag, Funke, Rauch, Überstrom
```

### 3.3. 5 Abschirmungsprüfung (nur für geschirmte Garnituren)

| Geflechttyp | Optische Abdeckung | Min. Schirmdämpfung | Frequenzbereich |
|-------------|-------------------|---------------------|-----------------|
| **Ray 90** | Min. 90% | 80 dB | 1 MHz – 1 GHz |
| **Ray 101** | 93-100% | 90-100 dB | 1 MHz – 1 GHz |

**Prüfmittel:** Netzwerkanalysator oder Schirmwirkungsmessgerät

---

## 3.4 Mechanische Anforderungen

### 3.4. 1 Übersichtstabelle Mechanische Prüfungen

| Prüfung | Methode | Grenzwert | Interpretation |
|---------|---------|-----------|----------------|
| **Zugfestigkeit** | ISO 527 | > 12 MPa (Mantel) | Reißt nicht leicht |
| **Bruchdehnung** | ISO 527 | > 150% | Materialelastizität |
| **Biegeprüfung** | ±7,5 mm, 1 Hz | 10. 000 Zyklen ohne Risse | Langzeitelastizität |
| **Bleibende Verformung** | 70h @ 150°C | Max. 25% | Wärmebeständigkeit |

### 3.4.2 Zugversuch (Reißfestigkeit)

**Verfahren nach DIN VDE 0472-602:**

```
ZUGVERSUCH - VERFAHREN
══════════════════════

PROBENVORBEREITUNG:
☐ Probelänge: 100 mm (Messlänge)
☐ Min. 5 Proben aus verschiedenen Stellen
☐ Temperatur: 23°C ±2°C

DURCHFÜHRUNG:
1. Probe in Spannvorrichtung einspannen
2.  Spannweite: 2 cm
3. Zuggeschwindigkeit: 50 mm/min
4. Kraft bei Bruch notieren (F_max in N)
5.  Länge bei Bruch notieren (L_f in mm)

BERECHNUNG:

Zugfestigkeit:
σ = F_max / A  [N/mm²]

Bruchdehnung:
ε = (L_f - L₀) / L₀ × 100%

GRENZWERTE:
┌─────────────────────┬───────────────┬───────────────┐
│ Parameter           │ Frisch        │ Nach Alterung │
├─────────────────────┼───────────────┼───────────────┤
│ Zugfestigkeit       │ > 12 MPa      │ > 10 MPa      │
│ Bruchdehnung        │ > 150%        │ > 100%        │
└─────────────────────┴───────────────┴───────────────┘
```

### 3.4.3 Biegeprüfung

**Verfahren:**

```
BIEGEPRÜFUNG - VERFAHREN
════════════════════════

PROBENVORBEREITUNG:
☐ Probelänge: 30 cm
☐ Mindestens 3 Proben

PRÜFPARAMETER:
☐ Amplitude: ±7,5 mm (15 mm gesamt)
☐ Frequenz: 1 Hz (1 Hub/Sekunde)
☐ Zyklen: Minimum 10.000

PRÜFUNG:
1. Probe in Biegevorrichtung einspannen
2.  Biegung starten
3. Nach 10.000 Zyklen stoppen
4.  Visuelle Prüfung auf Risse

NACH DER PRÜFUNG:
☐ Keine sichtbaren Risse (visuell)
☐ Isolationswiderstand: > 100 MΩ
☐ Durchgang: Ohne Unterbrechung

ERGEBNIS:
☐ BESTANDEN: Alle Kriterien erfüllt
☐ NICHT BESTANDEN: Risse oder Widerstandsabfall
```

---

## 3. 5 Brennbarkeitsprüfungen

### 3. 5.1 Nadelflammprüfung

**Verfahren nach IEC 60811-4-1:**

```
NADELFLAMMPRÜFUNG - VERFAHREN
═════════════════════════════

PROBENVORBEREITUNG:
☐ Probelänge: 30 cm
☐ Vertikal aufhängen

PRÜFGERÄT:
☐ Nadelflammenbrenner
☐ Blaue Flamme < 20 mm

DURCHFÜHRUNG:
1. Flamme an Mantel halten: 30-60 Sekunden
2. Flamme entfernen
3.  Stoppuhr starten
4. Selbstverlöschzeit messen

GRENZWERTE:
┌──────────────┬─────────────────────────────┐
│ System       │ Max. Selbstverlöschzeit     │
├──────────────┼─────────────────────────────┤
│ System 25    │ < 60 Sekunden               │
│ System 100   │ < 30 Sekunden               │
│ System 200   │ < 20 Sekunden               │
└──────────────┴─────────────────────────────┘

ZUSÄTZLICHE KRITERIEN:
☐ Kein Durchbrand
☐ Kein offenes Feuer nach Entfernen der Flamme
☐ Keine brennenden Tropfen
```

### 3. 5.2 Rauchemissionsprüfung

**Verfahren nach ISO 5659-2:**

```
RAUCHEMISSIONSPRÜFUNG - VERFAHREN
═════════════════════════════════

PRÜFGERÄT:
☐ NBS Rauchkammer (Smoke Chamber)

PRÜFTEMPERATUR:
☐ System 25: +500°C
☐ System 100: +200°C

DURCHFÜHRUNG:
1. Probe in Kammer legen
2.  Auf Prüftemperatur erhitzen
3. Rauch 4 Minuten sammeln
4.  Optische Verdunkelung messen (SMOG DENSITY)

GRENZWERTE:
┌──────────────┬─────────────────┐
│ System       │ Max. SMOG       │
├──────────────┼─────────────────┤
│ System 25    │ < 100           │
│ System 100   │ < 50            │
│ System 200   │ < 50            │
└──────────────┴─────────────────┘
```

### 3.5.3 Halogensäureemission (nur System 100)

**Verfahren nach IEC 60754-2:**

| Parameter | Grenzwert | Bemerkung |
|-----------|-----------|-----------|
| HCl-Emission | < 100 mg/g | Nur für System 100 (LSZH) |
| pH-Wert | > 4,3 | Geringe Säurebildung |
| Leitfähigkeit | < 100 µS/mm | Geringe Korrosionsgefahr |

---

## 3. 6 Umweltprüfungen

### 3.6. 1 Feuchtigkeitsprüfung

| Parameter | Wert | Dauer |
|-----------|------|-------|
| Temperatur | 85°C | 168h (7 Tage) |
| Luftfeuchtigkeit | 85% RH | 168h (7 Tage) |
| Isolationswiderstand nach Test | > 50 MΩ | @500V DC |
| Massenänderung | ≤ ±3% | Maximum |

### 3. 6.2 Flüssigkeitsbeständigkeit (nur System 25)

**Verfahren nach VG 95218-2:**

| Prüfflüssigkeit | Temperatur | Dauer | Grenzwerte |
|-----------------|------------|-------|------------|
| MIL-H-5606 (Hydrauliköl) | +70°C | 70h | Massenänderung ≤ ±15% |
| JP-4 (Treibstoff) | +70°C | 70h | Volumenänderung ≤ ±15% |
| NATO F-34 (Militärtreibstoff) | +70°C | 70h | Zugfestigkeit ≥ 75% |

### 3.6.3 Weitere Umweltprüfungen

| Prüfung | System | Temperatur | Dauer | Anforderung |
|---------|--------|------------|-------|-------------|
| **Ozonbeständigkeit** | Alle | +40°C | 24-72h | Keine sichtbaren Risse |
| **Salznebelprüfung** | Alle | +35°C | 500h | Keine Korrosion |
| **UV-Beständigkeit** | Alle | Nach Norm | 500h | Keine Versprödung |

---

## 3.7 Farbkodierung der Adern

### 3.7.1 System 25 (VG 95218 T020 Type A)

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

### 3.7.2 System 100 (VG 95218 T020 Type E)

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
| G | Grün/Gelb (Erde) |

### 3.7.3 Farbprüfverfahren

```
FARBPRÜFUNG - VERFAHREN
═══════════════════════

1. Mantel an mehreren Stellen ablösen (alle 10 cm)
2.  Sichtbare Farbe der Ader prüfen
3. Mit Zeichnungsdokumentation vergleichen
4.  Bei Abweichung → ABLEHNEN

⚠️ WICHTIG: 
   System 25 und System 100 haben 
   UNTERSCHIEDLICHE Farbkodierungen! 
```

---

## 3. 8 Abmessungsprüfung

### 3. 8.1 Prüfcheckliste Abmessungen

```
ABMESSUNGSPRÜFUNG - CHECKLISTE
══════════════════════════════

Prüfmittel: Digitale Schieblehre (±0,01 mm)

☐ GESAMTLÄNGE DER GARNITUR
  Grenzwert: Zeichnung ±2% ODER ±5 mm (kleinerer Wert)
  Beispiel: 500 mm → 490-510 mm ✓

☐ LEITERDURCHMESSER
  Grenzwert: Tabelle ±0,1 mm
  Beispiel: A005 Leiter = 1,18 mm → 1,08-1,28 mm

☐ AUSSENDURCHMESSER (OD)
  Grenzwert: Tabelle min-max
  Beispiel: A005 = 1,651-1,702 mm ✓

☐ ISOLIERUNGSDICKE
  Grenzwert: Gleichmäßig ±0,1 mm
  Messen an 5 Punkten (Anfang, Mitte, Ende, Seiten)

☐ ABISOLIERLÄNGE (Stripping)
  Grenzwert: ±1 mm (typisch 5-8 mm)
  ⚠️ NIEMALS den Leiter beschädigen! 

☐ ABSCHIRMUNGSLÄNGE
  Grenzwert: Minimum 5 mm vor Stecker
  Messung: Vom Stecker zurück
```

### 3.8. 2 Referenztabelle Durchmesser

| Kode | Querschnitt (mm²) | Leiter-Ø (mm) | Außen-Ø (mm) |
|------|-------------------|---------------|--------------|
| A001 | 0,40 | 0,74 | 1,168–1,219 |
| A005 | 1,00 | 1,18 | 1,651–1,702 |
| A009 | 4,00 | 2,65–3,00 | 4,520–4,670 |
| E01 | 0,25 | 0,55–0,66 | 1,09–1,19 |
| E05 | 0,75 | 1,04–1,20 | 1,59–1,65 |
| E09 | 2,00 | 1,68–1,87 | 2,31–2,41 |

---

## 3. 9 Schnellreferenz - Grenzwerte

### 3.9. 1 Elektrische Grenzwerte (5 Meter Garnitur)

```
SYSTEM 25 – TYPE A
═══════════════════════════════════════════
Kode A016 (0,25 mm²)  →  GRENZWERT: < 0,43 Ω    [Signale]
Kode A001 (0,40 mm²)  →  GRENZWERT: < 0,27 Ω    [Strom]
Kode A005 (1,00 mm²)  →  GRENZWERT: < 0,11 Ω    [Strom] ← BELIEBTESTER
Kode A009 (4,00 mm²)  →  GRENZWERT: < 0,03 Ω    [Hochstrom]

SYSTEM 100 – TYPE E (Halogenfrei)
═══════════════════════════════════════════
Kode E01 (0,25 mm²)   →  GRENZWERT: < 0,42 Ω    [Signale]
Kode E05 (0,75 mm²)   →  GRENZWERT: < 0,13 Ω    [Schiffe] ← BELIEBT
Kode E06 (1,00 mm²)   →  GRENZWERT: < 0,10 Ω    [Schiffe] ← BELIEBT
Kode E09 (2,00 mm²)   →  GRENZWERT: < 0,05 Ω    [Strom]
```

### 3.9.2 Zusammenfassung aller Prüfungen

| Prüfung | Grenzwert | Prüfmittel |
|---------|-----------|------------|
| Durchgang | < Tabellenwert | Multimeter/Milliohmmeter |
| Isolationswiderstand | > 100 MΩ | Megaohmmeter 500V |
| Hipot (System 25/100) | 1050V AC, 60s, <2mA | AC-Prüfgerät |
| Hipot (System 200) | 1500V AC, 60s, <1mA | AC-Prüfgerät |
| Zugfestigkeit | > 12 MPa | Zugprüfmaschine |
| Bruchdehnung | > 150% | Zugprüfmaschine |
| Selbstverlöschzeit | < 60s / 30s / 20s | Nadelflammenbrenner |
| Rauchdichte | < 100 / < 50 | NBS Rauchkammer |

---

**QUELLENNACHWEIS KAPITEL 3:**
- VG 96927-2:2024-10 Cable assemblies: https://www.intertekinform.com/en-gb/standards/vg-96927-2-2024-10-1122936_saig_vg_vg_3646643/
- Cablescan VG 96927-2:2020-06 Approval: https://www. cablescan.co.uk/blog/vg-96927-2-2020-06-approval/
- Amphenol-Air LB VG96927-2 Harnesses: https://amphenol-airlb.de/en/products/vg96927-2-a-d1-m-p
- Lacon GmbH VG 96927 Standards: https://www. lacon.de/en/news/binding-standards-according-to-norms-series-vg-96927-2025-07-09/
- CiS Defense Technology: https://cis. de/en/areas-of-application/defense-technology/
- TE Connectivity VG-Standards: https://www. te. com/en/industries/defense-military/insights/vg-standards. html