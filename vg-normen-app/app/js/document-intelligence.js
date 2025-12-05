/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * DOCUMENT INTELLIGENCE - Zaawansowana Analiza Dokumentów
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Automatyczna analiza dokumentów PDF/DOCX:
 * - Ekstrakcja struktury (nagłówki, sekcje, paragrafy)
 * - Tworzenie mapy dokumentu (Table of Contents)
 * - Automatyczne wykrywanie słów kluczowych
 * - Rozpoznawanie norm VG/MIL/IPC
 * - Wykrywanie tabel i list
 * - Tworzenie relacji między dokumentami
 * - Integracja z encyklopedią
 * 
 * @author VG-Normen Wissenssystem
 * @version 2.0
 */

class DocumentIntelligence {
  constructor() {
    // Wzorce do rozpoznawania
    this.patterns = {
      // Normy i specyfikacje
      vgNorm: /VG\s*(\d{5})(?:[-\s](\d+))?/gi,
      milSpec: /MIL[-\s]?([A-Z]+)[-\s]?(\d+)([A-Z])?/gi,
      ipcStandard: /IPC[-\/\s]?(WHMA[-\s]?)?([A-Z]?[-\s]?\d+[A-Z]?)/gi,
      din: /DIN\s*(EN\s*)?(ISO\s*)?(\d+)(?:[-\s](\d+))?/gi,
      
      // Nagłówki i struktura
      numberedHeading: /^(\d+(?:\.\d+)*)\s+(.+)$/gm,
      romanHeading: /^([IVXLCDM]+)\.\s+(.+)$/gm,
      letterHeading: /^([A-Z])\.\s+(.+)$/gm,
      
      // Techniczne
      measurements: /(\d+(?:[.,]\d+)?)\s*(mm|cm|m|µm|inch|mil|AWG|°C|°F|%|Ω|kΩ|MΩ|V|mV|A|mA|N|kN|MPa|bar)/gi,
      partNumbers: /[A-Z]{2,4}[-\s]?\d{4,}[-\s]?[A-Z0-9]*/g,
      wireGauge: /AWG\s*(\d+)/gi,
      
      // Tabele
      tableIndicator: /Tabelle\s*(\d+)|Table\s*(\d+)|Tab\.\s*(\d+)/gi,
      figureIndicator: /Abbildung\s*(\d+)|Bild\s*(\d+)|Figure\s*(\d+)|Abb\.\s*(\d+)/gi
    };
    
    // Słowa kluczowe dla kategorii
    this.categoryKeywords = {
      crimp: ['crimp', 'crimpen', 'crimpung', 'crimpverbindung', 'crimphöhe', 'crimpkontakt', 'anpressung', 'verpressung', 'presswerkzeug'],
      kabel: ['kabel', 'draht', 'leiter', 'litze', 'ader', 'mantel', 'isolierung', 'abschirmung', 'querschnitt', 'awg'],
      stecker: ['stecker', 'steckverbinder', 'kontakt', 'buchse', 'pin', 'gehäuse', 'kodierung', 'verriegelung', 'rastung'],
      schrumpf: ['schrumpf', 'schrumpfschlauch', 'wärmeschrumpf', 'shrink', 'heat-shrink', 'schrumpfverhältnis'],
      pruefung: ['prüfung', 'test', 'messung', 'kontrolle', 'inspektion', 'qualität', 'fehler', 'mangel', 'akzeptanz'],
      loeten: ['löten', 'lötung', 'lötverbindung', 'flussmittel', 'lot', 'temperatur', 'benetzung'],
      schirmung: ['schirmung', 'abschirmung', 'schirm', 'geflecht', 'folie', 'emc', 'emi', 'rfi']
    };
    
    // Wichtigkeits-Keywords
    this.importanceKeywords = {
      critical: ['muss', 'müssen', 'zwingend', 'unbedingt', 'kritisch', 'verboten', 'nicht zulässig', 'pflicht', 'required', 'mandatory', 'shall'],
      warning: ['warnung', 'achtung', 'vorsicht', 'gefahr', 'warning', 'caution', 'danger'],
      note: ['hinweis', 'anmerkung', 'note', 'bemerkung', 'tipp', 'empfehlung']
    };
    
    // Analysierte Dokumente Cache
    this.analyzedDocuments = new Map();
    this.documentRelations = new Map();
    
    this.isInitialized = false;
  }
  
