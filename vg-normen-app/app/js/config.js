// ═══════════════════════════════════════════════════════════════════════════════
// VG-NORMEN WISSENSSYSTEM - KONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const CONFIG = {
  // App-Version
  version: '1.0.0',
  appVersion: '1.0.0',
  
  // LocalStorage Keys
  storageKeys: {
    favorites: 'vg_normen_favorites',
    history: 'vg_normen_history',
    settings: 'vg_normen_settings',
    userDocs: 'vg_normen_user_docs',
    lastBackup: 'vg_normen_last_backup'
  },
  
  // Limits
  maxHistoryItems: 20,
  maxSearchResults: 50,
  
  // Kategorien
  categories: {
    kabel: {
      id: 'kabel',
      title: 'Kabel & Leitungen',
      icon: '📏',
      norm: 'VG 95218',
      color: 'var(--color-cat-kabel)',
      description: 'Temperatursysteme, Abmessungen, Widerstände'
    },
    stecker: {
      id: 'stecker',
      title: 'Steckverbinder & Kontakte',
      icon: '🔌',
      norm: 'VG 95319',
      color: 'var(--color-cat-stecker)',
      description: 'Kontaktgrößen, Ströme, Crimpspezifikationen'
    },
    crimpen: {
      id: 'crimpen',
      title: 'Crimpen',
      icon: '🔧',
      norm: 'IPC/WHMA-A-620',
      color: 'var(--color-cat-crimp)',
      description: 'Anleitung, Akzeptanzkriterien, Bilder'
    },
    schrumpfen: {
      id: 'schrumpfen',
      title: 'Schrumpfschläuche',
      icon: '🔥',
      norm: 'VG 95343',
      color: 'var(--color-cat-schrumpf)',
      description: 'Typen A-H, Temperaturen, Anwendung'
    },
    pruefung: {
      id: 'pruefung',
      title: 'Prüfung & Qualität',
      icon: '✅',
      norm: 'VG 96927',
      color: 'var(--color-cat-pruefung)',
      description: 'Elektrische Prüfung, AQL, Protokolle'
    },
    schirmung: {
      id: 'schirmung',
      title: 'Abschirmung',
      icon: '🛡️',
      norm: 'VG 96936',
      color: 'var(--color-cat-schirmung)',
      description: 'Metallgeflechte, EMI, Montage'
    },
    formulare: {
      id: 'formulare',
      title: 'Formulare',
      icon: '📋',
      norm: '',
      color: 'var(--color-cat-formular)',
      description: 'Alle druckbaren Formulare'
    },
    tabellen: {
      id: 'tabellen',
      title: 'Tabellen',
      icon: '📊',
      norm: '',
      color: 'var(--color-cat-tabelle)',
      description: 'Alle technischen Tabellen'
    }
  },
  
  // Datei-Icons
  fileIcons: {
    pdf: '📄',
    docx: '📝',
    doc: '📝',
    txt: '📃',
    md: '📃',
    jpg: '🖼️',
    jpeg: '🖼️',
    png: '🖼️',
    gif: '🖼️',
    default: '📎'
  },
  
  // Schlüsselwörter für automatische Erkennung
  keywords: {
    crimp: ['crimp', 'crimpverbindung', 'crimpkontakt', 'quetschverbindung', 'crimpen'],
    kontakt: ['kontakt', 'kontakte', 'stift', 'buchse', 'pin', 'socket'],
    kabel: ['kabel', 'leitung', 'ader', 'litze', 'draht', 'wire'],
    stecker: ['stecker', 'steckverbinder', 'connector', 'verbinder'],
    schrumpf: ['schrumpf', 'schrumpfschlauch', 'heatshrink', 'wärmeschrumpf'],
    pruefung: ['prüfung', 'test', 'kontrolle', 'messung', 'check'],
    fehler: ['fehler', 'defekt', 'mangel', 'abweichung', 'schlecht', 'nio'],
    gut: ['gut', 'ok', 'io', 'akzeptabel', 'richtig'],
    bellmouth: ['bellmouth', 'trichter', 'aufweitung'],
    zugkraft: ['zugkraft', 'zugfestigkeit', 'newton', 'kraft'],
    temperatur: ['temperatur', 'grad', '°c', 'celsius', 'wärme'],
    system: ['system25', 'system100', 'system150', 'system200'],
    groesse: ['größe', 'size', '22', '20', '16', '12', '8', '4', '0']
  },
  
  // Synonyme für bessere Suche
  synonyms: {
    'kabel': ['leitung', 'ader', 'wire', 'draht'],
    'stecker': ['verbinder', 'connector', 'steckverbinder'],
    'crimp': ['crimpung', 'crimpen', 'quetschen', 'verpressen'],
    'prüfung': ['test', 'kontrolle', 'check', 'messung'],
    'fehler': ['defekt', 'mangel', 'problem', 'abweichung'],
    'gut': ['ok', 'i.o.', 'akzeptabel', 'korrekt'],
    'schlecht': ['n.i.o.', 'fehlerhaft', 'mangelhaft', 'defekt'],
    'temperatur': ['temp', 'wärme', 'grad'],
    'bellmouth': ['trichter', 'aufweitung', 'einlauf'],
    'isolierung': ['isolation', 'mantel', 'umhüllung']
  }
};

// Prüfen ob Electron verfügbar
const isElectron = window.electronAPI?.isElectron === true;
