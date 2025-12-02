# VG 96927-2 – HANDBUCH SEKTION 5.3
## Elektrische Prüfungen und Design-Richtlinien für Kabelgarnituren

---

## 1 Zweck und Geltungsbereich

Dieses Handbuch ist ein praxisorientierter Leitfaden für **Sektion 5.3 (Elektrische Prüfungen)** der VG 96927 2 und dient als Unterstützung bei **Auslegung, Prüfung und Qualitätskontrolle** von konfektionierten Kabelgarnituren.[web:1][web:12]  
Die hier angegebenen Grenzwerte und Tabellen sind als **informative, praxisnahe Richtwerte** ausgelegt und ersetzen nicht die verbindlichen Anforderungen der Originalnorm und der jeweiligen Detailnormen (VG 96927 2 xx, VG 95xxx usw.).[web:1][web:7]  

---

## 2 Übersicht der Prüfungen nach 5.3

Typische Prüfungen, die in Sektion 5.3 behandelt werden:

- 5.3.1 Leiterwiderstand (Conductor Resistance)  
- 5.3.2 Isolationswiderstand (Insulation Resistance)  
- 5.3.3 Durchschlagsfestigkeit / Spannungsfestigkeit (Dielectric / Hipot)  
- 5.3.4 Übertragungseigenschaften (nur für Daten-/HF Kabel)  
  - 5.3.4.1 Wellenwiderstand (Charakteristische Impedanz)  
  - 5.3.4.2 Dämpfung (Attenuation)  
  - 5.3.4.3 Einfügedämpfung IL (Insertion Loss) – Anforderungen in Amendment A1 überarbeitet[web:27]  
- 5.3.5 Schirmungswirkung (Screening Effectiveness)  
- 5.3.6 Prüfspannungen (Test Voltages)  
- 5.3.7 Schirmdurchgängigkeit (Screen Continuity)  

---

## 3 Design-Grundlagen für Leiter (informativ)

### 3.1 DC-Leiterwiderstand – Richtwerte aus Kupfer-Physik

Für Kupferleiter kann der spezifische Widerstand bei 20 °C näherungsweise mit  
(
ho approx 0{,}0178 Omega cdot \text{mm}^2/\text{m}) angesetzt werden.[web:115][web:109]  

Näherungsformel für den Widerstand pro Kilometer:

[
R_{20} approx \frac{17{,}8}{A} quad [Omega/\text{km}]
]

mit (A) = Leiterquerschnitt in mm².  

### 3.2 Tabelle: Richtwerte R_{20} für Cu-Leiter

Diese Tabelle dient als Planungs- und Prüfgrundlage, z. B. für das Ableiten von Grenzwerten bei der Durchgangsmessung.

| Querschnitt A [mm²] | R_{20} [Ω/km] ca. | 1 m [Ω] | 5 m [Ω] | 10 m [Ω] |
|---------------------|--------------------|--------:|--------:|---------:|
| 0,25 | 71,2 | 0,071 | 0,356 | 0,712 |
| 0,50 | 35,6 | 0,036 | 0,178 | 0,356 |
| 0,75 | 23,7 | 0,024 | 0,119 | 0,237 |
| 1,0 | 17,8 | 0,018 | 0,089 | 0,178 |
| 1,5 | 11,9 | 0,012 | 0,060 | 0,119 |
| 2,5 | 7,1 | 0,007 | 0,036 | 0,071 |
| 4,0 | 4,5 | 0,005 | 0,022 | 0,045 |
| 6,0 | 3,0 | 0,003 | 0,015 | 0,030 |
| 10,0 | 1,8 | 0,002 | 0,009 | 0,018 |
| 16,0 | 1,1 | 0,001 | 0,006 | 0,011 |

> Hinweis: Die tatsächlichen Maximalwerte in IEC 60228 können je nach Leiterklasse (1/2/5/6) leicht abweichen; für präzise Grenzwerte ist IEC 60228 bzw. die jeweilige Kabelnorm heranzuziehen.[web:100][web:115]  

---

## 4 Auslegungsschritte (Design → Prüfplan 5.3)

### 4.1 Schritt 1 – Strom, Spannungsfall und Querschnitt

1. Nenneingangsdaten:
   - Versorgungsspannung (z. B. 12 V oder 24 V Bordnetz).  
   - Maximaler Betriebsstrom des Stromkreises.  
   - Maximale Leitungslänge (Hin- und Rückleiter, also 2×L).  
   - Zulässiger Spannungsfall (z. B. 3 % der Nennspannung).  

2. Berechne maximal zulässigen Leitungswiderstand (R_{\text{max}}):

[
Delta U_{\text{max}} = U_{\text{nenn}} cdot p_{%}/100
]

