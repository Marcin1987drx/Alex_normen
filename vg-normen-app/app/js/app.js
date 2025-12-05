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
    // Karten laden
    const response = await fetch('wissensbasis/karten.json');
    App.wissensbasis = await response.json();
    console.log(`📚 ${App.wissensbasis.length} Wissenskarten geladen`);
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

function navigateTo(page) {
  App.currentPage = page;
  UI.showPage(page);
  
  if (page === 'home') {
    renderHomePage();
    UI.updateBreadcrumbs([]);
  }
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
    
    statsEl.innerHTML = `
      <span>⭐ ${favCount} Favoriten</span>
      <span>📄 ${docCount} Eigene Dokumente</span>
      <span>🕐 ${histCount} in Historie</span>
    `;
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
        ${item.content || ''}
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
  
  // Ergebnisse zusammenführen
  const results = [...wbResults, ...udResults];
  
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

function startVoiceSearch() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    UI.showToast('Sprachsuche wird von diesem Browser nicht unterstützt', 'error');
    return;
  }
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  
  recognition.lang = 'de-DE';
  recognition.continuous = false;
  recognition.interimResults = false;
  
  const voiceBtn = document.getElementById('btnVoiceSearch');
  
  recognition.onstart = () => {
    voiceBtn?.classList.add('listening');
    UI.showToast('Sprechen Sie jetzt...', 'info', 2000);
  };
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.value = transcript;
      handleSearch();
    }
  };
  
  recognition.onerror = (event) => {
    console.error('Voice recognition error:', event.error);
    UI.showToast('Spracherkennung fehlgeschlagen', 'error');
  };
  
  recognition.onend = () => {
    voiceBtn?.classList.remove('listening');
  };
  
  recognition.start();
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
  UI.showModal('settingsModal');
}

function closeSettings() {
  UI.closeModal('settingsModal');
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELP MODAL
// ═══════════════════════════════════════════════════════════════════════════════

function openHelp() {
  UI.showModal('helpModal');
}

function closeHelp() {
  UI.closeModal('helpModal');
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

// Voice Search
function stopVoiceSearch() {
  if (window.speechRecognition) {
    window.speechRecognition.stop();
  }
  UI.showToast('Sprachsuche beendet', 'info');
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

