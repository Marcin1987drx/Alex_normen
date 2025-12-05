# PRODUKTIONSHANDBUCH VG NORMEN
## TEIL 8: QUALITÄTSMANAGEMENT

---

**Version:** 1.0  
**Datum:** Dezember 2025  
**Geltungsbereich:** Qualitätssicherung bei VG-konformer Kabelproduktion

---

## 8.1 ÜBERSICHT QUALITÄTSSYSTEM

### 8.1.1 Anforderungen an das Qualitätsmanagementsystem

Für die Produktion von VG-konformen Kabelgarnituren sind folgende Standards relevant:

| Standard | Beschreibung | Anwendung |
|----------|--------------|-----------|
| **ISO 9001:2015** | Qualitätsmanagementsystem | Basis für alle Prozesse |
| **EN 9100** | Luft- und Raumfahrt QMS | Bei Aerospace-Anwendungen |
| **AQAP 2110** | NATO-Qualitätssicherung | Militärische Beschaffung |
| **VG 95212** | Zulassungsregister | BAAINBw-Zulassung |

### 8.1.2 Qualitätspyramide

```
QUALITÄTSPYRAMIDE
═════════════════

                    ┌───────────┐
                    │   Audit   │
                    │  (extern) │
                    └─────┬─────┘
                          │
                ┌─────────┴─────────┐
                │ Endprüfung (100%) │
                └─────────┬─────────┘
                          │
          ┌───────────────┴───────────────┐
          │ Zwischenprüfung (Stichprobe)  │
          └───────────────┬───────────────┘
                          │
    ┌─────────────────────┴─────────────────────┐
    │       Fertigungsbegleitende Prüfung       │
    │            (Werkerselbstprüfung)           │
    └─────────────────────┬─────────────────────┘
                          │
  ┌───────────────────────┴───────────────────────┐
  │          Wareneingangsprüfung (WE)            │
  └───────────────────────────────────────────────┘
```

---

## 8.2 WARENEINGANGSPRÜFUNG (WE)

### 8.2.1 Prüfumfang nach Komponentenart

| Komponente | Dokumentenprüfung | Sichtprüfung | Maßprüfung | Elektrische Prüfung |
|------------|-------------------|--------------|------------|---------------------|
| **Leitungen (VG 95218)** | 100% | 100% | Stichprobe | Bei Verdacht |
| **Steckverbinder (VG 95319)** | 100% | 100% | Stichprobe | — |
| **Kontakte (VG 95319-1009)** | 100% | Stichprobe | Stichprobe | — |
| **Schrumpfschläuche (VG 95343)** | 100% | 100% | Stichprobe | — |
| **Geflecht (VG 96936)** | 100% | 100% | Stichprobe | — |

### 8.2.2 Dokumentenprüfung

```
DOKUMENTENPRÜFUNG – CHECKLISTE
══════════════════════════════

☐ Lieferschein vorhanden und vollständig
☐ Materialzertifikat 3.1 vorhanden
☐ Konformitätserklärung (VG-Norm angegeben)
☐ Chargennummer/Losnummer dokumentiert
☐ RoHS-Erklärung vorhanden
☐ Haltbarkeitsdatum geprüft (falls angegeben)
☐ Menge entspricht Bestellung

ERGEBNIS:
☐ Alle Dokumente OK → Weiter zu Sichtprüfung
☐ Dokument fehlt → Lieferant kontaktieren
```

### 8.2.3 Sichtprüfung

| Prüfpunkt | Akzeptabel | Ablehngrund |
|-----------|------------|-------------|
| **Verpackung** | Unbeschädigt | Beschädigt, nass |
| **Beschriftung** | Lesbar, korrekt | Unleserlich, falsch |
| **Farbe** | Entspricht Bestellung | Abweichend |
| **Oberfläche** | Glatt, gleichmäßig | Kratzer, Verfärbung |
| **Form** | Gerade, nicht geknickt | Knicke, Verformung |