[
R_{\text{max}} = \frac{Delta U_{\text{max}}}{I_{\text{max}}}
]

3. Wähle Querschnitt A aus Tabelle in Abschnitt 3.2, so dass

[
R_{\text{Leitung}}(2L) leq R_{\text{max}}
]

unter Verwendung (R_{20}) [Ω/km] → umgerechnet auf tatsächliche Länge.  

### 4.2 Schritt 2 – Projekt-Grenzwert für 5.3.1 definieren

Aus dem berechneten (R_{\text{Leitung}}) leitest du einen **Grenzwert für die Durchgangsmessung** im Rahmen von 5.3.1 ab, z. B.:

[
R_{\text{Grenz}} = R_{\text{Leitung}} cdot 1{,}10
]

(= +10 % Toleranz für Messunsicherheit, Übergangswiderstände, Temperatur).  

Dieser Wert kann in der Prüfkarte als **„Grenzwert Durchgang“** pro Leitung angegeben werden.  

### 4.3 Schritt 3 – Verknüpfung mit 5.3 Prüfungen

Für jede Garnitur/Leitung:

- **5.3.1 Leiterwiderstand:**  
  Prüfen, ob der gemessene Widerstand < (R_{\text{Grenz}}) liegt.  

- **5.3.2 Isolationswiderstand:**  
  Sicherstellen, dass IR Werte die Mindestwerte für System und Umgebung (trocken / nach Klima) erfüllen (z. B. >100 MΩ bei 500 V DC im Normzustand).[web:12]  

- **5.3.3 Durchschlagsfestigkeit:**  
  Mit AC Prüfspannung gemäß Systemklasse (z. B. 1050 V AC / 60 s) ohne Durchschlag und mit Leckstrom unter Grenzwert.[web:12]  

---

## 5 Detaillierte Prüfabläufe nach 5.3

### 5.1 5.3.1 – Leiterwiderstand (Durchgangsprüfung)

**Zweck:** Nachweis der korrekten Leitfähigkeit und der Einhaltung des projektbasierten Grenzwertes.  

**Prüfbedingungen:**

- Temperatur: 20 °C ± 5 °C (für Vergleiche auf 20 °C normieren).  
- Messmethode: 4-Leiter-Messung empfohlen, mindestens 2-Leiter für Fertigungskontrolle.  
- Prüfstrom: so wählen, dass der Leiter nicht merklich erwärmt wird.  

**Ablauf:**

1. Leitungslänge dokumentieren (z. B. 5 m).  
2. Kontaktstellen reinigen, Klemmen fest anziehen.  
3. Drei Messungen durchführen, Mittelwert bilden.  
4. Falls Temperatur ≠ 20 °C, optional auf 20 °C umrechnen mit:

[
R_{20} = \frac{R_t}{1 + alpha (t - 20)}
]

(alpha approx 0{,}00393 \text{K}^{-1}) für Kupfer.  
5. Vergleich mit Projekt-Grenzwert (R_{\text{Grenz}}).  

**Kriterium:**  
- (R_{\text{mess}} le R_{\text{Grenz}}) → bestanden.  
- (R_{\text{mess}} > R_{\text{Grenz}}) → nicht bestanden (z. B. zu kleiner Querschnitt, schlechte Crimpung, Übergangswiderstände).  

---

### 5.2 5.3.2 – Isolationswiderstand

**Zweck:** Sicherstellen, dass keine unzulässigen Leckströme zwischen Leitern oder zwischen Leitern und Schirm auftreten.  

**Typische Grenzwerte (Richtwerte, je nach System/Detailnorm anpassen):**

| Zustand | Prüfspannung | Mindest-Isolationswiderstand |
|-----------------------------------|--------------|------------------------------|
| Normklima (trocken, 20 °C) | 500 V DC | > 100 MΩ |
| Nach Feuchte-/Klimaprüfung | 500 V DC | > 50 MΩ |
| Nach Wärmealterung | 500 V DC | > 50 MΩ |

**Messpunkte:**

- Alle Leiter zusammen ↔ Schirm/Masse.  
- Relevante Leiterpaare (z. B. in verdrillten Paaren).  

**Ablauf (Kurzform):**

1. Probe 24 h im Normklima konditionieren.  
2. Enden reinigen, keine Verbindung zu Erde.  
3. Megohmmeter auf 500 V DC stellen.  
4. Spannung anlegen, mindestens 60 s halten.  
5. Stabilisierten Wert ablesen und dokumentieren.  

**Kriterium:**  
- Alle Messwerte ≥ geforderte MΩ Grenzwerte → bestanden.  
- Einzelne Werte < Grenzwert → nicht bestanden, Ursache untersuchen (Feuchtigkeit, Beschädigung, Herstellfehler).  

