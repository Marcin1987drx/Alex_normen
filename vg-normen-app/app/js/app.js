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
    // PRIORYTET 1: Ładuj z plików Markdown (PEŁNA treść!)
    if (window.MarkdownLoader) {
      console.log('📖 Ładowanie pełnych plików Markdown...');
      App.wissensbasis = await MarkdownLoader.ladeDaten();
      App.mdSektionen = MarkdownLoader.sektionen;
      App.mdTeilInhalte = MarkdownLoader.teilInhalte;
      console.log(`📚 ${App.wissensbasis.length} Sektionen z Markdown geladen`);
      console.log(`📊 Pełne TEILs: ${Object.keys(App.mdTeilInhalte).length}`);
      
      // Uzupełnij też starą strukturę wissensbasis (kompatybilność)
      if (window.WissensbasisLoader) {
        await WissensbasisLoader.ladeDaten();
        App.teilDaten = WissensbasisLoader.teilDaten;
      }
    }
    // PRIORYTET 2: Ładuj z JSON TEIL
    else if (window.WissensbasisLoader) {
      App.wissensbasis = await WissensbasisLoader.ladeDaten();
      App.teilDaten = WissensbasisLoader.teilDaten;
      console.log(`📚 ${App.wissensbasis.length} Wissenskarten aus TEIL-Dateien geladen`);
    } 
    // PRIORYTET 3: Fallback do starego karten.json
    else {
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
  
  // Status połączenia
  updateConnectionStatus();
  window.addEventListener('online', updateConnectionStatus);
  window.addEventListener('offline', updateConnectionStatus);
}

// Aktualizuj wskaźnik połączenia
function updateConnectionStatus() {
  const statusEl = document.getElementById('connectionStatus');
  if (!statusEl) return;
  
  const dot = statusEl.querySelector('.status-dot');
  const text = statusEl.querySelector('.status-text');
  
  if (navigator.onLine) {
    statusEl.classList.remove('offline');
    statusEl.classList.add('online');
    if (dot) dot.style.background = '#4CAF50'; // zielony
    if (text) text.textContent = 'Online';
  } else {
    statusEl.classList.remove('online');
    statusEl.classList.add('offline');
    if (dot) dot.style.background = '#FF9800'; // pomarańczowy
    if (text) text.textContent = 'Offline OK';
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
      
    case 'teil':
      // Teil-Nummer jest przekazywana jako subCategory
      renderTeilPage(subCategory);
      break;
  }
  
  UI.showPage(page);
}