### 8.2.4 Entscheidungsmatrix

```
WARENEINGANGSENTSCHEIDUNG
═════════════════════════

         ┌─────────────────┐
         │ Dokumentenprüfung│
         └────────┬────────┘
                  │
         ┌────────▼────────┐
   OK────│ Sichtprüfung    │────NICHT OK
   │     └────────┬────────┘        │
   │              │                 │
   │     ┌────────▼────────┐        │
   │ OK──│ Maßprüfung      │──NOK   │
   │ │   └────────┬────────┘   │    │
   │ │            │            │    │
   │ │   ┌────────▼────────┐   │    │
   │ │   │ FREIGEGEBEN     │   │    │
   │ │   │ für Produktion  │   │    │
   │ │   └─────────────────┘   │    │
   │ │                         │    │
   │ └────────┬────────────────┘    │
   │          │                     │
   │   ┌──────▼──────┐              │
   │   │ GESPERRT    │◄─────────────┘
   │   │ Reklamation │
   │   └─────────────┘
```

---

## 8.3 FERTIGUNGSBEGLEITENDE PRÜFUNG

### 8.3.1 Werkerselbstprüfung

Jeder Produktionsmitarbeiter führt während der Arbeit Selbstprüfungen durch.

```
WERKERSELBSTPRÜFUNG – ABLAUF
════════════════════════════

VOR ARBEITSBEGINN:
☐ Arbeitsanweisung gelesen und verstanden
☐ Werkzeuge kalibriert/geprüft
☐ Materialien bereitgestellt und identifiziert
☐ First-Article-Prüfung durchgeführt

WÄHREND DER ARBEIT:
☐ Sichtprüfung nach jedem Arbeitsschritt
☐ Maßprüfung bei kritischen Merkmalen
☐ Auffälligkeiten sofort melden

BEI SCHICHTENDE:
☐ Werkzeuge reinigen und lagern
☐ Dokumentation vollständig
☐ Übergabe an Folgeschicht
```

### 8.3.2 First-Article-Prüfung (Erstmuster)

| Zeitpunkt | Prüfumfang | Dokumentation |
|-----------|------------|---------------|
| **Schichtbeginn** | Erste 3-5 Stück vollständig | Erstmusterprotokoll |
| **Nach Werkzeugwechsel** | Erste 3-5 Stück vollständig | Erstmusterprotokoll |
| **Nach Unterbrechung > 4h** | Erste 3 Stück | Vermerk im Fertigungsbegleitblatt |

---

## 8.4 ZWISCHENPRÜFUNG

### 8.4.1 Crimp-Prüfung

```
CRIMP-PRÜFUNG – VERFAHREN
═════════════════════════

STICHPROBE (nach AQL-Plan):
☐ Sichtprüfung mit Vergrößerung (10×)
   - Bellmouth vorhanden?
   - Inspektionsloch: Litzen sichtbar?
   - Keine beschädigten Drähte?
   
☐ Maßprüfung
   - Crimphöhe mit Mikrometer
   - Wert dokumentieren

☐ Zugprüfung (destruktiv, 1 Stück/Los)
   - Kraft dokumentieren
   - Vergleich mit Mindestwert

ERGEBNIS:
☐ Alle Prüfungen OK → Weiterproduktion
☐ Eine Prüfung NOK → Stopp, Ursachenanalyse
```

### 8.4.2 Prüfhäufigkeit

| Prüfung | Häufigkeit | Dokumentation |
|---------|------------|---------------|
| **Sichtprüfung Crimp** | 100% | Fertigungsbegleitblatt |
| **Maßprüfung Crimphöhe** | Jedes 25. Stück | Prüfprotokoll |
| **Zugprüfung** | 1× pro Los | Zugprüfprotokoll |
| **Abisolierlänge** | Stichprobe | Fertigungsbegleitblatt |

---

## 8.5 ENDPRÜFUNG

### 8.5.1 Elektrische Endprüfung

