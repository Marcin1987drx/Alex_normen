/**
 * Document Importer - Universelles Import-System
 * Unterstützt: PDF, DOCX, JPEG, PNG, MD, TXT
 * Mit OCR für gescannte Dokumente
 */

class DocumentImporter {
    constructor() {
        this.supportedFormats = {
            'application/pdf': { name: 'PDF', handler: 'parsePDF', icon: '📄' },
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { name: 'DOCX', handler: 'parseDOCX', icon: '📝' },
            'application/msword': { name: 'DOC', handler: 'parseDOCX', icon: '📝' },
            'image/jpeg': { name: 'JPEG', handler: 'parseImage', icon: '🖼️' },
            'image/png': { name: 'PNG', handler: 'parseImage', icon: '🖼️' },
            'image/tiff': { name: 'TIFF', handler: 'parseImage', icon: '🖼️' },
            'text/markdown': { name: 'Markdown', handler: 'parseMarkdown', icon: '📋' },
            'text/plain': { name: 'Text', handler: 'parseText', icon: '📃' }
        };
        
        this.categories = [
            { id: 'normen', name: 'VG-Normen', icon: '📐' },
            { id: 'anleitungen', name: 'Arbeitsanweisungen', icon: '📖' },
            { id: 'spezifikationen', name: 'Spezifikationen', icon: '📋' },
            { id: 'pruefvorschriften', name: 'Prüfvorschriften', icon: '✅' },
            { id: 'zeichnungen', name: 'Technische Zeichnungen', icon: '📐' },
            { id: 'formulare', name: 'Formulare & Checklisten', icon: '📝' },
            { id: 'schulung', name: 'Schulungsmaterial', icon: '🎓' },
            { id: 'sonstiges', name: 'Sonstige Dokumente', icon: '📁' }
        ];
        
        this.importedDocuments = this.loadImportedDocuments();
        this.tesseractWorker = null;
        this.isProcessing = false;
    }

    /**
     * Lädt importierte Dokumente aus localStorage
     */
    loadImportedDocuments() {
        try {
            const saved = localStorage.getItem('importedDocuments');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('Fehler beim Laden der Dokumente:', e);
            return [];
        }
    }

    /**
     * Speichert Dokumente in localStorage
     */
    saveImportedDocuments() {
        try {
            localStorage.setItem('importedDocuments', JSON.stringify(this.importedDocuments));
        } catch (e) {
            console.error('Fehler beim Speichern:', e);
        }
    }

