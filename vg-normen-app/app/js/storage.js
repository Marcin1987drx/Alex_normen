// ═══════════════════════════════════════════════════════════════════════════════
// VG-NORMEN WISSENSSYSTEM - STORAGE
// LocalStorage Wrapper mit Fehlerbehandlung
// ═══════════════════════════════════════════════════════════════════════════════

const Storage = {
  
  // Daten speichern
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Storage.set error:', e);
      return false;
    }
  },
  
  // Daten laden
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error('Storage.get error:', e);
      return defaultValue;
    }
  },
  
  // Daten löschen
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('Storage.remove error:', e);
      return false;
    }
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // SETTINGS
  // ═══════════════════════════════════════════════════════════════════════════
  
  getSettings() {
    return this.get(CONFIG.storageKeys.settings, {
      fontSize: 'normal',
      highContrast: false
    });
  },
  
  saveSettings(settings) {
    return this.set(CONFIG.storageKeys.settings, settings);
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // FAVORITES
  // ═══════════════════════════════════════════════════════════════════════════
  
  getFavorites() {
    return this.get(CONFIG.storageKeys.favorites, []);
  },
  
  addFavorite(item) {
    const favorites = this.getFavorites();
    if (!favorites.find(f => f.id === item.id)) {
      favorites.unshift({
        id: item.id,
        title: item.title,
        category: item.category,
        icon: item.icon,
        type: item.type || 'wissensbasis',
        addedAt: Date.now()
      });
      this.set(CONFIG.storageKeys.favorites, favorites);
    }
    return favorites;
  },
  
  removeFavorite(itemId) {
    const favorites = this.getFavorites().filter(f => f.id !== itemId);
    this.set(CONFIG.storageKeys.favorites, favorites);
    return favorites;
  },
  
  isFavorite(itemId) {
    return this.getFavorites().some(f => f.id === itemId);
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // HISTORY
  // ═══════════════════════════════════════════════════════════════════════════
  
  getHistory() {
    return this.get(CONFIG.storageKeys.history, []);
  },
  
  addToHistory(item) {
    let history = this.getHistory();
    
    // Duplikate entfernen
    history = history.filter(h => h.id !== item.id);
    
    // Neuen Eintrag am Anfang
    history.unshift({
      id: item.id,
      title: item.title,
      category: item.category,
      icon: item.icon,
      type: item.type || 'wissensbasis',
      timestamp: Date.now()
    });
    
    // Auf Maximum begrenzen
    history = history.slice(0, CONFIG.maxHistoryItems);
    
    this.set(CONFIG.storageKeys.history, history);
    return history;
  },
  
  clearHistory() {
    return this.remove(CONFIG.storageKeys.history);
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // USER DOCUMENTS
  // ═══════════════════════════════════════════════════════════════════════════
  
  getUserDocs() {
    return this.get(CONFIG.storageKeys.userDocs, {});
  },
  
  saveUserDoc(fileName, docInfo) {
    const docs = this.getUserDocs();
    docs[fileName] = {
      ...docInfo,
      updatedAt: Date.now()
    };
    this.set(CONFIG.storageKeys.userDocs, docs);
    return docs;
  },
  
  removeUserDoc(fileName) {
    const docs = this.getUserDocs();
    delete docs[fileName];
    this.set(CONFIG.storageKeys.userDocs, docs);
    return docs;
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // BACKUP
  // ═══════════════════════════════════════════════════════════════════════════
  
  createBackupData() {
    return {
      version: CONFIG.version,
      created: new Date().toISOString(),
      data: {
        favorites: this.getFavorites(),
        history: this.getHistory(),
        settings: this.getSettings(),
        userDocs: this.getUserDocs()
      }
    };
  },
  
  restoreBackupData(backup) {
    if (!backup.version || !backup.data) {
      throw new Error('Ungültiges Backup-Format');
    }
    
    if (backup.data.favorites) {
      this.set(CONFIG.storageKeys.favorites, backup.data.favorites);
    }
    if (backup.data.history) {
      this.set(CONFIG.storageKeys.history, backup.data.history);
    }
    if (backup.data.settings) {
      this.set(CONFIG.storageKeys.settings, backup.data.settings);
    }
    if (backup.data.userDocs) {
      this.set(CONFIG.storageKeys.userDocs, backup.data.userDocs);
    }
    
    return true;
  },
  
  getLastBackup() {
    return this.get(CONFIG.storageKeys.lastBackup, null);
  },
  
  setLastBackup() {
    return this.set(CONFIG.storageKeys.lastBackup, new Date().toISOString());
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // CLEAR ALL
  // ═══════════════════════════════════════════════════════════════════════════
  
  clearAll() {
    Object.values(CONFIG.storageKeys).forEach(key => {
      this.remove(key);
    });
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // EXPORT / IMPORT
  // ═══════════════════════════════════════════════════════════════════════════
  
  exportAllData() {
    return this.createBackupData();
  },

  importAllData(data) {
    return this.restoreBackupData(data);
  },

  // Alias für saveUserDoc (Mehrzahl-Variante)
  saveUserDocs(fileName, docInfo) {
    return this.saveUserDoc(fileName, docInfo);
  }
};
