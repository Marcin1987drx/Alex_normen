// ═══════════════════════════════════════════════════════════════════════════════
// VG-NORMEN WISSENSSYSTEM - SEARCH ENGINE
// Suchlogik mit Schlüsselwort-Matching und Synonymen
// ═══════════════════════════════════════════════════════════════════════════════

const SearchEngine = {
  
  // Wissensbasis-Daten (wird beim Start geladen)
  data: {
    karten: [],
    tabellen: [],
    formulare: [],
    importedDocs: [] // Zaimportowane dokumenty z IndexedDB
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // INITIALISIERUNG
  // ═══════════════════════════════════════════════════════════════════════════
  
  async init() {
    try {
      // Wissensbasis laden
      const [karten, tabellen] = await Promise.all([
        this.loadJSON('wissensbasis/karten.json'),
        this.loadJSON('wissensbasis/tabellen.json')
      ]);
      
      this.data.karten = karten || [];
      this.data.tabellen = tabellen || [];
      
      // Zaimportowane dokumenty z IndexedDB
      await this.loadImportedDocuments();
      
      console.log('SearchEngine initialized:', {
        karten: this.data.karten.length,
        tabellen: this.data.tabellen.length,
        importedDocs: this.data.importedDocs.length
      });
      
      return true;
    } catch (e) {
      console.error('SearchEngine init error:', e);
      return false;
    }
  },
  
  /**
   * Ładuje zaimportowane dokumenty z IndexedDB
   */
  async loadImportedDocuments() {
    try {
      if (typeof IndexedDBStorage !== 'undefined') {
        this.data.importedDocs = await IndexedDBStorage.getAllDocuments();
        console.log(`📚 SearchEngine: ${this.data.importedDocs.length} importierte Dokumente geladen`);
      } else if (typeof documentImporter !== 'undefined') {
        this.data.importedDocs = documentImporter.importedDocuments || [];
      }
    } catch (e) {
      console.warn('Konnte importierte Dokumente nicht laden:', e);
      this.data.importedDocs = [];
    }
  },
  
  /**
   * Aktualizuje listę zaimportowanych dokumentów (np. po imporcie)
   */
  async refreshImportedDocuments() {
    await this.loadImportedDocuments();
  },
  
  async loadJSON(path) {
    try {
      const response = await fetch(path);
      if (!response.ok) return [];
      return await response.json();
    } catch (e) {
      console.warn('Could not load:', path);
      return [];
    }
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // SUCHE
  // ═══════════════════════════════════════════════════════════════════════════
  
  search(query) {
    if (!query || query.trim().length < 2) {
      return [];
    }
    
    const searchTerms = this.normalizeQuery(query);
    const results = [];
    
    // In Karten suchen
    this.data.karten.forEach(item => {
      const score = this.calculateScore(item, searchTerms);
      if (score > 0) {
        results.push({
          ...item,
          score,
          type: 'karte',
          source: 'wissensbasis'
        });
      }
    });
    
    // In Tabellen suchen
    this.data.tabellen.forEach(item => {
      const score = this.calculateScore(item, searchTerms);
      if (score > 0) {
        results.push({
          ...item,
          score,
          type: 'tabelle',
          source: 'wissensbasis'
        });
      }
    });
    
    // ═══════════════════════════════════════════════════════════════════════
    // PRZESZUKAJ ZAIMPORTOWANE DOKUMENTY (IndexedDB)
    // ═══════════════════════════════════════════════════════════════════════
    this.data.importedDocs.forEach(doc => {
      const score = this.calculateImportedDocScore(doc, searchTerms);
      if (score > 0) {
        results.push({
          id: `imported_${doc.id}`,
          title: doc.title,
          description: doc.content ? doc.content.substring(0, 200) + '...' : '',
          keywords: doc.tags || [],
          category: doc.category,
          icon: doc.formatIcon || '📄',
          score,
          type: 'imported',
          source: 'meine_dokumente',
          importedDoc: doc // Pełny dokument do wyświetlenia
        });
      }
    });
    
    // In User-Dokumenten suchen (stary system - localStorage)
    const userDocs = Storage.getUserDocs();
    Object.entries(userDocs).forEach(([fileName, docInfo]) => {
      const score = this.calculateDocScore(fileName, docInfo, searchTerms);
      if (score > 0) {
        results.push({
          id: 'user_' + fileName,
          title: docInfo.displayName || fileName,
          fileName: fileName,
          keywords: docInfo.keywords || [],
          score,
          type: 'dokument',
          source: 'meine_dokumente'
        });
      }
    });
    
    // Nach Score sortieren
    results.sort((a, b) => b.score - a.score);
    
    // Auf Maximum begrenzen
    return results.slice(0, CONFIG.maxSearchResults);
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // QUERY NORMALISIERUNG
  // ═══════════════════════════════════════════════════════════════════════════
  
  normalizeQuery(query) {
    // Kleinbuchstaben, Sonderzeichen entfernen
    let normalized = query.toLowerCase()
      .replace(/[äÄ]/g, 'ae')
      .replace(/[öÖ]/g, 'oe')
      .replace(/[üÜ]/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/[^a-z0-9\s]/g, ' ')
      .trim();
    
    // In Wörter aufteilen
    let terms = normalized.split(/\s+/).filter(t => t.length >= 2);
    
    // Synonyme hinzufügen
    const expandedTerms = [...terms];
    terms.forEach(term => {
      // Direkte Synonyme
      if (CONFIG.synonyms[term]) {
        expandedTerms.push(...CONFIG.synonyms[term]);
      }
      // Umgekehrte Synonyme
      Object.entries(CONFIG.synonyms).forEach(([key, values]) => {
        if (values.includes(term)) {
          expandedTerms.push(key);
        }
      });
    });
    
    return [...new Set(expandedTerms)];
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // SCORE BERECHNUNG
  // ═══════════════════════════════════════════════════════════════════════════
  
  calculateScore(item, searchTerms) {
    let score = 0;
    
    const title = this.normalizeText(item.title || '');
    const description = this.normalizeText(item.description || '');
    const keywords = (item.keywords || []).map(k => this.normalizeText(k));
    const category = this.normalizeText(item.category || '');
    
    searchTerms.forEach(term => {
      // Titel-Match (höchste Priorität)
      if (title.includes(term)) {
        score += 10;
        if (title.startsWith(term)) score += 5;
      }
      
      // Keyword-Match (hohe Priorität)
      if (keywords.some(k => k.includes(term))) {
        score += 8;
      }
      
      // Kategorie-Match
      if (category.includes(term)) {
        score += 5;
      }
      
      // Beschreibung-Match
      if (description.includes(term)) {
        score += 3;
      }
    });
    
    return score;
  },
  
  calculateDocScore(fileName, docInfo, searchTerms) {
    let score = 0;
    
    const name = this.normalizeText(fileName);
    const displayName = this.normalizeText(docInfo.displayName || '');
    const keywords = (docInfo.keywords || []).map(k => this.normalizeText(k));
    
    searchTerms.forEach(term => {
      if (name.includes(term)) score += 10;
      if (displayName.includes(term)) score += 8;
      if (keywords.some(k => k.includes(term))) score += 6;
    });
    
    return score;
  },
  
  /**
   * Oblicza score dla zaimportowanych dokumentów (IndexedDB)
   */
  calculateImportedDocScore(doc, searchTerms) {
    let score = 0;
    
    const title = this.normalizeText(doc.title || '');
    const content = this.normalizeText(doc.content || '');
    const tags = (doc.tags || []).map(k => this.normalizeText(k));
    const filename = this.normalizeText(doc.filename || '');
    const category = this.normalizeText(doc.category || '');
    
    searchTerms.forEach(term => {
      // Tytuł - najwyższy priorytet
      if (title.includes(term)) {
        score += 15;
        if (title.startsWith(term)) score += 5;
      }
      
      // Tagi/słowa kluczowe
      if (tags.some(t => t.includes(term))) {
        score += 10;
      }
      
      // Nazwa pliku
      if (filename.includes(term)) {
        score += 8;
      }
      
      // Kategoria
      if (category.includes(term)) {
        score += 5;
      }
      
      // Treść dokumentu (niższy priorytet ale ważny)
      if (content.includes(term)) {
        score += 4;
        // Bonus za wielokrotne wystąpienia
        const matches = (content.match(new RegExp(term, 'g')) || []).length;
        if (matches > 3) score += 2;
      }
    });
    
    return score;
  },
  
  normalizeText(text) {
    return text.toLowerCase()
      .replace(/[äÄ]/g, 'ae')
      .replace(/[öÖ]/g, 'oe')
      .replace(/[üÜ]/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/[^a-z0-9]/g, '');
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // KATEGORIEBASIERTES LADEN
  // ═══════════════════════════════════════════════════════════════════════════
  
  getByCategory(categoryId) {
    return this.data.karten.filter(item => item.category === categoryId);
  },
  
  getById(itemId) {
    return this.data.karten.find(item => item.id === itemId) ||
           this.data.tabellen.find(item => item.id === itemId);
  },
  
  getAllTabellen() {
    return this.data.tabellen;
  },
  
  getAllKarten() {
    return this.data.karten;
  },
  
  /**
   * Pobiera wszystkie zaimportowane dokumenty
   */
  getAllImportedDocs() {
    return this.data.importedDocs;
  },
  
  /**
   * Pobiera zaimportowany dokument po ID
   */
  getImportedDocById(docId) {
    // Może być przekazany jako "imported_123" lub "123"
    const id = String(docId).replace('imported_', '');
    return this.data.importedDocs.find(d => String(d.id) === id);
  },
  
  /**
   * Pobiera zaimportowane dokumenty według kategorii
   */
  getImportedDocsByCategory(category) {
    return this.data.importedDocs.filter(d => d.category === category);
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // SCHLÜSSELWORT-EXTRAKTION (für User-Dokumente)
  // ═══════════════════════════════════════════════════════════════════════════
  
  extractKeywords(fileName, textContent = '') {
    const keywords = new Set();
    
    // Aus Dateiname extrahieren
    const nameParts = fileName
      .replace(/\.[^.]+$/, '') // Extension entfernen
      .split(/[_\-\s.]+/)
      .filter(p => p.length >= 2);
    
    nameParts.forEach(part => {
      const lower = part.toLowerCase();
      keywords.add(lower);
      
      // Bekannte Keywords prüfen
      Object.entries(CONFIG.keywords).forEach(([category, words]) => {
        if (words.some(w => lower.includes(w) || w.includes(lower))) {
          keywords.add(category);
        }
      });
    });
    
    // Aus Text extrahieren (falls vorhanden)
    if (textContent) {
      const words = textContent.toLowerCase()
        .replace(/[^a-zäöüß0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length >= 3);
      
      // Häufige Wörter finden
      const wordCount = {};
      words.forEach(w => {
        wordCount[w] = (wordCount[w] || 0) + 1;
      });
      
      // Top-Keywords hinzufügen
      Object.entries(wordCount)
        .filter(([word, count]) => count >= 3)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .forEach(([word]) => {
          // Prüfen ob relevantes Keyword
          Object.entries(CONFIG.keywords).forEach(([category, catWords]) => {
            if (catWords.some(w => word.includes(w))) {
              keywords.add(category);
              keywords.add(word);
            }
          });
        });
    }
    
    return [...keywords];
  },
  
  suggestFileName(keywords) {
    // Aus Keywords einen Dateinamen vorschlagen
    const relevantKeywords = keywords
      .filter(k => k.length >= 3)
      .slice(0, 4)
      .map(k => k.charAt(0).toUpperCase() + k.slice(1));
    
    if (relevantKeywords.length === 0) {
      return null;
    }
    
    return relevantKeywords.join('_');
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // AUTOCOMPLETE SUGGESTIONS
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Generuje sugestie autocomplete dla wyszukiwarki
   * @param {string} query - Częściowe zapytanie użytkownika
   * @param {number} limit - Maksymalna liczba sugestii
   * @returns {Array} Tablica sugestii
   */
  getAutocompleteSuggestions(query, limit = 8) {
    if (!query || query.length < 2) return [];
    
    const queryLower = query.toLowerCase();
    const suggestions = [];
    const seen = new Set();
    
    // 1. Szukaj w kartach Wissensbasis
    if (this.data.karten) {
      this.data.karten.forEach(karte => {
        if (karte.title?.toLowerCase().includes(queryLower)) {
          if (!seen.has(karte.title)) {
            suggestions.push({
              title: karte.title,
              icon: karte.icon || '📄',
              type: 'karte',
              score: karte.title.toLowerCase().startsWith(queryLower) ? 100 : 50
            });
            seen.add(karte.title);
          }
        }
        // Szukaj też w keywords
        (karte.keywords || []).forEach(kw => {
          if (kw.toLowerCase().includes(queryLower) && !seen.has(kw)) {
            suggestions.push({
              title: kw,
              icon: '🏷️',
              type: 'keyword',
              score: kw.toLowerCase().startsWith(queryLower) ? 80 : 40
            });
            seen.add(kw);
          }
        });
      });
    }
    
    // 2. Szukaj w MarkdownLoader jeśli dostępny
    if (typeof MarkdownLoader !== 'undefined' && MarkdownLoader.sektionen) {
      MarkdownLoader.sektionen.forEach(sektion => {
        if (sektion.title?.toLowerCase().includes(queryLower) && !seen.has(sektion.title)) {
          suggestions.push({
            title: sektion.title,
            icon: sektion.icon || '📖',
            type: 'sektion',
            score: sektion.title.toLowerCase().startsWith(queryLower) ? 95 : 45
          });
          seen.add(sektion.title);
        }
      });
    }
    
    // 3. Szukaj w zaimportowanych dokumentach
    this.data.importedDocs.forEach(doc => {
      if (doc.title?.toLowerCase().includes(queryLower) && !seen.has(doc.title)) {
        suggestions.push({
          title: doc.title,
          icon: doc.formatIcon || '📄',
          type: 'imported',
          score: doc.title.toLowerCase().startsWith(queryLower) ? 85 : 35
        });
        seen.add(doc.title);
      }
    });
    
    // 4. Dodaj popularne terminy techniczne
    const techTerms = [
      'Crimphöhe', 'Crimpverbindung', 'Crimpkontakt', 'Crimpzange',
      'AWG Tabelle', 'AWG Querschnitt', 'Drahtquerschnitt',
      'Zugtest', 'Zugkraft', 'Zugfestigkeit',
      'Schrumpfschlauch', 'Schrumpfverhältnis', 'Wärmeschrumpf',
      'Steckverbinder', 'Stecker', 'Kontakt', 'Pin',
      'Isolierung', 'Abisolieren', 'Abisolierlänge',
      'Lötverbindung', 'Löttemperatur', 'Löten',
      'VG 95218', 'VG 96927', 'VG 95319', 'VG 95343',
      'IPC-A-620', 'IPC-WHMA-A-620',
      'Gut Schlecht', 'Akzeptanzkriterien', 'Qualitätsprüfung'
    ];
    
    techTerms.forEach(term => {
      if (term.toLowerCase().includes(queryLower) && !seen.has(term)) {
        suggestions.push({
          title: term,
          icon: '🔧',
          type: 'tech',
          score: term.toLowerCase().startsWith(queryLower) ? 70 : 30
        });
        seen.add(term);
      }
    });
    
    // Sortuj po score i ogranicz
    return suggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
};