```
ELEKTRISCHE ENDPRÜFUNG – 100%
═════════════════════════════

TEST 1: DURCHGANGSPRÜFUNG (Continuity)
☐ Alle Adern einzeln prüfen
☐ Widerstand < Grenzwert (gem. Länge und Querschnitt)
☐ Kontaktwiderstand < 10 mΩ
→ Protokoll: Messwert jeder Ader

TEST 2: ISOLATIONSPRÜFUNG (Insulation)
☐ Alle Adern vs. Schirm: > 100 MΩ @ 500V DC
☐ Ader vs. Ader: > 100 MΩ @ 500V DC
→ Protokoll: Messwert

TEST 3: HOCHSPANNUNGSPRÜFUNG (Hipot)
☐ System 25/100: 1050V AC, 60s, < 2 mA
☐ System 200: 1500V AC, 60s, < 1 mA
☐ Kein Durchschlag
→ Protokoll: Prüfspannung, Strom, Dauer, Ergebnis

ERGEBNIS:
☐ Alle Tests bestanden → Freigabe
☐ Ein Test nicht bestanden → Aussonderung
```

### 8.5.2 Sicht- und Maßprüfung Endprodukt

| Prüfpunkt | Anforderung | Prüfmittel |
|-----------|-------------|------------|
| **Gesamtlänge** | ±2% oder ±5 mm | Stahllineal |
| **Beschriftung** | Lesbar, korrekt | Sichtprüfung |
| **Stecker-Zustand** | Unbeschädigt | Sichtprüfung |
| **Schrumpfschläuche** | Vollständig geschrumpft | Sichtprüfung |
| **Schirmung** | 360° Kontakt | Sichtprüfung |

---

## 8.6 PRÜFMITTELÜBERWACHUNG

### 8.6.1 Kalibrierintervalle

| Prüfmittel | Kalibrierintervall | Prüflabor |
|------------|-------------------|-----------|
| **Multimeter** | 12 Monate | DAkkS-akkreditiert |
| **Megaohmmeter** | 12 Monate | DAkkS-akkreditiert |
| **Hipot-Tester** | 12 Monate | DAkkS-akkreditiert |
| **Crimp-Mikrometer** | 12 Monate | DAkkS-akkreditiert |
| **Zugprüfmaschine** | 12 Monate | DAkkS-akkreditiert |
| **Schieblehre** | 12 Monate | Intern möglich |
| **Crimpwerkzeug** | Nach Herstellerangabe | Hersteller |

### 8.6.2 Prüfmittelkarte

```
PRÜFMITTELKARTE
═══════════════

Gerät:         ________________________________________________
Inventar-Nr.:  ________________  Standort: ____________________
Hersteller:    ________________  Typ: _________________________
Seriennummer:  ________________  Genauigkeit: _________________

KALIBRIERHISTORIE:
┌──────────────┬────────────────┬───────────────┬─────────────┐
│ Datum        │ Ergebnis       │ Nächste Kal.  │ Unterschrift│
├──────────────┼────────────────┼───────────────┼─────────────┤
│              │ OK / NOK       │               │             │
├──────────────┼────────────────┼───────────────┼─────────────┤
│              │ OK / NOK       │               │             │
├──────────────┼────────────────┼───────────────┼─────────────┤
│              │ OK / NOK       │               │             │
└──────────────┴────────────────┴───────────────┴─────────────┘
```

---

## 8.7 FEHLERMANAGEMENT

### 8.7.1 Fehlerklassifizierung

| Klasse | Bezeichnung | Definition | Konsequenz |
|--------|-------------|------------|------------|
| **Kritisch** | Sicherheitsrelevant | Gefahr für Personen, Totalausfall | Sofortige Sperrung, 100% Nachprüfung |
| **Hauptfehler** | Funktionsbeeinträchtigung | Gerät funktioniert nicht richtig | Aussonderung oder Nacharbeit |
| **Nebenfehler** | Optisch | Keine Funktionsbeeinträchtigung | Dokumentation, ggf. Sonderfreigabe |

