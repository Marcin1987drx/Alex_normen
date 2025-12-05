# PRODUKTIONSHANDBUCH VG NORMEN
## TEIL 7: IPC/WHMA-A-620 – PRODUKTIONSVERFAHREN

---

**Version:** 1.0  
**Datum:** Dezember 2025  
**Geltende Norm:** IPC/WHMA-A-620D  
**Geltungsbereich:** Anforderungen und Akzeptanzkriterien für Kabel- und Kabelbaumkonfektionierung

---

## 7.1 NORMÜBERSICHT

### 7.1.1 Was ist IPC/WHMA-A-620?

**IPC/WHMA-A-620** ist der weltweit anerkannte Standard für:
- **Anforderungen** an Kabel- und Kabelbaumkonfektionierung
- **Akzeptanzkriterien** für Qualitätsprüfung
- **Produktionsverfahren** für Crimp, Löt, Schirmanschluss

Der Standard definiert **drei Produktklassen** mit unterschiedlichen Anforderungsniveaus:

| Klasse | Bezeichnung | Typische Anwendung |
|--------|-------------|-------------------|
| **Klasse 1** | Allgemeine Elektronik | Consumer-Produkte |
| **Klasse 2** | Gebrauchselektronik | Industrielle Anwendungen |
| **Klasse 3** | Hochzuverlässigkeitselektronik | **Militär, Luft- und Raumfahrt, Medizin** |

### 7.1.2 Relevanz für VG-Produktion

Für VG-konforme Kabelgarnituren gilt ausschließlich **KLASSE 3** (höchste Anforderungen).

---

## 7.2 CRIMPKRITERIEN KLASSE 3

### 7.2.1 Bellmouth-Anforderungen

**Definition:** Bellmouth = Trichterförmige Aufweitung des Crimpbereichs an Ein- und Austritt

```
BELLMOUTH-VISUALISIERUNG
════════════════════════

KORREKT (Klasse 3):
                 ┌──────────────────────┐
        ╱        │    Crimpbereich      │        ╲
       ╱         │                      │         ╲
      ╱──────────┼──────────────────────┼──────────╲
      Bellmouth  │                      │  Bellmouth
      (Eingang)  │                      │  (Ausgang)
                 └──────────────────────┘

DEFEKT (kein Bellmouth):
                 ┌──────────────────────┐
      │──────────│                      │──────────│
      │          │    Crimpbereich      │          │
      │──────────│                      │──────────│
      ✗ Kein     │                      │  ✗ Kein
      Bellmouth  └──────────────────────┘  Bellmouth
```

### 7.2.2 Bellmouth-Kriterien (VERIFIZIERT)

```
BELLMOUTH-KRITERIEN KLASSE 3 (VERIFIZIERT)
══════════════════════════════════════════

Quelle: IPC/WHMA-A-620, SuperEngineer.net, Romtronic

DEFINITION:
Bellmouth = Trichterförmige Aufweitung des Crimpbereichs
an Ein- und Austritt, verursacht durch Crimpwerkzeug. 

ANFORDERUNGEN KLASSE 3:
┌────────────────────────────────────────────────────────────┐
│ ✓ Bellmouth MUSS an BEIDEN Enden sichtbar sein            │
│ ✓ Mindest- und Maximaldimensionen einhalten               │
│ ✓ Keine scharfen Kanten                                   │
│ ✓ Keine Risse oder Verformungen                           │
│                                                            │
│ ✗ Kein Bellmouth = DEFEKT für Klasse 3                    │
│ ✗ Zu kleiner/großer Bellmouth = DEFEKT                    │
│ ✗ Scharfe oder gerollte Kanten = DEFEKT                   │
└────────────────────────────────────────────────────────────┘
```

**✓ VERIFIZIERT** mit:
- SuperEngineer IPC-A-620: https://www.superengineer.net/blog/ipc-a-620-crimped-terminations
- Romtronic IPC Guide: https://www.romtronic.com/ipc-whma-a-620/

| Anforderung | Klasse 3 | Klasse 2 | Klasse 1 |
|-------------|----------|----------|----------|
| **Bellmouth an BEIDEN Enden** | PFLICHT | Empfohlen | Optional |
| **Sichtbar ohne Vergrößerung** | PFLICHT | — | — |
| **Keine scharfen Kanten** | PFLICHT | PFLICHT | Empfohlen |
| **Keine Risse** | PFLICHT | PFLICHT | PFLICHT |

