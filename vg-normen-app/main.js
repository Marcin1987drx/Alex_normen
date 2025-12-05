const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

// Fenster erstellen
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    icon: path.join(__dirname, 'build/icon.ico'),
    title: 'VG-Normen Wissenssystem',
    backgroundColor: '#f5f5f5',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: false
    }
  });

  // Web-App laden
  mainWindow.loadFile('app/index.html');

  // Menü entfernen (einfacher für Benutzer)
  mainWindow.setMenu(null);

  // DevTools in Entwicklung
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }

  // Fenster-Events
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App starten
app.whenReady().then(() => {
  // Erstelle Dokumentenordner-Struktur beim ersten Start
  initializeAppFolders();
  createWindow();
});

// Beenden wenn alle Fenster geschlossen
app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// DATEISYSTEM-FUNKTIONEN
// ═══════════════════════════════════════════════════════════════════════════════

// Pfad zum user_documents Ordner
function getUserDocumentsPath() {
  if (app.isPackaged) {
    return path.join(path.dirname(app.getPath('exe')), 'VG-Normen-Dokumente');
  } else {
    return path.join(__dirname, 'VG-Normen-Dokumente');
  }
}

// Initialisiere App-Ordnerstruktur beim ersten Start
function initializeAppFolders() {
  const basePath = getUserDocumentsPath();
  
  // Hauptordner und Unterordner erstellen
  const folders = [
    basePath,
    path.join(basePath, '01_Formulare'),
    path.join(basePath, '02_Tabellen'),
    path.join(basePath, '03_Bilder_GutSchlecht'),
    path.join(basePath, '04_Eigene_Dokumente'),
    path.join(basePath, '05_PDF_Normen')
  ];
  
  folders.forEach(folder => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
      console.log('Ordner erstellt:', folder);
    }
  });
  
  // README erstellen
  const readmePath = path.join(basePath, 'LIES_MICH.txt');
  if (!fs.existsSync(readmePath)) {
    const readmeContent = `
═══════════════════════════════════════════════════════════════════════════════
                    VG-NORMEN WISSENSSYSTEM - DOKUMENTENORDNER
═══════════════════════════════════════════════════════════════════════════════

Hier können Sie Ihre eigenen Dokumente ablegen:

📁 01_Formulare
   → Eigene ausgefüllte Formulare und Protokolle

📁 02_Tabellen  
   → Excel-Tabellen, eigene Berechnungen

📁 03_Bilder_GutSchlecht
   → Fotos von Crimpverbindungen für Vergleiche
   → TIPP: Benennen Sie Dateien aussagekräftig!
     ✅ Gut: "Crimp_Kontakt16_1mm2_GUT.jpg"
     ❌ Schlecht: "IMG_4523.jpg"

📁 04_Eigene_Dokumente
   → Sonstige Dokumente, Notizen, Anleitungen

📁 05_PDF_Normen
   → PDF-Versionen der Normen (falls vorhanden)

═══════════════════════════════════════════════════════════════════════════════
TIPPS FÜR DIE SUCHE:
═══════════════════════════════════════════════════════════════════════════════

Die Anwendung kann Ihre Dateien durchsuchen! Damit die Suche gut funktioniert:

1. Verwenden Sie deutsche Fachbegriffe in Dateinamen
2. Trennen Sie Wörter mit Unterstrichen: Crimp_Höhe_Messung.pdf
3. Fügen Sie relevante Normnummern hinzu: VG95319_Kontakt16.pdf

═══════════════════════════════════════════════════════════════════════════════
`;
    fs.writeFileSync(readmePath, readmeContent, 'utf8');
  }
  
  // Beispiel-Hinweise in leeren Ordnern
  const hinweisContent = {
    '01_Formulare': 'Legen Sie hier Ihre ausgefüllten Formulare ab.\nDie Anwendung kann diese Dateien durchsuchen.',
    '02_Tabellen': 'Legen Sie hier Excel-Tabellen und Berechnungen ab.',
    '03_Bilder_GutSchlecht': 'Legen Sie hier Fotos von Crimpverbindungen ab.\n\nWICHTIG: Benennen Sie die Dateien aussagekräftig!\n\nBeispiel: Crimp_GUT_Kontakt16_1mm2.jpg',
    '04_Eigene_Dokumente': 'Legen Sie hier sonstige Dokumente ab.',
    '05_PDF_Normen': 'Legen Sie hier PDF-Versionen der Normen ab.'
  };
  
  Object.entries(hinweisContent).forEach(([folder, content]) => {
    const hinweisPath = path.join(basePath, folder, '_HINWEIS.txt');
    if (!fs.existsSync(hinweisPath)) {
      fs.writeFileSync(hinweisPath, content, 'utf8');
    }
  });
  
  console.log('App-Ordner initialisiert:', basePath);
  return basePath;
}

// Ordner erstellen falls nicht vorhanden
function ensureUserDocumentsFolder() {
  const folderPath = getUserDocumentsPath();
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  return folderPath;
}

// ═══════════════════════════════════════════════════════════════════════════════
// IPC HANDLERS
// ═══════════════════════════════════════════════════════════════════════════════