### 8.7.2 Fehlerbehandlung

```
FEHLERBEHANDLUNG – ABLAUF
═════════════════════════

FEHLER ENTDECKT
      │
      ▼
┌─────────────────────┐
│ 1. SOFORT STOPPEN   │  ← Produktion unterbrechen
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│ 2. KENNZEICHNEN     │  ← Rote Karte/Sperrmarke
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│ 3. SEPARIEREN       │  ← In Sperrbereich legen
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│ 4. DOKUMENTIEREN    │  ← Fehlerart, Menge, Zeit
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│ 5. MELDEN           │  ← QS-Abteilung informieren
└──────────┬──────────┘
           │
           ▼
    QS ENTSCHEIDUNG:
    ├── Nacharbeit möglich → Nacharbeitsanweisung
    ├── Nacharbeit nicht möglich → Verschrottung
    └── Sonderfreigabe prüfen → Genehmigungsverfahren
```

### 8.7.3 8D-Report

Bei wiederkehrenden oder schwerwiegenden Fehlern wird ein 8D-Report erstellt:

| Schritt | Bezeichnung | Inhalt |
|---------|-------------|--------|
| **D1** | Team bilden | Verantwortliche benennen |
| **D2** | Problem beschreiben | Was, wann, wo, wie viele |
| **D3** | Sofortmaßnahmen | Schadensbegrenzung |
| **D4** | Ursachenanalyse | 5-Why, Ishikawa |
| **D5** | Korrekturmaßnahmen | Dauerhaft abstellen |
| **D6** | Wirksamkeit prüfen | Nachverfolgung |
| **D7** | Vorbeugung | Wiederholung verhindern |
| **D8** | Abschluss | Dokumentation, Lob |

---

## 8.8 RÜCKVERFOLGBARKEIT

### 8.8.1 Rückverfolgbarkeitskette

```
RÜCKVERFOLGBARKEIT
══════════════════

ROHMATERIAL
│   └─ Hersteller-Chargennummer
│   └─ Materialzertifikat 3.1
│   └─ WE-Protokoll-Nr.
│
▼
FERTIGUNG
│   └─ Fertigungsauftragsnummer
│   └─ Datum/Uhrzeit
│   └─ Arbeitsplatz/Maschine
│   └─ Mitarbeiter-ID
│
▼
PRÜFUNG
│   └─ Prüfprotokoll-Nr.
│   └─ Prüfergebnis
│   └─ Prüfer-ID
│
▼
VERSAND
    └─ Lieferschein-Nr.
    └─ Seriennummer Endprodukt
    └─ Kundennummer
```

### 8.8.2 Kennzeichnungspflicht

| Element | Kennzeichnung | Methode |
|---------|---------------|---------|
| **Leitung** | Chargennummer | Etikett auf Trommel |
| **Steckverbinder** | Teilenummer, Charge | Verpackung |
| **Fertige Garnitur** | Seriennummer, Auftragsnummer | Kabelmarker/Etikett |
| **Prüfprotokoll** | Protokoll-Nr., Garnitur-ID | Papier/Digital |

---

## 8.9 DOKUMENTENAUFBEWAHRUNG

### 8.9.1 Aufbewahrungsfristen

| Dokumentart | Aufbewahrungsfrist | Format |
|-------------|-------------------|--------|
| **Materialzertifikate** | 10 Jahre | Papier/Digital |
| **Prüfprotokolle** | 10 Jahre | Papier/Digital |
| **Fertigungsbegleitblätter** | 10 Jahre | Papier/Digital |
| **Kalibrierzertifikate** | 10 Jahre | Papier |
| **Reklamationsunterlagen** | 10 Jahre | Papier/Digital |
| **Schulungsnachweise** | Dauer Beschäftigung + 5 Jahre | Personalakte |

### 8.9.2 Archivierung