### 7.2.3 Inspektionsloch-Anforderungen

Das Inspektionsloch (Inspection Window) dient zur Kontrolle der Litzenposition.

```
INSPEKTIONSLOCH-VISUALISIERUNG
══════════════════════════════

KORREKT (Klasse 3):
                    ┌─ Inspektionsloch
                    │
      ═══════╦══════╬══════╦═══════
      Leiter ║      ║      ║ Kontakt
      ═══════╩══════╬══════╩═══════
                    │
                    └─ Alle Litzen sichtbar ✓

DEFEKT:
      ═══════╦══════╬══════╦═══════
      Leiter ║      ║  ∅   ║ Kontakt
      ═══════╩══════╬══════╩═══════
                    │
                    └─ Keine Litzen sichtbar ✗
```

### 7.2.4 Inspektionsloch-Kriterien

| Anforderung | Klasse 3 |
|-------------|----------|
| **ALLE Litzen sichtbar** | PFLICHT |
| **Litze reicht bis zum Loch** | PFLICHT |
| **Nicht übermäßig überstehend** | PFLICHT |
| **Keine Isolierung im Crimpbereich** | PFLICHT |

---

## 7.3 CRIMP-GEOMETRIE

### 7.3.1 Crimp-Querschnitt

```
CRIMP-QUERSCHNITT – KORREKT
═══════════════════════════

Frontalansicht des Crimps:

     ┌───────────────────────┐
     │         Oberer        │
     │       Crimpbacke      │
     ├───────────────────────┤
     │ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○  │  ← Litzen (gleichmäßig verteilt)
     │ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○  │
     ├───────────────────────┤
     │       Unterer         │
     │      Crimpbacke       │
     └───────────────────────┘
     
     Crimphöhe (H)
     ←─────────→
```

### 7.3.2 Messparameter

| Parameter | Beschreibung | Prüfmittel |
|-----------|--------------|------------|
| **Crimphöhe (H)** | Vertikale Abmessung | Crimp-Mikrometer |
| **Crimpbreite (W)** | Horizontale Abmessung | Schieblehre |
| **Leiterlänge im Crimp** | Überstand | Schieblehre |

### 7.3.3 Typische Crimp-Defekte

```
DEFEKT-ÜBERSICHT
════════════════

1. UNTERCRIMP (zu wenig Kompression)
   ┌───────────────────────┐
   │                       │
   │ ○   ○   ○   ○   ○   │  ← Lücken zwischen Litzen
   │ ○   ○   ○   ○   ○   │
   └───────────────────────┘
   ✗ Zu hoher Widerstand, mechanisch instabil

2. ÜBERCRIMP (zu viel Kompression)
   ┌───────────────────────┐
   │█████████████████████│  ← Litzen gequetscht
   └───────────────────────┘
   ✗ Leiterbruch, reduzierte Stromtragfähigkeit

3. ASYMMETRIE
   ┌───────────────────────┐
   │○○○○○○              │  ← Litzen nur auf einer Seite
   │                       │
   └───────────────────────┘
   ✗ Ungleichmäßiger Kontakt

4. ISOLIERUNG IM CRIMP
   ┌───────────────────────┐
   │███ ○ ○ ○ ○ ███████│  ← Isolierung eingequetscht
   └───────────────────────┘
   ✗ Schlechter Kontakt, mögliche Unterbrechung
```

---

## 7.4 MINDESTZUGKRÄFTE

### 7.4.1 Zugprüfung nach Kontaktgröße

Die Zugprüfung ist eine **destruktive Prüfung** zur Stichprobenkontrolle.

| Kontaktgröße | AWG-Bereich | mm²-Bereich | Mindestzugkraft |
|--------------|-------------|-------------|-----------------|
| **28** | 28-30 | 0,05-0,08 | 8,9 N (2 lbf) |
| **26** | 26-28 | 0,08-0,13 | 13,3 N (3 lbf) |
| **24** | 24-26 | 0,13-0,25 | 17,8 N (4 lbf) |
| **22** | 22-24 | 0,25-0,50 | 22,2 N (5 lbf) |
| **20** | 20-22 | 0,50-0,75 | 31,1 N (7 lbf) |
| **18** | 18-20 | 0,75-1,00 | 44,5 N (10 lbf) |
| **16** | 16-18 | 1,00-1,50 | 66,7 N (15 lbf) |
| **14** | 14-16 | 1,50-2,50 | 89,0 N (20 lbf) |
| **12** | 12-14 | 2,50-4,00 | 111,2 N (25 lbf) |
| **10** | 10-12 | 4,00-6,00 | 155,7 N (35 lbf) |
| **8** | 8-10 | 6,00-10,00 | 200,2 N (45 lbf) |