---

### 5.3 5.3.3 – Durchschlagsfestigkeit (Hipot)

**Zweck:** Nachweis ausreichender Isolationsfestigkeit bei hoher Prüfspannung.  

**Richtwerte (System-abhängig, Beispiel):**

| Systemtyp | Prüfspannung AC | Dauer | max. Leckstrom |
|-----------------------|-----------------|------|----------------|
| Niederspannungs System| 1050 V AC | 60 s | < 2 mA |
| Hochtemperatur System | 1500 V AC | 60 s | < 1 mA |

**Schutzmaßnahmen:**  
- Hochspannungsbereich absperren, Warnschilder.  
- Isolierhandschuhe, isolierende Unterlage.  
- Not-Aus verwendbar.  

**Ablauf (vereinfacht):**

1. Alle Leiter an HV Klemme (+), Schirm/Gehäuse an HV Rückleitung (−).  
2. Prüfspannung gemäß System einstellen, Ramp Up aktivieren.  
3. 60 s halten, Strom und Probe beobachten.  
4. Spannung kontrolliert absenken, Probe entladen.  
5. Leckstrom, Sichtbefund und Ergebnis dokumentieren.  

**Kriterium:**  
- Kein Durchschlag, kein sichtbarer Schaden, Leckstrom < Grenzwert → bestanden.  
- Durchschlag, Funken, Rauch oder Überstromabschaltung → nicht bestanden.  

---

### 5.4 5.3.4 – Übertragungseigenschaften (Daten/HF-Kabel)

Nur relevant für Leitungen mit Übertragungsanforderungen (z. B. Ethernet, HF Koax). Konkrete Zahlenwerte werden in den jeweiligen Detailnormen und Kabeldatenblättern definiert.[web:12][web:18]  

**Typische Prüfpunkte:**

- Wellenwiderstand (z. B. 50 Ω, 75 Ω, 100 Ω).  
- Dämpfung pro Länge bei verschiedenen Frequenzen.  
- Einfügedämpfung IL für Stecker Kabel Stecker Strecken.  

Messung i. d. R. mit Vektor Netzwerkanalysator (VNA, S Parameter).  

---

### 5.5 5.3.5 – Schirmungswirkung & 5.3.7 Schirmdurchgängigkeit

**Schirmungswirkung:**  
- Messen z. B. im Triaxialverfahren oder mit TEM Zelle.  
- Anforderung: Schirmdämpfung ≥ spezifizierte dB Werte im relevanten Frequenzbereich (z. B. ≥80 dB).[web:18]  

**Schirmdurchgängigkeit:**  
- DC Widerstand Schirmende A ↔ Schirmende B messen.  
- Richtwert: möglichst nahe 0 Ω, typischer Grenzwert < 1 Ω bei kurzen Garnituren.  

---

## 6 Schnell-Workflow (Design → Prüfung 5.3)

1. **Design:**  
   - Laststrom, Spannungsfall, Länge → Querschnitt A aus Tabelle.  
   - Max. Leitungswiderstand (R_{\text{Leitung}}) berechnen.  

2. **Projekt-Grenzwert festlegen:**  
   - (R_{\text{Grenz}} = R_{\text{Leitung}} cdot 1{,}10).  
   - In Prüfplan als Grenzwert für 5.3.1 eintragen.  

3. **Prüfung nach VG 96927 2 5.3:**  
   - 5.3.1: Leiterwiderstand messen und gegen (R_{\text{Grenz}}) prüfen.  
   - 5.3.2: Isolationswiderstand bei 500 V DC testen.  
   - 5.3.3: Hipot Prüfung mit System Prüfspannung durchführen.  
   - 5.3.4–5.3.5: nur bei Daten/HF Kabeln anwenden.  

4. **Dokumentation:**  
   - Alle Messwerte, Grenzwerte, Geräte, Temperatur und Ergebnis (PASS/FAIL) protokollieren – Vorgabe aus VG 96927 2 Kap. 7 „Fertigungsüberwachung“ beachten.[web:90]  

---

## 7 Hinweis zur Normverwendung

- **Verbindliche Anforderungen** (exakte Spannungen, Zeiten, Tabellen A.x, Grenzwerte für IL, Dämpfung usw.) stehen nur in der **Originalnorm VG 96927 2 in aktueller Ausgabe und im Amendment A1**.[web:1][web:27]  
- Dieses Handbuch ist als **Arbeitsunterlage im Labor / in der Entwicklung** gedacht und kann zusammen mit den VG Detailnormen, IEC 60228 (Leiterwiderstände) und Herstellerspezifikationen verwendet werden.[web:100][web:115]  
