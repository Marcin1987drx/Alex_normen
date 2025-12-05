// ═══════════════════════════════════════════════════════════════════════════════
// VG-NORMEN WISSENSSYSTEM - WISSENSBASIS LOADER
// Ładuje wszystkie TEIL JSON pliki i generuje karty nawigacyjne
// ═══════════════════════════════════════════════════════════════════════════════

const WissensbasisLoader = {
  
  // Wszystkie pliki TEIL JSON do załadowania
  teilDateien: [
    'teil1-einfuehrung.json',
    'teil2-vg95218-draehte.json',
    'teil3-vg96927-kabelgarnituren.json',
    'teil4-vg95319-steckverbinder.json',
    'teil5-vg96936-abschirmung.json',
    'teil6-vg95343-schrumpfschlaeuche.json',
    'teil7-ipc-whma-a-620.json',
    'teil8-qualitaetsmanagement.json',
    'teil9-aql-iso2859.json',
    'teil10-formulare.json'
  ],
  
  // Załadowane dane TEIL
  teilDaten: {},
  
  // Wygenerowane karty
  karten: [],
  
  // Załaduj wszystkie dane
  async ladeDaten() {
    console.log('📚 Ładowanie wissensbasis z JSON...');
    
    for (const datei of this.teilDateien) {
      try {
        const response = await fetch(`wissensbasis/${datei}`);
        if (response.ok) {
          const daten = await response.json();
          const teilNr = datei.match(/teil(\d+)/)?.[1] || datei;
          this.teilDaten[`teil${teilNr}`] = daten;
          console.log(`✅ Geladen: ${datei}`);
        } else {
          console.warn(`⚠️ Nicht gefunden: ${datei}`);
        }
      } catch (error) {
        console.error(`❌ Fehler beim Laden von ${datei}:`, error);
      }
    }
    
    // Generiere Karten aus den Daten
    this.generiereKarten();
    
    return this.karten;
  },
  
  // Generiere Wissensbasis-Karten aus den TEIL-Daten
  generiereKarten() {
    this.karten = [];
    
    // TEIL 1: Einführung
    if (this.teilDaten.teil1) {
      this.kartenAusTeil1(this.teilDaten.teil1);
    }
    
    // TEIL 2: VG 95218 Drähte
    if (this.teilDaten.teil2) {
      this.kartenAusTeil2(this.teilDaten.teil2);
    }
    
    // TEIL 3: VG 96927 Kabelgarnituren
    if (this.teilDaten.teil3) {
      this.kartenAusTeil3(this.teilDaten.teil3);
    }
    
    // TEIL 4: VG 95319 Steckverbinder
    if (this.teilDaten.teil4) {
      this.kartenAusTeil4(this.teilDaten.teil4);
    }
    
    // TEIL 5: VG 96936 Abschirmung
    if (this.teilDaten.teil5) {
      this.kartenAusTeil5(this.teilDaten.teil5);
    }
    
    // TEIL 6: VG 95343 Schrumpfschläuche
    if (this.teilDaten.teil6) {
      this.kartenAusTeil6(this.teilDaten.teil6);
    }
    
    // TEIL 7: IPC/WHMA-A-620
    if (this.teilDaten.teil7) {
      this.kartenAusTeil7(this.teilDaten.teil7);
    }
    
    // TEIL 8: Qualitätsmanagement
    if (this.teilDaten.teil8) {
      this.kartenAusTeil8(this.teilDaten.teil8);
    }
    
    // TEIL 9: AQL ISO 2859-1
    if (this.teilDaten.teil9) {
      this.kartenAusTeil9(this.teilDaten.teil9);
    }
    
    // TEIL 10: Formulare
    if (this.teilDaten.teil10) {
      this.kartenAusTeil10(this.teilDaten.teil10);
    }
    
    console.log(`📊 ${this.karten.length} Wissenskarten generiert`);
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // TEIL 1: Einführung
  // ═══════════════════════════════════════════════════════════════════════════════
  
  kartenAusTeil1(daten) {
    // Hauptübersicht
    this.karten.push({
      id: 'teil1-uebersicht',
      category: 'kabel',
      type: 'overview',
      title: daten.titel,
      icon: '📘',
      norm: 'VG Normen',
      description: daten.beschreibung,
      keywords: ['einführung', 'übersicht', 'vg-normen', 'kabelgarnituren', 'grundlagen'],
      teilDaten: daten
    });
    
    // VG-Hierarchie
    if (daten.vg_hierarchie) {
      this.karten.push({
        id: 'teil1-vg-hierarchie',
        category: 'kabel',
        type: 'detail',
        title: 'VG-Normen Hierarchie',
        icon: '📊',
        norm: 'VG-System',
        description: 'Struktur der VG-Normenreihe für Kabelgarnituren',
        keywords: ['hierarchie', 'normenstruktur', 'vg 96927', 'vg 95218', 'vg 95319'],
        content: this.tabelleZuHtml(daten.vg_hierarchie, ['norm', 'titel', 'beschreibung', 'teil'])
      });
    }
    
    // Temperatursysteme
    if (daten.temperatursysteme) {
      this.karten.push({
        id: 'teil1-temperatursysteme',
        category: 'kabel',
        type: 'detail',
        title: 'Temperatursysteme Vergleich',
        icon: '🌡️',
        norm: 'VG 96927',
        description: 'System 25, 100 und 200 im Vergleich',
        keywords: ['system 25', 'system 100', 'system 200', 'temperatur', 'anwendung'],
        content: this.temperatursystemeZuHtml(daten.temperatursysteme)
      });
    }
    
    // Zugelassene Hersteller
    if (daten.zugelassene_hersteller) {
      this.karten.push({
        id: 'teil1-hersteller',
        category: 'kabel',
        type: 'detail',
        title: 'Zugelassene Hersteller (QPL)',
        icon: '🏭',
        norm: 'VG-Zulassung',
        description: 'QPL-qualifizierte Lieferanten für VG-Komponenten',
        keywords: ['hersteller', 'qpl', 'lieferant', 'zulassung', 'te', 'amphenol', 'glenair'],
        content: this.herstellerZuHtml(daten.zugelassene_hersteller)
      });
    }
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // TEIL 2: VG 95218 Drähte
  // ═══════════════════════════════════════════════════════════════════════════════
  
  kartenAusTeil2(daten) {
    // Hauptübersicht
    this.karten.push({
      id: 'teil2-uebersicht',
      category: 'kabel',
      type: 'overview',
      title: daten.titel,
      icon: '📏',
      norm: 'VG 95218',
      description: daten.beschreibung,
      keywords: ['vg 95218', 'drähte', 'leitungen', 'kabel', 'typ a', 'typ e', 'typ g', 'typ h'],
      teilDaten: daten
    });
    
    // Für jeden Drahttyp eine Karte
    if (daten.drahttypen) {
      Object.entries(daten.drahttypen).forEach(([typKey, typDaten]) => {
        this.karten.push({
          id: `teil2-drahttyp-${typKey}`,
          category: 'kabel',
          type: 'detail',
          title: `${typDaten.bezeichnung} - ${typDaten.beschreibung}`,
          icon: typDaten.icon || '🔌',
          norm: 'VG 95218',
          description: `${typDaten.isolationsmaterial}, ${typDaten.temperaturbereich_min}°C bis ${typDaten.temperaturbereich_max}°C`,
          keywords: [typKey, typDaten.isolationsmaterial, 'draht', 'leitung', ...typDaten.anwendungen],
          content: this.drahtTypZuHtml(typDaten)
        });
      });
    }
    
    // AWG-Tabelle
    if (daten.awg_zu_mm2) {
      this.karten.push({
        id: 'teil2-awg-tabelle',
        category: 'kabel',
        type: 'tabelle',
        title: 'AWG zu mm² Umrechnung',
        icon: '📊',
        norm: 'VG 95218',
        description: 'Umrechnung American Wire Gauge zu Quadratmillimeter',
        keywords: ['awg', 'mm2', 'querschnitt', 'umrechnung', 'tabelle'],
        content: this.tabelleZuHtml(daten.awg_zu_mm2, ['awg', 'mm2', 'durchmesser_mm', 'widerstand_ohm_km'])
      });
    }
    
    // Farbcodierung
    if (daten.farbcodierung) {
      this.karten.push({
        id: 'teil2-farbcodierung',
        category: 'kabel',
        type: 'detail',
        title: 'Aderfarbcodierung',
        icon: '🎨',
        norm: 'VG 95218',
        description: 'Farbkennzeichnung der Einzeladern',
        keywords: ['farbe', 'farbcode', 'ader', 'kennzeichnung'],
        content: this.farbcodierungZuHtml(daten.farbcodierung)
      });
    }
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // TEIL 3: VG 96927 Kabelgarnituren
  // ═══════════════════════════════════════════════════════════════════════════════
  
  kartenAusTeil3(daten) {
    this.karten.push({
      id: 'teil3-uebersicht',
      category: 'kabel',
      type: 'overview',
      title: daten.titel,
      icon: '🔌',
      norm: 'VG 96927',
      description: daten.beschreibung,
      keywords: ['vg 96927', 'kabelgarnitur', 'konfektionierung', 'system'],
      teilDaten: daten
    });
    
    // Temperatursysteme Detail
    if (daten.temperatursysteme) {
      Object.entries(daten.temperatursysteme).forEach(([sysKey, sysDaten]) => {
        this.karten.push({
          id: `teil3-system-${sysKey}`,
          category: 'kabel',
          type: 'detail',
          title: `System ${sysKey} - ${sysDaten.bezeichnung}`,
          icon: '🌡️',
          norm: 'VG 96927',
          description: `${sysDaten.temperaturbereich.min}°C bis ${sysDaten.temperaturbereich.max}°C - ${sysDaten.typische_anwendungen?.join(', ')}`,
          keywords: [`system ${sysKey}`, sysDaten.bezeichnung.toLowerCase(), 'temperatur'],
          content: this.systemZuHtml(sysKey, sysDaten)
        });
      });
    }
    
    // Elektrische Prüfungen
    if (daten.elektrische_pruefungen) {
      this.karten.push({
        id: 'teil3-elektrische-pruefungen',
        category: 'pruefung',
        type: 'detail',
        title: 'Elektrische Prüfungen VG 96927',
        icon: '⚡',
        norm: 'VG 96927-2',
        description: 'Isolationswiderstand, Durchgang, Hochspannung',
        keywords: ['isolationswiderstand', 'hipot', 'durchgang', 'elektrisch', 'prüfung'],
        content: this.elektrischePruefungenZuHtml(daten.elektrische_pruefungen)
      });
    }
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // TEIL 4: VG 95319 Steckverbinder
  // ═══════════════════════════════════════════════════════════════════════════════
  
  kartenAusTeil4(daten) {
    this.karten.push({
      id: 'teil4-uebersicht',
      category: 'stecker',
      type: 'overview',
      title: daten.titel,
      icon: '🔌',
      norm: 'VG 95319',
      description: daten.beschreibung,
      keywords: ['vg 95319', 'steckverbinder', 'kontakte', 'mil-dtl-38999'],
      teilDaten: daten
    });
    
    // Baugrößen
    if (daten.baugroessen) {
      this.karten.push({
        id: 'teil4-baugroessen',
        category: 'stecker',
        type: 'tabelle',
        title: 'Steckverbinder Baugrößen',
        icon: '📐',
        norm: 'VG 95319',
        description: 'Shell Sizes 09 bis 25 mit Durchmessern und Kontaktanzahl',
        keywords: ['baugröße', 'shell size', 'durchmesser', '09', '11', '13', '15', '17', '19', '21', '23', '25'],
        content: this.baugroessenZuHtml(daten.baugroessen)
      });
    }
    
    // Kontaktgrößen
    if (daten.kontaktgroessen) {
      this.karten.push({
        id: 'teil4-kontaktgroessen',
        category: 'stecker',
        type: 'tabelle',
        title: 'Kontaktgrößen und Strombelastbarkeit',
        icon: '⚡',
        norm: 'VG 95319-1009',
        description: 'Kontakttypen 22D bis 0 mit AWG-Bereich und Stromwerten',
        keywords: ['kontakt', 'strom', 'awg', '22d', '20', '16', '12', '8', '4', '0'],
        content: this.kontaktgroessenZuHtml(daten.kontaktgroessen)
      });
    }
    
    // Anzugsmomente
    if (daten.anzugsmomente) {
      this.karten.push({
        id: 'teil4-anzugsmomente',
        category: 'stecker',
        type: 'tabelle',
        title: 'Anzugsmomente Steckverbinder',
        icon: '🔧',
        norm: 'VG 95319-1006',
        description: 'Drehmomente für Kupplungsmutter und Kontaktschraube',
        keywords: ['drehmoment', 'anzugsmoment', 'nm', 'kupplungsmutter'],
        content: this.anzugsmomenteZuHtml(daten.anzugsmomente)
      });
    }
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // TEIL 5: VG 96936 Abschirmung
  // ═══════════════════════════════════════════════════════════════════════════════
  
  kartenAusTeil5(daten) {
    this.karten.push({
      id: 'teil5-uebersicht',
      category: 'schirmung',
      type: 'overview',
      title: daten.titel,
      icon: '🛡️',
      norm: 'VG 96936',
      description: daten.beschreibung,
      keywords: ['vg 96936', 'abschirmung', 'geflecht', 'emi', 'rfi', 'schirmung'],
      teilDaten: daten
    });
    
    // Geflechtmaterialien
    if (daten.geflechtmaterialien) {
      this.karten.push({
        id: 'teil5-materialien',
        category: 'schirmung',
        type: 'detail',
        title: 'Abschirmgeflecht Materialien',
        icon: '🔬',
        norm: 'VG 96936',
        description: 'CuSn, CuNi, Edelstahl - Eigenschaften und Anwendungen',
        keywords: ['cusn', 'cuni', 'edelstahl', 'kupfer', 'nickel', 'material'],
        content: this.geflechtmaterialienZuHtml(daten.geflechtmaterialien)
      });
    }
    
    // Größentabelle
    if (daten.groessen) {
      this.karten.push({
        id: 'teil5-groessen',
        category: 'schirmung',
        type: 'tabelle',
        title: 'Abschirmgeflecht Größen',
        icon: '📏',
        norm: 'VG 96936',
        description: 'VG06-02 bis VG06-50 mit Durchmessern',
        keywords: ['größe', 'durchmesser', 'vg06'],
        content: this.geflechtgroessenZuHtml(daten.groessen)
      });
    }
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // TEIL 6: VG 95343 Schrumpfschläuche
  // ═══════════════════════════════════════════════════════════════════════════════
  
  kartenAusTeil6(daten) {
    this.karten.push({
      id: 'teil6-uebersicht',
      category: 'schrumpfen',
      type: 'overview',
      title: daten.titel,
      icon: '🔥',
      norm: 'VG 95343',
      description: daten.beschreibung,
      keywords: ['vg 95343', 'schrumpfschlauch', 'heatshrink', 'typ a', 'typ b', 'typ c', 'typ h'],
      teilDaten: daten
    });
    
    // Für jeden Schrumpfschlauch-Typ eine Karte
    if (daten.typen) {
      Object.entries(daten.typen).forEach(([typKey, typDaten]) => {
        this.karten.push({
          id: `teil6-typ-${typKey}`,
          category: 'schrumpfen',
          type: 'detail',
          title: `Schrumpfschlauch Typ ${typKey.toUpperCase()}`,
          icon: '🔥',
          norm: 'VG 95343',
          description: `${typDaten.beschreibung} - Schrumpftemp. ${typDaten.schrumpftemperatur}`,
          keywords: [typKey, 'schrumpfschlauch', typDaten.material?.toLowerCase() || ''],
          content: this.schrumpfschlauchTypZuHtml(typKey, typDaten)
        });
      });
    }
    
    // MIL-SPEC Vergleich
    if (daten.mil_spec_vergleich) {
      this.karten.push({
        id: 'teil6-mil-spec',
        category: 'schrumpfen',
        type: 'tabelle',
        title: 'VG 95343 zu MIL-SPEC Vergleich',
        icon: '🔄',
        norm: 'VG 95343 / MIL',
        description: 'Äquivalente MIL-DTL Spezifikationen',
        keywords: ['mil-dtl', 'mil-spec', 'vergleich', 'äquivalent'],
        content: this.milSpecVergleichZuHtml(daten.mil_spec_vergleich)
      });
    }
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // TEIL 7: IPC/WHMA-A-620
  // ═══════════════════════════════════════════════════════════════════════════════
  
  kartenAusTeil7(daten) {
    this.karten.push({
      id: 'teil7-uebersicht',
      category: 'crimpen',
      type: 'overview',
      title: daten.titel,
      icon: '🔧',
      norm: 'IPC/WHMA-A-620',
      description: daten.beschreibung,
      keywords: ['ipc', 'whma', 'a-620', 'crimp', 'klasse 3', 'produktion'],
      teilDaten: daten
    });
    
    // Crimp-Kriterien
    if (daten.crimp_kriterien) {
      this.karten.push({
        id: 'teil7-crimp-kriterien',
        category: 'crimpen',
        type: 'detail',
        title: 'Crimp-Akzeptanzkriterien Klasse 3',
        icon: '✅',
        norm: 'IPC/WHMA-A-620',
        description: 'Bellmouth, Litzenposition, Isolierung - Gut vs. Schlecht',
        keywords: ['crimp', 'bellmouth', 'akzeptanz', 'klasse 3', 'kriterien'],
        content: this.crimpKriterienZuHtml(daten.crimp_kriterien)
      });
    }
    
    // Zugkräfte
    if (daten.zugkraefte) {
      this.karten.push({
        id: 'teil7-zugkraefte',
        category: 'crimpen',
        type: 'tabelle',
        title: 'Mindestzugkräfte nach IPC',
        icon: '💪',
        norm: 'IPC/WHMA-A-620 Tabelle 5-1',
        description: 'Zugprüfung für Crimpverbindungen nach Querschnitt',
        keywords: ['zugkraft', 'newton', 'prüfung', 'pull test'],
        content: this.zugkraefteZuHtml(daten.zugkraefte)
      });
    }
    
    // Lötkriterien
    if (daten.loet_kriterien) {
      this.karten.push({
        id: 'teil7-loeten',
        category: 'crimpen',
        type: 'detail',
        title: 'Lötkriterien Klasse 3',
        icon: '🔥',
        norm: 'IPC/WHMA-A-620',
        description: 'Benetzung, Lotmenge, Fehlerbilder',
        keywords: ['löten', 'lot', 'benetzung', 'klasse 3'],
        content: this.loetKriterienZuHtml(daten.loet_kriterien)
      });
    }
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // TEIL 8: Qualitätsmanagement
  // ═══════════════════════════════════════════════════════════════════════════════
  
  kartenAusTeil8(daten) {
    this.karten.push({
      id: 'teil8-uebersicht',
      category: 'pruefung',
      type: 'overview',
      title: daten.titel,
      icon: '✅',
      norm: 'ISO 9001 / VG',
      description: daten.beschreibung,
      keywords: ['qualität', 'qm', 'prüfung', 'kontrolle', 'iso 9001'],
      teilDaten: daten
    });
    
    // Wareneingangsprüfung
    if (daten.wareneingangspruefung) {
      this.karten.push({
        id: 'teil8-wareneingang',
        category: 'pruefung',
        type: 'detail',
        title: 'Wareneingangsprüfung',
        icon: '📦',
        norm: 'ISO 9001',
        description: 'Eingangskontrolle für VG-Materialien',
        keywords: ['wareneingang', 'eingangskontrolle', 'prüfung', 'material'],
        content: this.wareneingangZuHtml(daten.wareneingangspruefung)
      });
    }
    
    // Prüfmittel
    if (daten.pruefmittel) {
      this.karten.push({
        id: 'teil8-pruefmittel',
        category: 'pruefung',
        type: 'detail',
        title: 'Prüfmittel und Kalibrierung',
        icon: '📏',
        norm: 'ISO 17025',
        description: 'Messmittel, Kalibrierintervalle, Dokumentation',
        keywords: ['prüfmittel', 'kalibrierung', 'messmittel', 'intervall'],
        content: this.pruefmittelZuHtml(daten.pruefmittel)
      });
    }
    
    // 8D-Report
    if (daten.fehlermanagement) {
      this.karten.push({
        id: 'teil8-8d-report',
        category: 'pruefung',
        type: 'detail',
        title: '8D-Report / Fehlermanagement',
        icon: '🔍',
        norm: 'IATF 16949',
        description: '8 Disziplinen zur systematischen Problemlösung',
        keywords: ['8d', 'fehler', 'reklamation', 'problemlösung'],
        content: this.fehlermanagementZuHtml(daten.fehlermanagement)
      });
    }
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // TEIL 9: AQL ISO 2859-1
  // ═══════════════════════════════════════════════════════════════════════════════
  
  kartenAusTeil9(daten) {
    this.karten.push({
      id: 'teil9-uebersicht',
      category: 'pruefung',
      type: 'overview',
      title: daten.titel,
      icon: '📊',
      norm: 'ISO 2859-1',
      description: daten.beschreibung,
      keywords: ['aql', 'iso 2859', 'stichprobe', 'los', 'annahmezahl'],
      teilDaten: daten
    });
    
    // AQL-Tabellen
    if (daten.tabellen) {
      if (daten.tabellen.tabelle_1) {
        this.karten.push({
          id: 'teil9-tabelle1',
          category: 'pruefung',
          type: 'tabelle',
          title: 'AQL Tabelle 1 - Stichprobenumfang',
          icon: '📊',
          norm: 'ISO 2859-1',
          description: 'Losgröße zu Prüflos-Code',
          keywords: ['aql', 'tabelle 1', 'losgröße', 'stichprobe', 'code'],
          content: this.aqlTabelle1ZuHtml(daten.tabellen.tabelle_1)
        });
      }
      
      if (daten.tabellen.tabelle_2a) {
        this.karten.push({
          id: 'teil9-tabelle2a',
          category: 'pruefung',
          type: 'tabelle',
          title: 'AQL Tabelle 2-A - Stichprobenplan',
          icon: '📊',
          norm: 'ISO 2859-1',
          description: 'Ac/Re Werte für alle AQL-Stufen',
          keywords: ['aql', 'tabelle 2', 'ac', 're', 'annahmezahl', 'rückweisezahl'],
          content: this.aqlTabelle2aZuHtml(daten.tabellen.tabelle_2a)
        });
      }
    }
    
    // Schnellreferenz
    if (daten.schnellreferenz) {
      this.karten.push({
        id: 'teil9-schnellreferenz',
        category: 'pruefung',
        type: 'detail',
        title: 'AQL Schnellreferenz',
        icon: '⚡',
        norm: 'ISO 2859-1',
        description: 'Häufige Losgrößen mit Stichproben',
        keywords: ['aql', 'schnell', 'referenz', 'losgröße'],
        content: this.aqlSchnellreferenzZuHtml(daten.schnellreferenz)
      });
    }
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // TEIL 10: Formulare
  // ═══════════════════════════════════════════════════════════════════════════════
  
  kartenAusTeil10(daten) {
    this.karten.push({
      id: 'teil10-uebersicht',
      category: 'formulare',
      type: 'overview',
      title: daten.titel,
      icon: '📋',
      norm: 'IPC / ISO 9001',
      description: daten.beschreibung,
      keywords: ['formulare', 'checklisten', 'protokolle', 'f-01', 'f-15'],
      teilDaten: daten
    });
    
    // Einzelne Formulare
    if (daten.formulare) {
      Object.entries(daten.formulare).forEach(([formKey, formDaten]) => {
        const kategorie = this.formularKategorie(formKey);
        this.karten.push({
          id: `teil10-formular-${formKey.toLowerCase()}`,
          category: 'formulare',
          type: 'formular',
          title: `${formKey}: ${formDaten.titel}`,
          icon: this.formularIcon(formKey),
          norm: 'VG / IPC',
          description: formDaten.beschreibung || formDaten.titel,
          keywords: [formKey.toLowerCase(), 'formular', kategorie, formDaten.titel.toLowerCase()],
          formularDaten: formDaten
        });
      });
    }
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // HILFSFUNKTIONEN FÜR HTML-GENERIERUNG
  // ═══════════════════════════════════════════════════════════════════════════════
  
  tabelleZuHtml(daten, spalten) {
    if (!Array.isArray(daten) || daten.length === 0) return '<p>Keine Daten</p>';
    
    const headers = spalten || Object.keys(daten[0]);
    let html = '<table class="data-table"><thead><tr>';
    headers.forEach(h => html += `<th>${this.formatHeader(h)}</th>`);
    html += '</tr></thead><tbody>';
    
    daten.forEach(row => {
      html += '<tr>';
      headers.forEach(h => html += `<td>${row[h] ?? '-'}</td>`);
      html += '</tr>';
    });
    
    html += '</tbody></table>';
    return html;
  },
  
  formatHeader(key) {
    const mappings = {
      'norm': 'Norm',
      'titel': 'Titel',
      'beschreibung': 'Beschreibung',
      'teil': 'Teil',
      'awg': 'AWG',
      'mm2': 'mm²',
      'durchmesser_mm': 'Ø (mm)',
      'widerstand_ohm_km': 'R (Ω/km)'
    };
    return mappings[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  },
  
  temperatursystemeZuHtml(systeme) {
    let html = '<div class="temp-systems">';
    Object.entries(systeme).forEach(([key, sys]) => {
      html += `
        <div class="temp-system-card">
          <h3>System ${key}</h3>
          <p><strong>${sys.bezeichnung}</strong></p>
          <p>Temperatur: ${sys.temperaturbereich?.min || '-'}°C bis ${sys.temperaturbereich?.max || '-'}°C</p>
          ${sys.typische_anwendungen ? `<p>Anwendungen: ${sys.typische_anwendungen.join(', ')}</p>` : ''}
        </div>
      `;
    });
    html += '</div>';
    return html;
  },
  
  herstellerZuHtml(hersteller) {
    if (!hersteller?.liste) return '<p>Keine Herstellerdaten</p>';
    
    let html = '<div class="hersteller-liste">';
    hersteller.liste.forEach(h => {
      html += `
        <div class="hersteller-card">
          <h4>${h.name}</h4>
          ${h.komponenten ? `<p><strong>Komponenten:</strong> ${h.komponenten.join(', ')}</p>` : ''}
          ${h.land ? `<p><strong>Land:</strong> ${h.land}</p>` : ''}
        </div>
      `;
    });
    html += '</div>';
    return html;
  },
  
  drahtTypZuHtml(typDaten) {
    let html = `
      <div class="draht-typ">
        <h3>${typDaten.bezeichnung}</h3>
        <p><strong>Material:</strong> ${typDaten.isolationsmaterial}</p>
        <p><strong>Temperatur:</strong> ${typDaten.temperaturbereich_min}°C bis ${typDaten.temperaturbereich_max}°C</p>
        <p><strong>Anwendungen:</strong> ${typDaten.anwendungen?.join(', ')}</p>
    `;
    
    if (typDaten.groessen && typDaten.groessen.length > 0) {
      html += '<h4>Größentabelle</h4><table class="data-table"><thead><tr>';
      const headers = Object.keys(typDaten.groessen[0]);
      headers.forEach(h => html += `<th>${this.formatHeader(h)}</th>`);
      html += '</tr></thead><tbody>';
      
      typDaten.groessen.forEach(row => {
        html += '<tr>';
        headers.forEach(h => html += `<td>${row[h] ?? '-'}</td>`);
        html += '</tr>';
      });
      html += '</tbody></table>';
    }
    
    html += '</div>';
    return html;
  },
  
  farbcodierungZuHtml(daten) {
    if (!daten?.system_25 && !daten?.system_100) return '<p>Keine Farbdaten</p>';
    
    let html = '<div class="farbcodes">';
    ['system_25', 'system_100', 'system_200'].forEach(sys => {
      if (daten[sys]) {
        html += `<h4>${sys.replace('_', ' ').toUpperCase()}</h4><ul>`;
        Object.entries(daten[sys]).forEach(([ader, farbe]) => {
          html += `<li><strong>${ader}:</strong> ${farbe}</li>`;
        });
        html += '</ul>';
      }
    });
    html += '</div>';
    return html;
  },
  
  systemZuHtml(sysKey, sysDaten) {
    let html = `
      <div class="system-detail">
        <h3>System ${sysKey} - ${sysDaten.bezeichnung}</h3>
        <table class="data-table">
          <tr><th>Eigenschaft</th><th>Wert</th></tr>
          <tr><td>Temperaturbereich</td><td>${sysDaten.temperaturbereich?.min}°C bis ${sysDaten.temperaturbereich?.max}°C</td></tr>
          ${sysDaten.kurzzeit_max ? `<tr><td>Kurzzeit max.</td><td>${sysDaten.kurzzeit_max}°C</td></tr>` : ''}
          ${sysDaten.materialkuerzel ? `<tr><td>Materialkürzel</td><td>${sysDaten.materialkuerzel}</td></tr>` : ''}
        </table>
    `;
    
    if (sysDaten.typische_anwendungen) {
      html += `<h4>Typische Anwendungen</h4><ul>`;
      sysDaten.typische_anwendungen.forEach(a => html += `<li>${a}</li>`);
      html += '</ul>';
    }
    
    html += '</div>';
    return html;
  },
  
  elektrischePruefungenZuHtml(daten) {
    let html = '<div class="elektrische-pruefungen">';
    
    Object.entries(daten).forEach(([pruefKey, pruefDaten]) => {
      html += `
        <div class="pruefung-card">
          <h4>${this.formatHeader(pruefKey)}</h4>
          <table class="data-table">
      `;
      Object.entries(pruefDaten).forEach(([key, val]) => {
        if (typeof val !== 'object') {
          html += `<tr><td>${this.formatHeader(key)}</td><td>${val}</td></tr>`;
        }
      });
      html += '</table></div>';
    });
    
    html += '</div>';
    return html;
  },
  
  baugroessenZuHtml(daten) {
    if (!Array.isArray(daten)) return '<p>Keine Baugrößendaten</p>';
    return this.tabelleZuHtml(daten, ['baugröße', 'aussen_durchmesser_mm', 'kontakte_typ', 'max_kontakte']);
  },
  
  kontaktgroessenZuHtml(daten) {
    if (!Array.isArray(daten)) return '<p>Keine Kontaktdaten</p>';
    return this.tabelleZuHtml(daten, ['kontaktgroesse', 'awg_bereich', 'mm2_bereich', 'strom_max_a']);
  },
  
  anzugsmomenteZuHtml(daten) {
    if (!Array.isArray(daten)) return '<p>Keine Anzugsmomenttdaten</p>';
    return this.tabelleZuHtml(daten, ['baugröße', 'kupplungsmutter_nm', 'kontaktschraube_nm']);
  },
  
  geflechtmaterialienZuHtml(daten) {
    let html = '<div class="materialien">';
    Object.entries(daten).forEach(([matKey, matDaten]) => {
      html += `
        <div class="material-card">
          <h4>${matKey.toUpperCase()} - ${matDaten.bezeichnung || ''}</h4>
          ${matDaten.eigenschaften ? `<p>${matDaten.eigenschaften.join(', ')}</p>` : ''}
          ${matDaten.anwendungen ? `<p><strong>Anwendungen:</strong> ${matDaten.anwendungen.join(', ')}</p>` : ''}
        </div>
      `;
    });
    html += '</div>';
    return html;
  },
  
  geflechtgroessenZuHtml(daten) {
    if (!Array.isArray(daten)) return '<p>Keine Größendaten</p>';
    return this.tabelleZuHtml(daten, ['bezeichnung', 'innendurchmesser_mm', 'aussendurchmesser_mm', 'bedeckung_prozent']);
  },
  
  schrumpfschlauchTypZuHtml(typKey, typDaten) {
    let html = `
      <div class="schrumpf-typ">
        <h3>Typ ${typKey.toUpperCase()}</h3>
        <p><strong>${typDaten.beschreibung}</strong></p>
        <table class="data-table">
          <tr><td>Material</td><td>${typDaten.material || '-'}</td></tr>
          <tr><td>Schrumpfverhältnis</td><td>${typDaten.schrumpfverhaeltnis || '-'}</td></tr>
          <tr><td>Schrumpftemperatur</td><td>${typDaten.schrumpftemperatur || '-'}</td></tr>
          <tr><td>Betriebstemperatur</td><td>${typDaten.betriebstemperatur || '-'}</td></tr>
        </table>
    `;
    
    if (typDaten.anwendungen) {
      html += '<h4>Anwendungen</h4><ul>';
      typDaten.anwendungen.forEach(a => html += `<li>${a}</li>`);
      html += '</ul>';
    }
    
    html += '</div>';
    return html;
  },
  
  milSpecVergleichZuHtml(daten) {
    if (!Array.isArray(daten)) return '<p>Keine Vergleichsdaten</p>';
    return this.tabelleZuHtml(daten, ['vg_typ', 'mil_spec', 'beschreibung']);
  },
  
  crimpKriterienZuHtml(daten) {
    let html = '<div class="crimp-kriterien">';
    
    if (daten.optische_kriterien) {
      html += '<h4>Optische Kriterien</h4><table class="data-table"><thead><tr><th>Kriterium</th><th>Akzeptabel</th><th>Nicht akzeptabel</th></tr></thead><tbody>';
      daten.optische_kriterien.forEach(k => {
        html += `<tr><td>${k.kriterium}</td><td class="gut">✅ ${k.akzeptabel || '-'}</td><td class="schlecht">❌ ${k.nicht_akzeptabel || '-'}</td></tr>`;
      });
      html += '</tbody></table>';
    }
    
    html += '</div>';
    return html;
  },
  
  zugkraefteZuHtml(daten) {
    if (!Array.isArray(daten)) return '<p>Keine Zugkraftdaten</p>';
    return this.tabelleZuHtml(daten, ['awg', 'mm2', 'zugkraft_n']);
  },
  
  loetKriterienZuHtml(daten) {
    if (!daten) return '<p>Keine Lötdaten</p>';
    
    let html = '<div class="loet-kriterien">';
    Object.entries(daten).forEach(([key, val]) => {
      if (typeof val === 'object') {
        html += `<h4>${this.formatHeader(key)}</h4>`;
        if (val.akzeptabel) html += `<p class="gut">✅ Akzeptabel: ${val.akzeptabel}</p>`;
        if (val.nicht_akzeptabel) html += `<p class="schlecht">❌ Nicht akzeptabel: ${val.nicht_akzeptabel}</p>`;
      }
    });
    html += '</div>';
    return html;
  },
  
  wareneingangZuHtml(daten) {
    if (!daten) return '<p>Keine Daten</p>';
    
    let html = '<div class="wareneingang">';
    if (daten.pruefschritte) {
      html += '<h4>Prüfschritte</h4><ol>';
      daten.pruefschritte.forEach(s => html += `<li>${s}</li>`);
      html += '</ol>';
    }
    if (daten.dokumente) {
      html += '<h4>Erforderliche Dokumente</h4><ul>';
      daten.dokumente.forEach(d => html += `<li>${d}</li>`);
      html += '</ul>';
    }
    html += '</div>';
    return html;
  },
  
  pruefmittelZuHtml(daten) {
    if (!daten?.liste) return '<p>Keine Prüfmitteldaten</p>';
    
    let html = '<table class="data-table"><thead><tr><th>Prüfmittel</th><th>Kalibrierintervall</th><th>Genauigkeit</th></tr></thead><tbody>';
    daten.liste.forEach(p => {
      html += `<tr><td>${p.bezeichnung}</td><td>${p.intervall || '-'}</td><td>${p.genauigkeit || '-'}</td></tr>`;
    });
    html += '</tbody></table>';
    return html;
  },
  
  fehlermanagementZuHtml(daten) {
    if (!daten?.d8_schritte) return '<p>Keine 8D-Daten</p>';
    
    let html = '<div class="d8-report"><h4>8D-Report Schritte</h4><ol>';
    daten.d8_schritte.forEach(s => html += `<li><strong>${s.bezeichnung}:</strong> ${s.beschreibung}</li>`);
    html += '</ol></div>';
    return html;
  },
  
  aqlTabelle1ZuHtml(daten) {
    if (!Array.isArray(daten)) return '<p>Keine Tabellendaten</p>';
    return this.tabelleZuHtml(daten, ['losgroesse_von', 'losgroesse_bis', 'stichprobencode']);
  },
  
  aqlTabelle2aZuHtml(daten) {
    if (!Array.isArray(daten)) return '<p>Keine Tabellendaten</p>';
    
    let html = '<div class="aql-tabelle-scroll"><table class="data-table aql-table"><thead><tr><th>Code</th><th>n</th>';
    const aqlWerte = ['0.065', '0.10', '0.15', '0.25', '0.40', '0.65', '1.0', '1.5', '2.5', '4.0', '6.5'];
    aqlWerte.forEach(a => html += `<th>AQL ${a}</th>`);
    html += '</tr></thead><tbody>';
    
    daten.forEach(row => {
      html += `<tr><td>${row.code}</td><td>${row.n}</td>`;
      aqlWerte.forEach(a => {
        const key = `aql_${a.replace('.', '_')}`;
        const val = row[key];
        if (val && val.ac !== undefined) {
          html += `<td>${val.ac}/${val.re}</td>`;
        } else {
          html += '<td>-</td>';
        }
      });
      html += '</tr>';
    });
    
    html += '</tbody></table></div>';
    return html;
  },
  
  aqlSchnellreferenzZuHtml(daten) {
    if (!Array.isArray(daten)) return '<p>Keine Schnellreferenz</p>';
    return this.tabelleZuHtml(daten, ['losgroesse', 'stichprobe', 'aql_1_0', 'aql_2_5']);
  },
  
  formularKategorie(formKey) {
    const mapping = {
      'F-01': 'wareneingang',
      'F-02': 'wareneingang',
      'F-03': 'wareneingang',
      'F-04': 'wareneingang',
      'F-05': 'wareneingang',
      'F-06': 'fertigung',
      'F-07': 'prüfung',
      'F-08': 'prüfung',
      'F-09': 'prüfung',
      'F-10': 'prüfung',
      'F-11': 'qualität',
      'F-12': 'qualität',
      'F-13': 'qualität',
      'F-14': 'fertigung',
      'F-15': 'qualität'
    };
    return mapping[formKey] || 'sonstiges';
  },
  
  formularIcon(formKey) {
    const mapping = {
      'F-01': '📦', 'F-02': '🔌', 'F-03': '⚡', 'F-04': '🔥', 'F-05': '🛡️',
      'F-06': '📋', 'F-07': '🔧', 'F-08': '⚡', 'F-09': '✅', 'F-10': '📊',
      'F-11': '❌', 'F-12': '⚠️', 'F-13': '📏', 'F-14': '👷', 'F-15': '🏭'
    };
    return mapping[formKey] || '📄';
  }
};

// Export für globalen Zugriff
window.WissensbasisLoader = WissensbasisLoader;
