/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ADVANCED DOCUMENT PROCESSOR
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Potężny procesor dokumentów wykorzystujący:
 * - Lunr.js - zaawansowane wyszukiwanie full-text
 * - Flexsearch - ultraszybkie wyszukiwanie z autocomplete
 * - Compromise - NLP (rozpoznawanie języka naturalnego)
 * - Mark.js - podświetlanie wyników
 * 
 * Funkcje:
 * - Mapowanie każdej linijki dokumentu
 * - Ekstrakcja struktury (nagłówki, sekcje, tabele)
 * - Automatyczne linkowanie między dokumentami
 * - Inteligentne podpowiedzi
 * - Rozpoznawanie norm, jednostek, terminów technicznych
 * 
 * @author VG-Normen Wissenssystem
 * @version 1.0
 */

class AdvancedDocumentProcessor {
  constructor() {
    // Indeksy wyszukiwania
    this.lunrIndex = null;
    this.flexIndex = null;
    
    // Przechowywanie dokumentów
    this.documents = new Map();      // id -> pełny dokument
    this.lineIndex = new Map();       // lineId -> { docId, lineNumber, text, metadata }
    this.entityIndex = new Map();     // entity -> [{ docId, lineId, type }]
    this.linkGraph = new Map();       // docId -> [related docIds]
    
    // Konfiguracja NLP
    this.technicalPatterns = {
      // Normy
      vgNorm: /VG\s*(\d{5})(?:[-\s](\d+))?/gi,
      milSpec: /MIL[-\s]?([A-Z]+)[-\s]?(\d+)([A-Z])?/gi,
      ipcStandard: /IPC[-\/]?(WHMA[-\s]?)?([A-Z]?\d+[A-Z]?)/gi,
      dinNorm: /DIN\s*(EN\s*)?(ISO\s*)?(\d+)/gi,
      
      // Miary i jednostki
      measurement: /(\d+(?:[.,]\d+)?)\s*(mm|cm|m|µm|mil|inch|°C|°F|%|Ω|kΩ|MΩ|V|mV|A|mA|N|kN|MPa|bar|AWG)/gi,
      awgGauge: /AWG\s*(\d+)/gi,
      temperature: /(\d+(?:[.,]\d+)?)\s*°[CF]/gi,
      percentage: /(\d+(?:[.,]\d+)?)\s*%/gi,
      
      // Terminy techniczne
      crimpTerms: /crimp(?:höhe|verbindung|kontakt|zange|werkzeug)?/gi,
      wireTerms: /(?:draht|kabel|leiter|litze|ader)(?:querschnitt)?/gi,
      connectorTerms: /(?:steck(?:er|verbinder)|kontakt|buchse|pin)/gi,
      
      // Ważne słowa kluczowe
      critical: /(?:muss|müssen|zwingend|verboten|nicht zulässig|kritisch)/gi,
      warning: /(?:warnung|achtung|vorsicht|gefahr)/gi,
      quality: /(?:akzeptabel|nicht akzeptabel|gut|schlecht|mangel|fehler)/gi
    };
    
    // Stan
    this.isInitialized = false;
    this.stats = {
      totalDocuments: 0,
      totalLines: 0,
      totalEntities: 0,
      indexBuildTime: 0
    };
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════
  
  async init() {
    console.log('🚀 Advanced Document Processor startet...');
    const startTime = Date.now();
    
    // Inicjalizuj indeksy
    this.initLunrIndex();
    this.initFlexIndex();
    
    // Załaduj istniejące dokumenty
    await this.loadExistingDocuments();
    
    this.isInitialized = true;
    this.stats.indexBuildTime = Date.now() - startTime;
    
    console.log(`✅ Advanced Document Processor ready in ${this.stats.indexBuildTime}ms`);
    console.log(`📊 Stats: ${this.stats.totalDocuments} docs, ${this.stats.totalLines} lines, ${this.stats.totalEntities} entities`);
    
    return this;
  }
  
  /**
   * Inicjalizuje indeks Lunr.js
   */
  initLunrIndex() {
    if (typeof lunr === 'undefined') {
      console.warn('Lunr.js not loaded, using fallback search');
      return;
    }
    
    // Definicja schematu indeksu
    this.lunrBuilder = new lunr.Builder();
    this.lunrBuilder.ref('id');
    this.lunrBuilder.field('title', { boost: 10 });
    this.lunrBuilder.field('content', { boost: 5 });
    this.lunrBuilder.field('keywords', { boost: 8 });
    this.lunrBuilder.field('norms', { boost: 7 });
    this.lunrBuilder.field('entities', { boost: 6 });
    
    // Pipeline dla niemieckiego
    this.lunrBuilder.pipeline.remove(lunr.stemmer);
    this.lunrBuilder.pipeline.remove(lunr.stopWordFilter);
  }
  
  /**
   * Inicjalizuje indeks Flexsearch
   */
  initFlexIndex() {
    if (typeof FlexSearch === 'undefined') {
      console.warn('FlexSearch not loaded, using fallback');
      return;
    }
    
    // Główny indeks dokumentów
    this.flexIndex = new FlexSearch.Document({
      document: {
        id: 'id',
        index: ['title', 'content', 'keywords'],
        store: ['title', 'icon', 'category', 'snippet']
      },
      tokenize: 'forward',
      cache: 100,
      resolution: 9
    });
    
    // Indeks dla autocomplete (szybki)
    this.autocompleteIndex = new FlexSearch.Index({
      tokenize: 'forward',
      cache: true,
      resolution: 5
    });
  }
  
  /**
   * Załaduj istniejące dokumenty
   */
  async loadExistingDocuments() {
    // Z MarkdownLoader
    if (typeof MarkdownLoader !== 'undefined' && MarkdownLoader.sektionen) {
      MarkdownLoader.sektionen.forEach(sektion => {
        this.indexDocument({
          id: sektion.id,
          title: sektion.title,
          content: sektion.content || '',
          keywords: sektion.keywords || [],
          category: sektion.category,
          teil: sektion.teil,
          type: 'markdown',
          icon: sektion.icon || '📄'
        });
      });
    }
    
    // Z IndexedDB (zaimportowane)
    if (typeof IndexedDBStorage !== 'undefined') {
      try {
        const docs = await IndexedDBStorage.getAllDocuments();
        docs.forEach(doc => {
          this.indexDocument({
            id: `imported_${doc.id}`,
            title: doc.title,
            content: doc.content || '',
            keywords: doc.tags || [],
            category: doc.category,
            type: 'imported',
            icon: doc.formatIcon || '📄'
          });
        });
      } catch (e) {
        console.warn('Could not load from IndexedDB:', e);
      }
    }
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // DOCUMENT PROCESSING
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Przetwarza i indeksuje dokument
   * @param {Object} doc - Dokument do przetworzenia
   * @returns {Object} Przetworzony dokument z metadanymi
   */
  indexDocument(doc) {
    const docId = doc.id;
    const content = doc.content || '';
    
    // 1. Podziel na linie i zaindeksuj każdą
    const lines = content.split('\n');
    const lineData = [];
    
    lines.forEach((line, idx) => {
      const lineId = `${docId}_line_${idx}`;
      const lineInfo = {
        id: lineId,
        docId: docId,
        lineNumber: idx + 1,
        text: line,
        entities: this.extractEntities(line),
        isHeading: this.isHeading(line),
        isCritical: this.isCritical(line),
        hasTable: /\|.*\|/.test(line),
        hasMeasurement: this.technicalPatterns.measurement.test(line)
      };
      
      lineData.push(lineInfo);
      this.lineIndex.set(lineId, lineInfo);
      
      // Indeksuj encje
      lineInfo.entities.forEach(entity => {
        if (!this.entityIndex.has(entity.value)) {
          this.entityIndex.set(entity.value, []);
        }
        this.entityIndex.get(entity.value).push({
          docId,
          lineId,
          type: entity.type,
          lineNumber: idx + 1
        });
      });
    });
    
    // 2. Wyciągnij wszystkie encje z dokumentu
    const allEntities = this.extractAllEntities(content);
    const norms = allEntities.filter(e => e.type === 'norm').map(e => e.value);
    const measurements = allEntities.filter(e => e.type === 'measurement');
    
    // 3. Stwórz strukturę dokumentu
    const structure = this.extractStructure(content);
    
    // 4. Zapisz pełny dokument
    const processedDoc = {
      ...doc,
      lines: lineData,
      lineCount: lines.length,
      wordCount: content.split(/\s+/).length,
      entities: allEntities,
      norms: [...new Set(norms)],
      measurements: measurements,
      structure: structure,
      processedAt: new Date().toISOString()
    };
    
    this.documents.set(docId, processedDoc);
    
    // 5. Dodaj do indeksów wyszukiwania
    this.addToSearchIndex(processedDoc);
    
    // Statystyki
    this.stats.totalDocuments++;
    this.stats.totalLines += lines.length;
    this.stats.totalEntities += allEntities.length;
    
    return processedDoc;
  }
  
  /**
   * Wyciąga encje z linii tekstu
   */
  extractEntities(text) {
    const entities = [];
    
    // Reset lastIndex dla wszystkich regex
    Object.values(this.technicalPatterns).forEach(p => p.lastIndex = 0);
    
    // VG Normy
    let match;
    while ((match = this.technicalPatterns.vgNorm.exec(text)) !== null) {
      entities.push({
        type: 'norm',
        subtype: 'VG',
        value: match[0].toUpperCase().replace(/\s+/g, ' '),
        position: match.index
      });
    }
    
    // MIL-SPEC
    this.technicalPatterns.milSpec.lastIndex = 0;
    while ((match = this.technicalPatterns.milSpec.exec(text)) !== null) {
      entities.push({
        type: 'norm',
        subtype: 'MIL',
        value: match[0].toUpperCase(),
        position: match.index
      });
    }
    
    // IPC
    this.technicalPatterns.ipcStandard.lastIndex = 0;
    while ((match = this.technicalPatterns.ipcStandard.exec(text)) !== null) {
      entities.push({
        type: 'norm',
        subtype: 'IPC',
        value: match[0].toUpperCase(),
        position: match.index
      });
    }
    
    // Miary
    this.technicalPatterns.measurement.lastIndex = 0;
    while ((match = this.technicalPatterns.measurement.exec(text)) !== null) {
      entities.push({
        type: 'measurement',
        value: match[0],
        numericValue: parseFloat(match[1].replace(',', '.')),
        unit: match[2],
        position: match.index
      });
    }
    
    // AWG
    this.technicalPatterns.awgGauge.lastIndex = 0;
    while ((match = this.technicalPatterns.awgGauge.exec(text)) !== null) {
      entities.push({
        type: 'wire_gauge',
        value: match[0],
        gauge: parseInt(match[1]),
        position: match.index
      });
    }
    
    return entities;
  }
  
  /**
   * Wyciąga wszystkie encje z całego dokumentu
   */
  extractAllEntities(text) {
    return this.extractEntities(text);
  }
  
  /**
   * Sprawdza czy linia jest nagłówkiem
   */
  isHeading(line) {
    // Markdown headings
    if (/^#{1,6}\s/.test(line)) return true;
    // Numbered headings
    if (/^\d+(?:\.\d+)*\.?\s+[A-ZÄÖÜ]/.test(line)) return true;
    // ALL CAPS lines (likely headings)
    if (line.length > 5 && line === line.toUpperCase() && /[A-Z]/.test(line)) return true;
    return false;
  }
  
  /**
   * Sprawdza czy linia zawiera krytyczne informacje
   */
  isCritical(line) {
    this.technicalPatterns.critical.lastIndex = 0;
    this.technicalPatterns.warning.lastIndex = 0;
    return this.technicalPatterns.critical.test(line) || 
           this.technicalPatterns.warning.test(line);
  }
  
  /**
   * Wyciąga strukturę dokumentu (spis treści)
   */
  extractStructure(content) {
    const structure = {
      headings: [],
      sections: [],
      tables: [],
      lists: []
    };
    
    const lines = content.split('\n');
    let currentSection = null;
    
    lines.forEach((line, idx) => {
      // Nagłówki markdown
      const mdMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (mdMatch) {
        const heading = {
          level: mdMatch[1].length,
          title: mdMatch[2].trim(),
          lineNumber: idx + 1
        };
        structure.headings.push(heading);
        
        if (heading.level <= 2) {
          if (currentSection) {
            currentSection.endLine = idx;
            structure.sections.push(currentSection);
          }
          currentSection = {
            title: heading.title,
            level: heading.level,
            startLine: idx + 1,
            endLine: null
          };
        }
      }
      
      // Numerowane nagłówki
      const numMatch = line.match(/^(\d+(?:\.\d+)*\.?)\s+(.+)$/);
      if (numMatch && !mdMatch) {
        const level = numMatch[1].split('.').filter(x => x).length;
        structure.headings.push({
          level: level,
          number: numMatch[1],
          title: numMatch[2].trim(),
          lineNumber: idx + 1
        });
      }
      
      // Tabele (wykrywanie linii z |)
      if (/\|.*\|/.test(line)) {
        const lastTable = structure.tables[structure.tables.length - 1];
        if (lastTable && lastTable.endLine === idx) {
          lastTable.endLine = idx + 1;
        } else {
          structure.tables.push({
            startLine: idx + 1,
            endLine: idx + 1
          });
        }
      }
    });
    
    // Zamknij ostatnią sekcję
    if (currentSection) {
      currentSection.endLine = lines.length;
      structure.sections.push(currentSection);
    }
    
    return structure;
  }
  
  /**
   * Dodaje dokument do indeksów wyszukiwania
   */
  addToSearchIndex(doc) {
    // Lunr.js
    if (this.lunrBuilder) {
      this.lunrBuilder.add({
        id: doc.id,
        title: doc.title || '',
        content: doc.content || '',
        keywords: (doc.keywords || []).join(' '),
        norms: (doc.norms || []).join(' '),
        entities: doc.entities.map(e => e.value).join(' ')
      });
    }
    
    // Flexsearch
    if (this.flexIndex) {
      this.flexIndex.add({
        id: doc.id,
        title: doc.title || '',
        content: (doc.content || '').substring(0, 5000), // Limit dla wydajności
        keywords: (doc.keywords || []).join(' '),
        icon: doc.icon || '📄',
        category: doc.category || 'sonstige',
        snippet: (doc.content || '').substring(0, 200)
      });
    }
    
    // Autocomplete index
    if (this.autocompleteIndex) {
      this.autocompleteIndex.add(doc.id, doc.title || '');
      (doc.keywords || []).forEach((kw, i) => {
        this.autocompleteIndex.add(`${doc.id}_kw_${i}`, kw);
      });
    }
  }
  
  /**
   * Buduje finalny indeks Lunr (po dodaniu wszystkich dokumentów)
   */
  buildLunrIndex() {
    if (this.lunrBuilder) {
      this.lunrIndex = this.lunrBuilder.build();
      console.log('🔍 Lunr index built');
    }
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // SEARCH
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Główna funkcja wyszukiwania
   */
  search(query, options = {}) {
    const {
      limit = 20,
      searchType = 'all', // 'all', 'title', 'content', 'entities'
      filters = {},
      highlight = true
    } = options;
    
    let results = [];
    
    // Flexsearch (szybki)
    if (this.flexIndex) {
      const flexResults = this.flexIndex.search(query, {
        limit: limit * 2, // Więcej wyników do filtrowania
        enrich: true
      });
      
      flexResults.forEach(fieldResult => {
        fieldResult.result.forEach(r => {
          const doc = this.documents.get(r.id);
          if (doc && !results.find(x => x.id === r.id)) {
            results.push({
              id: r.id,
              doc: r.doc,
              fullDoc: doc,
              score: 1,
              source: 'flex'
            });
          }
        });
      });
    }
    
    // Lunr (bardziej precyzyjny)
    if (this.lunrIndex && results.length < limit) {
      try {
        const lunrResults = this.lunrIndex.search(query);
        lunrResults.forEach(r => {
          if (!results.find(x => x.id === r.ref)) {
            const doc = this.documents.get(r.ref);
            if (doc) {
              results.push({
                id: r.ref,
                doc: { title: doc.title, icon: doc.icon, category: doc.category },
                fullDoc: doc,
                score: r.score,
                source: 'lunr'
              });
            }
          }
        });
      } catch (e) {
        // Lunr może rzucić błąd przy nieprawidłowej składni
        console.warn('Lunr search error:', e);
      }
    }
    
    // Filtrowanie
    if (filters.category) {
      results = results.filter(r => r.fullDoc.category === filters.category);
    }
    if (filters.type) {
      results = results.filter(r => r.fullDoc.type === filters.type);
    }
    
    // Podświetlanie (jeśli włączone)
    if (highlight) {
      results = results.map(r => ({
        ...r,
        highlights: this.getHighlights(r.fullDoc, query)
      }));
    }
    
    // Sortuj po score i ogranicz
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
  
  /**
   * Wyszukiwanie po konkretnej linii
   */
  searchInLines(query, options = {}) {
    const { docId, limit = 50 } = options;
    const results = [];
    const queryLower = query.toLowerCase();
    
    this.lineIndex.forEach((lineInfo, lineId) => {
      if (docId && lineInfo.docId !== docId) return;
      
      if (lineInfo.text.toLowerCase().includes(queryLower)) {
        results.push({
          ...lineInfo,
          matchPosition: lineInfo.text.toLowerCase().indexOf(queryLower)
        });
      }
    });
    
    return results.slice(0, limit);
  }
  
  /**
   * Wyszukiwanie encji
   */
  searchEntities(entityType, value = null) {
    const results = [];
    
    this.entityIndex.forEach((occurrences, entityValue) => {
      if (value && !entityValue.toLowerCase().includes(value.toLowerCase())) {
        return;
      }
      
      const filtered = occurrences.filter(o => !entityType || o.type === entityType);
      if (filtered.length > 0) {
        results.push({
          value: entityValue,
          type: filtered[0].type,
          occurrences: filtered,
          count: filtered.length
        });
      }
    });
    
    return results.sort((a, b) => b.count - a.count);
  }
  
  /**
   * Pobiera fragmenty z podświetleniem
   */
  getHighlights(doc, query, contextLength = 50) {
    const highlights = [];
    const content = doc.content || '';
    const queryLower = query.toLowerCase();
    const contentLower = content.toLowerCase();
    
    let pos = 0;
    while ((pos = contentLower.indexOf(queryLower, pos)) !== -1) {
      const start = Math.max(0, pos - contextLength);
      const end = Math.min(content.length, pos + query.length + contextLength);
      
      highlights.push({
        text: content.substring(start, end),
        matchStart: pos - start,
        matchEnd: pos - start + query.length,
        position: pos
      });
      
      pos += query.length;
      if (highlights.length >= 5) break; // Max 5 highlights
    }
    
    return highlights;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // AUTOCOMPLETE
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Zwraca sugestie autocomplete
   */
  getAutocompleteSuggestions(query, limit = 8) {
    if (!query || query.length < 2) return [];
    
    const suggestions = new Map();
    
    // 1. Z Flexsearch autocomplete index
    if (this.autocompleteIndex) {
      const results = this.autocompleteIndex.search(query, { limit: limit * 2 });
      results.forEach(id => {
        const doc = this.documents.get(id.split('_kw_')[0]);
        if (doc && !suggestions.has(doc.title)) {
          suggestions.set(doc.title, {
            title: doc.title,
            icon: doc.icon || '📄',
            type: 'document',
            score: 100
          });
        }
      });
    }
    
    // 2. Z encji
    this.entityIndex.forEach((occurrences, entityValue) => {
      if (entityValue.toLowerCase().includes(query.toLowerCase())) {
        if (!suggestions.has(entityValue)) {
          suggestions.set(entityValue, {
            title: entityValue,
            icon: occurrences[0].type === 'norm' ? '📐' : '📏',
            type: occurrences[0].type,
            count: occurrences.length,
            score: 50 + occurrences.length
          });
        }
      }
    });
    
    // 3. Terminy techniczne
    const techTerms = [
      'Crimphöhe', 'Crimpverbindung', 'Zugtest', 'Zugkraft',
      'AWG Tabelle', 'Querschnitt', 'Schrumpfschlauch',
      'Steckverbinder', 'Kontaktgröße', 'Isolierung'
    ];
    
    techTerms.forEach(term => {
      if (term.toLowerCase().includes(query.toLowerCase()) && !suggestions.has(term)) {
        suggestions.set(term, {
          title: term,
          icon: '🔧',
          type: 'technical',
          score: 30
        });
      }
    });
    
    // Sortuj i ogranicz
    return Array.from(suggestions.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // DOCUMENT LINKING
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Znajduje powiązane dokumenty
   */
  findRelatedDocuments(docId, limit = 10) {
    const doc = this.documents.get(docId);
    if (!doc) return [];
    
    const related = new Map();
    
    // 1. Przez wspólne encje (normy, terminy)
    doc.entities.forEach(entity => {
      const occurrences = this.entityIndex.get(entity.value) || [];
      occurrences.forEach(occ => {
        if (occ.docId !== docId) {
          const score = related.get(occ.docId) || 0;
          related.set(occ.docId, score + (entity.type === 'norm' ? 5 : 2));
        }
      });
    });
    
    // 2. Przez wspólne słowa kluczowe
    const docKeywords = new Set(doc.keywords || []);
    this.documents.forEach((otherDoc, otherId) => {
      if (otherId === docId) return;
      
      const otherKeywords = new Set(otherDoc.keywords || []);
      let commonCount = 0;
      docKeywords.forEach(kw => {
        if (otherKeywords.has(kw)) commonCount++;
      });
      
      if (commonCount > 0) {
        const score = related.get(otherId) || 0;
        related.set(otherId, score + commonCount * 3);
      }
    });
    
    // Sortuj i zwróć
    return Array.from(related.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id, score]) => {
        const relDoc = this.documents.get(id);
        return {
          id,
          title: relDoc?.title || id,
          icon: relDoc?.icon || '📄',
          category: relDoc?.category,
          score,
          matchedEntities: this.getCommonEntities(doc, relDoc)
        };
      });
  }
  
  /**
   * Znajduje wspólne encje między dokumentami
   */
  getCommonEntities(doc1, doc2) {
    if (!doc1 || !doc2) return [];
    
    const entities1 = new Set((doc1.entities || []).map(e => e.value));
    const common = [];
    
    (doc2.entities || []).forEach(e => {
      if (entities1.has(e.value)) {
        common.push(e.value);
      }
    });
    
    return [...new Set(common)];
  }
  
  /**
   * Buduje graf powiązań między dokumentami
   */
  buildLinkGraph() {
    this.linkGraph.clear();
    
    this.documents.forEach((doc, docId) => {
      const related = this.findRelatedDocuments(docId, 5);
      this.linkGraph.set(docId, related.map(r => r.id));
    });
    
    console.log(`🔗 Link graph built with ${this.linkGraph.size} nodes`);
    return this.linkGraph;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // HIGHLIGHTING (Mark.js integration)
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Podświetla szukane frazy w elemencie DOM
   */
  highlightInElement(element, query, options = {}) {
    if (typeof Mark === 'undefined') {
      console.warn('Mark.js not loaded');
      return;
    }
    
    const marker = new Mark(element);
    
    // Najpierw usuń poprzednie podświetlenia
    marker.unmark({
      done: () => {
        // Potem dodaj nowe
        marker.mark(query, {
          accuracy: 'partially',
          separateWordSearch: true,
          className: 'search-highlight',
          ...options
        });
      }
    });
    
    return marker;
  }
  
  /**
   * Podświetla i przewija do pierwszego wyniku
   */
  highlightAndScroll(element, query) {
    const marker = this.highlightInElement(element, query, {
      done: (count) => {
        if (count > 0) {
          const firstMatch = element.querySelector('.search-highlight');
          if (firstMatch) {
            firstMatch.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
          }
        }
      }
    });
    
    return marker;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // NLP (Compromise integration)
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Analizuje tekst za pomocą Compromise NLP
   */
  analyzeWithNLP(text) {
    if (typeof nlp === 'undefined') {
      console.warn('Compromise not loaded');
      return null;
    }
    
    const doc = nlp(text);
    
    return {
      // Liczby i jednostki
      numbers: doc.numbers().json(),
      values: doc.values().json(),
      
      // Rzeczowniki (potencjalne terminy)
      nouns: doc.nouns().json(),
      
      // Czasowniki (potencjalne akcje)
      verbs: doc.verbs().json(),
      
      // Statystyki
      wordCount: doc.wordCount(),
      sentenceCount: doc.sentences().length
    };
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // UTILITY
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Pobiera dokument po ID
   */
  getDocument(docId) {
    return this.documents.get(docId);
  }
  
  /**
   * Pobiera konkretną linię
   */
  getLine(lineId) {
    return this.lineIndex.get(lineId);
  }
  
  /**
   * Pobiera linie dokumentu
   */
  getDocumentLines(docId, startLine = 1, endLine = null) {
    const doc = this.documents.get(docId);
    if (!doc) return [];
    
    const lines = doc.lines || [];
    const end = endLine || lines.length;
    
    return lines.filter(l => l.lineNumber >= startLine && l.lineNumber <= end);
  }
  
  /**
   * Statystyki
   */
  getStats() {
    return {
      ...this.stats,
      documentsInMemory: this.documents.size,
      linesIndexed: this.lineIndex.size,
      entitiesIndexed: this.entityIndex.size
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// GLOBAL INSTANCE
// ═══════════════════════════════════════════════════════════════════════════════

const advancedProcessor = new AdvancedDocumentProcessor();

// Auto-init po załadowaniu DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => advancedProcessor.init(), 500);
  });
} else {
  setTimeout(() => advancedProcessor.init(), 500);
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdvancedDocumentProcessor;
}
