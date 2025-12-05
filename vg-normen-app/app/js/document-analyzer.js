// ═══════════════════════════════════════════════════════════════════════════════
// VG-NORMEN WISSENSSYSTEM - DOCUMENT ANALYZER
// Automatische Analyse und Benennung von Dokumenten
// ═══════════════════════════════════════════════════════════════════════════════

const DocumentAnalyzer = {
  
  // ═══════════════════════════════════════════════════════════════════════════
  // MAIN ANALYSIS FUNCTION
  // ═══════════════════════════════════════════════════════════════════════════
  
  async analyze(text, originalFileName) {
    const result = {
      suggestedName: '',
      keywords: [],
      category: null,
      confidence: 0,
      detectedNorms: [],
      detectedProcesses: []
    };
    
    if (!text || text.trim().length < 10) {
      return result;
    }
    
    // Text normalisieren
    const normalizedText = text.toLowerCase();
    
    // 1. VG-Normen erkennen
    result.detectedNorms = this.detectNorms(text);
    
    // 2. Prozesse und Themen erkennen
    result.detectedProcesses = this.detectProcesses(normalizedText);
    
    // 3. Schlüsselwörter extrahieren
    result.keywords = this.extractKeywords(normalizedText);
    
    // 4. Kategorie bestimmen
    result.category = this.determineCategory(normalizedText, result.keywords);
    
    // 5. Namen vorschlagen
    result.suggestedName = this.suggestFileName(result, originalFileName);
    
    // 6. Konfidenz berechnen
    result.confidence = this.calculateConfidence(result);
    
    return result;
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // NORM DETECTION
  // ═══════════════════════════════════════════════════════════════════════════
  
  detectNorms(text) {
    const norms = [];
    
    // VG-Normen Pattern
    const vgPattern = /VG\s*(\d{5})/gi;
    let match;
    while ((match = vgPattern.exec(text)) !== null) {
      const normNum = match[1];
      if (!norms.includes(`VG ${normNum}`)) {
        norms.push(`VG ${normNum}`);
      }
    }
    
    // IPC Normen
    const ipcPattern = /IPC[-\/]?(?:WHMA[-\/]?)?A[-\/]?620/gi;
    if (ipcPattern.test(text)) {
      if (!norms.includes('IPC/WHMA-A-620')) {
        norms.push('IPC/WHMA-A-620');
      }
    }
    
    // ISO Normen
    const isoPattern = /ISO\s*(\d{4,5}(?:[-\/]\d+)?)/gi;
    while ((match = isoPattern.exec(text)) !== null) {
      const isoNum = match[1].replace(/\//g, '-');
      if (!norms.includes(`ISO ${isoNum}`)) {
        norms.push(`ISO ${isoNum}`);
      }
    }
    
    // DIN Normen
    const dinPattern = /DIN\s*(?:EN\s*)?(\d{4,6})/gi;
    while ((match = dinPattern.exec(text)) !== null) {
      const dinNum = match[1];
      if (!norms.includes(`DIN ${dinNum}`)) {
        norms.push(`DIN ${dinNum}`);
      }
    }
    
    return norms;
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // PROCESS DETECTION
  // ═══════════════════════════════════════════════════════════════════════════
  
  detectProcesses(text) {
    const processes = [];
    
    // Haupt-Prozesse
    const processPatterns = {
      'Crimpen': ['crimp', 'verpressung', 'pressung', 'crimpverbindung', 'crimpkontakt'],
      'Löten': ['löt', 'lötverbindung', 'lötstelle', 'weichlöten', 'hartlöten', 'flussmittel'],
      'Schrumpfen': ['schrumpf', 'schrumpfschlauch', 'wärmeschrumpf', 'isolation'],
      'Kabelkonfektion': ['kabelkonfektion', 'kabelbaum', 'kabelsatz', 'leitungssatz'],
      'Steckermontage': ['stecker', 'steckverbinder', 'kontakt', 'einzelleiter'],
      'Spleißen': ['spleiß', 'verbindung', 'splice'],
      'Prüfung': ['prüf', 'kontrolle', 'messung', 'test', 'qualitätskontrolle'],
      'Dokumentation': ['dokumentation', 'protokoll', 'bericht', 'nachweis', 'checkliste']
    };
    
    for (const [process, keywords] of Object.entries(processPatterns)) {
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          if (!processes.includes(process)) {
            processes.push(process);
          }
          break;
        }
      }
    }
    
    return processes;
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // KEYWORD EXTRACTION
  // ═══════════════════════════════════════════════════════════════════════════
  
  extractKeywords(text) {
    const keywords = new Set();
    
    // Alle Kategorie-Keywords prüfen
    for (const [catKey, catData] of Object.entries(CONFIG.categories)) {
      for (const keyword of catData.keywords) {
        if (text.includes(keyword.toLowerCase())) {
          keywords.add(keyword);
        }
      }
    }
    
    // Zusätzliche technische Begriffe
    const technicalTerms = [
      'zugkraft', 'temperatur', 'isolierung', 'mantel', 'schirm', 
      'litze', 'ader', 'querschnitt', 'durchmesser', 'länge',
      'werkzeug', 'zange', 'automat', 'hand', 'maschine',
      'klasse 2', 'klasse 3', 'class 2', 'class 3',
      'militär', 'bundeswehr', 'automotive', 'luft', 'raum',
      'arbeitsanweisung', 'prüfanweisung', 'spezifikation'
    ];
    
    for (const term of technicalTerms) {
      if (text.includes(term)) {
        keywords.add(term);
      }
    }
    
    // Auf 15 Keywords limitieren
    return Array.from(keywords).slice(0, 15);
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // CATEGORY DETERMINATION
  // ═══════════════════════════════════════════════════════════════════════════
  
  determineCategory(text, extractedKeywords) {
    const scores = {};
    
    // Scores für jede Kategorie berechnen
    for (const [catKey, catData] of Object.entries(CONFIG.categories)) {
      scores[catKey] = 0;
      
      for (const keyword of catData.keywords) {
        // Exakte Matches
        const regex = new RegExp(`\\b${this.escapeRegex(keyword.toLowerCase())}\\b`, 'g');
        const matches = (text.match(regex) || []).length;
        scores[catKey] += matches * 2;
        
        // Partial Matches
        if (text.includes(keyword.toLowerCase())) {
          scores[catKey] += 1;
        }
      }
      
      // Bonus für extrahierte Keywords
      for (const kw of extractedKeywords) {
        if (catData.keywords.includes(kw)) {
          scores[catKey] += 3;
        }
      }
    }
    
    // Höchsten Score finden
    let bestCategory = null;
    let bestScore = 0;
    
    for (const [catKey, score] of Object.entries(scores)) {
      if (score > bestScore) {
        bestScore = score;
        bestCategory = catKey;
      }
    }
    
    // Nur zurückgeben wenn Score ausreichend
    return bestScore >= 3 ? bestCategory : null;
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // FILE NAME SUGGESTION
  // ═══════════════════════════════════════════════════════════════════════════
  
  suggestFileName(analysis, originalFileName) {
    const parts = [];
    
    // 1. Kategorie-Präfix
    if (analysis.category && CONFIG.categories[analysis.category]) {
      const cat = CONFIG.categories[analysis.category];
      parts.push(cat.icon.replace(/[^\w]/g, ''));
      parts.push(analysis.category.toUpperCase());
    }
    
    // 2. Erkannte Norm
    if (analysis.detectedNorms.length > 0) {
      const firstNorm = analysis.detectedNorms[0].replace(/\s+/g, '');
      parts.push(firstNorm);
    }
    
    // 3. Erkannter Prozess
    if (analysis.detectedProcesses.length > 0) {
      parts.push(analysis.detectedProcesses[0]);
    }
    
    // 4. Wichtigstes Keyword (wenn noch Platz)
    if (parts.length < 3 && analysis.keywords.length > 0) {
      const mainKeyword = analysis.keywords[0];
      if (mainKeyword.length <= 15) {
        parts.push(this.capitalize(mainKeyword));
      }
    }
    
    // Falls nichts erkannt: Original-Namen verwenden
    if (parts.length === 0) {
      // Dateiendung entfernen
      const baseName = originalFileName.replace(/\.[^/.]+$/, '');
      return this.sanitizeFileName(baseName);
    }
    
    // Zusammenfügen und säubern
    const suggestedName = parts.join('_');
    return this.sanitizeFileName(suggestedName);
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // CONFIDENCE CALCULATION
  // ═══════════════════════════════════════════════════════════════════════════
  
  calculateConfidence(analysis) {
    let confidence = 0;
    
    // Kategorie erkannt: +30%
    if (analysis.category) {
      confidence += 30;
    }
    
    // VG-Norm erkannt: +25%
    if (analysis.detectedNorms.length > 0) {
      confidence += 25;
    }
    
    // Prozesse erkannt: +20%
    if (analysis.detectedProcesses.length > 0) {
      confidence += 20;
    }
    
    // Keywords: bis zu +25% (5 Keywords = volle Punkte)
    const kwScore = Math.min(analysis.keywords.length / 5, 1) * 25;
    confidence += kwScore;
    
    return Math.round(confidence);
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // UTILITY FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════════════
  
  sanitizeFileName(name) {
    return name
      // Umlaute ersetzen
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/Ä/g, 'Ae')
      .replace(/Ö/g, 'Oe')
      .replace(/Ü/g, 'Ue')
      // Ungültige Zeichen entfernen
      .replace(/[<>:"/\\|?*]/g, '')
      // Leerzeichen durch Unterstrich
      .replace(/\s+/g, '_')
      // Mehrfache Unterstriche reduzieren
      .replace(/_+/g, '_')
      // Max 50 Zeichen
      .substring(0, 50)
      // Führende/Trailing Unterstriche entfernen
      .replace(/^_+|_+$/g, '');
  },
  
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },
  
  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // DISPLAY NAME GENERATION (für UI)
  // ═══════════════════════════════════════════════════════════════════════════
  
  generateDisplayName(analysis, originalFileName) {
    const parts = [];
    
    // Kategorie-Icon
    if (analysis.category && CONFIG.categories[analysis.category]) {
      parts.push(CONFIG.categories[analysis.category].icon);
    }
    
    // Norm in Klammern
    if (analysis.detectedNorms.length > 0) {
      parts.push(`[${analysis.detectedNorms[0]}]`);
    }
    
    // Haupt-Prozess
    if (analysis.detectedProcesses.length > 0) {
      parts.push(analysis.detectedProcesses[0]);
    }
    
    // Wenn nichts: Original-Namen
    if (parts.length === 0) {
      return originalFileName.replace(/\.[^/.]+$/, '');
    }
    
    return parts.join(' ');
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // BATCH ANALYSIS (für Ordner-Scan)
  // ═══════════════════════════════════════════════════════════════════════════
  
  async analyzeBatch(files) {
    const results = [];
    
    for (const file of files) {
      try {
        let text = '';
        
        // Text extrahieren basierend auf Dateityp
        if (file.type === 'pdf') {
          text = await PDFExtractor.extract(file.path);
        } else if (file.type === 'docx') {
          text = await DOCXExtractor.extract(file.path);
        } else if (file.type === 'txt') {
          text = await this.readTextFile(file.path);
        }
        
        const analysis = await this.analyze(text, file.name);
        results.push({
          file: file,
          analysis: analysis
        });
        
      } catch (error) {
        console.error(`Fehler bei Analyse von ${file.name}:`, error);
        results.push({
          file: file,
          analysis: null,
          error: error.message
        });
      }
    }
    
    return results;
  },
  
  async readTextFile(path) {
    try {
      // In Electron via IPC
      if (window.electronAPI) {
        return await window.electronAPI.readTextFile(path);
      }
      // Fallback für Web
      const response = await fetch(path);
      return await response.text();
    } catch (e) {
      return '';
    }
  }
};

// Export für Module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DocumentAnalyzer;
}