function goBack() {
  if (App.currentPage !== 'home') {
    navigateTo('home');
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ENCYCLOPEDIA - Widok pełnego TEILa
// ═══════════════════════════════════════════════════════════════════════════════

function renderEncyclopediaGrid() {
  const container = document.getElementById('encyclopediaGrid');
  if (!container || !window.MarkdownLoader) return;
  
  const teile = MarkdownLoader.teilDateien;
  
  let html = '';
  
  teile.forEach(teil => {
    const teilData = MarkdownLoader.teilInhalte[`teil${teil.teil}`];
    const sektionenCount = teilData?.sektionen?.length || 0;
    const charCount = teilData?.markdown?.length || 0;
    
    html += `
      <div class="teil-card" data-category="${teil.category}" onclick="openTeil(${teil.teil})">
        <span class="teil-number">TEIL ${teil.teil}</span>
        <span class="teil-icon">${teil.icon}</span>
        <span class="teil-title">${teil.title}</span>
        <span class="teil-norm">${teil.norm}</span>
        <div class="teil-stats">
          <span>📄 ${sektionenCount} Abschnitte</span>
          <span>📝 ${Math.round(charCount/1000)}k Zeichen</span>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

function openTeil(teilNummer) {
  navigateTo('teil', teilNummer);
}

function renderTeilPage(teilNummer) {
  if (!window.MarkdownLoader) {
    console.error('MarkdownLoader nicht verfügbar');
    return;
  }
  
  const teilKey = `teil${teilNummer}`;
  const teilData = MarkdownLoader.teilInhalte[teilKey];
  
  if (!teilData) {
    console.error(`TEIL ${teilNummer} nicht gefunden`);
    return;
  }
  
  // Breadcrumbs
  UI.updateBreadcrumbs([
    { title: `📖 TEIL ${teilNummer}: ${teilData.title}` }
  ]);
  
  // Header
  const headerEl = document.getElementById('teilHeader');
  headerEl.innerHTML = `
    <h1>${teilData.icon} TEIL ${teilNummer}: ${teilData.title}</h1>
    <div class="teil-meta">
      <span>📋 Norm: <strong>${teilData.norm}</strong></span>
      <span>📂 Kategorie: ${CONFIG.categories[teilData.category]?.title || teilData.category}</span>
      <span>📝 ${Math.round(teilData.markdown?.length/1000 || 0)}k Zeichen</span>
    </div>
    <div style="margin-top: var(--spacing-md);">
      <button class="btn-secondary" onclick="printTeil(${teilNummer})" style="background: rgba(255,255,255,0.2); border-color: white; color: white;">
        🖨️ Diesen TEIL drucken
      </button>
    </div>
  `;
  
  // Spis treści (TOC)
  const tocEl = document.getElementById('teilToc');
  let tocHtml = '';
  
  if (teilData.sektionen?.length) {
    teilData.sektionen.forEach((sektion, index) => {
      const level = sektion.level || 2;
      const levelClass = `level-${level - 1}`;
      tocHtml += `
        <a href="#sektion-${index}" class="${levelClass}" onclick="scrollToSektion(${index}); return false;">
          ${sektion.nummer || ''} ${sektion.title || sektion.fullTitle}
        </a>
      `;
    });
  }
  
  tocEl.innerHTML = tocHtml;
  
  // Treść główna
  const contentEl = document.getElementById('teilContent');
  
  // Użyj pełnego HTML z Markdown
  let contentHtml = teilData.html || '';
  
  // Dodaj ID do sekcji dla nawigacji
  if (teilData.sektionen?.length) {
    teilData.sektionen.forEach((sektion, index) => {
      if (sektion.html) {
        contentHtml = contentHtml.replace(
          sektion.html.substring(0, 100),
          `<div id="sektion-${index}" class="teil-sektion">${sektion.html.substring(0, 100)}`
        );
      }
    });
  }
  
  contentEl.innerHTML = contentHtml;
  
  // Scroll tracking dla TOC
  setupTocScrollTracking();
}

function scrollToSektion(index) {
  const element = document.getElementById(`sektion-${index}`);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  
  // Zaznacz aktywny link w TOC
  document.querySelectorAll('.teil-toc a').forEach((a, i) => {
    a.classList.toggle('active', i === index);
  });
}

function setupTocScrollTracking() {
  const container = document.getElementById('teilMain');
  if (!container) return;
  
  container.addEventListener('scroll', () => {
    const sektionen = container.querySelectorAll('[id^="sektion-"]');
    let activeIndex = 0;
    
    sektionen.forEach((sektion, index) => {
      const rect = sektion.getBoundingClientRect();
      if (rect.top <= 200) {
        activeIndex = index;
      }
    });
    
    document.querySelectorAll('.teil-toc a').forEach((a, i) => {
      a.classList.toggle('active', i === activeIndex);
    });
  });
}

function printTeil(teilNummer) {
  const teilKey = `teil${teilNummer}`;
  const teilData = MarkdownLoader.teilInhalte[teilKey];
  if (!teilData) return;
  
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>TEIL ${teilNummer}: ${teilData.title}</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.6; padding: 20mm; max-width: 210mm; margin: 0 auto; }
        h1 { color: #1565C0; border-bottom: 2px solid #1565C0; padding-bottom: 8px; }
        h2 { color: #1565C0; margin-top: 24px; }
        h3 { color: #333; margin-top: 16px; }
        table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 10pt; }
        th { background: #1565C0; color: white; padding: 8px; text-align: left; }
        td { border: 1px solid #ddd; padding: 6px 8px; }
        tr:nth-child(even) { background: #f9f9f9; }
        ul, ol { margin-left: 20px; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #1565C0; padding-bottom: 8px; margin-bottom: 24px; }
        @media print { body { padding: 15mm; } @page { margin: 15mm; } }
      </style>
    </head>
    <body>
      <div class="header">
        <strong>📚 VG-Normen Produktionshandbuch</strong>
        <span>Gedruckt: ${new Date().toLocaleDateString('de-DE')}</span>
      </div>
      <h1>${teilData.icon} TEIL ${teilNummer}: ${teilData.title}</h1>
      <p><strong>Norm:</strong> ${teilData.norm}</p>
      ${teilData.html}
    </body>
    </html>
  `);
  printWindow.document.close();
  setTimeout(() => printWindow.print(), 300);
}

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORY & ITEM FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

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
  // PRIORYTET 0: Sprawdź czy to zaimportowany dokument
  if (itemId?.startsWith('imported_') || type === 'imported') {
    const importedDoc = SearchEngine.getImportedDocById(itemId);
    if (importedDoc) {
      console.log(`📄 Otwieranie zaimportowanego dokumentu: ${importedDoc.title}`);
      openImportedDocument(importedDoc);
      return;
    }
  }
  
  // PRIORYTET 1: Szukaj w MarkdownLoader (pełne dane)
  let item = null;
  
  if (window.MarkdownLoader && MarkdownLoader.sektionen?.length) {
    item = MarkdownLoader.sektionen.find(s => s.id === itemId);
    if (item) {
      console.log(`📖 Znaleziono w Markdown: ${item.title}`);
    }
  }
  
  // PRIORYTET 2: Szukaj w wissensbasis (kompatybilność)
  if (!item) {
    item = App.wissensbasis.find(i => i.id === itemId);
  }
  
  if (!item) {
    console.warn(`⚠️ Nie znaleziono: ${itemId}`);
    return;
  }
  
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

/**
 * Otwiera zaimportowany dokument w widoku encyklopedycznym
 */
function openImportedDocument(doc) {
  // Konwertuj zaimportowany dokument na format encyklopedii
  const item = {
    id: `imported_${doc.id}`,
    title: doc.title,
    icon: doc.formatIcon || '📄',
    description: `Importiert am ${new Date(doc.importDate).toLocaleDateString('de-DE')} | ${doc.formatName || 'Dokument'}`,
    keywords: doc.tags || [],
    category: doc.category,
    norm: null, // Zaimportowane dokumenty nie mają normy
    teil: null,
    content: doc.content,
    html: formatImportedDocContent(doc),
    type: 'imported',
    source: 'meine_dokumente',
    originalDoc: doc
  };
  
  // Historie aktualisieren
  Storage.addToHistory({
    id: item.id,
    title: item.title,
    type: 'imported',
    icon: item.icon
  });
  
  // Detail-Seite rendern
  renderDetailPage(item);
  
  // Breadcrumbs
  const categoryInfo = documentImporter?.categories?.find(c => c.id === doc.category);
  UI.updateBreadcrumbs([
    { title: 'Meine Dokumente', action: () => navigateTo('meine-dokumente') },
    { title: categoryInfo?.name || 'Dokument', action: () => {} },
    { title: doc.title }
  ]);
  
  UI.showPage('detail');
  UI.renderHistory();
}

/**
 * Formatuje treść zaimportowanego dokumentu jako HTML
 */
function formatImportedDocContent(doc) {
  let html = '';
  
  // Nagłówek z informacjami o pliku
  html += `
    <div class="imported-doc-header">
      <div class="doc-info-grid">
        <div class="info-item">
          <span class="info-label">📁 Originaldatei:</span>
          <span class="info-value">${doc.filename}</span>
        </div>
        <div class="info-item">
          <span class="info-label">📊 Format:</span>
          <span class="info-value">${doc.formatIcon} ${doc.formatName}</span>
        </div>
        <div class="info-item">
          <span class="info-label">📅 Importiert:</span>
          <span class="info-value">${new Date(doc.importDate).toLocaleDateString('de-DE', { 
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
          })}</span>
        </div>
        ${doc.fileSize ? `
        <div class="info-item">
          <span class="info-label">💾 Größe:</span>
          <span class="info-value">${formatFileSize(doc.fileSize)}</span>
        </div>
        ` : ''}
      </div>
      ${doc.hasOriginalFile ? `
        <div class="doc-actions-bar">
          <button class="btn btn-secondary" onclick="downloadImportedFile(${doc.id})">
            ⬇️ Original herunterladen
          </button>
        </div>
      ` : ''}
    </div>
  `;
  
  // Główna treść dokumentu
  if (doc.content) {
    // Sprawdź czy to markdown
    if (doc.fileType === 'text/markdown' || doc.filename?.endsWith('.md')) {
      html += `<div class="doc-content markdown-content">${marked ? marked.parse(doc.content) : escapeHtml(doc.content)}</div>`;
    } else {
      // Zwykły tekst - zachowaj formatowanie
      html += `<div class="doc-content plain-text"><pre>${escapeHtml(doc.content)}</pre></div>`;
    }
  } else {
    html += `<div class="doc-content empty-content">
      <p>⚠️ Kein extrahierter Text verfügbar.</p>
      ${doc.hasOriginalFile ? '<p>Sie können die Originaldatei herunterladen.</p>' : ''}
    </div>`;
  }
  
  return html;
}

/**
 * Escapuje HTML
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Formatuje rozmiar pliku
 */
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

/**
 * Pobiera oryginalny plik zaimportowanego dokumentu
 */
async function downloadImportedFile(docId) {
  if (typeof documentImporter !== 'undefined' && documentImporter.downloadOriginalFile) {
    await documentImporter.downloadOriginalFile(docId);
  } else {
    UI.showToast('Download nicht verfügbar', 'error');
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// DOCUMENT INTELLIGENCE UI FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Otwiera widok analizy zaimportowanego dokumentu
 */
function openAnalyzedDocument(analysisId) {
  if (typeof documentIntelligence === 'undefined') {
    UI.showToast('Document Intelligence nicht verfügbar', 'error');
    return;
  }
  
  const analysis = documentIntelligence.analyzedDocuments.get(analysisId);
  if (!analysis) {
    UI.showToast('Analyse nicht gefunden', 'error');
    return;
  }
  
  // Renderuj widok analizy
  const container = document.getElementById('mainContent');
  container.innerHTML = documentIntelligence.renderAnalysisView(analysis);
  
  // Breadcrumbs
  UI.updateBreadcrumbs([
    { title: 'Meine Dokumente', action: () => navigateTo('meine-dokumente') },
    { title: 'Dokumentanalyse', action: () => {} },
    { title: analysis.filename }
  ]);
  
  UI.showPage('main');
}

/**
 * Otwiera analizę dla zaimportowanego dokumentu (jeśli istnieje)
 */
function viewDocumentAnalysis(docId) {
  if (typeof documentIntelligence === 'undefined') {
    UI.showToast('Document Intelligence nicht verfügbar', 'error');
    return;
  }
  
  // Szukaj analizy po ID dokumentu
  let analysis = null;
  documentIntelligence.analyzedDocuments.forEach((a, id) => {
    if (a.id === docId || a.id === `doc_${docId}`) {
      analysis = a;
    }
  });
  
  if (analysis) {
    openAnalyzedDocument(analysis.id);
  } else {
    UI.showToast('Keine Analyse für dieses Dokument vorhanden', 'warning');
  }
}

/**
 * Uruchamia analizę dla istniejącego dokumentu
 */
async function analyzeExistingDocument(docId) {
  if (typeof documentIntelligence === 'undefined' || typeof documentImporter === 'undefined') {
    UI.showToast('Analyse nicht verfügbar', 'error');
    return;
  }
  
  const doc = documentImporter.importedDocuments.find(d => d.id === docId);
  if (!doc) {
    UI.showToast('Dokument nicht gefunden', 'error');
    return;
  }
  
  UI.showToast('🧠 Analyse wird gestartet...', 'info');
  
  try {
    const analysis = await documentIntelligence.analyzeDocument(doc.content, {
      id: docId,
      filename: doc.filename,
      fileType: doc.fileType,
      fileSize: doc.fileSize
    });
    
    UI.showToast('✅ Analyse abgeschlossen!', 'success');
    
    // Otwórz widok analizy
    openAnalyzedDocument(analysis.id);
  } catch (error) {
    console.error('Analyse fehlgeschlagen:', error);
    UI.showToast('Analyse fehlgeschlagen', 'error');
  }
}

/**
 * Wyszukaj z tagu słowa kluczowego
 */
function performSearchFromTag(keyword) {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.value = keyword;
  }
  handleSearch(keyword);
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOME PAGE RENDERING
// ═══════════════════════════════════════════════════════════════════════════════

function renderHomePage() {
  // ENCYKLOPEDIA - Renderuj siatkę TEILów
  renderEncyclopediaGrid();
  
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
// DETAIL PAGE RENDERING (ULEPSZONA ENCYKLOPEDIA)
// ═══════════════════════════════════════════════════════════════════════════════

function renderDetailPage(item) {
  const container = document.getElementById('detailContent');
  if (!container) return;
  
  App.currentDetailItem = item; // Zapamiętaj dla drukowania
  
  const isFav = Storage.isFavorite(item.id);
  
  // PRIORYTET 1: Pełna zawartość HTML z MarkdownLoader (KAŻDA LITERKA!)
  let contentHtml = '';
  
  if (item.html) {
    contentHtml = item.html;
    console.log(`📖 Renderowanie pełnego HTML z Markdown (${item.html.length} znaków)`);
  } else if (item.content) {
    contentHtml = item.content;
  } else if (item.teilDaten) {
    contentHtml = renderTeilDatenContent(item);
  } else if (item.formularDaten) {
    contentHtml = renderFormularContent(item.formularDaten);
  }
  
  // Metadane
  const metaEl = document.getElementById('detailMeta');
  if (metaEl) {
    let metaHtml = '';
    if (item.norm) {
      metaHtml += `<span class="meta-badge norm">📋 ${item.norm}</span>`;
    }
    if (item.teil) {
      metaHtml += `<span class="meta-badge teil" onclick="openTeil(${item.teil})" style="cursor:pointer;">📚 TEIL ${item.teil}</span>`;
    }
    if (item.category && CONFIG.categories[item.category]) {
      metaHtml += `<span class="meta-badge">${CONFIG.categories[item.category].icon} ${CONFIG.categories[item.category].title}</span>`;
    }
    metaEl.innerHTML = metaHtml;
  }
  
  // Tytuł
  const titleEl = document.getElementById('detailTitle');
  if (titleEl) {
    titleEl.innerHTML = `${item.icon || '📄'} ${item.title}`;
  }
  
  // Główna treść
  container.innerHTML = contentHtml;
  
  // Słowa kluczowe
  const keywordsEl = document.getElementById('detailKeywords');
  if (keywordsEl && item.keywords?.length) {
    keywordsEl.innerHTML = `
      <h4>🔍 Schlagworte</h4>
      <div class="tags">
        ${item.keywords.map(k => `<span class="tag" onclick="performSearchFromTag('${k}')" style="cursor:pointer;">${k}</span>`).join('')}
      </div>
    `;
  } else if (keywordsEl) {
    keywordsEl.innerHTML = '';
  }
  
  // SIDEBAR: Powiązane tematy
  renderDetailSidebar(item);
  
  // Aktualizuj przycisk favoriten
  const favBtn = document.getElementById('btnFavorite');
  if (favBtn) {
    favBtn.innerHTML = `<span class="icon">${isFav ? '⭐' : '☆'}</span>`;
    favBtn.onclick = () => toggleFavorite(item.id);
  }
  
  // Scroll na górę
  container.scrollTop = 0;
}

function renderDetailSidebar(item) {
  const isImported = item.type === 'imported' || item.id?.startsWith('imported_');
  
  // 1. Powiązane tematy (verwandt)
  const relatedEl = document.getElementById('relatedList');
  if (relatedEl) {
    if (isImported) {
      // Dla zaimportowanych dokumentów - pokaż inne z tej samej kategorii
      const sameCategory = SearchEngine.getImportedDocsByCategory(item.category)
        .filter(d => `imported_${d.id}` !== item.id)
        .slice(0, 5);
      
      if (sameCategory.length) {
        relatedEl.innerHTML = sameCategory.map(doc => `
          <div class="related-link" onclick="openItem('imported_${doc.id}', 'imported')">
            <span class="link-icon">${doc.formatIcon || '📄'}</span>
            <span class="link-title">${doc.title}</span>
            <span class="link-arrow">→</span>
          </div>
        `).join('');
      } else {
        relatedEl.innerHTML = '<p style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">Keine ähnlichen Dokumente</p>';
      }
    } else if (window.MarkdownLoader) {
      // Dla dokumentów z Markdown - oryginalna logika
      const verwandt = MarkdownLoader.getVerwandteThemen(item.id);
      if (verwandt?.length) {
        relatedEl.innerHTML = verwandt.slice(0, 5).map(rel => `
          <div class="related-link" onclick="openItem('${rel.id}')">
            <span class="link-icon">${rel.icon || '📄'}</span>
            <span class="link-title">${rel.title}</span>
            <span class="link-arrow">→</span>
          </div>
        `).join('');
      } else {
        relatedEl.innerHTML = '<p style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">Keine verwandten Themen</p>';
      }
    }
  }
  
  // 2. Inne sekcje z tego samego TEILa / kategorii importu
  const sameTeilEl = document.getElementById('sameTeilList');
  if (sameTeilEl) {
    if (isImported) {
      // Dla zaimportowanych - pokaż inne importy
      const allImports = SearchEngine.getAllImportedDocs()
        .filter(d => `imported_${d.id}` !== item.id)
        .slice(0, 5);
      
      if (allImports.length) {
        sameTeilEl.innerHTML = allImports.map(doc => `
          <div class="related-link" onclick="openItem('imported_${doc.id}', 'imported')">
            <span class="link-icon">${doc.formatIcon || '📄'}</span>
            <span class="link-title">${doc.title}</span>
            <span class="link-arrow">→</span>
          </div>
        `).join('');
        
        // Link do wszystkich importów
        sameTeilEl.innerHTML += `
          <div class="related-link" onclick="navigateTo('import')" style="background: var(--color-primary-bg);">
            <span class="link-icon">📥</span>
            <span class="link-title">Alle importierten Dokumente</span>
            <span class="link-arrow">→</span>
          </div>
        `;
      } else {
        sameTeilEl.innerHTML = '';
      }
    } else if (window.MarkdownLoader && item.teil) {
      // Dla Markdown - sekcje z tego samego TEILa
      const sameTeil = MarkdownLoader.getTeilSektionen(item.teil)
        .filter(s => s.id !== item.id && s.type !== 'overview')
        .slice(0, 5);
      
      if (sameTeil?.length) {
        sameTeilEl.innerHTML = sameTeil.map(s => `
          <div class="related-link" onclick="openItem('${s.id}')">
            <span class="link-icon">${s.icon || '📄'}</span>
            <span class="link-title">${s.nummer || ''} ${s.title}</span>
            <span class="link-arrow">→</span>
          </div>
        `).join('');
        
        // Dodaj link do pełnego TEILa
        sameTeilEl.innerHTML += `
          <div class="related-link" onclick="openTeil(${item.teil})" style="background: var(--color-primary-bg);">
            <span class="link-icon">📖</span>
            <span class="link-title">Ganzen TEIL ${item.teil} lesen</span>
            <span class="link-arrow">→</span>
          </div>
        `;
      } else {
        sameTeilEl.innerHTML = '';
      }
    } else {
      sameTeilEl.innerHTML = '';
    }
  }
  
  // 3. Podobne kategorie / typy dokumentów
  const similarEl = document.getElementById('similarCategoriesList');
  if (similarEl) {
    if (isImported) {
      // Dla importów - pokaż kategorie z dokumentImporter
      const categories = documentImporter?.categories || [];
      const otherCats = categories.filter(c => c.id !== item.category).slice(0, 4);
      
      if (otherCats.length) {
        similarEl.innerHTML = otherCats.map(cat => `
          <div class="related-link" onclick="filterImportsByCategory('${cat.id}')">
            <span class="link-icon">${cat.icon}</span>
            <span class="link-title">${cat.name}</span>
            <span class="link-arrow">→</span>
          </div>
        `).join('');
      }
    } else if (item.category) {
      // Dla Markdown - inne kategorie
      const otherCats = Object.entries(CONFIG.categories)
        .filter(([key]) => key !== item.category && key !== 'formulare' && key !== 'tabellen')
        .slice(0, 4);
      
      if (otherCats.length) {
        similarEl.innerHTML = otherCats.map(([key, cat]) => `
          <div class="related-link" onclick="navigateTo('wissensbasis', '${key}')">
            <span class="link-icon">${cat.icon}</span>
            <span class="link-title">${cat.title}</span>
            <span class="link-arrow">→</span>
          </div>
        `).join('');
      }
    }
  }
}

/**
 * Filtruje zaimportowane dokumenty według kategorii
 */
function filterImportsByCategory(category) {
  navigateTo('import');
  setTimeout(() => {
    const filter = document.getElementById('docsFilter');
    if (filter) {
      filter.value = category;
      if (typeof documentImporter !== 'undefined') {
        documentImporter.filterDocuments();
      }
    }
  }, 100);
}

// performSearchFromTag jest zdefiniowana w sekcji Document Intelligence (linia ~808)

function printCurrentDetail() {
  if (App.currentDetailItem) {
    printItem(App.currentDetailItem.id);
  }
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
  
  // PRIORYTET 1: Szukaj w MarkdownLoader (pełny tekst!)
  let wbResults = [];
  if (window.MarkdownLoader && MarkdownLoader.suchIndex?.length) {
    const mdResults = MarkdownLoader.suche(query);
    wbResults = mdResults.map(r => ({
      ...r,
      type: 'markdown',
      source: `TEIL ${r.teil}`,
      preview: r.text ? r.text.substring(0, 200) + '...' : '',
      score: r.score
    }));
    console.log(`🔍 Markdown-Suche: ${wbResults.length} Ergebnisse für "${query}"`);
  } 
  // PRIORYTET 2: Szukaj za pomocą SearchEngine (unified search)
  else if (typeof SearchEngine !== 'undefined') {
    wbResults = SearchEngine.search(query);
  }
  
  // Importierte Dokumente są już w SearchEngine.search(), 
  // ale dodajemy też bezpośrednie wyszukiwanie dla pewności
  let importResults = [];
  if (typeof SearchEngine !== 'undefined' && SearchEngine.data?.importedDocs?.length) {
    // Importowane dokumenty już są w wynikach SearchEngine.search()
    // Sprawdźmy czy trzeba je dodać
    const hasImported = wbResults.some(r => r.type === 'imported');
    if (!hasImported) {
      const normalizedQuery = query.toLowerCase();
      importResults = SearchEngine.data.importedDocs
        .filter(doc => {
          const title = (doc.title || '').toLowerCase();
          const content = (doc.content || '').toLowerCase();
          const tags = (doc.tags || []).join(' ').toLowerCase();
          return title.includes(normalizedQuery) || 
                 content.includes(normalizedQuery) || 
                 tags.includes(normalizedQuery);
        })
        .map(doc => ({
          id: `imported_${doc.id}`,
          title: doc.title,
          type: 'imported',
          icon: doc.formatIcon || '📄',
          source: 'Importierte Dokumente',
          preview: doc.content ? doc.content.substring(0, 200) + '...' : '',
          keywords: doc.tags || [],
          category: doc.category,
          importedDoc: doc
        }));
    }
  }
  
  // Ergebnisse zusammenführen (bez duplikatów)
  const allResults = [...wbResults, ...importResults];
  const uniqueResults = allResults.filter((item, index, self) => 
    index === self.findIndex(t => t.id === item.id)
  );
  
  // Ergebnisse anzeigen
  UI.renderSearchResults(uniqueResults, query);
  
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
  // ZAWSZE pokaż Schnellsuche UI - niezależnie od stanu sieci
  // (Speech Recognition wymaga internetu, więc dajemy prostą alternatywę)
  if (window.OfflineVoice) {
    OfflineVoice.showOfflineVoiceUI();
    return;
  }
  
  // Fallback - jeśli OfflineVoice nie jest załadowane
  // Sprawdź czy jest połączenie z internetem
  if (!navigator.onLine) {
    UI.showToast('Sprachsuche benötigt Internetverbindung. Nutzen Sie die Textsuche.', 'warning');
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.focus();
      searchInput.placeholder = 'Hier tippen... (offline)';
    }
    return;
  }
  
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
    let errorType = 'error';
    
    switch(event.error) {
      case 'no-speech':
        errorMsg = 'Keine Sprache erkannt. Bitte sprechen Sie lauter.';
        break;
      case 'audio-capture':
        errorMsg = 'Kein Mikrofon gefunden. Prüfen Sie die Mikrofoneinstellungen.';
        break;
      case 'not-allowed':
        errorMsg = 'Mikrofonzugriff verweigert. Bitte erlauben Sie den Zugriff in den Einstellungen.';
        break;
      case 'network':
        errorMsg = 'Keine Internetverbindung für Sprachsuche. Nutzen Sie die Textsuche!';
        errorType = 'warning';
        // Fokus na tekstową wyszukiwarkę
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
          searchInput.focus();
        }
        break;
      case 'aborted':
        errorMsg = 'Sprachsuche abgebrochen';
        errorType = 'info';
        break;
      case 'service-not-allowed':
        errorMsg = 'Sprachdienst nicht verfügbar. Nutzen Sie die Textsuche.';
        break;
    }
    
    UI.showToast(errorMsg, errorType);
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
    UI.showToast('Spracherkennung konnte nicht gestartet werden. Nutzen Sie die Textsuche.', 'error');
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
  // Szukaj w MarkdownLoader (pełne dane)
  let item = null;
  if (window.MarkdownLoader && MarkdownLoader.sektionen?.length) {
    item = MarkdownLoader.sektionen.find(s => s.id === itemId);
  }
  if (!item) {
    item = App.wissensbasis.find(i => i.id === itemId);
  }
  if (!item) {
    UI.showToast('Element nicht gefunden', 'error');
    return;
  }
  
  // Pobierz pełną zawartość HTML
  const contentHtml = item.html || item.content || item.description || '';
  
  // Druckfenster z pełną zawartością
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${item.title} - VG-Normen Wissenssystem</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          font-size: 11pt; 
          line-height: 1.5; 
          padding: 15mm;
          max-width: 210mm;
        }
        h1 { font-size: 16pt; margin-bottom: 8mm; color: #003366; }
        h2 { font-size: 14pt; margin-top: 8mm; margin-bottom: 4mm; color: #003366; }
        h3 { font-size: 12pt; margin-top: 6mm; margin-bottom: 3mm; }
        h4 { font-size: 11pt; margin-top: 4mm; margin-bottom: 2mm; }
        .header { 
          display: flex; 
          justify-content: space-between; 
          border-bottom: 2px solid #003366; 
          padding-bottom: 5mm;
          margin-bottom: 8mm;
        }
        .logo { font-size: 14pt; font-weight: bold; color: #003366; }
        .date { font-size: 10pt; color: #666; }
        .norm { 
          background: #f0f0f0; 
          padding: 3mm; 
          margin-bottom: 5mm; 
          border-left: 3px solid #003366;
        }
        .content { margin: 5mm 0; }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 4mm 0; 
          font-size: 10pt;
        }
        th { 
          background: #003366; 
          color: white; 
          padding: 2mm 3mm; 
          text-align: left;
          font-weight: bold;
        }
        td { 
          border: 1px solid #ddd; 
          padding: 2mm 3mm; 
        }
        tr:nth-child(even) { background: #f8f8f8; }
        ul, ol { margin-left: 5mm; }
        li { margin-bottom: 2mm; }
        .keywords { 
          margin-top: 8mm; 
          padding-top: 4mm; 
          border-top: 1px solid #ccc; 
          font-size: 10pt;
        }
        .tag { 
          display: inline-block; 
          background: #e0e0e0; 
          padding: 1mm 3mm; 
          margin: 1mm; 
          border-radius: 2mm; 
          font-size: 9pt;
        }
        .footer {
          margin-top: 10mm;
          padding-top: 4mm;
          border-top: 1px solid #ccc;
          font-size: 9pt;
          color: #666;
          text-align: center;
        }
        @media print { 
          body { padding: 10mm; }
          @page { margin: 15mm; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">📚 VG-Normen Wissenssystem</div>
        <div class="date">Gedruckt: ${new Date().toLocaleDateString('de-DE')}</div>
      </div>
      
      <h1>${item.icon || '📄'} ${item.title}</h1>
      ${item.norm ? `<div class="norm">📋 Norm: <strong>${item.norm}</strong></div>` : ''}
      ${item.teil ? `<div class="norm">📚 TEIL ${item.teil}: ${item.teilTitle || ''}</div>` : ''}
      
      <div class="content">${contentHtml}</div>
      
      ${item.keywords?.length ? `
        <div class="keywords">
          <strong>🔍 Schlagworte:</strong>
          ${item.keywords.map(k => `<span class="tag">${k}</span>`).join('')}
        </div>
      ` : ''}
      
      <div class="footer">
        VG-Normen Wissenssystem v${CONFIG.appVersion} | © ${new Date().getFullYear()}
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
  
  // Poczekaj na załadowanie i drukuj
  setTimeout(() => {
    printWindow.print();
  }, 250);
}

// ═══════════════════════════════════════════════════════════════════════════════
// BACKUP & EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

async function createBackup() {
  // Sprawdź czy mamy IndexedDB
  const useIDB = typeof IndexedDBStorage !== 'undefined';
  
  let data;
  let filename;
  
  if (useIDB) {
    // Pełny backup z IndexedDB (WŁĄCZNIE z plikami!)
    UI.showToast('Erstelle vollständiges Backup (inkl. Originaldateien)...', 'info');
    
    try {
      const jsonString = await IndexedDBStorage.exportFullBackup();
      data = jsonString;
      filename = `VG-Normen-FULL-Backup_${Utils.dateForFileName()}.json`;
      
      const stats = await IndexedDBStorage.getStorageStats();
      console.log(`📦 Backup enthält: ${stats.documents} Dokumente, ${stats.files} Dateien, ${IndexedDBStorage.formatSize(stats.totalSize)}`);
    } catch (e) {
      console.error('IndexedDB Backup Fehler:', e);
      UI.showToast('Fehler beim Backup: ' + e.message, 'error');
      return;
    }
  } else {
    // Fallback: nur localStorage
    data = JSON.stringify({
      version: CONFIG.appVersion,
      date: new Date().toISOString(),
      favorites: Storage.getFavorites(),
      history: Storage.getHistory(),
      settings: Storage.getSettings(),
      userDocs: Storage.getUserDocs()
    }, null, 2);
    filename = `VG-Normen-Backup_${Utils.dateForFileName()}.json`;
  }
  
  const blob = new Blob([data], { type: 'application/json' });
  
  if (App.isElectron) {
    const filePath = await window.electronAPI.saveDialog({
      title: 'Backup speichern',
      defaultPath: filename,
      filters: [{ name: 'JSON', extensions: ['json'] }]
    });
    
    if (filePath) {
      await window.electronAPI.writeFile(filePath, data);
      Storage.setLastBackup(Date.now());
      UI.updateSettingsUI();
      UI.showToast('✅ Vollständiges Backup erstellt!', 'success');
    }
  } else {
    // Browser Download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    Storage.setLastBackup(Date.now());
    UI.updateSettingsUI();
    UI.showToast('✅ Backup heruntergeladen!', 'success');
  }
}

async function restoreBackup() {
  let jsonString;
  
  if (App.isElectron) {
    const filePath = await window.electronAPI.openFileDialog({
      title: 'Backup auswählen',
      filters: [{ name: 'JSON', extensions: ['json'] }]
    });
    
    if (!filePath || filePath.length === 0) return;
    
    jsonString = await window.electronAPI.readFile(filePath[0]);
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
    
    jsonString = await file.text();
  }
  
  UI.showToast('Backup wird wiederhergestellt...', 'info');
  
  try {
    const data = JSON.parse(jsonString);
    
    // Sprawdź czy to pełny backup z IndexedDB
    if (data.version?.includes('full') && typeof IndexedDBStorage !== 'undefined') {
      await IndexedDBStorage.importData(jsonString);
      
      // Odśwież dokumenty w importerze
      if (typeof documentImporter !== 'undefined') {
        documentImporter.importedDocuments = await IndexedDBStorage.getAllDocuments();
      }
      
      UI.showToast('✅ Vollständiges Backup wiederhergestellt (inkl. Dateien)!', 'success');
    } else {
      // Stary format lub brak IndexedDB - użyj localStorage
      if (data.favorites) Storage.set('favorites', data.favorites);
      if (data.history) Storage.set('history', data.history);
      if (data.settings) Storage.saveSettings(data.settings);
      if (data.userDocs) Storage.saveUserDocs(data.userDocs);
      
      // Migruj do IndexedDB jeśli dostępne
      if (typeof IndexedDBStorage !== 'undefined' && data.documents) {
        await IndexedDBStorage.importData(jsonString);
      }
      
      UI.showToast('✅ Backup wiederhergestellt!', 'success');
    }
    
    // UI aktualisieren
    applySettings();
    UI.renderFavorites();
    UI.renderHistory();
    
  } catch (error) {
    console.error('Backup restore error:', error);
    UI.showToast('Fehler beim Wiederherstellen: ' + error.message, 'error');
  }
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

// createBackup() jest zdefiniowana wcześniej w sekcji BACKUP & EXPORT (linia ~1852)

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
  
  // PRIORYTET: Pobierz dane z MarkdownLoader (pełne sekcje)
  let cards = [];
  
  if (window.MarkdownLoader && MarkdownLoader.sektionen?.length) {
    cards = MarkdownLoader.sektionen.filter(s => s.type !== 'overview');
    console.log(`📚 Wissensbasis: ${cards.length} Sektionen aus Markdown`);
  } else if (App.wissensbasis?.length) {
    cards = App.wissensbasis;
    console.log(`📚 Wissensbasis: ${cards.length} Einträge aus Cache`);
  }
  
  // Filter by category if specified
  if (filterCategory) {
    cards = cards.filter(c => c.category === filterCategory);
  }
  
  if (cards.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <span class="icon">📚</span>
        <p>Wissensbasis wird geladen...<br>Bitte warten Sie einen Moment.</p>
        <button class="btn-primary" onclick="location.reload()">🔄 Neu laden</button>
      </div>
    `;
    return;
  }
  
  // Group by TEIL (priority) then category
  const groupedByTeil = {};
  cards.forEach(card => {
    const teilKey = card.teil || card.parentTeil || 'sonstiges';
    if (!groupedByTeil[teilKey]) groupedByTeil[teilKey] = [];
    groupedByTeil[teilKey].push(card);
  });
  
  let html = '';
  
  // Sortiere TEILs numerisch
  const sortedTeils = Object.keys(groupedByTeil).sort((a, b) => {
    const numA = parseInt(a) || 999;
    const numB = parseInt(b) || 999;
    return numA - numB;
  });
  
  sortedTeils.forEach(teilKey => {
    const teilCards = groupedByTeil[teilKey];
    const teilInfo = MarkdownLoader?.teilDateien?.find(t => t.teil == teilKey);
    
    html += `
      <div class="category-section">
        <div class="section-header" onclick="openTeil(${teilKey})" style="cursor:pointer;">
          <h3 class="category-title">${teilInfo?.icon || '📄'} TEIL ${teilKey}: ${teilInfo?.title || 'Sonstiges'}</h3>
          <span class="section-count">${teilCards.length} Abschnitte</span>
          <span class="section-link">→ Ganzen TEIL lesen</span>
        </div>
        <div class="cards-grid">
    `;
    
    // Sortiere nach Nummer
    teilCards.sort((a, b) => {
      const numA = parseFloat(a.nummer) || 0;
      const numB = parseFloat(b.nummer) || 0;
      return numA - numB;
    });
    
    teilCards.slice(0, 8).forEach(card => {  // Max 8 pro TEIL
      const isFav = Storage.isFavorite(card.id);
      const preview = card.inhalt ? card.inhalt.substring(0, 120).replace(/<[^>]*>/g, '') + '...' : '';
      
      html += `
        <div class="card wissensbasis-card" onclick="openItem('${card.id}')">
          <div class="card-header">
            <span class="card-icon">${card.icon || '📄'}</span>
            <span class="card-title">${card.nummer || ''} ${card.title}</span>
            ${isFav ? '<span class="fav-star">⭐</span>' : ''}
          </div>
          <p class="card-desc">${preview || card.description || ''}</p>
          <div class="card-footer">
            <span class="card-norm">${card.norm || ''}</span>
            ${card.keywords?.length ? `
              <div class="card-tags">
                ${card.keywords.slice(0, 3).map(k => `<span class="tag">${k}</span>`).join('')}
              </div>
            ` : ''}
          </div>
        </div>
      `;
    });
    
    // "Mehr anzeigen" button if more than 8
    if (teilCards.length > 8) {
      html += `
        <div class="card more-card" onclick="openTeil(${teilKey})">
          <span class="more-icon">➕</span>
          <span class="more-text">${teilCards.length - 8} weitere Abschnitte</span>
        </div>
      `;
    }
    
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
  
  // Użyj MediaManager do renderowania galerii
  if (typeof mediaManager !== 'undefined') {
    container.innerHTML = mediaManager.renderGalleryPage();
    console.log('📷 MediaManager: Galerie gerendert');
  } else {
    // Fallback jeśli MediaManager nie załadowany
    container.innerHTML = `
      <div class="empty-state">
        <span class="icon">⚠️</span>
        <p>Bildergalerie nicht verfügbar</p>
        <p>MediaManager konnte nicht geladen werden</p>
      </div>
    `;
  }
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
  // Szukaj tabeli w SearchEngine lub MarkdownLoader
  let table = null;
  
  if (window.MarkdownLoader) {
    table = MarkdownLoader.sektionen.find(s => s.id === id && s.type === 'tabelle');
  }
  
  if (!table && typeof SearchEngine !== 'undefined') {
    table = SearchEngine.getById(id);
  }
  
  if (table) {
    openItem(id, 'tabelle');
  } else {
    UI.showToast(`Tabelle "${id}" nicht gefunden`, 'warning');
  }
}

function openBild(id) {
  // Użyj MediaManager do otwarcia lightbox
  if (typeof mediaManager !== 'undefined') {
    mediaManager.openLightbox(id);
  } else {
    UI.showToast(`Bild "${id}" - MediaManager nicht verfügbar`, 'warning');
  }
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
