// ═══════════════════════════════════════════════════════════════════════════════
// VG-NORMEN WISSENSSYSTEM - MARKDOWN LOADER
// Ładuje pełne pliki .md jako bazę danych - KAŻDA LITERKA!
// ═══════════════════════════════════════════════════════════════════════════════

const MarkdownLoader = {
  
  // Konfiguracja plików TEIL - PEŁNE NAZWY!
  teilDateien: [
    { file: 'PRODUKTIONSHANDBUCH_VG_NORMEN_TEIL1.md', teil: 1, title: 'Einführung', icon: '📘', category: 'kabel', norm: 'VG Normen' },
    { file: 'PRODUKTIONSHANDBUCH_VG_NORMEN_TEIL2.md', teil: 2, title: 'VG 95218 – Drähte und Leitungen', icon: '📏', category: 'kabel', norm: 'VG 95218' },
    { file: 'PRODUKTIONSHANDBUCH_VG_NORMEN_TEIL3.md', teil: 3, title: 'VG 96927 – Kabelgarnituren', icon: '🔌', category: 'kabel', norm: 'VG 96927' },
    { file: 'PRODUKTIONSHANDBUCH_VG_NORMEN_TEIL4.md', teil: 4, title: 'VG 95319 – Steckverbinder', icon: '🔌', category: 'stecker', norm: 'VG 95319' },
    { file: 'PRODUKTIONSHANDBUCH_VG_NORMEN_TEIL5.md', teil: 5, title: 'VG 96936 – Abschirmung', icon: '🛡️', category: 'schirmung', norm: 'VG 96936' },
    { file: 'PRODUKTIONSHANDBUCH_VG_NORMEN_TEIL6.md', teil: 6, title: 'VG 95343 – Schrumpfschläuche', icon: '🔥', category: 'schrumpfen', norm: 'VG 95343' },
    { file: 'PRODUKTIONSHANDBUCH_VG_NORMEN_TEIL7.md', teil: 7, title: 'IPC/WHMA-A-620', icon: '🔧', category: 'crimpen', norm: 'IPC-A-620' },
    { file: 'PRODUKTIONSHANDBUCH_VG_NORMEN_TEIL8.md', teil: 8, title: 'Qualitätsmanagement', icon: '✅', category: 'pruefung', norm: 'ISO 9001' },
    { file: 'PRODUKTIONSHANDBUCH_VG_NORMEN_TEIL9.md', teil: 9, title: 'AQL ISO 2859-1', icon: '📊', category: 'pruefung', norm: 'ISO 2859-1' },
    { file: 'PRODUKTIONSHANDBUCH_VG_NORMEN_TEIL10.md', teil: 10, title: 'Formulare', icon: '📋', category: 'formulare', norm: 'VG / IPC' },
    { file: 'PRODUKTIONSHANDBUCH_VG_NORMEN_TEIL10_FORTSETZUNG.md', teil: '10b', title: 'Formulare (Fortsetzung)', icon: '📋', category: 'formulare', norm: 'VG / IPC' }
  ],
  
  // Załadowane dane
  teilInhalte: {},
  
  // Sekcje (rozdziały) - wygenerowane z Markdown
  sektionen: [],
  
  // Indeks wyszukiwania
  suchIndex: [],
  
  // Powiązania między sekcjami
  verknuepfungen: {},
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // ŁADOWANIE DANYCH
  // ═══════════════════════════════════════════════════════════════════════════════
  
  async ladeDaten() {
    console.log('📚 Ładowanie pełnych plików Markdown...');
    
    for (const teil of this.teilDateien) {
      try {
        const response = await fetch(`normen-md/${teil.file}`);
        if (response.ok) {
          const markdown = await response.text();
          this.teilInhalte[`teil${teil.teil}`] = {
            ...teil,
            markdown: markdown,
            html: this.markdownToHtml(markdown),
            sektionen: this.extrahiereSektionen(markdown, teil)
          };
          console.log(`✅ Geladen: TEIL ${teil.teil} - ${teil.title} (${markdown.length} Zeichen)`);
        } else {
          console.warn(`⚠️ Nicht gefunden: ${teil.file}`);
        }
      } catch (error) {
        console.error(`❌ Fehler beim Laden von ${teil.file}:`, error);
      }
    }
    
    // Generiere Sektionen für Navigation
    this.generiereSektionen();
    
    // Baue Suchindex
    this.baueSuchIndex();
    
    // Finde Verknüpfungen
    this.findeVerknuepfungen();
    
    console.log(`📊 ${this.sektionen.length} Sektionen generiert`);
    console.log(`🔍 ${this.suchIndex.length} Einträge im Suchindex`);
    
    return this.sektionen;
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // MARKDOWN PARSING
  // ═══════════════════════════════════════════════════════════════════════════════
  
  /**
   * Konvertiert Markdown zu HTML
   */
  markdownToHtml(markdown) {
    if (!markdown) return '';
    
    let html = markdown;
    
    // Headers
    html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>');
    html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>');
    html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
    html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');
    
    // Bold & Italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
    html = html.replace(/_(.+?)_/g, '<em>$1</em>');
    
    // Tabellen
    html = this.parseTabellen(html);
    
    // Listen
    html = this.parseListen(html);
    
    // Code blocks
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="code-block"><code class="language-$1">$2</code></pre>');
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Horizontale Linie
    html = html.replace(/^---+$/gm, '<hr>');
    html = html.replace(/^\*\*\*+$/gm, '<hr>');
    
    // Paragraphen
    html = html.replace(/\n\n+/g, '</p><p>');
    html = '<p>' + html + '</p>';
    
    // Cleanup
    html = html.replace(/<p>\s*<\/p>/g, '');
    html = html.replace(/<p>\s*(<h[1-6]>)/g, '$1');
    html = html.replace(/(<\/h[1-6]>)\s*<\/p>/g, '$1');
    html = html.replace(/<p>\s*(<table)/g, '$1');
    html = html.replace(/(<\/table>)\s*<\/p>/g, '$1');
    html = html.replace(/<p>\s*(<ul|<ol)/g, '$1');
    html = html.replace(/(<\/ul>|<\/ol>)\s*<\/p>/g, '$1');
    html = html.replace(/<p>\s*(<hr>)/g, '$1');
    html = html.replace(/(<hr>)\s*<\/p>/g, '$1');
    
    return html;
  },
  
  /**
   * Parsuje Markdown-Tabellen
   */
  parseTabellen(text) {
    const tabellenRegex = /\|(.+)\|\n\|[-:\s|]+\|\n((?:\|.+\|\n?)+)/g;
    
    return text.replace(tabellenRegex, (match, headerRow, bodyRows) => {
      const headers = headerRow.split('|').map(h => h.trim()).filter(h => h);
      const rows = bodyRows.trim().split('\n').map(row => 
        row.split('|').map(cell => cell.trim()).filter(cell => cell)
      );
      
      let html = '<div class="table-scroll"><table class="data-table normen-tabelle">';
      html += '<thead><tr>';
      headers.forEach(h => html += `<th>${h}</th>`);
      html += '</tr></thead><tbody>';
      
      rows.forEach(row => {
        html += '<tr>';
        row.forEach(cell => html += `<td>${cell}</td>`);
        html += '</tr>';
      });
      
      html += '</tbody></table></div>';
      return html;
    });
  },
  
  /**
   * Parsuje Markdown-Listen
   */
  parseListen(text) {
    // Ungeordnete Listen
    text = text.replace(/^(\s*)[-*+]\s+(.+)$/gm, (match, indent, content) => {
      const level = Math.floor(indent.length / 2);
      return `<li class="level-${level}">${content}</li>`;
    });
    
    // Grupiere li-Elemente in ul
    text = text.replace(/(<li[^>]*>.*?<\/li>\n?)+/g, match => {
      return '<ul class="normen-liste">' + match + '</ul>';
    });
    
    // Geordnete Listen
    text = text.replace(/^(\s*)\d+\.\s+(.+)$/gm, (match, indent, content) => {
      return `<li>${content}</li>`;
    });
    
    return text;
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // SEKTION-EXTRAKTION
  // ═══════════════════════════════════════════════════════════════════════════════
  
  /**
   * Extrahiert Sektionen (Kapitel) aus Markdown
   */
  extrahiereSektionen(markdown, teil) {
    const sektionen = [];
    
    // Finde alle H2 und H3 Headers als Sektionen
    const headerRegex = /^(#{2,3})\s+(.+)$/gm;
    let lastIndex = 0;
    let match;
    let currentSektion = null;
    
    while ((match = headerRegex.exec(markdown)) !== null) {
      // Speichere vorherige Sektion
      if (currentSektion) {
        currentSektion.inhalt = markdown.substring(currentSektion.startIndex, match.index).trim();
        currentSektion.html = this.markdownToHtml(currentSektion.inhalt);
        sektionen.push(currentSektion);
      }
      
      const level = match[1].length;
      const title = match[2].trim();
      
      // Extrahiere Sektionsnummer (z.B. "2.3" aus "2.3 TYP A – Standard")
      const nummerMatch = title.match(/^(\d+\.\d+(?:\.\d+)?)\s+/);
      const nummer = nummerMatch ? nummerMatch[1] : null;
      const cleanTitle = nummer ? title.replace(nummerMatch[0], '') : title;
      
      currentSektion = {
        id: `teil${teil.teil}-${nummer || sektionen.length}`.replace(/\./g, '-'),
        teil: teil.teil,
        teilTitle: teil.title,
        level: level,
        nummer: nummer,
        title: cleanTitle,
        fullTitle: title,
        icon: this.sektionIcon(cleanTitle),
        category: teil.category,
        norm: teil.norm,
        startIndex: match.index,
        keywords: this.extrahiereKeywords(title + ' ' + teil.title)
      };
    }
    
    // Letzte Sektion
    if (currentSektion) {
      currentSektion.inhalt = markdown.substring(currentSektion.startIndex).trim();
      currentSektion.html = this.markdownToHtml(currentSektion.inhalt);
      sektionen.push(currentSektion);
    }
    
    return sektionen;
  },
  
  /**
   * Generiere alle Sektionen für Navigation
   */
  generiereSektionen() {
    this.sektionen = [];
    
    Object.values(this.teilInhalte).forEach(teil => {
      // Haupt-TEIL-Eintrag
      this.sektionen.push({
        id: `teil${teil.teil}-uebersicht`,
        teil: teil.teil,
        type: 'overview',
        title: teil.title,
        icon: teil.icon,
        category: teil.category,
        norm: teil.norm,
        description: `Komplette Dokumentation TEIL ${teil.teil}`,
        html: teil.html,
        keywords: this.extrahiereKeywords(teil.title)
      });
      
      // Alle Sektionen
      if (teil.sektionen) {
        teil.sektionen.forEach(sektion => {
          this.sektionen.push({
            ...sektion,
            type: 'sektion',
            parentTeil: teil.teil,
            description: `TEIL ${teil.teil}, Sektion ${sektion.nummer || ''}`
          });
        });
      }
    });
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // SUCHINDEX
  // ═══════════════════════════════════════════════════════════════════════════════
  
  /**
   * Baut Volltextindex für Suche
   */
  baueSuchIndex() {
    this.suchIndex = [];
    
    this.sektionen.forEach(sektion => {
      // Extrahiere Text aus HTML für Suche
      const textContent = sektion.html ? 
        sektion.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
      
      this.suchIndex.push({
        id: sektion.id,
        title: sektion.title,
        teil: sektion.teil,
        norm: sektion.norm,
        category: sektion.category,
        text: textContent.toLowerCase(),
        keywords: sektion.keywords || []
      });
    });
  },
  
  /**
   * Volltextsuche
   */
  suche(query) {
    if (!query || query.length < 2) return [];
    
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(w => w.length > 1);
    
    const ergebnisse = [];
    
    this.suchIndex.forEach(eintrag => {
      let score = 0;
      let matches = [];
      
      // Titel-Match (höchste Priorität)
      if (eintrag.title.toLowerCase().includes(queryLower)) {
        score += 100;
        matches.push('Titel');
      }
      
      // Norm-Match
      if (eintrag.norm && eintrag.norm.toLowerCase().includes(queryLower)) {
        score += 80;
        matches.push('Norm');
      }
      
      // Keywords-Match
      queryWords.forEach(word => {
        if (eintrag.keywords.some(k => k.includes(word))) {
          score += 50;
          matches.push('Keyword');
        }
      });
      
      // Volltext-Match
      queryWords.forEach(word => {
        if (eintrag.text.includes(word)) {
          score += 10;
          const count = (eintrag.text.match(new RegExp(word, 'g')) || []).length;
          score += Math.min(count, 10); // Max 10 Punkte für Häufigkeit
          matches.push('Text');
        }
      });
      
      if (score > 0) {
        ergebnisse.push({
          ...eintrag,
          score: score,
          matches: [...new Set(matches)]
        });
      }
    });
    
    // Sortiere nach Score
    ergebnisse.sort((a, b) => b.score - a.score);
    
    return ergebnisse.slice(0, 50); // Max 50 Ergebnisse
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // VERKNÜPFUNGEN
  // ═══════════════════════════════════════════════════════════════════════════════
  
  /**
   * Findet Verknüpfungen zwischen Sektionen - VERBESSERT!
   */
  findeVerknuepfungen() {
    this.verknuepfungen = {};
    
    // Mapa Norm → TEIL
    const normToTeil = {
      'VG 95218': [2],      // Drähte
      'VG 96927': [3],      // Kabelgarnituren  
      'VG 95319': [4],      // Steckverbinder
      'VG 96936': [5],      // Abschirmung
      'VG 95343': [6],      // Schrumpfschläuche
      'IPC-A-620': [7],     // IPC Crimpen
      'ISO 9001': [8],      // Qualität
      'ISO 2859': [9],      // AQL
    };
    
    // Keywords die TEILs verbinden
    const keywordConnections = {
      'crimp': [2, 4, 7],           // Drähte, Stecker, IPC
      'kontakt': [2, 4, 7],         // Drähte, Stecker, IPC
      'stecker': [4, 5],            // Stecker, Schirmung
      'kabel': [2, 3, 5],           // Drähte, Garnituren, Schirmung
      'prüf': [3, 7, 8, 9],         // Garnituren, IPC, Qualität, AQL
      'test': [3, 7, 8, 9],
      'schirm': [5],                // Schirmung
      'schrumpf': [6],              // Schrumpfschläuche
      'temperatur': [2, 3, 6],      // Drähte, Garnituren, Schrumpf
      'awg': [2, 4],                // Drähte, Stecker
      'formular': [10],             // Formulare
      'protokoll': [10],
      'fehler': [7, 8],             // IPC, Qualität
      'bellmouth': [4, 7],          // Stecker, IPC
      'löt': [7],                   // IPC
      'aql': [9],                   // AQL
      'qualität': [8, 9],           // Qualität, AQL
    };
    
    this.sektionen.forEach(sektion => {
      const verwandt = new Set();
      const textLower = (sektion.html || '').toLowerCase();
      const titleLower = (sektion.title || '').toLowerCase();
      const currentTeil = parseInt(sektion.teil) || 0;
      
      // 1. Finde Norm-Referenzen im Text
      Object.entries(normToTeil).forEach(([norm, teils]) => {
        const normPattern = norm.replace(/[\s-]/g, '\\s*[-]?');
        if (new RegExp(normPattern, 'i').test(sektion.html || '')) {
          teils.forEach(teil => {
            if (teil !== currentTeil) {
              // Füge Overview des referenzierten TEILs hinzu
              const overview = this.sektionen.find(s => 
                s.teil == teil && s.type === 'overview'
              );
              if (overview) verwandt.add(overview.id);
            }
          });
        }
      });
      
      // 2. Keyword-basierte Verbindungen
      Object.entries(keywordConnections).forEach(([keyword, teils]) => {
        if (textLower.includes(keyword) || titleLower.includes(keyword)) {
          teils.forEach(teil => {
            if (teil !== currentTeil) {
              const overview = this.sektionen.find(s => 
                s.teil == teil && s.type === 'overview'
              );
              if (overview) verwandt.add(overview.id);
            }
          });
        }
      });
      
      // 3. Gleiche Kategorie, anderer TEIL
      this.sektionen.forEach(andere => {
        if (andere.id !== sektion.id && 
            andere.category === sektion.category && 
            andere.teil !== sektion.teil &&
            andere.type === 'overview') {
          verwandt.add(andere.id);
        }
      });
      
      // 4. Sektionen im gleichen TEIL (max 3)
      const gleicheTeil = this.sektionen.filter(s => 
        s.teil === sektion.teil && 
        s.id !== sektion.id && 
        s.type !== 'overview'
      ).slice(0, 3);
      gleicheTeil.forEach(s => verwandt.add(s.id));
      
      // Speichere max 8 Verknüpfungen
      this.verknuepfungen[sektion.id] = Array.from(verwandt).slice(0, 8);
    });
    
    console.log(`🔗 Verknüpfungen generiert für ${Object.keys(this.verknuepfungen).length} Sektionen`);
  },
  
  /**
   * Holt verwandte Sektionen
   */
  getVerwandteThemen(sektionId) {
    const verwandteIds = this.verknuepfungen[sektionId] || [];
    return verwandteIds.map(id => this.sektionen.find(s => s.id === id)).filter(Boolean);
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // HILFSFUNKTIONEN
  // ═══════════════════════════════════════════════════════════════════════════════
  
  /**
   * Extrahiert Keywords aus Text
   */
  extrahiereKeywords(text) {
    if (!text) return [];
    
    const keywords = new Set();
    const textLower = text.toLowerCase();
    
    // VG-Normen
    const vgMatch = textLower.match(/vg\s*\d{5}/g);
    if (vgMatch) vgMatch.forEach(m => keywords.add(m.replace(/\s/g, ' ')));
    
    // Technische Begriffe
    const techTerms = [
      'crimp', 'löten', 'schrumpf', 'isolat', 'widerstand', 'temperatur',
      'stecker', 'kontakt', 'kabel', 'draht', 'leitung', 'abschirm',
      'prüf', 'test', 'qualität', 'aql', 'fehler', 'typ a', 'typ e', 'typ g', 'typ h',
      'awg', 'mm²', 'hipot', 'durchgang', 'hochspannung', 'bellmouth'
    ];
    
    techTerms.forEach(term => {
      if (textLower.includes(term)) keywords.add(term);
    });
    
    // Einzelne Wörter > 4 Zeichen
    textLower.split(/\s+/).forEach(word => {
      const clean = word.replace(/[^\wäöüß]/g, '');
      if (clean.length > 4) keywords.add(clean);
    });
    
    return Array.from(keywords).slice(0, 15);
  },
  
  /**
   * Wählt Icon für Sektion
   */
  sektionIcon(title) {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('tabelle') || titleLower.includes('übersicht')) return '📊';
    if (titleLower.includes('prüf') || titleLower.includes('test')) return '🔬';
    if (titleLower.includes('typ a') || titleLower.includes('typ e')) return '📋';
    if (titleLower.includes('crimp')) return '🔧';
    if (titleLower.includes('löt')) return '🔥';
    if (titleLower.includes('fehler') || titleLower.includes('defekt')) return '❌';
    if (titleLower.includes('temperatur')) return '🌡️';
    if (titleLower.includes('material')) return '🧪';
    if (titleLower.includes('formular')) return '📋';
    if (titleLower.includes('stecker') || titleLower.includes('kontakt')) return '🔌';
    if (titleLower.includes('kabel') || titleLower.includes('draht')) return '📏';
    if (titleLower.includes('schirm') || titleLower.includes('abschirm')) return '🛡️';
    if (titleLower.includes('schrumpf')) return '🔥';
    if (titleLower.includes('qualität')) return '✅';
    if (titleLower.includes('aql')) return '📊';
    
    return '📄';
  },
  
  /**
   * Holt Sektion nach ID
   */
  getSektion(id) {
    return this.sektionen.find(s => s.id === id);
  },
  
  /**
   * Holt alle Sektionen eines TEILs
   */
  getTeilSektionen(teil) {
    return this.sektionen.filter(s => s.teil == teil || s.parentTeil == teil);
  },
  
  /**
   * Holt Sektionen nach Kategorie
   */
  getKategorieSektionen(category) {
    return this.sektionen.filter(s => s.category === category);
  }
};

// Export
window.MarkdownLoader = MarkdownLoader;
