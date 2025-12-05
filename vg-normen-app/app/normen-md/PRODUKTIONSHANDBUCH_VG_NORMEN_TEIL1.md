# PRODUKTIONSHANDBUCH VG NORMEN
## TEIL 1: EINFÜHRUNG UND ÜBERSICHT

---

**Version:** 1.0  
**Datum:** Dezember 2025  
**Status:** Gültig für Produktion  
**Geltungsbereich:** Militärische Kabel- und Leitungsproduktion nach VG-Normen

---

## 1.1 ZWECK DIESES HANDBUCHS

Dieses Produktionshandbuch dient als **umfassende Referenz** für alle Mitarbeiter, die an der Herstellung, Prüfung und Qualitätskontrolle von militärischen Kabelgarnituren nach VG-Normen beteiligt sind.

### Zielgruppen:
- **Produktionsmitarbeiter** – Montage, Crimp, Löten, Schrumpfen
- **Qualitätsprüfer** – Eingangs-, Zwischen- und Endprüfung
- **Fertigungsleiter** – Prozessüberwachung
- **Technische Einkäufer** – Komponentenbeschaffung
- **Kunden und Auditoren** – Referenzdokumentation

---

## 1.2 STRUKTUR DES HANDBUCHS

```
HANDBUCH-STRUKTUR
═════════════════

TEIL 1:  Einführung und Übersicht (dieses Dokument)
         │
TEIL 2:  VG 95218 – Drähte und Leitungen
         │   └── Typen A, E, G, H
         │   └── Querschnitte, Widerstände, Temperaturen
         │
TEIL 3:  VG 96927 – Kabelgarnituren
         │   └── Temperatursysteme 25, 100, 200
         │   └── Elektrische Prüfungen
         │   └── Brandverhalten
         │
TEIL 4:  VG 95319 – Steckverbinder
         │   └── Baugrößen und Kontaktanordnungen
         │   └── Crimpspezifikationen
         │   └── MIL-SPEC Kompatibilität
         │
TEIL 5:  VG 96936 – Abschirmung (Geflechte)
         │   └── EMI/RFI-Schutz
         │   └── Materialspezifikationen
         │
TEIL 6:  VG 95343 – Schrumpfschläuche
         │   └── Typen A bis H
         │   └── Schrumpftemperaturen
         │
TEIL 7:  IPC/WHMA-A-620 – Produktionsverfahren
         │   └── Crimpkriterien Klasse 3
         │   └── Mindestzugkräfte
         │
TEIL 8:  Qualitätsmanagement
         │   └── Prozessqualifizierung
         │   └── Fertigungsüberwachung
         │
TEIL 9:  AQL Stichprobenplan (ISO 2859-1)
         │   └── Prüfniveaus
         │   └── Stichprobentabellen
         │
TEIL 10: Prüfkarten und Formulare
         └── Wareneingangsprüfung
         └── Fertigungsbegleitblätter
         └── Endprüfprotokolle
```

---

## 1.3 VG-NORMENSYSTEM – HIERARCHIE

### 1.3.1 Was sind VG-Normen?

**VG** = **Verteidigungsgeräte** (Defense Equipment Standards)

VG-Normen sind deutsche Militärstandards, herausgegeben vom **BAAINBw** (Bundesamt für Ausrüstung, Informationstechnik und Nutzung der Bundeswehr). Sie definieren Anforderungen für:

- Kabel und Leitungen
- Steckverbinder
- Kabelgarnituren
- Zubehör (Schläuche, Geflechte)

### 1.3.2 Hierarchische Struktur

```
VG-NORMEN HIERARCHIE
════════════════════

OBERSTE EBENE: Grundnormen
├── VG 95218-2    Fachgrundnorm für Kabel und Leitungen
├── VG 96927-2    Generischer Standard für Kabelgarnituren
└── VG 95319-100  Fachgrundnorm für Steckverbinder

MITTLERE EBENE: Detailnormen
├── VG 95218-20   Einadrige Leitungen (Type A, E, G, H)
├── VG 95218-21   Einadrige Leitungen (Spezialtypen)
├── VG 96927-12   2-Ader Kabelgarnituren
├── VG 96927-15   5-Ader Kabelgarnituren
├── VG 96927-17   7-Ader Kabelgarnituren
├── VG 95319-1006 Rundsteckverbinder (Gewindekupplung)
├── VG 95319-1007 Rundsteckverbinder (Bajonettkupplung)
└── VG 95319-1009 Kontakte (Crimp/Löt)

UNTERE EBENE: Zugehörige Normen
├── VG 95343      Schrumpfschläuche und Formteile
├── VG 96936      Abschirmgeflechte und Schutzschläuche
└── VG 95212      Zulassungsregister
```

