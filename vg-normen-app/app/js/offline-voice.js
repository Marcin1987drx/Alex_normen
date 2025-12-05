// ═══════════════════════════════════════════════════════════════════════════════
// VG-NORMEN WISSENSSYSTEM - OFFLINE VOICE SEARCH
// Offline rozpoznawanie mowy z lokalnym słownikiem VG-Normen
// + Fuzzy matching dla lepszego rozpoznawania
// ═══════════════════════════════════════════════════════════════════════════════

const OfflineVoice = {
  
  // Pełny słownik VG-Normen dla fuzzy matching
  vgVocabulary: {
    // Normy - różne warianty wymowy
    'fau geh 95218': 'VG 95218',
    'vg 95218': 'VG 95218',
    'fau geh neun fünf zwei eins acht': 'VG 95218',
    'fau geh 96927': 'VG 96927',
    'vg 96927': 'VG 96927',
    'fau geh 95319': 'VG 95319',
    'vg 95319': 'VG 95319',
    'fau geh 96936': 'VG 96936',
    'vg 96936': 'VG 96936',
    'fau geh 95343': 'VG 95343',
    'vg 95343': 'VG 95343',
    'ipc a 620': 'IPC-A-620',
    'ipc 620': 'IPC-A-620',
    'iso 2859': 'ISO 2859-1',
    'aql': 'AQL ISO 2859-1',
    
    // Typy - różne wymowy
    'typ a': 'TYP A',
    'typ ah': 'TYP A',
    'type a': 'TYP A',
    'typ e': 'TYP E',
    'typ eh': 'TYP E',
    'typ g': 'TYP G',
    'typ geh': 'TYP G',
    'typ h': 'TYP H',
    'typ ha': 'TYP H',
    
    // Komponenty
    'crimp': 'Crimp',
    'krimpen': 'Crimpen',
    'crimpen': 'Crimpen',
    'crimpkontakt': 'Crimpkontakt',
    'steckverbinder': 'Steckverbinder',
    'stecker': 'Steckverbinder',
    'kontakt': 'Kontakt',
    'kontakte': 'Kontakte',
    'kabel': 'Kabel',
    'draht': 'Draht',
    'drähte': 'Drähte',
    'leitung': 'Leitung',
    'schrumpfschlauch': 'Schrumpfschlauch',
    'schrumpfen': 'Schrumpfschlauch',
    'schirmung': 'Schirmung',
    'abschirmung': 'Abschirmung',
    'backshell': 'Backshell',
    'bellmouth': 'Bellmouth',
    
    // Prüfung
    'prüfung': 'Prüfung',
    'test': 'Prüfung',
    'durchgangsprüfung': 'Durchgangsprüfung',
    'hochspannung': 'Hochspannungsprüfung',
    'hipot': 'HiPot Prüfung',
    'qualität': 'Qualitätsprüfung',
    
    // AWG
    'awg 20': 'AWG 20',
    'awg 22': 'AWG 22',
    'awg 24': 'AWG 24',
    'awg 26': 'AWG 26',
    
    // Dokumente
    'formular': 'Formular',
    'formulare': 'Formulare',
    'tabelle': 'Tabelle',
    'protokoll': 'Prüfprotokoll',
    'checkliste': 'Checkliste'
  },
  
  // Schnellbefehle (voice commands)
  quickCommands: {
    'suche': (query) => query,
    'öffne': (query) => query,
    'zeige': (query) => query,
    'finde': (query) => query,
    'tabelle': () => 'Tabelle',
    'formular': () => 'Formular',
    'startseite': () => { navigateTo('home'); return null; },
    'zurück': () => { goBack(); return null; },
    'hilfe': () => { showHelp(); return null; },
    'drucken': () => { printPage(); return null; }
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // VOICE INPUT (Offline-friendly)
  // ═══════════════════════════════════════════════════════════════════════════════
  
  /**
   * Startet Spracherkennung mit Fallback
   */
  async startRecognition() {
    // Sprawdź czy online - użyj Web Speech API
    if (navigator.onLine) {
      return this.startOnlineRecognition();
    }
    
    // Offline - pokaż alternatywny interfejs
    return this.showOfflineVoiceUI();
  },
  
  /**
   * Online: Standard Web Speech API
   */
  startOnlineRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      UI.showToast('Sprachsuche nicht verfügbar', 'error');
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'de-DE';
    recognition.continuous = false;
    recognition.interimResults = true;
    
    this.setupRecognitionHandlers(recognition);
    
    try {
      recognition.start();
    } catch (e) {
      console.error('Speech recognition error:', e);
      this.showOfflineVoiceUI();
    }
  },
  
  /**
   * Offline: Schnellauswahl-UI
   */
  showOfflineVoiceUI() {
    // Stwórz modal z szybkim wyborem
    const existingModal = document.getElementById('offlineVoiceModal');
    if (existingModal) existingModal.remove();
    
    const modal = document.createElement('div');
    modal.id = 'offlineVoiceModal';
    modal.className = 'modal active';
    modal.innerHTML = `
      <div class="modal-content modal-medium">
        <div class="modal-header">
          <h3>🎤 Schnellsuche (Offline)</h3>
          <button class="btn-icon" onclick="OfflineVoice.closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <p class="offline-notice">
            ⚠️ Sprachsuche benötigt Internet.<br>
            Nutzen Sie die Schnellauswahl oder tippen Sie:
          </p>
          
          <div class="quick-search-input">
            <input type="text" id="offlineSearchInput" placeholder="Suchbegriff eingeben..." 
                   onkeyup="if(event.key==='Enter') OfflineVoice.executeSearch()">
            <button class="btn-primary" onclick="OfflineVoice.executeSearch()">SUCHEN</button>
          </div>
          
          <h4>📋 Häufige Suchen</h4>
          <div class="quick-buttons">
            ${this.renderQuickButtons()}
          </div>
          
          <h4>📊 Normen</h4>
          <div class="norm-buttons">
            <button onclick="OfflineVoice.quickSearch('VG 95218')">VG 95218</button>
            <button onclick="OfflineVoice.quickSearch('VG 95319')">VG 95319</button>
            <button onclick="OfflineVoice.quickSearch('VG 96927')">VG 96927</button>
            <button onclick="OfflineVoice.quickSearch('VG 96936')">VG 96936</button>
            <button onclick="OfflineVoice.quickSearch('VG 95343')">VG 95343</button>
            <button onclick="OfflineVoice.quickSearch('IPC-A-620')">IPC-A-620</button>
          </div>
          
          <h4>🔧 Typen</h4>
          <div class="type-buttons">
            <button onclick="OfflineVoice.quickSearch('TYP A')">TYP A</button>
            <button onclick="OfflineVoice.quickSearch('TYP E')">TYP E</button>
            <button onclick="OfflineVoice.quickSearch('TYP G')">TYP G</button>
            <button onclick="OfflineVoice.quickSearch('TYP H')">TYP H</button>
          </div>
          
          <h4>📄 Kategorien</h4>
          <div class="category-buttons">
            <button onclick="OfflineVoice.quickSearch('Crimp')">🔧 Crimpen</button>
            <button onclick="OfflineVoice.quickSearch('Steckverbinder')">🔌 Steckverbinder</button>
            <button onclick="OfflineVoice.quickSearch('Schrumpf')">🔥 Schrumpfschlauch</button>
            <button onclick="OfflineVoice.quickSearch('Prüfung')">✅ Prüfung</button>
            <button onclick="OfflineVoice.quickSearch('Formular')">📋 Formulare</button>
            <button onclick="OfflineVoice.quickSearch('Tabelle')">📊 Tabellen</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Fokus na input
    setTimeout(() => {
      document.getElementById('offlineSearchInput')?.focus();
    }, 100);
  },
  
  /**
   * Renderuje przyciski szybkiego wyszukiwania
   */
  renderQuickButtons() {
    const recentSearches = Storage.getRecentSearches?.() || [];
    if (recentSearches.length === 0) {
      return '<p class="hint">Ihre letzten Suchen erscheinen hier</p>';
    }
    
    return recentSearches.slice(0, 6).map(s => 
      `<button onclick="OfflineVoice.quickSearch('${s}')">${s}</button>`
    ).join('');
  },
  
  /**
   * Wykonaj szybkie wyszukiwanie
   */
  quickSearch(query) {
    this.closeModal();
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.value = query;
    }
    
    // Wywołaj wyszukiwanie
    if (typeof handleSearch === 'function') {
      handleSearch();
    }
    
    // Zapisz do ostatnich wyszukiwań
    this.saveRecentSearch(query);
  },
  
  /**
   * Wykonaj wyszukiwanie z pola input
   */
  executeSearch() {
    const input = document.getElementById('offlineSearchInput');
    const query = input?.value?.trim();
    
    if (query) {
      this.quickSearch(query);
    }
  },
  
  /**
   * Zamknij modal
   */
  closeModal() {
    const modal = document.getElementById('offlineVoiceModal');
    if (modal) {
      modal.remove();
    }
  },
  
  /**
   * Zapisz ostatnie wyszukiwanie
   */
  saveRecentSearch(query) {
    try {
      let recent = JSON.parse(localStorage.getItem('vg_recent_searches') || '[]');
      recent = recent.filter(s => s !== query);
      recent.unshift(query);
      recent = recent.slice(0, 10);
      localStorage.setItem('vg_recent_searches', JSON.stringify(recent));
    } catch (e) {
      console.error('Error saving recent search:', e);
    }
  },
  
  /**
   * Setup recognition handlers
   */
  setupRecognitionHandlers(recognition) {
    const voiceModal = document.getElementById('modalVoice');
    const voiceTranscript = document.getElementById('voiceTranscript');
    const voiceBtn = document.getElementById('btnVoiceSearch');
    
    recognition.onstart = () => {
      voiceBtn?.classList.add('listening');
      if (voiceModal) voiceModal.classList.add('active');
      if (voiceTranscript) voiceTranscript.textContent = '';
    };
    
    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      
      if (finalTranscript) {
        // Sprawdź czy to komenda
        const processed = this.processVoiceCommand(finalTranscript);
        
        if (processed) {
          const searchInput = document.getElementById('searchInput');
          if (searchInput) searchInput.value = processed;
          
          setTimeout(() => {
            if (voiceModal) voiceModal.classList.remove('active');
            handleSearch();
          }, 300);
        }
      }
    };
    
    recognition.onerror = (event) => {
      if (event.error === 'network') {
        if (voiceModal) voiceModal.classList.remove('active');
        this.showOfflineVoiceUI();
      }
    };
    
    recognition.onend = () => {
      voiceBtn?.classList.remove('listening');
    };
  },
  
  /**
   * Przetwórz komendę głosową
   */
  processVoiceCommand(transcript) {
    const lower = transcript.toLowerCase().trim();
    
    // Sprawdź komendy
    for (const [cmd, handler] of Object.entries(this.quickCommands)) {
      if (lower.startsWith(cmd)) {
        const rest = lower.replace(cmd, '').trim();
        const result = handler(rest);
        if (result === null) return null; // Komenda wykonana bez wyszukiwania
        return result || transcript;
      }
    }
    
    // Sprawdź słownik fuzzy matching
    const fromVocab = this.matchVocabulary(transcript);
    if (fromVocab) return fromVocab;
    
    // Normalizuj VG-Normen
    return this.normalizeVGQuery(transcript);
  },
  
  /**
   * Dopasuj do słownika (fuzzy matching)
   */
  matchVocabulary(query) {
    const lower = query.toLowerCase().trim();
    
    // Dokładne dopasowanie
    if (this.vgVocabulary[lower]) {
      return this.vgVocabulary[lower];
    }
    
    // Częściowe dopasowanie
    for (const [key, value] of Object.entries(this.vgVocabulary)) {
      if (lower.includes(key) || key.includes(lower)) {
        return value;
      }
    }
    
    // Levenshtein distance dla podobnych słów
    let bestMatch = null;
    let bestScore = Infinity;
    
    for (const [key, value] of Object.entries(this.vgVocabulary)) {
      const distance = this.levenshteinDistance(lower, key);
      if (distance < 3 && distance < bestScore) {
        bestScore = distance;
        bestMatch = value;
      }
    }
    
    return bestMatch;
  },
  
  /**
   * Levenshtein distance dla fuzzy matching
   */
  levenshteinDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    
    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[b.length][a.length];
  },
  
  /**
   * Normalizuj zapytanie VG
   */
  normalizeVGQuery(query) {
    let normalized = query;
    
    // "fau geh" → "VG"
    normalized = normalized.replace(/\b(fau|fow|vau)\s*(geh?|ge|g)\b/gi, 'VG');
    
    // Liczby z spacjami: "neun fünf zwei eins acht" → "95218"
    const numberMap = {
      'null': '0', 'eins': '1', 'zwei': '2', 'drei': '3', 'vier': '4',
      'fünf': '5', 'sechs': '6', 'sieben': '7', 'acht': '8', 'neun': '9'
    };
    
    for (const [word, num] of Object.entries(numberMap)) {
      normalized = normalized.replace(new RegExp(`\\b${word}\\b`, 'gi'), num);
    }
    
    // "Typ ah" → "Typ A"
    normalized = normalized.replace(/\btyp\s+(ah?|a)\b/gi, 'TYP A');
    normalized = normalized.replace(/\btyp\s+(eh?|e)\b/gi, 'TYP E');
    normalized = normalized.replace(/\btyp\s+(geh?|g)\b/gi, 'TYP G');
    normalized = normalized.replace(/\btyp\s+(ha|h)\b/gi, 'TYP H');
    
    // Usuń zbędne spacje
    normalized = normalized.replace(/\s+/g, ' ').trim();
    
    return normalized;
  }
};

// Rozszerzenie Storage o ostatnie wyszukiwania
if (typeof Storage !== 'undefined' && Storage.getRecentSearches === undefined) {
  Storage.getRecentSearches = function() {
    try {
      return JSON.parse(localStorage.getItem('vg_recent_searches') || '[]');
    } catch (e) {
      return [];
    }
  };
}

// Export
window.OfflineVoice = OfflineVoice;