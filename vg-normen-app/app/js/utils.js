// ═══════════════════════════════════════════════════════════════════════════════
// VG-NORMEN WISSENSSYSTEM - UTILITY FUNCTIONS
// Allgemeine Hilfsfunktionen
// ═══════════════════════════════════════════════════════════════════════════════

const Utils = {
  
  // ═══════════════════════════════════════════════════════════════════════════
  // STRING UTILITIES
  // ═══════════════════════════════════════════════════════════════════════════
  
  // Text truncate mit Ellipsis
  truncate(str, maxLength = 50) {
    if (!str || str.length <= maxLength) return str;
    return str.substring(0, maxLength - 3) + '...';
  },
  
  // Erste Buchstaben groß
  capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },
  
  // Titel Case (jedes Wort groß)
  titleCase(str) {
    if (!str) return '';
    return str.split(' ').map(word => this.capitalize(word)).join(' ');
  },
  
  // HTML-Entities escapen
  escapeHtml(str) {
    if (!str) return '';
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return str.replace(/[&<>"']/g, m => map[m]);
  },
  
  // Text für Suche normalisieren
  normalizeText(str) {
    if (!str) return '';
    return str
      .toLowerCase()
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  },
  
  // Highlight Suchbegriff im Text
  highlightText(text, query) {
    if (!query || !text) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // DATE UTILITIES
  // ═══════════════════════════════════════════════════════════════════════════
  
  // Datum formatieren (deutsch)
  formatDate(date, format = 'short') {
    if (!date) return '';
    const d = new Date(date);
    
    if (format === 'short') {
      return d.toLocaleDateString('de-DE');
    }
    
    if (format === 'long') {
      return d.toLocaleDateString('de-DE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    
    if (format === 'datetime') {
      return d.toLocaleString('de-DE');
    }
    
    return d.toISOString();
  },
  
  // Relative Zeit (vor X Minuten/Stunden)
  timeAgo(date) {
    const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
    
    const intervals = {
      Jahr: 31536000,
      Monat: 2592000,
      Woche: 604800,
      Tag: 86400,
      Stunde: 3600,
      Minute: 60
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        const plural = interval > 1 && !unit.endsWith('e') ? 'e' : '';
        return `vor ${interval} ${unit}${plural}n`;
      }
    }
    
    return 'gerade eben';
  },
  
  // ISO Datum für Dateinamen
  dateForFileName() {
    return new Date().toISOString().split('T')[0];
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // NUMBER UTILITIES
  // ═══════════════════════════════════════════════════════════════════════════
  
  // Dateigröße formatieren
  formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  },
  
  // Prozent formatieren
  formatPercent(value, decimals = 0) {
    return value.toFixed(decimals) + '%';
  },
  
  // Zahl mit Tausender-Trenner
  formatNumber(num) {
    return num.toLocaleString('de-DE');
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // ARRAY UTILITIES
  // ═══════════════════════════════════════════════════════════════════════════
  
  // Duplikate entfernen
  unique(arr) {
    return [...new Set(arr)];
  },
  
  // Array shuffeln (für zufällige Reihenfolge)
  shuffle(arr) {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  },
  
  // Array nach Eigenschaft gruppieren
  groupBy(arr, key) {
    return arr.reduce((groups, item) => {
      const value = item[key];
      groups[value] = groups[value] || [];
      groups[value].push(item);
      return groups;
    }, {});
  },
  
  // Array nach Eigenschaft sortieren
  sortBy(arr, key, direction = 'asc') {
    return [...arr].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // FILE UTILITIES
  // ═══════════════════════════════════════════════════════════════════════════
  
  // Dateiendung extrahieren
  getFileExtension(filename) {
    if (!filename) return '';
    const parts = filename.split('.');
    return parts.length > 1 ? parts.pop().toLowerCase() : '';
  },
  
  // Dateiname ohne Endung
  getBaseName(filename) {
    if (!filename) return '';
    return filename.replace(/\.[^/.]+$/, '');
  },
  
  // Prüfen ob Dateityp unterstützt
  isSupportedFile(filename) {
    const ext = this.getFileExtension(filename);
    return CONFIG.supportedFileTypes.includes(ext);
  },
  
  // Icon für Dateityp
  getFileIcon(filename) {
    const ext = this.getFileExtension(filename);
    return CONFIG.fileIcons[ext] || CONFIG.fileIcons.default;
  },
  
  // Sicheren Dateinamen erstellen
  sanitizeFileName(name) {
    return name
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/Ä/g, 'Ae')
      .replace(/Ö/g, 'Oe')
      .replace(/Ü/g, 'Ue')
      .replace(/[<>:"/\\|?*]/g, '')
      .replace(/\s+/g, '_')
      .replace(/_+/g, '_')
      .substring(0, 200)
      .replace(/^_+|_+$/g, '');
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // DOM UTILITIES
  // ═══════════════════════════════════════════════════════════════════════════
  
  // Element erstellen mit Attributen
  createElement(tag, attrs = {}, content = '') {
    const el = document.createElement(tag);
    
    for (const [key, value] of Object.entries(attrs)) {
      if (key === 'class') {
        el.className = value;
      } else if (key === 'style' && typeof value === 'object') {
        Object.assign(el.style, value);
      } else if (key.startsWith('on')) {
        el[key] = value;
      } else {
        el.setAttribute(key, value);
      }
    }
    
    if (content) {
      if (typeof content === 'string') {
        el.innerHTML = content;
      } else if (content instanceof Node) {
        el.appendChild(content);
      }
    }
    
    return el;
  },
  
  // Element leeren
  clearElement(el) {
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  },
  
  // Scroll zu Element (smooth)
  scrollToElement(el, offset = 0) {
    const rect = el.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    window.scrollTo({
      top: rect.top + scrollTop - offset,
      behavior: 'smooth'
    });
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // ASYNC UTILITIES
  // ═══════════════════════════════════════════════════════════════════════════
  
  // Debounce (verzögerte Ausführung)
  debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  // Throttle (max. X Aufrufe pro Zeit)
  throttle(func, limit = 300) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
  
  // Warten (Promise-basiert)
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  
  // Retry mit Exponential Backoff
  async retry(fn, maxRetries = 3, delay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await this.sleep(delay * Math.pow(2, i));
      }
    }
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // VALIDATION UTILITIES
  // ═══════════════════════════════════════════════════════════════════════════
  
  // Prüfen ob Objekt leer
  isEmpty(obj) {
    if (obj === null || obj === undefined) return true;
    if (Array.isArray(obj)) return obj.length === 0;
    if (typeof obj === 'object') return Object.keys(obj).length === 0;
    if (typeof obj === 'string') return obj.trim().length === 0;
    return false;
  },
  
  // Tiefe Kopie eines Objekts
  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  },
  
  // UUID generieren
  generateId() {
    return 'id_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }
};

// Export für Module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Utils;
}