---

## 1.4 TEMPERATURSYSTEME – ÜBERSICHT

Die VG-Normen definieren drei Haupttemperatursysteme für unterschiedliche Einsatzbedingungen:

### 1.4.1 Vergleichstabelle der Systeme

| Parameter | **System 25** | **System 100** | **System 200** |
|-----------|---------------|----------------|----------------|
| **Bezeichnung** | FR (Flame Retardant) | LFH (Low Fire Hazard) | HFR (High Flame Retardant) |
| **Betriebstemperatur** | -75°C bis +150°C | -40°C bis +105°C | -55°C bis +200°C |
| **Kurzzeitgrenze** | +200°C (5 min) | +125°C (1h) | +250°C (5 min) |
| **Halogenfrei** | Nein | **Ja (LSZH)** | Nein |
| **Hauptanwendung** | Fahrzeuge, Flugzeuge | Schiffe, U-Boote, Bahn | Triebwerke, Aerospace |

### 1.4.2 Entscheidungshilfe Systemauswahl

```
SYSTEMAUSWAHL – ENTSCHEIDUNGSBAUM
═════════════════════════════════

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

---

## 1.5 ZUGELASSENE HERSTELLER

Für VG-Produkte sind nur zugelassene Hersteller (QPL – Qualified Products List) zu verwenden.

### 1.5.1 Hauptlieferanten

| Hersteller | Produktbereich | Zulassung |
|------------|----------------|-----------|
| **TE Connectivity / Raychem** | Leitungen, Schrumpfschläuche | BAAINBw |
| **Amphenol-Air LB** | Steckverbinder, Kontakte | BAAINBw |
| **Prysmian Group** | Kabel und Leitungen | BAAINBw |
| **HellermannTyton** | Geflechte, Schrumpfschläuche | BAAINBw |
| **Glenair** | Steckverbinder, Backshells | MIL-QPL |
| **Habia Cables** | Spezialkabel | BAAINBw |
| **MIL Kabel Systems** | VG-konforme Kabel | BAAINBw |

### 1.5.2 Bezugsquellen für Normentexte

| Quelle | URL | Anmerkung |
|--------|-----|-----------|
| DIN Media | www.dinmedia.de | Offizielle VG-Normen |
| AFNOR | www.boutique.afnor.org | Internationale Ausgaben |
| GlobalSpec | standards.globalspec.com | Recherche und Übersicht |
| Intertek Inform | www.intertekinform.com | Aktuelle Ausgaben |

---

## 1.6 MIL-SPEC KOMPATIBILITÄT

VG-Normen sind weitgehend kompatibel mit US-amerikanischen MIL-Specifications:

### 1.6.1 Kreuzreferenz VG – MIL

| VG-Norm | MIL-SPEC Äquivalent | Produktbereich |
|---------|---------------------|----------------|
| VG 95218 | MIL-DTL-22759 | Leitungen |
| VG 96927 | MIL-DTL-27500 | Kabelgarnituren |
| VG 95319-1006 | MIL-DTL-38999 Series III | Rundsteckverbinder |
| VG 95319-1007 | MIL-DTL-38999 Series I/II | Bajonettsteckverbinder |
| VG 95319-1009 | MIL-PRF-29504 | Crimpkontakte |
| VG 95343 | MIL-DTL-23053 | Schrumpfschläuche |
| VG 96936 | — | Abschirmgeflechte |

---

## 1.7 ZULASSUNGSVERFAHREN

### 1.7.1 Prozessübersicht

```
ZULASSUNGSPROZESS FÜR VG-PRODUKTE
═════════════════════════════════

