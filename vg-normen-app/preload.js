const { contextBridge, ipcRenderer } = require('electron');

// Sichere API für die Web-App bereitstellen
contextBridge.exposeInMainWorld('electronAPI', {
  
  // ═══════════════════════════════════════════════════════════════════════════
  // DATEISYSTEM
  // ═══════════════════════════════════════════════════════════════════════════
  
  // Dokumente-Ordner scannen
  scanDocumentsFolder: () => ipcRenderer.invoke('scan-documents-folder'),
  
  // Datei lesen (binär als base64)
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  
  // Textdatei lesen
  readTextFile: (filePath) => ipcRenderer.invoke('read-text-file', filePath),
  
  // Datei öffnen Dialog
  openFileDialog: (options) => ipcRenderer.invoke('open-file-dialog', options),
  
  // Datei in Dokumente kopieren
  copyFileToDocuments: (sourcePath, newName) => ipcRenderer.invoke('copy-file-to-documents', sourcePath, newName),
  
  // Datei umbenennen
  renameFile: (oldPath, newName) => ipcRenderer.invoke('rename-file', oldPath, newName),
  
  // Datei löschen
  deleteFile: (filePath) => ipcRenderer.invoke('delete-file', filePath),
  
  // Dokumente-Ordner im Explorer öffnen
  openDocumentsFolder: () => ipcRenderer.invoke('open-documents-folder'),
  
  // ═══════════════════════════════════════════════════════════════════════════
  // DRUCKEN
  // ═══════════════════════════════════════════════════════════════════════════
  
  // Seite drucken
  printPage: (options) => ipcRenderer.invoke('print-page', options),
  
  // Als PDF speichern
  saveAsPdf: (fileName) => ipcRenderer.invoke('save-as-pdf', fileName),
  
  // ═══════════════════════════════════════════════════════════════════════════
  // BACKUP
  // ═══════════════════════════════════════════════════════════════════════════
  
  // Backup speichern
  saveBackup: (data) => ipcRenderer.invoke('save-backup', data),
  
  // Backup laden
  loadBackup: () => ipcRenderer.invoke('load-backup'),
  
  // ═══════════════════════════════════════════════════════════════════════════
  // APP INFO
  // ═══════════════════════════════════════════════════════════════════════════
  
  getAppInfo: () => ipcRenderer.invoke('get-app-info'),
  
  // Flag: Wir laufen in Electron
  isElectron: true
});