    /**
     * Rendert die Import-Seite
     */
    renderImportPage() {
        return `
            <div class="import-container">
                <div class="import-header">
                    <h1>📥 Dokument-Import</h1>
                    <p class="import-subtitle">Importieren Sie Dokumente in verschiedenen Formaten</p>
                </div>

                <!-- Drag & Drop Zone -->
                <div class="drop-zone" id="dropZone">
                    <div class="drop-zone-content">
                        <div class="drop-icon">📁</div>
                        <h3>Datei hier ablegen</h3>
                        <p>oder klicken zum Auswählen</p>
                        <div class="supported-formats">
                            <span class="format-badge">PDF</span>
                            <span class="format-badge">DOCX</span>
                            <span class="format-badge">JPEG</span>
                            <span class="format-badge">PNG</span>
                            <span class="format-badge">MD</span>
                            <span class="format-badge">TXT</span>
                        </div>
                    </div>
                    <input type="file" id="fileInput" accept=".pdf,.docx,.doc,.jpg,.jpeg,.png,.tiff,.md,.txt" hidden>
                </div>

                <!-- Processing Status -->
                <div class="processing-status" id="processingStatus" style="display: none;">
                    <div class="processing-spinner"></div>
                    <p id="processingText">Verarbeite Dokument...</p>
                    <div class="progress-bar">
                        <div class="progress-fill" id="progressFill"></div>
                    </div>
                </div>

                <!-- Preview Section -->
                <div class="preview-section" id="previewSection" style="display: none;">
                    <h2>📋 Vorschau</h2>
                    
                    <div class="preview-meta">
                        <div class="meta-item">
                            <label>Dateiname:</label>
                            <span id="previewFilename"></span>
                        </div>
                        <div class="meta-item">
                            <label>Format:</label>
                            <span id="previewFormat"></span>
                        </div>
                        <div class="meta-item">
                            <label>Größe:</label>
                            <span id="previewSize"></span>
                        </div>
                    </div>

                    <div class="preview-form">
                        <div class="form-group">
                            <label for="docTitle">Titel des Dokuments:</label>
                            <input type="text" id="docTitle" class="form-input" placeholder="z.B. VG 95218-20 Spezifikation">
                        </div>

                        <div class="form-group">
                            <label for="docCategory">Kategorie:</label>
                            <select id="docCategory" class="form-select">
                                ${this.categories.map(cat => 
                                    `<option value="${cat.id}">${cat.icon} ${cat.name}</option>`
                                ).join('')}
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="docTags">Schlagwörter (kommagetrennt):</label>
                            <input type="text" id="docTags" class="form-input" placeholder="z.B. Draht, Kupfer, AWG">
                        </div>

                        <div class="form-group">
                            <label>Extrahierter Inhalt:</label>
                            <textarea id="docContent" class="form-textarea" rows="10"></textarea>
                        </div>
                    </div>

                    <div class="preview-actions">
                        <button class="btn btn-secondary" onclick="documentImporter.cancelImport()">
                            ❌ Abbrechen
                        </button>
                        <button class="btn btn-primary" onclick="documentImporter.saveDocument()">
                            💾 Speichern
                        </button>
                    </div>
                </div>

                <!-- Imported Documents List -->
                <div class="imported-docs-section">
                    <h2>📚 Importierte Dokumente (${this.importedDocuments.length})</h2>
                    
                    ${this.importedDocuments.length === 0 ? `
                        <div class="empty-state">
                            <p>Noch keine Dokumente importiert</p>
                        </div>
                    ` : `
                        <div class="docs-filter">
                            <input type="text" id="docsSearch" class="form-input" placeholder="🔍 Dokumente suchen...">
                            <select id="docsFilter" class="form-select">
                                <option value="">Alle Kategorien</option>
                                ${this.categories.map(cat => 
                                    `<option value="${cat.id}">${cat.name}</option>`
                                ).join('')}
                            </select>
                        </div>
                        
                        <div class="docs-grid" id="docsGrid">
                            ${this.renderDocumentCards()}
                        </div>
                    `}
                </div>
            </div>
        `;
    }