1. ERSTPRÜFUNG
   │
   ├── Laborprüfung der Muster
   ├── Vor-Ort-Audit durch VDE
   └── Typenprüfung (Grundtypen)

2. TEMPORÄRE ZULASSUNG
   │
   ├── Gültig für 2 Jahre
   └── Produktionsüberwachung

3. DAUERHAFTE ZULASSUNG
   │
   ├── Eintragung in VG 95212 Register
   └── Regelmäßige Requalifizierung (alle 3-5 Jahre)

ZERTIFIZIERUNGSSTELLE:
VDE Prüf- und Zertifizierungsinstitut
```

---

## 1.8 DOKUMENTATIONSANFORDERUNGEN

### 1.8.1 Pflichtdokumentation

Für jede Lieferung von VG-Produkten sind folgende Dokumente erforderlich:

| Dokument | Inhalt | Aufbewahrung |
|----------|--------|--------------|
| **Materialzertifikat 3.1** | Prüfergebnisse, Chargennummer | 10 Jahre |
| **Konformitätserklärung** | Übereinstimmung mit VG-Norm | 10 Jahre |
| **Prüfprotokoll** | Elektrische/mechanische Werte | 10 Jahre |
| **Rückverfolgbarkeit** | Los-/Chargennummer | 10 Jahre |

### 1.8.2 Rückverfolgbarkeit (Traceability)

```
RÜCKVERFOLGBARKEITSKETTE
════════════════════════

Rohstoff (Kupfer, Isolierung)
    │
    └── Losnummer Hersteller
            │
            └── Chargennummer Leitung
                    │
                    └── Fertigungsauftrag Garnitur
                            │
                            └── Prüfprotokoll
                                    │
                                    └── Lieferschein Kunde
                                            │
                                            └── Seriennummer Endgerät

⚠️ Jeder Schritt muss dokumentiert und 10 Jahre 
   aufbewahrt werden!
```

---

## 1.9 SYMBOLE UND ABKÜRZUNGEN

### 1.9.1 Allgemeine Abkürzungen

| Abkürzung | Bedeutung |
|-----------|-----------|
| **VG** | Verteidigungsgeräte (Defense Equipment) |
| **BAAINBw** | Bundesamt für Ausrüstung der Bundeswehr |
| **QPL** | Qualified Products List |
| **FR** | Flame Retardant (flammhemmend) |
| **LFH** | Low Fire Hazard (halogenfrei) |
| **HFR** | High Flame Retardant |
| **LSZH** | Low Smoke Zero Halogen |
| **EMI** | Electromagnetic Interference |
| **RFI** | Radio Frequency Interference |
| **AQL** | Acceptable Quality Level |
| **Hipot** | High Potential Test (Spannungsprüfung) |

### 1.9.2 Prüfsymbole

| Symbol | Bedeutung |
|--------|-----------|
| ✓ | Bestanden / OK |
| ✗ | Nicht bestanden / NOK |
| ⚠️ | Warnung / Achtung |
| ☐ | Prüfpunkt (auszufüllen) |

---

## 1.10 KONTAKTE UND SUPPORT

### 1.10.1 Technische Anfragen

| Bereich | Kontakt |
|---------|---------|
| **Normenauskunft** | DIN Media: info@dinmedia.de |
| **Zulassungsfragen** | VDE Prüfinstitut |
| **Technischer Support** | Jeweiliger Komponentenhersteller |

### 1.10.2 Nützliche Weblinks

- **VG-Normen kaufen:** www.dinmedia.de
- **GlobalSpec Standards:** standards.globalspec.com
- **TE Connectivity:** www.te.com
- **Amphenol-Air LB:** amphenol-airlb.de
- **HellermannTyton:** www.hellermanntyton.com

---

## 1.11 GÜLTIGKEIT UND ÄNDERUNGEN

| Version | Datum | Änderung |
|---------|-------|----------|
| 1.0 | Dezember 2025 | Erstausgabe |

---

**ENDE TEIL 1 – EINFÜHRUNG UND ÜBERSICHT**

*Weiter mit TEIL 2: VG 95218 – Drähte und Leitungen*
