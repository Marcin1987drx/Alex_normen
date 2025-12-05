// Test runner for VG-Normen Wissenssystem
// Runs basic JavaScript syntax and module loading tests

const fs = require('fs');
const path = require('path');

console.log('═══════════════════════════════════════════════════════════════');
console.log('  VG-Normen Wissenssystem - JavaScript Tests');
console.log('═══════════════════════════════════════════════════════════════\n');

const appDir = path.join(__dirname, 'app');
const jsDir = path.join(appDir, 'js');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (e) {
    console.log(`✗ ${name}`);
    console.log(`  Error: ${e.message}`);
    failed++;
  }
}

function section(name) {
  console.log(`\n📋 ${name}`);
  console.log('─'.repeat(50));
}

// ═══════════════════════════════════════════════════════════════
// FILE EXISTENCE TESTS
// ═══════════════════════════════════════════════════════════════
section('File Existence Tests');

const requiredFiles = [
  'app/index.html',
  'app/style.css',
  'app/js/config.js',
  'app/js/utils.js',
  'app/js/storage.js',
  'app/js/search-engine.js',
  'app/js/ui.js',
  'app/js/app.js',
  'app/js/pdf-extractor.js',
  'app/js/docx-extractor.js',
  'app/js/document-analyzer.js',
  'app/wissensbasis/karten.json',
  'app/formulare/F01-Crimphoehen-Messprotokoll.html',
  'app/formulare/F02-Zugtest-Protokoll.html',
  'main.js',
  'preload.js',
  'package.json'
];