```
ARCHIVIERUNGSHINWEISE
═════════════════════

☐ Dokumente chronologisch ordnen
☐ Auftragsnummer als Hauptordnungskriterium
☐ Jährliche Archivierung abgeschlossener Aufträge
☐ Zugriffsschutz für vertrauliche Unterlagen
☐ Backup bei digitalen Dokumenten
☐ Vernichtung nur nach Ablauf der Aufbewahrungsfrist
☐ Vernichtungsprotokoll erstellen
```

---

## 8.10 LIEFERANTENMANAGEMENT

### 8.10.1 Lieferantenbewertung

| Kriterium | Gewichtung | Bewertungsskala |
|-----------|------------|-----------------|
| **Produktqualität** | 40% | 1-5 Punkte |
| **Liefertreue** | 25% | 1-5 Punkte |
| **Dokumentation** | 15% | 1-5 Punkte |
| **Preis-Leistung** | 10% | 1-5 Punkte |
| **Service/Support** | 10% | 1-5 Punkte |

### 8.10.2 Lieferantenklassifizierung

| Gesamtpunktzahl | Klasse | Status |
|-----------------|--------|--------|
| 4,5 - 5,0 | A | Bevorzugter Lieferant |
| 3,5 - 4,4 | B | Qualifizierter Lieferant |
| 2,5 - 3,4 | C | Unter Beobachtung |
| < 2,5 | D | Gesperrt |

---

## 8.11 KONTINUIERLICHE VERBESSERUNG

### 8.11.1 PDCA-Zyklus

```
PDCA-ZYKLUS
═══════════

         ┌─────────────────┐
         │      PLAN       │
         │   (Planen)      │
         └────────┬────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
    ▼             │             ▼
┌────────┐        │        ┌────────┐
│  ACT   │        │        │   DO   │
│(Handeln)│◄──────┴───────►│(Umsetzen)│
└────────┘                 └────────┘
    ▲                           │
    │                           │
    │      ┌─────────────┐      │
    │      │    CHECK    │      │
    └──────│  (Prüfen)   │◄─────┘
           └─────────────┘
```

### 8.11.2 Kennzahlen (KPIs)

| Kennzahl | Berechnung | Zielwert |
|----------|------------|----------|
| **Ausschussrate** | Ausschuss / Gesamtmenge × 100% | < 2% |
| **Nacharbeitsrate** | Nacharbeit / Gesamtmenge × 100% | < 5% |
| **Lieferqualität** | Fehlerfreie Lieferungen / Alle Lieferungen × 100% | ≥ 98% |
| **First-Pass-Yield** | OK beim ersten Mal / Gesamtmenge × 100% | ≥ 95% |
| **Reklamationsquote** | Reklamationen / Lieferungen × 100% | < 1% |

---

## 8.12 AUDIT-VORBEREITUNG

### 8.12.1 Audit-Checkliste

```
AUDIT-VORBEREITUNG – CHECKLISTE
═══════════════════════════════

DOKUMENTATION:
☐ Qualitätshandbuch aktuell?
☐ Verfahrensanweisungen verfügbar?
☐ Arbeitsanweisungen am Arbeitsplatz?
☐ Prüfprotokolle vollständig?
☐ Kalibrierzertifikate gültig?

PRODUKTION:
☐ Arbeitsplätze sauber und ordentlich?
☐ Prüfmittel gekennzeichnet und kalibriert?
☐ Gesperrtes Material separiert?
☐ Kennzeichnung der Produkte?

PERSONAL:
☐ Schulungsnachweise aktuell?
☐ Zuständigkeiten definiert?
☐ Mitarbeiter informiert?

FERTIG:
☐ Ansprechpartner benannt?
☐ Besprechungsraum reserviert?
☐ Audit-Programm verteilt?
```

---

**ENDE TEIL 8 – QUALITÄTSMANAGEMENT**

*Weiter mit TEIL 9: AQL Stichprobenplan (ISO 2859-1)*