  /**
   * Initialisierung
   */
  async init() {
    await this.loadFromStorage();
    this.isInitialized = true;
    console.log(`🧠 DocumentIntelligence initialisiert: ${this.analyzedDocuments.size} Dokumente im Cache`);
  }
  
  /**
   * Lädt gespeicherte Analysen aus IndexedDB
   */
  async loadFromStorage() {
    try {
      if (typeof IndexedDBStorage !== 'undefined') {
        const cached = await IndexedDBStorage.getSetting('documentIntelligence');
        if (cached) {
          this.analyzedDocuments = new Map(cached.documents || []);
          this.documentRelations = new Map(cached.relations || []);
        }
      }
    } catch (e) {
      console.warn('DocumentIntelligence: Konnte Cache nicht laden', e);
    }
  }
  
  /**
   * Speichert Analysen in IndexedDB
   */
  async saveToStorage() {
    try {
      if (typeof IndexedDBStorage !== 'undefined') {
        await IndexedDBStorage.saveSetting('documentIntelligence', {
          documents: Array.from(this.analyzedDocuments.entries()),
          relations: Array.from(this.documentRelations.entries()),
          lastUpdated: new Date().toISOString()
        });
      }
    } catch (e) {
      console.warn('DocumentIntelligence: Konnte nicht speichern', e);
    }
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // HAUPTANALYSE
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Vollständige Analyse eines Dokuments
   * @param {string} text - Extrahierter Text
   * @param {Object} metadata - Datei-Metadaten
   * @returns {Object} Vollständige Analyse
   */
  async analyzeDocument(text, metadata = {}) {
    console.log(`🧠 Analysiere Dokument: ${metadata.filename || 'Unbekannt'}`);
    
    const startTime = Date.now();
    
    // Basis-Analyse
    const analysis = {
      id: metadata.id || `doc_${Date.now()}`,
      filename: metadata.filename || 'unknown',
      fileType: metadata.fileType || 'unknown',
      fileSize: metadata.fileSize || 0,
      analyzedAt: new Date().toISOString(),
      
      // Statistiken
      stats: this.calculateStats(text),
      
      // Struktur
      structure: this.extractStructure(text),
      
      // Inhalte
      norms: this.extractNorms(text),
      keywords: this.extractKeywords(text),
      categories: this.detectCategories(text),
      measurements: this.extractMeasurements(text),
      tables: this.detectTables(text),
      figures: this.detectFigures(text),
      
      // Wichtige Stellen
      criticalSections: this.findCriticalSections(text),
      warnings: this.findWarnings(text),
      
      // Zusammenfassung
      summary: this.generateSummary(text),
      
      // Relationen (werden später berechnet)
      relatedDocuments: [],
      relatedMedia: [],
      relatedSections: []
    };
    
    // Berechne Relationen zu anderen Dokumenten
    analysis.relatedDocuments = this.findRelatedDocuments(analysis);
    analysis.relatedMedia = this.findRelatedMedia(analysis);
    analysis.relatedSections = this.findRelatedSections(analysis);
    
    // Speichern
    this.analyzedDocuments.set(analysis.id, analysis);
    await this.saveToStorage();
    
    const duration = Date.now() - startTime;
    console.log(`✅ Analyse abgeschlossen in ${duration}ms:`, {
      sections: analysis.structure.sections.length,
      keywords: analysis.keywords.length,
      norms: analysis.norms.length,
      relations: analysis.relatedDocuments.length
    });
    
    return analysis;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // STATISTIKEN
  // ═══════════════════════════════════════════════════════════════════════════
  
  calculateStats(text) {
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const lines = text.split('\n');
    
    return {
      characters: text.length,
      words: words.length,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      lines: lines.length,
      avgWordsPerSentence: Math.round(words.length / Math.max(sentences.length, 1)),
      estimatedPages: Math.ceil(words.length / 300), // ~300 Wörter pro Seite
      readingTimeMinutes: Math.ceil(words.length / 200) // ~200 Wörter pro Minute
    };
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // STRUKTURERKENNUNG
  // ═══════════════════════════════════════════════════════════════════════════
  
  extractStructure(text) {
    const sections = [];
    const lines = text.split('\n');
    let currentPosition = 0;
    
    // Suche nach nummerierten Überschriften (1. , 1.1 , 1.1.1 etc.)
    const headingPattern = /^(\d+(?:\.\d+)*\.?)\s+(.+)$/;
    
    lines.forEach((line, lineIndex) => {
      const trimmed = line.trim();
      const match = trimmed.match(headingPattern);
      
      if (match) {
        const number = match[1].replace(/\.$/, '');
        const title = match[2].trim();
        const level = number.split('.').length;
        
        // Extrahiere Inhalt bis zur nächsten Überschrift
        let content = '';
        let nextHeadingIndex = lines.length;
        
        for (let i = lineIndex + 1; i < lines.length; i++) {
          if (lines[i].trim().match(headingPattern)) {
            nextHeadingIndex = i;
            break;
          }
          content += lines[i] + '\n';
        }
        
        sections.push({
          id: `section_${number.replace(/\./g, '_')}`,
          number: number,
          title: title,
          level: level,
          lineStart: lineIndex,
          lineEnd: nextHeadingIndex - 1,
          charStart: currentPosition,
          content: content.trim(),
          wordCount: content.split(/\s+/).filter(w => w).length,
          // Mini-Analyse der Sektion
          hasTable: /Tabelle|Table|Tab\./i.test(content),
          hasFigure: /Abbildung|Bild|Figure|Abb\./i.test(content),
          hasWarning: /Warnung|Achtung|Vorsicht/i.test(content),
          hasCritical: /muss|müssen|zwingend|verboten/i.test(content)
        });
      }
      
      currentPosition += line.length + 1;
    });
    
    // Erstelle hierarchische Struktur (TOC)
    const toc = this.buildTOC(sections);
    
    return {
      sections: sections,
      toc: toc,
      totalSections: sections.length,
      maxDepth: Math.max(...sections.map(s => s.level), 0)
    };
  }
  
  /**
   * Baut hierarchisches Inhaltsverzeichnis
   */
  buildTOC(sections) {
    const toc = [];
    const stack = [{ level: 0, children: toc }];
    
    sections.forEach(section => {
      const tocItem = {
        id: section.id,
        number: section.number,
        title: section.title,
        level: section.level,
        wordCount: section.wordCount,
        flags: {
          hasTable: section.hasTable,
          hasFigure: section.hasFigure,
          hasWarning: section.hasWarning,
          hasCritical: section.hasCritical
        },
        children: []
      };
      
      // Finde den richtigen Parent
      while (stack.length > 1 && stack[stack.length - 1].level >= section.level) {
        stack.pop();
      }
      
      stack[stack.length - 1].children.push(tocItem);
      stack.push({ level: section.level, children: tocItem.children });
    });
    
    return toc;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // NORM-ERKENNUNG
  // ═══════════════════════════════════════════════════════════════════════════
  
  extractNorms(text) {
    const norms = new Map();
    
    // VG-Normen
    let match;
    while ((match = this.patterns.vgNorm.exec(text)) !== null) {
      const normId = `VG ${match[1]}${match[2] ? '-' + match[2] : ''}`;
      if (!norms.has(normId)) {
        norms.set(normId, {
          id: normId,
          type: 'VG',
          number: match[1],
          part: match[2] || null,
          count: 1,
          positions: [match.index]
        });
      } else {
        const norm = norms.get(normId);
        norm.count++;
        norm.positions.push(match.index);
      }
    }
    
    // MIL-SPEC
    this.patterns.milSpec.lastIndex = 0;
    while ((match = this.patterns.milSpec.exec(text)) !== null) {
      const normId = `MIL-${match[1]}-${match[2]}${match[3] || ''}`;
      if (!norms.has(normId)) {
        norms.set(normId, {
          id: normId,
          type: 'MIL',
          spec: match[1],
          number: match[2],
          revision: match[3] || null,
          count: 1,
          positions: [match.index]
        });
      } else {
        norms.get(normId).count++;
      }
    }
    
    // IPC Standards
    this.patterns.ipcStandard.lastIndex = 0;
    while ((match = this.patterns.ipcStandard.exec(text)) !== null) {
      const normId = `IPC${match[1] ? '-WHMA' : ''}-${match[2]}`;
      if (!norms.has(normId)) {
        norms.set(normId, {
          id: normId,
          type: 'IPC',
          isWHMA: !!match[1],
          number: match[2],
          count: 1,
          positions: [match.index]
        });
      } else {
        norms.get(normId).count++;
      }
    }
    
    // DIN/EN/ISO
    this.patterns.din.lastIndex = 0;
    while ((match = this.patterns.din.exec(text)) !== null) {
      const normId = `DIN${match[1] ? ' EN' : ''}${match[2] ? ' ISO' : ''} ${match[3]}${match[4] ? '-' + match[4] : ''}`;
      if (!norms.has(normId)) {
        norms.set(normId, {
          id: normId,
          type: 'DIN',
          isEN: !!match[1],
          isISO: !!match[2],
          number: match[3],
          part: match[4] || null,
          count: 1,
          positions: [match.index]
        });
      } else {
        norms.get(normId).count++;
      }
    }
    
    // Sortiere nach Häufigkeit
    return Array.from(norms.values()).sort((a, b) => b.count - a.count);
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // KEYWORD-EXTRAKTION
  // ═══════════════════════════════════════════════════════════════════════════
  
  extractKeywords(text) {
    const keywords = new Map();
    const words = text.toLowerCase()
      .replace(/[^a-zäöüß0-9\s-]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length >= 3);
    
    // Zähle Worthäufigkeiten
    const wordFreq = new Map();
    words.forEach(word => {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    });
    
    // Filtere Stoppwörter
    const stopWords = new Set([
      'der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einer', 'eines',
      'und', 'oder', 'aber', 'wenn', 'dann', 'als', 'auch', 'nur', 'noch', 'schon',
      'ist', 'sind', 'war', 'waren', 'wird', 'werden', 'wurde', 'wurden', 'hat', 'haben',
      'bei', 'mit', 'von', 'für', 'auf', 'aus', 'nach', 'vor', 'über', 'unter',
      'nicht', 'kein', 'keine', 'kann', 'können', 'muss', 'müssen', 'soll', 'sollen',
      'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'was', 'one', 'our',
      'this', 'that', 'with', 'have', 'from', 'they', 'been', 'will', 'which', 'their'
    ]);
    
    // Technische Keywords mit höherem Gewicht
    const techBoost = new Set([
      'crimp', 'kabel', 'draht', 'stecker', 'kontakt', 'löten', 'prüfung', 'test',
      'isolierung', 'schirmung', 'schrumpf', 'querschnitt', 'widerstand', 'spannung',
      'temperatur', 'druck', 'kraft', 'zugkraft', 'messung', 'toleranz'
    ]);
    
    // Filtere und gewichte
    wordFreq.forEach((count, word) => {
      if (stopWords.has(word) || count < 2) return;
      
      let score = count;
      if (techBoost.has(word)) score *= 2;
      if (word.match(/^\d+$/)) return; // Nur Zahlen ignorieren
      
      keywords.set(word, {
        word: word,
        count: count,
        score: score,
        isTechnical: techBoost.has(word)
      });
    });
    
    // Finde auch Bigrams (2-Wort-Kombinationen)
    for (let i = 0; i < words.length - 1; i++) {
      const bigram = `${words[i]} ${words[i + 1]}`;
      if (bigram.length >= 6 && !stopWords.has(words[i]) && !stopWords.has(words[i + 1])) {
        const existing = keywords.get(bigram);
        if (existing) {
          existing.count++;
          existing.score += 3; // Bigrams sind wertvoller
        } else {
          keywords.set(bigram, {
            word: bigram,
            count: 1,
            score: 3,
            isBigram: true
          });
        }
      }
    }
    
    // Top Keywords zurückgeben
    return Array.from(keywords.values())
      .filter(k => k.score >= 3)
      .sort((a, b) => b.score - a.score)
      .slice(0, 50);
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // KATEGORIE-ERKENNUNG
  // ═══════════════════════════════════════════════════════════════════════════
  
  detectCategories(text) {
    const textLower = text.toLowerCase();
    const categories = [];
    
    Object.entries(this.categoryKeywords).forEach(([category, keywords]) => {
      let score = 0;
      const matches = [];
      
      keywords.forEach(keyword => {
        const regex = new RegExp(keyword, 'gi');
        const found = textLower.match(regex);
        if (found) {
          score += found.length;
          matches.push({ keyword, count: found.length });
        }
      });
      
      if (score > 0) {
        categories.push({
          id: category,
          name: this.getCategoryName(category),
          score: score,
          matches: matches.sort((a, b) => b.count - a.count),
          confidence: Math.min(score / 10, 1) // 0-1
        });
      }
    });
    
    return categories.sort((a, b) => b.score - a.score);
  }
  
  getCategoryName(id) {
    const names = {
      crimp: 'Crimpverbindungen',
      kabel: 'Kabel & Drähte',
      stecker: 'Steckverbinder',
      schrumpf: 'Schrumpfschläuche',
      pruefung: 'Prüfung & Qualität',
      loeten: 'Löttechnik',
      schirmung: 'Abschirmung & EMV'
    };
    return names[id] || id;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // MESSWERTE & TECHNISCHE DATEN
  // ═══════════════════════════════════════════════════════════════════════════
  
  extractMeasurements(text) {
    const measurements = [];
    let match;
    
    this.patterns.measurements.lastIndex = 0;
    while ((match = this.patterns.measurements.exec(text)) !== null) {
      // Kontext um die Messung herum
      const start = Math.max(0, match.index - 50);
      const end = Math.min(text.length, match.index + match[0].length + 50);
      const context = text.substring(start, end).replace(/\s+/g, ' ').trim();
      
      measurements.push({
        value: parseFloat(match[1].replace(',', '.')),
        unit: match[2],
        raw: match[0],
        context: context,
        position: match.index
      });
    }
    
    // Gruppiere nach Einheit
    const grouped = {};
    measurements.forEach(m => {
      if (!grouped[m.unit]) {
        grouped[m.unit] = [];
      }
      grouped[m.unit].push(m);
    });
    
    return {
      all: measurements,
      byUnit: grouped,
      totalCount: measurements.length
    };
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // TABELLEN & ABBILDUNGEN
  // ═══════════════════════════════════════════════════════════════════════════
  
  detectTables(text) {
    const tables = [];
    let match;
    
    this.patterns.tableIndicator.lastIndex = 0;
    while ((match = this.patterns.tableIndicator.exec(text)) !== null) {
      const number = match[1] || match[2] || match[3];
      
      // Kontext für Tabellenbeschriftung
      const start = Math.max(0, match.index - 10);
      const end = Math.min(text.length, match.index + 200);
      const context = text.substring(start, end);
      
      // Versuche Titel zu extrahieren
      const titleMatch = context.match(/(?:Tabelle|Table|Tab\.)\s*\d+[:\s-]*([^\n]+)/i);
      
      tables.push({
        number: parseInt(number),
        title: titleMatch ? titleMatch[1].trim() : null,
        position: match.index,
        raw: match[0]
      });
    }
    
    return tables.sort((a, b) => a.number - b.number);
  }
  
  detectFigures(text) {
    const figures = [];
    let match;
    
    this.patterns.figureIndicator.lastIndex = 0;
    while ((match = this.patterns.figureIndicator.exec(text)) !== null) {
      const number = match[1] || match[2] || match[3] || match[4];
      
      const start = Math.max(0, match.index - 10);
      const end = Math.min(text.length, match.index + 200);
      const context = text.substring(start, end);
      
      const titleMatch = context.match(/(?:Abbildung|Bild|Figure|Abb\.)\s*\d+[:\s-]*([^\n]+)/i);
      
      figures.push({
        number: parseInt(number),
        title: titleMatch ? titleMatch[1].trim() : null,
        position: match.index,
        raw: match[0]
      });
    }
    
    return figures.sort((a, b) => a.number - b.number);
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // KRITISCHE STELLEN & WARNUNGEN
  // ═══════════════════════════════════════════════════════════════════════════
  
  findCriticalSections(text) {
    const critical = [];
    const sentences = text.split(/[.!?]+/);
    
    sentences.forEach((sentence, index) => {
      const lower = sentence.toLowerCase();
      
      for (const keyword of this.importanceKeywords.critical) {
        if (lower.includes(keyword)) {
          critical.push({
            type: 'critical',
            keyword: keyword,
            text: sentence.trim(),
            position: index
          });
          break;
        }
      }
    });
    
    return critical;
  }
  
  findWarnings(text) {
    const warnings = [];
    const lines = text.split('\n');
    
    lines.forEach((line, index) => {
      const lower = line.toLowerCase();
      
      for (const keyword of this.importanceKeywords.warning) {
        if (lower.includes(keyword)) {
          warnings.push({
            type: 'warning',
            keyword: keyword,
            text: line.trim(),
            lineNumber: index + 1
          });
          break;
        }
      }
    });
    
    return warnings;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // ZUSAMMENFASSUNG
  // ═══════════════════════════════════════════════════════════════════════════
  
  generateSummary(text) {
    // Erste Sätze als Zusammenfassung
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const firstSentences = sentences.slice(0, 3).map(s => s.trim()).join('. ');
    
    // Hauptthemen aus Keywords
    const keywords = this.extractKeywords(text).slice(0, 5).map(k => k.word);
    
    return {
      abstract: firstSentences.substring(0, 500) + (firstSentences.length > 500 ? '...' : '.'),
      mainTopics: keywords,
      generatedAt: new Date().toISOString()
    };
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // RELATIONEN
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Findet verwandte Dokumente basierend auf Keywords und Normen
   */
  findRelatedDocuments(analysis) {
    const related = [];
    
    // Vergleiche mit allen anderen analysierten Dokumenten
    this.analyzedDocuments.forEach((otherDoc, id) => {
      if (id === analysis.id) return;
      
      let score = 0;
      const matchedKeywords = [];
      const matchedNorms = [];
      
      // Keyword-Übereinstimmung
      const thisKeywords = new Set(analysis.keywords.map(k => k.word));
      const otherKeywords = new Set(otherDoc.keywords.map(k => k.word));
      
      thisKeywords.forEach(kw => {
        if (otherKeywords.has(kw)) {
          score += 2;
          matchedKeywords.push(kw);
        }
      });
      
      // Norm-Übereinstimmung (höheres Gewicht)
      const thisNorms = new Set(analysis.norms.map(n => n.id));
      const otherNorms = new Set(otherDoc.norms.map(n => n.id));
      
      thisNorms.forEach(norm => {
        if (otherNorms.has(norm)) {
          score += 5;
          matchedNorms.push(norm);
        }
      });
      
      // Kategorie-Übereinstimmung
      const thisCategories = new Set(analysis.categories.map(c => c.id));
      const otherCategories = new Set(otherDoc.categories.map(c => c.id));
      
      thisCategories.forEach(cat => {
        if (otherCategories.has(cat)) {
          score += 3;
        }
      });
      
      if (score >= 5) {
        related.push({
          documentId: id,
          filename: otherDoc.filename,
          score: score,
          matchedKeywords: matchedKeywords.slice(0, 5),
          matchedNorms: matchedNorms,
          confidence: Math.min(score / 20, 1)
        });
      }
    });
    
    return related.sort((a, b) => b.score - a.score).slice(0, 10);
  }
  
  /**
   * Findet verwandte Medien (Bilder) aus MediaManager
   */
  findRelatedMedia(analysis) {
    const related = [];
    
    if (typeof mediaManager === 'undefined') return related;
    
    const keywords = new Set(analysis.keywords.map(k => k.word.toLowerCase()));
    const categories = new Set(analysis.categories.map(c => c.id));
    
    mediaManager.mediaItems.forEach(media => {
      let score = 0;
      
      // Kategorie-Match
      if (categories.has(media.category)) {
        score += 5;
      }
      
      // Tag-Match
      (media.tags || []).forEach(tag => {
        if (keywords.has(tag.toLowerCase())) {
          score += 2;
        }
      });
      
      // Titel-Match
      const titleWords = media.title.toLowerCase().split(/\s+/);
      titleWords.forEach(word => {
        if (keywords.has(word)) {
          score += 1;
        }
      });
      
      if (score >= 3) {
        related.push({
          mediaId: media.id,
          title: media.title,
          category: media.category,
          status: media.status,
          score: score
        });
      }
    });
    
    return related.sort((a, b) => b.score - a.score).slice(0, 5);
  }
  
  /**
   * Findet verwandte Sektionen aus MarkdownLoader
   */
  findRelatedSections(analysis) {
    const related = [];
    
    if (typeof MarkdownLoader === 'undefined' || !MarkdownLoader.sektionen) return related;
    
    const keywords = new Set(analysis.keywords.map(k => k.word.toLowerCase()));
    const norms = new Set(analysis.norms.map(n => n.id.toLowerCase().replace(/\s/g, '')));
    
    MarkdownLoader.sektionen.forEach(section => {
      let score = 0;
      
      // Norm im Titel
      norms.forEach(norm => {
        if (section.title.toLowerCase().includes(norm) || 
            (section.norm && section.norm.toLowerCase().includes(norm))) {
          score += 10;
        }
      });
      
      // Keyword-Match im Titel
      const titleWords = section.title.toLowerCase().split(/\s+/);
      titleWords.forEach(word => {
        if (keywords.has(word)) {
          score += 2;
        }
      });
      
      // Keyword-Match in Keywords
      (section.keywords || []).forEach(kw => {
        if (keywords.has(kw.toLowerCase())) {
          score += 3;
        }
      });
      
      if (score >= 5) {
        related.push({
          sectionId: section.id,
          title: section.title,
          teil: section.teil,
          category: section.category,
          score: score
        });
      }
    });
    
    return related.sort((a, b) => b.score - a.score).slice(0, 10);
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // ENCYKLOPEDIA-INTEGRATION
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Konvertiert analysiertes Dokument zu Encyklopedia-Einträgen
   */
  convertToEncyclopediaEntries(analysis) {
    const entries = [];
    
    // Haupteintrag für das Dokument
    entries.push({
      id: `doc_${analysis.id}`,
      type: 'imported_document',
      title: analysis.filename.replace(/\.[^/.]+$/, ''),
      icon: this.getDocumentIcon(analysis.fileType),
      description: analysis.summary.abstract,
      keywords: analysis.keywords.slice(0, 15).map(k => k.word),
      category: analysis.categories[0]?.id || 'sonstige',
      norms: analysis.norms.map(n => n.id),
      stats: analysis.stats,
      structure: analysis.structure,
      related: {
        documents: analysis.relatedDocuments,
        media: analysis.relatedMedia,
        sections: analysis.relatedSections
      },
      source: 'document_intelligence',
      analyzedAt: analysis.analyzedAt
    });
    
    // Einträge für wichtige Sektionen
    analysis.structure.sections
      .filter(s => s.level <= 2 && s.wordCount >= 50)
      .forEach(section => {
        entries.push({
          id: `doc_${analysis.id}_${section.id}`,
          type: 'document_section',
          parentId: `doc_${analysis.id}`,
          title: `${section.number} ${section.title}`,
          icon: section.hasCritical ? '⚠️' : section.hasTable ? '📊' : '📄',
          description: section.content.substring(0, 200) + '...',
          content: section.content,
          keywords: this.extractKeywords(section.content).slice(0, 5).map(k => k.word),
          flags: {
            hasTable: section.hasTable,
            hasFigure: section.hasFigure,
            hasWarning: section.hasWarning,
            hasCritical: section.hasCritical
          },
          source: 'document_intelligence'
        });
      });
    
    return entries;
  }
  
  getDocumentIcon(fileType) {
    const icons = {
      'application/pdf': '📕',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📘',
      'application/msword': '📘',
      'text/plain': '📄',
      'text/markdown': '📋'
    };
    return icons[fileType] || '📄';
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // UI RENDERING
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Rendert die Analyse-Ansicht für ein Dokument
   */
  renderAnalysisView(analysis) {
    const categories = analysis.categories.slice(0, 3);
    const mainCategory = categories[0];
    
    return `
      <div class="doc-intelligence-view">
        <!-- Header -->
        <div class="analysis-header">
          <div class="doc-icon">${this.getDocumentIcon(analysis.fileType)}</div>
          <div class="doc-info">
            <h2>${analysis.filename}</h2>
            <div class="doc-meta">
              <span>📄 ${analysis.stats.estimatedPages} Seiten</span>
              <span>📝 ${analysis.stats.words.toLocaleString()} Wörter</span>
              <span>⏱️ ~${analysis.stats.readingTimeMinutes} Min. Lesezeit</span>
            </div>
          </div>
          <div class="analysis-badge">
            <span class="badge badge-${mainCategory?.id || 'default'}">
              ${mainCategory?.name || 'Dokument'}
            </span>
          </div>
        </div>
        
        <!-- Zusammenfassung -->
        <div class="analysis-section">
          <h3>📋 Zusammenfassung</h3>
          <p class="summary-text">${analysis.summary.abstract}</p>
          <div class="main-topics">
            ${analysis.summary.mainTopics.map(t => `<span class="topic-tag">${t}</span>`).join('')}
          </div>
        </div>
        
        <!-- Erkannte Normen -->
        ${analysis.norms.length > 0 ? `
        <div class="analysis-section">
          <h3>📐 Erkannte Normen & Standards</h3>
          <div class="norms-grid">
            ${analysis.norms.slice(0, 10).map(norm => `
              <div class="norm-card norm-${norm.type.toLowerCase()}">
                <span class="norm-id">${norm.id}</span>
                <span class="norm-count">${norm.count}× erwähnt</span>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
        
        <!-- Inhaltsverzeichnis -->
        <div class="analysis-section">
          <h3>📑 Dokumentstruktur (${analysis.structure.totalSections} Abschnitte)</h3>
          <div class="toc-tree">
            ${this.renderTOCTree(analysis.structure.toc)}
          </div>
        </div>
        
        <!-- Keywords -->
        <div class="analysis-section">
          <h3>🏷️ Wichtige Begriffe</h3>
          <div class="keywords-cloud">
            ${analysis.keywords.slice(0, 20).map(kw => `
              <span class="keyword-tag ${kw.isTechnical ? 'technical' : ''}" 
                    style="font-size: ${Math.min(1.5, 0.8 + kw.score / 20)}em"
                    onclick="performSearchFromTag('${kw.word}')">
                ${kw.word}
              </span>
            `).join('')}
          </div>
        </div>
        
        <!-- Kritische Stellen -->
        ${analysis.criticalSections.length > 0 ? `
        <div class="analysis-section section-critical">
          <h3>⚠️ Wichtige Hinweise (${analysis.criticalSections.length})</h3>
          <div class="critical-list">
            ${analysis.criticalSections.slice(0, 5).map(c => `
              <div class="critical-item">
                <span class="critical-keyword">${c.keyword}</span>
                <p>${c.text.substring(0, 200)}...</p>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
        
        <!-- Verwandte Inhalte -->
        <div class="analysis-section">
          <h3>🔗 Verwandte Inhalte</h3>
          
          ${analysis.relatedSections.length > 0 ? `
          <div class="related-group">
            <h4>📚 Aus der Wissensbasis</h4>
            <div class="related-items">
              ${analysis.relatedSections.slice(0, 5).map(rel => `
                <div class="related-item" onclick="openItem('${rel.sectionId}')">
                  <span class="rel-icon">📄</span>
                  <span class="rel-title">${rel.title}</span>
                  <span class="rel-source">TEIL ${rel.teil}</span>
                </div>
              `).join('')}
            </div>
          </div>
          ` : ''}
          
          ${analysis.relatedMedia.length > 0 ? `
          <div class="related-group">
            <h4>📷 Bilder</h4>
            <div class="related-items">
              ${analysis.relatedMedia.map(rel => `
                <div class="related-item" onclick="mediaManager.openLightbox('${rel.mediaId}')">
                  <span class="rel-icon">📷</span>
                  <span class="rel-title">${rel.title}</span>
                  <span class="rel-status status-${rel.status}">${rel.status}</span>
                </div>
              `).join('')}
            </div>
          </div>
          ` : ''}
          
          ${analysis.relatedDocuments.length > 0 ? `
          <div class="related-group">
            <h4>📁 Ähnliche Dokumente</h4>
            <div class="related-items">
              ${analysis.relatedDocuments.map(rel => `
                <div class="related-item" onclick="openAnalyzedDocument('${rel.documentId}')">
                  <span class="rel-icon">📄</span>
                  <span class="rel-title">${rel.filename}</span>
                  <span class="rel-score">${Math.round(rel.confidence * 100)}% Übereinstimmung</span>
                </div>
              `).join('')}
            </div>
          </div>
          ` : ''}
        </div>
        
        <!-- Technische Daten -->
        ${analysis.measurements.totalCount > 0 ? `
        <div class="analysis-section">
          <h3>📏 Technische Messwerte</h3>
          <div class="measurements-summary">
            ${Object.entries(analysis.measurements.byUnit).slice(0, 6).map(([unit, values]) => `
              <div class="measurement-group">
                <span class="unit">${unit}</span>
                <span class="count">${values.length} Werte</span>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
      </div>
    `;
  }
  
  renderTOCTree(toc, level = 0) {
    if (!toc || toc.length === 0) return '';
    
    return `
      <ul class="toc-level toc-level-${level}">
        ${toc.map(item => `
          <li class="${item.flags?.hasCritical ? 'has-critical' : ''} ${item.flags?.hasWarning ? 'has-warning' : ''}">
            <div class="toc-item">
              <span class="toc-number">${item.number}</span>
              <span class="toc-title">${item.title}</span>
              <span class="toc-flags">
                ${item.flags?.hasTable ? '📊' : ''}
                ${item.flags?.hasFigure ? '🖼️' : ''}
                ${item.flags?.hasWarning ? '⚠️' : ''}
                ${item.flags?.hasCritical ? '❗' : ''}
              </span>
            </div>
            ${item.children?.length > 0 ? this.renderTOCTree(item.children, level + 1) : ''}
          </li>
        `).join('')}
      </ul>
    `;
  }
}

// Globale Instanz
const documentIntelligence = new DocumentIntelligence();

// Auto-Init
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => documentIntelligence.init());
} else {
  documentIntelligence.init();
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DocumentIntelligence;
}