requiredFiles.forEach(file => {
  test(`${file} exists`, () => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${file}`);
    }
  });
});

// ═══════════════════════════════════════════════════════════════
// JAVASCRIPT SYNTAX TESTS
// ═══════════════════════════════════════════════════════════════
section('JavaScript Syntax Tests');

const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));

jsFiles.forEach(file => {
  test(`${file} has valid syntax`, () => {
    const filePath = path.join(jsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Basic syntax check - try to parse with Function constructor
    // This won't execute the code, just parse it
    try {
      new Function(content);
    } catch (e) {
      throw new Error(`Syntax error: ${e.message}`);
    }
  });
});

// ═══════════════════════════════════════════════════════════════
// HTML STRUCTURE TESTS
// ═══════════════════════════════════════════════════════════════
section('HTML Structure Tests');

const indexHtml = fs.readFileSync(path.join(appDir, 'index.html'), 'utf8');

test('index.html has DOCTYPE', () => {
  if (!indexHtml.includes('<!DOCTYPE html>')) throw new Error('Missing DOCTYPE');
});

test('index.html has correct script order', () => {
  const scriptOrder = [
    'js/config.js',
    'js/utils.js',
    'js/storage.js',
    'js/search-engine.js',
    'js/ui.js',
    'js/pdf-extractor.js',
    'js/docx-extractor.js',
    'js/document-analyzer.js',
    'js/app.js'
  ];
  
  let lastIndex = -1;
  scriptOrder.forEach(script => {
    const idx = indexHtml.indexOf(`src="${script}"`);
    if (idx === -1) throw new Error(`Script ${script} not found`);
    if (idx < lastIndex) throw new Error(`Script ${script} is in wrong order`);
    lastIndex = idx;
  });
});

test('index.html has toastContainer', () => {
  if (!indexHtml.includes('id="toastContainer"')) throw new Error('Missing toastContainer');
});

test('index.html has searchInput', () => {
  if (!indexHtml.includes('id="searchInput"')) throw new Error('Missing searchInput');
});

// ═══════════════════════════════════════════════════════════════
// WISSENSBASIS DATA TESTS
// ═══════════════════════════════════════════════════════════════
section('Wissensbasis Data Tests');

const kartenPath = path.join(appDir, 'wissensbasis', 'karten.json');
const karten = JSON.parse(fs.readFileSync(kartenPath, 'utf8'));

test('karten.json is valid JSON array', () => {
  if (!Array.isArray(karten)) throw new Error('Not an array');
});

test(`karten.json has ${karten.length} entries`, () => {
  if (karten.length === 0) throw new Error('No entries');
});

test('All cards have required fields', () => {
  const required = ['id', 'title', 'content', 'category'];
  karten.forEach((card, i) => {
    required.forEach(field => {
      if (!card[field]) throw new Error(`Card ${i} missing ${field}`);
    });
  });
});

test('All card IDs are unique', () => {
  const ids = karten.map(k => k.id);
  const unique = [...new Set(ids)];
  if (ids.length !== unique.length) throw new Error('Duplicate IDs found');
});

// ═══════════════════════════════════════════════════════════════
// CONFIG TESTS
// ═══════════════════════════════════════════════════════════════
section('Config Content Tests');

const configContent = fs.readFileSync(path.join(jsDir, 'config.js'), 'utf8');

test('config.js defines CONFIG object', () => {
  if (!configContent.includes('const CONFIG')) throw new Error('CONFIG not defined');
});

test('config.js has appVersion', () => {
  if (!configContent.includes('appVersion')) throw new Error('appVersion missing');
});

test('config.js has storageKeys', () => {
  if (!configContent.includes('storageKeys')) throw new Error('storageKeys missing');
});

test('config.js has categories', () => {
  if (!configContent.includes('categories')) throw new Error('categories missing');
});

// ═══════════════════════════════════════════════════════════════
// FUNCTION DEFINITIONS TESTS
// ═══════════════════════════════════════════════════════════════
section('Function Definitions Tests');

const appJsContent = fs.readFileSync(path.join(jsDir, 'app.js'), 'utf8');

const requiredFunctions = [
  'navigateTo',
  'goBack',
  'handleSearch',
  'performSearch',
  'showSettings',
  'showHelp',
  'printPage',
  'setFontSize',
  'setHighContrast',
  'toggleFavorite',
  'closeModal',
  'startVoiceSearch',
  'stopVoiceSearch',
  'addDocuments',
  'openDocumentsFolder',
  'scanDocuments',
  'createBackup',
  'loadBackup',
  'clearHistory',
  'clearAllData',
  'confirmRename',
  'handleSearchKeyup'
];

requiredFunctions.forEach(fn => {
  test(`function ${fn}() is defined`, () => {
    const regex = new RegExp(`function\\s+${fn}\\s*\\(`);
    if (!regex.test(appJsContent)) {
      throw new Error(`Function ${fn} not found in app.js`);
    }
  });
});

// ═══════════════════════════════════════════════════════════════
// STORAGE MODULE TESTS
// ═══════════════════════════════════════════════════════════════
section('Storage Module Tests');

const storageContent = fs.readFileSync(path.join(jsDir, 'storage.js'), 'utf8');

const storageMethods = [
  'set',
  'get',
  'remove',
  'getSettings',
  'saveSettings',
  'getFavorites',
  'addFavorite',
  'removeFavorite',
  'isFavorite',
  'getHistory',
  'addToHistory',
  'clearHistory',
  'exportAllData',
  'importAllData',
  'clearAll'
];

storageMethods.forEach(method => {
  test(`Storage.${method}() is defined`, () => {
    const regex = new RegExp(`${method}\\s*[:(]`);
    if (!regex.test(storageContent)) {
      throw new Error(`Method ${method} not found in storage.js`);
    }
  });
});

// ═══════════════════════════════════════════════════════════════
// UI MODULE TESTS
// ═══════════════════════════════════════════════════════════════
section('UI Module Tests');

const uiContent = fs.readFileSync(path.join(jsDir, 'ui.js'), 'utf8');

const uiMethods = [
  'showToast',
  'showModal',
  'closeModal',
  'updateBreadcrumbs',
  'showPage',
  'renderFavorites',
  'renderHistory',
  'updateSettingsUI'
];

uiMethods.forEach(method => {
  test(`UI.${method}() is defined`, () => {
    const regex = new RegExp(`${method}\\s*[:(]`);
    if (!regex.test(uiContent)) {
      throw new Error(`Method ${method} not found in ui.js`);
    }
  });
});

// ═══════════════════════════════════════════════════════════════
// SEARCH ENGINE TESTS
// ═══════════════════════════════════════════════════════════════
section('Search Engine Tests');

const searchContent = fs.readFileSync(path.join(jsDir, 'search-engine.js'), 'utf8');

const searchMethods = [
  'search',
  'init',
  'normalizeQuery'
];

searchMethods.forEach(method => {
  test(`SearchEngine.${method}() is defined`, () => {
    const regex = new RegExp(`${method}\\s*[:(]`);
    if (!regex.test(searchContent)) {
      throw new Error(`Method ${method} not found in search-engine.js`);
    }
  });
});

// ═══════════════════════════════════════════════════════════════
// ELECTRON MAIN PROCESS TESTS
// ═══════════════════════════════════════════════════════════════
section('Electron Main Process Tests');

const mainContent = fs.readFileSync(path.join(__dirname, 'main.js'), 'utf8');

test('main.js imports electron', () => {
  if (!mainContent.includes("require('electron')")) throw new Error('No electron import');
});

test('main.js creates BrowserWindow', () => {
  if (!mainContent.includes('BrowserWindow')) throw new Error('No BrowserWindow');
});

test('main.js has IPC handlers', () => {
  if (!mainContent.includes('ipcMain')) throw new Error('No ipcMain handlers');
});

// ═══════════════════════════════════════════════════════════════
// PRELOAD TESTS
// ═══════════════════════════════════════════════════════════════
section('Preload Script Tests');

const preloadContent = fs.readFileSync(path.join(__dirname, 'preload.js'), 'utf8');

test('preload.js uses contextBridge', () => {
  if (!preloadContent.includes('contextBridge')) throw new Error('No contextBridge');
});

test('preload.js exposes electronAPI', () => {
  if (!preloadContent.includes('electronAPI')) throw new Error('No electronAPI exposed');
});

// ═══════════════════════════════════════════════════════════════
// SUMMARY
// ═══════════════════════════════════════════════════════════════
console.log('\n═══════════════════════════════════════════════════════════════');
console.log('  TEST SUMMARY');
console.log('═══════════════════════════════════════════════════════════════');
console.log(`  ✓ Passed: ${passed}`);
console.log(`  ✗ Failed: ${failed}`);
console.log(`  Total:    ${passed + failed}`);
console.log('═══════════════════════════════════════════════════════════════\n');

if (failed > 0) {
  console.log('❌ Some tests failed! Please fix the issues above.\n');
  process.exit(1);
} else {
  console.log('✅ All tests passed! Application is ready.\n');
  process.exit(0);
}
