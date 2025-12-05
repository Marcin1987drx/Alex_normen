// ═══════════════════════════════════════════════════════════════════════════════
// VG-NORMEN WISSENSSYSTEM - MAIN APPLICATION
// Hauptanwendungslogik und Initialisierung
// ═══════════════════════════════════════════════════════════════════════════════

// Globale App State
const App = {
  currentPage: 'home',
  currentCategory: null,
  searchQuery: '',
  wissensbasis: null,
  userDocsPath: null,
  isElectron: false
};

// ═══════════════════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 VG-Normen Wissenssystem startet...');
  
  // Prüfen ob Electron
  App.isElectron = typeof window.electronAPI !== 'undefined';
  console.log(App.isElectron ? '💻 Electron Desktop-Modus' : '🌐 Browser-Modus');
  
  // Settings laden und anwenden
  applySettings();
  
  // Wissensbasis laden
  await loadWissensbasis();
  
  // User Documents Pfad setzen (Electron)
  if (App.isElectron) {
    App.userDocsPath = await window.electronAPI.getUserDocsPath();
  }
  
  // UI initialisieren
  initializeUI();
  
  // Event Listeners
  setupEventListeners();
  
  // Startseite rendern
  renderHomePage();
  
  // Favoriten und Historie rendern
  UI.renderFavorites();
  UI.renderHistory();
  
  console.log('✅ Anwendung bereit!');
});

// ═══════════════════════════════════════════════════════════════════════════════
// WISSENSBASIS LOADING
// ═══════════════════════════════════════════════════════════════════════════════

async function loadWissensbasis() {
  try {
    // Ładuj pełną wissensbasis z plików TEIL JSON
    if (window.WissensbasisLoader) {
      App.wissensbasis = await WissensbasisLoader.ladeDaten();
      App.teilDaten = WissensbasisLoader.teilDaten;
      console.log(`📚 ${App.wissensbasis.length} Wissenskarten aus TEIL-Dateien geladen`);
    } else {
      // Fallback do starego karten.json
      const response = await fetch('wissensbasis/karten.json');
      App.wissensbasis = await response.json();
      console.log(`📚 ${App.wissensbasis.length} Wissenskarten geladen (Fallback)`);
    }
  } catch (error) {
    console.error('Fehler beim Laden der Wissensbasis:', error);
    App.wissensbasis = [];
    UI.showToast('Wissensbasis konnte nicht geladen werden', 'error');
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════════════════════════════════

function applySettings() {
  const settings = Storage.getSettings();
  
  // Schriftgröße
  document.documentElement.setAttribute('data-font-size', settings.fontSize);
  
  // Kontrast
  document.documentElement.setAttribute('data-contrast', settings.highContrast ? 'high' : 'normal');
  
  // UI aktualisieren
  UI.updateSettingsUI();
}

function changeFontSize(size) {
  const settings = Storage.getSettings();
  settings.fontSize = size;
  Storage.saveSettings(settings);
  applySettings();
  UI.showToast(`Schriftgröße: ${size === 'large' ? 'Groß' : size === 'xlarge' ? 'Sehr groß' : 'Normal'}`, 'success');
}

function toggleHighContrast() {
  const settings = Storage.getSettings();
  settings.highContrast = !settings.highContrast;
  Storage.saveSettings(settings);
  applySettings();
  UI.showToast(settings.highContrast ? 'Hoher Kontrast aktiviert' : 'Normaler Kontrast', 'success');
}

// ═══════════════════════════════════════════════════════════════════════════════
// UI INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

function initializeUI() {
  // Version anzeigen
  const versionEl = document.getElementById('appVersion');
  if (versionEl) {
    versionEl.textContent = `v${CONFIG.appVersion}`;
  }
  
  // Datum aktualisieren
  const dateEl = document.getElementById('currentDate');
  if (dateEl) {
    dateEl.textContent = Utils.formatDate(new Date(), 'long');
  }
  
  // Back-Button initial verstecken
  const backBtn = document.getElementById('btnBack');
  if (backBtn) {
    backBtn.style.display = 'none';
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EVENT LISTENERS
// ═══════════════════════════════════════════════════════════════════════════════

function setupEventListeners() {
  // Suche
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', Utils.debounce(handleSearch, 300));
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSearch();
    });
  }
  
  // Voice Search Button
  const voiceBtn = document.getElementById('btnVoiceSearch');
  if (voiceBtn) {
    voiceBtn.addEventListener('click', startVoiceSearch);
  }
  
  // Back Button
  const backBtn = document.getElementById('btnBack');
  if (backBtn) {
    backBtn.addEventListener('click', goBack);
  }
  
  // Modal schließen bei ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      UI.closeAllModals();
    }
  });
  
  // Modal schließen bei Klick außerhalb
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });
  
  // Quick Access Tiles
  document.querySelectorAll('.quick-tile').forEach(tile => {
    tile.addEventListener('click', () => {
      const category = tile.dataset.category;
      if (category) {
        openCategory(category);
      }
    });
  });
  
  // Keyboard Shortcuts
  document.addEventListener('keydown', handleKeyboardShortcuts);
}

