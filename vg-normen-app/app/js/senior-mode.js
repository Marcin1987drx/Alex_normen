/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SENIOR MODE - Maksymalna prostota i automatyzacja UI
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Funkcje ułatwiające obsługę dla starszych użytkowników:
 * - Duże przyciski i czytelne teksty
 * - Automatyczne akcje (1 klik zamiast wielu)
 * - Floating Action Buttons
 * - Auto-sugestie wyszukiwania
 * - Uproszczona nawigacja
 * - Kontekstowe podpowiedzi
 * 
 * @author VG-Normen Wissenssystem
 * @version 1.0
 */

const SeniorMode = {
  
  // Stan
  isActive: true, // Domyślnie włączony
  recentSearches: [],
  quickActions: [],
  
  /**
   * Inicjalizacja Senior Mode
   */
  init() {
    console.log('👴 Senior Mode wird initialisiert...');
    
    // Załaduj ustawienia
    this.loadSettings();
    
    // Dodaj elementy UI
    this.createFloatingActionButton();
    this.createQuickSearchSuggestions();
    this.createContextualHelp();
    this.enhanceButtons();
    this.setupAutoComplete();
    this.setupOneClickActions();
    
    // Event listenery
    this.setupEventListeners();
    
    console.log('✅ Senior Mode aktywiert');
  },
  
  /**
   * Załaduj ustawienia
   */
  loadSettings() {
    try {
      const saved = localStorage.getItem('seniorModeSettings');
      if (saved) {
        const settings = JSON.parse(saved);
        this.isActive = settings.isActive ?? true;
        this.recentSearches = settings.recentSearches || [];
      }
    } catch (e) {
      console.warn('Konnte Senior Mode Einstellungen nicht laden:', e);
    }
  },
  
  /**
   * Zapisz ustawienia
   */
  saveSettings() {
    try {
      localStorage.setItem('seniorModeSettings', JSON.stringify({
        isActive: this.isActive,
        recentSearches: this.recentSearches.slice(0, 10)
      }));
    } catch (e) {
      console.warn('Konnte Senior Mode Einstellungen nicht speichern:', e);
    }
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // FLOATING ACTION BUTTON (FAB)
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Tworzy Floating Action Button z najważniejszymi akcjami
   */
  createFloatingActionButton() {
    // Usuń istniejący jeśli jest
    const existing = document.getElementById('seniorFAB');
    if (existing) existing.remove();
    
    const fab = document.createElement('div');
    fab.id = 'seniorFAB';
    fab.className = 'senior-fab';
    fab.innerHTML = `
      <div class="fab-menu" id="fabMenu">
        <button class="fab-item" onclick="SeniorMode.quickAction('home')" title="Zur Startseite">
          <span class="fab-icon">🏠</span>
          <span class="fab-label">START</span>
        </button>
        <button class="fab-item" onclick="SeniorMode.quickAction('search')" title="Suche öffnen">
          <span class="fab-icon">🔍</span>
          <span class="fab-label">SUCHEN</span>
        </button>
        <button class="fab-item" onclick="SeniorMode.quickAction('voice')" title="Sprachsuche">
          <span class="fab-icon">🎤</span>
          <span class="fab-label">SPRECHEN</span>
        </button>
        <button class="fab-item" onclick="SeniorMode.quickAction('print')" title="Seite drucken">
          <span class="fab-icon">🖨️</span>
          <span class="fab-label">DRUCKEN</span>
        </button>
        <button class="fab-item" onclick="SeniorMode.quickAction('bigger')" title="Schrift vergrößern">
          <span class="fab-icon">🔍+</span>
          <span class="fab-label">GRÖSSER</span>
        </button>
        <button class="fab-item fab-back" onclick="SeniorMode.quickAction('back')" title="Zurück">
          <span class="fab-icon">←</span>
          <span class="fab-label">ZURÜCK</span>
        </button>
      </div>
      <button class="fab-main" onclick="SeniorMode.toggleFABMenu()" title="Schnellmenü">
        <span class="fab-icon-main">⚡</span>
      </button>
    `;
    
    document.body.appendChild(fab);
  },
  
  /**
   * Toggle FAB Menu
   */
  toggleFABMenu() {
    const fab = document.getElementById('seniorFAB');
    fab.classList.toggle('open');
  },
  
  /**
   * Quick Action Handler
   */
  quickAction(action) {
    // Zamknij menu
    const fab = document.getElementById('seniorFAB');
    fab.classList.remove('open');
    
    switch (action) {
      case 'home':
        if (typeof navigateTo === 'function') navigateTo('home');
        break;
      case 'search':
        this.focusSearch();
        break;
      case 'voice':
        if (typeof startVoiceSearch === 'function') startVoiceSearch();
        break;
      case 'print':
        window.print();
        break;
      case 'bigger':
        this.increaseFontSize();
        break;
      case 'back':
        if (typeof goBack === 'function') goBack();
        break;
    }
  },
  
  /**
   * Fokus na wyszukiwarkę z animacją
   */
  focusSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        searchInput.focus();
        searchInput.select();
      }, 300);
    }
  },
  
  /**
   * Zwiększ rozmiar czcionki
   */
  increaseFontSize() {
    const body = document.body;
    const current = body.classList.contains('font-sehr-gross') ? 'sehr-gross' :
                    body.classList.contains('font-gross') ? 'gross' : 'normal';
    
    const next = current === 'normal' ? 'gross' : 
                 current === 'gross' ? 'sehr-gross' : 'sehr-gross';
    
    if (typeof setFontSize === 'function') {
      setFontSize(next);
    } else {
      body.classList.remove('font-normal', 'font-gross', 'font-sehr-gross');
      body.classList.add(`font-${next}`);
    }
    
    UI?.showToast?.(`Schriftgröße: ${next === 'sehr-gross' ? 'SEHR GROSS' : next.toUpperCase()}`, 'success');
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // QUICK SEARCH SUGGESTIONS
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Tworzy panel sugestii wyszukiwania
   */
  createQuickSearchSuggestions() {
    const searchContainer = document.querySelector('.search-container');
    if (!searchContainer) return;
    
    // Usuń istniejący
    const existing = document.getElementById('searchSuggestions');
    if (existing) existing.remove();
    
    const suggestions = document.createElement('div');
    suggestions.id = 'searchSuggestions';
    suggestions.className = 'search-suggestions';
    suggestions.innerHTML = `
      <div class="suggestions-header">
        <span>📌 Häufige Suchen:</span>
      </div>
      <div class="suggestions-chips" id="suggestionsChips">
        <button class="suggestion-chip" onclick="SeniorMode.quickSearch('Crimphöhe')">🔧 Crimphöhe</button>
        <button class="suggestion-chip" onclick="SeniorMode.quickSearch('AWG Tabelle')">📊 AWG Tabelle</button>
        <button class="suggestion-chip" onclick="SeniorMode.quickSearch('Zugtest')">💪 Zugtest</button>
        <button class="suggestion-chip" onclick="SeniorMode.quickSearch('Schrumpfschlauch')">🔥 Schrumpfschlauch</button>
        <button class="suggestion-chip" onclick="SeniorMode.quickSearch('Stecker')">🔌 Stecker</button>
        <button class="suggestion-chip" onclick="SeniorMode.quickSearch('Isolierung')">📏 Isolierung</button>
        <button class="suggestion-chip" onclick="SeniorMode.quickSearch('Lötverbindung')">🔩 Lötverbindung</button>
        <button class="suggestion-chip" onclick="SeniorMode.quickSearch('gut schlecht')">✅ Gut/Schlecht</button>
      </div>
      <div class="recent-searches" id="recentSearches" style="display: none;">
        <span>🕐 Zuletzt gesucht:</span>
        <div class="recent-chips" id="recentChips"></div>
      </div>
    `;
    
    searchContainer.appendChild(suggestions);
    
    // Aktualizuj ostatnie wyszukiwania
    this.updateRecentSearches();
  },
  
  /**
   * Quick Search - natychmiastowe wyszukiwanie
   */
  quickSearch(term) {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.value = term;
    }
    
    // Dodaj do ostatnich
    this.addRecentSearch(term);
    
    // Wykonaj wyszukiwanie
    if (typeof handleSearch === 'function') {
      handleSearch(term);
    } else if (typeof performSearch === 'function') {
      performSearch();
    }
    
    // Ukryj sugestie
    this.hideSuggestions();
  },
  
  /**
   * Dodaj do ostatnich wyszukiwań
   */
  addRecentSearch(term) {
    // Usuń jeśli już istnieje
    this.recentSearches = this.recentSearches.filter(s => s.toLowerCase() !== term.toLowerCase());
    // Dodaj na początek
    this.recentSearches.unshift(term);
    // Ogranicz do 5
    this.recentSearches = this.recentSearches.slice(0, 5);
    // Zapisz
    this.saveSettings();
    // Aktualizuj UI
    this.updateRecentSearches();
  },
  
  /**
   * Aktualizuj wyświetlanie ostatnich wyszukiwań
   */
  updateRecentSearches() {
    const container = document.getElementById('recentSearches');
    const chips = document.getElementById('recentChips');
    
    if (!container || !chips) return;
    
    if (this.recentSearches.length === 0) {
      container.style.display = 'none';
      return;
    }
    
    container.style.display = 'block';
    chips.innerHTML = this.recentSearches.map(term => 
      `<button class="suggestion-chip recent" onclick="SeniorMode.quickSearch('${term.replace(/'/g, "\\'")}')">${term}</button>`
    ).join('');
  },
  
  /**
   * Pokaż sugestie
   */
  showSuggestions() {
    const suggestions = document.getElementById('searchSuggestions');
    if (suggestions) {
      suggestions.classList.add('visible');
    }
  },
  
  /**
   * Ukryj sugestie
   */
  hideSuggestions() {
    const suggestions = document.getElementById('searchSuggestions');
    if (suggestions) {
      setTimeout(() => suggestions.classList.remove('visible'), 200);
    }
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // CONTEXTUAL HELP
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Tworzy kontekstową pomoc
   */
  createContextualHelp() {
    // Usuń istniejący
    const existing = document.getElementById('contextHelp');
    if (existing) existing.remove();
    
    const help = document.createElement('div');
    help.id = 'contextHelp';
    help.className = 'context-help';
    help.innerHTML = `
      <div class="help-content">
        <span class="help-icon">💡</span>
        <span class="help-text" id="helpText">Klicken Sie auf ein Thema für mehr Details</span>
      </div>
      <button class="help-dismiss" onclick="SeniorMode.dismissHelp()">✕</button>
    `;
    
    document.body.appendChild(help);
  },
  
  /**
   * Pokaż kontekstową pomoc
   */
  showContextHelp(message, duration = 5000) {
    const help = document.getElementById('contextHelp');
    const text = document.getElementById('helpText');
    
    if (!help || !text) return;
    
    text.textContent = message;
    help.classList.add('visible');
    
    // Auto-ukryj po czasie
    if (duration > 0) {
      setTimeout(() => help.classList.remove('visible'), duration);
    }
  },
  
  /**
   * Ukryj pomoc
   */
  dismissHelp() {
    const help = document.getElementById('contextHelp');
    if (help) help.classList.remove('visible');
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // ENHANCED BUTTONS
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Ulepsz wszystkie przyciski - większe, z ripple effect
   */
  enhanceButtons() {
    // Dodaj ripple effect do wszystkich przycisków
    document.addEventListener('click', (e) => {
      const button = e.target.closest('button, .quick-access-card, .category-card, .main-area-card, .encyclopedia-card');
      if (button) {
        this.createRipple(e, button);
      }
    });
    
    // Dodaj hover feedback dla touch
    document.addEventListener('touchstart', (e) => {
      const button = e.target.closest('button, .quick-access-card, .category-card');
      if (button) {
        button.classList.add('touch-active');
      }
    });
    
    document.addEventListener('touchend', () => {
      document.querySelectorAll('.touch-active').forEach(el => {
        el.classList.remove('touch-active');
      });
    });
  },
  
  /**
   * Tworzy ripple effect
   */
  createRipple(event, element) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
    
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // AUTOCOMPLETE
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Setup auto-complete dla wyszukiwarki
   */
  setupAutoComplete() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    // Debounce typing
    let debounceTimer;
    
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      
      const query = e.target.value.trim();
      
      if (query.length < 2) {
        this.hideAutoComplete();
        return;
      }
      
      debounceTimer = setTimeout(() => {
        this.showAutoComplete(query);
      }, 150);
    });
    
    // Pokaż sugestie na focus
    searchInput.addEventListener('focus', () => {
      this.showSuggestions();
    });
    
    // Ukryj na blur (z opóźnieniem dla kliknięć)
    searchInput.addEventListener('blur', () => {
      setTimeout(() => {
        this.hideSuggestions();
        this.hideAutoComplete();
      }, 200);
    });
  },
  
  /**
   * Pokaż auto-complete
   */
  showAutoComplete(query) {
    // Pobierz sugestie z SearchEngine
    let suggestions = [];
    
    if (typeof SearchEngine !== 'undefined' && SearchEngine.getAutocompleteSuggestions) {
      suggestions = SearchEngine.getAutocompleteSuggestions(query, 5);
    } else {
      // Fallback - proste dopasowanie
      const allTerms = ['Crimphöhe', 'Crimpverbindung', 'Zugtest', 'AWG', 'Schrumpfschlauch', 
                        'Stecker', 'Kontakt', 'Isolierung', 'Lötverbindung', 'VG 95218'];
      suggestions = allTerms.filter(t => t.toLowerCase().includes(query.toLowerCase()));
    }
    
    if (suggestions.length === 0) {
      this.hideAutoComplete();
      return;
    }
    
    // Utwórz/aktualizuj dropdown
    let dropdown = document.getElementById('autoCompleteDropdown');
    if (!dropdown) {
      dropdown = document.createElement('div');
      dropdown.id = 'autoCompleteDropdown';
      dropdown.className = 'autocomplete-dropdown';
      document.querySelector('.search-container')?.appendChild(dropdown);
    }
    
    dropdown.innerHTML = suggestions.map(s => 
      `<div class="autocomplete-item" onclick="SeniorMode.selectAutoComplete('${s.title || s}')">${s.icon || '📄'} ${s.title || s}</div>`
    ).join('');
    
    dropdown.classList.add('visible');
  },
  
  /**
   * Ukryj auto-complete
   */
  hideAutoComplete() {
    const dropdown = document.getElementById('autoCompleteDropdown');
    if (dropdown) dropdown.classList.remove('visible');
  },
  
  /**
   * Wybierz z auto-complete
   */
  selectAutoComplete(term) {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.value = term;
    }
    this.hideAutoComplete();
    this.quickSearch(term);
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // ONE-CLICK ACTIONS
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Setup akcji jednym kliknięciem
   */
  setupOneClickActions() {
    // Double-click na kartę = otwórz i drukuj
    document.addEventListener('dblclick', (e) => {
      const card = e.target.closest('.card, .encyclopedia-card');
      if (card && card.dataset.printable) {
        // Otwórz i od razu drukuj
        const itemId = card.dataset.id;
        if (itemId && typeof openItem === 'function') {
          openItem(itemId);
          setTimeout(() => window.print(), 500);
        }
      }
    });
    
    // Long press na mobile = kontekstowe menu
    let longPressTimer;
    
    document.addEventListener('touchstart', (e) => {
      const card = e.target.closest('.card, .encyclopedia-card, .doc-card');
      if (card) {
        longPressTimer = setTimeout(() => {
          this.showCardContextMenu(card, e.touches[0]);
        }, 600);
      }
    });
    
    document.addEventListener('touchend', () => {
      clearTimeout(longPressTimer);
    });
    
    document.addEventListener('touchmove', () => {
      clearTimeout(longPressTimer);
    });
  },
  
  /**
   * Pokaż kontekstowe menu dla karty
   */
  showCardContextMenu(card, touch) {
    // Usuń istniejące
    const existing = document.getElementById('cardContextMenu');
    if (existing) existing.remove();
    
    const itemId = card.dataset.id;
    const title = card.querySelector('h3, .card-title')?.textContent || 'Element';
    
    const menu = document.createElement('div');
    menu.id = 'cardContextMenu';
    menu.className = 'card-context-menu';
    menu.innerHTML = `
      <div class="context-menu-header">${title}</div>
      <button onclick="SeniorMode.contextAction('open', '${itemId}')">📖 Öffnen</button>
      <button onclick="SeniorMode.contextAction('favorite', '${itemId}')">⭐ Als Favorit</button>
      <button onclick="SeniorMode.contextAction('print', '${itemId}')">🖨️ Drucken</button>
      <button onclick="SeniorMode.contextAction('close')">✕ Schließen</button>
    `;
    
    menu.style.left = `${touch.clientX}px`;
    menu.style.top = `${touch.clientY}px`;
    
    document.body.appendChild(menu);
    
    // Zamknij po kliknięciu poza
    setTimeout(() => {
      document.addEventListener('click', function handler(e) {
        if (!menu.contains(e.target)) {
          menu.remove();
          document.removeEventListener('click', handler);
        }
      });
    }, 100);
  },
  
  /**
   * Context action handler
   */
  contextAction(action, itemId) {
    const menu = document.getElementById('cardContextMenu');
    if (menu) menu.remove();
    
    switch (action) {
      case 'open':
        if (typeof openItem === 'function') openItem(itemId);
        break;
      case 'favorite':
        if (typeof toggleFavoriteById === 'function') toggleFavoriteById(itemId);
        UI?.showToast?.('Als Favorit markiert!', 'success');
        break;
      case 'print':
        if (typeof openItem === 'function') {
          openItem(itemId);
          setTimeout(() => window.print(), 500);
        }
        break;
    }
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // EVENT LISTENERS
  // ═══════════════════════════════════════════════════════════════════════════
  
  setupEventListeners() {
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // ESC = zamknij menu/wróć
      if (e.key === 'Escape') {
        const fab = document.getElementById('seniorFAB');
        if (fab?.classList.contains('open')) {
          fab.classList.remove('open');
          return;
        }
        if (typeof goBack === 'function') goBack();
      }
      
      // + / - dla rozmiaru czcionki
      if (e.key === '+' || e.key === '=') {
        this.increaseFontSize();
      }
      
      // Ctrl+F = fokus na wyszukiwarkę
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        this.focusSearch();
      }
      
      // F1 = pomoc
      if (e.key === 'F1') {
        e.preventDefault();
        if (typeof showHelp === 'function') showHelp();
      }
    });
    
    // Scroll - pokaż/ukryj FAB
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const fab = document.getElementById('seniorFAB');
      if (!fab) return;
      
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > lastScroll && currentScroll > 200) {
        fab.classList.add('hidden');
      } else {
        fab.classList.remove('hidden');
      }
      
      lastScroll = currentScroll;
    });
    
    // Page change - aktualizuj kontekstową pomoc
    document.addEventListener('pageChanged', (e) => {
      const page = e.detail?.page;
      const helpMessages = {
        'home': '💡 Klicken Sie auf ein Thema für mehr Details',
        'wissensbasis': '💡 Wählen Sie eine Kategorie oder suchen Sie nach einem Begriff',
        'detail': '💡 Scrollen Sie nach unten für verwandte Themen. Klicken Sie ⭐ für Favoriten.',
        'search': '💡 Klicken Sie auf ein Ergebnis zum Öffnen',
        'formulare': '💡 Klicken Sie auf ein Formular zum Drucken'
      };
      
      if (helpMessages[page]) {
        this.showContextHelp(helpMessages[page]);
      }
    });
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// AUTO-INIT
// ═══════════════════════════════════════════════════════════════════════════════

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => SeniorMode.init());
} else {
  // Opóźnij inicjalizację aby inne skrypty się załadowały
  setTimeout(() => SeniorMode.init(), 100);
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SeniorMode;
}