### 7.4.2 Durchführung der Zugprüfung

```
ZUGPRÜFUNG – VERFAHREN
══════════════════════

PRÜFGERÄT:
☐ Zugprüfmaschine oder kalibrierte Zugwaage
☐ Geeignete Klemmen für Leiter und Kontakt

VORBEREITUNG:
1. Stichprobe entnehmen (gem. AQL-Plan)
2. Probe in Prüfvorrichtung einspannen
   - Kontakt fest fixiert
   - Leiter in Zugklemme

DURCHFÜHRUNG:
1. Kraft gleichmäßig aufbauen
2. Zuggeschwindigkeit: 25-50 mm/min
3. Kraft bis zum Versagen erhöhen
4. Maximalkraft dokumentieren

BEWERTUNG:
☐ F_max ≥ Mindestzugkraft → BESTANDEN
☐ F_max < Mindestzugkraft → NICHT BESTANDEN

VERSAGENSARTEN (dokumentieren):
• Leiter reißt vor Kontakt → OK (wenn > Grenzwert)
• Leiter zieht aus Crimp → DEFEKT
• Kontakt bricht → Materialfehler
```

---

## 7.5 WEITERE KLASSE-3-ANFORDERUNGEN

### 7.5.1 Leiterbeschädigung

| Anforderung | Klasse 3 |
|-------------|----------|
| **Alle Drähte unbeschädigt** | PFLICHT |
| **Keine Kerben oder Schnitte** | PFLICHT |
| **Keine abgetrennten Einzeldrähte** | PFLICHT |
| **Max. gebrochene Drähte** | 0% |

### 7.5.2 Verbotene Praktiken

```
VERBOTENE PRAKTIKEN – KLASSE 3
══════════════════════════════

✗ Verzinnung vor Crimp
   → Reduziert Gasbildung im Crimp
   → Kalte Lötstelle möglich
   
✗ Isolierung im Crimp
   → Verhindert metallischen Kontakt
   
✗ Nachcrimpen
   → Ungleichmäßige Kompression
   → Unsichere Geometrie
   
✗ Wiederverwenden von Kontakten
   → Verformte Crimpzone

✗ Lötmittel am Crimp
   → Versprödung durch Flussmittel
```

### 7.5.3 Dokumentationsanforderungen

| Dokument | Inhalt | Aufbewahrung |
|----------|--------|--------------|
| **Crimpprotokoll** | Crimphöhe, -breite, Werkzeug | 10 Jahre |
| **Zugprüfprotokoll** | Stichprobe, Kraft, Ergebnis | 10 Jahre |
| **Werkzeugfreigabe** | Kalibrierung, Datum | Laufend |

---

## 7.6 ABISOLIERUNG

### 7.6.1 Abisolier-Anforderungen

```
ABISOLIERUNG – KLASSE 3 ANFORDERUNGEN
═════════════════════════════════════

KORREKT:
      ╔═══════════════╗
      ║   Isolation   ║════════════════
      ╚═══════════════╝    Blanke Litze
                           (unbeschädigt)
      
      ✓ Sauberer Schnitt
      ✓ Alle Litzen intakt
      ✓ Keine Isolationsreste
      ✓ Korrekte Länge (±1 mm)

DEFEKTE:

1. Litze beschädigt:
      ╔═══════════════╗
      ║   Isolation   ║═══════╱════════
      ╚═══════════════╝    Kerbe ✗

2. Isolationsrest:
      ╔═══════════════╗════════════════
      ║   Isolation   ║███             
      ╚═══════════════╝ ↑ Rest ✗

3. Falsche Länge:
      ╔═══════════════╗
      ║   Isolation   ║═════════════════════
      ╚═══════════════╝    zu lang ✗
```

### 7.6.2 Abisolier-Checkliste

| Prüfpunkt | Klasse 3 Anforderung |
|-----------|----------------------|
| **Litzenbeschädigung** | 0 beschädigte Drähte erlaubt |
| **Isolationsreste** | Keine sichtbaren Reste |
| **Abisolierlänge** | ±1 mm vom Sollwert |
| **Schnittqualität** | Sauberer 90°-Schnitt |
| **Oxidation** | Keine sichtbare Oxidation |

