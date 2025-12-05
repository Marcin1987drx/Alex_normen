// ═══════════════════════════════════════════════════════════════════════════════
// VG-NORMEN WISSENSSYSTEM - SEARCH ENGINE
// Suchlogik mit Schlüsselwort-Matching und Synonymen
// ═══════════════════════════════════════════════════════════════════════════════

const SearchEngine = {
  
  // Wissensbasis-Daten (wird beim Start geladen)
  data: {
    karten: [],
    tabellen: [],
    formulare: []
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
      
      console.log('SearchEngine initialized:', {
        karten: this.data.karten.length,
        tabellen: this.data.tabellen.length
      });
      
      return true;
    } catch (e) {
      console.error('SearchEngine init error:', e);
      return false;
    }
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
    
    // In User-Dokumenten suchen
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
  }
};