// Ordner scannen
ipcMain.handle('scan-documents-folder', async () => {
  const folderPath = ensureUserDocumentsFolder();
  
  try {
    const files = fs.readdirSync(folderPath);
    const fileInfos = [];
    
    for (const fileName of files) {
      const filePath = path.join(folderPath, fileName);
      const stats = fs.statSync(filePath);
      
      if (stats.isFile()) {
        const ext = path.extname(fileName).toLowerCase();
        if (['.pdf', '.docx', '.doc', '.txt', '.md', '.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
          fileInfos.push({
            name: fileName,
            path: filePath,
            size: stats.size,
            modified: stats.mtime.toISOString(),
            type: ext.replace('.', '')
          });
        }
      }
    }
    
    return { success: true, files: fileInfos, folderPath: folderPath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Datei lesen
ipcMain.handle('read-file', async (event, filePath) => {
  try {
    const buffer = fs.readFileSync(filePath);
    return { success: true, data: buffer.toString('base64'), size: buffer.length };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Textdatei lesen
ipcMain.handle('read-text-file', async (event, filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return { success: true, content: content };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Datei öffnen Dialog
ipcMain.handle('open-file-dialog', async (event, options = {}) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: options.title || 'Dateien auswählen',
    filters: options.filters || [
      { name: 'Alle unterstützten', extensions: ['pdf', 'docx', 'doc', 'txt', 'md', 'jpg', 'jpeg', 'png'] },
      { name: 'PDF Dokumente', extensions: ['pdf'] },
      { name: 'Word Dokumente', extensions: ['docx', 'doc'] },
      { name: 'Textdateien', extensions: ['txt', 'md'] },
      { name: 'Bilder', extensions: ['jpg', 'jpeg', 'png'] }
    ],
    properties: ['openFile', 'multiSelections']
  });
  
  return result;
});

// Datei in user_documents kopieren
ipcMain.handle('copy-file-to-documents', async (event, sourcePath, newName = null) => {
  const folderPath = ensureUserDocumentsFolder();
  const fileName = newName || path.basename(sourcePath);
  const destPath = path.join(folderPath, fileName);
  
  try {
    fs.copyFileSync(sourcePath, destPath);
    return { success: true, path: destPath, name: fileName };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Datei umbenennen
ipcMain.handle('rename-file', async (event, oldPath, newName) => {
  const folderPath = path.dirname(oldPath);
  const ext = path.extname(oldPath);
  const newFileName = newName.endsWith(ext) ? newName : newName + ext;
  const newPath = path.join(folderPath, newFileName);
  
  try {
    if (fs.existsSync(newPath)) {
      return { success: false, error: 'Eine Datei mit diesem Namen existiert bereits.' };
    }
    fs.renameSync(oldPath, newPath);
    return { success: true, path: newPath, name: newFileName };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Datei löschen
ipcMain.handle('delete-file', async (event, filePath) => {
  try {
    await shell.trashItem(filePath);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// User Documents Ordner öffnen (im Windows Explorer)
ipcMain.handle('open-documents-folder', async () => {
  const folderPath = ensureUserDocumentsFolder();
  shell.openPath(folderPath);
  return { success: true, path: folderPath };
});

// ═══════════════════════════════════════════════════════════════════════════════
// DRUCKEN
// ═══════════════════════════════════════════════════════════════════════════════

ipcMain.handle('print-page', async (event, options = {}) => {
  try {
    mainWindow.webContents.print({
      silent: false,
      printBackground: true,
      ...options
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Als PDF speichern
ipcMain.handle('save-as-pdf', async (event, defaultName = 'dokument') => {
  const result = await dialog.showSaveDialog(mainWindow, {
    title: 'Als PDF speichern',
    defaultPath: defaultName + '.pdf',
    filters: [{ name: 'PDF', extensions: ['pdf'] }]
  });
  
  if (result.canceled) {
    return { success: false, canceled: true };
  }
  
  try {
    const pdfData = await mainWindow.webContents.printToPDF({
      printBackground: true,
      pageSize: 'A4',
      margins: { top: 10, bottom: 10, left: 10, right: 10 }
    });
    
    fs.writeFileSync(result.filePath, pdfData);
    return { success: true, path: result.filePath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// BACKUP / EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

// Backup speichern
ipcMain.handle('save-backup', async (event, backupData) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    title: 'Backup speichern',
    defaultPath: `VG-Normen-Backup_${new Date().toISOString().split('T')[0]}.json`,
    filters: [{ name: 'JSON Backup', extensions: ['json'] }]
  });
  
  if (result.canceled) {
    return { success: false, canceled: true };
  }
  
  try {
    fs.writeFileSync(result.filePath, JSON.stringify(backupData, null, 2), 'utf8');
    return { success: true, path: result.filePath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Backup laden
ipcMain.handle('load-backup', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Backup laden',
    filters: [{ name: 'JSON Backup', extensions: ['json'] }],
    properties: ['openFile']
  });
  
  if (result.canceled || result.filePaths.length === 0) {
    return { success: false, canceled: true };
  }
  
  try {
    const data = fs.readFileSync(result.filePaths[0], 'utf8');
    return { success: true, data: JSON.parse(data) };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// APP INFO
// ═══════════════════════════════════════════════════════════════════════════════

ipcMain.handle('get-app-info', async () => {
  return {
    version: app.getVersion(),
    name: app.getName(),
    isPackaged: app.isPackaged,
    userDocumentsPath: getUserDocumentsPath()
  };
});