---

## 7.7 LÖTVERBINDUNGEN

### 7.7.1 Lötanforderungen Klasse 3

```
LÖTVERBINDUNG – QUALITÄTSKRITERIEN
══════════════════════════════════

KORREKTE LÖTUNG:
     ┌─────────────────────────────┐
     │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
     │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │  ← Glänzend, konkav
     └─────────────────────────────┘
     
     ✓ Glänzende Oberfläche
     ✓ Konkave Hohlkehle (Filet)
     ✓ Benetzung > 90°
     ✓ Keine Poren

DEFEKTE LÖTUNGEN:

1. Kalte Lötstelle:
     ┌─────────────────────────────┐
     │  ░░░░░░░░░░░░░░░░░░░░░░░  │
     │  ░░░░▓▓▓▓░░░░░░▓▓▓▓░░░░  │  ← Matt, körnig ✗
     └─────────────────────────────┘

2. Zu viel Lot:
     ┌───────────────────────────────┐
     │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
     │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
     │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  ← Konvex, zu viel ✗
     └───────────────────────────────┘

3. Zu wenig Lot:
     ┌─────────────────────────────┐
     │        ▓▓▓▓▓                │  ← Benetzung < 90° ✗
     └─────────────────────────────┘
```

### 7.7.2 Lötparameter

| Parameter | Empfohlener Wert |
|-----------|------------------|
| **Lötkolbentemperatur** | 320-380°C |
| **Lötzeit** | 2-4 Sekunden |
| **Lotlegierung** | Sn63Pb37 oder bleifrei |
| **Flussmittel** | RMA oder ROL0 |
| **Vorheizen** | Optional, bei großen Teilen |

---

## 7.8 SCHIRMUNG

### 7.8.1 Schirmanschluss – 360°-Kontakt

```
SCHIRMVERBINDUNG – KLASSE 3
═══════════════════════════

ANFORDERUNG:
360° Kontakt zwischen Geflecht und Backshell/Ferrule

KORREKT:
    ┌──────────────────────────────┐
    │ ╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱ │ ← Geflecht 360° um
    │ ╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲ │    Crimphülse gelegt
    │ ╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱ │
    └──────────────────────────────┘
    
    ✓ Mindestens 270° Abdeckung (360° bevorzugt)
    ✓ Keine Lücken > 30°
    ✓ Geflecht nicht beschädigt

DEFEKT:
    ┌──────────────────────────────┐
    │ ╱╱╱╱╱╱╱╱╱╱          ╱╱╱╱╱╱ │ ← Lücke > 30° ✗
    │ ╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲ │
    └──────────────────────────────┘
```

### 7.8.2 Schirm-Prüfkriterien

| Anforderung | Klasse 3 |
|-------------|----------|
| **Mindestabdeckung** | ≥ 270° (360° bevorzugt) |
| **Max. Lücke** | < 30° |
| **Geflecht unbeschädigt** | PFLICHT |
| **DC-Widerstand** | < 1 Ω über Gesamtlänge |

---

## 7.9 SICHTPRÜFUNG

### 7.9.1 Vergrößerungsstufen

| Prüfaufgabe | Empfohlene Vergrößerung |
|-------------|------------------------|
| **Übersichtsprüfung** | 1× (ohne Vergrößerung) |
| **Crimpkontrolle** | 4× - 10× |
| **Lötstellenprüfung** | 10× - 20× |
| **Litzenprüfung** | 10× - 40× |

### 7.9.2 Beleuchtung

```
BELEUCHTUNGSANFORDERUNGEN
═════════════════════════

☐ Mindestens 1000 Lux am Prüfplatz
☐ Schattenfreie Ausleuchtung
☐ Kaltlichtquelle bevorzugt
☐ Keine Blendung

EMPFOHLEN:
• Ringbeleuchtung um Lupe/Mikroskop
• LED-Arbeitsplatzleuchte
• Schwenkbare Beleuchtung
```

---

## 7.10 WERKZEUGQUALIFIZIERUNG

### 7.10.1 Crimpwerkzeug-Anforderungen