function handleKeyboardShortcuts(e) {
  // Strg+F: Fokus auf Suche
  if (e.ctrlKey && e.key === 'f') {
    e.preventDefault();
    document.getElementById('searchInput')?.focus();
  }
  
  // Strg+H: Home
  if (e.ctrlKey && e.key === 'h') {
    e.preventDefault();
    navigateTo('home');
  }
  
  // Strg+P: Drucken (nur wenn Electron)
  if (e.ctrlKey && e.key === 'p' && App.isElectron) {
    e.preventDefault();
    printCurrentPage();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════════

function navigateTo(page, subCategory) {
  App.currentPage = page;
  
  switch (page) {
    case 'home':
      renderHomePage();
      UI.updateBreadcrumbs([]);
      break;
      
    case 'wissensbasis':
      renderWissensbasisPage(subCategory);
      UI.updateBreadcrumbs([{ title: '📚 Wissensbasis' }]);
      break;
      
    case 'formulare':
      renderFormularePage();
      UI.updateBreadcrumbs([{ title: '📋 Formulare' }]);
      break;
      
    case 'tabellen':
      renderTabellenPage();
      UI.updateBreadcrumbs([{ title: '📊 Tabellen' }]);
      break;
      
    case 'bilder':
      renderBilderPage();
      UI.updateBreadcrumbs([{ title: '📷 Bilder' }]);
      break;
      
    case 'meine-dokumente':
      renderMeineDokumentePage();
      UI.updateBreadcrumbs([{ title: '📁 Meine Dokumente' }]);
      break;
      
    case 'import':
      renderImportPage();
      UI.updateBreadcrumbs([
        { title: '📁 Meine Dokumente', onclick: "navigateTo('meine-dokumente')" },
        { title: '📥 Import' }
      ]);
      break;
  }
  
  UI.showPage(page);
}

function goBack() {
  if (App.currentPage !== 'home') {
    navigateTo('home');
  }
}

function openCategory(categoryKey) {
  const category = CONFIG.categories[categoryKey];
  if (!category) return;
  
  App.currentCategory = categoryKey;
  App.currentPage = 'category';
  
  // Breadcrumbs
  UI.updateBreadcrumbs([
    { title: category.title }
  ]);
  
  // Karten für Kategorie filtern
  const cards = App.wissensbasis.filter(card => card.category === categoryKey);
  
  // Kategorie-Seite rendern
  renderCategoryPage(category, cards);
  
  UI.showPage('category');
}

function openItem(itemId, type) {
  const item = App.wissensbasis.find(i => i.id === itemId);
  if (!item) return;
  
  // Historie aktualisieren
  Storage.addToHistory({
    id: item.id,
    title: item.title,
    type: type || item.type,
    icon: item.icon
  });
  
  // Detail-Seite rendern
  renderDetailPage(item);
  
  // Breadcrumbs
  const category = CONFIG.categories[item.category];
  UI.updateBreadcrumbs([
    { title: category?.title || 'Kategorie', action: () => openCategory(item.category) },
    { title: item.title }
  ]);
  
  UI.showPage('detail');
  UI.renderHistory();
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOME PAGE RENDERING
// ═══════════════════════════════════════════════════════════════════════════════

function renderHomePage() {
  // Quick Access Tiles aktualisieren
  document.querySelectorAll('.quick-tile').forEach(tile => {
    const category = tile.dataset.category;
    if (category && CONFIG.categories[category]) {
      const cat = CONFIG.categories[category];
      tile.innerHTML = `
        <span class="tile-icon">${cat.icon}</span>
        <span class="tile-label">${cat.title}</span>
      `;
    }
  });
  
  // Statistiken
  const statsEl = document.getElementById('homeStats');
  if (statsEl) {
    const favCount = Storage.getFavorites().length;
    const histCount = Storage.getHistory().length;
    const docCount = Object.keys(Storage.getUserDocs()).length;
    
    // Importierte Dokumente zählen
    let importCount = 0;
    if (typeof documentImporter !== 'undefined') {
      importCount = documentImporter.importedDocuments.length;
    }
    
    statsEl.innerHTML = `
      <span>⭐ ${favCount} Favoriten</span>
      <span>📄 ${docCount + importCount} Dokumente</span>
      <span>🕐 ${histCount} in Historie</span>
    `;
  }
  
  // User Docs Count aktualisieren
  const userDocsCount = document.getElementById('userDocsCount');
  if (userDocsCount) {
    let totalDocs = Object.keys(Storage.getUserDocs()).length;
    if (typeof documentImporter !== 'undefined') {
      totalDocs += documentImporter.importedDocuments.length;
    }
    userDocsCount.textContent = `📄 ${totalDocs} Dokumente`;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORY PAGE RENDERING
// ═══════════════════════════════════════════════════════════════════════════════

function renderCategoryPage(category, cards) {
  const container = document.getElementById('categoryContent');
  if (!container) return;
  
  // Header
  container.innerHTML = `
    <div class="category-header" style="border-left-color: ${category.color}">
      <h2>${category.icon} ${category.title}</h2>
      <p class="category-norm">${category.norm}</p>
      <p>${category.description}</p>
    </div>
    <div class="cards-grid" id="categoryCards"></div>
  `;
  
  // Karten rendern
  const cardsContainer = document.getElementById('categoryCards');
  
  if (cards.length === 0) {
    cardsContainer.innerHTML = UI.renderEmptyState(
      'Keine Einträge in dieser Kategorie gefunden.',
      '📭'
    );
    return;
  }
  
  cards.forEach(card => {
    const cardEl = UI.renderCard(card, () => openItem(card.id, card.type));
    cardsContainer.appendChild(cardEl);
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// DETAIL PAGE RENDERING
// ═══════════════════════════════════════════════════════════════════════════════

function renderDetailPage(item) {
  const container = document.getElementById('detailContent');
  if (!container) return;
  
  const isFav = Storage.isFavorite(item.id);
  
  // Sprawdź czy element ma pełne dane TEIL
  let contentHtml = item.content || '';
  
  // Jeśli ma teilDaten, wygeneruj bogatszą zawartość
  if (item.teilDaten) {
    contentHtml = renderTeilDatenContent(item);
  }
  
  // Jeśli ma formularDaten, wygeneruj widok formularza
  if (item.formularDaten) {
    contentHtml = renderFormularContent(item.formularDaten);
  }
  
  container.innerHTML = `
    <article class="detail-article">
      <header class="detail-header">
        <h1>${item.icon || '📄'} ${item.title}</h1>
        <div class="detail-actions">
          <button class="btn btn-icon ${isFav ? 'active' : ''}" onclick="toggleFavorite('${item.id}')" title="Favorit">
            ${isFav ? '⭐' : '☆'}
          </button>
          <button class="btn btn-icon" onclick="printItem('${item.id}')" title="Drucken">🖨️</button>
        </div>
      </header>
      
      ${item.norm ? `<div class="detail-norm">Norm: ${item.norm}</div>` : ''}
      
      ${item.description ? `<p class="detail-description">${item.description}</p>` : ''}
      
      <div class="detail-content">
        ${contentHtml}
      </div>
      
      ${item.keywords?.length ? `
        <div class="detail-keywords">
          <strong>Schlagworte:</strong>
          ${item.keywords.map(k => `<span class="tag">${k}</span>`).join('')}
        </div>
      ` : ''}
      
      ${item.related?.length ? `
        <div class="detail-related">
          <h3>Verwandte Themen</h3>
          <div class="related-links">
            ${item.related.map(relId => {
              const rel = App.wissensbasis.find(r => r.id === relId);
              return rel ? `<a href="#" onclick="openItem('${rel.id}')">${rel.title}</a>` : '';
            }).join('')}
          </div>
        </div>
      ` : ''}
    </article>
  `;
}

// Renderuj zawartość z danych TEIL
function renderTeilDatenContent(item) {
  const daten = item.teilDaten;
  if (!daten) return item.content || '';
  
  let html = '<div class="teil-content">';
  
  // Dla przeglądu pokaż strukturę
  if (item.type === 'overview') {
    // VG-Hierarchie
    if (daten.vg_hierarchie) {
      html += '<h3>📊 VG-Normen Struktur</h3>';
      html += '<table class="data-table"><thead><tr><th>Norm</th><th>Titel</th><th>Beschreibung</th></tr></thead><tbody>';
      daten.vg_hierarchie.forEach(n => {
        html += `<tr><td><strong>${n.norm}</strong></td><td>${n.titel}</td><td>${n.beschreibung}</td></tr>`;
      });
      html += '</tbody></table>';
    }
    
    // Temperatursysteme dla Kabelgarnituren
    if (daten.temperatursysteme) {
      html += '<h3>🌡️ Temperatursysteme</h3>';
      html += '<div class="systems-grid">';
      Object.entries(daten.temperatursysteme).forEach(([key, sys]) => {
        html += `
          <div class="system-card">
            <h4>System ${key}</h4>
            <p><strong>${sys.bezeichnung || ''}</strong></p>
            ${sys.temperaturbereich ? `<p>${sys.temperaturbereich.min}°C bis ${sys.temperaturbereich.max}°C</p>` : ''}
            ${sys.typische_anwendungen ? `<p class="small">${sys.typische_anwendungen.join(', ')}</p>` : ''}
          </div>
        `;
      });
      html += '</div>';
    }
    
    // Drahttypen
    if (daten.drahttypen) {
      html += '<h3>🔌 Drahttypen nach VG 95218</h3>';
      html += '<div class="types-grid">';
      Object.entries(daten.drahttypen).forEach(([key, typ]) => {
        html += `
          <div class="type-card">
            <h4>${typ.icon || '📏'} ${typ.bezeichnung}</h4>
            <p>${typ.beschreibung}</p>
            <p><strong>Material:</strong> ${typ.isolationsmaterial}</p>
            <p><strong>Temperatur:</strong> ${typ.temperaturbereich_min}°C bis ${typ.temperaturbereich_max}°C</p>
          </div>
        `;
      });
      html += '</div>';
    }
    
    // Zugelassene Hersteller
    if (daten.zugelassene_hersteller?.liste) {
      html += '<h3>🏭 Zugelassene Hersteller (QPL)</h3>';
      html += '<div class="hersteller-grid">';
      daten.zugelassene_hersteller.liste.forEach(h => {
        html += `
          <div class="hersteller-card">
            <strong>${h.name}</strong>
            ${h.komponenten ? `<p class="small">${h.komponenten.join(', ')}</p>` : ''}
          </div>
        `;
      });
      html += '</div>';
    }
  }
  
  html += '</div>';
  return html;
}

// Renderuj zawartość formularza
function renderFormularContent(formDaten) {
  let html = '<div class="formular-content">';
  
  html += `<h3>📋 ${formDaten.titel}</h3>`;
  if (formDaten.beschreibung) {
    html += `<p class="formular-desc">${formDaten.beschreibung}</p>`;
  }
  
  // Pokaż sekcje formularza
  if (formDaten.abschnitte) {
    Object.entries(formDaten.abschnitte).forEach(([key, section]) => {
      html += `<div class="form-section">`;
      html += `<h4>${key.replace(/_/g, ' ').toUpperCase()}</h4>`;
      
      if (section.felder) {
        html += '<ul class="field-list">';
        section.felder.forEach(f => html += `<li>☐ ${f}</li>`);
        html += '</ul>';
      }
      
      if (section.pruefpunkte) {
        html += '<table class="data-table"><thead><tr><th>Prüfpunkt</th><th>Status</th></tr></thead><tbody>';
        section.pruefpunkte.forEach(p => {
          const punkt = typeof p === 'string' ? p : p.punkt;
          html += `<tr><td>${punkt}</td><td>☐ OK ☐ NOK ☐ N/A</td></tr>`;
        });
        html += '</tbody></table>';
      }
      
      html += '</div>';
    });
  }
  
  // Pokaż listę prüfpunkte dla prostszych formularzy
  if (formDaten.pruefungen) {
    formDaten.pruefungen.forEach(p => {
      html += `<div class="form-section">`;
      html += `<h4>${p.typ}</h4>`;
      html += '<ul>';
      p.punkte.forEach(punkt => html += `<li>☐ ${punkt}</li>`);
      html += '</ul></div>';
    });
  }
  
  html += '</div>';
  return html;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SEARCH
// ═══════════════════════════════════════════════════════════════════════════════

function handleSearch() {
  const input = document.getElementById('searchInput');
  const query = input?.value?.trim() || '';
  
  if (query.length < 2) {
    if (App.currentPage === 'search') {
      navigateTo('home');
    }
    return;
  }
  
  App.searchQuery = query;
  
  // Wissensbasis durchsuchen
  const wbResults = SearchEngine.searchWissensbasis(query, App.wissensbasis);
  
  // User Docs durchsuchen
  const udResults = SearchEngine.searchUserDocs(query);
  
  // Importierte Dokumente durchsuchen
  let importResults = [];
  if (typeof documentImporter !== 'undefined') {
    const importedMatches = documentImporter.searchDocuments(query);
    importResults = importedMatches.map(doc => ({
      id: `import-${doc.id}`,
      title: doc.title,
      type: 'imported',
      icon: doc.formatIcon || '📄',
      source: 'Importierte Dokumente',
      preview: doc.content.substring(0, 200) + '...',
      tags: doc.tags,
      category: doc.category,
      onclick: `documentImporter.viewDocument(${documentImporter.importedDocuments.indexOf(doc)})`
    }));
  }
  
  // Ergebnisse zusammenführen
  const results = [...wbResults, ...udResults, ...importResults];
  
  // Ergebnisse anzeigen
  UI.renderSearchResults(results, query);
  
  // Zur Suchseite wechseln
  UI.showPage('search');
  App.currentPage = 'search';
  
  UI.updateBreadcrumbs([
    { title: `Suche: "${query}"` }
  ]);
}

function clearSearch() {
  const input = document.getElementById('searchInput');
  if (input) {
    input.value = '';
    input.focus();
  }
  
  if (App.currentPage === 'search') {
    navigateTo('home');
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// VOICE SEARCH
// ═══════════════════════════════════════════════════════════════════════════════

// Globalna zmienna dla rozpoznawania mowy
let currentRecognition = null;

function startVoiceSearch() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    UI.showToast('Sprachsuche wird von diesem Browser nicht unterstützt. Nutzen Sie Chrome oder Edge.', 'error');
    return;
  }
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  currentRecognition = recognition;
  
  recognition.lang = 'de-DE';
  recognition.continuous = false;
  recognition.interimResults = true; // Pokaż tekst na bieżąco
  recognition.maxAlternatives = 1;
  
  const voiceBtn = document.getElementById('btnVoiceSearch');
  const voiceModal = document.getElementById('modalVoice');
  const voiceTranscript = document.getElementById('voiceTranscript');
  
  recognition.onstart = () => {
    voiceBtn?.classList.add('listening');
    if (voiceModal) {
      voiceModal.classList.add('active');
    }
    if (voiceTranscript) {
      voiceTranscript.textContent = '';
    }
    console.log('🎤 Spracherkennung gestartet...');
  };
  
  recognition.onresult = (event) => {
    let interimTranscript = '';
    let finalTranscript = '';
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }
    
    // Pokaż tekst na bieżąco w modalu
    if (voiceTranscript) {
      voiceTranscript.innerHTML = `
        <span class="final">${finalTranscript}</span>
        <span class="interim">${interimTranscript}</span>
      `;
    }
    
    // Jeśli jest końcowy wynik, wyszukaj
    if (finalTranscript) {
      const searchInput = document.getElementById('searchInput');
      if (searchInput) {
        searchInput.value = finalTranscript;
        
        // Zamknij modal i wyszukaj
        setTimeout(() => {
          if (voiceModal) voiceModal.classList.remove('active');
          handleSearch();
          UI.showToast(`Suche nach: "${finalTranscript}"`, 'success');
        }, 500);
      }
    }
  };
  
  recognition.onerror = (event) => {
    console.error('Voice recognition error:', event.error);
    
    let errorMsg = 'Spracherkennung fehlgeschlagen';
    switch(event.error) {
      case 'no-speech':
        errorMsg = 'Keine Sprache erkannt. Bitte sprechen Sie lauter.';
        break;
      case 'audio-capture':
        errorMsg = 'Kein Mikrofon gefunden. Prüfen Sie die Mikrofoneinstellungen.';
        break;
      case 'not-allowed':
        errorMsg = 'Mikrofonzugriff verweigert. Bitte erlauben Sie den Zugriff.';
        break;
      case 'network':
        errorMsg = 'Netzwerkfehler bei der Spracherkennung.';
        break;
    }
    
    UI.showToast(errorMsg, 'error');
    if (voiceModal) voiceModal.classList.remove('active');
  };
  
  recognition.onend = () => {
    voiceBtn?.classList.remove('listening');
    currentRecognition = null;
    console.log('🎤 Spracherkennung beendet');
  };
  
  try {
    recognition.start();
  } catch (e) {
    console.error('Fehler beim Starten der Spracherkennung:', e);
    UI.showToast('Spracherkennung konnte nicht gestartet werden', 'error');
  }
}

function stopVoiceSearch() {
  if (currentRecognition) {
    currentRecognition.stop();
    currentRecognition = null;
  }
  
  const voiceModal = document.getElementById('modalVoice');
  if (voiceModal) {
    voiceModal.classList.remove('active');
  }
  
  const voiceBtn = document.getElementById('btnVoiceSearch');
  if (voiceBtn) {
    voiceBtn.classList.remove('listening');
  }
  
  UI.showToast('Sprachsuche abgebrochen', 'info');
}

// ═══════════════════════════════════════════════════════════════════════════════
// FAVORITES
// ═══════════════════════════════════════════════════════════════════════════════

function toggleFavorite(itemId) {
  const item = App.wissensbasis.find(i => i.id === itemId);
  if (!item) return;
  
  const isFav = Storage.isFavorite(itemId);
  
  if (isFav) {
    Storage.removeFavorite(itemId);
    UI.showToast('Aus Favoriten entfernt', 'info');
  } else {
    Storage.addFavorite({
      id: item.id,
      title: item.title,
      type: item.type,
      icon: item.icon
    });
    UI.showToast('Zu Favoriten hinzugefügt', 'success');
  }
  
  // UI aktualisieren
  UI.renderFavorites();
  
  // Detail-Seite aktualisieren falls dort
  if (App.currentPage === 'detail') {
    renderDetailPage(item);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// USER DOCUMENTS
// ═══════════════════════════════════════════════════════════════════════════════

async function openUserDocuments() {
  UI.showPage('userDocs');
  App.currentPage = 'userDocs';
  
  UI.updateBreadcrumbs([
    { title: 'Meine Dokumente' }
  ]);
  
  await refreshUserDocuments();
}

async function refreshUserDocuments() {
  if (!App.isElectron) {
    UI.showToast('Dokumentenverwaltung nur in Desktop-Version', 'info');
    return;
  }
  
  try {
    const files = await window.electronAPI.scanFolder(App.userDocsPath);
    UI.renderUserDocuments(files);
  } catch (error) {
    console.error('Fehler beim Laden der Dokumente:', error);
    UI.showToast('Dokumente konnten nicht geladen werden', 'error');
  }
}

async function addUserDocuments() {
  if (!App.isElectron) {
    UI.showToast('Dokumentenverwaltung nur in Desktop-Version', 'info');
    return;
  }
  
  try {
    const filePaths = await window.electronAPI.openFileDialog({
      title: 'Dokumente auswählen',
      filters: [
        { name: 'Dokumente', extensions: ['pdf', 'docx', 'doc', 'txt', 'xlsx', 'xls'] }
      ],
      multiSelections: true
    });
    
    if (!filePaths || filePaths.length === 0) return;
    
    // Dateien kopieren und analysieren
    for (const filePath of filePaths) {
      await processNewDocument(filePath);
    }
    
    await refreshUserDocuments();
    UI.showToast(`${filePaths.length} Dokument(e) hinzugefügt`, 'success');
    
  } catch (error) {
    console.error('Fehler beim Hinzufügen:', error);
    UI.showToast('Dokumente konnten nicht hinzugefügt werden', 'error');
  }
}

async function processNewDocument(filePath) {
  const fileName = filePath.split(/[/\\]/).pop();
  const ext = Utils.getFileExtension(fileName);
  
  // Text extrahieren für Analyse
  let text = '';
  try {
    if (ext === 'pdf') {
      text = await PDFExtractor.extractFirstPage(filePath);
    } else if (ext === 'docx' || ext === 'doc') {
      text = await DOCXExtractor.extractPreview(filePath);
    }
  } catch (e) {
    console.warn('Textextraktion fehlgeschlagen:', e);
  }
  
  // Analyse durchführen
  const analysis = await DocumentAnalyzer.analyze(text, fileName);
  
  // In user_documents kopieren
  const targetPath = `${App.userDocsPath}/${fileName}`;
  await window.electronAPI.copyFile(filePath, targetPath);
  
  // Metadaten speichern
  const userDocs = Storage.getUserDocs();
  userDocs[fileName] = {
    displayName: analysis.suggestedName || Utils.getBaseName(fileName),
    keywords: analysis.keywords,
    category: analysis.category,
    detectedNorms: analysis.detectedNorms,
    addedDate: new Date().toISOString()
  };
  Storage.saveUserDocs(userDocs);
}

async function openUserDocument(fileName, filePath) {
  if (!App.isElectron) return;
  
  const path = filePath || `${App.userDocsPath}/${fileName}`;
  await window.electronAPI.openFile(path);
}

async function renameDocument(fileName) {
  const userDocs = Storage.getUserDocs();
  const current = userDocs[fileName]?.displayName || Utils.getBaseName(fileName);
  
  // Simple Prompt für jetzt (könnte Modal sein)
  const newName = prompt('Neuer Anzeigename:', current);
  
  if (newName && newName !== current) {
    userDocs[fileName] = userDocs[fileName] || {};
    userDocs[fileName].displayName = newName;
    Storage.saveUserDocs(userDocs);
    await refreshUserDocuments();
    UI.showToast('Dokument umbenannt', 'success');
  }
}

async function deleteDocument(fileName, filePath) {
  if (!confirm(`"${fileName}" wirklich löschen?`)) return;
  
  try {
    if (App.isElectron) {
      await window.electronAPI.deleteFile(filePath || `${App.userDocsPath}/${fileName}`);
    }
    
    // Metadaten entfernen
    const userDocs = Storage.getUserDocs();
    delete userDocs[fileName];
    Storage.saveUserDocs(userDocs);
    
    await refreshUserDocuments();
    UI.showToast('Dokument gelöscht', 'success');
    
  } catch (error) {
    UI.showToast('Dokument konnte nicht gelöscht werden', 'error');
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PRINTING
// ═══════════════════════════════════════════════════════════════════════════════

function printCurrentPage() {
  if (App.isElectron) {
    window.electronAPI.print();
  } else {
    window.print();
  }
}

function printItem(itemId) {
  const item = App.wissensbasis.find(i => i.id === itemId);
  if (!item) return;
  
  // Druckfenster mit Inhalt
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${item.title}</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.6; padding: 20mm; }
        h1 { font-size: 18pt; margin-bottom: 10mm; }
        .norm { color: #666; margin-bottom: 5mm; }
        .content { margin: 10mm 0; }
        .keywords { margin-top: 10mm; padding-top: 5mm; border-top: 1px solid #ccc; }
        .tag { display: inline-block; background: #e0e0e0; padding: 2px 8px; margin: 2px; border-radius: 3px; }
        @media print { body { padding: 0; } }
      </style>
    </head>
    <body>
      <h1>${item.title}</h1>
      ${item.norm ? `<div class="norm">Norm: ${item.norm}</div>` : ''}
      <div class="content">${item.content || item.description || ''}</div>
      ${item.keywords?.length ? `
        <div class="keywords">
          <strong>Schlagworte:</strong>
          ${item.keywords.map(k => `<span class="tag">${k}</span>`).join('')}
        </div>
      ` : ''}
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}

// ═══════════════════════════════════════════════════════════════════════════════
// BACKUP & EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

async function createBackup() {
  const data = {
    version: CONFIG.appVersion,
    date: new Date().toISOString(),
    favorites: Storage.getFavorites(),
    history: Storage.getHistory(),
    settings: Storage.getSettings(),
    userDocs: Storage.getUserDocs()
  };
  
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  
  if (App.isElectron) {
    const filePath = await window.electronAPI.saveDialog({
      title: 'Backup speichern',
      defaultPath: `VG-Normen-Backup_${Utils.dateForFileName()}.json`,
      filters: [{ name: 'JSON', extensions: ['json'] }]
    });
    
    if (filePath) {
      await window.electronAPI.writeFile(filePath, json);
      Storage.setLastBackup(Date.now());
      UI.updateSettingsUI();
      UI.showToast('Backup erstellt', 'success');
    }
  } else {
    // Browser Download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VG-Normen-Backup_${Utils.dateForFileName()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    Storage.setLastBackup(Date.now());
    UI.updateSettingsUI();
    UI.showToast('Backup heruntergeladen', 'success');
  }
}

async function restoreBackup() {
  let data;
  
  if (App.isElectron) {
    const filePath = await window.electronAPI.openFileDialog({
      title: 'Backup auswählen',
      filters: [{ name: 'JSON', extensions: ['json'] }]
    });
    
    if (!filePath || filePath.length === 0) return;
    
    const content = await window.electronAPI.readFile(filePath[0]);
    data = JSON.parse(content);
  } else {
    // Browser File Input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    const file = await new Promise(resolve => {
      input.onchange = () => resolve(input.files[0]);
      input.click();
    });
    
    if (!file) return;
    
    const text = await file.text();
    data = JSON.parse(text);
  }
  
  // Daten wiederherstellen
  if (data.favorites) Storage.set('favorites', data.favorites);
  if (data.history) Storage.set('history', data.history);
  if (data.settings) Storage.saveSettings(data.settings);
  if (data.userDocs) Storage.saveUserDocs(data.userDocs);
  
  // UI aktualisieren
  applySettings();
  UI.renderFavorites();
  UI.renderHistory();
  
  UI.showToast('Backup wiederhergestellt', 'success');
}

// ═══════════════════════════════════════════════════════════════════════════════
// FORMULAR FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function openFormulare() {
  UI.showPage('formulare');
  App.currentPage = 'formulare';
  
  UI.updateBreadcrumbs([
    { title: 'Formulare & Checklisten' }
  ]);
}

function openFormular(formId) {
  // Formular in neuem Tab/Fenster öffnen
  window.open(`formulare/${formId}.html`, '_blank');
}

// ═══════════════════════════════════════════════════════════════════════════════
// SETTINGS MODAL
// ═══════════════════════════════════════════════════════════════════════════════

function openSettings() {
  UI.updateSettingsUI();
  UI.showModal('modalSettings');
}

function closeSettings() {
  UI.closeModal('modalSettings');
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELP MODAL
// ═══════════════════════════════════════════════════════════════════════════════

function openHelp() {
  UI.showModal('modalHelp');
}

function closeHelp() {
  UI.closeModal('modalHelp');
}

// ═══════════════════════════════════════════════════════════════════════════════
// GLOBAL FUNCTION ALIASES (für onclick in HTML)
// ═══════════════════════════════════════════════════════════════════════════════

// Settings
function showSettings() {
  openSettings();
}

function setFontSize(size) {
  changeFontSize(size);
}

function setHighContrast(enabled) {
  const settings = Storage.getSettings();
  settings.highContrast = enabled;
  Storage.saveSettings(settings);
  applySettings();
  UI.showToast(enabled ? 'Hoher Kontrast aktiviert' : 'Normaler Kontrast', 'success');
}

// Help
function showHelp() {
  openHelp();
}

// Print
function printPage() {
  printCurrentPage();
}

// Search
function performSearch() {
  handleSearch();
}

function handleSearchKeyup(event) {
  if (event.key === 'Enter') {
    handleSearch();
  }
}

// Modal
function closeModal(modalId) {
  UI.closeModal(modalId);
}

// Documents
function addDocuments() {
  if (App.isElectron) {
    window.electronAPI.openFileDialog().then(files => {
      if (files && files.length > 0) {
        UI.showToast(`${files.length} Dokument(e) ausgewählt`, 'success');
        // Hier würde die Dokumentverarbeitung stattfinden
      }
    });
  } else {
    UI.showToast('Diese Funktion ist nur in der Desktop-App verfügbar', 'warning');
  }
}

function openDocumentsFolder() {
  if (App.isElectron) {
    window.electronAPI.openUserDocsFolder();
    UI.showToast('Dokumentenordner wird geöffnet...', 'info');
  } else {
    UI.showToast('Diese Funktion ist nur in der Desktop-App verfügbar', 'warning');
  }
}

function scanDocuments() {
  UI.showToast('Dokumente werden gescannt...', 'info');
  // Simulation für Demo
  setTimeout(() => {
    UI.showToast('Scan abgeschlossen: 0 neue Dokumente gefunden', 'success');
  }, 2000);
}

// Backup
function createBackup() {
  const data = Storage.exportAllData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vg-normen-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  UI.showToast('Backup erstellt und heruntergeladen', 'success');
}

function loadBackup() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          Storage.importAllData(data);
          UI.showToast('Backup erfolgreich geladen', 'success');
          location.reload();
        } catch (err) {
          UI.showToast('Fehler beim Laden des Backups', 'error');
        }
      };
      reader.readAsText(file);
    }
  };
  input.click();
}

// Clear Data
function clearHistory() {
  Storage.clearHistory();
  UI.renderHistory();
  UI.showToast('Verlauf gelöscht', 'success');
}

function clearAllData() {
  if (confirm('Möchten Sie wirklich alle Daten löschen? Dies kann nicht rückgängig gemacht werden.')) {
    Storage.clearAll();
    UI.showToast('Alle Daten gelöscht', 'success');
    location.reload();
  }
}

// Rename (für Modal)
function confirmRename() {
  const input = document.getElementById('renameInput');
  if (input && input.value.trim()) {
    UI.showToast(`Umbenannt zu: ${input.value.trim()}`, 'success');
    UI.closeModal('modalRename');
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE RENDERING FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function renderWissensbasisPage(filterCategory) {
  const container = document.getElementById('wissensbasisContent');
  if (!container) return;
  
  let cards = App.wissensbasis || [];
  
  // Filter by category if specified
  if (filterCategory) {
    cards = cards.filter(c => c.category === filterCategory);
  }
  
  if (cards.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <span class="icon">📚</span>
        <p>Keine Wissenskarten gefunden.</p>
      </div>
    `;
    return;
  }
  
  // Group by category
  const grouped = {};
  cards.forEach(card => {
    const cat = card.category || 'sonstiges';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(card);
  });
  
  let html = '';
  
  Object.keys(grouped).forEach(catKey => {
    const catInfo = CONFIG.categories[catKey] || { title: catKey, icon: '📄' };
    const catCards = grouped[catKey];
    
    html += `
      <div class="category-section">
        <h3 class="category-title">${catInfo.icon} ${catInfo.title}</h3>
        <div class="cards-grid">
    `;
    
    catCards.forEach(card => {
      const isFav = Storage.isFavorite(card.id);
      html += `
        <div class="card" onclick="openItem('${card.id}')">
          <div class="card-header">
            <span class="card-icon">${card.icon || '📄'}</span>
            <span class="card-title">${card.title}</span>
            ${isFav ? '<span class="fav-star">⭐</span>' : ''}
          </div>
          ${card.description ? `<p class="card-desc">${card.description}</p>` : ''}
          ${card.keywords ? `
            <div class="card-tags">
              ${card.keywords.slice(0, 3).map(k => `<span class="tag">${k}</span>`).join('')}
            </div>
          ` : ''}
        </div>
      `;
    });
    
    html += '</div></div>';
  });
  
  container.innerHTML = html;
}

function renderFormularePage() {
  const container = document.getElementById('formulareContent');
  if (!container) return;
  
  // Pobierz formularze z wissensbasis (generowane z TEIL10)
  const formularKarten = App.wissensbasis.filter(k => k.category === 'formulare' && k.type === 'formular');
  
  // Jeśli nie ma kart, użyj danych z teilDaten
  if (formularKarten.length === 0 && App.teilDaten?.teil10?.formularverzeichnis) {
    const verzeichnis = App.teilDaten.teil10.formularverzeichnis.uebersicht;
    
    let html = '<h2>📋 Formulare und Checklisten</h2>';
    html += '<p>Alle Formulare gemäß VG-Normen und IPC/WHMA-A-620 Dokumentationsanforderungen</p>';
    html += '<div class="cards-grid">';
    
    verzeichnis.forEach(form => {
      const icon = getFormularIcon(form.nr);
      html += `
        <div class="card formular-card" onclick="openFormularDetail('${form.nr}')">
          <div class="card-header">
            <span class="card-icon">${icon}</span>
            <span class="card-title">${form.nr}: ${form.formular}</span>
          </div>
          <p class="card-desc">${form.anwendung}</p>
          <span class="card-category">Kapitel ${form.kapitel}</span>
        </div>
      `;
    });
    
    html += '</div>';
    container.innerHTML = html;
    return;
  }
  
  // Renderuj karty formularzy z wissensbasis
  let html = '<h2>📋 Formulare und Checklisten</h2>';
  html += '<p>Alle Formulare gemäß VG-Normen und IPC/WHMA-A-620 Dokumentationsanforderungen</p>';
  
  // Grupuj po kategoriach
  const kategorien = {
    wareneingang: { titel: '📦 Wareneingangsprüfung', karten: [] },
    fertigung: { titel: '🔧 Fertigung', karten: [] },
    pruefung: { titel: '✅ Prüfung', karten: [] },
    qualitaet: { titel: '📊 Qualitätsmanagement', karten: [] }
  };
  
  formularKarten.forEach(karte => {
    const kategorie = karte.keywords?.find(k => ['wareneingang', 'fertigung', 'prüfung', 'qualität'].includes(k)) || 'sonstiges';
    if (kategorien[kategorie]) {
      kategorien[kategorie].karten.push(karte);
    } else if (kategorien.qualitaet) {
      kategorien.qualitaet.karten.push(karte);
    }
  });
  
  Object.entries(kategorien).forEach(([key, kat]) => {
    if (kat.karten.length > 0) {
      html += `<h3>${kat.titel}</h3><div class="cards-grid">`;
      kat.karten.forEach(karte => {
        html += `
          <div class="card formular-card" onclick="openItem('${karte.id}')">
            <div class="card-header">
              <span class="card-icon">${karte.icon}</span>
              <span class="card-title">${karte.title}</span>
            </div>
            <p class="card-desc">${karte.description}</p>
          </div>
        `;
      });
      html += '</div>';
    }
  });
  
  container.innerHTML = html;
}

function getFormularIcon(formNr) {
  const icons = {
    'F-01': '📦', 'F-02': '🔌', 'F-03': '⚡', 'F-04': '🔥', 'F-05': '🛡️',
    'F-06': '📋', 'F-07': '🔧', 'F-08': '⚡', 'F-09': '✅', 'F-10': '📊',
    'F-11': '❌', 'F-12': '⚠️', 'F-13': '📏', 'F-14': '👷', 'F-15': '🏭'
  };
  return icons[formNr] || '📄';
}

function openFormularDetail(formNr) {
  // Znajdź formularz w teilDaten
  if (App.teilDaten?.teil10?.formulare) {
    const formDaten = App.teilDaten.teil10.formulare[formNr];
    if (formDaten) {
      // Stwórz tymczasowy item do wyświetlenia
      const item = {
        id: `formular-${formNr.toLowerCase()}`,
        title: `${formNr}: ${formDaten.titel}`,
        icon: getFormularIcon(formNr),
        norm: 'VG / IPC',
        description: formDaten.beschreibung || formDaten.titel,
        formularDaten: formDaten,
        keywords: [formNr.toLowerCase(), 'formular']
      };
      
      renderDetailPage(item);
      UI.showPage('detail');
      UI.updateBreadcrumbs([
        { title: '📋 Formulare', action: () => navigateTo('formulare') },
        { title: `${formNr}: ${formDaten.titel}` }
      ]);
      return;
    }
  }
  
  // Fallback
  UI.showToast(`Formular ${formNr} wird geladen...`, 'info');
}
function renderTabellenPage() {
  const container = document.getElementById('tabellenContent');
  if (!container) return;
  
  // Pobierz wszystkie karty typu tabelle
  const tabellenKarten = App.wissensbasis.filter(k => k.type === 'tabelle');
  
  let html = '<h2>📊 Technische Tabellen</h2>';
  html += '<p>Alle wichtigen Referenztabellen aus den VG-Normen</p>';
  
  if (tabellenKarten.length === 0) {
    // Fallback - pokaż predefiniowane tabele
    const tabellen = [
      { id: 'teil2-awg-tabelle', title: 'AWG zu mm² Umrechnung', icon: '📊', cat: 'Kabel', desc: 'Querschnitte und Widerstände' },
      { id: 'teil4-baugroessen', title: 'Steckverbinder Baugrößen', icon: '📐', cat: 'Stecker', desc: 'Shell Sizes 09-25' },
      { id: 'teil4-kontaktgroessen', title: 'Kontaktgrößen', icon: '⚡', cat: 'Stecker', desc: 'Strombelastbarkeit 22D bis 0' },
      { id: 'teil4-anzugsmomente', title: 'Anzugsmomente', icon: '🔧', cat: 'Stecker', desc: 'Drehmomente in Nm' },
      { id: 'teil5-groessen', title: 'Abschirmgeflecht Größen', icon: '🛡️', cat: 'Schirmung', desc: 'VG06 Durchmesser' },
      { id: 'teil7-zugkraefte', title: 'Mindestzugkräfte IPC', icon: '💪', cat: 'Prüfung', desc: 'Pull-Test Werte' },
      { id: 'teil9-tabelle1', title: 'AQL Tabelle 1', icon: '📊', cat: 'Prüfung', desc: 'Stichprobenumfang' },
      { id: 'teil9-tabelle2a', title: 'AQL Tabelle 2-A', icon: '📊', cat: 'Prüfung', desc: 'Ac/Re Werte' }
    ];
    
    html += '<div class="cards-grid">';
    tabellen.forEach(tab => {
      html += `
        <div class="card tabelle-card" onclick="openItem('${tab.id}')">
          <div class="card-header">
            <span class="card-icon">${tab.icon}</span>
            <span class="card-title">${tab.title}</span>
          </div>
          <span class="card-category">${tab.cat}</span>
          <p class="card-desc">${tab.desc}</p>
        </div>
      `;
    });
    html += '</div>';
  } else {
    // Grupuj po kategorii
    const grouped = {};
    tabellenKarten.forEach(k => {
      const cat = k.category || 'sonstiges';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(k);
    });
    
    Object.entries(grouped).forEach(([catKey, karten]) => {
      const catInfo = CONFIG.categories[catKey] || { title: catKey, icon: '📊' };
      html += `<h3>${catInfo.icon} ${catInfo.title}</h3><div class="cards-grid">`;
      karten.forEach(k => {
        html += `
          <div class="card tabelle-card" onclick="openItem('${k.id}')">
            <div class="card-header">
              <span class="card-icon">${k.icon}</span>
              <span class="card-title">${k.title}</span>
            </div>
            <p class="card-desc">${k.description}</p>
          </div>
        `;
      });
      html += '</div>';
    });
  }
  
  container.innerHTML = html;
}

function renderBilderPage() {
  const container = document.getElementById('bilderContent');
  if (!container) return;
  
  const bilder = [
    { id: 'bild-crimp-gut', title: 'Crimp GUT', icon: '✅', desc: 'Korrekte Crimpverbindung', status: 'gut' },
    { id: 'bild-crimp-schlecht-1', title: 'Crimp SCHLECHT - Übercrimpung', icon: '❌', desc: 'Zu stark verpresst', status: 'schlecht' },
    { id: 'bild-crimp-schlecht-2', title: 'Crimp SCHLECHT - Untercrimpung', icon: '❌', desc: 'Zu wenig verpresst', status: 'schlecht' },
    { id: 'bild-isolation-gut', title: 'Isolationscrimp GUT', icon: '✅', desc: 'Korrekte Isolation', status: 'gut' },
    { id: 'bild-isolation-schlecht', title: 'Isolationscrimp SCHLECHT', icon: '❌', desc: 'Beschädigte Isolation', status: 'schlecht' },
    { id: 'bild-litzenenden-gut', title: 'Litzenenden GUT', icon: '✅', desc: 'Korrekt abgelängt', status: 'gut' },
    { id: 'bild-litzenenden-schlecht', title: 'Litzenenden SCHLECHT', icon: '❌', desc: 'Vorstehende Litzen', status: 'schlecht' },
    { id: 'bild-kontakt-sitz', title: 'Kontaktsitz im Stecker', icon: '🔍', desc: 'Rastung und Position', status: 'info' }
  ];
  
  let html = '<div class="images-grid">';
  
  bilder.forEach(bild => {
    const statusClass = bild.status === 'gut' ? 'status-good' : bild.status === 'schlecht' ? 'status-bad' : 'status-info';
    html += `
      <div class="image-card ${statusClass}" onclick="openBild('${bild.id}')">
        <div class="image-placeholder">
          <span class="icon">${bild.icon}</span>
        </div>
        <div class="image-info">
          <span class="image-title">${bild.title}</span>
          <span class="image-desc">${bild.desc}</span>
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  container.innerHTML = html;
}

function renderMeineDokumentePage() {
  const container = document.getElementById('userDocumentsContent');
  if (!container) return;
  
  const userDocs = Storage.getUserDocs();
  const docKeys = Object.keys(userDocs);
  
  if (docKeys.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <span class="icon">📁</span>
        <p>Noch keine Dokumente.</p>
        <p>Klicken Sie auf <strong>"DATEIEN HINZUFÜGEN"</strong> oder kopieren Sie Dateien in den Dokumenten-Ordner.</p>
      </div>
    `;
    return;
  }
  
  let html = '<div class="documents-grid">';
  
  docKeys.forEach(fileName => {
    const doc = userDocs[fileName];
    const icon = getDocIcon(fileName);
    html += `
      <div class="document-card" onclick="openUserDoc('${fileName}')">
        <span class="doc-icon">${icon}</span>
        <span class="doc-name">${doc.displayName || fileName}</span>
        <span class="doc-date">${Utils.formatDate(doc.updatedAt)}</span>
      </div>
    `;
  });
  
  html += '</div>';
  container.innerHTML = html;
}

/**
 * Rendert die Import-Seite für Dokumente
 */
function renderImportPage() {
  const container = document.getElementById('importPageContent');
  if (!container) return;
  
  // DocumentImporter-Inhalt rendern
  if (typeof documentImporter !== 'undefined') {
    container.innerHTML = documentImporter.renderImportPage();
    
    // Event-Listener initialisieren
    setTimeout(() => {
      documentImporter.initializeEventListeners();
    }, 100);
  } else {
    container.innerHTML = `
      <div class="empty-state">
        <span class="icon">⚠️</span>
        <p>Import-Modul nicht verfügbar.</p>
      </div>
    `;
  }
}

/**
 * Callback für renderPage (verwendet von documentImporter)
 */
function renderPage(pageName) {
  navigateTo(pageName);
}

function getDocIcon(fileName) {
  const ext = fileName.split('.').pop().toLowerCase();
  const icons = {
    'pdf': '📕',
    'doc': '📘',
    'docx': '📘',
    'xls': '📗',
    'xlsx': '📗',
    'jpg': '🖼️',
    'jpeg': '🖼️',
    'png': '🖼️',
    'gif': '🖼️'
  };
  return icons[ext] || '📄';
}

// Helper functions for opening items
function openTabelle(id) {
  UI.showToast(`Tabelle "${id}" wird geladen...`, 'info');
  // TODO: Implement table view
}

function openBild(id) {
  UI.showToast(`Bild "${id}" wird geladen...`, 'info');
  // TODO: Implement image view
}

function openUserDoc(fileName) {
  UI.showToast(`Dokument "${fileName}" wird geöffnet...`, 'info');
  if (App.isElectron) {
    window.electronAPI.openUserDoc(fileName);
  }
}

function printFormular(id) {
  window.open(`formulare/${id}.html`, '_blank');
}