    /**
     * Rendert die Dokumentkarten
     */
    renderDocumentCards() {
        return this.importedDocuments.map((doc, index) => {
            const category = this.categories.find(c => c.id === doc.category) || { icon: '📁', name: 'Sonstige' };
            return `
                <div class="doc-card" data-category="${doc.category}" data-index="${index}">
                    <div class="doc-card-header">
                        <span class="doc-icon">${doc.formatIcon || '📄'}</span>
                        <span class="doc-category">${category.icon} ${category.name}</span>
                    </div>
                    <h3 class="doc-title">${doc.title}</h3>
                    <p class="doc-date">Importiert: ${new Date(doc.importDate).toLocaleDateString('de-DE')}</p>
                    <div class="doc-tags">
                        ${(doc.tags || []).slice(0, 3).map(tag => 
                            `<span class="tag">${tag}</span>`
                        ).join('')}
                    </div>
                    <div class="doc-actions">
                        <button class="btn-icon" onclick="documentImporter.viewDocument(${index})" title="Anzeigen">
                            👁️
                        </button>
                        <button class="btn-icon" onclick="documentImporter.editDocument(${index})" title="Bearbeiten">
                            ✏️
                        </button>
                        <button class="btn-icon btn-danger" onclick="documentImporter.deleteDocument(${index})" title="Löschen">
                            🗑️
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Initialisiert Event-Listener
     */
    initializeEventListeners() {
        const dropZone = document.getElementById('dropZone');
        const fileInput = document.getElementById('fileInput');
        const docsSearch = document.getElementById('docsSearch');
        const docsFilter = document.getElementById('docsFilter');

        if (dropZone) {
            // Drag & Drop Events
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('drag-over');
            });

            dropZone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                dropZone.classList.remove('drag-over');
            });

            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('drag-over');
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    this.processFile(files[0]);
                }
            });

            dropZone.addEventListener('click', () => {
                fileInput.click();
            });
        }

        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.processFile(e.target.files[0]);
                }
            });
        }

        // Such- und Filterevents
        if (docsSearch) {
            docsSearch.addEventListener('input', () => this.filterDocuments());
        }
        if (docsFilter) {
            docsFilter.addEventListener('change', () => this.filterDocuments());
        }
    }

    /**
     * Verarbeitet eine Datei
     */
    async processFile(file) {
        if (this.isProcessing) {
            alert('Ein Dokument wird bereits verarbeitet. Bitte warten...');
            return;
        }

        this.isProcessing = true;
        this.currentFile = file;

        // UI aktualisieren
        document.getElementById('processingStatus').style.display = 'block';
        document.getElementById('previewSection').style.display = 'none';
        
        const formatInfo = this.supportedFormats[file.type] || { name: 'Unbekannt', handler: 'parseText', icon: '📄' };
        
        try {
            this.updateProgress(10, `${formatInfo.icon} ${formatInfo.name} erkannt...`);
            
            let content = '';
            
            // Je nach Format verarbeiten
            switch (formatInfo.handler) {
                case 'parsePDF':
                    content = await this.parsePDF(file);
                    break;
                case 'parseDOCX':
                    content = await this.parseDOCX(file);
                    break;
                case 'parseImage':
                    content = await this.parseImage(file);
                    break;
                case 'parseMarkdown':
                case 'parseText':
                    content = await this.parseText(file);
                    break;
                default:
                    content = await this.parseText(file);
            }

            this.updateProgress(100, 'Verarbeitung abgeschlossen!');
            
            // Vorschau anzeigen
            setTimeout(() => {
                this.showPreview(file, formatInfo, content);
            }, 500);

        } catch (error) {
            console.error('Fehler bei der Verarbeitung:', error);
            alert(`Fehler bei der Verarbeitung: ${error.message}`);
            document.getElementById('processingStatus').style.display = 'none';
        }
        
        this.isProcessing = false;
    }

    /**
     * Aktualisiert den Fortschrittsbalken
     */
    updateProgress(percent, text) {
        document.getElementById('progressFill').style.width = `${percent}%`;
        document.getElementById('processingText').textContent = text;
    }

    /**
     * PDF parsing mit pdf-parse (Node) oder pdf.js (Browser)
     */
    async parsePDF(file) {
        this.updateProgress(30, 'PDF wird analysiert...');
        
        // Browser-Umgebung: Verwende pdf.js
        if (typeof window !== 'undefined' && window.pdfjsLib) {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await window.pdfjsLib.getDocument(arrayBuffer).promise;
            let text = '';
            
            for (let i = 1; i <= pdf.numPages; i++) {
                this.updateProgress(30 + (60 * i / pdf.numPages), `Seite ${i}/${pdf.numPages}...`);
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                text += content.items.map(item => item.str).join(' ') + '\n\n';
            }
            
            return text.trim() || '[PDF enthält keinen extrahierbaren Text - möglicherweise gescannt. Bitte manuell eingeben.]';
        }
        
        // Electron/Node: Verwende pdf-parse
        if (typeof require !== 'undefined') {
            try {
                const pdfParse = require('pdf-parse');
                const buffer = await file.arrayBuffer();
                const data = await pdfParse(Buffer.from(buffer));
                return data.text || '[Kein Text extrahiert]';
            } catch (e) {
                console.error('pdf-parse error:', e);
            }
        }
        
        return '[PDF-Verarbeitung nicht verfügbar. Text bitte manuell eingeben.]';
    }

    /**
     * DOCX parsing mit mammoth
     */
    async parseDOCX(file) {
        this.updateProgress(30, 'Word-Dokument wird analysiert...');
        
        if (typeof require !== 'undefined') {
            try {
                const mammoth = require('mammoth');
                const buffer = await file.arrayBuffer();
                const result = await mammoth.extractRawText({ arrayBuffer: buffer });
                this.updateProgress(90, 'Text extrahiert...');
                return result.value || '[Kein Text extrahiert]';
            } catch (e) {
                console.error('mammoth error:', e);
            }
        }
        
        // Fallback für Browser ohne mammoth
        return '[DOCX-Verarbeitung nicht verfügbar. Text bitte manuell eingeben.]';
    }

    /**
     * Bild-OCR mit Tesseract.js
     */
    async parseImage(file) {
        this.updateProgress(20, 'OCR wird initialisiert...');
        
        if (typeof Tesseract !== 'undefined' || typeof require !== 'undefined') {
            try {
                const Tesseract = typeof require !== 'undefined' ? require('tesseract.js') : window.Tesseract;
                
                this.updateProgress(30, 'Texterkennung läuft (kann 30-60 Sek. dauern)...');
                
                const result = await Tesseract.recognize(file, 'deu+eng', {
                    logger: (m) => {
                        if (m.status === 'recognizing text') {
                            this.updateProgress(30 + (m.progress * 60), `OCR: ${Math.round(m.progress * 100)}%`);
                        }
                    }
                });
                
                return result.data.text || '[Kein Text erkannt]';
            } catch (e) {
                console.error('Tesseract error:', e);
            }
        }
        
        return '[OCR nicht verfügbar. Text bitte manuell eingeben.]';
    }

    /**
     * Text/Markdown parsing
     */
    async parseText(file) {
        this.updateProgress(50, 'Text wird gelesen...');
        return await file.text();
    }

    /**
     * Zeigt die Vorschau an
     */
    showPreview(file, formatInfo, content) {
        document.getElementById('processingStatus').style.display = 'none';
        document.getElementById('previewSection').style.display = 'block';
        
        document.getElementById('previewFilename').textContent = file.name;
        document.getElementById('previewFormat').textContent = `${formatInfo.icon} ${formatInfo.name}`;
        document.getElementById('previewSize').textContent = this.formatFileSize(file.size);
        
        // Titel aus Dateinamen ableiten
        const suggestedTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        document.getElementById('docTitle').value = suggestedTitle;
        
        // Tags aus Inhalt extrahieren (einfache Heuristik)
        const suggestedTags = this.extractTags(content);
        document.getElementById('docTags').value = suggestedTags.join(', ');
        
        document.getElementById('docContent').value = content;
        
        this.currentFileInfo = {
            name: file.name,
            type: file.type,
            size: file.size,
            formatIcon: formatInfo.icon,
            formatName: formatInfo.name
        };
    }

    /**
     * Extrahiert mögliche Tags aus dem Inhalt
     */
    extractTags(content) {
        const tags = [];
        const text = content.toLowerCase();
        
        // VG-Normen erkennen
        const vgMatches = text.match(/vg\s*\d{5}/gi);
        if (vgMatches) {
            tags.push(...[...new Set(vgMatches.map(m => m.toUpperCase().replace(/\s/g, ' ')))].slice(0, 3));
        }
        
        // MIL-SPEC erkennen
        const milMatches = text.match(/mil-[a-z]+-\d+/gi);
        if (milMatches) {
            tags.push(...[...new Set(milMatches.map(m => m.toUpperCase()))].slice(0, 2));
        }
        
        // Technische Begriffe
        const techTerms = ['crimp', 'löten', 'isolierung', 'schirmung', 'stecker', 'kabel', 'draht', 'prüfung', 'hipot'];
        techTerms.forEach(term => {
            if (text.includes(term)) tags.push(term.charAt(0).toUpperCase() + term.slice(1));
        });
        
        return [...new Set(tags)].slice(0, 6);
    }

    /**
     * Speichert das Dokument
     */
    saveDocument() {
        const title = document.getElementById('docTitle').value.trim();
        const category = document.getElementById('docCategory').value;
        const tags = document.getElementById('docTags').value.split(',').map(t => t.trim()).filter(t => t);
        const content = document.getElementById('docContent').value;

        if (!title) {
            alert('Bitte geben Sie einen Titel ein.');
            return;
        }

        const document = {
            id: Date.now(),
            title: title,
            category: category,
            tags: tags,
            content: content,
            filename: this.currentFileInfo.name,
            fileType: this.currentFileInfo.type,
            fileSize: this.currentFileInfo.size,
            formatIcon: this.currentFileInfo.formatIcon,
            formatName: this.currentFileInfo.formatName,
            importDate: new Date().toISOString()
        };

        this.importedDocuments.unshift(document);
        this.saveImportedDocuments();

        // UI zurücksetzen und aktualisieren
        this.cancelImport();
        
        // Benachrichtigung
        this.showNotification(`✅ "${title}" erfolgreich importiert!`);
        
        // Seite neu rendern
        if (typeof renderPage === 'function') {
            renderPage('import');
        } else {
            location.reload();
        }
    }

    /**
     * Bricht den Import ab
     */
    cancelImport() {
        document.getElementById('previewSection').style.display = 'none';
        document.getElementById('processingStatus').style.display = 'none';
        document.getElementById('fileInput').value = '';
        this.currentFile = null;
        this.currentFileInfo = null;
    }

    /**
     * Zeigt ein Dokument an
     */
    viewDocument(index) {
        const doc = this.importedDocuments[index];
        if (!doc) return;

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content modal-large">
                <div class="modal-header">
                    <h2>${doc.formatIcon} ${doc.title}</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</button>
                </div>
                <div class="modal-meta">
                    <span>📁 ${this.categories.find(c => c.id === doc.category)?.name || 'Sonstige'}</span>
                    <span>📅 ${new Date(doc.importDate).toLocaleDateString('de-DE')}</span>
                    <span>📄 ${doc.formatName}</span>
                </div>
                <div class="modal-tags">
                    ${doc.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="modal-body">
                    <pre class="doc-content-view">${this.escapeHtml(doc.content)}</pre>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    /**
     * Bearbeitet ein Dokument
     */
    editDocument(index) {
        const doc = this.importedDocuments[index];
        if (!doc) return;

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content modal-large">
                <div class="modal-header">
                    <h2>✏️ Dokument bearbeiten</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Titel:</label>
                        <input type="text" id="editTitle" class="form-input" value="${this.escapeHtml(doc.title)}">
                    </div>
                    <div class="form-group">
                        <label>Kategorie:</label>
                        <select id="editCategory" class="form-select">
                            ${this.categories.map(cat => 
                                `<option value="${cat.id}" ${doc.category === cat.id ? 'selected' : ''}>${cat.icon} ${cat.name}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Schlagwörter:</label>
                        <input type="text" id="editTags" class="form-input" value="${doc.tags.join(', ')}">
                    </div>
                    <div class="form-group">
                        <label>Inhalt:</label>
                        <textarea id="editContent" class="form-textarea" rows="12">${this.escapeHtml(doc.content)}</textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Abbrechen</button>
                    <button class="btn btn-primary" onclick="documentImporter.saveEdit(${index})">💾 Speichern</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    /**
     * Speichert die Bearbeitung
     */
    saveEdit(index) {
        const doc = this.importedDocuments[index];
        if (!doc) return;

        doc.title = document.getElementById('editTitle').value.trim();
        doc.category = document.getElementById('editCategory').value;
        doc.tags = document.getElementById('editTags').value.split(',').map(t => t.trim()).filter(t => t);
        doc.content = document.getElementById('editContent').value;
        doc.lastModified = new Date().toISOString();

        this.saveImportedDocuments();
        document.querySelector('.modal-overlay').remove();
        
        this.showNotification('✅ Änderungen gespeichert!');
        
        if (typeof renderPage === 'function') {
            renderPage('import');
        }
    }

    /**
     * Löscht ein Dokument
     */
    deleteDocument(index) {
        const doc = this.importedDocuments[index];
        if (!doc) return;

        if (confirm(`Dokument "${doc.title}" wirklich löschen?`)) {
            this.importedDocuments.splice(index, 1);
            this.saveImportedDocuments();
            
            this.showNotification('🗑️ Dokument gelöscht');
            
            if (typeof renderPage === 'function') {
                renderPage('import');
            }
        }
    }

    /**
     * Filtert die Dokumentliste
     */
    filterDocuments() {
        const searchTerm = document.getElementById('docsSearch')?.value.toLowerCase() || '';
        const categoryFilter = document.getElementById('docsFilter')?.value || '';
        const cards = document.querySelectorAll('.doc-card');

        cards.forEach(card => {
            const title = card.querySelector('.doc-title')?.textContent.toLowerCase() || '';
            const tags = card.querySelector('.doc-tags')?.textContent.toLowerCase() || '';
            const category = card.dataset.category;

            const matchesSearch = title.includes(searchTerm) || tags.includes(searchTerm);
            const matchesCategory = !categoryFilter || category === categoryFilter;

            card.style.display = matchesSearch && matchesCategory ? 'block' : 'none';
        });
    }

    /**
     * Zeigt eine Benachrichtigung
     */
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    /**
     * Formatiert Dateigröße
     */
    formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    /**
     * Escaped HTML
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Gibt alle importierten Dokumente zurück (für Suche)
     */
    getDocuments() {
        return this.importedDocuments;
    }

    /**
     * Sucht in importierten Dokumenten
     */
    searchDocuments(query) {
        const lowerQuery = query.toLowerCase();
        return this.importedDocuments.filter(doc => 
            doc.title.toLowerCase().includes(lowerQuery) ||
            doc.content.toLowerCase().includes(lowerQuery) ||
            doc.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
    }
}

// Global instance
const documentImporter = new DocumentImporter();
