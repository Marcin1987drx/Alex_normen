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
    const meta = daten.meta || {};
    const norm = 'VG Normen';
    
    // Hauptübersicht
    this.karten.push({
      id: 'teil1-uebersicht',
      category: 'kabel',
      type: 'overview',
      title: meta.title || daten.titel,
      icon: '📘',
      norm: norm,
      description: meta.geltungsbereich || daten.beschreibung,
      keywords: ['einführung', 'übersicht', 'vg-normen', 'kabelgarnituren', 'grundlagen'],
      teilDaten: daten
    });
    
    // ═══════════════════════════════════════════════════════════════════════════
    // PEŁNE RENDEROWANIE KAPITEL dla TEIL1
    // ═══════════════════════════════════════════════════════════════════════════
    if (daten.kapitel && Array.isArray(daten.kapitel)) {
      daten.kapitel.forEach(kapitel => {
        const kapitelId = kapitel.id || 'unknown';
        const kapitelTitle = kapitel.title || 'Kapitel';
        
        this.karten.push({
          id: `teil1-kapitel-${kapitelId.replace('.', '-')}`,
          category: 'kabel',
          type: 'detail',
          title: `${kapitelId} ${kapitelTitle}`,
          icon: this.kapitelIcon(kapitelTitle),
          norm: norm,
          description: this.kapitelBeschreibung(kapitel),
          keywords: ['einführung', kapitelId, ...this.extrahiereKeywords(kapitel)],
          content: this.kapitelZuVollstaendigemHtml(kapitel)
        });
      });
    }
    
    // VG-Hierarchie (fallback)
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
    
    // Temperatursysteme (fallback)
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
    
    // Zugelassene Hersteller (fallback)
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
    const meta = daten.meta || {};
    const norm = meta.geltende_norm || 'VG 95218';
    
    // Hauptübersicht
    this.karten.push({
      id: 'teil2-uebersicht',
      category: 'kabel',
      type: 'overview',
      title: meta.title || daten.titel,
      icon: '📏',
      norm: norm,
      description: meta.geltungsbereich || daten.beschreibung,
      keywords: ['vg 95218', 'drähte', 'leitungen', 'kabel', 'typ a', 'typ e', 'typ g', 'typ h'],
      teilDaten: daten
    });
    
    // ═══════════════════════════════════════════════════════════════════════════
    // PEŁNE RENDEROWANIE KAPITEL - każdy rozdział jako osobna karta z WSZYSTKIMI danymi
    // ═══════════════════════════════════════════════════════════════════════════
    if (daten.kapitel && Array.isArray(daten.kapitel)) {
      daten.kapitel.forEach(kapitel => {
        const kapitelId = kapitel.id || 'unknown';
        const kapitelTitle = kapitel.title || 'Kapitel';
        
        // Generuj pełną zawartość HTML dla kapitel
        const vollstaendigerInhalt = this.kapitelZuVollstaendigemHtml(kapitel);
        
        // Generuj keywords z zawartości kapitel
        const keywords = this.extrahiereKeywords(kapitel);
        
        this.karten.push({
          id: `teil2-kapitel-${kapitelId.replace('.', '-')}`,
          category: 'kabel',
          type: 'detail',
          title: `${kapitelId} ${kapitelTitle}`,
          icon: this.kapitelIcon(kapitelTitle),
          norm: norm,
          description: this.kapitelBeschreibung(kapitel),
          keywords: ['vg 95218', kapitelId, ...keywords],
          content: vollstaendigerInhalt
        });
      });
    }
    
    // Für jeden Drahttyp eine Karte (fallback dla starszej struktury)
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
    const meta = daten.meta || {};
    const norm = meta.geltende_norm || 'VG 96927';
    
    this.karten.push({
      id: 'teil3-uebersicht',
      category: 'kabel',
      type: 'overview',
      title: meta.title || daten.titel,
      icon: '🔌',
      norm: norm,
      description: meta.geltungsbereich || daten.beschreibung,
      keywords: ['vg 96927', 'kabelgarnitur', 'konfektionierung', 'system'],
      teilDaten: daten
    });
    
    // ═══════════════════════════════════════════════════════════════════════════
    // PEŁNE RENDEROWANIE KAPITEL dla TEIL3
    // ═══════════════════════════════════════════════════════════════════════════
    if (daten.kapitel && Array.isArray(daten.kapitel)) {
      daten.kapitel.forEach(kapitel => {
        const kapitelId = kapitel.id || 'unknown';
        const kapitelTitle = kapitel.title || 'Kapitel';
        
        this.karten.push({
          id: `teil3-kapitel-${kapitelId.replace('.', '-')}`,
          category: 'kabel',
          type: 'detail',
          title: `${kapitelId} ${kapitelTitle}`,
          icon: this.kapitelIcon(kapitelTitle),
          norm: norm,
          description: this.kapitelBeschreibung(kapitel),
          keywords: ['vg 96927', kapitelId, ...this.extrahiereKeywords(kapitel)],
          content: this.kapitelZuVollstaendigemHtml(kapitel)
        });
      });
    }
    
    // Temperatursysteme Detail (fallback)
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
    
    // ═══════════════════════════════════════════════════════════════════════════
    // PEŁNE RENDEROWANIE - każda sekcja jako osobna karta
    // ═══════════════════════════════════════════════════════════════════════════
    this.renderAlleSekcje(daten, 'teil4', 'stecker', 'VG 95319', {
      skip: ['teil', 'titel', 'version', 'letzte_aktualisierung', 'beschreibung'],
      icons: {
        'normenstruktur': '📜',
        'milspec_kompatibilitaet': '🇺🇸',
        'baugroessen': '📐',
        'kontaktgroessen': '⚡',
        'anzugsmomente': '🔧',
        'kontaktanordnungen': '🔢',
        'identifikation': '🏷️'
      }
    });
    
    // Baugrößen (legacy)
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
    
    // Kontaktgrößen (legacy)
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
    
    // Anzugsmomente (legacy)
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
    
    // ═══════════════════════════════════════════════════════════════════════════
    // PEŁNE RENDEROWANIE - każda sekcja jako osobna karta
    // ═══════════════════════════════════════════════════════════════════════════
    this.renderAlleSekcje(daten, 'teil5', 'schirmung', 'VG 96936', {
      skip: ['teil', 'titel', 'version', 'letzte_aktualisierung', 'beschreibung'],
      icons: {
        'normenstruktur': '📜',
        'anwendungsbereiche': '🎯',
        'metallgeflechte_vg96936_10': '🔩',
        'geflechtmaterialien': '🧪',
        'geflechtgroessen': '📏',
        'verarbeitung': '🔧'
      }
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
    
    // ═══════════════════════════════════════════════════════════════════════════
    // PEŁNE RENDEROWANIE WSZYSTKICH SEKCJI
    // ═══════════════════════════════════════════════════════════════════════════
    this.renderAlleSekcje(daten, 'teil6', 'schrumpfen', 'VG 95343', {
      skip: ['teil', 'titel', 'version', 'letzte_aktualisierung', 'beschreibung', 'geltende_norm'],
      icons: {
        'normenstruktur': '📜',
        'anwendungsbereiche': '🎯',
        'typen': '📋',
        'mil_spec_vergleich': '🔄',
        'verarbeitungshinweise': '🔧',
        'temperaturprofile': '🌡️'
      }
    });
    
    // Für jeden Schrumpfschlauch-Typ eine Karte (legacy)
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
    
    // MIL-SPEC Vergleich (legacy)
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
    
    // ═══════════════════════════════════════════════════════════════════════════
    // PEŁNE RENDEROWANIE WSZYSTKICH SEKCJI
    // ═══════════════════════════════════════════════════════════════════════════
    this.renderAlleSekcje(daten, 'teil7', 'crimpen', 'IPC/WHMA-A-620', {
      skip: ['teil', 'titel', 'version', 'letzte_aktualisierung', 'beschreibung', 'geltende_norm'],
      icons: {
        'normuebersicht': '📜',
        'crimpkriterien_klasse_3': '🔧',
        'crimp_kriterien': '✅',
        'zugkraefte': '💪',
        'loet_kriterien': '🔥',
        'kabelverarbeitung': '🔌',
        'isolationsbearbeitung': '📏'
      }
    });
    
    // Crimp-Kriterien (legacy)
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
    
    // Zugkräfte (legacy)
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
    
    // ═══════════════════════════════════════════════════════════════════════════
    // PEŁNE RENDEROWANIE WSZYSTKICH SEKCJI
    // ═══════════════════════════════════════════════════════════════════════════
    this.renderAlleSekcje(daten, 'teil8', 'pruefung', 'ISO 9001 / VG', {
      skip: ['teil', 'titel', 'version', 'letzte_aktualisierung', 'beschreibung'],
      icons: {
        'qualitaetssystem': '✅',
        'wareneingangspruefung': '📦',
        'fertigungsbegleitende_pruefung': '🔍',
        'pruefmittel': '📏',
        'dokumentation': '📋',
        'fehlermanagement': '🔍',
        'schulung': '👨‍🏫'
      }
    });
    
    // Wareneingangsprüfung (legacy)
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
    
    // Prüfmittel (legacy)
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
    
    // 8D-Report (legacy)
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
    
    // ═══════════════════════════════════════════════════════════════════════════
    // PEŁNE RENDEROWANIE WSZYSTKICH SEKCJI
    // ═══════════════════════════════════════════════════════════════════════════
    this.renderAlleSekcje(daten, 'teil9', 'pruefung', 'ISO 2859-1', {
      skip: ['teil', 'titel', 'version', 'letzte_aktualisierung', 'beschreibung', 'tabellen'],
      icons: {
        'grundlagen': '📘',
        'fehlerklassifizierung': '❌',
        'aql_werte_vg96927': '📊',
        'stichprobenplaene': '📋',
        'schnellreferenz': '⚡'
      }
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
    
    // Schnellreferenz (legacy)
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
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // UNIWERSALNE RENDEROWANIE WSZYSTKICH SEKCJI
  // Dla TEIL bez struktury kapitel (TEIL 4-9)
  // ═══════════════════════════════════════════════════════════════════════════════
  
  /**
   * Renderuje wszystkie sekcje z danych jako osobne karty
   * @param {Object} daten - Dane TEIL
   * @param {string} teilPrefix - Prefiks ID (np. 'teil4')
   * @param {string} category - Kategoria karty
   * @param {string} norm - Nazwa normy
   * @param {Object} options - Opcje {skip: [], icons: {}}
   */
  renderAlleSekcje(daten, teilPrefix, category, norm, options = {}) {
    const skip = options.skip || ['teil', 'titel', 'version', 'letzte_aktualisierung', 'beschreibung'];
    const icons = options.icons || {};
    
    Object.entries(daten).forEach(([key, value]) => {
      // Pomiń klucze meta
      if (skip.includes(key)) return;
      if (value === null || value === undefined) return;
      
      const formattedTitle = this.formatHeader(key);
      const icon = icons[key] || this.sekcjaIcon(key);
      
      // Generuj pełną zawartość HTML
      const content = this.sekcjaZuVollstaendigemHtml(key, value);
      
      // Generuj keywords
      const keywords = this.extrahiereSekcjaKeywords(key, value);
      
      this.karten.push({
        id: `${teilPrefix}-sekcja-${key.replace(/_/g, '-').toLowerCase()}`,
        category: category,
        type: 'detail',
        title: formattedTitle,
        icon: icon,
        norm: norm,
        description: this.sekcjaBeschreibung(value),
        keywords: [norm.toLowerCase(), key.replace(/_/g, ' '), ...keywords],
        content: content
      });
    });
  },
  
  /**
   * Renderuje sekcję do pełnego HTML
   */
  sekcjaZuVollstaendigemHtml(key, value) {
    if (value === null || value === undefined) return '<p>Keine Daten</p>';
    
    let html = '<div class="kapitel-vollstaendig">';
    html += this.renderKapitelElement(key, value);
    html += '</div>';
    return html;
  },
  
  /**
   * Wybiera ikonę dla sekcji na podstawie klucza
   */
  sekcjaIcon(key) {
    const keyLower = key.toLowerCase();
    
    if (keyLower.includes('norm')) return '📜';
    if (keyLower.includes('tabelle') || keyLower.includes('groesse')) return '📊';
    if (keyLower.includes('pruef') || keyLower.includes('test')) return '🔬';
    if (keyLower.includes('elektrisch')) return '⚡';
    if (keyLower.includes('mechanisch')) return '🔧';
    if (keyLower.includes('material')) return '🧪';
    if (keyLower.includes('temp')) return '🌡️';
    if (keyLower.includes('anwendung')) return '🎯';
    if (keyLower.includes('fehler') || keyLower.includes('defekt')) return '❌';
    if (keyLower.includes('qualit')) return '✅';
    if (keyLower.includes('crimp')) return '🔧';
    if (keyLower.includes('loet') || keyLower.includes('solder')) return '🔥';
    if (keyLower.includes('kabel') || keyLower.includes('draht')) return '🔌';
    if (keyLower.includes('kontakt')) return '⚡';
    if (keyLower.includes('schirm') || keyLower.includes('abschirm')) return '🛡️';
    if (keyLower.includes('schrumpf')) return '🔥';
    if (keyLower.includes('formular') || keyLower.includes('dokument')) return '📋';
    if (keyLower.includes('schnell') || keyLower.includes('referenz')) return '⚡';
    if (keyLower.includes('grundlag')) return '📘';
    if (keyLower.includes('aql') || keyLower.includes('stichprob')) return '📊';
    
    return '📄';
  },
  
  /**
   * Generuje opis sekcji
   */
  sekcjaBeschreibung(value) {
    if (!value) return '';
    
    if (typeof value === 'string') {
      return value.length > 150 ? value.substring(0, 150) + '...' : value;
    }
    
    if (value.beschreibung) return value.beschreibung;
    if (value.titel) return value.titel;
    
    if (Array.isArray(value)) {
      if (value.length > 0) {
        if (typeof value[0] === 'string') {
          return value.slice(0, 2).join(', ') + (value.length > 2 ? '...' : '');
        }
        return `${value.length} Einträge`;
      }
    }
    
    if (typeof value === 'object') {
      const keys = Object.keys(value).slice(0, 3);
      return `Enthält: ${keys.map(k => this.formatHeader(k)).join(', ')}`;
    }
    
    return '';
  },
  
  /**
   * Ekstrahuje keywords z sekcji
   */
  extrahiereSekcjaKeywords(key, value) {
    const keywords = new Set();
    
    // Dodaj słowa z klucza
    key.split('_').forEach(word => {
      if (word.length > 2) keywords.add(word.toLowerCase());
    });
    
    // Szukaj specjalnych słów w wartościach
    const text = JSON.stringify(value).toLowerCase();
    const specialWords = ['awg', 'mm²', 'mm2', 'ohm', '°c', 'nm', 'mpa', 'vg', 'mil', 'ipc', 'iso', 
                          'din', 'crimp', 'hipot', 'isolation', 'widerstand', 'temperatur'];
    specialWords.forEach(word => {
      if (text.includes(word)) keywords.add(word);
    });
    
    return Array.from(keywords).slice(0, 8);
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // VOLLSTÄNDIGES KAPITEL-RENDERING - ALLE DATEN ANZEIGEN
  // ═══════════════════════════════════════════════════════════════════════════════
  
  /**
   * Renderuje kapitel do pełnego HTML ze WSZYSTKIMI danymi
   */
  kapitelZuVollstaendigemHtml(kapitel) {
    if (!kapitel) return '<p>Keine Daten</p>';
    
    let html = '<div class="kapitel-vollstaendig">';
    
    // Iteruj przez wszystkie klucze kapitel i renderuj odpowiednio
    Object.entries(kapitel).forEach(([key, value]) => {
      if (key === 'id' || key === 'title') return; // Skip meta keys
      
      html += this.renderKapitelElement(key, value);
    });
    
    html += '</div>';
    return html;
  },
  
  /**
   * Renderuje pojedynczy element kapitel
   */
  renderKapitelElement(key, value) {
    if (value === null || value === undefined) return '';
    
    let html = '';
    const formattedKey = this.formatHeader(key);
    
    // Tablice
    if (Array.isArray(value)) {
      if (value.length === 0) return '';
      
      // Sprawdź czy to tablica obiektów (tabela) czy prostych wartości (lista)
      if (typeof value[0] === 'object' && value[0] !== null) {
        // To tabela danych
        html += `<div class="kapitel-sektion">`;
        html += `<h4>📊 ${formattedKey}</h4>`;
        html += this.arrayZuTabelleHtml(value);
        html += '</div>';
      } else {
        // To prosta lista
        html += `<div class="kapitel-sektion">`;
        html += `<h4>📋 ${formattedKey}</h4>`;
        html += '<ul class="kapitel-liste">';
        value.forEach(item => {
          html += `<li>${item}</li>`;
        });
        html += '</ul></div>';
      }
    }
    // Obiekty (zagnieżdżone dane)
    else if (typeof value === 'object') {
      html += `<div class="kapitel-sektion">`;
      html += `<h4>📁 ${formattedKey}</h4>`;
      html += this.objektZuHtml(value);
      html += '</div>';
    }
    // Proste wartości
    else {
      html += `<p><strong>${formattedKey}:</strong> ${value}</p>`;
    }
    
    return html;
  },
  
  /**
   * Konwertuje tablicę obiektów do tabeli HTML
   */
  arrayZuTabelleHtml(arr) {
    if (!arr || arr.length === 0) return '<p>Keine Daten</p>';
    
    const headers = Object.keys(arr[0]);
    let html = '<div class="table-scroll"><table class="data-table kapitel-tabelle"><thead><tr>';
    headers.forEach(h => html += `<th>${this.formatHeader(h)}</th>`);
    html += '</tr></thead><tbody>';
    
    arr.forEach(row => {
      html += '<tr>';
      headers.forEach(h => {
        const val = row[h];
        if (typeof val === 'object' && val !== null) {
          html += `<td>${JSON.stringify(val)}</td>`;
        } else {
          html += `<td>${val ?? '-'}</td>`;
        }
      });
      html += '</tr>';
    });
    
    html += '</tbody></table></div>';
    return html;
  },
  
  /**
   * Konwertuje zagnieżdżony obiekt do HTML
   */
  objektZuHtml(obj) {
    if (!obj) return '';
    
    let html = '<div class="objekt-inhalt">';
    
    Object.entries(obj).forEach(([key, value]) => {
      const formattedKey = this.formatHeader(key);
      
      if (Array.isArray(value)) {
        if (value.length > 0 && typeof value[0] === 'object') {
          // Tabela
          html += `<div class="sub-sektion"><h5>${formattedKey}</h5>`;
          html += this.arrayZuTabelleHtml(value);
          html += '</div>';
        } else {
          // Lista
          html += `<div class="sub-sektion"><h5>${formattedKey}</h5><ul>`;
          value.forEach(item => html += `<li>${item}</li>`);
          html += '</ul></div>';
        }
      } else if (typeof value === 'object' && value !== null) {
        // Zagnieżdżony obiekt - specjalna obsługa dla vergleichstabelle, grenzwerte itd.
        if (value.headers && value.rows) {
          // To specjalna tabela z headers/rows
          html += `<div class="sub-sektion"><h5>${formattedKey}</h5>`;
          html += this.vergleichstabelleZuHtml(value);
          html += '</div>';
        } else {
          // Zwykły zagnieżdżony obiekt
          html += `<div class="sub-sektion"><h5>${formattedKey}</h5>`;
          html += '<table class="data-table eigenschaften-tabelle"><tbody>';
          Object.entries(value).forEach(([k, v]) => {
            if (typeof v !== 'object') {
              html += `<tr><td><strong>${this.formatHeader(k)}</strong></td><td>${v}</td></tr>`;
            } else if (Array.isArray(v)) {
              html += `<tr><td><strong>${this.formatHeader(k)}</strong></td><td>${v.join(', ')}</td></tr>`;
            }
          });
          html += '</tbody></table></div>';
        }
      } else {
        // Prosta wartość
        html += `<p><strong>${formattedKey}:</strong> ${value}</p>`;
      }
    });
    
    html += '</div>';
    return html;
  },
  
  /**
   * Renderuje tabelę porównawczą (vergleichstabelle) ze specjalną strukturą headers/rows
   */
  vergleichstabelleZuHtml(tabelle) {
    if (!tabelle || !tabelle.headers || !tabelle.rows) return '<p>Keine Daten</p>';
    
    let html = '<div class="table-scroll"><table class="data-table vergleichstabelle"><thead><tr>';
    tabelle.headers.forEach(h => html += `<th>${h}</th>`);
    html += '</tr></thead><tbody>';
    
    tabelle.rows.forEach(row => {
      html += '<tr>';
      // Row może być obiektem z kluczami odpowiadającymi nagłówkom
      if (row.parameter !== undefined) {
        // Specjalny format z parameter i wartościami A, E, G, H
        html += `<td><strong>${row.parameter}</strong></td>`;
        tabelle.headers.slice(1).forEach(h => {
          const key = h.replace('TYP ', '');
          html += `<td>${row[key] ?? '-'}</td>`;
        });
      } else if (row.laenge !== undefined) {
        // Format grenzwerte z laenge
        html += `<td><strong>${row.laenge}</strong></td>`;
        Object.entries(row).forEach(([k, v]) => {
          if (k !== 'laenge') html += `<td>${v}</td>`;
        });
      } else {
        // Generyczny format - użyj wszystkich wartości
        Object.values(row).forEach(v => html += `<td>${v ?? '-'}</td>`);
      }
      html += '</tr>';
    });
    
    html += '</tbody></table></div>';
    return html;
  },
  
  /**
   * Wybiera odpowiednią ikonę dla kapitel na podstawie tytułu
   */
  kapitelIcon(title) {
    const titleLower = (title || '').toLowerCase();
    
    if (titleLower.includes('übersicht') || titleLower.includes('einführung')) return '📘';
    if (titleLower.includes('typ') && titleLower.includes('detail')) return '📋';
    if (titleLower.includes('tabelle') || titleLower.includes('dimension')) return '📊';
    if (titleLower.includes('prüfung') || titleLower.includes('test')) return '🔬';
    if (titleLower.includes('elektrisch')) return '⚡';
    if (titleLower.includes('mechanisch')) return '🔧';
    if (titleLower.includes('farb') || titleLower.includes('kodierung')) return '🎨';
    if (titleLower.includes('toleranz') || titleLower.includes('grenz')) return '📏';
    if (titleLower.includes('lager') || titleLower.includes('handhabung')) return '📦';
    if (titleLower.includes('norm')) return '📜';
    if (titleLower.includes('schnell') || titleLower.includes('referenz')) return '⚡';
    if (titleLower.includes('material')) return '🧪';
    if (titleLower.includes('temp')) return '🌡️';
    
    return '📄';
  },
  
  /**
   * Generuje opis kapitel z pierwszych danych
   */
  kapitelBeschreibung(kapitel) {
    if (!kapitel) return '';
    
    // Spróbuj znaleźć sensowny opis
    const keys = Object.keys(kapitel).filter(k => k !== 'id' && k !== 'title');
    
    for (const key of keys) {
      const val = kapitel[key];
      if (typeof val === 'string' && val.length > 10 && val.length < 200) {
        return val;
      }
      if (val && val.beschreibung) {
        return val.beschreibung;
      }
    }
    
    // Generuj opis z kluczy
    const beschreibung = keys.slice(0, 3).map(k => this.formatHeader(k)).join(', ');
    return beschreibung ? `Enthält: ${beschreibung}` : '';
  },
  
  /**
   * Ekstrahuje keywords z kapitel
   */
  extrahiereKeywords(kapitel) {
    if (!kapitel) return [];
    
    const keywords = new Set();
    const title = (kapitel.title || '').toLowerCase();
    
    // Dodaj słowa z tytułu
    title.split(/\s+/).forEach(word => {
      if (word.length > 3) keywords.add(word);
    });
    
    // Dodaj nazwy kluczy
    Object.keys(kapitel).forEach(key => {
      if (key !== 'id' && key !== 'title') {
        keywords.add(key.toLowerCase().replace(/_/g, ' '));
      }
    });
    
    // Szukaj specjalnych słów w wartościach
    const text = JSON.stringify(kapitel).toLowerCase();
    const specialWords = ['°c', 'mm²', 'awg', 'ohm', 'typ a', 'typ e', 'typ g', 'typ h', 
                          'silber', 'zinn', 'kupfer', 'isolation', 'widerstand', 'durchmesser'];
    specialWords.forEach(word => {
      if (text.includes(word)) keywords.add(word);
    });
    
    return Array.from(keywords).slice(0, 10);
  }
};

// Export für globalen Zugriff
window.WissensbasisLoader = WissensbasisLoader;
