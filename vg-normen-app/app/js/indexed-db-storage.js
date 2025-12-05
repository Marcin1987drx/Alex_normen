// ═══════════════════════════════════════════════════════════════════════════════
// VG-NORMEN WISSENSSYSTEM - INDEXEDDB STORAGE
// Trwały magazyn danych bez limitów localStorage (100-500 MB+)
// ═══════════════════════════════════════════════════════════════════════════════

const IndexedDBStorage = {
  
  DB_NAME: 'VGNormenDB',
  DB_VERSION: 1,
  db: null,
  
  // Store names
  STORES: {
    DOCUMENTS: 'documents',      // Zaimportowane dokumenty (tekst + metadane)
    FILES: 'files',              // Oryginalne pliki binarne (PDF, DOCX, obrazy)
    SETTINGS: 'settings',        // Ustawienia użytkownika
    FAVORITES: 'favorites',      // Ulubione
    HISTORY: 'history',          // Historia przeglądania
    NOTES: 'notes'               // Notatki użytkownika
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // INICJALIZACJA
  // ═══════════════════════════════════════════════════════════════════════════
  
  async init() {
    if (this.db) return this.db;
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
      
      request.onerror = (event) => {
        console.error('❌ IndexedDB Fehler:', event.target.error);
        reject(event.target.error);
      };
      
      request.onsuccess = (event) => {
        this.db = event.target.result;
        console.log('✅ IndexedDB bereit (VGNormenDB)');
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        console.log('📦 IndexedDB wird erstellt/aktualisiert...');
        
        // Store: documents (zaimportowane dokumenty)
        if (!db.objectStoreNames.contains(this.STORES.DOCUMENTS)) {
          const docStore = db.createObjectStore(this.STORES.DOCUMENTS, { keyPath: 'id' });
          docStore.createIndex('title', 'title', { unique: false });
          docStore.createIndex('category', 'category', { unique: false });
          docStore.createIndex('importDate', 'importDate', { unique: false });
          docStore.createIndex('tags', 'tags', { unique: false, multiEntry: true });
        }
        
        // Store: files (binarne pliki)
        if (!db.objectStoreNames.contains(this.STORES.FILES)) {
          const fileStore = db.createObjectStore(this.STORES.FILES, { keyPath: 'id' });
          fileStore.createIndex('documentId', 'documentId', { unique: false });
          fileStore.createIndex('filename', 'filename', { unique: false });
          fileStore.createIndex('mimeType', 'mimeType', { unique: false });
        }
        
        // Store: settings
        if (!db.objectStoreNames.contains(this.STORES.SETTINGS)) {
          db.createObjectStore(this.STORES.SETTINGS, { keyPath: 'key' });
        }
        
        // Store: favorites
        if (!db.objectStoreNames.contains(this.STORES.FAVORITES)) {
          const favStore = db.createObjectStore(this.STORES.FAVORITES, { keyPath: 'id' });
          favStore.createIndex('addedDate', 'addedDate', { unique: false });
        }
        
        // Store: history
        if (!db.objectStoreNames.contains(this.STORES.HISTORY)) {
          const histStore = db.createObjectStore(this.STORES.HISTORY, { keyPath: 'id', autoIncrement: true });
          histStore.createIndex('itemId', 'itemId', { unique: false });
          histStore.createIndex('viewedAt', 'viewedAt', { unique: false });
        }
        
        // Store: notes
        if (!db.objectStoreNames.contains(this.STORES.NOTES)) {
          const noteStore = db.createObjectStore(this.STORES.NOTES, { keyPath: 'id' });
          noteStore.createIndex('documentId', 'documentId', { unique: false });
          noteStore.createIndex('createdAt', 'createdAt', { unique: false });
        }
        
        console.log('✅ IndexedDB Stores erstellt');
      };
    });
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // DOKUMENTY - CRUD
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Zapisuje dokument (tekst + metadane)
   */
  async saveDocument(document) {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.DOCUMENTS], 'readwrite');
      const store = transaction.objectStore(this.STORES.DOCUMENTS);
      
      // Dodaj timestamp jeśli nowy
      if (!document.id) {
        document.id = Date.now();
        document.importDate = new Date().toISOString();
      }
      document.lastModified = new Date().toISOString();
      
      const request = store.put(document);
      
      request.onsuccess = () => {
        console.log(`💾 Dokument gespeichert: ${document.title}`);
        resolve(document);
      };
      
      request.onerror = () => {
        console.error('❌ Fehler beim Speichern:', request.error);
        reject(request.error);
      };
    });
  },
  
  /**
   * Pobiera dokument po ID
   */
  async getDocument(id) {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.DOCUMENTS], 'readonly');
      const store = transaction.objectStore(this.STORES.DOCUMENTS);
      const request = store.get(id);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },
  
  /**
   * Pobiera wszystkie dokumenty
   */
  async getAllDocuments() {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.DOCUMENTS], 'readonly');
      const store = transaction.objectStore(this.STORES.DOCUMENTS);
      const request = store.getAll();
      
      request.onsuccess = () => {
        // Sortuj po dacie (najnowsze pierwsze)
        const docs = request.result.sort((a, b) => 
          new Date(b.importDate) - new Date(a.importDate)
        );
        resolve(docs);
      };
      request.onerror = () => reject(request.error);
    });
  },
  
  /**
   * Usuwa dokument
   */
  async deleteDocument(id) {
    await this.init();
    
    // Usuń dokument
    await new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.DOCUMENTS], 'readwrite');
      const store = transaction.objectStore(this.STORES.DOCUMENTS);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
    
    // Usuń powiązany plik
    await this.deleteFile(id);
    
    console.log(`🗑️ Dokument gelöscht: ${id}`);
  },
  
  /**
   * Wyszukuje dokumenty
   */
  async searchDocuments(query) {
    const docs = await this.getAllDocuments();
    const lowerQuery = query.toLowerCase();
    
    return docs.filter(doc => 
      doc.title?.toLowerCase().includes(lowerQuery) ||
      doc.content?.toLowerCase().includes(lowerQuery) ||
      doc.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  },
  
  /**
   * Pobiera dokumenty po kategorii
   */
  async getDocumentsByCategory(category) {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.DOCUMENTS], 'readonly');
      const store = transaction.objectStore(this.STORES.DOCUMENTS);
      const index = store.index('category');
      const request = index.getAll(category);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // PLIKI BINARNE (PDF, DOCX, obrazy)
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Zapisuje plik binarny (ArrayBuffer/Blob)
   */
  async saveFile(documentId, file, metadata = {}) {
    await this.init();
    
    // Konwertuj File na ArrayBuffer
    let fileData;
    if (file instanceof File || file instanceof Blob) {
      fileData = await file.arrayBuffer();
    } else if (file instanceof ArrayBuffer) {
      fileData = file;
    } else {
      throw new Error('Nieobsługiwany typ pliku');
    }
    
    const fileRecord = {
      id: documentId, // Ten sam ID co dokument
      documentId: documentId,
      filename: metadata.filename || file.name || 'unknown',
      mimeType: metadata.mimeType || file.type || 'application/octet-stream',
      size: fileData.byteLength,
      data: fileData, // ArrayBuffer
      savedAt: new Date().toISOString()
    };
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.FILES], 'readwrite');
      const store = transaction.objectStore(this.STORES.FILES);
      const request = store.put(fileRecord);
      
      request.onsuccess = () => {
        console.log(`📁 Datei gespeichert: ${fileRecord.filename} (${this.formatSize(fileRecord.size)})`);
        resolve(fileRecord);
      };
      
      request.onerror = () => {
        console.error('❌ Fehler beim Speichern der Datei:', request.error);
        reject(request.error);
      };
    });
  },
  
  /**
   * Pobiera plik binarny
   */
  async getFile(documentId) {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.FILES], 'readonly');
      const store = transaction.objectStore(this.STORES.FILES);
      const request = store.get(documentId);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },
  
  /**
   * Pobiera plik jako Blob (do pobrania/wyświetlenia)
   */
  async getFileAsBlob(documentId) {
    const fileRecord = await this.getFile(documentId);
    if (!fileRecord) return null;
    
    return new Blob([fileRecord.data], { type: fileRecord.mimeType });
  },
  
  /**
   * Pobiera plik jako URL (do wyświetlenia w iframe/img)
   */
  async getFileAsURL(documentId) {
    const blob = await this.getFileAsBlob(documentId);
    if (!blob) return null;
    
    return URL.createObjectURL(blob);
  },
  
  /**
   * Usuwa plik
   */
  async deleteFile(documentId) {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.FILES], 'readwrite');
      const store = transaction.objectStore(this.STORES.FILES);
      const request = store.delete(documentId);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // USTAWIENIA
  // ═══════════════════════════════════════════════════════════════════════════
  
  async saveSetting(key, value) {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.SETTINGS], 'readwrite');
      const store = transaction.objectStore(this.STORES.SETTINGS);
      const request = store.put({ key, value, updatedAt: new Date().toISOString() });
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },
  
  async getSetting(key, defaultValue = null) {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.SETTINGS], 'readonly');
      const store = transaction.objectStore(this.STORES.SETTINGS);
      const request = store.get(key);
      
      request.onsuccess = () => {
        resolve(request.result?.value ?? defaultValue);
      };
      request.onerror = () => reject(request.error);
    });
  },
  
  async getAllSettings() {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.SETTINGS], 'readonly');
      const store = transaction.objectStore(this.STORES.SETTINGS);
      const request = store.getAll();
      
      request.onsuccess = () => {
        const settings = {};
        request.result.forEach(item => {
          settings[item.key] = item.value;
        });
        resolve(settings);
      };
      request.onerror = () => reject(request.error);
    });
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // ULUBIONE
  // ═══════════════════════════════════════════════════════════════════════════
  
  async addFavorite(item) {
    await this.init();
    
    const favorite = {
      ...item,
      id: item.id,
      addedDate: new Date().toISOString()
    };
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.FAVORITES], 'readwrite');
      const store = transaction.objectStore(this.STORES.FAVORITES);
      const request = store.put(favorite);
      
      request.onsuccess = () => resolve(favorite);
      request.onerror = () => reject(request.error);
    });
  },
  
  async removeFavorite(id) {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.FAVORITES], 'readwrite');
      const store = transaction.objectStore(this.STORES.FAVORITES);
      const request = store.delete(id);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },
  
  async getAllFavorites() {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.FAVORITES], 'readonly');
      const store = transaction.objectStore(this.STORES.FAVORITES);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },
  
  async isFavorite(id) {
    const fav = await this.getFavorite(id);
    return !!fav;
  },
  
  async getFavorite(id) {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.FAVORITES], 'readonly');
      const store = transaction.objectStore(this.STORES.FAVORITES);
      const request = store.get(id);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // HISTORIA
  // ═══════════════════════════════════════════════════════════════════════════
  
  async addToHistory(item) {
    await this.init();
    
    const historyItem = {
      itemId: item.id,
      title: item.title,
      type: item.type,
      icon: item.icon,
      viewedAt: new Date().toISOString()
    };
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.HISTORY], 'readwrite');
      const store = transaction.objectStore(this.STORES.HISTORY);
      const request = store.add(historyItem);
      
      request.onsuccess = () => {
        // Ogranicz historię do 100 wpisów
        this.trimHistory(100);
        resolve(historyItem);
      };
      request.onerror = () => reject(request.error);
    });
  },
  
  async getHistory(limit = 50) {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.HISTORY], 'readonly');
      const store = transaction.objectStore(this.STORES.HISTORY);
      const index = store.index('viewedAt');
      const request = index.openCursor(null, 'prev'); // Od najnowszych
      
      const results = [];
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor && results.length < limit) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      request.onerror = () => reject(request.error);
    });
  },
  
  async clearHistory() {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.HISTORY], 'readwrite');
      const store = transaction.objectStore(this.STORES.HISTORY);
      const request = store.clear();
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },
  
  async trimHistory(maxItems) {
    const history = await this.getHistory(maxItems + 100);
    if (history.length <= maxItems) return;
    
    // Usuń stare wpisy
    const toDelete = history.slice(maxItems);
    const transaction = this.db.transaction([this.STORES.HISTORY], 'readwrite');
    const store = transaction.objectStore(this.STORES.HISTORY);
    
    toDelete.forEach(item => {
      store.delete(item.id);
    });
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // NOTATKI
  // ═══════════════════════════════════════════════════════════════════════════
  
  async saveNote(note) {
    await this.init();
    
    if (!note.id) {
      note.id = Date.now();
      note.createdAt = new Date().toISOString();
    }
    note.updatedAt = new Date().toISOString();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.NOTES], 'readwrite');
      const store = transaction.objectStore(this.STORES.NOTES);
      const request = store.put(note);
      
      request.onsuccess = () => resolve(note);
      request.onerror = () => reject(request.error);
    });
  },
  
  async getNotesByDocument(documentId) {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.NOTES], 'readonly');
      const store = transaction.objectStore(this.STORES.NOTES);
      const index = store.index('documentId');
      const request = index.getAll(documentId);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },
  
  async deleteNote(id) {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.NOTES], 'readwrite');
      const store = transaction.objectStore(this.STORES.NOTES);
      const request = store.delete(id);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // BACKUP & EXPORT
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Eksportuje wszystkie dane do JSON (bez plików binarnych)
   */
  async exportData() {
    const data = {
      version: '2.0',
      exportDate: new Date().toISOString(),
      documents: await this.getAllDocuments(),
      favorites: await this.getAllFavorites(),
      history: await this.getHistory(1000),
      settings: await this.getAllSettings()
    };
    
    return JSON.stringify(data, null, 2);
  },
  
  /**
   * Eksportuje wszystkie dane WŁĄCZNIE z plikami (duży plik!)
   */
  async exportFullBackup() {
    await this.init();
    
    const documents = await this.getAllDocuments();
    const files = await new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.FILES], 'readonly');
      const store = transaction.objectStore(this.STORES.FILES);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    
    // Konwertuj ArrayBuffer na Base64 dla JSON
    const filesWithBase64 = files.map(f => ({
      ...f,
      data: this.arrayBufferToBase64(f.data)
    }));
    
    const backup = {
      version: '2.0-full',
      exportDate: new Date().toISOString(),
      documents: documents,
      files: filesWithBase64,
      favorites: await this.getAllFavorites(),
      history: await this.getHistory(1000),
      settings: await this.getAllSettings()
    };
    
    return JSON.stringify(backup);
  },
  
  /**
   * Importuje dane z JSON
   */
  async importData(jsonString) {
    const data = JSON.parse(jsonString);
    
    console.log(`📥 Importiere Backup v${data.version} vom ${data.exportDate}...`);
    
    // Dokumenty
    if (data.documents) {
      for (const doc of data.documents) {
        await this.saveDocument(doc);
      }
      console.log(`   ✅ ${data.documents.length} Dokumente importiert`);
    }
    
    // Pliki (jeśli backup pełny)
    if (data.files) {
      for (const file of data.files) {
        // Konwertuj Base64 z powrotem na ArrayBuffer
        file.data = this.base64ToArrayBuffer(file.data);
        await new Promise((resolve, reject) => {
          const transaction = this.db.transaction([this.STORES.FILES], 'readwrite');
          const store = transaction.objectStore(this.STORES.FILES);
          const request = store.put(file);
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      }
      console.log(`   ✅ ${data.files.length} Dateien importiert`);
    }
    
    // Ulubione
    if (data.favorites) {
      for (const fav of data.favorites) {
        await this.addFavorite(fav);
      }
      console.log(`   ✅ ${data.favorites.length} Favoriten importiert`);
    }
    
    // Ustawienia
    if (data.settings) {
      for (const [key, value] of Object.entries(data.settings)) {
        await this.saveSetting(key, value);
      }
      console.log(`   ✅ Einstellungen importiert`);
    }
    
    console.log('✅ Import abgeschlossen!');
    return true;
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // MIGRACJA Z LOCALSTORAGE
  // ═══════════════════════════════════════════════════════════════════════════
  
  async migrateFromLocalStorage() {
    console.log('🔄 Prüfe localStorage auf alte Daten...');
    
    let migrated = false;
    
    // Migruj importedDocuments
    try {
      const oldDocs = localStorage.getItem('importedDocuments');
      if (oldDocs) {
        const docs = JSON.parse(oldDocs);
        for (const doc of docs) {
          await this.saveDocument(doc);
        }
        console.log(`   ✅ ${docs.length} Dokumente aus localStorage migriert`);
        localStorage.removeItem('importedDocuments');
        migrated = true;
      }
    } catch (e) {
      console.warn('Migration importedDocuments fehlgeschlagen:', e);
    }
    
    // Migruj favorites
    try {
      const oldFavs = localStorage.getItem('vg_favorites');
      if (oldFavs) {
        const favs = JSON.parse(oldFavs);
        for (const fav of favs) {
          await this.addFavorite(fav);
        }
        console.log(`   ✅ ${favs.length} Favoriten migriert`);
        localStorage.removeItem('vg_favorites');
        migrated = true;
      }
    } catch (e) {
      console.warn('Migration favorites fehlgeschlagen:', e);
    }
    
    // Migruj history
    try {
      const oldHistory = localStorage.getItem('vg_history');
      if (oldHistory) {
        const history = JSON.parse(oldHistory);
        for (const item of history) {
          await this.addToHistory(item);
        }
        console.log(`   ✅ ${history.length} Historie-Einträge migriert`);
        localStorage.removeItem('vg_history');
        migrated = true;
      }
    } catch (e) {
      console.warn('Migration history fehlgeschlagen:', e);
    }
    
    // Migruj settings
    try {
      const oldSettings = localStorage.getItem('vg_settings');
      if (oldSettings) {
        const settings = JSON.parse(oldSettings);
        for (const [key, value] of Object.entries(settings)) {
          await this.saveSetting(key, value);
        }
        console.log(`   ✅ Einstellungen migriert`);
        localStorage.removeItem('vg_settings');
        migrated = true;
      }
    } catch (e) {
      console.warn('Migration settings fehlgeschlagen:', e);
    }
    
    if (migrated) {
      console.log('✅ Migration von localStorage abgeschlossen!');
    } else {
      console.log('ℹ️ Keine alten Daten in localStorage gefunden');
    }
    
    return migrated;
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // STATYSTYKI
  // ═══════════════════════════════════════════════════════════════════════════
  
  async getStorageStats() {
    await this.init();
    
    const stats = {
      documents: 0,
      files: 0,
      totalSize: 0,
      favorites: 0,
      historyItems: 0
    };
    
    // Dokumenty
    const docs = await this.getAllDocuments();
    stats.documents = docs.length;
    stats.totalSize += docs.reduce((sum, d) => sum + (d.content?.length || 0), 0);
    
    // Pliki
    const files = await new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.FILES], 'readonly');
      const store = transaction.objectStore(this.STORES.FILES);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    stats.files = files.length;
    stats.totalSize += files.reduce((sum, f) => sum + (f.size || 0), 0);
    
    // Ulubione
    stats.favorites = (await this.getAllFavorites()).length;
    
    // Historia
    stats.historyItems = (await this.getHistory(10000)).length;
    
    return stats;
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // HELPER
  // ═══════════════════════════════════════════════════════════════════════════
  
  formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  },
  
  arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  },
  
  base64ToArrayBuffer(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  },
  
  /**
   * Czyści wszystkie dane (OSTROŻNIE!)
   */
  async clearAllData() {
    await this.init();
    
    const stores = Object.values(this.STORES);
    
    for (const storeName of stores) {
      await new Promise((resolve, reject) => {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
    
    console.log('🗑️ Alle IndexedDB-Daten gelöscht');
  }
};

// Auto-init przy ładowaniu
if (typeof window !== 'undefined') {
  window.IndexedDBStorage = IndexedDBStorage;
  
  // Zainicjuj i zmigruj przy starcie
  IndexedDBStorage.init().then(() => {
    IndexedDBStorage.migrateFromLocalStorage();
  });
}