| Anforderung | Intervall | Dokumentation |
|-------------|-----------|---------------|
| **Kalibrierung** | Alle 12 Monate | Zertifikat |
| **Verschleißprüfung** | Täglich (Sichtkontrolle) | Checkliste |
| **Austausch Crimpbacken** | Nach 50.000-100.000 Crimps | Lebenslaufakte |

### 7.10.2 First-Article-Prüfung

```
FIRST-ARTICLE-PRÜFUNG (ERSTMUSTERPRÜFUNG)
═════════════════════════════════════════

BEI SCHICHTBEGINN:
☐ Erste 3-5 Crimps mit vollständiger Prüfung
☐ Crimphöhe messen und dokumentieren
☐ Sichtprüfung (Bellmouth, Inspektionsloch)
☐ Zugprüfung (1 Stück destruktiv)

FREIGABE:
☐ Alle Prüfungen bestanden → Serienfreigabe
☐ Eine Prüfung nicht bestanden → Werkzeug prüfen/justieren

DOKUMENTATION:
☐ Datum, Uhrzeit, Mitarbeiter
☐ Werkzeug-ID
☐ Messwerte
☐ Freigabe-Unterschrift
```

---

## 7.11 FEHLERSAMMELKARTE

### 7.11.1 Typische Fehler und Ursachen

| Fehlerart | Mögliche Ursache | Korrekturmaßnahme |
|-----------|------------------|-------------------|
| **Kein Bellmouth** | Werkzeug falsch eingestellt | Crimpbacken justieren |
| **Litzen im Inspektionsloch nicht sichtbar** | Abisolierlänge zu kurz | Abisoliermaß prüfen |
| **Litzen beschädigt** | Abisolierwerkzeug stumpf | Messer wechseln |
| **Crimp zu hoch** | Untercrimp | Werkzeugeinstellung |
| **Crimp zu niedrig** | Übercrimp | Werkzeugeinstellung |
| **Kalte Lötstelle** | Temperatur zu niedrig | Löttemperatur erhöhen |
| **Schirmung nicht 360°** | Falsche Technik | Mitarbeiterschulung |

---

## 7.12 SCHULUNGSANFORDERUNGEN

### 7.12.1 Qualifikationsmatrix

| Tätigkeit | Schulung | Zertifizierung | Nachschulung |
|-----------|----------|----------------|--------------|
| **Crimpen** | IPC-A-620 Kurs | IPC-A-620 CIS | Alle 2 Jahre |
| **Löten** | IPC-A-610/620 Kurs | IPC-A-610 CIS | Alle 2 Jahre |
| **Inspektion** | IPC-A-620 Kurs | IPC-A-620 CIS | Alle 2 Jahre |

### 7.12.2 Kompetenznachweis

```
QUALIFIKATIONSNACHWEIS – ANFORDERUNGEN
══════════════════════════════════════

ERSTSCHULUNG:
☐ Theoretische Schulung (8-16 Stunden)
☐ Praktische Übungen
☐ Schriftliche Prüfung (≥ 70%)
☐ Praktische Prüfung
☐ Zertifikatsausstellung

NACHSCHULUNG (alle 2 Jahre):
☐ Auffrischungskurs (4-8 Stunden)
☐ Re-Zertifizierung

DOKUMENTATION:
☐ Schulungszertifikat
☐ Qualifikationsmatrix
☐ Personalakte
```

---

## 7.13 SCHNELLREFERENZ

### 7.13.1 Klasse-3-Checkliste Crimp

```
CRIMP-PRÜFUNG KLASSE 3 – KURZFASSUNG
════════════════════════════════════

☐ Bellmouth an BEIDEN Enden sichtbar
☐ ALLE Litzen im Inspektionsloch sichtbar
☐ Keine beschädigten Drähte
☐ Keine Isolierung im Crimpbereich
☐ Crimphöhe innerhalb Toleranz
☐ Crimpbreite innerhalb Toleranz
☐ Keine scharfen Kanten
☐ Zugkraft ≥ Mindestwert (Stichprobe)
```

### 7.13.2 Verbotene Praktiken – Kurzübersicht

```
✗ Verzinnung vor Crimp
✗ Isolierung im Crimp
✗ Nachcrimpen
✗ Wiederverwendung von Kontakten
✗ Lötmittel am Crimp
✗ Beschädigte Litzen
✗ Falsches Werkzeug
```

---

**ENDE TEIL 7 – IPC/WHMA-A-620 PRODUKTIONSVERFAHREN**

*Weiter mit TEIL 8: Qualitätsmanagement*
